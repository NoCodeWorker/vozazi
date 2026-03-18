/**
 * MSW (Mock Service Worker) Handlers for VOZAZI API
 */

import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// ============================================================================
// Mock Data
// ============================================================================

const mockUser = {
  id: 'user_test_123',
  clerkId: 'clerk_test_123',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.png',
  role: 'user' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockAudioFiles = [
  {
    id: 'audio_test_1',
    userId: 'user_test_123',
    filename: 'meeting-recording.wav',
    originalName: 'meeting-recording.wav',
    mimeType: 'audio/wav',
    size: 1024000,
    duration: 120,
    status: 'completed' as const,
    storageKey: 'audio/meeting-recording.wav',
    publicUrl: 'https://example.com/audio/meeting-recording.wav',
    transcript: 'This is a test transcription of the meeting.',
    analysis: {
      sentiment: 'positive',
      keywords: ['meeting', 'project', 'deadline'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'audio_test_2',
    userId: 'user_test_123',
    filename: 'interview.wav',
    originalName: 'interview.wav',
    mimeType: 'audio/wav',
    size: 2048000,
    duration: 300,
    status: 'processing' as const,
    storageKey: 'audio/interview.wav',
    publicUrl: null,
    transcript: null,
    analysis: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const mockSubscription = {
  id: 'sub_test_123',
  userId: 'user_test_123',
  stripeCustomerId: 'cus_test_123',
  stripeSubscriptionId: 'sub_test_123',
  plan: 'pro' as const,
  status: 'active',
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  cancelAtPeriodEnd: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockUsage = {
  audioMinutes: 45,
  transcriptions: 12,
  analyses: 8,
  limit: {
    audioMinutes: 600,
    transcriptions: 100,
    analyses: 100,
  },
  remaining: {
    audioMinutes: 555,
    transcriptions: 88,
    analyses: 92,
  },
}

// ============================================================================
// Handlers
// ============================================================================

export const handlers = [
  // Health endpoint
  http.get(`${API_BASE_URL}/health`, async () => {
    await delay(100)
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        clerk: { status: 'healthy' },
        stripe: { status: 'healthy' },
        audioEngine: { status: 'healthy' },
      },
    })
  }),

  // User endpoint
  http.get(`${API_BASE_URL}/user`, async () => {
    await delay(200)
    return HttpResponse.json(mockUser)
  }),

  // Audio files endpoints
  http.get(`${API_BASE_URL}/audio`, async ({ request }) => {
    await delay(300)
    
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10
    
    return HttpResponse.json({
      success: true,
      data: mockAudioFiles.slice((page - 1) * limit, page * limit),
      pagination: {
        page,
        limit,
        total: mockAudioFiles.length,
        totalPages: Math.ceil(mockAudioFiles.length / limit),
      },
    })
  }),

  http.get(`${API_BASE_URL}/audio/:id`, async ({ params }) => {
    await delay(200)
    
    const { id } = params
    const audioFile = mockAudioFiles.find((f) => f.id === id)
    
    if (!audioFile) {
      return HttpResponse.json(
        { success: false, error: 'Audio file not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ success: true, data: audioFile })
  }),

  http.post(`${API_BASE_URL}/audio`, async () => {
    await delay(500)
    
    return HttpResponse.json({
      success: true,
      data: {
        id: 'audio_new_123',
        filename: 'new-recording.wav',
        status: 'pending',
        uploadUrl: 'https://example.com/upload/presigned-url',
      },
    })
  }),

  http.delete(`${API_BASE_URL}/audio/:id`, async ({ params }) => {
    await delay(200)
    
    return HttpResponse.json({
      success: true,
      message: 'Audio file deleted successfully',
    })
  }),

  // Transcription endpoint
  http.post(`${API_BASE_URL}/audio/:id/transcribe`, async ({ params }) => {
    await delay(1000)
    
    return HttpResponse.json({
      success: true,
      data: {
        transcript: 'This is the transcribed text.',
        language: 'es',
        confidence: 0.95,
      },
    })
  }),

  // Analysis endpoint
  http.post(`${API_BASE_URL}/audio/:id/analyze`, async ({ params }) => {
    await delay(1500)
    
    return HttpResponse.json({
      success: true,
      data: {
        sentiment: 'positive',
        emotions: { joy: 0.7, neutral: 0.2, sadness: 0.1 },
        keywords: ['important', 'meeting', 'decision'],
        summary: 'This is a summary of the audio content.',
      },
    })
  }),

  // Subscription endpoints
  http.get(`${API_BASE_URL}/subscription`, async () => {
    await delay(200)
    return HttpResponse.json({ success: true, data: mockSubscription })
  }),

  http.post(`${API_BASE_URL}/subscription/create-checkout`, async () => {
    await delay(500)
    return HttpResponse.json({
      success: true,
      data: { sessionId: 'checkout_session_123', url: 'https://stripe.com/checkout/...' },
    })
  }),

  http.post(`${API_BASE_URL}/subscription/cancel`, async () => {
    await delay(500)
    return HttpResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
    })
  }),

  // Usage endpoint
  http.get(`${API_BASE_URL}/usage`, async () => {
    await delay(200)
    return HttpResponse.json({ success: true, data: mockUsage })
  }),

  // Storage endpoint
  http.post(`${API_BASE_URL}/storage/presigned`, async () => {
    await delay(300)
    return HttpResponse.json({
      success: true,
      data: {
        uploadUrl: 'https://r2.presigned.url/...',
        fileKey: 'audio/uploaded-file.wav',
        publicUrl: 'https://cdn.example.com/audio/uploaded-file.wav',
      },
    })
  }),
]

// ============================================================================
// Server Setup
// ============================================================================

export const server = setupServer(...handlers)
