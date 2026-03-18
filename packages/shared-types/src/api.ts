// API endpoints configuration
export const API_ENDPOINTS = {
  // Health
  HEALTH: "/health",
  HEALTH_READY: "/health/ready",
  
  // Audio
  AUDIO_PROCESS: "/api/v1/audio/process",
  AUDIO_TRANSCRIBE: "/api/v1/audio/transcribe",
  AUDIO_ANALYZE: "/api/v1/audio/analyze",
  AUDIO_LIST: "/api/v1/audio",
  AUDIO_GET: (id: string) => `/api/v1/audio/${id}`,
  AUDIO_DELETE: (id: string) => `/api/v1/audio/${id}`,
  
  // Storage
  STORAGE_UPLOAD: "/api/v1/storage/upload",
  STORAGE_PRESIGNED: "/api/v1/storage/presigned",
  
  // Subscription
  SUBSCRIPTION_GET: "/api/v1/subscription",
  SUBSCRIPTION_CREATE: "/api/v1/subscription/create",
  SUBSCRIPTION_CANCEL: "/api/v1/subscription/cancel",
  SUBSCRIPTION_WEBHOOK: "/api/v1/subscription/webhook",
  
  // Usage
  USAGE_GET: "/api/v1/usage",
  USAGE_HISTORY: "/api/v1/usage/history"
} as const

// WebSocket endpoints
export const WS_ENDPOINTS = {
  REALTIME: "/ws/realtime",
  PROCESSING: "/ws/processing"
} as const

// External service endpoints
export const EXTERNAL_SERVICES = {
  CLERK: {
    BASE: "https://api.clerk.com/v1",
    USERS: "/users",
    SESSIONS: "/sessions"
  },
  STRIPE: {
    BASE: "https://api.stripe.com/v1",
    CUSTOMERS: "/customers",
    SUBSCRIPTIONS: "/subscriptions",
    CHECKOUT: "/checkout/sessions"
  },
  OPENAI: {
    BASE: "https://api.openai.com/v1",
    AUDIO_TRANSCRIPTIONS: "/audio/transcriptions",
    AUDIO_SPEECH: "/audio/speech"
  },
  ANTHROPIC: {
    BASE: "https://api.anthropic.com/v1",
    MESSAGES: "/messages"
  }
} as const

// Error messages
export const ERROR_MESSAGES = {
  // Authentication
  UNAUTHORIZED: "Unauthorized access",
  INVALID_TOKEN: "Invalid authentication token",
  TOKEN_EXPIRED: "Authentication token has expired",
  
  // Authorization
  FORBIDDEN: "Access denied",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  
  // Resource
  NOT_FOUND: "Resource not found",
  AUDIO_NOT_FOUND: "Audio file not found",
  USER_NOT_FOUND: "User not found",
  SUBSCRIPTION_NOT_FOUND: "Subscription not found",
  
  // Validation
  INVALID_INPUT: "Invalid input data",
  FILE_TOO_LARGE: "File size exceeds limit",
  INVALID_FILE_TYPE: "Invalid file type",
  INVALID_AUDIO_FORMAT: "Invalid audio format",
  
  // Processing
  PROCESSING_FAILED: "Audio processing failed",
  TRANSCRIPTION_FAILED: "Transcription failed",
  ANALYSIS_FAILED: "Analysis failed",
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
  QUOTA_EXCEEDED: "Monthly quota exceeded",
  
  // Storage
  UPLOAD_FAILED: "File upload failed",
  DOWNLOAD_FAILED: "File download failed",
  STORAGE_ERROR: "Storage service error",
  
  // Internal
  INTERNAL_ERROR: "An unexpected error occurred",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable"
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  AUDIO_UPLOADED: "Audio file uploaded successfully",
  AUDIO_PROCESSED: "Audio file processed successfully",
  AUDIO_TRANSCRIBED: "Audio file transcribed successfully",
  AUDIO_ANALYZED: "Audio file analyzed successfully",
  AUDIO_DELETED: "Audio file deleted successfully",
  SUBSCRIPTION_CREATED: "Subscription created successfully",
  SUBSCRIPTION_CANCELLED: "Subscription cancelled successfully"
} as const
