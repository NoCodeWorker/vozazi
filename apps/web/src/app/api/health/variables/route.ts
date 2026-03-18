import { NextResponse } from 'next/server'
import { clerkMCP } from '@/lib/clerk-mcp'
import { stripeMCP } from '@/lib/stripe-mcp'

export async function GET() {
  const missing: string[] = []
  
  // Check required environment variables
  const required = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'DATABASE_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'NEXT_PUBLIC_AUDIO_ENGINE_URL'
  ]
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  
  if (missing.length > 0) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Missing environment variables',
        missing
      },
      { status: 500 }
    )
  }
  
  // Perform MCP health checks
  const mcpHealth = {
    clerk: await clerkMCP.healthCheck(),
    stripe: await stripeMCP.healthCheck(),
    audioEngine: await checkAudioEngineHealth()
  }
  
  // Check if all critical services are healthy
  const criticalHealthy = 
    mcpHealth.clerk.status === 'healthy' &&
    mcpHealth.stripe.status === 'healthy'
  
  if (!criticalHealthy) {
    return NextResponse.json(
      {
        status: 'degraded',
        message: 'Some services are not healthy',
        mcpHealth
      },
      { status: 503 }
    )
  }
  
  return NextResponse.json({
    status: 'ok',
    message: 'All required variables configured',
    mcpHealth
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
