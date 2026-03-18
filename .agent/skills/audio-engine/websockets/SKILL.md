---
name: websockets
description: WebSockets para comunicación en tiempo real en VOZAZI. Use cuando implemente streaming de audio, feedback en vivo, o comunicación bidireccional de baja latencia.
---

# WebSockets Skill

Esta skill proporciona experiencia en WebSockets para comunicación en tiempo real entre el cliente y el audio-engine en VOZAZI.

## Objetivo

Implementar comunicación WebSocket robusta para streaming de audio en tiempo real, feedback inmediato durante práctica vocal, y sincronización de sesiones.

## Instrucciones

### 1. Server-Side: FastAPI WebSockets

```python
# apps/audio-engine/app/ws/session_manager.py
from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List, Optional
import asyncio
import json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SessionConnection:
    """Representa una conexión WebSocket activa"""
    
    def __init__(
        self,
        websocket: WebSocket,
        session_id: str,
        user_id: str,
    ):
        self.websocket = websocket
        self.session_id = session_id
        self.user_id = user_id
        self.connected_at = datetime.utcnow()
        self.last_activity = datetime.utcnow()
        self.audio_chunks_received = 0
        self.is_active = True
    
    async def send(self, data: dict):
        """Enviar mensaje al cliente"""
        await self.websocket.send_json(data)
        self.last_activity = datetime.utcnow()
    
    async def receive(self) -> dict:
        """Recibir mensaje del cliente"""
        data = await self.websocket.receive_json()
        self.last_activity = datetime.utcnow()
        return data
    
    async def close(self, code: int = 1000):
        """Cerrar conexión"""
        self.is_active = False
        await self.websocket.close(code=code)

class SessionManager:
    """Gestor de conexiones WebSocket"""
    
    def __init__(self):
        # session_id -> SessionConnection
        self.active_sessions: Dict[str, SessionConnection] = {}
        # user_id -> List[session_id]
        self.user_sessions: Dict[str, List[str]] = {}
        self._lock = asyncio.Lock()
    
    async def connect(
        self,
        websocket: WebSocket,
        session_id: str,
        user_id: str,
    ) -> SessionConnection:
        """Aceptar nueva conexión"""
        await websocket.accept()
        
        connection = SessionConnection(websocket, session_id, user_id)
        
        async with self._lock:
            self.active_sessions[session_id] = connection
            
            if user_id not in self.user_sessions:
                self.user_sessions[user_id] = []
            self.user_sessions[user_id].append(session_id)
        
        logger.info(f"Client connected: session={session_id}, user={user_id}")
        
        # Enviar confirmación
        await connection.send({
            'type': 'connected',
            'session_id': session_id,
            'timestamp': datetime.utcnow().isoformat(),
        })
        
        return connection
    
    async def disconnect(self, session_id: str):
        """Cerrar conexión"""
        async with self._lock:
            if session_id in self.active_sessions:
                connection = self.active_sessions[session_id]
                await connection.close()
                
                # Limpiar user_sessions
                if connection.user_id in self.user_sessions:
                    sessions = self.user_sessions[connection.user_id]
                    if session_id in sessions:
                        sessions.remove(session_id)
                    if not sessions:
                        del self.user_sessions[connection.user_id]
                
                del self.active_sessions[session_id]
        
        logger.info(f"Client disconnected: session={session_id}")
    
    async def broadcast_to_session(
        self,
        session_id: str,
        data: dict,
    ):
        """Enviar mensaje a sesión específica"""
        if session_id in self.active_sessions:
            await self.active_sessions[session_id].send(data)
    
    async def broadcast_to_user(
        self,
        user_id: str,
        data: dict,
    ):
        """Enviar mensaje a todas las sesiones de un usuario"""
        if user_id in self.user_sessions:
            for session_id in self.user_sessions[user_id]:
                if session_id in self.active_sessions:
                    await self.active_sessions[session_id].send(data)
    
    async def cleanup_inactive(
        self,
        timeout_seconds: int = 300,
    ):
        """Limpiar conexiones inactivas"""
        now = datetime.utcnow()
        to_remove = []
        
        for session_id, connection in self.active_sessions.items():
            inactive_time = (now - connection.last_activity).total_seconds()
            if inactive_time > timeout_seconds:
                to_remove.append(session_id)
        
        for session_id in to_remove:
            await self.disconnect(session_id)
            logger.warning(f"Cleaned up inactive session: {session_id}")
    
    def get_stats(self) -> dict:
        """Obtener estadísticas de conexiones"""
        return {
            'total_active_sessions': len(self.active_sessions),
            'total_users': len(self.user_sessions),
            'sessions': [
                {
                    'session_id': sid,
                    'user_id': conn.user_id,
                    'connected_at': conn.connected_at.isoformat(),
                    'chunks_received': conn.audio_chunks_received,
                }
                for sid, conn in self.active_sessions.items()
            ],
        }

# Singleton global
session_manager = SessionManager()
```

### 2. WebSocket Endpoint para Audio Streaming

