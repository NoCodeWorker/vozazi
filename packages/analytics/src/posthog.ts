/**
 * PostHog Configuration and Client
 */

import posthog from 'posthog-js'

export interface PostHogConfig {
  apiKey: string
  host: string
  autocapture: boolean
  capture_pageview: boolean
  capture_pageleave: boolean
}

let initialized = false

/**
 * Initialize PostHog analytics
 */
export function initPostHog(config: PostHogConfig): void {
  if (initialized) {
    console.warn('PostHog already initialized')
    return
  }

  posthog.init(config.apiKey, {
    api_host: config.host,
    autocapture: config.autocapture,
    capture_pageview: config.capture_pageview,
    capture_pageleave: config.capture_pageleave,
    persistence: 'localStorage',
    bootstrap: {
      isIdentifiedId: false
    }
  })

  initialized = true
}

/**
 * Identify a user in PostHog
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (!initialized) {
    console.warn('PostHog not initialized')
    return
  }

  posthog.identify(userId, properties)
}

/**
 * Reset PostHog state (for logout)
 */
export function resetAnalytics(): void {
  if (!initialized) {
    return
  }

  posthog.reset()
}

/**
 * Get PostHog client instance
 */
export function getPostHog(): typeof posthog {
  return posthog
}

/**
 * Check if PostHog is initialized
 */
export function isInitialized(): boolean {
  return initialized
}
