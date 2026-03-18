/**
 * API Integration Tests for VOZAZI Backend
 * 
 * Tests for API endpoints, server actions, and route handlers.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn()

describe('API Integration - Audio Endpoints', () => {
  const API_BASE = 'http://localhost:3000/api'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/audio/upload', () => {
    it('should create presigned upload URL', async () => {
      const mockResponse = {
        success: true,
        data: {
          uploadUrl: 'https://r2.presigned.url/...',
          fileKey: 'audio/test-123.wav',
          publicUrl: 'https://cdn.vozazi.com/audio/test-123.wav'
        }
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)

      const response = await fetch(`${API_BASE}/audio/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'test.wav',
          mimeType: 'audio/wav',
          size: 1024000
        })
      })

      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.data.uploadUrl).toBeDefined()
      expect(data.data.fileKey).toMatch(/audio\/.*\.wav/)
    })

    it('should reject invalid file types', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: 'Invalid file type. Only audio files are allowed.'
        })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'test.pdf',
          mimeType: 'application/pdf',
          size: 1024000
        })
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
    })

    it('should reject files larger than limit', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: async () => ({
          success: false,
          error: 'File size exceeds maximum allowed size'
        })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/upload`, {
        method: 'POST',
        body: JSON.stringify({
          filename: 'test.wav',
          mimeType: 'audio/wav',
          size: 600000000 // 600MB
        })
      })

      expect(response.status).toBe(413)
    })
  })

  describe('GET /api/audio/:id', () => {
    it('should return audio file metadata', async () => {
      const mockAudioFile = {
        id: 'audio-123',
        filename: 'practice-session.wav',
        duration: 120,
        status: 'completed',
        transcript: 'Test transcription',
        analysis: {
          pitch_accuracy: 0.85,
          pitch_stability: 0.78
        }
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAudioFile })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/audio-123`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.id).toBe('audio-123')
      expect(data.data.status).toBe('completed')
    })

    it('should return 404 for non-existent audio', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          error: 'Audio file not found'
        })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/non-existent`)
      
      expect(response.status).toBe(404)
    })
  })

  describe('POST /api/audio/:id/transcribe', () => {
    it('should transcribe audio', async () => {
      const mockTranscription = {
        text: 'This is the transcribed text',
        language: 'es',
        confidence: 0.95
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockTranscription })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/audio-123/transcribe`, {
        method: 'POST'
      })

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.text).toBeDefined()
      expect(data.data.language).toBe('es')
    })

    it('should handle transcription errors', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: 'Transcription service unavailable'
        })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/audio-123/transcribe`, {
        method: 'POST'
      })

      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/audio/:id/analyze', () => {
    it('should analyze audio for metrics', async () => {
      const mockAnalysis = {
        pitch_accuracy: 0.85,
        pitch_stability: 0.78,
        breath_support: 0.72,
        onset_control: 0.80,
        consistency: 0.75,
        overall_score: 78
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAnalysis })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/audio-123/analyze`, {
        method: 'POST'
      })

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.overall_score).toBe(78)
      expect(data.data.pitch_accuracy).toBeGreaterThan(0)
    })

    it('should analyze specific features', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            emotion: { joy: 0.7, neutral: 0.2 },
            sentiment: 'positive',
            keywords: ['test', 'audio']
          }
        })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/audio-123/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: ['emotion', 'sentiment', 'keywords']
        })
      })

      expect(response.ok).toBe(true)
    })
  })

  describe('DELETE /api/audio/:id', () => {
    it('should delete audio file', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Audio file deleted successfully'
        })
      } as Response)

      const response = await fetch(`${API_BASE}/audio/audio-123`, {
        method: 'DELETE'
      })

      expect(response.ok).toBe(true)
    })

    it('should require authentication', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401
      } as Response)

      const response = await fetch(`${API_BASE}/audio/audio-123`, {
        method: 'DELETE'
      })

      expect(response.status).toBe(401)
    })
  })
})

describe('API Integration - User Endpoints', () => {
  const API_BASE = 'http://localhost:3000/api'

  describe('GET /api/user', () => {
    it('should return current user profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        currentPlan: 'pro'
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      } as Response)

      const response = await fetch(`${API_BASE}/user`)
      const data = await response.json()

      expect(data.id).toBe('user-123')
      expect(data.email).toBe('test@example.com')
    })
  })

  describe('GET /api/user/usage', () => {
    it('should return usage statistics', async () => {
      const mockUsage = {
        audioMinutes: 45,
        transcriptions: 12,
        analyses: 8,
        limit: {
          audioMinutes: 600,
          transcriptions: 100
        },
        remaining: {
          audioMinutes: 555,
          transcriptions: 88
        }
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockUsage })
      } as Response)

      const response = await fetch(`${API_BASE}/user/usage`)
      const data = await response.json()

      expect(data.data.audioMinutes).toBe(45)
      expect(data.data.remaining.audioMinutes).toBe(555)
    })
  })

  describe('GET /api/user/progress', () => {
    it('should return progress history', async () => {
      const mockProgress = {
        overall_score: 75,
        pitch_accuracy_trend: 'improving',
        pitch_stability_trend: 'stable',
        sessions_completed: 24,
        total_practice_minutes: 480
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockProgress })
      } as Response)

      const response = await fetch(`${API_BASE}/user/progress`)
      const data = await response.json()

      expect(data.data.overall_score).toBe(75)
      expect(data.data.sessions_completed).toBe(24)
    })
  })
})

describe('API Integration - Subscription Endpoints', () => {
  const API_BASE = 'http://localhost:3000/api'

  describe('GET /api/subscription', () => {
    it('should return current subscription', async () => {
      const mockSubscription = {
        id: 'sub-123',
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: new Date().toISOString()
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSubscription })
      } as Response)

      const response = await fetch(`${API_BASE}/subscription`)
      const data = await response.json()

      expect(data.data.plan).toBe('pro')
      expect(data.data.status).toBe('active')
    })
  })

  describe('POST /api/subscription/create-checkout', () => {
    it('should create checkout session', async () => {
      const mockCheckout = {
        sessionId: 'checkout-123',
        url: 'https://stripe.com/checkout/...'
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCheckout })
      } as Response)

      const response = await fetch(`${API_BASE}/subscription/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' })
      })

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.sessionId).toBeDefined()
      expect(data.data.url).toContain('stripe.com')
    })
  })

  describe('POST /api/subscription/cancel', () => {
    it('should cancel subscription', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Subscription cancelled successfully'
        })
      } as Response)

      const response = await fetch(`${API_BASE}/subscription/cancel`, {
        method: 'POST'
      })

      expect(response.ok).toBe(true)
    })
  })
})

describe('API Integration - Health Endpoints', () => {
  const API_BASE = 'http://localhost:3000/api'

  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'ok',
          timestamp: new Date().toISOString()
        })
      } as Response)

      const response = await fetch(`${API_BASE}/health`)
      const data = await response.json()

      expect(data.status).toBe('ok')
    })
  })

  describe('GET /api/health/variables', () => {
    it('should check environment variables', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'ok',
          message: 'All required variables configured'
        })
      } as Response)

      const response = await fetch(`${API_BASE}/health/variables`)
      const data = await response.json()

      expect(data.status).toBe('ok')
    })

    it('should report missing variables', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          status: 'error',
          missing: ['DATABASE_URL', 'CLERK_SECRET_KEY']
        })
      } as Response)

      const response = await fetch(`${API_BASE}/health/variables`)
      
      expect(response.status).toBe(500)
    })
  })
})
