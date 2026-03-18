---
name: posthog-analytics
description: PostHog para analítica de producto en VOZAZI. Use cuando implemente tracking de eventos, funnels, retención, o feature flags.
---

# PostHog Analytics Skill

Esta skill proporciona experiencia en PostHog para implementar analítica de producto y tracking de comportamiento en VOZAZI.

## Objetivo

Implementar tracking completo de eventos, análisis de comportamiento, funnels de conversión y feature flags usando PostHog en VOZAZI.

## Instrucciones

### 1. Configuración Inicial

```bash
npm install posthog-js posthog-node
```

```typescript
// lib/posthog/config.ts
import posthog from 'posthog-js';

// Configuración para cliente (Next.js)
export const initPostHog = () => {
  if (typeof window === 'undefined') return;
  
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false, // Desactivar autocapture para control total
    persistence: 'localStorage',
    bootstrap: {
      sessionID: generateSessionId(),
    },
    // Session recording (opcional)
    session_recording: {
      recordCrossOriginIframes: false,
      maskAllInputs: true,
      maskInputOptions: {
        password: true,
        creditCard: true,
      },
    },
    // Opt out por defecto hasta que usuario acepte
    opt_out_capturing_by_default: true,
    // Rate limiting
    rate_limiting: {
      eventsPerSecond: 10,
      eventsBurstLimit: 100,
    },
  });
  
  return posthog;
};

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

### 2. Hook para Identificación de Usuario

```typescript
// hooks/use-posthog-identity.ts
'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { useUser } from '@clerk/nextjs';

export function usePostHogIdentity() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn && user) {
      // Identificar usuario
      posthog.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
        displayName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt?.toISOString(),
        plan: 'free', // Esto debería venir de tu BD
        signedUpAt: user.createdAt?.toISOString(),
      });
      
      // Setear feature flags si las tienes
      posthog.group('account', user.id, {
        plan: 'free',
        createdAt: user.createdAt?.toISOString(),
      });
    } else {
      // Resetear cuando no hay usuario
      posthog.reset();
    }
  }, [isLoaded, isSignedIn, user]);
}
```

### 3. Tracking de Eventos

```typescript
// lib/posthog/events.ts
import posthog from 'posthog-js';

// Definir tipos de eventos
export type Voza ziEvent = 
  // Auth
  | 'auth_signed_in'
  | 'auth_signed_out'
  | 'auth_signed_up'
  | 'onboarding_started'
  | 'onboarding_completed'
  
  // Sesiones
  | 'session_started'
  | 'session_completed'
  | 'session_abandoned'
  | 'session_failed'
  
  // Ejercicios
  | 'exercise_started'
  | 'exercise_completed'
  | 'exercise_repeated'
  | 'exercise_skipped'
  
  // Práctica
  | 'practice_session_created'
  | 'practice_audio_recorded'
  | 'practice_feedback_viewed'
  
  // Progreso
  | 'progress_viewed'
  | 'progress_milestone_reached'
  | 'weekly_summary_viewed'
  
  // Tareas
  | 'task_generated'
  | 'task_completed'
  | 'task_skipped'
  | 'task_failed'
  
  // Biblioteca
  | 'library_opened'
  | 'article_read'
  | 'search_performed'
  
  // Billing
  | 'billing_page_viewed'
  | 'checkout_started'
  | 'subscription_started'
  | 'subscription_renewed'
  | 'subscription_canceled'
  | 'subscription_upgraded'
  | 'subscription_downgraded'
  
  // Errores
  | 'error_encountered'
  | 'audio_capture_failed'
  | 'analysis_failed';

interface EventProperties {
  [key: string]: any;
}

export function trackEvent(event: Voza ziEvent, properties?: EventProperties) {
  // Verificar opt-in
  if (!posthog.has_opted_in_capturing()) {
    return;
  }
  
  // Añadir propiedades comunes
  const commonProperties = {
    timestamp: new Date().toISOString(),
    pathname: typeof window !== 'undefined' ? window.location.pathname : '',
    search: typeof window !== 'undefined' ? window.location.search : '',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    ...properties,
  };
  
  posthog.capture(event, commonProperties);
}

// Funciones específicas para eventos comunes
export function trackSessionStarted(sessionId: string, exerciseType: string) {
  trackEvent('session_started', {
    sessionId,
    exerciseType,
    source: 'dashboard',
  });
}

export function trackSessionCompleted(
  sessionId: string,
  duration: number,
  score: number
) {
  trackEvent('session_completed', {
    sessionId,
    duration,
    score,
    scoreRange: getScoreRange(score), // 'low' | 'medium' | 'high'
  });
}

