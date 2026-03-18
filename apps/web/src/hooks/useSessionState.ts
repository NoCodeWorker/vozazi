/**
 * Session State Management Hook
 * 
 * Hook para gestionar el estado de una sesión de práctica.
 */

import { useState, useCallback } from 'react'

export type SessionState = 
  | 'idle'
  | 'preparing'
  | 'recording'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface SessionError {
  code: string
  message: string
}

export interface UseSessionStateReturn {
  state: SessionState
  error: SessionError | null
  isIdle: boolean
  isPreparing: boolean
  isRecording: boolean
  isProcessing: boolean
  isCompleted: boolean
  isFailed: boolean
  isCancelled: boolean
  setState: (state: SessionState) => void
  setError: (error: SessionError) => void
  startSession: () => void
  completeSession: () => void
  failSession: (error: SessionError) => void
  cancelSession: () => void
  reset: () => void
}

export function useSessionState(): UseSessionStateReturn {
  const [state, setState] = useState<SessionState>('idle')
  const [error, setError] = useState<SessionError | null>(null)

  const isIdle = state === 'idle'
  const isPreparing = state === 'preparing'
  const isRecording = state === 'recording'
  const isProcessing = state === 'processing'
  const isCompleted = state === 'completed'
  const isFailed = state === 'failed'
  const isCancelled = state === 'cancelled'

  const startSession = useCallback(() => {
    setState('preparing')
    setError(null)
  }, [])

  const completeSession = useCallback(() => {
    setState('completed')
  }, [])

  const failSession = useCallback((sessionError: SessionError) => {
    setState('failed')
    setError(sessionError)
  }, [])

  const cancelSession = useCallback(() => {
    setState('cancelled')
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setError(null)
  }, [])

  return {
    state,
    error,
    isIdle,
    isPreparing,
    isRecording,
    isProcessing,
    isCompleted,
    isFailed,
    isCancelled,
    setState,
    setError,
    startSession,
    completeSession,
    failSession,
    cancelSession,
    reset
  }
}
