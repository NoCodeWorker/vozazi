---
name: resend-email
description: Resend para emails transaccionales en VOZAZI. Use cuando implemente envío de emails, templates, recordatorios, o resúmenes semanales.
---

# Resend Email Skill

Esta skill proporciona experiencia en Resend para enviar emails transaccionales profesionales en VOZAZI.

## Objetivo

Implementar sistema de emails transaccionales con Resend para notificaciones, recordatorios de práctica, resúmenes semanales y comunicaciones de billing.

## Instrucciones

### 1. Configuración Inicial

```bash
npm install resend
```

```typescript
// lib/resend/config.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const EMAIL_CONFIG = {
  from: 'VOZAZI <noreply@vozazi.com>',
  replyTo: 'soporte@vozazi.com',
  domain: 'vozazi.com',
};
```

### 2. Templates de Emails

```typescript
// lib/resend/templates/weekly-summary.ts
interface WeeklySummaryEmailProps {
  userName: string;
  weekNumber: number;
  year: number;
  stats: {
    totalSessions: number;
    totalPracticeMinutes: number;
    avgScore: number;
    bestScore: number;
    currentStreak: number;
  };
  improvements: {
    technique: string;
    before: number;
    after: number;
    percentage: number;
  }[];
  nextWeekGoal: string;
}

export function WeeklySummaryTemplate({
  userName,
  weekNumber,
  year,
  stats,
  improvements,
  nextWeekGoal,
}: WeeklySummaryEmailProps) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu Resumen Semanal - VOZAZI</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                  🎵 Tu Semana en VOZAZI
                </h1>
                <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                  Semana ${weekNumber}, ${year}
                </p>
              </td>
            </tr>
            
            <!-- Saludo -->
            <tr>
              <td style="padding: 40px 40px 20px 40px;">
                <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 24px;">
                  ¡Hola, ${userName}! 👋
                </h2>
                <p style="margin: 0; color: #666; font-size: 16px; line-height: 1.6;">
                  Aquí está tu resumen de práctica vocal de esta semana. ¡Vamos a ver cómo lo hiciste!
                </p>
              </td>
            </tr>
            
            <!-- Stats -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                      <p style="margin: 0; font-size: 32px; font-weight: 700; color: #667eea;">
                        ${stats.totalSessions}
                      </p>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                        Sesiones
                      </p>
                    </td>
                    <td style="width: 16px;"></td>
                    <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                      <p style="margin: 0; font-size: 32px; font-weight: 700; color: #764ba2;">
                        ${stats.totalPracticeMinutes}'
                      </p>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                        Minutos
                      </p>
                    </td>
                    <td style="width: 16px;"></td>
                    <td style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                      <p style="margin: 0; font-size: 32px; font-weight: 700; color: #48bb78;">
                        ${stats.avgScore}
                      </p>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                        Score Promedio
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Mejoras -->
            ${improvements.length > 0 ? `
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px;">
                  🎯 Tus Mejoras
                </h3>
                ${improvements.map(imp => `
                  <table role="presentation" style="width: 100%; margin-bottom: 16px; border-collapse: collapse;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #333; font-weight: 500;">
                          ${imp.technique}
                        </p>
                        <div style="background-color: #e2e8f0; border-radius: 4px; height: 8px; overflow: hidden;">
                          <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); width: ${imp.percentage}%; height: 100%;"></div>
                        </div>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
                          ${imp.before} → ${imp.after} (${imp.percentage}% mejora)
                        </p>
                      </td>
                    </tr>
                  </table>
                `).join('')}
              </td>
            </tr>
            ` : ''}
            
            <!-- Objetivo -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <div style="background-color: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 24px;">
                  <h3 style="margin: 0 0 12px 0; color: #276749; font-size: 16px;">
                    📅 Objetivo para la Próxima Semana
                  </h3>
                  <p style="margin: 0; color: #2f855a; font-size: 15px; line-height: 1.6;">
                    ${nextWeekGoal}
                  </p>
                </div>
              </td>
            </tr>
            
            <!-- CTA -->
            <tr>
              <td align="center" style="padding: 0 40px 40px 40px;">
                <a href="https://vozazi.com/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  Comenzar a Practicar
                </a>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f8f9fa; padding: 32px 40px; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
                  ¿Preguntas? Responde a este email o visita nuestro 
                  <a href="https://vozazi.com/help" style="color: #667eea; text-decoration: none;">Centro de Ayuda</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #999;">
                  VOZAZI - Tu entrenador vocal personal
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #999;">
                  <a href="https://vozazi.com/settings/emails" style="color: #999; text-decoration: underline;">
                    Gestionar preferencias de email
                  </a>
                </p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}
```