export function trackExerciseCompleted(
  exerciseType: string,
  score: number,
  difficulty: number
) {
  trackEvent('exercise_completed', {
    exerciseType,
    score,
    difficulty,
    passed: score >= 70,
  });
}

export function trackError(errorType: string, errorMessage: string, context?: string) {
  trackEvent('error_encountered', {
    errorType,
    errorMessage,
    context,
    severity: getErrorSeverity(errorType),
  });
}

function getScoreRange(score: number): string {
  if (score < 50) return 'low';
  if (score < 80) return 'medium';
  return 'high';
}

function getErrorSeverity(errorType: string): string {
  const critical = ['audio_capture_failed', 'analysis_failed'];
  return critical.includes(errorType) ? 'high' : 'medium';
}
```

### 4. Server-Side Tracking

```typescript
// lib/posthog/server.ts
import PostHog from 'posthog-node';

export const posthogServer = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    flushAt: 1, // Flush inmediatamente en serverless
    flushInterval: 0,
  }
);

// Server Action con tracking
export async function createSessionWithTracking(formData: FormData) {
  const sessionId = crypto.randomUUID();
  const userId = await getCurrentUserId();
  
  try {
    // Crear sesión en BD
    const session = await createSessionInDatabase(formData);
    
    // Trackear server-side
    await posthogServer.capture({
      distinctId: userId,
      event: 'session_started',
      properties: {
        sessionId,
        exerciseType: formData.get('exerciseType'),
        difficulty: formData.get('difficulty'),
        $groups: {
          account: userId,
        },
      },
    });
    
    return { success: true, sessionId };
  } catch (error) {
    // Trackear error
    await posthogServer.capture({
      distinctId: userId,
      event: 'session_failed',
      properties: {
        error: error instanceof Error ? error.message : 'Unknown',
      },
    });
    
    throw error;
  }
}

// Middleware para tracking automático
export async function trackPageView(pathname: string, userId?: string) {
  if (!userId) return;
  
  await posthogServer.capture({
    distinctId: userId,
    event: '$pageview',
    properties: {
      $current_url: pathname,
      $pathname: pathname,
    },
  });
}
```

### 5. Feature Flags

```typescript
// lib/posthog/feature-flags.ts
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

export type FeatureFlag =
  | 'new_practice_ui'
  | 'adaptive_engine_v2'
  | 'ai_feedback'
  | 'dark_mode_beta'
  | 'premium_analytics';

export function getFeatureFlag(flag: FeatureFlag, defaultValue: boolean = false): boolean {
  if (typeof window === 'undefined') return defaultValue;
  return posthog.isFeatureEnabled(flag) ?? defaultValue;
}

// Hook para feature flags
export function useFeatureFlag(flag: FeatureFlag, defaultValue: boolean = false) {
  const [enabled, setEnabled] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkFlag = () => {
      const isEnabled = posthog.isFeatureEnabled(flag) ?? defaultValue;
      setEnabled(isEnabled);
      setLoading(false);
    };
    
    checkFlag();
    
    // Suscribirse a cambios
    const unsubscribe = posthog.onFeatureFlags(checkFlag);
    
    return () => unsubscribe();
  }, [flag, defaultValue]);
  
  return { enabled, loading };
}

