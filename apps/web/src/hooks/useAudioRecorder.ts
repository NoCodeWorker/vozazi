/**
 * Audio Hooks for VOZAZI
 * 
 * Hooks para captura y procesamiento de audio en el cliente.
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface AudioRecorderOptions {
  sampleRate?: number
  channels?: number
  bufferSize?: number
  onAudioData?: (data: Float32Array) => void
}

export interface AudioRecorderState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioLevel: number
  error: string | null
  permission: 'granted' | 'denied' | 'prompt'
}

export interface UseAudioRecorderReturn {
  state: AudioRecorderState
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  pauseRecording: () => void
  resumeRecording: () => void
  reset: () => void
  requestPermission: () => Promise<boolean>
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_SAMPLE_RATE = 44100
const DEFAULT_CHANNELS = 1
const DEFAULT_BUFFER_SIZE = 2048
const AUDIO_LEVEL_SMOOTHING = 0.8

// ============================================================================
// Hook: useAudioRecorder
// ============================================================================

export function useAudioRecorder(options: AudioRecorderOptions = {}): UseAudioRecorderReturn {
  const {
    sampleRate = DEFAULT_SAMPLE_RATE,
    channels = DEFAULT_CHANNELS,
    bufferSize = DEFAULT_BUFFER_SIZE,
    onAudioData
  } = options

  // State
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
    error: null,
    permission: 'prompt'
  })

  // Refs
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // ============================================================================
  // Helper Functions
  // ============================================================================

  const cleanup = useCallback(() => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    // Reset refs
    mediaRecorderRef.current = null
    analyserRef.current = null
    sourceRef.current = null
  }, [])

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current || !state.isRecording || state.isPaused) {
      setState(prev => ({ ...prev, audioLevel: 0 }))
      return
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
    const normalizedLevel = average / 255

    setState(prev => ({
      ...prev,
      audioLevel: prev.audioLevel * AUDIO_LEVEL_SMOOTHING + normalizedLevel * (1 - AUDIO_LEVEL_SMOOTHING)
    }))

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
  }, [state.isRecording, state.isPaused])

  // ============================================================================
  // Main Functions
  // ============================================================================

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          channelCount: channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      // Permission granted, stop immediately
      stream.getTracks().forEach(track => track.stop())

      setState(prev => ({ ...prev, permission: 'granted' }))
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      setState(prev => ({
        ...prev,
        permission: 'denied',
        error: 'Microphone permission denied. Please enable microphone access in your browser settings.'
      }))
      return false
    }
  }, [sampleRate, channels])

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      // Request permission if needed
      if (state.permission !== 'granted') {
        const granted = await requestPermission()
        if (!granted) {
          return
        }
      }

      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          channelCount: channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      mediaStreamRef.current = stream

      // Create audio context
      audioContextRef.current = new AudioContext({ sampleRate })

      // Create analyser for audio level visualization
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      // Create source and connect nodes
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)
      sourceRef.current.connect(analyserRef.current)

      // Create media recorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/ogg;codecs=opus'

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      })

      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }

        // Process audio data in real-time
        if (onAudioData && audioContextRef.current) {
          const audioBuffer = audioContextRef.current.createBuffer(
            channels,
            event.data.size,
            sampleRate
          )
          // Note: Actual audio processing would require WebAssembly or additional processing
        }
      }

      mediaRecorderRef.current.start(100) // Collect data every 100ms

      // Start timer
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
        error: null
      }))

      timerRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }))
      }, 1000)

      // Start audio level monitoring
      updateAudioLevel()
    } catch (error) {
      console.error('Failed to start recording:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start recording',
        isRecording: false
      }))
      cleanup()
    }
  }, [sampleRate, channels, onAudioData, requestPermission, state.permission, updateAudioLevel, cleanup])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !state.isRecording) {
        resolve(null)
        return
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorderRef.current?.mimeType || 'audio/webm'
        })

        setState(prev => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          audioLevel: 0
        }))

        cleanup()
        resolve(blob)
      }

      mediaRecorderRef.current.stop()
    })
  }, [state.isRecording, cleanup])

  const pauseRecording = useCallback(() => {
    if (!mediaRecorderRef.current || !state.isRecording || state.isPaused) {
      return
    }

    mediaRecorderRef.current.pause()

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    setState(prev => ({ ...prev, isPaused: true }))
  }, [state.isRecording, state.isPaused])

  const resumeRecording = useCallback(() => {
    if (!mediaRecorderRef.current || !state.isRecording || !state.isPaused) {
      return
    }

    mediaRecorderRef.current.resume()

    setState(prev => ({ ...prev, isPaused: false }))

    // Restart timer
    timerRef.current = window.setInterval(() => {
      setState(prev => ({
        ...prev,
        duration: prev.duration + 1
      }))
    }, 1000)

    // Restart audio level monitoring
    updateAudioLevel()
  }, [state.isRecording, state.isPaused, updateAudioLevel])

  const reset = useCallback(() => {
    cleanup()
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioLevel: 0,
      error: null,
      permission: state.permission
    })
    chunksRef.current = []
  }, [cleanup, state.permission])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    reset,
    requestPermission
  }
}

// ============================================================================
// Hook: useAudioVisualizer
// ============================================================================

export interface UseAudioVisualizerProps {
  audioData: Float32Array | null
  canvasRef: React.RefObject<HTMLCanvasElement>
  visualizationType?: 'waveform' | 'frequency' | 'circular'
  color?: string
  lineWidth?: number
}

export function useAudioVisualizer({
  audioData,
  canvasRef,
  visualizationType = 'waveform',
  color = '#3B82F6',
  lineWidth = 2
}: UseAudioVisualizerProps) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw based on visualization type
    if (visualizationType === 'waveform') {
      drawWaveform(ctx, audioData, width, height, color, lineWidth)
    } else if (visualizationType === 'frequency') {
      drawFrequency(ctx, audioData, width, height, color, lineWidth)
    } else if (visualizationType === 'circular') {
      drawCircular(ctx, audioData, width, height, color, lineWidth)
    }
  }, [audioData, canvasRef, visualizationType, color, lineWidth])
}

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  data: Float32Array,
  width: number,
  height: number,
  color: string,
  lineWidth: number
) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth

  const sliceWidth = width / data.length
  let x = 0

  ctx.moveTo(0, height / 2)

  for (let i = 0; i < data.length; i++) {
    const v = data[i]
    const y = (v + 1) / 2 * height // Normalize from [-1, 1] to [0, height]

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }

    x += sliceWidth
  }

  ctx.lineTo(width, height / 2)
  ctx.stroke()
}

function drawFrequency(
  ctx: CanvasRenderingContext2D,
  data: Float32Array,
  width: number,
  height: number,
  color: string,
  lineWidth: number
) {
  const barWidth = (width / data.length) * 2.5
  let x = 0

  for (let i = 0; i < data.length; i++) {
    const barHeight = (data[i] / 255) * height

    ctx.fillStyle = color
    ctx.fillRect(x, height - barHeight, barWidth, barHeight)

    x += barWidth + 1
  }
}

function drawCircular(
  ctx: CanvasRenderingContext2D,
  data: Float32Array,
  width: number,
  height: number,
  color: string,
  lineWidth: number
) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 3

  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth

  const step = (Math.PI * 2) / data.length

  for (let i = 0; i < data.length; i++) {
    const value = data[i]
    const angle = i * step

    const x = centerX + Math.cos(angle) * (radius + value * 50)
    const y = centerY + Math.sin(angle) * (radius + value * 50)

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }

  ctx.closePath()
  ctx.stroke()
}
