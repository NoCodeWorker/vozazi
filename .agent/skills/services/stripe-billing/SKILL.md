---
name: stripe-billing
description: Stripe para suscripciones, pagos y billing en VOZAZI. Use cuando implemente checkout, gestión de suscripciones, webhooks, o portal de cliente.
---

# Stripe Billing Skill

Esta skill proporciona experiencia en Stripe para implementar sistema de suscripciones y billing en VOZAZI.

## Objetivo

Implementar gestión completa de suscripciones, checkout, webhooks y portal de cliente usando Stripe en VOZAZI.

## Instrucciones

### 1. Configuración Inicial

```bash
npm install stripe @stripe/stripe-js
```

```typescript
// lib/stripe/config.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export const getStripeClient = () => stripe;
```

### 2. Crear Productos y Precios

```typescript
// lib/stripe/products.ts
import { stripe } from './config';

export const PLAN_IDS = {
  FREE: 'price_free_tier',
  BASIC: 'price_basic_monthly',
  PRO: 'price_pro_monthly',
  PRO_ANNUAL: 'price_pro_annual',
} as const;

export type PlanId = typeof PLAN_IDS[keyof typeof PLAN_IDS];

export const PLANS = {
  [PLAN_IDS.FREE]: {
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '5 sesiones por mes',
      'Análisis básico',
      'Sin histórico',
    ],
  },
  [PLAN_IDS.BASIC]: {
    name: 'Basic',
    price: 999, // $9.99 en cents
    interval: 'month',
    features: [
      'Sesiones ilimitadas',
      'Análisis completo',
      'Histórico 30 días',
      'Email support',
    ],
  },
  [PLAN_IDS.PRO]: {
    name: 'Pro',
    price: 1999, // $19.99 en cents
    interval: 'month',
    features: [
      'Todo en Basic',
      'Histórico ilimitado',
      'Adaptive Training Engine',
      'Feedback con IA',
      'Priority support',
    ],
  },
  [PLAN_IDS.PRO_ANNUAL]: {
    name: 'Pro Annual',
    price: 19990, // $199.90 en cents (2 meses gratis)
    interval: 'year',
    features: [
      'Todo en Pro',
      '2 meses gratis',
      'Early access features',
    ],
  },
};

export async function getStripePrice(planId: PlanId) {
  const price = await stripe.prices.retrieve(planId);
  return price;
}
```

### 3. Checkout Session

```typescript
// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { requireUser } from '@/lib/auth/require-user';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const { planId, successUrl, cancelUrl } = await request.json();
  
  // 1. Verificar si ya tiene suscripción activa
  const existingSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, user.id),
  });
  
  if (existingSubscription?.status === 'active') {
    return NextResponse.json(
      { error: 'Already subscribed' },
      { status: 400 }
    );
  }
  
  // 2. Crear o actualizar Customer en Stripe
  let stripeCustomerId = existingSubscription?.stripeCustomerId;
  
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
        clerkUserId: user.clerkUserId,
      },
    });
    
    stripeCustomerId = customer.id;
    
    await db.update(subscriptions)
      .set({ stripeCustomerId })
      .where(eq(subscriptions.userId, user.id));
  }
  
  // 3. Crear Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: planId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    metadata: {
      userId: user.id,
      planId,
    },
  });
  
  return NextResponse.json({ url: session.url });
}
```

### 4. Portal de Cliente

```typescript
// app/api/stripe/portal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { requireUser } from '@/lib/auth/require-user';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const { returnUrl } = await request.json();
  
  // 1. Obtener Stripe Customer ID
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, user.id),
  });
  
  if (!subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: 'No subscription found' },
      { status: 404 }
    );
  }
  
  // 2. Crear Portal Session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: returnUrl,
  });
  
  return NextResponse.json({ url: portalSession.url });
}
```

