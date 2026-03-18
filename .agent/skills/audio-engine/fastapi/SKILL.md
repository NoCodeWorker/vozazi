---
name: fastapi
description: FastAPI framework para construir APIs de alto rendimiento en Python. Use cuando cree endpoints, WebSockets, o servicios para el audio-engine de VOZAZI.
---

# FastAPI Skill

Esta skill proporciona experiencia en FastAPI para construir el audio-engine de VOZAZI con alto rendimiento y validación automática.

## Objetivo

Implementar APIs robustas, validadas y documentadas automáticamente usando FastAPI para el procesamiento de audio y análisis vocal.

## Instrucciones

### 1. Estructura Base del Proyecto

```python
# apps/audio-engine/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .api import health, realtime, analysis, scoring
from .infrastructure.logging import setup_logging

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    yield
    # Shutdown
    # Cleanup resources

app = FastAPI(
    title="VOZAZI Audio Engine",
    description="Análisis acústico para entrenamiento vocal",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS para comunicación con Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://vozazi.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(health.router, tags=["health"])
app.include_router(realtime.router, prefix="/api/v1/realtime", tags=["realtime"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(scoring.router, prefix="/api/v1/scoring", tags=["scoring"])
```

### 2. Pydantic Models para Validación

```python
# apps/audio-engine/domain/models.py
from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional
from datetime import datetime
import re

class AudioAnalysisRequest(BaseModel):
    session_id: str = Field(..., description="ID único de la sesión")
    task_id: str = Field(..., description="ID de la tarea asociada")
    audio_chunk_url: str = Field(..., description="URL del chunk de audio en R2")
    exercise_type: Literal['sustain_note', 'pitch_target', 'clean_onset', 'scale_run']
    target_note: Optional[str] = Field(None, pattern=r'^[A-G][#b]?[0-9]$')
    difficulty: int = Field(1, ge=1, le=5)
    
    @field_validator('session_id', 'task_id')
    @classmethod
    def validate_uuid(cls, v: str) -> str:
        uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        if not uuid_pattern.match(v):
            raise ValueError('Invalid UUID format')
        return v

class AudioMetrics(BaseModel):
    pitch_accuracy: float = Field(ge=0.0, le=1.0)
    pitch_stability: float = Field(ge=0.0, le=1.0)
    onset_timing_ms: Optional[float] = None
    vibrato_rate: Optional[float] = Field(None, ge=0.0, le=10.0)
    vibrato_depth: Optional[float] = Field(None, ge=0.0, le=1.0)
    breath_control: Optional[float] = Field(None, ge=0.0, le=1.0)
    sustain_duration: Optional[float] = Field(None, ge=0.0)

class EvaluationResult(BaseModel):
    score_total: int = Field(ge=0, le=100)
    score_pitch_accuracy: float = Field(ge=0.0, le=1.0)
    score_pitch_stability: float = Field(ge=0.0, le=1.0)
    score_onset_control: float = Field(ge=0.0, le=1.0)
    score_breath_support: float = Field(ge=0.0, le=1.0)
    score_consistency: float = Field(ge=0.0, le=1.0)
    dominant_weakness: str
    secondary_weakness: Optional[str] = None
    adaptive_decision: Literal['increase_difficulty', 'maintain', 'decrease_difficulty', 'repeat_exercise']

class AudioAnalysisResponse(BaseModel):
    session_id: str
    task_id: str
    metrics: AudioMetrics
    evaluation: EvaluationResult
    processed_at: datetime = Field(default_factory=datetime.utcnow)
```

### 3. Endpoints con Validación

```python
# apps/audio-engine/app/api/analysis.py
from fastapi import APIRouter, HTTPException, BackgroundTasks
from ..domain.models import AudioAnalysisRequest, AudioAnalysisResponse
from ..services.analysis_service import AnalysisService
from ..services.scoring_service import ScoringService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/deep-analysis",
    response_model=AudioAnalysisResponse,
    summary="Análisis acústico profundo",
    description="Procesa un chunk de audio y devuelve métricas avanzadas y evaluación",
    responses={
        200: {"description": "Análisis completado exitosamente"},
        400: {"description": "Datos de entrada inválidos"},
        404: {"description": "Audio no encontrado"},
        500: {"description": "Error interno del servidor"},
    },
)
async def deep_analysis(
    request: AudioAnalysisRequest,
    background_tasks: BackgroundTasks,
):
    """
    Realiza análisis acústico profundo del audio.
    
    - **session_id**: ID único de la sesión
    - **task_id**: ID de la tarea asociada
    - **audio_chunk_url**: URL del audio en Cloudflare R2
    - **exercise_type**: Tipo de ejercicio vocal
    - **target_note**: Nota objetivo (opcional)
    - **difficulty**: Nivel de dificultad (1-5)
    """
    try:
        # 1. Descargar audio desde R2
        audio_data = await download_audio(request.audio_chunk_url)
        if not audio_data:
            raise HTTPException(status_code=404, detail="Audio not found")
        
        # 2. Procesar audio
        analysis_service = AnalysisService()
        metrics = await analysis_service.extract_metrics(
            audio_data=audio_data,
            exercise_type=request.exercise_type,
            target_note=request.target_note,
        )
        
        # 3. Calcular evaluación
        scoring_service = ScoringService()
        evaluation = await scoring_service.calculate_evaluation(
            metrics=metrics,
            difficulty=request.difficulty,
        )
        
        # 4. Registrar en background
        background_tasks.add_task(
            log_analysis,
            session_id=request.session_id,
            metrics=metrics,
            evaluation=evaluation,
        )
        
        return AudioAnalysisResponse(
            session_id=request.session_id,
            task_id=request.task_id,
            metrics=metrics,
            evaluation=evaluation,
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Analysis failed")
```

