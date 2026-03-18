/**
 * Event Definitions for VOZAZI Analytics
 * 
 * Definiciones de eventos para trackear en el producto.
 */

// ============================================================================
// Event Types
// ============================================================================

export type AuthEvent = 
  | { event: 'auth_signed_in'; properties: { method: string } }
  | { event: 'auth_signed_out' }
  | { event: 'auth_signup_completed'; properties: { method: string } }
  | { event: 'auth_password_reset'; properties: { success: boolean } }

export type OnboardingEvent =
  | { event: 'onboarding_started' }
  | { event: 'onboarding_step_completed'; properties: { step: string; data: Record<string, unknown> } }
  | { event: 'onboarding_completed'; properties: { duration: number; stepsCompleted: number } }
  | { event: 'onboarding_abandoned'; properties: { lastStep: string } }

export type SessionEvent =
  | { event: 'session_started'; properties: { sessionId: string; exerciseType: string } }
  | { event: 'session_completed'; properties: { sessionId: string; duration: number; score: number } }
  | { event: 'session_failed'; properties: { sessionId: string; error: string } }
  | { event: 'session_cancelled'; properties: { sessionId: string; reason: string } }

export type ExerciseEvent =
  | { event: 'exercise_started'; properties: { exerciseType: string; difficulty: number } }
  | { event: 'exercise_completed'; properties: { exerciseType: string; score: number; duration: number } }
  | { event: 'exercise_failed'; properties: { exerciseType: string; error: string } }
  | { event: 'exercise_repeated'; properties: { exerciseType: string; attempt: number } }

export type TaskEvent =
  | { event: 'task_generated'; properties: { taskId: string; exerciseType: string; difficulty: number } }
  | { event: 'task_started'; properties: { taskId: string } }
  | { event: 'task_completed'; properties: { taskId: string; score: number } }
  | { event: 'task_failed'; properties: { taskId: string; reason: string } }
  | { event: 'task_expired'; properties: { taskId: string } }

export type SubscriptionEvent =
  | { event: 'subscription_started'; properties: { plan: string; trial: boolean } }
  | { event: 'subscription_renewed'; properties: { plan: string } }
  | { event: 'subscription_canceled'; properties: { plan: string; reason?: string } }
  | { event: 'subscription_upgraded'; properties: { fromPlan: string; toPlan: string } }
  | { event: 'subscription_downgraded'; properties: { fromPlan: string; toPlan: string } }

export type ProgressEvent =
  | { event: 'weekly_summary_generated'; properties: { overallScore: number; trend: string } }
  | { event: 'monthly_summary_generated'; properties: { overallScore: number; improvements: string[] } }
  | { event: 'milestone_reached'; properties: { milestone: string; value: number } }

export type LibraryEvent =
  | { event: 'library_article_viewed'; properties: { slug: string; category: string } }
  | { event: 'library_search'; properties: { query: string; resultsCount: number } }
  | { event: 'library_bookmark'; properties: { slug: string } }

export type BillingEvent =
  | { event: 'billing_page_viewed' }
  | { event: 'checkout_started'; properties: { plan: string } }
  | { event: 'checkout_completed'; properties: { plan: string; amount: number } }
  | { event: 'checkout_abandoned'; properties: { plan: string } }

export type ErrorEvent =
  | { event: 'error_encountered'; properties: { error: string; context: string; severity: 'low' | 'medium' | 'high' } }

// ============================================================================
// Union Type
// ============================================================================

export type AnalyticsEvent = 
  | AuthEvent
  | OnboardingEvent
  | SessionEvent
  | ExerciseEvent
  | TaskEvent
  | SubscriptionEvent
  | ProgressEvent
  | LibraryEvent
  | BillingEvent
  | ErrorEvent

// ============================================================================
// Event Helpers
// ============================================================================

/**
 * Create an analytics event with type safety
 */
export function createEvent<T extends AnalyticsEvent>(event: T): T {
  return event
}

/**
 * Event categories for grouping
 */
export const EventCategory = {
  AUTH: 'auth',
  ONBOARDING: 'onboarding',
  SESSION: 'session',
  EXERCISE: 'exercise',
  TASK: 'task',
  SUBSCRIPTION: 'subscription',
  PROGRESS: 'progress',
  LIBRARY: 'library',
  BILLING: 'billing',
  ERROR: 'error'
} as const

/**
 * Get category from event
 */
export function getEventCategory(eventName: string): string {
  const category = eventName.split('_')[0]
  return EventCategory[category as keyof typeof EventCategory] || 'unknown'
}
