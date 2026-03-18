/**
 * Context Builder for LLM
 * 
 * Construye contexto para prompts de LLM.
 */

import type { LLMContext, PedagogicalFeedback, LLMResponse } from './types'

// ============================================================================
// Context Builder
// ============================================================================

export class PedagogicalContextBuilder {
  private context: Partial<LLMContext> = {}

  setUserId(userId: string): this {
    this.context.userId = userId
    return this
  }

  setUserLevel(level: LLMContext['userLevel']): this {
    this.context.userLevel = level
    return this
  }

  setSessionMetrics(metrics: Record<string, number>): this {
    this.context.sessionMetrics = metrics
    return this
  }

  setDominantWeakness(weakness: LLMContext['dominantWeakness']): this {
    this.context.dominantWeakness = weakness
    return this
  }

  setSecondaryWeakness(weakness: LLMContext['secondaryWeakness']): this {
    this.context.secondaryWeakness = weakness
    return this
  }

  setDetectedErrors(errors: LLMContext['detectedErrors']): this {
    this.context.detectedErrors = errors
    return this
  }

  setRecentProgress(progress: LLMContext['recentProgress']): this {
    this.context.recentProgress = progress
    return this
  }

  setFatigueRisk(risk: LLMContext['fatigueRisk']): this {
    this.context.fatigueRisk = risk
    return this
  }

  setLinkedDocs(docs: LLMContext['linkedDocs']): this {
    this.context.linkedDocs = docs
    return this
  }

  setExerciseHistory(history: LLMContext['exerciseHistory']): this {
    this.context.exerciseHistory = history
    return this
  }

  build(): LLMContext {
    if (!this.context.userId || !this.context.userLevel) {
      throw new Error('userId and userLevel are required')
    }

    return this.context as LLMContext
  }

  toPrompt(): string {
    const ctx = this.build()
    
    let prompt = `Contexto del Usuario:\n`
    prompt += `- Nivel: ${ctx.userLevel}\n`
    
    if (ctx.sessionMetrics) {
      prompt += `\nMétricas de la Sesión:\n`
      Object.entries(ctx.sessionMetrics).forEach(([key, value]) => {
        prompt += `- ${key}: ${value}\n`
      })
    }
    
    if (ctx.dominantWeakness) {
      prompt += `\nDebilidad Principal: ${ctx.dominantWeakness}\n`
    }
    
    if (ctx.detectedErrors && ctx.detectedErrors.length > 0) {
      prompt += `\nErrores Detectados: ${ctx.detectedErrors.join(', ')}\n`
    }
    
    if (ctx.fatigueRisk) {
      prompt += `\nRiesgo de Fatiga: ${ctx.fatigueRisk}\n`
    }
    
    if (ctx.recentProgress && ctx.recentProgress.length > 0) {
      const trend = ctx.recentProgress[ctx.recentProgress.length - 1].score - 
                   ctx.recentProgress[0].score
      prompt += `\nTendencia de Progreso: ${trend > 0 ? 'Mejorando' : trend < 0 ? 'Declinando' : 'Estable'}\n`
    }
    
    return prompt
  }
}

// ============================================================================
// Response Parser
// ============================================================================

export function parseLLMResponse(response: string): Partial<LLMResponse> {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response)
    return parsed
  } catch {
    // Fallback: extract sections from text
    const result: Partial<LLMResponse> = {}
    
    const summaryMatch = response.match(/summary:?\s*(.+?)(?:\n|$)/i)
    if (summaryMatch) {
      result.summary = summaryMatch[1].trim()
    }
    
    const explanationMatch = response.match(/explanation:?\s*(.+?)(?:\n|$)/i)
    if (explanationMatch) {
      result.explanation = explanationMatch[1].trim()
    }
    
    const nextStepMatch = response.match(/(recommended_?next_?step|siguiente_?paso):?\s*(.+?)(?:\n|$)/i)
    if (nextStepMatch) {
      result.recommendedNextStep = nextStepMatch[2].trim()
    }
    
    return result
  }
}

// ============================================================================
// Feedback Generator
// ============================================================================

export function generateFeedbackFromLLM(
  context: LLMContext,
  llmResponse: LLMResponse,
  sessionId?: string,
  exerciseId?: string
): PedagogicalFeedback {
  return {
    id: crypto.randomUUID(),
    userId: context.userId,
    sessionId,
    exerciseId,
    type: sessionId ? 'post_session' : 'post_exercise',
    tone: llmResponse.tone || 'neutral',
    summary: llmResponse.summary,
    explanation: llmResponse.explanation,
    recommendedNextStep: llmResponse.recommendedNextStep,
    commonCauses: llmResponse.commonCauses,
    warningSignals: llmResponse.warningSignals,
    recommendedExercises: llmResponse.recommendedExercises,
    linkedDocs: llmResponse.linkedDocs,
    createdAt: Date.now()
  }
}

// ============================================================================
// Prompt Templates
// ============================================================================

export const PROMPT_TEMPLATES = {
  post_session: `
Eres un coach vocal experto. Analiza esta sesión y proporciona feedback constructivo.

${'{context}'}

Proporciona:
1. Un resumen breve del desempeño
2. Una explicación del error principal detectado
3. El siguiente paso recomendado
4. Causas comunes del problema
5. Señales de alarma a monitorear
6. Ejercicios recomendados
7. Documentos relacionados

Formato JSON:
{
  "summary": "...",
  "explanation": "...",
  "recommendedNextStep": "...",
  "commonCauses": ["...", "..."],
  "warningSignals": ["...", "..."],
  "recommendedExercises": ["...", "..."],
  "linkedDocs": ["...", "..."],
  "tone": "encouraging" | "neutral" | "conservative" | "urgent"
}
`.trim(),

  weekly_summary: `
Eres un coach vocal que prepara un resumen semanal para un estudiante.

${'{context}'}

Proporciona:
1. Resumen del progreso semanal
2. Logros destacados
3. Áreas a trabajar la próxima semana
4. Recomendaciones de práctica
5. Mensaje motivacional

Formato JSON:
{
  "summary": "...",
  "explanation": "...",
  "recommendedNextStep": "...",
  "tone": "encouraging"
}
`.trim()
}