### 3. Servicio de Email

```typescript
// lib/resend/email-service.ts
import { resend, EMAIL_CONFIG } from './config';
import { WeeklySummaryTemplate } from './templates/weekly-summary';
import { PracticeReminderTemplate } from './templates/practice-reminder';
import { SubscriptionEmailTemplate } from './templates/subscription';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export class EmailService {
  /**
   * Enviar email transaccional
   */
  static async send(options: EmailOptions) {
    try {
      const { data, error } = await resend.emails.send({
        from: options.replyTo || EMAIL_CONFIG.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        tags: options.tags || [],
        headers: {
          'X-Entity-Ref-ID': crypto.randomUUID(),
        },
      });
      
      if (error) {
        console.error('Failed to send email:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }
  
  /**
   * Enviar resumen semanal
   */
  static async sendWeeklySummary(
    to: string,
    userName: string,
    stats: WeeklySummaryEmailProps['stats'],
    improvements: WeeklySummaryEmailProps['improvements'],
    nextWeekGoal: string
  ) {
    const date = new Date();
    const weekNumber = this.getWeekNumber(date);
    
    const html = WeeklySummaryTemplate({
      userName,
      weekNumber,
      year: date.getFullYear(),
      stats,
      improvements,
      nextWeekGoal,
    });
    
    return await this.send({
      to,
      subject: `🎵 Tu semana en VOZAZI - Semana ${weekNumber}`,
      html,
      text: this.generatePlainTextSummary(userName, stats),
      tags: [
        { name: 'type', value: 'weekly_summary' },
        { name: 'week', value: weekNumber.toString() },
      ],
    });
  }
  
  /**
   * Enviar recordatorio de práctica
   */
  static async sendPracticeReminder(
    to: string,
    userName: string,
    streak: number,
    lastPracticeDaysAgo: number
  ) {
    const html = PracticeReminderTemplate({
      userName,
      streak,
      lastPracticeDaysAgo,
    });
    
    let subject = '🎤 ¡Tu voz te espera!';
    
    if (streak > 0 && lastPracticeDaysAgo >= 2) {
      subject = `🔥 ¡No pierdas tu racha de ${streak} días!`;
    } else if (lastPracticeDaysAgo >= 7) {
      subject = '¡Te extrañamos en VOZAZI!';
    }
    
    return await this.send({
      to,
      subject,
      html,
      tags: [
        { name: 'type', value: 'practice_reminder' },
        { name: 'streak', value: streak.toString() },
      ],
    });
  }
  
  /**
   * Enviar confirmación de suscripción
   */
  static async sendSubscriptionConfirmation(
    to: string,
    userName: string,
    planName: string,
    nextBillingDate: Date
  ) {
    const html = SubscriptionEmailTemplate({
      userName,
      planName,
      nextBillingDate,
    });
    
    return await this.send({
      to,
      subject: `✅ Tu suscripción ${planName} está activa`,
      html,
      tags: [
        { name: 'type', value: 'subscription_confirmation' },
        { name: 'plan', value: planName },
      ],
    });
  }
  
  /**
   * Generar versión plain text
   */
  private static generatePlainTextSummary(
    userName: string,
    stats: WeeklySummaryEmailProps['stats']
  ): string {
    return `
¡Hola ${userName}!

Tu resumen semanal de VOZAZI:

📊 SESIONES: ${stats.totalSessions}
⏱️ MINUTOS: ${stats.totalPracticeMinutes}
🎯 SCORE PROMEDIO: ${stats.avgScore}

¡Sigue así! Tu voz está mejorando cada día.

Practica hoy: https://vozazi.com/dashboard

---
VOZAZI - Tu entrenador vocal personal
    `.trim();
  }
  
  /**
   * Obtener número de semana
   */
  private static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
```

### 4. Server Actions para Emails

