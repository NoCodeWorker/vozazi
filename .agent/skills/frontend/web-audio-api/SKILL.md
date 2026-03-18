---
name: web-audio-api
description: Web Audio API for audio capture, processing, and visualization. Use when implementing microphone access, audio recording, or real-time audio analysis in the browser.
---

# Web Audio API Skill

This skill provides expertise in Web Audio API for VOZAZI's audio capture, processing, and real-time visualization features.

## Goal

Implement reliable, low-latency audio capture and processing for vocal practice sessions with proper error handling and user feedback.

## Instructions

### 1. Audio Capture Hook

```typescript
// hooks/use-audio-capture.ts
'use client';

import { useState, useCallback, useRef } from 'react';

interface UseAudioCaptureOptions {
  onAudioLevel?: (level: number) => void;
  onError?: (error: Error) => void;
  sampleRate?: number;
}

export function useAudioCapture({
  onAudioLevel,
  onError,
  sampleRate = 44100,
}: UseAudioCaptureOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();
  
  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      mediaStreamRef.current = stream;
      
      // Create audio context
      const audioContext = new AudioContext({ sampleRate });
      audioContextRef.current = audioContext;
      
      // Create analyser for real-time visualization
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      
      // Connect stream to analyser
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);
      
      // Create media recorder for capturing audio
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(100); // Capture chunks every 100ms
      
      // Start audio level monitoring
      const monitorAudioLevel = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate RMS level
        const sum = dataArray.reduce((acc, val) => acc + val * val, 0);
        const rms = Math.sqrt(sum / dataArray.length);
        
        onAudioLevel?.(rms);
        
        animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
      };
      
      monitorAudioLevel();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to access microphone');
      setError(error);
      onError?.(error);
      setIsRecording(false);
    }
  }, [sampleRate, onAudioLevel, onError]);
  
  const stopRecording = useCallback(async () => {
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        mediaRecorderRef.current!.onstop = () => resolve();
        mediaRecorderRef.current!.stop();
      });
    }
    
    // Stop audio context
    if (audioContextRef.current?.state !== 'closed') {
      await audioContextRef.current?.close();
    }
    
    // Stop media stream
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Create blob from chunks
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
    
    // Cleanup
    mediaStreamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    mediaRecorderRef.current = null;
    
    setIsRecording(false);
    
    return audioBlob;
  }, []);
  
  const getFrequencyData = useCallback((dataArray: Uint8Array) => {
    analyserRef.current?.getByteFrequencyData(dataArray);
  }, []);
  
  const getTimeDomainData = useCallback((dataArray: Uint8Array) => {
    analyserRef.current?.getByteTimeDomainData(dataArray);
  }, []);
  
  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
    getFrequencyData,
    getTimeDomainData,
  };
}
```

### 2. Audio Visualization Component

```tsx
// components/practice/audio-visualizer.tsx
'use client';

import { useRef, useEffect } from 'react';
import { useAudioCapture } from '@/hooks/use-audio-capture';

interface AudioVisualizerProps {
  onAudioLevel?: (level: number) => void;
  targetFrequency?: number;
  targetNote?: string;
}

export function AudioVisualizer({ onAudioLevel, targetFrequency, targetNote }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const { isRecording, getFrequencyData, getTimeDomainData } = useAudioCapture({
    onAudioLevel,
  });
  
  useEffect(() => {
    if (!canvasRef.current || !isRecording) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const dataArray = new Uint8Array(128);
    
    const draw = () => {
      getFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw frequency bars
      const barWidth = canvas.width / dataArray.length;
      let x = 0;
      
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Color based on amplitude
        const hue = 200 + (dataArray[i] / 255) * 40; // Blue to cyan
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, getFrequencyData]);
  
  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      className="w-full h-48 bg-muted/20 rounded-lg"
    />
  );
}
```

### 3. Pitch Detection (Client-Side)

