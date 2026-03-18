/**
 * Pedagogy Templates for VOZAZI
 * 
 * Plantillas para feedback pedagógico.
 */

import type { FeedbackTone, TechniqueType, ErrorType } from './types'

// ============================================================================
// Feedback Templates by Technique
// ============================================================================

export const TECHNIQUE_FEEDBACK: Record<TechniqueType, {
  explanation: string
  commonCauses: string[]
  tips: string[]
  warnings: string[]
}> = {
  pitch_control: {
    explanation: 'El control de afinación se refiere a tu capacidad para mantener la nota correcta de manera consistente.',
    commonCauses: [
      'Falta de soporte de aire',
      'Tensión en la garganta',
      'Mala escucha del pitch objetivo',
      'Fatiga vocal'
    ],
    tips: [
      'Escucha la nota mentalmente antes de cantarla',
      'Mantén el diafragma activo',
      'Relaja la mandíbula y el cuello',
      'Usa un piano o app de referencia'
    ],
    warnings: [
      'Si sientes dolor, descansa inmediatamente',
      'No fuerces el rango vocal'
    ]
  },
  sustain_control: {
    explanation: 'El control de sostenido mide tu capacidad para mantener una nota estable en el tiempo.',
    commonCauses: [
      'Soporte de aire inconsistente',
      'Tensión en el diafragma',
      'Falta de control de salida de aire',
      'Posición incorrecta de la laringe'
    ],
    tips: [
      'Respira profundamente antes de comenzar',
      'Mantén el aire fluyendo constantemente',
      'Imagina una línea recta de sonido',
      'Practica con notas largas diarias'
    ],
    warnings: [
      'Evita la hiperventilación',
      'Descansa entre ejercicios'
    ]
  },
  breath_support: {
    explanation: 'El soporte de aire es la base de una técnica vocal saludable y efectiva.',
    commonCauses: [
      'Respiración superficial',
      'Falta de activación del diafragma',
      'Tensión en hombros y pecho',
      'Mala postura'
    ],
    tips: [
      'Respira con el diafragma, no con el pecho',
      'Mantén los hombros relajados',
      'Practica respiración consciente',
      'Fortalece el core con ejercicio'
    ],
    warnings: [
      'No levantes los hombros al respirar',
      'Evita la tensión en el cuello'
    ]
  },
  clean_onset: {
    explanation: 'El ataque limpio se refiere a cómo comienzas cada nota sin deslizamientos ni tensiones.',
    commonCauses: [
      'Exceso de presión glótica',
      'Falta de preparación del aire',
      'Inseguridad en el pitch',
      'Tensión laríngea'
    ],
    tips: [
      'Prepara el aire antes de iniciar',
      'Imagina el pitch antes de cantarlo',
      'Usa un ataque suave al principio',
      'Practica con vocales abiertas'
    ],
    warnings: [
      'Evita el golpe de glotis excesivo',
      'No comiences con tensión'
    ]
  },
  legato_transition: {
    explanation: 'El legato es la capacidad de conectar notas de manera suave y fluida.',
    commonCauses: [
      'Cambios bruscos de resonancia',
      'Tensión en transiciones de registro',
      'Falta de control de aire',
      'Movimiento excesivo de la mandíbula'
    ],
    tips: [
      'Mantén el espacio bucal consistente',
      'Conecta las notas mentalmente',
      'Usa el mismo soporte de aire',
      'Practica escalas lentas'
    ],
    warnings: [
      'Evita saltos bruscos de volumen',
      'No cambies la posición de la laringe'
    ]
  },
  register_mix: {
    explanation: 'El mix de registro es el equilibrio entre voz de pecho y voz de cabeza.',
    commonCauses: [
      'Desbalance de resonancia',
      'Tensión en el paso de registro',
      'Falta de coordinación muscular',
      'Miedo al registro agudo'
    ],
    tips: [
      'Piensa en un sonido "híbrido"',
      'Mantén el espacio de voz de cabeza',
      'Usa consonantes nasales como puente',
      'Practica en el passaggio'
    ],
    warnings: [
      'No fuerces la voz de pecho hacia arriba',
      'Evita el quiebre brusco'
    ]
  },
  vibrato_control: {
    explanation: 'El vibrato es una oscilación natural del pitch que añade expresividad.',
    commonCauses: [
      'Tensión en la garganta',
      'Falta de soporte de aire',
      'Vibrato forzado artificialmente',
      'Fatiga vocal'
    ],
    tips: [
      'Deja que el vibrato sea natural',
      'No lo fuerces con la mandíbula',
      'Fortalece el soporte de aire',
      'Relaja la garganta completamente'
    ],
    warnings: [
      'El vibrato forzado puede dañar las cuerdas',
      'Consulta si hay dolor persistente'
    ]
  },
  resonance_balance: {
    explanation: 'El balance de resonancia afecta el timbre y la proyección de tu voz.',
    commonCauses: [
      'Exceso de resonancia nasal',
      'Falta de espacio bucal',
      'Posición incorrecta de la lengua',
      'Tensión en el velo del paladar'
    ],
    tips: [
      'Mantén el espacio bucal abierto',
      'Relaja la lengua',
      'Piensa en resonancia "hacia adelante"',
      'Practica con vocales puras'
    ],
    warnings: [
      'Evita la nasalidad excesiva',
      'No bajes el velo del paladar completamente'
    ]
  },
  dynamic_control: {
    explanation: 'El control dinámico es tu capacidad para variar el volumen manteniendo la calidad.',
    commonCauses: [
      'Falta de soporte de aire',
      'Tensión al cambiar volumen',
      'Mala coordinación respiratoria',
      'Falta de control del diafragma'
    ],
    tips: [
      'Usa más aire para volumen alto',
      'Mantén el soporte en piano',
      'Practica crescendos y decrescendos',
      'Controla con el diafragma, no la garganta'
    ],
    warnings: [
      'No grites para aumentar volumen',
      'Evita susurrar en piano'
    ]
  },
  intonation_accuracy: {
    explanation: 'La precisión de entonación es tu capacidad para alcanzar el pitch exacto.',
    commonCauses: [
      'Mala escucha del pitch',
      'Falta de memoria auditiva',
      'Tensión vocal',
      'Fatiga o enfermedad'
    ],
    tips: [
      'Entrena tu oído diariamente',
      'Usa referencia de piano',
      'Grábate y escúchate',
      'Practica intervalos'
    ],
    warnings: [
      'No practiques si estás enfermo',
      'Descansa si hay fatiga'
    ]
  },
  phrase_stability: {
    explanation: 'La estabilidad de frase es mantener la calidad vocal a lo largo de frases completas.',
    commonCauses: [
      'Soporte de aire inconsistente',
      'Falta de planificación respiratoria',
      'Tensión acumulativa',
      'Fatiga durante la frase'
    ],
    tips: [
      'Planifica tus respiraciones',
      'Mantén el soporte hasta el final',
      'Relaja entre frases',
      'Practica frases gradualmente más largas'
    ],
    warnings: [
      'No continúes si hay tensión',
      'Respeta las pausas naturales'
    ]
  },
  vowel_alignment: {
    explanation: 'La alineación de vocales afecta la claridad y consistencia del sonido.',
    commonCauses: [
      'Posición inconsistente de la lengua',
      'Cambios en el espacio bucal',
      'Falta de control de la mandíbula',
      'Tensión facial'
    ],
    tips: [
      'Mantén la mandíbula relajada',
      'Practica vocales puras',
      'Usa el mismo espacio para todas',
      'Grábate para verificar consistencia'
    ],
    warnings: [
      'Evita exagerar las vocales',
      'No tensiones la mandíbula'
    ]
  }
}

