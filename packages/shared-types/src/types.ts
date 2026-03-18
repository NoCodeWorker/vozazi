import { z } from "zod"

// API Error types
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional()
})

export type ApiError = z.infer<typeof ApiErrorSchema>

// API Error codes
export enum ApiErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Audio processing types
export interface AudioProcessingOptions {
  format?: "mp3" | "wav" | "ogg" | "flac" | "m4a"
  quality?: "low" | "medium" | "high"
  normalize?: boolean
  noiseReduction?: boolean
}

export interface TranscriptionOptions {
  language?: string
  model?: "whisper-1" | "whisper-large-v3"
  prompt?: string
  temperature?: number
  timestampGranularities?: ("word" | "segment")[]
}

export interface AnalysisOptions {
  features?: ("emotion" | "sentiment" | "speaker" | "keywords" | "summary")[]
  language?: string
}

// WebSocket message types
export interface WSMessage {
  type: "audio_chunk" | "transcript" | "analysis" | "error" | "status"
  payload: unknown
  timestamp: number
}

export interface WSStatusMessage {
  type: "status"
  payload: {
    status: "connecting" | "connected" | "processing" | "completed" | "error"
    progress?: number
    message?: string
  }
  timestamp: number
}

export interface WSTranscriptMessage {
  type: "transcript"
  payload: {
    text: string
    isFinal: boolean
    confidence?: number
    startTime?: number
    endTime?: number
  }
  timestamp: number
}

// Storage types
export interface StorageFile {
  key: string
  bucket: string
  size: number
  mimeType: string
  url: string
  metadata?: Record<string, unknown>
}

export interface PresignedUrlRequest {
  filename: string
  mimeType: string
  size: number
}

export interface PresignedUrlResponse {
  uploadUrl: string
  fileKey: string
  publicUrl: string
}

// Billing types
export interface PlanLimits {
  audioMinutesPerMonth: number
  maxFileSize: number
  maxConcurrentProcessing: number
  features: string[]
}

export const planLimits: Record<"free" | "pro" | "enterprise", PlanLimits> = {
  free: {
    audioMinutesPerMonth: 60,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxConcurrentProcessing: 1,
    features: ["transcription", "basic-analysis"]
  },
  pro: {
    audioMinutesPerMonth: 600,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxConcurrentProcessing: 5,
    features: ["transcription", "advanced-analysis", "emotion-detection", "speaker-identification"]
  },
  enterprise: {
    audioMinutesPerMonth: -1, // unlimited
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxConcurrentProcessing: 20,
    features: ["all"]
  }
}
