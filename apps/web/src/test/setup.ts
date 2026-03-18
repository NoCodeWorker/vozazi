import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './handlers'

// ============================================================================
// MSW Server Setup
// ============================================================================

beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
    server.resetHandlers()
    cleanup()
})

afterAll(() => {
    server.close()
})

// ============================================================================
// Mock Window APIs
// ============================================================================

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock window.scrollTo
window.scrollTo = vi.fn()

// ============================================================================
// Mock IntersectionObserver
// ============================================================================

global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    takeRecords() {
        return []
    }
    unobserve() { }
} as unknown as typeof IntersectionObserver

// ============================================================================
// Mock ResizeObserver
// ============================================================================

global.ResizeObserver = class ResizeObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
} as unknown as typeof ResizeObserver

// ============================================================================
// Mock Clipboard API
// ============================================================================

Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(),
        readText: vi.fn(),
    },
})

// ============================================================================
// Mock localStorage
// ============================================================================

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
}

global.localStorage = localStorageMock as unknown as Storage

// ============================================================================
// Mock Environment Variables
// ============================================================================

process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_test'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'
process.env.NEXT_PUBLIC_AUDIO_ENGINE_URL = 'http://localhost:8000'

// ============================================================================
// Suppress Console Errors in Tests
// ============================================================================

const originalError = console.error
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        // Suppress specific error messages
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
                args[0].includes('Warning: unmountComponentAtNode is no longer supported'))
        ) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})

