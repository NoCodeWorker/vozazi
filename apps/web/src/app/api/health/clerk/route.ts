import { NextResponse } from 'next/server'
import { clerkMCP } from '@/lib/clerk-mcp'

export async function GET() {
  const health = await clerkMCP.healthCheck()
  
  return NextResponse.json({
    status: health.status,
    service: 'clerk',
    timestamp: new Date().toISOString()
  })
}
