/**
 * Plan Definitions for VOZAZI
 * 
 * Definición de planes y características.
 */

import type { Plan, PlanLimit, PlanFeature } from './types'

// ============================================================================
// Plan Limits
// ============================================================================

export const PLAN_LIMITS: Record<string, PlanLimit> = {
  free: {
    audioMinutesPerMonth: 60,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxConcurrentProcessing: 1,
    maxStorageGB: 1,
    features: ['transcription', 'basic-analysis']
  },
  pro: {
    audioMinutesPerMonth: 600,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxConcurrentProcessing: 5,
    maxStorageGB: 50,
    features: [
      'transcription',
      'advanced-analysis',
      'emotion-detection',
      'speaker-identification',
      'progress-tracking',
      'priority-support'
    ]
  },
  enterprise: {
    audioMinutesPerMonth: -1, // unlimited
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxConcurrentProcessing: 20,
    maxStorageGB: 500,
    features: [
      'all',
      'ai-coaching',
      'custom-exercises',
      'detailed-reports',
      'api-access',
      'dedicated-support',
      'sla'
    ]
  }
}

// ============================================================================
// Plan Features
// ============================================================================

export const ALL_FEATURES: PlanFeature[] = [
  {
    id: 'transcription',
    name: 'Transcripción de Audio',
    description: 'Convierte audio a texto con IA',
    included: true
  },
  {
    id: 'basic-analysis',
    name: 'Análisis Básico',
    description: 'Métricas fundamentales de voz',
    included: true
  },
  {
    id: 'advanced-analysis',
    name: 'Análisis Avanzado',
    description: 'Métricas detalladas y scoring',
    included: true
  },
  {
    id: 'emotion-detection',
    name: 'Detección de Emociones',
    description: 'Identifica emociones en la voz',
    included: true
  },
  {
    id: 'speaker-identification',
    name: 'Identificación de Locutores',
    description: 'Reconoce múltiples voces',
    included: true
  },
  {
    id: 'progress-tracking',
    name: 'Seguimiento de Progreso',
    description: 'Historial y evolución temporal',
    included: true
  },
  {
    id: 'priority-support',
    name: 'Soporte Prioritario',
    description: 'Respuesta en menos de 24h',
    included: true
  },
  {
    id: 'ai-coaching',
    name: 'Coaching con IA',
    description: 'Recomendaciones personalizadas',
    included: true
  },
  {
    id: 'custom-exercises',
    name: 'Ejercicios Personalizados',
    description: 'Rutinas adaptadas a tu voz',
    included: true
  },
  {
    id: 'detailed-reports',
    name: 'Informes Detallados',
    description: 'Reportes semanales y mensuales',
    included: true
  },
  {
    id: 'api-access',
    name: 'Acceso a API',
    description: 'Integración con tu stack',
    included: true
  },
  {
    id: 'dedicated-support',
    name: 'Soporte Dedicado',
    description: 'Manager de cuenta personal',
    included: true
  },
  {
    id: 'sla',
    name: 'SLA Garantizado',
    description: '99.9% uptime garantizado',
    included: true
  }
]

// ============================================================================
// Plan Definitions
// ============================================================================

export const PLANS: Plan[] = [
  {
    id: 'free',
    type: 'free',
    name: 'Gratis',
    description: 'Para empezar a entrenar tu voz',
    pricing: {
      monthly: 0,
      yearly: 0,
      currency: 'USD'
    },
    limits: PLAN_LIMITS.free,
    features: ALL_FEATURES.slice(0, 2),
    popular: false
  },
  {
    id: 'pro',
    type: 'pro',
    name: 'Pro',
    description: 'Para cantantes serios',
    pricing: {
      monthly: 1999,
      yearly: 19990,
      currency: 'USD'
    },
    limits: PLAN_LIMITS.pro,
    features: ALL_FEATURES.slice(0, 6),
    popular: true
  },
  {
    id: 'enterprise',
    type: 'enterprise',
    name: 'Enterprise',
    description: 'Para profesionales y estudios',
    pricing: {
      monthly: 4999,
      yearly: 49990,
      currency: 'USD'
    },
    limits: PLAN_LIMITS.enterprise,
    features: ALL_FEATURES,
    popular: false
  }
]

// ============================================================================
// Plan Helpers
// ============================================================================

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): Plan | undefined {
  return PLANS.find(plan => plan.id === planId)
}

/**
 * Get plan by type
 */
export function getPlanByType(type: string): Plan | undefined {
  return PLANS.find(plan => plan.type === type)
}

/**
 * Check if feature is included in plan
 */
export function hasFeature(planId: string, featureId: string): boolean {
  const plan = getPlanById(planId)
  if (!plan) return false
  
  return plan.features.some(f => f.id === featureId)
}

/**
 * Calculate remaining usage
 */
export function calculateRemaining(
  used: number,
  limit: number
): number {
  if (limit < 0) return -1 // unlimited
  return Math.max(0, limit - used)
}

/**
 * Calculate percentage used
 */
export function calculatePercentageUsed(
  used: number,
  limit: number
): number {
  if (limit < 0) return 0 // unlimited
  if (limit === 0) return 100
  return Math.min(100, Math.round((used / limit) * 100))
}

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format price to currency string
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  }
  
  const symbol = symbols[currency] || currency
  return `${symbol}${(amount / 100).toFixed(2)}`
}
