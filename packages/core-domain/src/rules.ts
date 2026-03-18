/**
 * Domain Rules for VOZAZI
 * 
 * Reglas de negocio puras y especificaciones de dominio.
 */

import type { Score, AudioMetrics, WeaknessType, Exercise, Task, VocalProfile } from './entities'

// ============================================================================
// Scoring Rules
// ============================================================================

export const ScoringRules = {
  /**
   * Calcula el score overall basado en las métricas de audio.
   * Fórmula: 40% pitch_accuracy + 20% pitch_stability + 15% onset_control + 15% breath_support + 10% consistency
   */
  calculateOverallScore(metrics: AudioMetrics): Score {
    const score = (
      metrics.pitchAccuracy * 0.40 +
      metrics.pitchStability * 0.20 +
      metrics.onsetControl * 0.15 +
      metrics.breathSupport * 0.15 +
      metrics.consistency * 0.10
    ) * 100

    return Math.round(score) as Score
  },

  /**
   * Detecta la debilidad dominante basada en las métricas.
   */
  detectDominantWeakness(metrics: AudioMetrics): WeaknessType {
    const weaknesses: Array<{ metric: string; value: number; type: WeaknessType }> = [
      { metric: 'pitchAccuracy', value: metrics.pitchAccuracy, type: 'intonation_accuracy' },
      { metric: 'pitchStability', value: metrics.pitchStability, type: 'pitch_stability' },
      { metric: 'onsetControl', value: metrics.onsetControl, type: 'attack_control' },
      { metric: 'breathSupport', value: metrics.breathSupport, type: 'breath_support' },
      { metric: 'consistency', value: metrics.consistency, type: 'phrase_stability' }
    ]

    // Encontrar la métrica más baja
    const weakest = weaknesses.reduce((min, current) => 
      current.value < min.value ? current : min
    )

    return weakest.type
  },

  /**
   * Determina si el score es suficiente para avanzar.
   */
  shouldAdvance(score: Score, threshold: number = 85): boolean {
    return score >= threshold
  },

  /**
   * Determina si se debe mantener el nivel.
   */
  shouldMaintain(score: Score, minScore: number = 60, maxScore: number = 85): boolean {
    return score >= minScore && score < maxScore
  },

  /**
   * Determina si se debe reducir la dificultad.
   */
  shouldReduce(score: Score, threshold: number = 60): boolean {
    return score < threshold
  }
}

// ============================================================================
// Exercise Rules
// ============================================================================

export const ExerciseRules = {
  /**
   * Verifica si un usuario puede realizar un ejercicio basado en su nivel.
   */
  canDoExercise(exercise: Exercise, userLevel: number): boolean {
    return exercise.difficultyLevel <= userLevel + 2
  },

  /**
   * Verifica si se cumplen los criterios de éxito.
   */
  meetsSuccessCriteria(metrics: AudioMetrics, criteria: Record<string, number>): boolean {
    return Object.entries(criteria).every(([key, threshold]) => {
      const metric = metrics[key as keyof AudioMetrics] as number
      return metric !== undefined && metric >= threshold
    })
  },

  /**
   * Calcula la duración total de un ejercicio con repeticiones.
   */
  calculateTotalDuration(exercise: Exercise): number {
    return exercise.durationSeconds * exercise.repetitions
  }
}

// ============================================================================
// Task Rules
// ============================================================================

