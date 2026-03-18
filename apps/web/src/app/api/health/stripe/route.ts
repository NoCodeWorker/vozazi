import { NextResponse } from 'next/server'
import { stripeMCP } from '@/lib/stripe-mcp'

export async function GET() {
  const health = await stripeMCP.healthCheck()
  
  return NextResponse.json({
    status: health.status,
    service: 'stripe',
    timestamp: new Date().toISOString()
  })
}
