/**
 * Test Utilities for VOZAZI Web App
 * 
 * Provides common test utilities, mocks, and helpers
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'

// ============================================================================
// Query Client for tests
// ============================================================================

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

// ============================================================================
// Providers
// ============================================================================

interface AllProvidersProps {
  children: ReactNode
}

function AllProviders({ children }: AllProvidersProps) {
  const queryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// ============================================================================
// Custom Render
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult {
  const renderResult = render(ui, {
    wrapper: AllProviders,
    ...options,
  })

  return {
    ...renderResult,
    rerender: (newUi: ReactElement) =>
      render(newUi, { wrapper: AllProviders, ...options }),
  }
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// ============================================================================
// Mock Utilities
// ============================================================================

/**
 * Creates a mock for Clerk authentication
 */
export const createClerkMock = () => ({
  user: {
    id: 'user_test_123',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
    firstName: 'Test',
    lastName: 'User',
    imageUrl: 'https://example.com/avatar.png',
  },
  isLoaded: true,
  isSignedIn: true,
})

/**
 * Creates a mock for Stripe
 */
export const createStripeMock = () => ({
  checkout: {
    redirectToCheckout: vi.fn().mockResolvedValue({ error: null }),
  },
})

/**
 * Creates mock audio file data
 */
export const createMockAudioFile = (overrides?: Partial<AudioFile>) => ({
  id: 'audio_test_123',
  userId: 'user_test_123',
  filename: 'test-audio.wav',
  originalName: 'test-recording.wav',
  mimeType: 'audio/wav',
  size: 1024000,
  duration: 120,
  status: 'completed' as const,
  storageKey: 'audio/test-123.wav',
  publicUrl: 'https://example.com/audio/test-123.wav',
  transcript: 'This is a test transcription',
  analysis: {
    sentiment: 'positive',
    keywords: ['test', 'audio'],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Creates mock user data
 */
export const createMockUser = (overrides?: Partial<User>) => ({
  id: 'user_test_123',
  clerkId: 'clerk_test_123',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.png',
  role: 'user' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Creates mock subscription data
 */
export const createMockSubscription = (overrides?: Partial<Subscription>) => ({
  id: 'sub_test_123',
  userId: 'user_test_123',
  stripeCustomerId: 'cus_test_123',
  stripeSubscriptionId: 'sub_test_123',
  plan: 'pro' as const,
  status: 'active',
  currentPeriodStart: new Date(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

// ============================================================================
// Wait Utilities
// ============================================================================

/**
 * Wait for a condition to be true
 */
export const waitForCondition = async (
  condition: () => boolean,
  timeout = 1000,
  interval = 50
): Promise<void> => {
  const startTime = Date.now()

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition')
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
}

/**
 * Wait for next tick
 */
export const waitForNextTick = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 0))

/**
 * Wait for specified milliseconds
 */
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

// ============================================================================
// Type Definitions
// ============================================================================

export interface AudioFile {
  id: string
  userId: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  duration: number | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  storageKey: string
  publicUrl: string | null
  transcript: string | null
  analysis: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  clerkId: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: 'admin' | 'user' | 'premium'
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  plan: 'free' | 'pro' | 'enterprise'
  status: string
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}
