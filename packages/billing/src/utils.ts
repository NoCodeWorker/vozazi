/**
 * Billing Utilities
 */

import type { UsageStats, PlanLimit, UsageWithLimit } from './types'
import { calculatePercentageUsed, calculateRemaining } from './plans'

/**
 * Calculate usage with limits
 */
export function calculateUsageWithLimit(
  stats: UsageStats,
  limits: PlanLimit
): UsageWithLimit {
  return {
    stats,
    limits,
    remaining: {
      audioMinutes: calculateRemaining(stats.audioMinutes, limits.audioMinutesPerMonth),
      transcriptions: calculateRemaining(stats.transcriptions, limits.maxConcurrentProcessing),
      analyses: calculateRemaining(stats.analyses, limits.maxConcurrentProcessing),
      storageUsed: calculateRemaining(stats.storageUsed, limits.maxStorageGB * 1024 * 1024 * 1024)
    },
    percentageUsed: {
      audioMinutes: calculatePercentageUsed(stats.audioMinutes, limits.audioMinutesPerMonth),
      transcriptions: calculatePercentageUsed(stats.transcriptions, limits.maxConcurrentProcessing),
      analyses: calculatePercentageUsed(stats.analyses, limits.maxConcurrentProcessing),
      storage: calculatePercentageUsed(stats.storageUsed, limits.maxStorageGB * 1024 * 1024 * 1024)
    }
  }
}

/**
 * Check if usage exceeds limits
 */
export function hasExceededLimit(stats: UsageStats, limits: PlanLimit): boolean {
  if (limits.audioMinutesPerMonth >= 0 && stats.audioMinutes > limits.audioMinutesPerMonth) {
    return true
  }
  if (stats.transcriptions > limits.maxConcurrentProcessing * 100) {
    return true
  }
  if (stats.analyses > limits.maxConcurrentProcessing * 100) {
    return true
  }
  if (stats.storageUsed > limits.maxStorageGB * 1024 * 1024 * 1024) {
    return true
  }
  return false
}

/**
 * Get next billing date
 */
export function getNextBillingDate(currentPeriodEnd: number): Date {
  return new Date(currentPeriodEnd * 1000)
}

/**
 * Check if subscription is active
 */
export function isActiveSubscription(status: string): boolean {
  const activeStatuses = ['active', 'trialing']
  return activeStatuses.includes(status)
}

/**
 * Calculate days until billing
 */
export function daysUntilBilling(currentPeriodEnd: number): number {
  const now = Date.now()
  const end = currentPeriodEnd * 1000
  const diff = end - now
  
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