export const TaskRules = {
  /**
   * Determina la siguiente dificultad basada en el resultado.
   */
  getNextDifficulty(currentLevel: number, completed: boolean, score: Score): number {
    if (ScoringRules.shouldAdvance(score)) {
      return Math.min(10, currentLevel + 1)
    }
    
    if (ScoringRules.shouldReduce(score)) {
      return Math.max(1, currentLevel - 1)
    }
    
    return currentLevel
  },

  /**
   * Verifica si una tarea está vencida.
   */
  isExpired(task: Task, currentTime: number): boolean {
    return task.expiresAt !== undefined && currentTime > task.expiresAt
  },

  /**
   * Verifica si una tarea puede ser asignada a un usuario.
   */
  canAssign(task: Task, profile: VocalProfile): boolean {
    // Verificar nivel de dificultad
    const maxDifficulty = profile.currentLevel === 'beginner' ? 3 :
                         profile.currentLevel === 'intermediate' ? 6 :
                         profile.currentLevel === 'advanced' ? 8 : 10

    if (task.difficultyLevel > maxDifficulty) {
      return false
    }

    // Verificar estado de fatiga
    if (profile.fatigueRiskState === 'high' && task.durationMinutes > 10) {
      return false
    }

    return true
  }
}

// ============================================================================
// Progress Rules
// ============================================================================

export const ProgressRules = {
  /**
   * Calcula la tendencia basada en scores históricos.
   */
  calculateTrend(scores: Score[]): 'improving' | 'stable' | 'declining' {
    if (scores.length < 2) {
      return 'stable'
    }

    const recent = scores.slice(-3)
    const older = scores.slice(-6, -3)

    if (older.length === 0) {
      return 'stable'
    }

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length

    const diff = recentAvg - olderAvg

    if (diff > 5) return 'improving'
    if (diff < -5) return 'declining'
    return 'stable'
  },

  /**
   * Determina si un usuario está en riesgo de abandono.
   */
  isAtRiskOfAbandonment(lastSessionDays: number, averageSessionsPerWeek: number): boolean {
    const expectedSessions = averageSessionsPerWeek * (lastSessionDays / 7)
    return expectedSessions > 2 && lastSessionDays > 14
  }
}

// ============================================================================
// Fatigue Rules
// ============================================================================

export const FatigueRules = {
  /**
   * Calcula el riesgo de fatiga basado en la práctica reciente.
   */
  calculateFatigueRisk(
    sessionsLast24h: number,
    sessionsLast7d: number,
    averageScore: number
  ): 'low' | 'medium' | 'high' {
    // Muchas sesiones en 24h
    if (sessionsLast24h >= 3) {
      return 'high'
    }

    // Muchas sesiones en 7d con bajo score
    if (sessionsLast7d >= 10 && averageScore < 70) {
      return 'high'
    }

    // Sesiones moderadas con score bajo
    if (sessionsLast7d >= 5 && averageScore < 60) {
      return 'medium'
    }

    // Pocas sesiones
    if (sessionsLast7d <= 2) {
      return 'low'
    }

    return 'medium'
  },

  /**
   * Recomienda descanso basado en el riesgo de fatiga.
   */
  shouldRecommendRest(riskLevel: 'low' | 'medium' | 'high'): boolean {
    return riskLevel === 'high'
  },

  /**
   * Ajusta la duración de práctica recomendada.
   */
  adjustPracticeDuration(riskLevel: 'low' | 'medium' | 'high', baseDuration: number): number {
    switch (riskLevel) {
      case 'high':
        return Math.max(5, baseDuration * 0.5)
      case 'medium':
        return baseDuration * 0.75
      default:
        return baseDuration
    }
  }
}

// ============================================================================
// Validation Rules
// ============================================================================

export const ValidationRules = {
  /**
   * Valida que un audio chunk tenga duración válida.
   */
  isValidChunkDuration(durationSeconds: number): boolean {
    // Feedback: 200-500ms, Análisis: 1-3s
    return durationSeconds >= 0.2 && durationSeconds <= 3
  },

  /**
   * Valida que un sample rate sea soportado.
   */
  isValidSampleRate(sampleRate: number): boolean {
    return [8000, 16000, 22050, 44100, 48000].includes(sampleRate)
  },

  /**
   * Valida que una nota esté dentro del rango vocal humano.
   */
  isValidVocalRange(note: string): boolean {
    const match = note.match(/^([A-G])([b#])?(\d)$/)
    if (!match) return false
    
    const octave = parseInt(match[3])
    return octave >= 1 && octave <= 7
  }
}