### 5. Webhooks de Stripe

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
import { db } from '@/db';
import { subscriptions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const relevantEvents = [
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
];

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;
  
  // 1. Verificar firma del webhook
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Invalid webhook signature:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  // 2. Ignorar eventos no relevantes
  if (!relevantEvents.includes(event.type)) {
    return NextResponse.json({ received: true });
  }
  
  // 3. Procesar eventos idempotentemente
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }
      
      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json(
      { error: 'Handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { metadata, customer, subscription } = session;
  
  if (!metadata?.userId || !subscription) {
    throw new Error('Missing metadata');
  }
  
  // Obtener detalles de la suscripción
  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription as string
  );
  
  // Actualizar BD
  await db.update(subscriptions)
    .set({
      stripeSubscriptionId: stripeSubscription.id,
      planCode: stripeSubscription.items.data[0]?.price.id,
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, metadata.userId));
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const stripeSubscriptionId = subscription.id;
  
  // Buscar suscripción en BD
  const dbSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId),
  });
  
  if (!dbSubscription) {
    console.warn('Subscription not found in DB:', stripeSubscriptionId);
    return;
  }
  
  // Actualizar estado
  await db.update(subscriptions)
    .set({
      status: subscription.status,
      planCode: subscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, dbSubscription.id));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const stripeSubscriptionId = subscription.id;
  
  await db.update(subscriptions)
    .set({
      status: 'canceled',
      stripeSubscriptionId: null,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Opcional: Enviar email de confirmación
  // Opcional: Actualizar métricas de pago
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Opcional: Notificar al usuario
  // Opcional: Marcar para seguimiento
}
```

### 6. Verificar Suscripción

```typescript
// lib/auth/check-subscription.ts
import { requireUser } from './require-user';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'unpaid';

export async function checkSubscriptionStatus(): Promise<{
  status: SubscriptionStatus;
  plan: string | null;
  currentPeriodEnd: Date | null;
  isActive: boolean;
}> {
  const user = await requireUser();
  
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, user.id),
  });
  
  if (!subscription) {
    return {
      status: 'unpaid',
      plan: null,
      currentPeriodEnd: null,
      isActive: false,
    };
  }
  
  const isActive = ['active', 'trialing'].includes(subscription.status || '');
  
  return {
    status: subscription.status as SubscriptionStatus,
    plan: subscription.planCode,
    currentPeriodEnd: subscription.currentPeriodEnd,
    isActive,
  };
}

export async function requireActiveSubscription() {
  const { isActive, status } = await checkSubscriptionStatus();
  
  if (!isActive) {
    throw new Error(`Subscription ${status || 'not found'}`);
  }
  
  return true;
}

// Server Action protegida por suscripción
export async function accessPremiumFeature() {
  await requireActiveSubscription();
  
  // Lógica premium
}
```

### 7. Componente de Pricing

```typescript
// components/billing/pricing-cards.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface PricingCardProps {
  planId: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  isPopular?: boolean;
}

export function PricingCards() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/billing/success`,
          cancelUrl: `${window.location.origin}/billing`,
        }),
      });
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(null);
    }
  };
  
  const plans: PricingCardProps[] = [
    {
      planId: 'price_basic_monthly',
      name: 'Basic',
      price: 999,
      interval: 'month',
      features: [
        'Sesiones ilimitadas',
        'Análisis completo',
        'Histórico 30 días',
        'Email support',
      ],
    },
    {
      planId: 'price_pro_monthly',
      name: 'Pro',
      price: 1999,
      interval: 'month',
      isPopular: true,
      features: [
        'Todo en Basic',
        'Histórico ilimitado',
        'Adaptive Training Engine',
        'Feedback con IA',
        'Priority support',
      ],
    },
    {
      planId: 'price_pro_annual',
      name: 'Pro Annual',
      price: 19990,
      interval: 'year',
      features: [
        'Todo en Pro',
        '2 meses gratis',
        'Early access features',
      ],
    },
  ];
  
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.planId}
          className={plan.isPopular ? 'border-primary shadow-lg' : ''}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>
              ${plan.price / 100} / {plan.interval === 'month' ? 'mes' : 'año'}
            </CardDescription>
            {plan.isPopular && (
              <span className="text-xs font-medium text-primary">
                Más popular
              </span>
            )}
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => handleSubscribe(plan.planId)}
              disabled={isLoading === plan.planId}
            >
              {isLoading === plan.planId ? 'Processing...' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
```

## Restricciones

- NO exponer Stripe secret keys en el cliente
- NO confiar en datos del cliente para verificación
- NO olvidar verificar firma de webhooks
- NO procesar webhooks sin idempotencia
- NO usar precios hardcodeados (usar IDs de Stripe)
- Siempre manejar errores de checkout
- Siempre verificar estado de suscripción antes de dar acceso

## Ejemplos

### Bueno: Protección de Feature Premium
```typescript
// app/practice/premium-practice.tsx
import { checkSubscriptionStatus } from '@/lib/auth/check-subscription';
import { redirect } from 'next/navigation';

export async function PremiumPracticeSession() {
  const { isActive, currentPeriodEnd } = await checkSubscriptionStatus();
  
  if (!isActive) {
    redirect('/billing?required=premium');
  }
  
  const isExpiringSoon = currentPeriodEnd && 
    new Date(currentPeriodEnd).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
  
  return (
    <div>
      {isExpiringSoon && (
        <Alert variant="warning">
          Tu suscripción expira pronto. <Link href="/billing">Renovar</Link>
        </Alert>
      )}
      
      {/* Contenido premium */}
    </div>
  );
}
```