// ============================================================================
// Error Feedback Templates
// ============================================================================

export const ERROR_FEEDBACK: Record<ErrorType, {
  description: string
  solution: string
  exercises: string[]
}> = {
  flat_entry: {
    description: 'Estás comenzando las notas por debajo del pitch objetivo.',
    solution: 'Prepara el pitch mentalmente antes de cantar y usa más soporte de aire al inicio.',
    exercises: ['clean_onset_drill', 'pitch_target_precision', 'breath_reset']
  },
  sharp_entry: {
    description: 'Estás comenzando las notas por encima del pitch objetivo.',
    solution: 'Relaja la garganta y reduce la presión de aire al inicio.',
    exercises: ['clean_onset_drill', 'resonance_forward', 'breath_control_basic']
  },
  unstable_pitch: {
    description: 'El pitch fluctúa durante la nota sostenida.',
    solution: 'Fortalece el soporte de aire y relaja la garganta.',
    exercises: ['sustain_note_precision', 'breath_control_basic', 'pitch_target_basic']
  },
  pitch_drift: {
    description: 'El pitch se desvía gradualmente de la nota objetivo.',
    solution: 'Mantén el soporte de aire constante y escucha activamente.',
    exercises: ['sustain_note_basic', 'breath_control_basic', 'intonation_accuracy']
  },
  irregular_vibrato: {
    description: 'El vibrato es inconsistente o forzado.',
    solution: 'Deja que el vibrato sea natural, no lo fuerces.',
    exercises: ['vibrato_intro', 'breath_control_basic', 'resonance_balance']
  },
  delayed_onset: {
    description: 'Hay un retraso entre el inicio esperado y el sonido real.',
    solution: 'Prepara el aire y la posición vocal antes de comenzar.',
    exercises: ['clean_onset_drill', 'breath_reset', 'pitch_target_basic']
  },
  breath_leak: {
    description: 'Se escucha exceso de aire en el sonido.',
    solution: 'Mejora el cierre glótico y el soporte de aire.',
    exercises: ['breath_control_basic', 'clean_onset_drill', 'resonance_forward']
  },
  nasal_resonance: {
    description: 'Exceso de resonancia nasal en el sonido.',
    solution: 'Abre más el espacio bucal y relaja el velo del paladar.',
    exercises: ['resonance_forward', 'vowel_alignment', 'breath_support']
  },
  throat_tension: {
    description: 'Hay tensión audible en la garganta.',
    solution: 'Relaja completamente la garganta y usa más soporte de aire.',
    exercises: ['breath_reset', 'resonance_forward', 'clean_onset_drill']
  },
  overcompression: {
    description: 'Excesiva presión glótica causando sonido forzado.',
    solution: 'Reduce la presión y usa más aire en lugar de fuerza.',
    exercises: ['breath_control_basic', 'clean_onset_drill', 'dynamic_variation']
  },
  weak_support: {
    description: 'Falta de soporte de aire adecuado.',
    solution: 'Activa el diafragma y mantiene el aire fluyendo constantemente.',
    exercises: ['breath_control_basic', 'breath_reset', 'sustain_note_basic']
  },
  range_limit: {
    description: 'Dificultad para alcanzar ciertas notas del rango.',
    solution: 'Trabaja gradualmente la extensión del rango sin forzar.',
    exercises: ['register_bridge', 'resonance_shift', 'scale_run']
  },
  fatigue_pattern: {
    description: 'Señales de fatiga vocal detectadas.',
    solution: 'Descansa inmediatamente y reduce la intensidad de práctica.',
    exercises: ['breath_reset', 'gentle_warm_up']
  }
}

