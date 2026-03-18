/**
 * Onboarding Flow Components
 * 
 * Componentes para el flujo de onboarding.
 */

'use client'

import { useState } from 'react'
import { Button } from '@vozazi/ui'

// ============================================================================
// Types
// ============================================================================

export interface OnboardingData {
  goals: string[]
  level: string
  voiceType: string
  availability: string
}

export interface OnboardingStepProps {
  data: OnboardingData
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  onComplete: (data: OnboardingData) => void
}

// ============================================================================
// Welcome Step
// ============================================================================

export function WelcomeStep({ onNext }: OnboardingStepProps) {
  return (
    <div className="space-y-6 text-center" data-testid="onboarding-welcome">
      <div>
        <h2 className="text-3xl font-bold">¡Bienvenido a VOZAZI!</h2>
        <p className="text-muted-foreground">
          Comencemos con tu viaje vocal
        </p>
      </div>

      <div className="py-8">
        <p className="text-lg">
          Te ayudaremos a configurar tu perfil para ofrecerte
          la mejor experiencia de entrenamiento vocal.
        </p>
      </div>

      <Button onClick={() => onNext({})} data-testid="next-button">
        Comenzar
      </Button>
    </div>
  )
}

// ============================================================================
// Goals Step
// ============================================================================

const GOALS = [
  { id: 'improve_pitch', label: 'Mejorar afinación' },
  { id: 'increase_range', label: 'Aumentar rango vocal' },
  { id: 'better_technique', label: 'Mejorar técnica' },
  { id: 'prepare_performance', label: 'Preparar actuación' },
  { id: 'recover_voice', label: 'Recuperar voz' },
  { id: 'general_fitness', label: 'Fitness vocal general' }
]

