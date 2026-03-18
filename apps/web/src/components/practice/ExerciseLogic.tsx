/**
 * Exercise Logic Components
 * 
 * Componentes para la lógica de ejercicios.
 */

'use client'

import { useState, useCallback } from 'react'

// ============================================================================
// Types
// ============================================================================

export type ExerciseType = 'sustain_note' | 'pitch_target'

export interface ExerciseConfig {
  type: ExerciseType
  targetNote?: string
  duration?: number
  repetitions?: number
}

export interface ExerciseState {
  currentRepetition: number
  isComplete: boolean
  isActive: boolean
  score?: number
}

// ============================================================================
// Sustain Note Exercise
// ============================================================================

export function useSustainNoteExercise(config: ExerciseConfig) {
  const [state, setState] = useState<ExerciseState>({
    currentRepetition: 0,
    isComplete: false,
    isActive: false
  })

  const startExercise = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true, currentRepetition: 1 }))
  }, [])

  const completeRepetition = useCallback((score?: number) => {
    setState(prev => {
      const nextRep = prev.currentRepetition + 1
      const isComplete = nextRep > (config.repetitions || 5)
      
      return {
        ...prev,
        currentRepetition: nextRep,
        isComplete,
        isActive: !isComplete,
        score: score || prev.score
      }
    })
  }, [config.repetitions])

  const resetExercise = useCallback(() => {
    setState({
      currentRepetition: 0,
      isComplete: false,
      isActive: false
    })
  }, [])

  return {
    ...state,
    startExercise,
    completeRepetition,
    resetExercise
  }
}

// ============================================================================
// Pitch Target Exercise
// ============================================================================

export function usePitchTargetExercise(config: ExerciseConfig) {
  const [state, setState] = useState<ExerciseState>({
    currentRepetition: 0,
    isComplete: false,
    isActive: false
  })
  const [currentTarget, setCurrentTarget] = useState<string>(config.targetNote || 'C4')

  const startExercise = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true, currentRepetition: 1 }))
  }, [])

  const hitTarget = useCallback((score?: number) => {
    setState(prev => {
      const nextRep = prev.currentRepetition + 1
      const isComplete = nextRep > (config.repetitions || 10)
      
      return {
        ...prev,
        currentRepetition: nextRep,
        isComplete,
        isActive: !isComplete,
        score: score || prev.score
      }
    })
  }, [config.repetitions])

  const resetExercise = useCallback(() => {
    setState({
      currentRepetition: 0,
      isComplete: false,
      isActive: false
    })
    setCurrentTarget(config.targetNote || 'C4')
  }, [config.targetNote])

  return {
    ...state,
    currentTarget,
    setCurrentTarget,
    startExercise,
    hitTarget,
    resetExercise
  }
}

// ============================================================================
// Exercise Instructions Component
// ============================================================================

export function ExerciseInstructions({ type }: { type: ExerciseType }) {
  const instructions = {
    sustain_note: {
      title: 'Nota Sostenida',
      steps: [
        'Respira profundamente',
        'Canta la nota objetivo',
        'Mantén la nota estable',
        'Relaja al finalizar'
      ]
    },
    pitch_target: {
      title: 'Objetivo de Pitch',
      steps: [
        'Escucha la nota objetivo',
        'Cántala inmediatamente',
        'Mantén por 3 segundos',
        'Descansa'
      ]
    }
  }

  const instruction = instructions[type]

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-2">{instruction.title}</h3>
      <ol className="list-decimal list-inside space-y-1 text-sm">
        {instruction.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  )
}

// ============================================================================
// Exercise Summary Component
// ============================================================================

export interface ExerciseSummaryProps {
  type: ExerciseType
  repetitions: number
  score?: number
  onRetry: () => void
  onNext: () => void
}

export function ExerciseSummary({
  type,
  repetitions,
  score,
  onRetry,
  onNext
}: ExerciseSummaryProps) {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h3 className="text-lg font-semibold">Ejercicio Completado</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Tipo</p>
          <p className="font-semibold capitalize">{type.replace('_', ' ')}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Repeticiones</p>
          <p className="font-semibold">{repetitions}</p>
        </div>
        {score !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Puntuación</p>
            <p className="font-semibold">{score}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRetry}
          className="flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Repetir
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
