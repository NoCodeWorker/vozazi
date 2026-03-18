/**
 * API Route Tests for VOZAZI Health Endpoints
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../api/health/route'

// Mock MCP clients
vi.mock('@/lib/clerk-mcp', () => ({
  clerkMCP: {
    healthCheck: vi.fn()
  }
}))

vi.mock('@/lib/stripe-mcp', () => ({
  stripeMCP: {
    healthCheck: vi.fn()
  }
}))

describe('Health API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/health', () => {
    it('returns healthy status when all services are healthy', async () => {
      const { clerkMCP } = await import('@/lib/clerk-mcp')
      const { stripeMCP } = await import('@/lib/stripe-mcp')
      
      vi.mocked(clerkMCP.healthCheck).mockResolvedValue({ status: 'healthy', service: 'clerk' })
      vi.mocked(stripeMCP.healthCheck).mockResolvedValue({ status: 'healthy', service: 'stripe' })
      
      // Mock fetch for audio engine
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        } as Response)
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.services).toBeDefined()
    })

    it('returns degraded status when clerk is unhealthy', async () => {
      const { clerkMCP } = await import('@/lib/clerk-mcp')
      const { stripeMCP } = await import('@/lib/stripe-mcp')
      
      vi.mocked(clerkMCP.healthCheck).mockResolvedValue({ 
        status: 'unhealthy', 
        service: 'clerk',
        error: 'Test error'
      })
      vi.mocked(stripeMCP.healthCheck).mockResolvedValue({ status: 'healthy', service: 'stripe' })

      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: true } as Response)
      )

      const response = await GET()

      expect(response.status).toBe(503)
      const data = await response.json()
      expect(data.status).toBe('degraded')
    })

    it('returns degraded status when stripe is unhealthy', async () => {
      const { clerkMCP } = await import('@/lib/clerk-mcp')
      const { stripeMCP } = await import('@/lib/stripe-mcp')
      
      vi.mocked(clerkMCP.healthCheck).mockResolvedValue({ status: 'healthy', service: 'clerk' })
      vi.mocked(stripeMCP.healthCheck).mockResolvedValue({ 
        status: 'unhealthy', 
        service: 'stripe',
        error: 'Test error'
      })

      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: true } as Response)
      )

      const response = await GET()

      expect(response.status).toBe(503)
    })

    it('returns degraded status when audio engine is unavailable', async () => {
      const { clerkMCP } = await import('@/lib/clerk-mcp')
      const { stripeMCP } = await import('@/lib/stripe-mcp')
      
      vi.mocked(clerkMCP.healthCheck).mockResolvedValue({ status: 'healthy', service: 'clerk' })
      vi.mocked(stripeMCP.healthCheck).mockResolvedValue({ status: 'healthy', service: 'stripe' })

      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: false, status: 503 } as Response)
      )

      const response = await GET()

      expect(response.status).toBe(503)
    })

    it('includes timestamp in response', async () => {
      const { clerkMCP } = await import('@/lib/clerk-mcp')
      const { stripeMCP } = await import('@/lib/stripe-mcp')
      
      vi.mocked(clerkMCP.healthCheck).mockResolvedValue({ status: 'healthy', service: 'clerk' })
      vi.mocked(stripeMCP.healthCheck).mockResolvedValue({ status: 'healthy', service: 'stripe' })

      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: true } as Response)
      )

      const response = await GET()
      const data = await response.json()

      expect(data.timestamp).toBeDefined()
      expect(new Date(data.timestamp).getTime()).toBeLessThanOrEqual(Date.now())
    })
  })
})