```python
# apps/audio-engine/app/ws/audio_stream.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Optional
import asyncio
import base64
import numpy as np
from .session_manager import session_manager
from ..services.realtime_analysis_service import RealtimeAnalysisService

router = APIRouter()

@router.websocket("/ws/audio/{session_id}")
async def audio_websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
):
    """
    WebSocket para streaming de audio en tiempo real
    
    Cliente envía:
    - audio chunks en base64
    - comandos de control
    
    Servidor envía:
    - feedback de pitch en tiempo real
    - métricas de estabilidad
    - confirmaciones de recepción
    """
    # 1. Autenticar (desde query params o primer mensaje)
    user_id = await authenticate_websocket(websocket)
    if not user_id:
        await websocket.close(code=4001, reason="Authentication failed")
        return
    
    # 2. Conectar al session manager
    connection = await session_manager.connect(websocket, session_id, user_id)
    
    # 3. Iniciar servicio de análisis
    analysis_service = RealtimeAnalysisService()
    
    # 4. Buffer para audio acumulado
    audio_buffer = np.array([], dtype=np.float32)
    buffer_duration = 0.0
    target_duration = 2.0  # Analizar cada 2 segundos
    
    try:
        while connection.is_active:
            # 5. Recibir mensaje
            message = await connection.receive()
            msg_type = message.get('type')
            
            if msg_type == 'audio_chunk':
                # Decodificar audio
                audio_data = base64.b64decode(message['data'])
                audio_chunk = np.frombuffer(audio_data, dtype=np.float32)
                
                # Añadir al buffer
                audio_buffer = np.concatenate([audio_buffer, audio_chunk])
                buffer_duration = len(audio_buffer) / 16000  # 16kHz
                
                connection.audio_chunks_received += 1
                
                # 6. Analizar si hay suficiente audio
                if buffer_duration >= target_duration:
                    analysis = await analysis_service.analyze_chunk(
                        audio_buffer,
                        sample_rate=16000,
                    )
                    
                    # Enviar feedback
                    await connection.send({
                        'type': 'analysis_result',
                        'data': {
                            'pitch': analysis['pitch'],
                            'confidence': analysis['confidence'],
                            'stability': analysis['stability'],
                            'cents_deviation': analysis.get('cents', 0),
                            'detected_note': analysis.get('note', ''),
                        },
                    })
                    
                    # Reset buffer (mantener último segundo para continuidad)
                    overlap_samples = int(1.0 * 16000)
                    audio_buffer = audio_buffer[-overlap_samples:]
                    buffer_duration = overlap_samples / 16000
            
            elif msg_type == 'start_recording':
                audio_buffer = np.array([], dtype=np.float32)
                buffer_duration = 0.0
                
                await connection.send({
                    'type': 'recording_started',
                    'session_id': session_id,
                })
            
            elif msg_type == 'stop_recording':
                # Análisis final
                if len(audio_buffer) > 0:
                    final_analysis = await analysis_service.analyze_chunk(
                        audio_buffer,
                        sample_rate=16000,
                    )
                    
                    await connection.send({
                        'type': 'final_analysis',
                        'data': final_analysis,
                    })
                
                await connection.send({
                    'type': 'recording_stopped',
                    'session_id': session_id,
                })
            
            elif msg_type == 'ping':
                await connection.send({
                    'type': 'pong',
                    'timestamp': message.get('timestamp'),
                })
    
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}", exc_info=True)
        await connection.send({
            'type': 'error',
            'message': str(e),
        })
    finally:
        await session_manager.disconnect(session_id)

async def authenticate_websocket(websocket: WebSocket) -> Optional[str]:
    """Autenticar conexión WebSocket"""
    # Opción 1: Token en query params
    token = websocket.query_params.get('token')
    
    if token:
        # Validar token con tu sistema de auth
        user_id = await validate_token(token)
        return user_id
    
    # Opción 2: Primer mensaje de autenticación
    try:
        message = await asyncio.wait_for(
            websocket.receive_json(),
            timeout=5.0,
        )
        
        if message.get('type') == 'auth':
            token = message.get('token')
            user_id = await validate_token(token)
            
            if user_id:
                return user_id
    except asyncio.TimeoutError:
        pass
    
    return None

async def validate_token(token: str) -> Optional[str]:
    """Validar token de autenticación"""
    # Implementar según tu sistema de auth
    # Ejemplo con Clerk o JWT
    pass
```

### 3. Cliente-Side: React Hook para WebSocket

