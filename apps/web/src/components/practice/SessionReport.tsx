/**
 * Session Report Component
 * 
 * Componente para mostrar el reporte post-sesión.
 */

'use client'

import { Button } from '@vozazi/ui'

export interface SessionReportProps {
  duration: number
  exerciseType: string
  score?: number
  metrics?: Record<string, number>
  onPracticeAgain: () => void
  onBackToDashboard: () => void
}

export function SessionReport({
  duration,
  exerciseType,
  score,
  metrics,
  onPracticeAgain,
  onBackToDashboard
}: SessionReportProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6" data-testid="results-page">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Sesión Completada</h2>
        <p className="text-muted-foreground">
          ¡Buen trabajo! Aquí están tus resultados
        </p>
      </div>

      {/* Score Display */}
      {score !== undefined && (
        <div className="flex justify-center" data-testid="overall-score}>
          <div className="text-center">
            <p className="text-6xl font-bold">{score}</p>
            <p className="text-sm text-muted-foreground">Puntuación</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Duración</p>
          <p className="text-2xl font-bold">{formatDuration(duration)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Ejercicio</p>
          <p className="text-2xl font-bold capitalize">{exerciseType}</p>
        </div>
      </div>

      {/* Detailed Metrics */}
      {metrics && (
        <div className="space-y-2">
          <h3 className="font-semibold">Métricas Detalladas</h3>
          <div className="grid gap-2 md:grid-cols-3">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-lg font-bold">
                  {typeof value === 'number' ? (value * 100).toFixed(0) : value}
                  {typeof value === 'number' && value <= 1 && value >= 0 ? '%' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={onPracticeAgain}
          className="flex-1"
          data-testid="next-exercise-button"
        >
          Practicar de nuevo
        </Button>
        <Button
          onClick={onBackToDashboard}
          variant="outline"
          className="flex-1"
        >
          Volver al dashboard
        </Button>
      </div>
    </div>
  )
}
