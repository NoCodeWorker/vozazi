/**
 * Constants for VOZAZI Platform
 * 
 * Constantes compartidas para toda la plataforma.
 */

// ============================================================================
// App Constants
// ============================================================================

export const APP_NAME = 'VOZAZI'
export const APP_DESCRIPTION = 'AI-powered audio processing and voice analysis platform'
export const APP_VERSION = '1.0.0'

// ============================================================================
// Audio Constants
// ============================================================================

export const AUDIO = {
  // Sample rates
  SAMPLE_RATES: [8000, 16000, 22050, 44100, 48000] as const,
  DEFAULT_SAMPLE_RATE: 44100,
  
  // Chunk sizes
  FEEDBACK_CHUNK_MS: 200, // 200ms for real-time feedback
  ANALYSIS_CHUNK_MS: 1000, // 1s for analysis
  MAX_CHUNK_MS: 3000, // 3s max chunk
  
  // File limits
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_FILE_SIZE_FREE: 10 * 1024 * 1024, // 10MB for free users
  
  // Supported formats
  SUPPORTED_FORMATS: ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/m4a'] as const,
  
  // Duration limits (seconds)
  MAX_DURATION: 300, // 5 minutes
  MIN_DURATION: 1, // 1 second
  
  // Pitch range (Hz)
  PITCH_RANGE: {
    MIN: 82, // E2
    MAX: 1046 // C6
  }
} as const

// ============================================================================
// Scoring Constants
// ============================================================================

export const SCORING = {
  // Score range
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  
  // Score thresholds
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 60,
  POOR: 40,
  
  // Weights for overall score
  WEIGHTS: {
    PITCH_ACCURACY: 0.40,
    PITCH_STABILITY: 0.20,
    ONSET_CONTROL: 0.15,
    BREATH_SUPPORT: 0.15,
    CONSISTENCY: 0.10
  },
  
  // Progress thresholds
  PROGRESS_IMPROVING: 5, // 5% improvement
  PROGRESS_DECLINING: -5 // 5% decline
} as const

// ============================================================================
// Practice Constants
// ============================================================================

export const PRACTICE = {
  // Session limits
  MAX_SESSION_DURATION: 30 * 60, // 30 minutes
  MIN_SESSION_DURATION: 1 * 60, // 1 minute
  
  // Rest recommendations
  MIN_REST_BETWEEN_SESSIONS: 5 * 60, // 5 minutes
  RECOMMENDED_DAILY_PRACTICE: 30 * 60, // 30 minutes
  
  // Fatigue thresholds
  FATIGUE_SESSIONS_24H: 3,
  FATIGUE_SESSIONS_7D: 10,
  FATIGUE_AVG_SCORE_THRESHOLD: 60,
  
  // Streak tracking
  STREAK_DAILY_GOAL: 1, // 1 session per day
  STREAK_WEEKLY_GOAL: 5 // 5 sessions per week
} as const

// ============================================================================
// Exercise Constants
// ============================================================================

export const EXERCISE = {
  // Difficulty levels
  LEVELS: ['beginner', 'foundation', 'intermediate', 'advanced', 'professional'] as const,
  
  // Categories
  CATEGORIES: [
    'warm_up',
    'pitch_accuracy',
    'breath_control',
    'resonance',
    'range_extension',
    'agility',
    'vibrato',
    'dynamics',
    'articulation',
    'stamina'
  ] as const,
  
  // Default durations
  DEFAULT_DURATION: 60, // seconds
  DEFAULT_REPETITIONS: 5,
  DEFAULT_REST: 30 // seconds
} as const

// ============================================================================
// Subscription Constants
// ============================================================================

export const SUBSCRIPTION = {
  // Plan types
  PLANS: ['free', 'pro', 'enterprise'] as const,
  
  // Trial period
  TRIAL_DAYS: 14,
  
  // Billing cycles
  CYCLES: ['monthly', 'yearly'] as const,
  
  // Cancellation
  CANCELLATION_WINDOW_DAYS: 30, // Can cancel within 30 days
  
  // Grace period
  GRACE_PERIOD_DAYS: 7 // Days after payment failure
} as const

// ============================================================================
// UI Constants
// ============================================================================

export const UI = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Dates
  DATE_FORMAT: 'MMM d, yyyy',
  DATETIME_FORMAT: 'MMM d, yyyy HH:mm',
  TIME_FORMAT: 'HH:mm',
  
  // Animations
  ANIMATION_DURATION: 200, // ms
  TRANSITION_DURATION: 150, // ms
  
  // Breakpoints (Tailwind)
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }
} as const

// ============================================================================
// API Constants
// ============================================================================

export const API = {
  // Versioning
  VERSION: 'v1',
  PREFIX: '/api/v1',
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 60, // seconds
  RATE_LIMIT_MAX_REQUESTS: 60,
  
  // Timeouts
  TIMEOUT_SHORT: 5000, // 5 seconds
  TIMEOUT_MEDIUM: 15000, // 15 seconds
  TIMEOUT_LONG: 30000, // 30 seconds
  
  // Retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000 // 1 second
} as const

// ============================================================================
// Error Codes
// ============================================================================

export const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Authorization
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Resource
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  
  // Validation
  INVALID_INPUT: 'INVALID_INPUT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  
  // Processing
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  TRANSCRIPTION_FAILED: 'TRANSCRIPTION_FAILED',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // Internal
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  AUDIO_UPLOADED: 'Audio file uploaded successfully',
  AUDIO_PROCESSED: 'Audio file processed successfully',
  AUDIO_TRANSCRIBED: 'Audio file transcribed successfully',
  AUDIO_ANALYZED: 'Audio file analyzed successfully',
  AUDIO_DELETED: 'Audio file deleted successfully',
  SESSION_COMPLETED: 'Session completed successfully',
  SUBSCRIPTION_CREATED: 'Subscription created successfully',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully'
} as const
