import { z } from "zod"

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  role: z.enum(["admin", "user", "premium"]),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateUserSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional()
})

// Audio file schemas
export const AudioFileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  duration: z.number().int().nullable(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  storageKey: z.string(),
  publicUrl: z.string().url().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  transcript: z.string().nullable(),
  analysis: z.record(z.unknown()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateAudioFileSchema = z.object({
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  storageKey: z.string()
})

export const UpdateAudioFileSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
  duration: z.number().int().positive().optional(),
  transcript: z.string().optional(),
  analysis: z.record(z.unknown()).optional(),
  publicUrl: z.string().url().optional()
})

// Subscription schemas
export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  stripeCustomerId: z.string().nullable(),
  stripeSubscriptionId: z.string().nullable(),
  plan: z.enum(["free", "pro", "enterprise"]),
  status: z.string(),
  currentPeriodStart: z.date().nullable(),
  currentPeriodEnd: z.date().nullable(),
  cancelAtPeriodEnd: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateSubscriptionSchema = z.object({
  userId: z.string().uuid(),
  plan: z.enum(["free", "pro", "enterprise"]),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional()
})

// Usage schemas
export const UsageSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  audioMinutes: z.number().int().nonnegative(),
  transcriptions: z.number().int().nonnegative(),
  analyses: z.number().int().nonnegative(),
  periodStart: z.date(),
  periodEnd: z.date(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Audio processing schemas
export const ProcessAudioRequestSchema = z.object({
  audioFileId: z.string().uuid()
})

export const ProcessAudioResponseSchema = z.object({
  success: z.boolean(),
  audioFileId: z.string().uuid(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  message: z.string().optional()
})

export const TranscribeAudioRequestSchema = z.object({
  audioFileId: z.string().uuid(),
  language: z.string().optional()
})

export const TranscribeAudioResponseSchema = z.object({
  success: z.boolean(),
  transcript: z.string(),
  confidence: z.number().min(0).max(1).optional(),
  language: z.string().optional()
})

export const AnalyzeAudioRequestSchema = z.object({
  audioFileId: z.string().uuid(),
  features: z.array(z.enum(["emotion", "sentiment", "speaker", "keywords"])).optional()
})

export const AnalyzeAudioResponseSchema = z.object({
  success: z.boolean(),
  analysis: z.object({
    emotion: z.record(z.number()).optional(),
    sentiment: z.string().optional(),
    speakers: z.number().optional(),
    keywords: z.array(z.string()).optional(),
    summary: z.string().optional()
  })
})

// API response schemas
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional()
  })

export const PaginatedResponseSchema = <T extends z.ZodType>(dataSchema: z.ZodArray<T>) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative()
    })
  })

// Type exports
export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type AudioFile = z.infer<typeof AudioFileSchema>
export type CreateAudioFile = z.infer<typeof CreateAudioFileSchema>
export type UpdateAudioFile = z.infer<typeof UpdateAudioFileSchema>
export type Subscription = z.infer<typeof SubscriptionSchema>
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>
export type Usage = z.infer<typeof UsageSchema>
export type ProcessAudioRequest = z.infer<typeof ProcessAudioRequestSchema>
export type ProcessAudioResponse = z.infer<typeof ProcessAudioResponseSchema>
export type TranscribeAudioRequest = z.infer<typeof TranscribeAudioRequestSchema>
export type TranscribeAudioResponse = z.infer<typeof TranscribeAudioResponseSchema>
export type AnalyzeAudioRequest = z.infer<typeof AnalyzeAudioRequestSchema>
export type AnalyzeAudioResponse = z.infer<typeof AnalyzeAudioResponseSchema>
