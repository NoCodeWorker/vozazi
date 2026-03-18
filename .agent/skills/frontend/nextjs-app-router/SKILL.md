---
name: nextjs-app-router
description: Next.js App Router, Server Components, and routing patterns. Use when working with Next.js application structure, creating new pages, or implementing routing logic.
---

# Next.js App Router Skill

This skill provides expertise in Next.js App Router architecture, Server Components, and routing patterns for the VOZAZI platform.

## Goal

Implement modern Next.js 13+ App Router patterns with proper use of Server and Client Components for optimal performance and SEO.

## Instructions

### 1. Directory Structure
Always follow the VOZAZI app structure:
```
apps/web/app/
├── (marketing)/     # Public marketing pages
├── (auth)/          # Authentication pages
├── dashboard/       # User dashboard (protected)
├── practice/        # Practice session flow
├── history/         # Session history
├── library/         # Vocal library
├── billing/         # Subscription management
└── api/             # Route handlers
```

### 2. Server vs Client Components

**Use Server Components (default) when:**
- Fetching data from database
- Accessing server-side secrets
- Rendering static content
- SEO is important

**Use Client Components ('use client') when:**
- Using useState, useEffect, or other hooks
- Adding event listeners
- Using browser-only APIs (Web Audio API, localStorage)
- Need interactivity

### 3. Key Patterns

#### Parallel Routes
```tsx
// app/(main)/@sidebar/
export default function Sidebar() { return <aside>...</aside>; }

// app/(main)/@content/
export default function Content() { return <main>...</main>; }
```

#### Intercepting Routes
```tsx
// app/(.)practice/[id]/page.tsx
// Intercepts navigation to /practice/[id]
```

#### Loading States
```tsx
// app/practice/loading.tsx
export default function Loading() {
  return <PracticeSkeleton />;
}
```

#### Error Boundaries
```tsx
// app/practice/error.tsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Practice session error</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 4. Streaming and Suspense

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<SessionsSkeleton />}>
        <RecentSessions />
      </Suspense>
    </>
  );
}
```

## Constraints

- Do NOT use 'use client' unless browser APIs or state are required
- Do NOT fetch data in Client Components when it can be done in Server Components
- Do NOT expose database credentials or API keys to client
- Always implement loading.tsx for routes with data fetching
- Always implement error.tsx for critical user flows

## Examples

### Good: Server Component with Data Fetching
```tsx
// app/dashboard/page.tsx (Server Component)
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  const recentSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, userId!),
    orderBy: [desc(sessions.startedAt)],
    limit: 5,
  });
  
  return <DashboardContent sessions={recentSessions} />;
}
```

### Good: Client Component for Interactivity
```tsx
// app/practice/recording-button.tsx
'use client';

import { useState } from 'react';

export function RecordingButton() {
  const [isRecording, setIsRecording] = useState(false);
  
  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setIsRecording(true);
    // ... recording logic
  };
  
  return (
    <button onClick={handleStartRecording}>
      {isRecording ? 'Stop' : 'Start Recording'}
    </button>
  );
}
```
