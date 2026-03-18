/**
 * Environment Configuration for VOZAZI
 * 
 * Validación y tipado de variables de entorno.
 */

import { z } from 'zod'

// ============================================================================
// Environment Schema
// ============================================================================

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  
  // Database
  DATABASE_URL: z.string().url().optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Cloudflare R2
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().default('vozazi-audio'),
  
  // PostHog
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default('https://app.posthog.com'),
  
  // Resend
  RESEND_API_KEY: z.string().optional(),
  
  // Audio Engine
  NEXT_PUBLIC_AUDIO_ENGINE_URL: z.string().url().optional(),
  NEXT_PUBLIC_AUDIO_ENGINE_WS_URL: z.string().optional(),
  
  // OpenAI
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  
  // Anthropic
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-3-haiku-20240307'),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // i18n
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('es'),
  NEXT_PUBLIC_SUPPORTED_LOCALES: z.string().default('es,en,pt,fr,de,it')
})

// ============================================================================
// Type Inference
// ============================================================================

export type Env = z.infer<typeof envSchema>

// ============================================================================
// Validation
// ============================================================================

export function validateEnv(env: Record<string, string | undefined>): Env {
  return envSchema.parse(env)
}

export function getEnv(): Env {
  return validateEnv(process.env)
}

// ============================================================================
// Helper Functions
// ============================================================================

export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === 'development'
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production'
}

export function isTest(): boolean {
  return getEnv().NODE_ENV === 'test'
}

export function hasClerk(): boolean {
  return !!(getEnv().NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && getEnv().CLERK_SECRET_KEY)
}

export function hasStripe(): boolean {
  return !!(getEnv().STRIPE_SECRET_KEY && getEnv().NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
}

export function hasDatabase(): boolean {
  return !!getEnv().DATABASE_URL
}

export function hasR2(): boolean {
  return !!(getEnv().R2_ACCOUNT_ID && getEnv().R2_ACCESS_KEY_ID && getEnv().R2_SECRET_ACCESS_KEY)
}

export function hasPostHog(): boolean {
  return !!getEnv().NEXT_PUBLIC_POSTHOG_KEY
}

export function hasOpenAI(): boolean {
  return !!getEnv().OPENAI_API_KEY
}

export function hasAnthropic(): boolean {
  return !!getEnv().ANTHROPIC_API_KEY
}

export function hasRedis(): boolean {
  return !!getEnv().REDIS_URL || !!getEnv().UPSTASH_REDIS_REST_URL
}

export function hasAudioEngine(): boolean {
  return !!getEnv().NEXT_PUBLIC_AUDIO_ENGINE_URL
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULTS: Partial<Env> = {
  NODE_ENV: 'development',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://app.posthog.com',
  R2_BUCKET_NAME: 'vozazi-audio',
  OPENAI_MODEL: 'gpt-4o-mini',
  ANTHROPIC_MODEL: 'claude-3-haiku-20240307',
  NEXT_PUBLIC_DEFAULT_LOCALE: 'es',
  NEXT_PUBLIC_SUPPORTED_LOCALES: 'es,en,pt,fr,de,it',
  LOG_LEVEL: 'info'
}

// ============================================================================
// Locale Helpers
// ============================================================================

export function getSupportedLocales(): string[] {
  const locales = getEnv().NEXT_PUBLIC_SUPPORTED_LOCALES
  return locales.split(',').map(l => l.trim())
}

export function getDefaultLocale(): string {
  return getEnv().NEXT_PUBLIC_DEFAULT_LOCALE
}

export function isLocaleSupported(locale: string): boolean {
  return getSupportedLocales().includes(locale)
}
