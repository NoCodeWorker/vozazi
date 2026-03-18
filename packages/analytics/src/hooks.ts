/**
 * React Hooks for Analytics
 */

'use client'

import { useEffect } from 'react'
import { identifyUser, resetAnalytics, getPostHog, isInitialized } from './posthog'
import type { AnalyticsEvent } from './events'

/**
 * Hook to track analytics events
 */
export function useAnalytics() {
  /**
   * Track an analytics event
   */
  function track(event: AnalyticsEvent): void {
    if (!isInitialized()) {
      console.debug('Analytics not initialized, skipping track')
      return
    }

    getPostHog().capture(event.event, event.properties)
  }

  /**
   * Identify the current user
   */
  function identify(userId: string, properties?: Record<string, unknown>): void {
    identifyUser(userId, properties)
  }

  /**
   * Reset analytics (for logout)
   */
  function reset(): void {
    resetAnalytics()
  }

  return {
    track,
    identify,
    reset,
    isInitialized
  }
}

/**
 * Hook to track page views
 */
export function usePageViewTracking(path: string): void {
  useEffect(() => {
    if (!isInitialized()) {
      return
    }

    getPostHog().capture('$pageview', {
      $current_url: window.location.href,
      $pathname: path
    })
  }, [path])
}

/**
 * Hook to track specific user actions
 */
export function useActionTracking(actions: Record<string, () => void>) {
  const { track } = useAnalytics()

  const trackedActions: Record<string, () => void> = {}

  Object.entries(actions).forEach(([actionName, action]) => {
    trackedActions[actionName] = () => {
      track({
        event: 'action_performed',
        properties: {
          action: actionName,
          timestamp: Date.now()
        }
      } as AnalyticsEvent)
      
      action()
    }
  })

  return trackedActions
}

/**
 * Hook to track session timing
 */
export function useSessionTracking(sessionId: string) {
  const { track } = useAnalytics()

  useEffect(() => {
    const startTime = Date.now()

    // Track session start
    track({
      event: 'session_started',
      properties: {
        sessionId,
        startTime
      }
    } as AnalyticsEvent)

    return () => {
      const duration = Date.now() - startTime
      
      // Track session end
      track({
        event: 'session_ended',
        properties: {
          sessionId,
          duration
        }
      } as AnalyticsEvent)
    }
  }, [sessionId])
}