export function GoalsStep({ data, onNext, onBack }: OnboardingStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals || [])

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    )
  }

  const handleNext = () => {
    onNext({ goals: selectedGoals })
  }

  return (
    <div className="space-y-6" data-testid="onboarding-goals">
      <div>
        <h2 className="text-2xl font-bold">¿Qué quieres lograr?</h2>
        <p className="text-muted-foreground">
          Selecciona tus objetivos principales
        </p>
      </div>

      <div className="grid gap-3">
        {GOALS.map(goal => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`flex items-center rounded-lg border p-4 text-left transition-colors ${
              selectedGoals.includes(goal.id)
                ? 'border-primary bg-primary/10'
                : 'hover:bg-accent'
            }`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded border mr-3">
              {selectedGoals.includes(goal.id) && (
                <div className="h-3 w-3 rounded-sm bg-primary" />
              )}
            </div>
            {goal.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} data-testid="back-button">
          Volver
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedGoals.length === 0}
          data-testid="next-button"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// Level Step
// ============================================================================

const LEVELS = [
  { id: 'beginner', label: 'Principiante (0-1 años)' },
  { id: 'intermediate', label: 'Intermedio (1-3 años)' },
  { id: 'advanced', label: 'Avanzado (3+ años)' },
  { id: 'professional', label: 'Profesional' }
]

export function LevelStep({ data, onNext, onBack }: OnboardingStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(data.level || '')

  const handleNext = () => {
    onNext({ level: selectedLevel })
  }

  return (
    <div className="space-y-6" data-testid="onboarding-level">
      <div>
        <h2 className="text-2xl font-bold">¿Cuál es tu experiencia cantando?</h2>
        <p className="text-muted-foreground">
          Selecciona tu nivel actual
        </p>
      </div>

      <div className="grid gap-3">
        {LEVELS.map(level => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`flex items-center rounded-lg border p-4 text-left transition-colors ${
              selectedLevel === level.id
                ? 'border-primary bg-primary/10'
                : 'hover:bg-accent'
            }`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full border mr-3">
              {selectedLevel === level.id && (
                <div className="h-3 w-3 rounded-full bg-primary" />
              )}
            </div>
            {level.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} data-testid="back-button">
          Volver
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedLevel}
          data-testid="next-button"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// Availability Step
// ============================================================================

const AVAILABILITY = [
  { id: 'daily_5', label: '5 min al día' },
  { id: 'daily_15', label: '15 min al día' },
  { id: 'daily_30', label: '30 min al día' },
  { id: 'weekly_few', label: 'Unas veces por semana' }
]

export function AvailabilityStep({ data, onNext, onBack, onComplete }: OnboardingStepProps) {
  const [selectedAvailability, setSelectedAvailability] = useState<string>(data.availability || '')

  const handleComplete = () => {
    onComplete({
      ...data,
      availability: selectedAvailability
    })
  }

  return (
    <div className="space-y-6" data-testid="onboarding-availability">
      <div>
        <h2 className="text-2xl font-bold">¿Cuánto tiempo puedes practicar?</h2>
        <p className="text-muted-foreground">
          Selecciona tu disponibilidad
        </p>
      </div>

      <div className="grid gap-3">
        {AVAILABILITY.map(option => (
          <button
            key={option.id}
            onClick={() => setSelectedAvailability(option.id)}
            className={`flex items-center rounded-lg border p-4 text-left transition-colors ${
              selectedAvailability === option.id
                ? 'border-primary bg-primary/10'
                : 'hover:bg-accent'
            }`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full border mr-3">
              {selectedAvailability === option.id && (
                <div className="h-3 w-3 rounded-full bg-primary" />
              )}
            </div>
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} data-testid="back-button">
          Volver
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!selectedAvailability}
          data-testid="finish-button"
        >
          Finalizar
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// Complete Step
// ============================================================================

export function CompleteStep({ onComplete }: OnboardingStepProps) {
  return (
    <div className="space-y-6 text-center" data-testid="onboarding-complete">
      <div>
        <h2 className="text-3xl font-bold">¡Todo listo!</h2>
        <p className="text-muted-foreground">
          Tu perfil está configurado
        </p>
      </div>

      <div className="py-8">
        <p className="text-lg">
          Ahora puedes comenzar tu primera práctica
        </p>
      </div>

      <Button onClick={() => onComplete({})} data-testid="next-step-button">
        Comenzar primera práctica
      </Button>
    </div>
  )
}

// ============================================================================
// Main Onboarding Component
// ============================================================================

const STEPS = ['welcome', 'goals', 'level', 'availability', 'complete']

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    goals: [],
    level: '',
    voiceType: '',
    availability: ''
  })

  const handleNext = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }))
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleComplete = (data: OnboardingData) => {
    setOnboardingData(prev => ({ ...prev, ...data }))
    console.log('Onboarding completed:', { ...onboardingData, ...data })
    // Here would be the redirect to dashboard
  }

  const stepProps = {
    data: onboardingData,
    onNext: handleNext,
    onBack: handleBack,
    onComplete: handleComplete
  }

  const renderStep = () => {
    switch (STEPS[currentStep]) {
      case 'welcome':
        return <WelcomeStep {...stepProps} />
      case 'goals':
        return <GoalsStep {...stepProps} />
      case 'level':
        return <LevelStep {...stepProps} />
      case 'availability':
        return <AvailabilityStep {...stepProps} />
      case 'complete':
        return <CompleteStep {...stepProps} />
      default:
        return null
    }
  }

  return (
    <div className="container max-w-2xl py-12">
      {/* Progress Indicator */}
      <div className="mb-8" data-testid="progress-indicator">
        <div className="flex justify-between">
          {STEPS.map((_, index) => (
            <div
              key={index}
              data-testid={`progress-step-${index + 1}`}
              data-state={
                index === currentStep ? 'active' :
                index < currentStep ? 'completed' : 'pending'
              }
              className={`h-2 flex-1 rounded ${
                index < currentStep ? 'bg-primary' :
                index === currentStep ? 'bg-primary/50' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Paso {currentStep + 1} de {STEPS.length}
        </p>
      </div>

      {renderStep()}
    </div>
  )
}