```typescript
// lib/audio/pitch-detection.ts

export function detectPitch(
  timeDomainData: Uint8Array,
  sampleRate: number
): { frequency: number; confidence: number } | null {
  // Auto-correlation algorithm
  const buffer = new Float32Array(timeDomainData.length);
  for (let i = 0; i < timeDomainData.length; i++) {
    buffer[i] = (timeDomainData[i] - 128) / 128; // Normalize to -1 to 1
  }
  
  const correlation = new Float32Array(buffer.length);
  let bestOffset = -1;
  let bestCorrelation = 0;
  
  for (let offset = 0; offset < buffer.length; offset++) {
    let correlationSum = 0;
    
    for (let i = 0; i < buffer.length - offset; i++) {
      correlationSum += buffer[i] * buffer[i + offset];
    }
    
    correlation[offset] = correlationSum;
    
    if (correlationSum > bestCorrelation && correlationSum > 0.1) {
      bestCorrelation = correlationSum;
      bestOffset = offset;
    }
  }
  
  if (bestOffset === -1) {
    return null;
  }
  
  const frequency = sampleRate / bestOffset;
  
  // Only return valid vocal frequencies (80Hz - 1000Hz)
  if (frequency < 80 || frequency > 1000) {
    return null;
  }
  
  return {
    frequency,
    confidence: bestCorrelation,
  };
}

export function frequencyToNote(frequency: number): { note: string; cents: number } {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  
  const halfSteps = Math.round(12 * Math.log2(frequency / C0));
  const noteNumber = halfSteps % 12;
  const octave = Math.floor(halfSteps / 12) - 1;
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = notes[noteNumber];
  
  // Calculate cents deviation
  const idealFrequency = C0 * Math.pow(2, halfSteps / 12);
  const cents = Math.round(1200 * Math.log2(frequency / idealFrequency));
  
  return { note: `${note}${octave}`, cents };
}
```

## Constraints

- Do NOT access microphone without user permission
- Do NOT process audio on main thread for heavy operations
- Do NOT forget to cleanup audio context and streams
- Always handle microphone access errors gracefully
- Always provide visual feedback during recording
- Always respect user privacy and allow disabling audio

## Examples

### Good: Complete Practice Session Component
```tsx
// components/practice/practice-session.tsx
'use client';

import { useState } from 'react';
import { AudioVisualizer } from './audio-visualizer';
import { Button } from '@/components/ui/button';
import { useAudioCapture } from '@/hooks/use-audio-capture';
import { detectPitch, frequencyToNote } from '@/lib/audio/pitch-detection';

export function PracticeSession() {
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [cents, setCents] = useState<number>(0);
  
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    getTimeDomainData 
  } = useAudioCapture({
    onAudioLevel: setAudioLevel,
  });
  
  const handleStart = async () => {
    await startRecording();
  };
  
  const handleStop = async () => {
    const audioBlob = await stopRecording();
    // Send to server for deep analysis
    await uploadAudio(audioBlob);
  };
  
  // Update pitch detection in real-time
  useEffect(() => {
    if (!isRecording) return;
    
    const interval = setInterval(() => {
      const dataArray = new Uint8Array(2048);
      getTimeDomainData(dataArray);
      
      const pitch = detectPitch(dataArray, 44100);
      if (pitch) {
        const { note, cents } = frequencyToNote(pitch.frequency);
        setCurrentNote(note);
        setCents(cents);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRecording, getTimeDomainData]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Practice Session</h3>
          <p className="text-sm text-muted-foreground">
            Target: A4 (±15 cents)
          </p>
        </div>
        {currentNote && (
          <div className="text-right">
            <div className="text-2xl font-bold">{currentNote}</div>
            <div className={`text-sm ${Math.abs(cents) <= 15 ? 'text-green-500' : 'text-red-500'}`}>
              {cents > 0 ? '+' : ''}{cents} cents
            </div>
          </div>
        )}
      </div>
      
      <AudioVisualizer onAudioLevel={setAudioLevel} />
      
      <div className="flex justify-center gap-4">
        <Button 
          onClick={handleStart} 
          disabled={isRecording}
          size="lg"
        >
          Start Recording
        </Button>
        <Button 
          onClick={handleStop} 
          disabled={!isRecording}
          variant="destructive"
          size="lg"
        >
          Stop Recording
        </Button>
      </div>
    </div>
  );
}
```