```typescript
// hooks/use-audio-websocket.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAudioWebSocketOptions {
  sessionId: string;
  userId: string;
  authToken: string;
  onAnalysisResult?: (data: AnalysisResult) => void;
  onError?: (error: string) => void;
}

interface AnalysisResult {
  pitch: number;
  confidence: number;
  stability: number;
  cents_deviation: number;
  detected_note: string;
}

export function useAudioWebSocket({
  sessionId,
  userId,
  authToken,
  onAnalysisResult,
  onError,
}: UseAudioWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();
  
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    const wsUrl = `${process.env.NEXT_PUBLIC_AUDIO_ENGINE_WS_URL}/ws/audio/${sessionId}?token=${authToken}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Iniciar ping para mantener conexión
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'ping',
            timestamp: Date.now(),
          }));
        }
      }, 30000); // Ping cada 30 segundos
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'connected':
            console.log('Connected to session:', message.session_id);
            break;
          
          case 'analysis_result':
            onAnalysisResult?.(message.data);
            break;
          
          case 'recording_started':
            setIsRecording(true);
            break;
          
          case 'recording_stopped':
            setIsRecording(false);
            break;
          
          case 'error':
            onError?.(message.message);
            break;
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Limpiar intervals
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      
      // Intentar reconectar después de 3 segundos
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isRecording) {
          connect();
        }
      }, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError?.('Connection error');
    };
    
    wsRef.current = ws;
  }, [sessionId, authToken, isRecording, onAnalysisResult, onError]);
  
  const startRecording = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'start_recording',
        session_id: sessionId,
      }));
    }
  }, [sessionId]);
  
  const stopRecording = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'stop_recording',
        session_id: sessionId,
      }));
    }
  }, [sessionId]);
  
  const sendAudioChunk = useCallback((audioChunk: Float32Array) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      return;
    }
    
    // Convertir a base64
    const buffer = audioChunk.buffer;
    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(buffer))
    );
    
    wsRef.current.send(JSON.stringify({
      type: 'audio_chunk',
      data: base64,
      sample_rate: 16000,
    }));
  }, []);
  
  const disconnect = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setIsRecording(false);
  }, []);
  
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    isConnected,
    isRecording,
    startRecording,
    stopRecording,
    sendAudioChunk,
    disconnect,
  };
}
```

### 4. Componente de Práctica con WebSocket

```typescript
// components/practice/realtime-practice.tsx
'use client';

import { useAudioWebSocket } from '@/hooks/use-audio-websocket';
import { useAudioCapture } from '@/hooks/use-audio-capture';
import { PitchVisualizer } from './pitch-visualizer';

interface RealtimePracticeProps {
  sessionId: string;
  targetNote: string;
}

export function RealtimePractice({ sessionId, targetNote }: RealtimePracticeProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const { isConnected, startRecording, stopRecording, sendAudioChunk } = useAudioWebSocket({
    sessionId,
    userId: currentUserId,
    authToken: authToken,
    onAnalysisResult: (data) => {
      setAnalysisResult(data);
    },
  });
  
  const { isRecording, startRecording: startCapture, stopRecording: stopCapture } = useAudioCapture({
    onAudioLevel: (level) => {
      // Visual feedback local
    },
    onChunk: (chunk) => {
      // Enviar chunk al servidor
      sendAudioChunk(chunk);
    },
  });
  
  const handleStart = async () => {
    await startCapture();
    startRecording();
  };
  
  const handleStop = async () => {
    await stopCapture();
    stopRecording();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Práctica en Tiempo Real</h3>
          <p className="text-sm text-muted-foreground">
            Target: {targetNote}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">{isConnected ? 'Conectado' : 'Desconectado'}</span>
        </div>
      </div>
      
      <PitchVisualizer
        targetNote={targetNote}
        currentPitch={analysisResult?.pitch}
        centsDeviation={analysisResult?.cents_deviation}
        confidence={analysisResult?.confidence}
      />
      
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleStart}
          disabled={isRecording || !isConnected}
          size="lg"
        >
          Comenzar
        </Button>
        <Button
          onClick={handleStop}
          disabled={!isRecording}
          variant="destructive"
          size="lg"
        >
          Detener
        </Button>
      </div>
      
      {analysisResult && (
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="Nota Detectada"
            value={analysisResult.detected_note || '-'}
          />
          <MetricCard
            label="Precisión"
            value={`${Math.round(analysisResult.confidence * 100)}%`}
          />
          <MetricCard
            label="Desviación"
            value={`${analysisResult.cents_deviation > 0 ? '+' : ''}${Math.round(analysisResult.cents_deviation)}c`}
          />
        </div>
      )}
    </div>
  );
}
```

## Restricciones

- NO olvidar autenticar conexiones WebSocket
- NO enviar audio sin comprimir si el ancho de banda es limitado
- NO olvidar manejar reconexiones automáticas
- NO mantener conexiones inactivas indefinidamente
- Siempre implementar ping/pong para keepalive
- Siempre manejar errores de conexión gracefulmente
- Siempre limpiar recursos al cerrar conexión

## Ejemplos

### Bueno: Manejo de Reconexión
```typescript
// hooks/use-resilient-websocket.ts
export function useResilientWebSocket(url: string) {
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  
  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    
    ws.onclose = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        // Backoff exponencial
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connect();
        }, delay);
      } else {
        onError?.('Max reconnection attempts reached');
      }
    };
    
    ws.onopen = () => {
      setReconnectAttempts(0); // Resetear contador
    };
    
    // ...
  }, [url, reconnectAttempts]);
  
  return { connect, reconnectAttempts };
}
```
