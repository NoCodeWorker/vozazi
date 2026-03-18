/**
 * Exercise Catalog for VOZAZI
 * 
 * Catálogo de ejercicios vocales.
 */

import type { ExerciseDefinition, ExerciseCategory, ExerciseLevel } from './types'

export const EXERCISE_CATALOG: ExerciseDefinition[] = [
  // Warm Up Exercises
  {
    id: 'warm_up_001',
    code: 'warm_up_basic',
    name: 'Calentamiento Básico',
    description: 'Ejercicio suave para preparar la voz antes de practicar.',
    category: 'warm_up',
    level: 'beginner',
    primaryTechnique: 'breath_support',
    durationSeconds: 60,
    repetitions: 3,
    restSeconds: 30,
    instructions: [
      'Respira profundamente 3 veces',
      'Tararea suavemente con la boca cerrada',
      'Desliza de grave a agudo suavemente',
      'Relaja la mandíbula y el cuello'
    ],
    tips: [
      'No fuerces el volumen',
      'Mantén la postura relajada',
      'Escucha tu cuerpo'
    ],
    prerequisites: []
  },

  // Pitch Accuracy Exercises
  {
    id: 'pitch_001',
    code: 'sustain_note_basic',
    name: 'Nota Sostenida Básica',
    description: 'Mantén una nota estable durante el tiempo indicado.',
    category: 'pitch_accuracy',
    level: 'beginner',
    primaryTechnique: 'pitch_control',
    durationSeconds: 10,
    repetitions: 5,
    restSeconds: 15,
    instructions: [
      'Respira profundamente',
      'Canta la nota objetivo con "ah"',
      'Mantén la nota estable',
      'Relaja al finalizar'
    ],
    tips: [
      'Escucha la nota antes de cantar',
      'Mantén el soporte de aire constante',
      'Relaja la garganta'
    ],
    warnings: [
      'Detente si sientes tensión',
      'Descansa entre repeticiones'
    ]
  },
  {
    id: 'pitch_002',
    code: 'sustain_note_precision',
    name: 'Nota Sostenida de Precisión',
    description: 'Mantén una nota con precisión de afinación.',
    category: 'pitch_accuracy',
    level: 'intermediate',
    primaryTechnique: 'intonation_accuracy',
    durationSeconds: 15,
    repetitions: 5,
    restSeconds: 20,
    instructions: [
      'Escucha la nota de referencia',
      'Canta con precisión',
      'Ajusta si es necesario',
      'Mantén hasta el final'
    ],
    tips: [
      'Usa referencia de piano',
      'Ajusta suavemente',
      'Confía en tu oído'
    ],
    prerequisites: ['sustain_note_basic']
  },
  {
    id: 'pitch_003',
    code: 'pitch_target_basic',
    name: 'Objetivo de Pitch Básico',
    description: 'Alcanza notas objetivo específicas con precisión.',
    category: 'pitch_accuracy',
    level: 'beginner',
    primaryTechnique: 'pitch_control',
    durationSeconds: 5,
    repetitions: 10,
    restSeconds: 10,
    instructions: [
      'Escucha la nota objetivo',
      'Cántala inmediatamente',
      'Mantén por 3 segundos',
      'Descansa'
    ],
    tips: [
      'Prepara mentalmente el pitch',
      'No deslices hacia la nota',
      'Sé preciso desde el inicio'
    ]
  },
  {
    id: 'pitch_004',
    code: 'pitch_target_precision',
    name: 'Objetivo de Pitch de Precisión',
    description: 'Alcanza notas con precisión de cents.',
    category: 'pitch_accuracy',
    level: 'advanced',
    primaryTechnique: 'intonation_accuracy',
    durationSeconds: 5,
    repetitions: 15,
    restSeconds: 10,
    instructions: [
      'Escucha atentamente',
      'Alcanza el pitch exacto',
      'Mantén estable',
      'Verifica con referencia'
    ],
    tips: [
      'Entrena tu oído diariamente',
      'Grábate para verificar',
      'Sé paciente'
    ],
    prerequisites: ['pitch_target_basic']
  },

  // Breath Control Exercises
  {
    id: 'breath_001',
    code: 'breath_control_basic',
    name: 'Control de Aire Básico',
    description: 'Desarrolla el soporte de aire fundamental.',
    category: 'breath_control',
    level: 'beginner',
    primaryTechnique: 'breath_support',
    durationSeconds: 30,
    repetitions: 5,
    restSeconds: 30,
    instructions: [
      'Coloca una mano en el abdomen',
      'Respira profundamente sintiendo cómo se expande',
      'Exhala lentamente con "sss"',
      'Mantén el flujo constante'
    ],
    tips: [
      'No levantes los hombros',
      'Siente el diafragma trabajar',
      'Relaja el pecho'
    ],
    warnings: [
      'Detente si te mareas',
      'No hiperventiles'
    ]
  },
  {
    id: 'breath_002',
    code: 'breath_reset',
    name: 'Reset Respiratorio',
    description: 'Ejercicio de recuperación y reset de la respiración.',
    category: 'breath_control',
    level: 'foundation',
    primaryTechnique: 'breath_support',
    durationSeconds: 60,
    repetitions: 3,
    restSeconds: 30,
    instructions: [
      'Siéntate o párate derecho',
      'Respira profundamente 4 tiempos',
      'Mantén 4 tiempos',
      'Exhala 8 tiempos'
    ],
    tips: [
      'Úsalo entre ejercicios intensos',
      'Relaja completamente',
      'Enfócate en la respiración'
    ],
    warnings: [
      'Ideal después de detectar fatiga',
      'No continúes si hay dolor'
    ]
  },

  // Clean Onset Exercises
  {
    id: 'onset_001',
    code: 'clean_onset_drill',
    name: 'Ejercicio de Ataque Limpio',
    description: 'Practica comenzar notas sin deslizamientos.',
    category: 'articulation',
    level: 'foundation',
    primaryTechnique: 'clean_onset',
    durationSeconds: 5,
    repetitions: 10,
    restSeconds: 10,
    instructions: [
      'Prepara el aire',
      'Comienza la nota limpiamente',
      'Sin deslizamientos',
      'Mantén 2 segundos'
    ],
    tips: [
      'Piensa la nota antes',
      'Usa consonantes suaves al inicio',
      'Evita el golpe de glotis'
    ]
  },

  // Resonance Exercises
  {
    id: 'resonance_001',
    code: 'resonance_forward',
    name: 'Resonancia Hacia Adelante',
    description: 'Coloca el sonido en la máscara facial.',
    category: 'resonance',
    level: 'intermediate',
    primaryTechnique: 'resonance_balance',
    durationSeconds: 10,
    repetitions: 8,
    restSeconds: 15,
    instructions: [
      'Tararea sintiendo vibración en la nariz',
      'Abre a vocal manteniendo la resonancia',
      'Proyecta hacia adelante',
      'Mantén el espacio'
    ],
    tips: [
      'Siente la vibración facial',
      'No bajes el velo del paladar',
      'Imagina el sonido saliendo por la frente'
    ]
  },
  {
    id: 'resonance_002',
    code: 'resonance_shift',
    name: 'Cambio de Resonancia',
    description: 'Practica transiciones suaves entre resonancias.',
    category: 'resonance',
    level: 'advanced',
    primaryTechnique: 'resonance_balance',
    durationSeconds: 15,
    repetitions: 6,
    restSeconds: 20,
    instructions: [
      'Comienza con resonancia oscura',
      'Desliza a resonancia brillante',
      'Vuelve suavemente',
      'Mantén el control'
    ],
    tips: [
      'Controla con la lengua',
      'Mantén el espacio bucal',
      'Escucha los cambios'
    ],
    prerequisites: ['resonance_forward']
  },

  // Range Extension Exercises
  {
    id: 'range_001',
    code: 'register_bridge',
    name: 'Puente de Registro',
    description: 'Conecta voz de pecho y cabeza suavemente.',
    category: 'range_extension',
    level: 'intermediate',
    primaryTechnique: 'register_mix',
    durationSeconds: 10,
    repetitions: 8,
    restSeconds: 20,
    instructions: [
      'Comienza en registro cómodo',
      'Desliza hacia el passaggio',
      'Permite la mezcla natural',
      'No fuerces el cambio'
    ],
    tips: [
      'Piensa en sonido híbrido',
      'Usa consonantes nasales',
      'Relaja la garganta'
    ],
    warnings: [
      'No fuerces el registro agudo',
      'Detente si hay quiebre brusco'
    ]
  },

  // Agility Exercises
  {
    id: 'agility_001',
    code: 'scale_run',
    name: 'Carrera de Escala',
    description: 'Practica agilidad con escalas rápidas.',
    category: 'agility',
    level: 'intermediate',
    primaryTechnique: 'pitch_control',
    durationSeconds: 5,
    repetitions: 10,
    restSeconds: 15,
    instructions: [
      'Comienza en nota base',
      'Canta la escala rápidamente',
      'Mantén precisión',
      'Termina en nota inicial'
    ],
    tips: [
      'Comienza lento y acelera',
      'Mantén el soporte de aire',
      'Relaja la mandíbula'
    ],
    prerequisites: ['pitch_target_basic']
  },

  // Vibrato Exercises
  {
    id: 'vibrato_001',
    code: 'vibrato_intro',
    name: 'Introducción al Vibrato',
    description: 'Explora el vibrato natural de tu voz.',
    category: 'vibrato',
    level: 'intermediate',
    primaryTechnique: 'vibrato_control',
    durationSeconds: 10,
    repetitions: 5,
    restSeconds: 20,
    instructions: [
      'Sostén una nota cómoda',
      'Deja que oscile naturalmente',
      'No fuerces el movimiento',
      'Escucha la calidad'
    ],
    tips: [
      'El vibrato debe ser relajado',
      'No lo controles con la mandíbula',
      'Viene del soporte de aire'
    ],
    warnings: [
      'No fuerces vibrato artificial',
      'Consulta si hay tensión'
    ]
  },

  // Dynamics Exercises
  {
    id: 'dynamics_001',
    code: 'dynamic_variation',
    name: 'Variación Dinámica',
    description: 'Practica cambios de volumen controlados.',
    category: 'dynamics',
    level: 'advanced',
    primaryTechnique: 'dynamic_control',
    durationSeconds: 10,
    repetitions: 6,
    restSeconds: 20,
    instructions: [
      'Comienza en piano',
      'Crescendo gradual a forte',
      'Decrescendo de vuelta a piano',
      'Mantén la calidad'
    ],
    tips: [
      'Controla con el diafragma',
      'No cambies la resonancia',
      'Mantén el pitch estable'
    ],
    prerequisites: ['breath_control_basic']
  }
]

// ============================================================================
// Exercise Helpers
// ============================================================================

export function getExerciseByCode(code: string): ExerciseDefinition | undefined {
  return EXERCISE_CATALOG.find(ex => ex.code === code)
}

export function getExercisesByCategory(category: ExerciseCategory): ExerciseDefinition[] {
  return EXERCISE_CATALOG.filter(ex => ex.category === category)
}

export function getExercisesByLevel(level: ExerciseLevel): ExerciseDefinition[] {
  return EXERCISE_CATALOG.filter(ex => ex.level === level)
}

export function getExercisesForTechnique(technique: string): ExerciseDefinition[] {
  return EXERCISE_CATALOG.filter(ex => 
    ex.primaryTechnique === technique || 
    ex.secondaryTechniques?.includes(technique as any)
  )
}

export function canDoExercise(exercise: ExerciseDefinition, userLevel: ExerciseLevel): boolean {
  const levelOrder: Record<ExerciseLevel, number> = {
    beginner: 0,
    foundation: 1,
    intermediate: 2,
    advanced: 3,
    professional: 4
  }
  
  return levelOrder[exercise.level] <= levelOrder[userLevel] + 1
}