// ============================================================================
// Tone Modifiers
// ============================================================================

export const TONE_MODIFIERS: Record<FeedbackTone, {
  prefix: string
  suffix: string
  emphasis: string
}> = {
  encouraging: {
    prefix: '¡Buen trabajo! ',
    suffix: ' ¡Sigue así, estás mejorando!',
    emphasis: 'positivo'
  },
  neutral: {
    prefix: '',
    suffix: '',
    emphasis: 'objetivo'
  },
  conservative: {
    prefix: 'Recomendación: ',
    suffix: ' Prioriza la salud vocal.',
    emphasis: 'precaución'
  },
  urgent: {
    prefix: '⚠️ Atención: ',
    suffix: ' Es importante corregir esto pronto.',
    emphasis: 'urgencia'
  }
}

// ============================================================================
// Template Helpers
// ============================================================================

export function getTechniqueFeedback(technique: TechniqueType): typeof TECHNIQUE_FEEDBACK[TechniqueType] {
  return TECHNIQUE_FEEDBACK[technique]
}

export function getErrorFeedback(error: ErrorType): typeof ERROR_FEEDBACK[ErrorType] {
  return ERROR_FEEDBACK[error]
}

export function applyToneTemplate(
  baseMessage: string,
  tone: FeedbackTone
): string {
  const modifier = TONE_MODIFIERS[tone]
  return `${modifier.prefix}${baseMessage}${modifier.suffix}`
}
