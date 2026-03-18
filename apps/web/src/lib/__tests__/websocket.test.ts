/**
 * WebSocket Tests for VOZAZI Real-time Audio Streaming
 * 
 * Tests for WebSocket connections used in real-time audio analysis.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock WebSocket
class MockWebSocket {
  url: string
  readyState: number
  onopen: (() => void) | null = null
  onclose: (() => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null

  constructor(url: string) {
    this.url = url
    this.readyState = 0 // CONNECTING
  }

  send = vi.fn()
  close = vi.fn(() => {
    this.readyState = 3 // CLOSED
    this.onclose?.()
  })

  simulateOpen() {
    this.readyState = 1 // OPEN
    this.onopen?.()
  }

  simulateMessage(data: any) {
    this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(data) }))
  }

  simulateError() {
    this.onerror?.(new Event('error'))
  }
}

global.WebSocket = MockWebSocket as any

describe('WebSocket - Real-time Audio Streaming', () => {
  const WS_URL = 'ws://localhost:8000/ws/realtime'

  let ws: MockWebSocket

  beforeEach(() => {
    ws = new MockWebSocket(WS_URL)
  })

  afterEach(() => {
    ws.close()
    vi.clearAllMocks()
  })

  it('should establish WebSocket connection', () => {
    expect(ws.readyState).toBe(0) // CONNECTING

    ws.simulateOpen()

    expect(ws.readyState).toBe(1) // OPEN
  })

  it('should send audio chunks to server', () => {
    ws.simulateOpen()

    const audioChunk = new Uint8Array([0, 1, 2, 3])
    ws.send(JSON.stringify({
      type: 'audio_chunk',
      data: Array.from(audioChunk),
      timestamp: Date.now()
    }))

    expect(ws.send).toHaveBeenCalled()
  })

  it('should receive real-time pitch feedback', () => {
    const feedbackHandler = vi.fn()

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'pitch_feedback') {
        feedbackHandler(data)
      }
    }

    ws.simulateOpen()
    ws.simulateMessage({
      type: 'pitch_feedback',
      note: 'A4',
      cents: -5,
      confidence: 0.95
    })

    expect(feedbackHandler).toHaveBeenCalledWith({
      type: 'pitch_feedback',
      note: 'A4',
      cents: -5,
      confidence: 0.95
    })
  })

  it('should handle connection errors', () => {
    const errorHandler = vi.fn()
    ws.onerror = errorHandler

    ws.simulateError()

    expect(errorHandler).toHaveBeenCalled()
  })

  it('should reconnect on connection loss', () => {
    const reconnectHandler = vi.fn()
    
    ws.onclose = () => {
      reconnectHandler()
      // Simulate reconnection
      ws = new MockWebSocket(WS_URL)
      ws.simulateOpen()
    }

    ws.simulateOpen()
    ws.close()

    expect(reconnectHandler).toHaveBeenCalled()
  })
})

describe('WebSocket - Session Management', () => {
  it('should send session start message', () => {
    const ws = new MockWebSocket('ws://localhost:8000/ws/session')
    ws.simulateOpen()

    ws.send(JSON.stringify({
      type: 'session_start',
      session_id: 'session-123',
      user_id: 'user-456',
      task_id: 'task-789'
    }))

    expect(ws.send).toHaveBeenCalledWith(expect.stringContaining('session_start'))
  })

  it('should receive session status updates', () => {
    const ws = new MockWebSocket('ws://localhost:8000/ws/session')
    const statusHandler = vi.fn()

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'session_status') {
        statusHandler(data)
      }
    }

    ws.simulateOpen()
    ws.simulateMessage({
      type: 'session_status',
      status: 'processing',
      progress: 45,
      message: 'Analyzing audio...'
    })

    expect(statusHandler).toHaveBeenCalledWith({
      type: 'session_status',
      status: 'processing',
      progress: 45,
      message: 'Analyzing audio...'
    })
  })

  it('should handle session end', () => {
    const ws = new MockWebSocket('ws://localhost:8000/ws/session')
    const endHandler = vi.fn()

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'session_end') {
        endHandler(data)
      }
    }

    ws.simulateOpen()
    ws.simulateMessage({
      type: 'session_end',
      session_id: 'session-123',
      status: 'completed',
      results: {
        overall_score: 85,
        duration: 120
      }
    })

    expect(endHandler).toHaveBeenCalledWith({
      type: 'session_end',
      session_id: 'session-123',
      status: 'completed'
    })
  })
})

describe('WebSocket - Message Types', () => {
  const ws = new MockWebSocket('ws://localhost:8000/ws/realtime')
  ws.simulateOpen()

  const messageTypes = [
    'audio_chunk',
    'pitch_feedback',
    'transcript_update',
    'analysis_progress',
    'session_status',
    'error'
  ]

  messageTypes.forEach((type) => {
    it(`should handle ${type} messages`, () => {
      const handler = vi.fn()

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === type) {
          handler(data)
        }
      }

      ws.simulateMessage({
        type,
        payload: { test: 'data' },
        timestamp: Date.now()
      })

      expect(handler).toHaveBeenCalledWith({
        type,
        payload: { test: 'data' },
        timestamp: expect.any(Number)
      })
    })
  })
})

describe('WebSocket - Error Handling', () => {
  it('should handle malformed JSON messages', () => {
    const errorHandler = vi.fn()
    const ws = new MockWebSocket('ws://localhost:8000/ws/realtime')

    ws.onmessage = (event) => {
      try {
        JSON.parse(event.data)
      } catch (error) {
        errorHandler(error)
      }
    }

    ws.simulateOpen()
    
    // Simulate malformed message
    ws.onmessage?.(new MessageEvent('message', { data: 'invalid json' }))

    expect(errorHandler).toHaveBeenCalled()
  })

  it('should handle rate limiting', () => {
    const ws = new MockWebSocket('ws://localhost:8000/ws/realtime')
    ws.simulateOpen()

    ws.simulateMessage({
      type: 'error',
      code: 'RATE_LIMITED',
      message: 'Too many messages. Please slow down.'
    })

    // Should not crash
    expect(ws.readyState).toBe(1)
  })

  it('should handle server errors', () => {
    const errorHandler = vi.fn()
    const ws = new MockWebSocket('ws://localhost:8000/ws/realtime')

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'error') {
        errorHandler(data)
      }
    }

    ws.simulateOpen()
    ws.simulateMessage({
      type: 'error',
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    })

    expect(errorHandler).toHaveBeenCalledWith({
      type: 'error',
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    })
  })
})

describe('WebSocket - Performance', () => {
  it('should handle high frequency messages', async () => {
    const ws = new MockWebSocket('ws://localhost:8000/ws/realtime')
    ws.simulateOpen()

    const messageCount = 100
    const receivedMessages: any[] = []

    ws.onmessage = (event) => {
      receivedMessages.push(JSON.parse(event.data))
    }

    // Simulate high frequency messages (every 10ms)
    for (let i = 0; i < messageCount; i++) {
      ws.simulateMessage({
        type: 'pitch_feedback',
        note: 'A4',
        cents: Math.random() * 20 - 10,
        timestamp: Date.now()
      })
    }

    // Give time for processing
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(receivedMessages.length).toBe(messageCount)
  })

  it('should maintain connection stability', () => {
    const ws = new MockWebSocket('ws://localhost:8000/ws/realtime')
    ws.simulateOpen()

    // Connection should remain stable
    expect(ws.readyState).toBe(1) // OPEN

    // Send multiple messages
    for (let i = 0; i < 10; i++) {
      ws.send(JSON.stringify({ type: 'ping', id: i }))
    }

    // Connection should still be stable
    expect(ws.readyState).toBe(1)
  })
})
