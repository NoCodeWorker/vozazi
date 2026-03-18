---
name: drizzle-orm
description: Drizzle ORM for type-safe database operations with PostgreSQL. Use when defining schemas, writing queries, or managing migrations.
---

# Drizzle ORM Skill

This skill provides expertise in Drizzle ORM for type-safe database operations in VOZAZI.

## Goal

Implement robust, type-safe database operations with proper schema design, efficient queries, and migration management.

## Instructions

### 1. Schema Definition

```typescript
// packages/db/schema/sessions.ts
import { pgTable, uuid, varchar, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tasks } from './tasks';
import { relations } from 'drizzle-orm';

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  taskId: uuid('task_id').references(() => tasks.id),
  sessionType: varchar('session_type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('started'),
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  durationSeconds: integer('duration_seconds'),
  overallScore: integer('overall_score'),
  primaryFocus: varchar('primary_focus', { length: 50 }),
  dominantWeakness: varchar('dominant_weakness', { length: 50 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdStartedAtIdx: index('sessions_user_id_started_at_idx')
    .on(table.userId, table.startedAt),
  taskIdIdx: index('sessions_task_id_idx').on(table.taskId),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [sessions.taskId],
    references: [tasks.id],
  }),
  segments: many(sessionSegments),
  metrics: many(sessionMetrics),
  audioAssets: many(sessionAudioAssets),
  evaluationResults: many(evaluationResults),
}));
```

### 2. Query Operations

```typescript
// packages/db/repositories/session-repository.ts
import { db } from '../index';
import { sessions, sessionMetrics, evaluationResults } from '../schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';

export class SessionRepository {
  async findById(sessionId: string) {
    return await db.query.sessions.findFirst({
      where: eq(sessions.id, sessionId),
      with: {
        segments: true,
        metrics: true,
        evaluationResults: true,
        audioAssets: true,
      },
    });
  }
  
  async findByUser(userId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const { startDate, endDate, limit = 20, offset = 0 } = options ?? {};
    
    const conditions = [eq(sessions.userId, userId)];
    
    if (startDate) {
      conditions.push(gte(sessions.startedAt, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(sessions.startedAt, endDate));
    }
    
    return await db.query.sessions.findMany({
      where: and(...conditions),
      orderBy: [desc(sessions.startedAt)],
      limit,
      offset,
      with: {
        evaluationResults: {
          columns: {
            scoreTotal: true,
            dominantWeakness: true,
          },
        },
      },
    });
  }
  
  async getUserStats(userId: string, startDate: Date, endDate: Date) {
    const result = await db
      .select({
        totalSessions: sql<number>`count(*)`,
        avgScore: sql<number>`avg(${evaluationResults.scoreTotal})`,
        totalDuration: sql<number>`sum(${sessions.durationSeconds})`,
      })
      .from(sessions)
      .leftJoin(evaluationResults, eq(sessions.id, evaluationResults.sessionId))
      .where(
        and(
          eq(sessions.userId, userId),
          gte(sessions.startedAt, startDate),
          lte(sessions.startedAt, endDate)
        )
      );
    
    return result[0];
  }
  
  async create(data: typeof sessions.$inferInsert) {
    const [session] = await db.insert(sessions).values(data).returning();
    return session;
  }
  
  async update(sessionId: string, data: Partial<typeof sessions.$inferInsert>) {
    const [session] = await db
      .update(sessions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sessions.id, sessionId))
      .returning();
    
    return session;
  }
  
  async delete(sessionId: string) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
}
```

### 3. Transactions

```typescript
// packages/db/repositories/session-repository.ts
export async function closeSessionWithEvaluation(
  sessionId: string,
  evaluationData: {
    scoreTotal: number;
    scorePitchAccuracy: number;
    scorePitchStability: number;
    dominantWeakness: string;
  }
) {
  return await db.transaction(async (tx) => {
    // 1. Update session
    await tx.update(sessions)
      .set({
        status: 'completed',
        endedAt: new Date(),
        overallScore: evaluationData.scoreTotal,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));
    
    // 2. Create evaluation result
    const [evaluation] = await tx.insert(evaluationResults).values({
      sessionId,
      ...evaluationData,
    }).returning();
    
    // 3. Generate next task
    const nextTask = await generateNextTask(tx, sessionId, evaluationData);
    const [task] = await tx.insert(tasks).values(nextTask).returning();
    
    return {
      session: await tx.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
        with: { evaluationResults: true },
      }),
      nextTask: task,
    };
  });
}
```

### 4. Migrations

```bash
# Generate migration after schema changes
npx drizzle-kit generate:pg

# Push schema to development database
npx drizzle-kit push:pg

# Apply migrations to production
npx drizzle-kit migrate
```

## Constraints

- Do NOT use raw SQL unless absolutely necessary
- Do NOT skip indexes on frequently queried columns
- Do NOT forget to handle null values in optional fields
- Always use transactions for related mutations
- Always include createdAt and updatedAt timestamps
- Always use parameterized queries (Drizzle does this automatically)

## Examples

### Good: Complex Query with Joins
```typescript
async function getUserProgress(userId: string, weeks: number = 4) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (weeks * 7));
  
  const sessionsWithEvaluation = await db.query.sessions.findMany({
    where: and(
      eq(sessions.userId, userId),
      gte(sessions.startedAt, startDate),
      eq(sessions.status, 'completed')
    ),
    with: {
      evaluationResults: {
        columns: {
          scoreTotal: true,
          scorePitchAccuracy: true,
          scorePitchStability: true,
          dominantWeakness: true,
        },
      },
    },
    orderBy: [sessions.startedAt],
  });
  
  // Calculate weekly averages
  const weeklyProgress = sessionsWithEvaluation.reduce((acc, session) => {
    const week = getWeekNumber(session.startedAt);
    if (!acc[week]) {
      acc[week] = { scores: [], weaknesses: [] };
    }
    
    if (session.evaluationResults) {
      acc[week].scores.push(session.evaluationResults.scoreTotal);
      acc[week].weaknesses.push(session.evaluationResults.dominantWeakness);
    }
    
    return acc;
  }, {} as Record<number, { scores: number[]; weaknesses: string[] }>);
  
  return Object.entries(weeklyProgress).map(([week, data]) => ({
    week: Number(week),
    avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
    dominantWeakness: getMostFrequent(data.weaknesses),
  }));
}
```
