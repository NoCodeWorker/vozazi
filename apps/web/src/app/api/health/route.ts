import { NextResponse } from 'next/server'
import { clerkMCP } from '@/lib/clerk-mcp'
import { stripeMCP } from '@/lib/stripe-mcp'

export async function GET() {
  const health = {
    clerk: await clerkMCP.healthCheck(),
    stripe: await stripeMCP.healthCheck(),
    audioEngine: await checkAudioEngineHealth()
  }
  
  const allHealthy = 
    health.clerk.status === 'healthy' &&
    health.stripe.status === 'healthy' &&
    health.audioEngine.status === 'healthy'
  
  return NextResponse.json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: health
  })
}

async function checkAudioEngineHealth(): Promise<{ status: string; service: string; error?: string }> {
  try {
    const audioEngineUrl = process.env.NEXT_PUBLIC_AUDIO_ENGINE_URL
    
    if (!audioEngineUrl) {
      return {
        status: 'unavailable',
        service: 'audio_engine',
        error: 'Audio engine URL not configured'
      }
    }
    
    const response = await fetch(`${audioEngineUrl}/health`)
    
    if (!response.ok) {
      return {
        status: 'unhealthy',
        service: 'audio_engine',
        error: `Status: ${response.status}`
      }
    }
    
    return {
      status: 'healthy',
      service: 'audio_engine'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      service: 'audio_engine',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
