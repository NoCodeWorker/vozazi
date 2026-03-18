---
name: typescript-system
description: TypeScript type system, generics, utility types, and type-safe patterns. Use when defining types, interfaces, or implementing type-safe patterns.
---

# TypeScript Type System Skill

This skill provides expertise in advanced TypeScript patterns for type-safe VOZAZI development.

## Goal

Implement robust, maintainable TypeScript code with proper type safety, generics, and utility types.

## Instructions

### 1. Type Definitions

```typescript
// packages/shared-types/src/session.ts
import { z } from 'zod';

// Schema for runtime validation
export const sessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  exerciseType: z.enum(['sustain_note', 'pitch_target', 'clean_onset']),
  targetNote: z.string().optional(),
  difficulty: z.number().int().min(1).max(5),
  startedAt: z.date(),
  endedAt: z.date().nullable(),
  status: z.enum(['started', 'in_progress', 'completed', 'failed', 'abandoned']),
});

// Type inference from schema
export type Session = z.infer<typeof sessionSchema>;
export type SessionCreateInput = z.input<typeof sessionSchema>;

// Discriminated unions for state machines
export type SessionState =
  | { status: 'started'; endedAt: null }
  | { status: 'in_progress'; endedAt: null }
  | { status: 'completed'; endedAt: Date }
  | { status: 'failed'; endedAt: Date; error: string }
  | { status: 'abandoned'; endedAt: Date };
```

### 2. Generics Patterns

```typescript
// packages/shared-types/src/generic.ts

// Generic API response
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Generic repository pattern
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

// Conditional types for nullable fields
export type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

export type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K;
}[keyof T];
```

### 3. Type Guards

```typescript
// packages/shared-types/src/guards.ts

export function isSessionCompleted(session: Session): session is Session & { endedAt: Date } {
  return session.status === 'completed';
}

export function isSessionFailed(session: Session): session is Session & { error: string } {
  return session.status === 'failed';
}

// Type predicate for API responses
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== undefined;
}
```

### 4. Utility Types

```typescript
// packages/shared-types/src/utilities.ts

// Make specific fields required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Make specific fields optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Deep partial for nested objects
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Extract function parameters
export type FunctionParams<T> = T extends (...args: infer P) => any ? P : never;

// Return type with modifications
export type ModifyReturn<T, K extends keyof T, V> = Omit<T, K> & { [P in K]: V };
```

## Constraints

- Do NOT use `any` type unless absolutely unavoidable
- Do NOT use type assertions (`as Type`) without proper validation
- Do NOT export types that expose internal implementation details
- Always prefer `unknown` over `any` for uncertain types
- Always validate runtime data with Zod before type casting
- Use `satisfies` operator for type checking without widening

## Examples

### Good: Type-Safe API Handler
```typescript
// app/api/v1/sessions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Session, sessionSchema } from '@vozazi/shared-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Session>>> {
  try {
    const session = await getSessionById(params.id);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Type-safe parsing
    const validated = sessionSchema.safeParse(session);
    
    if (!validated.success) {
      throw new Error('Invalid session data');
    }
    
    return NextResponse.json({ success: true, data: validated.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
```
