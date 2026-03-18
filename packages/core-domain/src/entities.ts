/**
 * Core Domain Entities for VOZAZI
 * 
 * Entidades de dominio puras, sin dependencias externas.
 */

import { z } from 'zod'

// ============================================================================
// Value Objects
// ============================================================================

export const NoteSchema = z.string().regex(/^[A-G][b#]?\d+$/)
export type Note = z.infer<typeof NoteSchema>

export const FrequencySchema = z.number().positive()
export type Frequency = z.infer<typeof FrequencySchema>

export const CentsSchema = z.number().min(-100).max(100)
export type Cents = z.infer<typeof CentsSchema>

export const ScoreSchema = z.number().min(0).max(100)
export type Score = z.infer<typeof ScoreSchema>

export const DurationSchema = z.number().positive()
export type Duration = z.infer<typeof DurationSchema>

// ============================================================================
// Audio Entities
// ============================================================================

export const AudioChunkSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  data: z.instanceof(Float32Array),
  sampleRate: z.number().positive(),
  timestamp: z.number().positive(),
  duration: DurationSchema
})
export type AudioChunk = z.infer<typeof AudioChunkSchema>

export const PitchDataSchema = z.object({
  frequency: FrequencySchema,
  note: NoteSchema,
  cents: CentsSchema,
  confidence: z.number().min(0).max(1),
  timestamp: z.number().positive()
})
export type PitchData = z.infer<typeof PitchDataSchema>

export const AudioMetricsSchema = z.object({
  pitchAccuracy: z.number().min(0).max(1),
  pitchStability: z.number().min(0).max(1),
  breathSupport: z.number().min(0).max(1),
  onsetControl: z.number().min(0).max(1),
  consistency: z.number().min(0).max(1)
})
export type AudioMetrics = z.infer<typeof AudioMetricsSchema>

// ============================================================================
// Exercise Entities
// ============================================================================

export const ExerciseTypeSchema = z.enum([
  'sustain_note',
  'pitch_target',
  'scale_run',
  'interval_jump',
  'vibrato_control',
  'breath_control',
  'resonance_shift',
  'register_bridge',
  'phrase_singing',
  'dynamic_variation',
  'clean_onset'
])
export type ExerciseType = z.infer<typeof ExerciseTypeSchema>

export const ExerciseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  type: ExerciseTypeSchema,
  name: z.string(),
  description: z.string(),
  difficultyLevel: z.number().int().min(1).max(10),
  targetNote: NoteSchema.optional(),
  targetRange: z.object({
    low: NoteSchema,
    high: NoteSchema
  }).optional(),
  durationSeconds: DurationSchema,
  repetitions: z.number().int().positive(),
  successCriteria: z.record(z.unknown()),
  prerequisites: z.array(z.string()).default([])
})
export type Exercise = z.infer<typeof ExerciseSchema>

// ============================================================================
// Session Entities
// ============================================================================

export const SessionStatusSchema = z.enum([
  'idle',
  'preparing',
  'recording',
  'processing',
  'completed',
  'failed',
  'cancelled'
])
export type SessionStatus = z.infer<typeof SessionStatusSchema>

export const SessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  taskId: z.string().uuid().optional(),
  status: SessionStatusSchema,
  startedAt: z.number().positive().optional(),
  endedAt: z.number().positive().optional(),
  durationSeconds: DurationSchema.optional(),
  exerciseType: ExerciseTypeSchema,
  overallScore: ScoreSchema.optional(),
  metrics: AudioMetricsSchema.optional()
})
export type Session = z.infer<typeof SessionSchema>

// ============================================================================
// Task Entities
// ============================================================================

export const TaskStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'failed',
  'expired'
])
export type TaskStatus = z.infer<typeof TaskStatusSchema>

export const TaskSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: TaskStatusSchema,
  exerciseId: z.string().uuid(),
  exerciseCode: z.string(),
  primaryFocus: z.string(),
  secondaryFocus: z.string().optional(),
  difficultyLevel: z.number().int().min(1).max(10),
  priority: z.number().int().min(1).max(5),
  durationMinutes: DurationSchema,
  repetitions: z.number().int().positive(),
  successCriteria: z.record(z.unknown()),
  scheduledFor: z.number().positive().optional(),
  expiresAt: z.number().positive().optional()
})
export type Task = z.infer<typeof TaskSchema>

