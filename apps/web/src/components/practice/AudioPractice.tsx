/**
 * Audio Practice Components
 * 
 * Componentes para la UI de práctica de audio.
 */

'use client'

import { useRef, useState, useCallback } from 'react'
import { useAudioRecorder, useAudioVisualizer } from '@/hooks/useAudioRecorder'
import { Button } from '@vozazi/ui'

// ============================================================================
// Types
// ============================================================================

export interface AudioPracticeProps {
  exerciseType: string
  targetNote?: string
  onSessionComplete?: (data: SessionData) => void
  onSessionCancel?: () => void
}

export interface SessionData {
  duration: number
  audioBlob: Blob
  exerciseType: string
  targetNote?: string
}

// ============================================================================
// Components
// ============================================================================

export function AudioPractice({
  exerciseType,
  targetNote,
  onSessionComplete,
  onSessionCancel
}: AudioPracticeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [audioData, setAudioData] = useState<Float32Array | null>(null)

  const {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    reset
  } = useAudioRecorder({
    onAudioData: (data) => {
      setAudioData(data)
    }
  })

  // Use visualizer hook
  useAudioVisualizer({
    audioData,
    canvasRef,
    visualizationType: 'waveform',
    color: '#3B82F6',
    lineWidth: 2
  })

  const handleStart = useCallback(async () => {
    await startRecording()
  }, [startRecording])

  const handleStop = useCallback(async () => {
    const blob = await stopRecording()
    
    if (blob && onSessionComplete) {
      onSessionComplete({
        duration: state.duration,
        audioBlob: blob,
        exerciseType,
        targetNote
      })
    }
  }, [stopRecording, state.duration, onSessionComplete, exerciseType, targetNote])

  const handlePause = useCallback(() => {
    pauseRecording()
  }, [pauseRecording])

  const handleResume = useCallback(() => {
    resumeRecording()
  }, [resumeRecording])

  const handleCancel = useCallback(() => {
    reset()
    onSessionCancel?.()
  }, [reset, onSessionCancel])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8" data-testid="practice-session">
      {/* Target Note Display */}
      {targetNote && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Nota Objetivo</h2>
          <p className="text-4xl font-mono text-primary">{targetNote}</p>
        </div>
      )}

      {/* Audio Visualizer */}
      <div className="relative w-full max-w-2xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full rounded-lg border bg-muted"
          data-testid="audio-visualizer"
        />
        
        {/* Recording Indicator */}
        {state.isRecording && !state.isPaused && (
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-500">REC</span>
          </div>
        )}
        
        {/* Paused Indicator */}
        {state.isPaused && (
          <div className="absolute top-4 right-4">
            <span className="rounded bg-yellow-500 px-2 py-1 text-sm font-medium text-white" data-testid="paused-indicator">
              PAUSED
            </span>
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="text-4xl font-mono font-bold" data-testid="recording-timer}>
        {formatDuration(state.duration)}
      </div>

      {/* Audio Level Meter */}
      <div className="w-full max-w-2xl">
        <div className="h-4 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${state.audioLevel * 100}%` }}
            data-testid="audio-level-meter"
          />
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">Nivel de Audio</p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4" data-testid="audio-controls">
        {!state.isRecording ? (
          <Button
            onClick={handleStart}
            size="lg"
            disabled={state.error !== null}
            data-testid="start-practice"
          >
            🎤 Comenzar
          </Button>
        ) : (
          <>
            {!state.isPaused ? (
              <Button
                onClick={handlePause}
                variant="outline"
                size="lg"
                data-testid="pause-button"
              >
                ⏸️ Pausar
              </Button>
            ) : (
              <Button
                onClick={handleResume}
                variant="outline"
                size="lg"
                data-testid="resume-button"
              >
                ▶️ Continuar
              </Button>
            )}
            
            <Button
              onClick={handleStop}
              variant="default"
              size="lg"
              data-testid="finish-button"
            >
              ✅ Finalizar
            </Button>
            
            <Button
              onClick={handleCancel}
              variant="destructive"
              size="lg"
              data-testid="end-early-button"
            >
              ❌ Cancelar
            </Button>
          </>
        )}
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive" data-testid="mic-error">
          <p className="font-medium">Error de Micrófono</p>
          <p className="text-sm" data-testid="mic-error-help">{state.error}</p>
        </div>
      )}

      {/* Permission Request */}
      {state.permission === 'denied' && (
        <div className="rounded-lg bg-yellow-500/10 p-4 text-yellow-600">
          <p className="font-medium">Permiso de Micrófono Denegado</p>
          <p className="text-sm">
            Por favor, habilita el acceso al micrófono en la configuración de tu navegador.
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Pitch Indicator Component
// ============================================================================

export interface PitchIndicatorProps {
  detectedNote?: string
  targetNote?: string
  cents?: number
  confidence?: number
}

export function PitchIndicator({ detectedNote, targetNote, cents, confidence }: PitchIndicatorProps) {
  const isOnPitch = cents !== undefined && Math.abs(cents) < 10
  const isFlat = cents !== undefined && cents < -10
  const isSharp = cents !== undefined && cents > 10

  return (
    <div className="flex flex-col items-center space-y-2" data-testid="pitch-indicator">
      {/* Note Display */}
      <div className="text-6xl font-bold">
        {detectedNote || '--'}
      </div>

      {/* Cents Indicator */}
      {cents !== undefined && (
        <div className="flex items-center space-x-2">
          <span className={`text-2xl ${isOnPitch ? 'text-green-500' : isFlat ? 'text-yellow-500' : isSharp ? 'text-red-500' : ''}`}>
            {cents > 0 ? '+' : ''}{cents} cents
          </span>
        </div>
      )}

      {/* Status */}
      <div className="text-lg font-medium">
        {isOnPitch ? (
          <span className="text-green-500">¡Afinado!</span>
        ) : isFlat ? (
          <span className="text-yellow-500">Bajo ♭</span>
        ) : isSharp ? (
          <span className="text-red-500">Alto ♯</span>
        ) : (
          <span className="text-muted-foreground">Escuchando...</span>
        )}
      </div>

      {/* Confidence */}
      {confidence !== undefined && (
        <div className="text-sm text-muted-foreground">
          Confianza: {(confidence * 100).toFixed(0)}%
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Exercise Instructions Component
// ============================================================================

export interface ExerciseInstructionsProps {
  exerciseType: string
  targetNote?: string
  duration?: number
  repetitions?: number
}

export function ExerciseInstructions({
  exerciseType,
  targetNote,
  duration,
  repetitions
}: ExerciseInstructionsProps) {
  const getInstructions = () => {
    switch (exerciseType) {
      case 'sustain_note':
        return {
          title: 'Nota Sostenida',
          description: `Mantén la nota ${targetNote || 'indicada'} de manera estable y consistente.`,
          tips: [
            'Respira profundamente antes de comenzar',
            'Mantén el soporte de aire constante',
            'Relaja la garganta y el cuello',
            'Enfócate en la estabilidad del pitch'
          ]
        }
      
      case 'pitch_target':
        return {
          title: 'Objetivo de Afinación',
          description: `Canta la nota ${targetNote || 'indicada'} con precisión.`,
          tips: [
            'Escucha la nota mentalmente antes de cantar',
            'Imagina el pitch antes de producirlo',
            'Ajusta suavemente si estás desafinado',
            'Mantén la nota una vez alcanzada'
          ]
        }
      
      case 'clean_onset':
        return {
          title: 'Ataque Limpio',
          description: 'Comienza la nota con un ataque claro y preciso.',
          tips: [
            'Prepara el aire antes de comenzar',
            'Inicia la nota sin deslizamientos',
            'Usa el diafragma para el soporte inicial',
            'Evita el glottal stroke excesivo'
          ]
        }
      
      default:
        return {
          title: 'Ejercicio',
          description: 'Sigue las instrucciones del ejercicio.',
          tips: [
            'Mantén una buena postura',
            'Respira adecuadamente',
            'Relaja los hombros',
            'Enfócate en la calidad del sonido'
          ]
        }
    }
  }

  const instructions = getInstructions()

  return (
    <div className="rounded-lg border bg-card p-6" data-testid="exercise-instructions">
      <h3 className="mb-2 text-xl font-bold">{instructions.title}</h3>
      <p className="mb-4 text-muted-foreground">{instructions.description}</p>
      
      {duration && (
        <p className="mb-2 text-sm">
          <strong>Duración:</strong> {duration} segundos
        </p>
      )}
      
      {repetitions && (
        <p className="mb-4 text-sm">
          <strong>Repeticiones:</strong> {repetitions}
        </p>
      )}
      
      <div>
        <h4 className="mb-2 font-semibold">Consejos:</h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {instructions.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