### 4. WebSockets para Tiempo Real

```python
# apps/audio-engine/app/ws/session_ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
import asyncio
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Conexiones activas
active_connections: Dict[str, WebSocket] = {}

@router.websocket("/ws/session/{session_id}")
async def session_websocket(websocket: WebSocket, session_id: str):
    """
    WebSocket para feedback en tiempo real durante la práctica.
    
    Envía:
    - Nota detectada
    - Cents de desviación
    - Estabilidad básica
    """
    await websocket.accept()
    active_connections[session_id] = websocket
    
    logger.info(f"Client connected: {session_id}")
    
    try:
        while True:
            # Recibir datos del cliente
            data = await websocket.receive_json()
            
            # Procesar audio chunk
            result = await process_realtime_audio(data)
            
            # Enviar feedback inmediato
            await websocket.send_json({
                "type": "pitch_update",
                "data": {
                    "detected_note": result.note,
                    "cents": result.cents,
                    "stability": result.stability,
                    "timestamp": result.timestamp,
                }
            })
            
    except WebSocketDisconnect:
        logger.info(f"Client disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}", exc_info=True)
        try:
            await websocket.send_json({
                "type": "error",
                "message": "Processing error",
            })
        except:
            pass
    finally:
        if session_id in active_connections:
            del active_connections[session_id]

async def process_realtime_audio(data: dict) -> dict:
    """Procesamiento ligero para feedback inmediato"""
    # Implementar pitch detection rápido
    # Retornar nota, cents, estabilidad
    pass
```

### 5. Dependency Injection

```python
# apps/audio-engine/app/dependencies.py
from fastapi import Depends, HTTPException, status
from typing import Optional
import os

class Settings:
    def __init__(self):
        self.r2_account_id: str = os.getenv("R2_ACCOUNT_ID")
        self.r2_access_key: str = os.getenv("R2_ACCESS_KEY_ID")
        self.r2_secret_key: str = os.getenv("R2_SECRET_ACCESS_KEY")
        self.r2_bucket: str = os.getenv("R2_BUCKET_NAME", "vozazi-audio")
        self.database_url: str = os.getenv("DATABASE_URL")
        self.log_level: str = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()

async def get_settings() -> Settings:
    return settings

async def verify_api_key(
    x_api_key: str = Header(..., alias="X-API-Key")
) -> str:
    """Verificar API key para comunicación entre servicios"""
    expected_key = os.getenv("INTERNAL_API_KEY")
    if not expected_key or x_api_key != expected_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )
    return x_api_key

async def verify_session_access(
    session_id: str,
    user_id: str = Depends(get_current_user),
) -> bool:
    """Verificar que el usuario tiene acceso a la sesión"""
    session = await get_session_by_id(session_id)
    if not session or session.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    return True
```

### 6. Manejo de Errores Global

```python
# apps/audio-engine/app/exceptions.py
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

class AudioProcessingError(Exception):
    """Error personalizado para procesamiento de audio"""
    def __init__(self, message: str, code: str = "AUDIO_PROCESSING_FAILED"):
        self.message = message
        self.code = code
        super().__init__(self.message)

async def validation_exception_handler(
    request: Request, 
    exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Validation failed",
            "details": exc.errors(),
        },
    )

async def audio_processing_exception_handler(
    request: Request, 
    exc: AudioProcessingError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": exc.message,
            "code": exc.code,
        },
    )

async def generic_exception_handler(
    request: Request, 
    exc: Exception
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "detail": "Please try again later",
        },
    )
```

## Restricciones

- NO usar `any` en type hints de Python
- NO exponer detalles de error internos al cliente
- NO olvidar validar inputs con Pydantic
- NO bloquear el event loop con operaciones síncronas pesadas
- Siempre usar `async/await` para I/O
- Siempre loguear errores con contexto suficiente
- Siempre documentar endpoints con descripciones claras

## Ejemplos

### Bueno: Endpoint Completo con Validación
```python
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

router = APIRouter()

class PitchTargetRequest(BaseModel):
    target_frequency: float = Field(ge=80.0, le=1000.0)
    tolerance_cents: int = Field(default=15, ge=5, le=50)
    min_duration_ms: int = Field(default=500, ge=100)

class PitchTargetResponse(BaseModel):
    detected_frequency: float
    detected_note: str
    cents_deviation: float
    is_in_tune: bool
    confidence: float

@router.post(
    "/pitch-target",
    response_model=PitchTargetResponse,
    summary="Detectar afinación respecto a nota objetivo",
)
async def analyze_pitch_target(
    request: PitchTargetRequest,
    settings: Settings = Depends(get_settings),
) -> PitchTargetResponse:
    """
    Analiza la afinación del audio comparado con una nota objetivo.
    
    - **target_frequency**: Frecuencia objetivo en Hz (80-1000)
    - **tolerance_cents**: Tolerancia en cents (5-50)
    - **min_duration_ms**: Duración mínima en ms (100+)
    
    Retorna la nota detectada, desviación en cents, y si está afinado.
    """
    # Implementación
    pass
```