// Componente condicional con feature flag
export function FeatureFlagGuard({
  flag,
  children,
  fallback = null,
}: {
  flag: FeatureFlag;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { enabled, loading } = useFeatureFlag(flag);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!enabled) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Uso
function PracticePage() {
  return (
    <div>
      <FeatureFlagGuard flag="new_practice_ui" fallback={<OldPracticeUI />}>
        <NewPracticeUI />
      </FeatureFlagGuard>
    </div>
  );
}
```

### 6. Funnels de Conversión

```typescript
// lib/posthog/funnels.ts
import { trackEvent } from './events';

// Definir funnels
export const onboardingFunnel = {
  steps: [
    'onboarding_started',
    'onboarding_goal_selected',
    'onboarding_level_selected',
    'onboarding_calibration_completed',
    'onboarding_completed',
  ],
  
  trackStep(stepIndex: number, properties?: any) {
    trackEvent(this.steps[stepIndex] as any, properties);
  },
};

export const subscriptionFunnel = {
  steps: [
    'billing_page_viewed',
    'plan_selected',
    'checkout_started',
    'payment_info_entered',
    'subscription_started',
  ],
  
  trackStep(stepIndex: number, properties?: any) {
    trackEvent(this.steps[stepIndex] as any, properties);
  },
};

// Uso en componentes
function OnboardingFlow() {
  const [step, setStep] = useState(0);
  
  const handleNext = () => {
    // Trackear paso actual
    onboardingFunnel.trackStep(step, {
      stepDuration: Date.now() - stepStartTime,
    });
    
    setStep(step + 1);
    stepStartTime = Date.now();
  };
  
  const handleComplete = () => {
    onboardingFunnel.trackStep(onboardingFunnel.steps.length - 1, {
      totalDuration: Date.now() - onboardingStartTime,
    });
  };
  
  // ...
}
```

### 7. Consentimiento y Privacidad

```typescript
// components/privacy/cookie-consent.tsx
'use client';

import { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Verificar consentimiento guardado
    const stored = localStorage.getItem('vozazi_analytics_consent');
    
    if (stored === null) {
      // No hay consentimiento guardado, mostrar dialog
      setIsOpen(true);
    } else {
      // Aplicar consentimiento guardado
      const consent = stored === 'true';
      setHasConsent(consent);
      
      if (consent) {
        posthog.opt_in_capturing();
      } else {
        posthog.opt_out_capturing();
      }
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('vozazi_analytics_consent', 'true');
    posthog.opt_in_capturing();
    setHasConsent(true);
    setIsOpen(false);
  };
  
  const handleDecline = () => {
    localStorage.setItem('vozazi_analytics_consent', 'false');
    posthog.opt_out_capturing();
    setHasConsent(false);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferencias de Analítica</DialogTitle>
          <DialogDescription>
            Usamos PostHog para entender cómo usas VOZAZI y mejorar tu experiencia.
            Los datos son anónimos y no compartimos con terceros.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-2 text-sm">
          <p>¿Qué trackeamos?</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Páginas que visitas</li>
            <li>Ejercicios que completas</li>
            <li>Errores que encuentras</li>
            <li>Tiempo de práctica</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            No trackeamos: contraseñas, datos de pago, o contenido de audio.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleDecline}>
            Rechazar
          </Button>
          <Button onClick={handleAccept}>
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 8. Dashboard de Métricas Internas

```typescript
// app/admin/analytics/page.tsx
import { posthogServer } from '@/lib/posthog/server';

export default async function AnalyticsPage() {
  // Obtener métricas desde PostHog API
  const trends = await posthogServer.query({
    query: {
      kind: 'TrendsQuery',
      series: [
        {
          event: 'session_completed',
          kind: 'EventsNode',
        },
      ],
      dateRange: { date_from: '-30d' },
    },
  });
  
  const funnels = await posthogServer.query({
    query: {
      kind: 'FunnelsQuery',
      series: [
        { event: 'onboarding_started', kind: 'EventsNode' },
        { event: 'onboarding_completed', kind: 'EventsNode' },
      ],
      dateRange: { date_from: '-30d' },
    },
  });
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Sesiones Completadas"
          value={trends.results[0]?.count || 0}
          trend="+12%"
        />
        <MetricCard
          title="Onboarding Completion"
          value={`${calculateFunnelConversion(funnels)}%`}
          trend="+5%"
        />
        {/* Más métricas */}
      </div>
    </div>
  );
}
```

## Restricciones

- NO trackear datos sensibles (passwords, datos de pago)
- NO usar autocapture sin revisar qué captura
- NO olvidar implementar opt-out
- NO trackear en modo incógnito sin consentimiento
- Siempre enmascarar inputs sensibles en session recording
- Siempre respetar GDPR/privacidad
- Siempre verificar consentimiento antes de capturar

## Ejemplos

### Bueno: Tracking Completo de Sesión
```typescript
// components/practice/practice-session.tsx
'use client';

import { useEffect, useState } from 'react';
import { trackSessionStarted, trackSessionCompleted, trackError } from '@/lib/posthog/events';

export function PracticeSession({ sessionId, exerciseType }: PracticeSessionProps) {
  const [startTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    // Trackear inicio
    trackSessionStarted(sessionId, exerciseType);
    
    return () => {
      // Si el componente se desmonta sin completar, fue abandonado
      trackEvent('session_abandoned', {
        sessionId,
        duration: Date.now() - startTime,
      });
    };
  }, []);
  
  const handleComplete = async () => {
    try {
      const duration = Math.round((Date.now() - startTime) / 1000);
      
      // Completar sesión en backend
      const result = await completeSession(sessionId);
      setScore(result.score);
      
      // Trackear completado
      trackSessionCompleted(sessionId, duration, result.score);
      
      // Trackear ejercicio completado
      trackExerciseCompleted(exerciseType, result.score, result.difficulty);
    } catch (error) {
      trackError('session_completion', error instanceof Error ? error.message : 'Unknown');
    }
  };
  
  // ...
}
```