```typescript
// server/actions/emails.ts
'use server';

import { EmailService } from '@/lib/resend/email-service';
import { db } from '@/db';
import { users, progressSnapshots } from '@/db/schema';
import { eq, gte, lte } from 'drizzle-orm';

/**
 * Enviar resúmenes semanales a todos los usuarios
 */
export async function sendWeeklySummaries() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Obtener todos los usuarios activos
  const allUsers = await db.query.users.findMany({
    where: eq(users.emailVerified, true),
  });
  
  const results = {
    sent: 0,
    failed: 0,
    skipped: 0,
  };
  
  for (const user of allUsers) {
    try {
      // Obtener stats de la semana
      const snapshots = await db.query.progressSnapshots.findMany({
        where: and(
          eq(progressSnapshots.userId, user.id),
          gte(progressSnapshots.createdAt, weekAgo),
          lte(progressSnapshots.createdAt, now)
        ),
      });
      
      if (snapshots.length === 0) {
        results.skipped++;
        continue;
      }
      
      // Calcular estadísticas
      const stats = calculateWeeklyStats(snapshots);
      const improvements = calculateImprovements(snapshots);
      
      // Enviar email
      await EmailService.sendWeeklySummary(
        user.email,
        user.displayName || user.email.split('@')[0],
        stats,
        improvements,
        generateNextWeekGoal(improvements)
      );
      
      results.sent++;
      
      // Rate limiting: esperar entre emails
      await sleep(100);
      
    } catch (error) {
      console.error(`Failed to send to ${user.email}:`, error);
      results.failed++;
    }
  }
  
  return results;
}

/**
 * Enviar recordatorio a usuarios inactivos
 */
export async function sendInactivityReminders() {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Usuarios que practicaron hace más de 2 días pero menos de una semana
  const inactiveUsers = await db.query.sessions.findMany({
    where: and(
      eq(sessions.status, 'completed'),
      gte(sessions.startedAt, weekAgo),
      lte(sessions.startedAt, twoDaysAgo)
    ),
    with: {
      user: true,
    },
  });
  
  const results = { sent: 0, failed: 0 };
  
  for (const session of inactiveUsers) {
    try {
      await EmailService.sendPracticeReminder(
        session.user.email,
        session.user.displayName || session.user.email.split('@')[0],
        session.user.currentStreak || 0,
        2
      );
      
      results.sent++;
      await sleep(100);
    } catch (error) {
      results.failed++;
    }
  }
  
  return results;
}

function calculateWeeklyStats(snapshots: any[]) {
  return {
    totalSessions: snapshots.reduce((sum, s) => sum + (s.sessionsCompleted || 0), 0),
    totalPracticeMinutes: Math.round(snapshots.reduce((sum, s) => sum + (s.practiceMinutes || 0), 0) / 60),
    avgScore: Math.round(snapshots.reduce((sum, s) => sum + (s.avgScore || 0), 0) / snapshots.length),
    bestScore: Math.max(...snapshots.map(s => s.bestScore || 0)),
    currentStreak: snapshots[snapshots.length - 1]?.currentStreak || 0,
  };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### 5. Background Jobs para Emails

```typescript
// apps/web/app/api/jobs/weekly-summaries/route.ts
import { NextResponse } from 'next/server';
import { sendWeeklySummaries } from '@/server/actions/emails';

/**
 * Endpoint para enviar resúmenes semanales
 * Llamar desde cron job todos los lunes a las 9 AM
 */
export async function POST() {
  try {
    const results = await sendWeeklySummaries();
    
    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Weekly summaries job failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// apps/web/app/api/jobs/practice-reminders/route.ts
export async function POST() {
  try {
    const results = await sendInactivityReminders();
    
    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed' },
      { status: 500 }
    );
  }
}
```

## Restricciones

- NO enviar emails sin consentimiento del usuario
- NO olvidar incluir opción de unsubscribe
- NO enviar emails en horario nocturno (configurar cron apropiadamente)
- NO exceder límites de rate limiting de Resend
- Siempre incluir versión plain text
- Siempre loguear envíos fallidos
- Siempre verificar dominios en Resend antes de producción

## Ejemplos

### Bueno: Cron Configuration
```typescript
// vercel.json
{
  "crons": [
    {
      "path": "/api/jobs/weekly-summaries",
      "schedule": "0 9 * * 1"
    },
    {
      "path": "/api/jobs/practice-reminders",
      "schedule": "0 18 * * *"
    }
  ]
}
```
