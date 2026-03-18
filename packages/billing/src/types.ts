/**
 * Billing Types for VOZAZI
 * 
 * Tipos relacionados con billing y suscripciones.
 */

import { z } from 'zod'

// ============================================================================
// Plan Types
// ============================================================================

export const PlanTypeSchema = z.enum(['free', 'pro', 'enterprise'])
export type PlanType = z.infer<typeof PlanTypeSchema>

export const PlanFeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  included: z.boolean()
})
export type PlanFeature = z.infer<typeof PlanFeatureSchema>

export const PlanLimitSchema = z.object({
  audioMinutesPerMonth: z.number().int().nonnegative(),
  maxFileSize: z.number().int().positive(),
  maxConcurrentProcessing: z.number().int().positive(),
  maxStorageGB: z.number().int().positive(),
  features: z.array(z.string())
})
export type PlanLimit = z.infer<typeof PlanLimitSchema>

export const PlanPricingSchema = z.object({
  monthly: z.number().positive(),
  yearly: z.number().positive(),
  currency: z.string().default('USD')
})
export type PlanPricing = z.infer<typeof PlanPricingSchema>

export const PlanSchema = z.object({
  id: z.string(),
  type: PlanTypeSchema,
  name: z.string(),
  description: z.string(),
  pricing: PlanPricingSchema,
  limits: PlanLimitSchema,
  features: z.array(PlanFeatureSchema),
  popular: z.boolean().default(false),
  stripePriceId: z.string().optional()
})
export type Plan = z.infer<typeof PlanSchema>

// ============================================================================
// Subscription Types
// ============================================================================

export const SubscriptionStatusSchema = z.enum([
  'active',
  'inactive',
  'trialing',
  'past_due',
  'canceled',
  'unpaid'
])
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>

export const BillingCycleSchema = z.enum(['monthly', 'yearly'])
export type BillingCycle = z.infer<typeof BillingCycleSchema>

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  planId: z.string(),
  status: SubscriptionStatusSchema,
  billingCycle: BillingCycleSchema,
  currentPeriodStart: z.number().positive(),
  currentPeriodEnd: z.number().positive(),
  cancelAtPeriodEnd: z.boolean().default(false),
  canceledAt: z.number().positive().optional(),
  cancelReason: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  createdAt: z.number().positive(),
  updatedAt: z.number().positive()
})
export type Subscription = z.infer<typeof SubscriptionSchema>

// ============================================================================
// Usage Types
// ============================================================================

export const UsagePeriodSchema = z.object({
  start: z.number().positive(),
  end: z.number().positive()
})
export type UsagePeriod = z.infer<typeof UsagePeriodSchema>

export const UsageStatsSchema = z.object({
  audioMinutes: z.number().int().nonnegative(),
  transcriptions: z.number().int().nonnegative(),
  analyses: z.number().int().nonnegative(),
  storageUsed: z.number().int().nonnegative()
})
export type UsageStats = z.infer<typeof UsageStatsSchema>

export const UsageWithLimitSchema = z.object({
  stats: UsageStatsSchema,
  limits: PlanLimitSchema,
  remaining: UsageStatsSchema,
  percentageUsed: z.object({
    audioMinutes: z.number().min(0).max(100),
    transcriptions: z.number().min(0).max(100),
    analyses: z.number().min(0).max(100),
    storage: z.number().min(0).max(100)
  })
})
export type UsageWithLimit = z.infer<typeof UsageWithLimitSchema>

// ============================================================================
// Checkout Types
// ============================================================================

export const CheckoutSessionSchema = z.object({
  sessionId: z.string(),
  url: z.string().url(),
  planId: z.string(),
  expiresAt: z.number().positive()
})
export type CheckoutSession = z.infer<typeof CheckoutSessionSchema>

export const PortalSessionSchema = z.object({
  sessionId: z.string(),
  url: z.string().url(),
  expiresAt: z.number().positive()
})
export type PortalSession = z.infer<typeof PortalSessionSchema>

// ============================================================================
// Invoice Types
// ============================================================================

export const InvoiceStatusSchema = z.enum(['draft', 'open', 'paid', 'uncollectible', 'void'])
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  subscriptionId: z.string().uuid(),
  status: InvoiceStatusSchema,
  amount: z.number().positive(),
  currency: z.string(),
  periodStart: z.number().positive(),
  periodEnd: z.number().positive(),
  invoiceUrl: z.string().url().optional(),
  paidAt: z.number().positive().optional(),
  createdAt: z.number().positive()
})
export type Invoice = z.infer<typeof InvoiceSchema>
