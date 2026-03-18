/**
 * Pedagogy Types for VOZAZI
 * 
 * Tipos relacionados con pedagogía y feedback.
 */

import { z } from 'zod'

// ============================================================================
// Technique Types
// ============================================================================

export const TechniqueTypeSchema = z.enum([
  'pitch_control',
  'sustain_control',
  'breath_support',
  'clean_onset',
  'legato_transition',
  'register_mix',
  'vibrato_control',
  'resonance_balance',
  'dynamic_control',
  'intonation_accuracy',
  'phrase_stability',
  'vowel_alignment'
])
export type TechniqueType = z.infer<typeof TechniqueTypeSchema>

export const ErrorTypeSchema = z.enum([
  'flat_entry',
  'sharp_entry',
  'unstable_pitch',
  'pitch_drift',
  'irregular_vibrato',
  'delayed_onset',
  'breath_leak',
  'nasal_resonance',
  'throat_tension',
  'overcompression',
  'weak_support',
  'range_limit',
  'fatigue_pattern'
])
export type ErrorType = z.infer<typeof ErrorTypeSchema>

// ============================================================================
// Feedback Types
// ============================================================================

export const FeedbackTypeSchema = z.enum([
  'post_session',
  'post_exercise',
  'real_time',
  'weekly_summary',
  'milestone'
])
export type FeedbackType = z.infer<typeof FeedbackTypeSchema>

export const FeedbackToneSchema = z.enum([
  'encouraging',
  'neutral',
  'conservative',
  'urgent'
])
export type FeedbackTone = z.infer<typeof FeedbackToneSchema>

export const PedagogicalFeedbackSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  exerciseId: z.string().uuid().optional(),
  type: FeedbackTypeSchema,
  tone: FeedbackToneSchema,
  summary: z.string(),
  explanation: z.string(),
  recommendedNextStep: z.string(),
  commonCauses: z.array(z.string()).optional(),
  warningSignals: z.array(z.string()).optional(),
  recommendedExercises: z.array(z.string()).optional(),
  linkedDocs: z.array(z.string()).optional(),
  llmProvider: z.string().optional(),
  promptVersion: z.string().optional(),
  createdAt: z.number().positive()
})
export type PedagogicalFeedback = z.infer<typeof PedagogicalFeedbackSchema>

// ============================================================================
// Exercise Catalog Types
// ============================================================================

export const ExerciseCategorySchema = z.enum([
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
])
export type ExerciseCategory = z.infer<typeof ExerciseCategorySchema>

export const ExerciseLevelSchema = z.enum([
  'beginner',
  'foundation',
  'intermediate',
  'advanced',
  'professional'
])
export type ExerciseLevel = z.infer<typeof ExerciseLevelSchema>

export const ExerciseDefinitionSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  category: ExerciseCategorySchema,
  level: ExerciseLevelSchema,
  primaryTechnique: TechniqueTypeSchema,
  secondaryTechniques: z.array(TechniqueTypeSchema).optional(),
  addressesErrors: z.array(ErrorTypeSchema).optional(),
  durationSeconds: z.number().positive(),
  repetitions: z.number().int().positive(),
  restSeconds: z.number().positive().optional(),
  instructions: z.array(z.string()),
  tips: z.array(z.string()),
  warnings: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  linkedDocs: z.array(z.string()).optional()
})
export type ExerciseDefinition = z.infer<typeof ExerciseDefinitionSchema>

// ============================================================================
// Knowledge Base Types
// ============================================================================

export const DocCategorySchema = z.enum([
  'techniques',
  'anatomy',
  'problems',
  'health',
  'resources',
  'exercises',
  'faq'
])
export type DocCategory = z.infer<typeof DocCategorySchema>

export const DocRiskLevelSchema = z.enum(['low', 'medium', 'high'])
export type DocRiskLevel = z.infer<typeof DocRiskLevelSchema>

export const KnowledgeDocumentSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  category: DocCategorySchema,
  subcategory: z.string().optional(),
  title: z.string(),
  difficultyLevel: ExerciseLevelSchema.optional(),
  riskLevel: DocRiskLevelSchema.optional(),
  relatedTechniques: z.array(TechniqueTypeSchema).optional(),
  relatedErrors: z.array(ErrorTypeSchema).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  lastReviewedAt: z.number().positive().optional(),
  createdAt: z.number().positive(),
  updatedAt: z.number().positive()
})
export type KnowledgeDocument = z.infer<typeof KnowledgeDocumentSchema>

export const KnowledgeChunkSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  chunkIndex: z.number().int().nonnegative(),
  chunkType: z.enum(['definition', 'causes', 'symptoms', 'exercises', 'tips']),
  content: z.string(),
  metadata: z.record(z.unknown()).optional(),
  embeddingRef: z.string().optional(),
  createdAt: z.number().positive()
})
export type KnowledgeChunk = z.infer<typeof KnowledgeChunkSchema>

// ============================================================================
// LLM Context Types
// ============================================================================

export const LLMContextSchema = z.object({
  userId: z.string().uuid(),
  userLevel: ExerciseLevelSchema,
  sessionMetrics: z.record(z.number()).optional(),
  dominantWeakness: TechniqueTypeSchema.optional(),
  secondaryWeakness: TechniqueTypeSchema.optional(),
  detectedErrors: z.array(ErrorTypeSchema).optional(),
  recentProgress: z.array(z.object({
    date: z.number().positive(),
    score: z.number().min(0).max(100)
  })).optional(),
  fatigueRisk: z.enum(['low', 'medium', 'high']).optional(),
  linkedDocs: z.array(KnowledgeChunkSchema).optional(),
  exerciseHistory: z.array(z.object({
    exerciseId: z.string(),
    completedAt: z.number().positive(),
    score: z.number().min(0).max(100)
  })).optional()
})
export type LLMContext = z.infer<typeof LLMContextSchema>

// ============================================================================
// LLM Response Types
// ============================================================================

export const LLMResponseSchema = z.object({
  summary: z.string(),
  explanation: z.string(),
  recommendedNextStep: z.string(),
  commonCauses: z.array(z.string()).optional(),
  warningSignals: z.array(z.string()).optional(),
  recommendedExercises: z.array(z.string()).optional(),
  linkedDocs: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1).optional(),
  tone: FeedbackToneSchema
})
export type LLMResponse = z.infer<typeof LLMResponseSchema>