// ============================================================================
// Evaluation Entities
// ============================================================================

export const WeaknessTypeSchema = z.enum([
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
  'vowel_alignment',
  'attack_control',
  'pitch_stability'
])
export type WeaknessType = z.infer<typeof WeaknessTypeSchema>

export const ErrorClassificationSchema = z.enum([
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
export type ErrorClassification = z.infer<typeof ErrorClassificationSchema>

export const EvaluationSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  overallScore: ScoreSchema,
  dominantWeakness: WeaknessTypeSchema,
  secondaryWeakness: WeaknessTypeSchema.optional(),
  errorClassification: ErrorClassificationSchema.optional(),
  adaptiveDecision: z.string().optional(),
  techniqueFocus: z.string().optional()
})
export type Evaluation = z.infer<typeof EvaluationSchema>

// ============================================================================
// Progress Entities
// ============================================================================

export const TrendSchema = z.enum(['improving', 'stable', 'declining'])
export type Trend = z.infer<typeof TrendSchema>

export const ProgressSnapshotSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  snapshotType: z.enum(['daily', 'weekly', 'monthly']),
  periodStart: z.number().positive(),
  periodEnd: z.number().positive(),
  overallScore: ScoreSchema,
  pitchAccuracyTrend: TrendSchema,
  pitchStabilityTrend: TrendSchema,
  breathSupportTrend: TrendSchema,
  onsetControlTrend: TrendSchema,
  consistencyTrend: TrendSchema,
  dominantWeakness: WeaknessTypeSchema,
  strongSkill: z.string()
})
export type ProgressSnapshot = z.infer<typeof ProgressSnapshotSchema>

// ============================================================================
// User Profile Entities
// ============================================================================

export const VoiceTypeSchema = z.enum([
  'soprano',
  'mezzo',
  'alto',
  'tenor',
  'baritone',
  'bass',
  'unknown'
])
export type VoiceType = z.infer<typeof VoiceTypeSchema>

export const UserLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'professional'])
export type UserLevel = z.infer<typeof UserLevelSchema>

export const VocalProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  voiceType: VoiceTypeSchema,
  rangeLow: NoteSchema.optional(),
  rangeHigh: NoteSchema.optional(),
  currentLevel: UserLevelSchema,
  dominantWeakness: WeaknessTypeSchema.optional(),
  secondaryWeakness: WeaknessTypeSchema.optional(),
  strongSkill: z.string().optional(),
  fatigueRiskState: z.enum(['low', 'medium', 'high']).default('low'),
  adherenceState: z.enum(['excellent', 'good', 'fair', 'poor']).default('good')
})
export type VocalProfile = z.infer<typeof VocalProfileSchema>

// ============================================================================
// Domain Services Interfaces
// ============================================================================

export interface IAudioAnalysisService {
  analyzeChunk(chunk: AudioChunk): Promise<AudioMetrics>
  detectPitch(data: Float32Array, sampleRate: number): Promise<PitchData>
}

export interface IEvaluationService {
  evaluateSession(metrics: AudioMetrics, exercise: Exercise): Promise<Evaluation>
  calculateOverallScore(metrics: AudioMetrics): Score
  detectDominantWeakness(metrics: AudioMetrics): WeaknessType
}

export interface IAdaptiveTrainingService {
  generateNextTask(profile: VocalProfile, lastEvaluation: Evaluation): Promise<Task>
  adjustDifficulty(currentTask: Task, completed: boolean, score: Score): Task
}

// Export all schemas for validation
export const domainSchemas = {
  note: NoteSchema,
  frequency: FrequencySchema,
  cents: CentsSchema,
  score: ScoreSchema,
  duration: DurationSchema,
  audioChunk: AudioChunkSchema,
  pitchData: PitchDataSchema,
  audioMetrics: AudioMetricsSchema,
  exercise: ExerciseSchema,
  session: SessionSchema,
  task: TaskSchema,
  evaluation: EvaluationSchema,
  progressSnapshot: ProgressSnapshotSchema,
  vocalProfile: VocalProfileSchema
}
