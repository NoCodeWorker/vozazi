---
name: nextjs-server-actions
description: Next.js Server Actions for server-side mutations and form handling. Use when implementing form submissions, data mutations, or server-side logic triggered from client components.
---

# Next.js Server Actions Skill

This skill provides expertise in implementing Server Actions for VOZAZI's backend logic, form handling, and data mutations.

## Goal

Implement secure, validated, and efficient Server Actions for all server-side mutations in the VOZAZI platform.

## Instructions

### 1. Basic Structure

```tsx
// server/actions/sessions.ts
'use server';

import { z } from 'zod';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Schema validation
const createSessionSchema = z.object({
  exerciseType: z.enum(['sustain_note', 'pitch_target', 'clean_onset']),
  targetNote: z.string().optional(),
  difficulty: z.number().int().min(1).max(5),
});

export async function createSession(formData: FormData) {
  // 1. Authenticate
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  // 2. Validate input
  const validated = createSessionSchema.safeParse({
    exerciseType: formData.get('exerciseType'),
    targetNote: formData.get('targetNote'),
    difficulty: Number(formData.get('difficulty')),
  });
  
  if (!validated.success) {
    return { success: false, error: 'Invalid input' };
  }
  
  // 3. Execute mutation
  try {
    const [session] = await db.insert(sessions).values({
      userId,
      ...validated.data,
      startedAt: new Date(),
      status: 'started',
    }).returning();
    
    // 4. Revalidate cache
    revalidatePath('/dashboard');
    revalidatePath('/history');
    
    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error('Failed to create session:', error);
    return { success: false, error: 'Failed to create session' };
  }
}
```

### 2. Error Handling Pattern

```tsx
// server/actions/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
  }
}

export function handleActionError(error: unknown) {
  if (error instanceof AppError) {
    throw error;
  }
  
  console.error('Unexpected error:', error);
  throw new AppError('Internal server error', 'INTERNAL_ERROR', 500);
}
```

### 3. Optimistic Updates

```tsx
// app/practice/session.tsx
'use client';

import { useOptimistic } from 'react';
import { closeSession } from '@/server/actions/sessions';

export function PracticeSession({ initialSessions }) {
  const [optimisticSessions, addOptimisticSession] = useOptimistic(
    initialSessions,
    (state, newSession) => [newSession, ...state]
  );
  
  const handleSubmit = async (formData: FormData) => {
    const tempSession = { id: 'temp', ...formData };
    addOptimisticSession(tempSession);
    
    const result = await closeSession(formData);
    // Handle result...
  };
  
  return (/* ... */);
}
```

### 4. Batch Operations

```tsx
export async function bulkDeleteSessions(sessionIds: string[]) {
  'use server';
  
  const { userId } = await auth();
  if (!userId) throw new AppError('Unauthorized', 'UNAUTHORIZED', 401);
  
  const validatedIds = z.array(z.string().uuid()).parse(sessionIds);
  
  await db.delete(sessions)
    .where(and(
      eq(sessions.userId, userId),
      inArray(sessions.id, validatedIds)
    ));
  
  revalidatePath('/history');
  return { success: true };
}
```

## Constraints

- Do NOT trust client-side validation alone
- Do NOT expose sensitive data in action responses
- Do NOT forget to revalidate paths after mutations
- Do NOT use Server Actions for read-only data fetching (use Route Handlers or Server Components)
- Always authenticate before mutations
- Always validate input with Zod or similar

## Examples

### Good: Complete Server Action with All Patterns
```tsx
'use server';

import { z } from 'zod';
import { db } from '@/db';
import { tasks, taskRuns } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const completeTaskSchema = z.object({
  taskId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
  completed: z.boolean(),
});

export async function completeTaskAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const validated = completeTaskSchema.safeParse({
    taskId: formData.get('taskId'),
    score: Number(formData.get('score')),
    completed: formData.get('completed') === 'true',
  });
  
  if (!validated.success) {
    return { success: false, error: 'Invalid data' };
  }
  
  try {
    // Verify task ownership
    const task = await db.query.tasks.findFirst({
      where: and(
        eq(tasks.id, validated.data.taskId),
        eq(tasks.userId, userId)
      ),
    });
    
    if (!task) {
      return { success: false, error: 'Task not found' };
    }
    
    // Create task result
    await db.insert(taskRuns).values({
      taskId: validated.data.taskId,
      userId,
      score: validated.data.score,
      completed: validated.data.completed,
      endedAt: new Date(),
    });
    
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to complete task:', error);
    return { success: false, error: 'Failed to complete task' };
  }
}
```
