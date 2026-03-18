---
name: nextjs-route-handlers
description: Next.js Route Handlers for REST API endpoints. Use when creating API endpoints, webhook handlers, or external integrations.
---

# Next.js Route Handlers Skill

This skill provides expertise in implementing Route Handlers (API routes) for VOZAZI's external integrations, webhooks, and API needs.

## Goal

Implement robust, well-documented REST API endpoints using Next.js Route Handlers with proper error handling, validation, and security.

## Instructions

### 1. Basic Route Handler Structure

```tsx
// app/api/v1/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const limit = Number(searchParams.get('limit')) || 20;
    const offset = Number(searchParams.get('offset')) || 0;
    
    const userSessions = await db.query.sessions.findMany({
      where: eq(sessions.userId, userId),
      limit,
      offset,
      orderBy: [desc(sessions.startedAt)],
    });
    
    return NextResponse.json({ sessions: userSessions });
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Dynamic Routes

```tsx
// app/api/v1/sessions/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const session = await db.query.sessions.findFirst({
    where: and(
      eq(sessions.id, params.sessionId),
      eq(sessions.userId, userId)
    ),
  });
  
  if (!session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json({ session });
}
```

### 3. Webhook Handlers

```tsx
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Invalid webhook signature:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  // Handle events idempotently
  switch (event.type) {
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  return NextResponse.json({ received: true });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await db.update(subscriptions)
    .set({
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}
```

### 4. Rate Limiting

```tsx
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(
    `rate_limit_${identifier}`
  );
  
  return { success, limit, reset, remaining };
}

// In route handler
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const identifier = userId || request.ip || 'anonymous';
  
  const { success, remaining } = await checkRateLimit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  }
  
  // Continue with request...
}
```

## Constraints

- Do NOT expose internal error details to clients
- Do NOT forget to verify webhook signatures
- Do NOT skip authentication on protected endpoints
- Do NOT return large datasets without pagination
- Always validate request bodies with Zod
- Always use appropriate HTTP status codes
- Always implement rate limiting on mutation endpoints

## Examples

### Good: Complete CRUD API
```tsx
// app/api/v1/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, desc } from 'drizzle-orm';

const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  exerciseType: z.enum(['sustain_note', 'pitch_target', 'clean_onset']),
  difficulty: z.number().int().min(1).max(5),
  durationMinutes: z.number().int().positive().max(60),
});

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      eq(tasks.status, 'planned')
    ),
    orderBy: [desc(tasks.scheduledFor)],
    limit: 20,
  });
  
  return NextResponse.json({ tasks: userTasks });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const validated = createTaskSchema.safeParse(body);
  
  if (!validated.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validated.error.flatten() },
      { status: 400 }
    );
  }
  
  const [task] = await db.insert(tasks).values({
    userId,
    ...validated.data,
    status: 'planned',
    scheduledFor: new Date(),
  }).returning();
  
  return NextResponse.json({ task }, { status: 201 });
}
```
