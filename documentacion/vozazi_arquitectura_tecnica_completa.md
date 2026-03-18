# VOZAZI — Arquitectura técnica completa

> Documento maestro en Markdown con la arquitectura técnica integral de VOZAZI.
> Objetivo: definir una base premium, escalable, pedagógica y defendible para construir un vocal coach de muy alto nivel.

---

## 1. Visión técnica del sistema

VOZAZI debe construirse como un sistema híbrido que combine:

- **cliente potente** para capturar audio y ofrecer feedback inmediato
- **backend de producto** para orquestación, progreso, suscripciones y experiencia
- **plataforma acústica especializada** para análisis vocal serio
- **capa pedagógica y documental** para explicar, enseñar y guiar

### Principio técnico principal

```text
No construir un afinador con chat.
Construir un sistema que escucha, mide, aprende, adapta, documenta y enseña.
```

---

## 2. Objetivos arquitectónicos

### Objetivos funcionales

- capturar voz desde micrófono con baja latencia
- ofrecer feedback visual inmediato durante la práctica
- ejecutar análisis acústico profundo sobre la voz
- almacenar sesiones, métricas, progreso y tareas
- generar agenda dinámica adaptativa
- ofrecer feedback pedagógico contextualizado
- incluir una biblioteca de conocimiento vocal dentro del producto
- soportar suscripciones, emails y analítica de producto

### Objetivos no funcionales

- latencia baja en tiempo real
- modularidad alta
- independencia del motor acústico
- escalabilidad por desacoplamiento
- trazabilidad de métricas y decisiones
- capacidad de iteración rápida del producto
- control del conocimiento pedagógico

---

## 3. Principios de arquitectura

### 3.1 Separación de capas

No mezclar en un mismo módulo:

- interfaz
- lógica de producto
- análisis acústico
- pedagogía
- conocimiento documental

### 3.2 Híbrido cliente + servidor

- el **cliente** debe encargarse del feedback inmediato y la experiencia
- el **servidor** debe encargarse del progreso, la lógica de negocio y la persistencia
- la **plataforma acústica** debe encargarse del análisis defendible

### 3.3 Real-time híbrido

No todo el análisis debe hacerse en tiempo real profundo.

Se distinguen dos modos:

#### Real-time light feedback
Para mostrar al usuario durante el ejercicio:
- nota detectada
- desviación en cents
- estabilidad básica
- confirmación visual inmediata

#### Deep post-processing
Para calcular por bloques o al cerrar cada ejercicio:
- scoring compuesto
- vibrato
- onset
- consistencia
- comparativa histórica
- detección de debilidad dominante

### 3.4 El LLM no diagnostica desde cero

El LLM debe:

- interpretar resultados
- enseñar
- contextualizar
- guiar ejercicios

No debe:

- inventar métricas
- simular análisis acústico
- sustituir el motor vocal

### 3.5 El producto debe tener memoria estructurada

El sistema debe persistir:

- audio
- métricas
- resultados
- evolución
- tareas
- decisiones adaptativas
- feedback pedagógico

---

## 4. Stack técnico completo

## 4.1 Cliente

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Web Audio API**
- **getUserMedia**
- **MediaRecorder**

### Responsabilidades del cliente

- captura de audio
- render de la sesión
- feedback visual inmediato
- dashboard
- historial
- biblioteca vocal
- cuenta y suscripción

---

## 4.2 Backend de producto / BFF

- **Next.js Server Actions**
- **Next.js Route Handlers**
- **Vercel**
- **Drizzle ORM**

### Responsabilidades del backend de producto

- autenticación contextual
- autorización
- orquestación de sesiones
- progreso
- tareas
- billing
- composición de respuestas al frontend
- integración con servicios externos

---

## 4.3 Base de datos principal

- **PostgreSQL**
- uso de **jsonb** para métricas flexibles por sesión

### Responsabilidades de PostgreSQL

- persistencia del estado del producto
- sesiones
- perfiles vocales
- progreso
- tareas
- suscripciones
- snapshots
- referencias a audios
- feedback pedagógico estructurado

---

## 4.4 Plataforma acústica especializada

- **Python**
- **FastAPI**
- **WebSockets**
- **torchaudio**
- **torchcrepe**
- **librosa**
- **Essentia**
- **RNNoise**
- **Silero VAD**

### Responsabilidades de la plataforma acústica

- ingestión de audio
- limpieza de señal
- voice activity detection
- pitch tracking
- extracción de features
- cálculo de métricas avanzadas
- scoring
- evaluación vocal
- detección de debilidades

---

## 4.5 Storage de archivos

- **Cloudflare R2**

### Responsabilidades del storage

- guardar audio bruto
- guardar audio procesado
- conservar tomas para comparativas
- soportar exportaciones futuras

---

## 4.6 Servicios externos de producto

### Autenticación
- **Clerk**

### Suscripciones
- **Stripe**

### Email
- **Resend**

### Analítica de producto
- **PostHog**

---

## 4.7 Capa pedagógica

- **LLM desacoplado**
- **documentación Markdown estructurada**
- **retrieval / RAG**

### Responsabilidades de la capa pedagógica

- explicar resultados
- traducir métricas a lenguaje humano
- proponer ejercicios
- enlazar documentación relevante
- guiar el progreso

---

## 5. Diagrama global de arquitectura

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                CLIENTE WEB                                   │
│      Next.js + TypeScript + Tailwind + shadcn/ui + Web Audio API            │
│                                                                              │
│  - Dashboard                                                                 │
│  - Sesión de práctica                                                        │
│  - Historial                                                                  │
│  - Biblioteca vocal                                                          │
│  - Cuenta y suscripción                                                      │
│                                                                              │
│  Capacidades locales:                                                        │
│  - getUserMedia                                                              │
│  - MediaRecorder                                                             │
│  - feedback inmediato                                                        │
│  - preanálisis ligero                                                        │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           APP BACKEND / BFF                                  │
│               Next.js Server Actions + Route Handlers + Vercel               │
│                                                                              │
│  - autenticación contextual                                                  │
│  - autorización                                                              │
│  - orquestación de producto                                                  │
│  - billing                                                                   │
│  - agregación de datos                                                       │
│  - gateway hacia servicios especializados                                    │
└──────────────┬──────────────────────┬──────────────────────┬─────────────────┘
               │                      │                      │
               ▼                      ▼                      ▼
      ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
      │     Clerk      │     │     Stripe     │     │    PostHog     │
      │ auth / users   │     │ billing / subs │     │ product events │
      └────────────────┘     └────────────────┘     └────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          CORE PRODUCT SERVICES                               │
│                                                                              │
│  1. Session Orchestrator                                                     │
│  2. Progress Service                                                         │
│  3. Adaptive Training Service                                                │
│  4. Knowledge Service                                                        │
│  5. Pedagogical Orchestrator                                                 │
└──────────────┬──────────────────────┬──────────────────────┬─────────────────┘
               │                      │                      │
               ▼                      ▼                      ▼
┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│   PostgreSQL Core    │   │  Documentation/RAG   │   │   Background Jobs    │
│                      │   │                      │   │                      │
│ - users              │   │ - markdown docs      │   │ - agendas diarias    │
│ - vocal_profiles     │   │ - indexación         │   │ - emails             │
│ - sessions           │   │ - embeddings         │   │ - resúmenes          │
│ - metrics            │   │ - retrieval          │   │ - mantenimiento      │
│ - tasks              │   └──────────────────────┘   └──────────────────────┘
│ - progress           │
│ - subscriptions      │
└──────────────┬───────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         SPECIALIZED AUDIO PLATFORM                           │
│                    Python + FastAPI + WebSockets + Workers                   │
│                                                                              │
│  A. Audio Ingestion                                                          │
│  B. Realtime Analysis Pipeline                                               │
│  C. Deep Acoustic Analysis Pipeline                                          │
│  D. Evaluation Engine                                                        │
│  E. Audio Asset Processor                                                    │
└──────────────┬────────────────────────────┬───────────────────────────────────┘
               │                            │
               ▼                            ▼
      ┌───────────────────┐        ┌───────────────────┐
      │  Cloudflare R2    │        │   Model Layer     │
      │                   │        │                   │
      │ - raw audio       │        │ - acoustic models │
      │ - processed audio │        │ - classifiers     │
      │ - exports         │        │ - future tuning   │
      └───────────────────┘        └───────────────────┘
               │
               ▼
      ┌───────────────────┐
      │  Pedagogical LLM  │
      │                   │
      │ - explanations    │
      │ - exercise plans  │
      │ - contextual help │
      └───────────────────┘
```

---

## 6. Capas del sistema

## 6.1 Experience Layer

Todo lo que toca el usuario.

Incluye:
- sesión de práctica
- dashboard
- historial
- biblioteca vocal
- cuenta
- suscripción

### Objetivos
- claridad
- velocidad
- feedback inmediato
- sensación premium
- baja fricción

---

## 6.2 Product Orchestration Layer

Cerebro de producto.

Incluye:
- sesiones
- progreso
- agenda
- billing
- permisos
- eventos de producto

### Objetivos
- consistencia del sistema
- acoplamiento bajo con audio y LLM
- trazabilidad de decisiones

---

## 6.3 Acoustic Intelligence Layer

Núcleo defendible del producto.

Incluye:
- limpieza
- VAD
- pitch
- vibrato
- onset
- estabilidad
- resonancia
- scoring
- clasificación de problemas

### Objetivos
- rigor técnico
- métricas comparables
- evaluación útil
- posibilidad de mejora progresiva

---

## 6.4 Knowledge & Pedagogy Layer

Núcleo pedagógico.

Incluye:
- documentación
- anatomía
- técnicas
- problemas
- riesgos
- retrieval
- LLM explicativo

### Objetivos
- enseñar con base real
- evitar alucinaciones
- vincular teoría y práctica

---

## 7. Arquitectura de servicios

## 7.1 Cliente web

### Módulos principales

#### Dashboard Module
- resumen del día
- progreso semanal
- indicadores clave
- tareas pendientes

#### Practice Session Module
- flujo de ejercicio
- nota objetivo
- visualización en tiempo real
- feedback inmediato

#### History Module
- evolución
- comparativas
- skill map
- sesiones previas

#### Knowledge Library Module
- docs técnicas
- anatomía
- problemas
- riesgos
- recursos

#### Account & Billing Module
- cuenta
- plan
- suscripción
- preferencias

---

## 7.2 Backend de producto

### Session Orchestrator
Responsable de:
- abrir sesión
- cerrar sesión
- coordinar pasos del flujo
- vincular tareas con resultados

### Progress Service
Responsable de:
- consolidar resultados
- generar snapshots
- calcular evolución por dimensión

### Adaptive Training Service
Responsable de:
- decidir próxima tarea
- ajustar dificultad
- detectar estancamiento
- balancear carga de práctica

### Knowledge Service
Responsable de:
- servir artículos
- buscar contenido relevante
- estructurar docs por categoría

### Pedagogical Orchestrator
Responsable de:
- preparar contexto para LLM
- mezclar métricas + progreso + documentación
- producir feedback final estructurado

---

## 7.3 Plataforma acústica

### Audio Ingestion Service
Responsable de:
- recibir stream o chunks
- validar formato
- normalizar audio
- enrutar al pipeline correcto

### Realtime Analysis Pipeline
Responsable de:
- feedback rápido
- nota detectada
- cents
- estabilidad básica

### Deep Acoustic Analysis Pipeline
Responsable de:
- limpieza robusta
- VAD más preciso
- pitch tracking fino
- features avanzadas
- segmentación útil

### Evaluation Engine
Responsable de:
- scoring por ejercicio
- scoring por sesión
- debilidad dominante
- reglas de avance

### Audio Asset Processor
Responsable de:
- preparar versiones optimizadas
- conservar segmentos clave
- soportar comparativas futuras

---

## 8. Flujo técnico de una sesión completa

```text
1. El usuario entra en VOZAZI.
2. Clerk valida identidad y permisos.
3. El backend carga el objetivo del día y la tarea actual.
4. El frontend inicia captura con getUserMedia.
5. Web Audio API prepara la señal para visualización inmediata.
6. El usuario comienza a cantar.
7. El cliente muestra feedback visual inmediato.
8. El audio se envía por bloques a la plataforma acústica.
9. Audio Ingestion normaliza el flujo.
10. Realtime Pipeline devuelve señal útil para feedback rápido.
11. Deep Pipeline ejecuta análisis profundo.
12. Evaluation Engine calcula métricas y score.
13. Los resultados se persisten en PostgreSQL.
14. El audio bruto y procesado se guarda en R2.
15. Progress Service compara contra histórico.
16. Adaptive Training Service calcula siguiente tarea.
17. Knowledge Service recupera contenido pedagógico relevante.
18. Pedagogical Orchestrator construye contexto completo.
19. El LLM devuelve explicación, consejo y siguiente paso.
20. El frontend muestra resumen y nueva tarea.
21. PostHog registra eventos clave del comportamiento.
22. Un background job puede generar resumen o email posterior.
```

---

## 9. Arquitectura de datos

## 9.1 Entidades principales

### users
- identidad del usuario
- estado general
- referencias externas

### vocal_profiles
- tipo de voz estimado
- rango vocal
- fortalezas
- debilidades
- estado vocal resumido

### subscriptions
- plan
- estado
- fechas clave
- relación con Stripe

### sessions
- fecha
- duración
- contexto
- score general
- estado de la sesión

### session_metrics
- métricas acústicas detalladas
- jsonb
- métricas por bloque
- métricas agregadas

### session_audio_assets
- rutas a audio bruto
- rutas a audio procesado
- metadatos de archivo

### evaluation_results
- score por dimensión
- debilidad dominante
- clasificación técnica
- resultado pedagógico resumido

### tasks
- tarea asignada
- objetivo técnico
- dificultad
- fecha objetivo
- prioridad

### task_results
- resultado de ejecución
- score alcanzado
- observaciones

### progress_snapshots
- resumen semanal
- resumen mensual
- tendencia por dimensión vocal

### knowledge_base
- técnicas
- anatomía
- problemas
- riesgos
- recursos

---

## 9.2 Relación conceptual de datos

```text
users
├── vocal_profiles
├── subscriptions
├── sessions
│   ├── session_metrics
│   ├── session_audio_assets
│   ├── evaluation_results
│   └── pedagogical_feedback
├── tasks
│   ├── task_results
│   └── task_runs
└── progress_snapshots

knowledge_base
├── techniques
├── anatomy
├── problems
├── risks
└── resources
```

---

## 10. Métricas y scoring

## 10.1 Núcleo MVP

- pitch accuracy
- pitch stability
- rango vocal útil
- duración de nota sostenida
- consistencia entre repeticiones

## 10.2 Nivel avanzado

- vibrato rate
- vibrato depth
- onset timing
- breath control estimado
- calidad espectral
- resonancia estimada
- fatiga vocal estimada

## 10.3 Métricas derivadas de producto

- score por ejercicio
- score por sesión
- score semanal
- progreso acumulado
- debilidad dominante actual
- tendencia de mejora
- tendencia de estancamiento

## 10.4 Sistema de scoring conceptual

```text
Score total =
40% pitch accuracy
20% pitch stability
15% onset control
15% breath control
10% consistency
```

## 10.5 Reglas adaptativas base

- si score > 85 → subir dificultad
- si score entre 60 y 85 → mantener nivel
- si score < 60 → repetir con corrección
- si cae rendimiento repetidamente → revisar fatiga o exceso de dificultad

---

## 11. Adaptive Training Engine

## 11.1 Objetivo

Generar un loop continuo de mejora sin que el usuario tenga que decidir manualmente qué practicar después.

## 11.2 Flujo adaptativo

```text
Ejercicio
→ medición
→ evaluación
→ comparación histórica
→ detección de debilidad principal
→ generación de nueva tarea
→ nueva práctica
```

## 11.3 Responsabilidades

- elegir técnica prioritaria
- ajustar dificultad
- balancear volumen de práctica
- introducir descansos o práctica ligera
- detectar estancamiento
- reforzar debilidades sin desmotivar

## 11.4 Salida del motor

Cada tarea debe incluir:

- tipo de ejercicio
- duración
- repeticiones
- objetivo técnico
- criterio de éxito
- dificultad
- prioridad

---

## 12. Capa pedagógica y documental

## 12.1 Documentación estructurada

La base de conocimiento debe existir como documentación real, no solo como prompts.

### Tipos de contenido

#### Técnicas vocales
- afinación
- vibrato
- resonancia
- apoyo respiratorio
- mezcla de registros
- ataques

#### Anatomía
- laringe
- cuerdas vocales
- diafragma
- resonadores
- postura

#### Problemas frecuentes
- desafinación recurrente
- voz nasal
- tensión vocal
- fatiga vocal
- falta de apoyo

#### Riesgos y salud vocal
- sobreuso
- descanso
- calentamiento
- señales de alarma
- cuándo parar

#### Recursos
- ejercicios
- escalas
- rutinas
- prácticas por nivel

---

## 12.2 Estructura de contenido sugerida

```text
docs/
├── techniques/
│   ├── breathing.md
│   ├── vibrato.md
│   └── pitch_control.md
├── anatomy/
│   ├── larynx.md
│   └── diaphragm.md
├── problems/
│   ├── nasal_voice.md
│   └── vocal_tension.md
├── health/
│   ├── warmups.md
│   └── vocal_fatigue.md
└── resources/
    ├── beginner_routine.md
    └── advanced_routine.md
```

---

## 12.3 Integración con RAG

Flujo conceptual:

```text
Usuario comete error
→ motor detecta problema
→ Knowledge Service busca docs relevantes
→ Pedagogical Orchestrator prepara contexto
→ LLM genera explicación precisa
→ app enlaza teoría + práctica
```

---

## 13. Eventos de producto y analítica

## 13.1 Eventos clave

```text
auth_signed_in
onboarding_completed
session_started
exercise_started
exercise_completed
session_completed
task_generated
task_completed
weekly_summary_sent
subscription_started
subscription_renewed
subscription_canceled
```

## 13.2 Qué debe medirse

- activación
- frecuencia de práctica
- abandono por pantalla
- abandono por tarea
- eficacia del loop adaptativo
- conversión a suscripción
- retención por cohortes

---

## 14. Jobs y procesos en segundo plano

Necesarios para:

- generar agenda diaria o semanal
- enviar emails con Resend
- consolidar snapshots
- recalcular resúmenes
- limpiar o reindexar contenido
- ejecutar análisis diferidos si conviene

### Funciones típicas
- resumen semanal
- recordatorio de práctica
- reactivación de usuario inactivo
- mantenimiento de derivados de audio

---

## 15. Responsabilidades por tecnología

## 15.1 Next.js
Se usa para:
- app web
- BFF
- route handlers
- server actions
- páginas de producto y sesión

## 15.2 PostgreSQL
Se usa para:
- estado persistente del producto
- métricas y snapshots
- tareas
- sesiones
- suscripciones

## 15.3 Python / FastAPI
Se usa para:
- análisis acústico avanzado
- workers especializados
- pipelines de audio
- scoring serio

## 15.4 Cloudflare R2
Se usa para:
- audio bruto
- audio procesado
- exportaciones

## 15.5 Clerk
Se usa para:
- login
- identidad
- sesiones
- OAuth

## 15.6 Stripe
Se usa para:
- suscripciones
- checkout
- renovaciones
- cancelaciones
- portal de cliente

## 15.7 Resend
Se usa para:
- emails transaccionales
- recordatorios
- resúmenes

## 15.8 PostHog
Se usa para:
- analítica de uso
- funnels
- cohortes
- decisiones de producto

---

## 16. Qué debe ser propio y qué puede externalizarse

## 16.1 Debe ser propio

- scoring vocal
- métricas acústicas
- evaluation engine
- adaptive training engine
- estructura documental
- pedagogical orchestration

## 16.2 Puede externalizarse

- auth
- billing
- email
- storage de objetos
- analítica

---

## 17. Estrategia de datos y dataset vocal propio

VOZAZI debe diseñarse desde el principio no solo como una aplicación, sino como una **máquina de generación de dataset vocal estructurado**.

Esto es una ventaja estratégica enorme.

Si la arquitectura se diseña bien, en 2 años VOZAZI puede acumular uno de los activos más valiosos del producto:

- audio real de práctica vocal
- métricas acústicas asociadas
- contexto pedagógico
- progresión longitudinal por usuario
- resultados de ejercicios
- etiquetas derivadas de comportamiento vocal

---

### Principio clave

```text
No guardar solo audios.
Guardar audios + contexto + métricas + decisiones + evolución.
```

Un audio sin contexto tiene valor limitado.
Un audio con estructura completa puede servir para:

- mejorar scoring
- calibrar métricas
- entrenar clasificadores vocales
- detectar patrones de error
- personalizar mejor el adaptive engine
- construir barrera tecnológica real

---

### Qué debe guardarse por sesión

#### 1. Audio bruto

- archivo original de la toma
- formato
- sample rate
- duración
- nivel de ruido estimado

#### 2. Audio procesado

- versión limpiada
- segmentos vocales útiles
- cortes relevantes para comparativas

#### 3. Contexto del ejercicio

- tipo de ejercicio
- dificultad
- objetivo técnico
- nota objetivo o rango objetivo
- duración esperada
- instrucciones mostradas al usuario

#### 4. Métricas acústicas

- pitch accuracy
- pitch stability
- vibrato rate
- vibrato depth
- onset timing
- duración sostenida
- breath control estimado
- calidad espectral
- score final

#### 5. Resultado pedagógico

- debilidad dominante detectada
- clasificación de problema
- feedback mostrado al usuario
- ejercicio siguiente recomendado

#### 6. Contexto temporal

- fecha
- hora
- posición en la sesión
- número de repetición
- fase del plan de entrenamiento

#### 7. Señales de comportamiento

- si completó la tarea
- si repitió voluntariamente
- si abandonó
- tiempo invertido
- constancia semanal

---

### Estructura ideal del dato

Cada toma vocal debe convertirse en una unidad estructurada parecida a esta:

```json
{
  "user_id": "u_123",
  "session_id": "s_456",
  "task_id": "t_789",
  "audio_raw_url": "r2://...",
  "audio_processed_url": "r2://...",
  "exercise_type": "sustain_note",
  "target_note": "A4",
  "difficulty": 3,
  "metrics": {
    "pitch_accuracy": 0.84,
    "pitch_stability": 0.73,
    "vibrato_rate": 5.4,
    "onset_timing_ms": 118,
    "breath_control": 0.69
  },
  "evaluation": {
    "dominant_weakness": "attack_control",
    "score": 78,
    "recommended_next": "clean_onset_drill"
  },
  "behavior": {
    "completed": true,
    "repeated": false,
    "duration_seconds": 74
  },
  "timestamp": "2026-03-17T10:14:00Z"
}
```

---

### Qué no hacer

No conviene guardar solo:

- un MP3 sin contexto
- una nota media final
- un score suelto sin trazabilidad

Porque eso no sirve luego para:

- entrenar mejores modelos
- revisar errores
- reconstruir decisiones del sistema
- comparar evolución real

---

### Modelo de almacenamiento recomendado

#### PostgreSQL
Para guardar:

- identidad de sesión
- contexto del ejercicio
- métricas
- evaluación
- comportamiento
- snapshots de progreso

#### Cloudflare R2
Para guardar:

- audio bruto
- audio procesado
- derivados de audio

#### Knowledge / Label Layer
Para guardar:

- etiquetas técnicas
- tipos de error
- grupos de ejercicios
- mapeos entre problema y corrección

---

### Dataset longitudinal

La gran ventaja de VOZAZI no es solo el volumen de datos.
Es la capacidad de observar **la evolución de una misma voz en el tiempo**.

Eso permite construir:

- curvas de mejora
- detección de estancamiento
- perfiles de aprendizaje
- sensibilidad a ciertos ejercicios
- respuesta a cambios de dificultad

Esto vale muchísimo más que tener audios aislados.

---

### Dataset para entrenamiento futuro

Si VOZAZI estructura bien sus datos, en el futuro podrá entrenar o ajustar:

- clasificadores de errores vocales
- estimadores de fatiga
- detectores de técnica dominante
- modelos de recomendación de ejercicios
- modelos de predicción de abandono

Es decir:

```text
producto → uso real → dataset estructurado → mejora de modelos → mejor producto
```

Ese loop es una ventaja competitiva muy fuerte.

---

### Reglas estratégicas de diseño del dataset

#### Regla 1
Cada audio debe estar vinculado a una tarea concreta.

#### Regla 2
Cada tarea debe tener objetivo técnico explícito.

#### Regla 3
Cada resultado debe guardar métricas, evaluación y decisión adaptativa.

#### Regla 4
Cada sesión debe ser comparable con sesiones anteriores.

#### Regla 5
Las etiquetas de error deben estar normalizadas.

#### Regla 6
La documentación pedagógica debe poder enlazarse con los tipos de error.

---

### Taxonomía recomendada de etiquetas

VOZAZI debería definir una taxonomía interna estable para etiquetar:

#### Técnicas
- pitch_control
- sustain_control
- vibrato_control
- breath_support
- resonance_balance
- onset_control

#### Problemas
- flat_entry
- sharp_entry
- unstable_sustain
- irregular_vibrato
- nasal_resonance
- throat_tension
- breath_leak
- fatigue_pattern

#### Respuesta pedagógica
- reinforce
- repeat
- reduce_difficulty
- switch_exercise
- rest_recommended

Esto hace que el dataset sea mucho más reutilizable.

---

### Privacidad y producto

Si se guardan audios, VOZAZI debe tratar esto como un punto sensible del producto.

Se recomienda:

- consentimiento claro
- política de retención
- opción de borrar grabaciones
- separación entre datos de producto y datos para mejora de modelos
- trazabilidad de uso del dato

---

### Principio final sobre datos

```text
El dataset vocal de VOZAZI no debe ser una consecuencia accidental.
Debe ser una capa diseñada deliberadamente dentro de la arquitectura.
```

---

## 18. Riesgos técnicos principales

- latencia excesiva si se intenta hacer todo en tiempo real profundo
- mala calidad de audio desde el cliente
- feedback erróneo si el scoring está mal calibrado
- dependencia excesiva del LLM
- acoplamiento entre producto y motor acústico
- documentación pobre que degrade la calidad pedagógica

---

## 19. Estrategia de evolución

## 18.1 Fase 1 — Base funcional premium

- Next.js
- Clerk
- Stripe
- PostgreSQL
- Practice flow
- pitch detection básico
- primeras sesiones y dashboard

## 18.2 Fase 2 — Plataforma acústica seria

- Python + FastAPI
- torchcrepe
- VAD
- RNNoise
- métricas avanzadas
- evaluación más rigurosa

## 18.3 Fase 3 — Adaptive engine real

- agenda dinámica
- snapshots
- reglas adaptativas
- progresión por nivel

## 18.4 Fase 4 — Pedagogía premium

- RAG
- biblioteca vocal profunda
- LLM contextualizado
- reportes de alto valor

---

## 20. Arquitectura premium resumida

```text
VOZAZI =
Cliente premium
+
Backend de producto claro
+
Motor acústico separado
+
Base de datos rica
+
Storage de audio
+
Knowledge base real
+
LLM pedagógico desacoplado
+
Adaptive engine
```

---

## 21. Taxonomía vocal estructurada

Para que VOZAZI genere un dataset realmente útil y entrenable, el sistema necesita una **taxonomía vocal estable** que clasifique técnicas, errores, métricas y ejercicios.

Esta taxonomía debe ser:

- consistente
- extensible
- independiente del modelo
- reutilizable para análisis, scoring y pedagogía

---

### 21.1 Dimensiones técnicas principales

Cada análisis vocal debe clasificarse en varias dimensiones.

```text
Pitch
Stability
Onset
Breath
Resonance
Vibrato
Range
Fatigue
Consistency
```

Estas dimensiones representan **las habilidades fundamentales del control vocal**.

---

### 21.2 Técnicas vocales entrenables

Lista base inicial de técnicas que VOZAZI debe poder trabajar.

```text
pitch_control
sustain_control
breath_support
clean_onset
legato_transition
register_mix
vibrato_control
resonance_balance
dynamic_control
intonation_accuracy
phrase_stability
vowel_alignment
```

Cada técnica puede mapearse a uno o varios ejercicios.

---

### 21.3 Tipos de errores vocales

Errores detectables por el sistema.

```text
flat_entry
sharp_entry
unstable_pitch
pitch_drift
irregular_vibrato
delayed_onset
breath_leak
nasal_resonance
throat_tension
overcompression
weak_support
range_limit
fatigue_pattern
```

Cada error debe tener:

- métrica asociada
- umbral
- explicación pedagógica
- ejercicios correctivos

---

### 21.4 Métricas acústicas principales

Las métricas deben ser cuantificables.

```text
pitch_accuracy
pitch_stability
pitch_variance
onset_timing
sustain_duration
vibrato_rate
vibrato_depth
spectral_balance
harmonic_ratio
breath_noise_ratio
resonance_centroid
```

Estas métricas alimentan el **motor de scoring**.

---

### 21.5 Tipos de ejercicios

VOZAZI debe clasificar los ejercicios en categorías reutilizables.

```text
sustain_note
pitch_target
scale_run
interval_jump
vibrato_control
breath_control
resonance_shift
register_bridge
phrase_singing
dynamic_variation
```

Cada ejercicio debe incluir:

- objetivo técnico
- dificultad
- duración
- criterio de éxito

---

### 21.6 Mapeo problema → corrección

El sistema debe mantener un mapeo entre error detectado y corrección.

Ejemplo conceptual:

```text
flat_entry
→ técnica: clean_onset
→ ejercicio: pitch_target
→ dificultad: nivel actual
```

Otro ejemplo:

```text
unstable_pitch
→ técnica: sustain_control
→ ejercicio: sustain_note
```

Este mapeo es el núcleo del **Adaptive Training Engine**.

---

### 21.7 Niveles de dificultad

El sistema debe estructurar la progresión.

```text
level_1  beginner
level_2  foundation
level_3  intermediate
level_4  advanced
level_5  professional
```

La dificultad de cada ejercicio debe poder escalar mediante:

- duración
- rango
- precisión requerida
- velocidad

---

### 21.8 Estructura del catálogo de ejercicios

```text
exercises/

pitch/
  pitch_target_basic
  pitch_target_precision

sustain/
  sustain_short
  sustain_long

breath/
  breath_control_basic
  breath_control_extended

vibrato/
  vibrato_intro
  vibrato_stability

resonance/
  resonance_forward
  resonance_balance
```

Esto permite:

- ampliar el catálogo
- reutilizar ejercicios
- conectar ejercicios con técnicas y métricas

---

### 21.9 Conexión con el dataset

Cada unidad de dataset debe poder vincularse con la taxonomía.

Ejemplo conceptual:

```json
{
  "exercise_type": "sustain_note",
  "technique": "sustain_control",
  "difficulty": 2,
  "metrics": {
    "pitch_stability": 0.71,
    "sustain_duration": 4.3
  },
  "error_detected": "unstable_pitch",
  "next_exercise": "sustain_note_precision"
}
```

Esto permite entrenar sistemas de recomendación en el futuro.

---

### 21.10 Principio final de la taxonomía

```text
Sin taxonomía, los datos son ruido.
Con taxonomía, los datos se convierten en conocimiento entrenable.
```

---

## 22. Motor de scoring técnico

El motor de scoring es el sistema que convierte métricas acústicas en una evaluación interpretable por el producto.

Debe cumplir tres objetivos:

- evaluar rendimiento vocal
- detectar debilidades técnicas
- decidir progresión de entrenamiento

---

### 22.1 Principio de diseño

```text
Las métricas miden
El scoring interpreta
El motor adaptativo decide
```

El scoring nunca debe depender directamente del LLM.

---

### 22.2 Pipeline de evaluación

```text
Audio
→ extracción de features
→ métricas acústicas
→ normalización
→ cálculo por dimensión
→ score compuesto
→ detección de error dominante
→ decisión adaptativa
```

---

### 22.3 Métricas normalizadas

Cada métrica debe convertirse en un valor entre **0 y 1**.

Ejemplo:

```text
pitch_accuracy
0.0 = completamente desafinado
1.0 = afinación perfecta
```

Esto permite combinar métricas de distinta naturaleza.

---

### 22.4 Dimensiones evaluadas

El score de un ejercicio se calcula sobre varias dimensiones.

```text
pitch_accuracy
pitch_stability
onset_control
breath_support
consistency
```

---

### 22.5 Fórmula conceptual de scoring

Ejemplo base:

```text
score =
0.40 * pitch_accuracy
+ 0.20 * pitch_stability
+ 0.15 * onset_control
+ 0.15 * breath_support
+ 0.10 * consistency
```

El resultado final se expresa en escala **0‑100**.

---

### 22.6 Score por ejercicio

Cada repetición genera:

- métricas individuales
- score parcial

Ejemplo:

```text
rep_1 → score 72
rep_2 → score 81
rep_3 → score 78
```

El score del ejercicio puede calcularse como:

```text
exercise_score = media ponderada de repeticiones
```

---

### 22.7 Score por sesión

La sesión combina varios ejercicios.

Ejemplo:

```text
session_score = media ponderada de ejercicios
```

Los ejercicios más importantes pueden tener mayor peso.

---

### 22.8 Detección de debilidad dominante

El sistema debe identificar la dimensión con peor rendimiento.

Ejemplo:

```text
pitch_accuracy 0.83
pitch_stability 0.62
onset_control 0.79
breath_support 0.74
```

Resultado:

```text
weakness = pitch_stability
```

Esto alimenta el **Adaptive Training Engine**.

---

### 22.9 Reglas de progresión

El motor adaptativo usa el score para decidir la progresión.

```text
score ≥ 85 → aumentar dificultad
score 60–85 → mantener nivel
score < 60 → repetir ejercicio correctivo
```

También puede aplicar reglas como:

- introducir variación
- reforzar técnica débil
- reducir carga si detecta fatiga

---

### 22.10 Score longitudinal

VOZAZI debe calcular evolución a lo largo del tiempo.

Ejemplos:

```text
weekly_pitch_accuracy
monthly_stability_trend
breath_control_improvement
```

Esto permite generar:

- gráficos de progreso
- alertas de estancamiento
- métricas motivacionales

---

### 22.11 Score pedagógico

El score técnico debe traducirse a lenguaje comprensible.

Ejemplo:

```text
Score técnico: 78
Interpretación: buena afinación pero estabilidad irregular
```

Este texto se genera mediante el **Pedagogical Orchestrator + LLM**.

---

### 22.12 Principio final del scoring

```text
El scoring no es un número decorativo.
Es el mecanismo que gobierna la progresión del entrenamiento.
```

---

## 23. Adaptive Training Engine

El **Adaptive Training Engine** es el cerebro de VOZAZI.

Su función no es analizar audio, sino decidir **qué debe practicar el usuario, en qué orden, con qué dificultad y con qué carga**.

Si el motor acústico detecta, el motor adaptativo decide.

---

### 23.1 Objetivo principal

```text
Transformar resultados acústicos en un plan de práctica vivo.
```

Debe conseguir que el usuario:

- no tenga que pensar qué hacer después
- reciba tareas coherentes con su nivel
- avance sin estancarse
- no se sobrecargue
- mantenga constancia

---

### 23.2 Inputs del motor adaptativo

El motor debe consumir varias fuentes de información.

#### Resultados técnicos
- score por ejercicio
- score por dimensión
- debilidad dominante
- evolución reciente
- señales de fatiga

#### Perfil del usuario
- nivel actual
- tipo de voz estimado
- rango vocal útil
- técnicas más débiles
- técnicas más fuertes

#### Contexto de uso
- tiempo disponible
- frecuencia de práctica
- constancia reciente
- tareas completadas
- tareas abandonadas

#### Catálogo de entrenamiento
- ejercicios disponibles
- dificultad
- técnica trabajada
- duración
- prerequisitos

---

### 23.3 Outputs del motor

El motor debe producir:

- agenda diaria
- agenda semanal
- siguiente ejercicio recomendado
- progresión de dificultad
- alertas de descanso o reducción de carga
- resúmenes de foco técnico

---

### 23.4 Pipeline del motor adaptativo

```text
Histórico + métricas + perfil + catálogo
→ detección de debilidad prioritaria
→ selección de técnica a reforzar
→ selección de ejercicios válidos
→ ajuste de dificultad
→ balance de carga
→ generación de agenda
→ seguimiento de resultado
```

---

### 23.5 Módulos internos del motor

#### 1. Weakness Prioritizer
Responsable de:
- identificar la debilidad más importante
- ordenar técnicas a reforzar
- evitar atacar demasiadas cosas a la vez

#### 2. Exercise Selector
Responsable de:
- elegir ejercicios compatibles con el nivel
- respetar prerequisitos
- variar ejercicios para evitar monotonía

#### 3. Difficulty Manager
Responsable de:
- subir dificultad si hay dominio
- mantener si hay progreso pero aún no consolidado
- bajar o simplificar si hay bloqueo o fatiga

#### 4. Load Balancer
Responsable de:
- repartir intensidad
- evitar sobrecarga
- introducir práctica ligera o descanso activo

#### 5. Agenda Builder
Responsable de:
- convertir decisiones en tareas concretas
- estructurar plan diario y semanal
- ordenar bloques de práctica

#### 6. Retention Layer
Responsable de:
- detectar abandono o baja constancia
- reducir fricción si el usuario flojea
- mantener continuidad con tareas más accesibles

---

### 23.6 Reglas base de priorización

El motor debe evitar intentar corregirlo todo a la vez.

Reglas recomendadas:

- reforzar **1 debilidad dominante** y **1 secundaria** como máximo
- mantener una técnica fuerte en el plan para reforzar sensación de progreso
- alternar ejercicios de corrección con ejercicios de consolidación
- usar microvictorias para sostener motivación

Ejemplo:

```text
Dominante: pitch_stability
Secundaria: onset_control
Fuerte: pitch_accuracy
```

Agenda resultante:

```text
Bloque 1 → sustain_control
Bloque 2 → clean_onset
Bloque 3 → pitch_target_refuerzo
```

---

### 23.7 Lógica de dificultad

La dificultad no debe subir solo por tiempo de uso.
Debe subir por evidencia.

```text
si score alto + consistencia alta + repeticiones estables
→ subir dificultad

si score aceptable pero inconsistente
→ mantener y consolidar

si score bajo o caída repetida
→ simplificar
```

Variables para escalar dificultad:

- duración
- precisión requerida
- velocidad
- salto interválico
- rango exigido
- número de repeticiones

---

### 23.8 Lógica de carga

El sistema debe cuidar la fatiga y la adherencia.

Parámetros a equilibrar:

- tiempo total de práctica
- intensidad técnica
- repetición acumulada
- días consecutivos de uso
- señales de deterioro vocal

Reglas posibles:

```text
si 4 días seguidos de práctica intensa
→ introducir sesión ligera

si señales de fatiga
→ reducir carga y evitar ejercicios agresivos

si baja constancia
→ generar plan corto y fácil de completar
```

---

### 23.9 Generación de agenda diaria

Cada agenda debe incluir:

- objetivo principal del día
- bloques de práctica
- duración total
- criterio de éxito
- mensaje pedagógico breve

Ejemplo:

```text
Objetivo del día: estabilizar notas sostenidas

1. Sustain note basic — 5 min
2. Clean onset drill — 4 min
3. Pitch target reinforcement — 3 min

Duración total: 12 min
Criterio de éxito: mantener desviación < 15 cents en 3 repeticiones
```

---

### 23.10 Generación de agenda semanal

La semana debe tener una lógica global.

Ejemplo de reparto:

- 2 días foco principal
- 2 días consolidación
- 1 día variación / transferencia
- 1 día ligero
- 1 día descanso o libre

Esto mejora:

- recuperación
- adherencia
- progreso real

---

### 23.11 Gestión del estancamiento

El motor debe detectar cuándo el usuario deja de mejorar.

Indicadores:

- score plano durante varias sesiones
- repetición del mismo error
- abandono del mismo tipo de ejercicio
- caída de consistencia

Respuestas posibles:

- cambiar ejercicio
- bajar complejidad
- cambiar orden del bloque
- introducir un ejercicio puente
- reducir carga temporalmente

---

### 23.12 Gestión de la motivación

Aunque el motor sea técnico, también debe proteger la experiencia.

Debe generar:

- tareas alcanzables
- sensación de avance
- variación suficiente
- pequeños hitos visibles

No debe generar:

- agendas eternas
- repeticiones absurdas
- dificultad mal calibrada
- castigo por bajo rendimiento

---

### 23.13 Relación con el motor de scoring

El motor adaptativo no sustituye al scoring.
Lo utiliza como base.

```text
scoring
→ detecta estado actual

adaptive engine
→ decide el siguiente paso
```

---

### 23.14 Relación con la capa pedagógica

El motor adaptativo debe entregar decisiones estructuradas a la capa pedagógica.

Ejemplo:

```json
{
  "primary_focus": "pitch_stability",
  "secondary_focus": "onset_control",
  "difficulty_action": "maintain",
  "recommended_tasks": [
    "sustain_note_precision",
    "clean_onset_drill"
  ],
  "load_action": "normal"
}
```

Después el LLM lo traduce a lenguaje natural.

---

### 23.15 Estado interno recomendado

El motor debe mantener un estado estructurado del usuario.

Ejemplo conceptual:

```json
{
  "user_level": 2,
  "dominant_weakness": "pitch_stability",
  "secondary_weakness": "breath_support",
  "strong_skill": "pitch_accuracy",
  "recent_trend": "improving",
  "fatigue_risk": "low",
  "adherence_state": "stable"
}
```

---

### 23.16 Principio final del motor adaptativo

```text
Un buen entrenador no solo detecta errores.
Decide qué trabajar después.
```

VOZAZI debe comportarse así.

---

## 24. Knowledge Service + RAG pedagógico

El **Knowledge Service** es la capa que convierte a VOZAZI en algo más que un analizador y más que un coach conversacional.

Su función es aportar **conocimiento técnico fiable, estructurado y reutilizable** para que el sistema pueda:

- enseñar
- contextualizar errores
- enlazar teoría y práctica
- reducir alucinaciones del LLM
- construir una biblioteca vocal premium dentro del producto

---

### 24.1 Objetivo principal

```text
Convertir documentación vocal estructurada en ayuda pedagógica accionable.
```

No se trata solo de guardar artículos.
Se trata de que la documentación sea una **capa activa de la arquitectura**.

---

### 24.2 Qué debe saber cubrir

El servicio debe organizar contenido sobre:

#### Técnicas vocales
- afinación
- estabilidad
- apoyo respiratorio
- vibrato
- resonancia
- mezcla de registros
- ataques
- control dinámico

#### Anatomía
- laringe
- cuerdas vocales
- diafragma
- resonadores
- postura y soporte corporal

#### Problemas frecuentes
- desafinación recurrente
- entradas bajas o altas
- tensión en garganta
- voz nasal
- vibrato irregular
- fuga de aire
- fatiga vocal

#### Riesgos y salud vocal
- señales de sobreuso
- cuándo descansar
- calentamiento
- enfriamiento
- cuándo consultar a un especialista

#### Recursos prácticos
- ejercicios
- rutinas
- calentamientos
- secuencias por nivel
- planes específicos por objetivo

---

### 24.3 Principio de diseño

```text
El LLM no debe inventar pedagogía.
Debe apoyarse en una base de conocimiento real.
```

Esto implica que la documentación debe ser:

- versionada
- revisable
- trazable
- enlazable desde el producto
- utilizable por el sistema de retrieval

---

### 24.4 Componentes del Knowledge Service

#### 1. Content Repository
Responsable de:
- almacenar documentación fuente
- versionar artículos
- organizar por categorías

#### 2. Content Parser
Responsable de:
- transformar Markdown en bloques estructurados
- extraer metadatos
- dividir en chunks útiles para retrieval

#### 3. Indexing Layer
Responsable de:
- indexar contenido por categoría, etiquetas y relaciones
- preparar búsqueda semántica y estructurada

#### 4. Retrieval Layer
Responsable de:
- encontrar documentos relevantes según el error, técnica o contexto
- mezclar recuperación semántica + filtros estructurados

#### 5. Pedagogical Context Builder
Responsable de:
- convertir resultados del motor acústico en consultas al knowledge base
- unir documentación con métricas y agenda

#### 6. Response Grounding Layer
Responsable de:
- asegurar que el feedback del LLM se apoye en contenido real
- enlazar explicaciones con artículos y ejercicios

---

### 24.5 Estructura del contenido

La base documental debe vivir como contenido legible y mantenible.

Ejemplo:

```text
docs/
├── techniques/
│   ├── pitch_control.md
│   ├── sustain_control.md
│   ├── breath_support.md
│   ├── vibrato_control.md
│   └── resonance_balance.md
├── anatomy/
│   ├── larynx.md
│   ├── vocal_folds.md
│   ├── diaphragm.md
│   └── resonators.md
├── problems/
│   ├── flat_entry.md
│   ├── unstable_pitch.md
│   ├── throat_tension.md
│   ├── nasal_resonance.md
│   └── fatigue_pattern.md
├── health/
│   ├── warmup.md
│   ├── cooldown.md
│   ├── vocal_fatigue.md
│   └── when_to_stop.md
└── resources/
    ├── beginner_routine.md
    ├── sustain_workout.md
    ├── pitch_reset.md
    └── breath_reset.md
```

---

### 24.6 Metadatos recomendados

Cada documento o chunk debería tener metadatos como:

```text
id
category
subcategory
title
related_techniques
related_errors
difficulty_level
risk_level
recommended_exercises
last_reviewed_at
```

Esto permite retrieval mucho más preciso.

---

### 24.7 Chunks pedagógicos

No conviene indexar documentos completos como una sola pieza.

Conviene dividirlos en bloques pedagógicos como:

- definición
- causas
- síntomas
- errores comunes
- ejercicios recomendados
- señales de mejora
- señales de alarma

Ejemplo conceptual:

```text
Documento: unstable_pitch.md

Chunk 1 → qué es
Chunk 2 → por qué ocurre
Chunk 3 → cómo detectarlo
Chunk 4 → ejercicios correctivos
Chunk 5 → cuándo descansar
```

---

### 24.8 Retrieval híbrido recomendado

VOZAZI no debería usar solo búsqueda semántica.
Debe mezclar:

#### Búsqueda estructurada
Por:
- categoría
- técnica
- error
- nivel
- riesgo

#### Búsqueda semántica
Para:
- preguntas abiertas
- explicaciones naturales
- similitud contextual

#### Re-ranking contextual
Para priorizar chunks que mejor encajen con:
- debilidad dominante
- ejercicio actual
- nivel del usuario
- riesgo de fatiga

---

### 24.9 Flujo de RAG pedagógico

```text
Motor acústico detecta error
→ Adaptive Engine decide foco
→ Knowledge Service identifica técnica / problema relacionado
→ Retrieval Layer recupera chunks relevantes
→ Pedagogical Context Builder mezcla:
   - métricas
   - error dominante
   - objetivo del ejercicio
   - historial reciente
   - chunks documentales
→ LLM genera explicación y guía
→ UI muestra feedback + enlaces a documentación
```

---

### 24.10 Ejemplo de grounding

Caso:

```text
Error dominante: unstable_pitch
Técnica objetivo: sustain_control
Nivel: beginner
```

El sistema debería recuperar:

- definición de estabilidad vocal
- causas comunes en principiantes
- ejercicios básicos recomendados
- señales de mejora esperadas

Y el LLM debería responder apoyándose en ese material.

---

### 24.11 Qué debe producir el Knowledge Service

No solo documentos.
También debe poder producir objetos estructurados como:

```json
{
  "topic": "unstable_pitch",
  "explanation": "La nota no se mantiene estable en el tiempo.",
  "common_causes": [
    "apoyo respiratorio débil",
    "tensión",
    "falta de control en nota sostenida"
  ],
  "recommended_exercises": [
    "sustain_note_basic",
    "breath_support_reset"
  ],
  "warning_signals": [
    "fatiga creciente",
    "deterioro sostenido"
  ],
  "related_docs": [
    "sustain_control.md",
    "vocal_fatigue.md"
  ]
}
```

Esto mejora muchísimo la capacidad del sistema para ser consistente.

---

### 24.12 UX dentro del producto

La documentación no debe estar escondida.
Debe formar parte del flujo.

Ejemplos de integración:

#### Durante la sesión
- ayuda contextual breve
- explicación de un error detectado
- enlace a “ver técnica”

#### En el reporte post-sesión
- “qué significa este error”
- “qué ejercicio corrige esto”
- “cuándo conviene descansar”

#### En la biblioteca
- artículos completos
- rutas de aprendizaje
- recursos por nivel o problema

---

### 24.13 Relación con el dataset

La capa documental debe estar enlazada con la taxonomía.

Por ejemplo:

```text
error: unstable_pitch
→ docs relacionados
→ ejercicios correctivos
→ señales de riesgo
→ técnica objetivo
```

Esto permite que cada sesión no solo produzca métricas, sino también contexto pedagógico reutilizable.

---

### 24.14 Seguridad pedagógica

La capa documental también debe actuar como barrera de seguridad.

Ejemplos:

- si se detecta posible fatiga, priorizar chunks de descanso y cuidado
- si el riesgo sube, evitar mensajes que empujen a forzar la voz
- si el error sugiere posible problema serio, mostrar orientación conservadora

---

### 24.15 Evolución del sistema

El Knowledge Service debe poder crecer sin romper el producto.

Debe admitir:

- nuevos artículos
- nuevas etiquetas
- nuevas relaciones entre técnica, error y ejercicio
- revisión editorial
- mejora continua de chunks y prompts

---

### 24.16 Principio final del Knowledge Service

```text
El conocimiento en VOZAZI no es contenido de soporte.
Es una parte activa del sistema de entrenamiento.
```

---

## 25. Arquitectura por repositorios, carpetas y módulos

Para convertir la arquitectura conceptual en algo construible, VOZAZI debe definir una estructura real de implementación.

El objetivo es evitar dos errores:

- meter todo en un único bloque caótico
- fragmentar demasiado pronto en microservicios innecesarios

La estrategia recomendada es:

```text
monorepo de producto
+
servicio acústico especializado separado
+
contenidos documentales versionados
```

---

### 25.1 Estructura de alto nivel recomendada

```text
vozazi/
├── apps/
│   ├── web/
│   └── audio-engine/
├── packages/
│   ├── ui/
│   ├── db/
│   ├── core-domain/
│   ├── analytics/
│   ├── billing/
│   ├── auth/
│   ├── pedagogy/
│   ├── shared-types/
│   └── config/
├── docs/
│   ├── techniques/
│   ├── anatomy/
│   ├── problems/
│   ├── health/
│   └── resources/
├── infrastructure/
│   ├── vercel/
│   ├── database/
│   ├── stripe/
│   ├── clerk/
│   ├── resend/
│   ├── posthog/
│   └── r2/
├── scripts/
├── .github/
└── README.md
```

---

### 25.2 Repositorios recomendados

#### Opción recomendada para empezar

##### Repo 1 — `vozazi-platform`
Monorepo principal del producto.

Debe contener:
- app web
- backend de producto / BFF
- ORM y esquema de base de datos
- integración con Stripe, Clerk, Resend y PostHog
- lógica de progreso
- adaptive engine
- capa pedagógica
- documentación Markdown

##### Repo 2 — `vozazi-audio-engine`
Servicio especializado de análisis acústico.

Debe contener:
- FastAPI
- WebSockets
- pipelines de audio
- métricas
- scoring técnico
- utilidades de inferencia y procesamiento

#### Opción futura si el producto crece mucho

Separar también:
- un repo específico para docs/knowledge
- un repo específico para data science / training

Pero no hace falta al principio.

---

### 25.3 App principal `apps/web`

Aquí vive el producto visible para el usuario.

Estructura sugerida:

```text
apps/web/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── practice/
│   ├── history/
│   ├── library/
│   ├── billing/
│   └── api/
├── components/
│   ├── dashboard/
│   ├── practice/
│   ├── charts/
│   ├── library/
│   ├── billing/
│   └── shared/
├── features/
│   ├── sessions/
│   ├── progress/
│   ├── tasks/
│   ├── library/
│   ├── onboarding/
│   └── subscription/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── analytics/
│   ├── audio/
│   ├── pedagogy/
│   └── utils/
├── server/
│   ├── actions/
│   ├── services/
│   ├── repositories/
│   └── mappers/
└── middleware.ts
```

---

### 25.4 Servicio acústico `apps/audio-engine`

Aquí vive el núcleo técnico del análisis vocal.

Estructura sugerida:

```text
apps/audio-engine/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── health.py
│   │   ├── realtime.py
│   │   ├── analysis.py
│   │   └── scoring.py
│   └── ws/
│       └── session_ws.py
├── domain/
│   ├── audio/
│   ├── metrics/
│   ├── scoring/
│   ├── taxonomy/
│   └── evaluation/
├── pipelines/
│   ├── realtime/
│   ├── deep/
│   └── preprocessing/
├── models/
│   ├── pitch/
│   ├── classifiers/
│   └── fatigue/
├── services/
│   ├── ingestion_service.py
│   ├── analysis_service.py
│   ├── scoring_service.py
│   └── asset_processor.py
├── infrastructure/
│   ├── storage/
│   ├── logging/
│   └── settings/
├── tests/
└── requirements.txt
```

---

### 25.5 Paquetes compartidos `packages/`

Los paquetes compartidos evitan duplicidad y mejoran consistencia.

#### `packages/ui`
- componentes reutilizables
- design system
- bloques visuales de dashboard y práctica

#### `packages/db`
- esquema Drizzle
- migraciones
- seeds
- acceso tipado a PostgreSQL

#### `packages/core-domain`
- entidades centrales
- reglas de negocio puras
- vocabulario del dominio
- modelos de session, task, progress, evaluation

#### `packages/analytics`
- nombres de eventos
- helpers para PostHog
- tracking consistente

#### `packages/billing`
- adaptadores Stripe
- mapeo de planes
- webhooks y utilidades

#### `packages/auth`
- utilidades de Clerk
- guards
- helpers de sesión

#### `packages/pedagogy`
- plantillas de feedback
- esquemas de contexto para el LLM
- mapeo técnica/error → explicación

#### `packages/shared-types`
- tipos compartidos entre web y audio-engine
- DTOs
- contratos entre servicios

#### `packages/config`
- configuración común
- env typing
- constantes del sistema

---

### 25.6 Carpeta `docs/`

La carpeta `docs/` debe formar parte del producto, no solo del repositorio.

Estructura sugerida:

```text
docs/
├── techniques/
├── anatomy/
├── problems/
├── health/
└── resources/
```

Adicionalmente puede tener:

```text
docs/
├── metadata/
├── indexes/
└── review-log/
```

Para:
- versionado pedagógico
- revisión editorial
- trazabilidad

---

### 25.7 Carpeta `infrastructure/`

Aquí se centraliza la infraestructura declarativa y la configuración operacional.

```text
infrastructure/
├── vercel/
├── database/
├── stripe/
├── clerk/
├── resend/
├── posthog/
├── r2/
└── observability/
```

Objetivo:
- no mezclar configuración de infraestructura con lógica de negocio

---

### 25.8 Separación por dominio funcional

Dentro del producto, conviene pensar por dominios:

#### Dominio `sessions`
- inicio/cierre
- bloques de práctica
- persistencia de resultados

#### Dominio `progress`
- snapshots
- evolución
- skill dimensions

#### Dominio `tasks`
- agenda
- planificación
- task results

#### Dominio `evaluation`
- score
- debilidad dominante
- resultados técnicos

#### Dominio `library`
- docs
- recursos
- búsqueda

#### Dominio `subscription`
- plan
- acceso
- billing state

Esto evita organizar solo “por tipo de archivo”.

---

### 25.9 Contrato entre `web` y `audio-engine`

El servicio acústico debe ser un servicio especializado, no una bolsa de lógica mezclada.

Se recomienda definir contratos claros para:

- iniciar análisis
- enviar chunks
- recibir feedback real-time
- solicitar deep analysis
- recibir métricas y score

Ejemplo conceptual:

```json
{
  "session_id": "s_123",
  "task_id": "t_456",
  "audio_chunk_url": "...",
  "expected_target": "A4",
  "exercise_type": "sustain_note"
}
```

Respuesta:

```json
{
  "session_id": "s_123",
  "metrics": {
    "pitch_accuracy": 0.81,
    "pitch_stability": 0.69
  },
  "evaluation": {
    "score": 76,
    "dominant_weakness": "pitch_stability"
  }
}
```

---

### 25.10 Arquitectura de carpetas por dominio en `core-domain`

```text
packages/core-domain/
├── sessions/
│   ├── entities/
│   ├── services/
│   ├── policies/
│   └── value-objects/
├── progress/
├── tasks/
├── evaluation/
├── pedagogy/
├── taxonomy/
└── knowledge/
```

Esto ayuda a mantener un lenguaje común en todo el proyecto.

---

### 25.11 Arquitectura de observabilidad

VOZAZI premium debe poder observarse bien.

Conviene preparar módulos para:

- logs de sesión
- errores del audio-engine
- métricas de latencia
- eventos de producto
- seguimiento de fallos en scoring

Sugerencia:

```text
infrastructure/observability/
├── logging/
├── tracing/
└── alerts/
```

---

### 25.12 Estrategia de tests

#### En `apps/web`
- tests de componentes críticos
- tests de server actions
- tests de flujos de sesiones y tareas

#### En `apps/audio-engine`
- tests de métricas
- tests de scoring
- tests de pipelines
- tests sobre muestras de audio controladas

#### En `packages/core-domain`
- tests puros de reglas de negocio

---

### 25.13 Principio de construcción

```text
Primero dominios y contratos.
Después pantallas y detalles.
```

Si no se define bien la estructura de repos, carpetas y módulos, el producto termina siendo difícil de evolucionar.

---

### 25.14 Resumen de implementación real

```text
Monorepo principal:
- web app
- BFF
- dominio
- DB
- billing
- analytics
- pedagogy
- docs

Servicio separado:
- audio-engine
```

Esta es la estructura correcta para construir VOZAZI con ambición alta sin caer en caos técnico.

---

## 26. Roadmap técnico por fases y sprints

El objetivo del roadmap es convertir la arquitectura de VOZAZI en un plan real de construcción.

Debe seguir tres principios:

- construir primero el núcleo defendible
- evitar complejidad prematura
- mantener siempre una versión usable del producto

---

### 26.1 Principio de ejecución

```text
Primero hacer que funcione.
Después hacer que mida bien.
Después hacer que enseñe mejor.
Después hacer que escale.
```

---

## 26.2 Fase 0 — Fundaciones del proyecto

Objetivo: dejar preparada la base técnica y de producto.

### Entregables
- monorepo creado
- repo del `audio-engine` creado
- configuración inicial de Vercel
- PostgreSQL configurado
- Drizzle configurado
- Clerk configurado
- Stripe configurado a nivel base
- Resend configurado
- PostHog configurado
- Cloudflare R2 configurado
- estructura `docs/` creada
- sistema de variables de entorno tipado
- CI básica

### Resultado esperado
Un entorno estable sobre el que empezar a construir sin deuda estructural temprana.

---

## 26.3 Fase 1 — Vertical slice del producto

Objetivo: tener un flujo completo mínimo de extremo a extremo.

### Qué debe hacer esta fase
Un usuario autenticado debe poder:

- entrar en VOZAZI
- iniciar una práctica básica
- permitir acceso al micrófono
- cantar un ejercicio simple
- recibir feedback visual básico
- guardar la sesión
- ver un resultado resumido

### Sprints sugeridos

#### Sprint 1 — App shell
- layout base
- navegación principal
- auth con Clerk
- dashboard vacío
- pantallas stub: practice, history, library, billing

#### Sprint 2 — Práctica mínima
- captura de audio con `getUserMedia`
- UI de práctica básica
- nota objetivo simple
- feedback local mínimo
- cierre de sesión de práctica

#### Sprint 3 — Persistencia mínima
- guardar sesión en PostgreSQL
- guardar referencia a audio en R2
- primer reporte post-sesión
- eventos básicos en PostHog

### Resultado esperado
Un primer flujo usable de práctica, aunque aún no sea premium en análisis.

---

## 26.4 Fase 2 — Motor acústico inicial serio

Objetivo: pasar de demo funcional a sistema que mide de verdad.

### Qué debe hacer esta fase
- conectar `apps/audio-engine`
- análisis por chunks
- pitch tracking serio
- primeras métricas estructuradas
- primer scoring técnico

### Sprints sugeridos

#### Sprint 4 — Audio engine base
- FastAPI levantado
- endpoints y WebSocket básicos
- contrato entre `web` y `audio-engine`
- health checks
- logging inicial

#### Sprint 5 — Pipeline inicial
- ingestión de audio
- normalización
- `torchcrepe`
- métricas de pitch accuracy y pitch stability
- respuesta estructurada al frontend

#### Sprint 6 — Score inicial
- score por ejercicio
- score por sesión
- guardar `evaluation_results`
- mostrar score en el reporte

### Resultado esperado
VOZAZI ya mide pitch y estabilidad con base técnica real.

---

## 26.5 Fase 3 — Progreso y memoria del producto

Objetivo: convertir sesiones aisladas en evolución.

### Qué debe hacer esta fase
- histórico visual
- progreso semanal
- snapshots
- skill dimensions iniciales
- primeras comparativas

### Sprints sugeridos

#### Sprint 7 — Historial
- lista de sesiones
- detalle por sesión
- gráficos básicos
- filtros por fecha

#### Sprint 8 — Progress Service
- snapshots semanales
- snapshots mensuales
- consolidación de métricas
- skill cards principales

#### Sprint 9 — Modelo longitudinal
- comparación entre sesiones
- tendencias básicas
- debilidad dominante recurrente

### Resultado esperado
El usuario ya no ve sesiones sueltas, sino evolución acumulada.

---

## 26.6 Fase 4 — Adaptive Training Engine v1

Objetivo: que el producto empiece a decidir qué practicar después.

### Qué debe hacer esta fase
- seleccionar debilidad dominante
- generar siguiente tarea
- construir agenda básica
- ajustar dificultad con reglas simples

### Sprints sugeridos

#### Sprint 10 — Taxonomía aplicada
- mapear técnicas, errores y ejercicios
- catálogo inicial de ejercicios
- tabla de reglas problema → corrección

#### Sprint 11 — Generación de tareas
- `tasks`
- `task_results`
- selector de ejercicios válido
- agenda diaria básica

#### Sprint 12 — Adaptación simple
- subir / mantener / bajar dificultad
- balance de carga inicial
- mensajes de foco técnico

### Resultado esperado
VOZAZI ya propone el siguiente paso en vez de limitarse a medir.

---

## 26.7 Fase 5 — Knowledge Service + biblioteca interna

Objetivo: que el sistema enseñe con base documental real.

### Qué debe hacer esta fase
- mostrar biblioteca vocal dentro de la app
- vincular errores con artículos
- crear la estructura documental real
- retrieval inicial sin complejidad excesiva

### Sprints sugeridos

#### Sprint 13 — Biblioteca básica
- `/library`
- categorías
- artículos renderizados desde `docs/`
- metadatos mínimos

#### Sprint 14 — Knowledge Service
- parser de Markdown
- chunking inicial
- metadatos
- relaciones técnica/error/doc

#### Sprint 15 — Enlaces pedagógicos
- mostrar “ver explicación” desde reportes
- recomendar docs por error detectado
- primeros objetos pedagógicos estructurados

### Resultado esperado
VOZAZI empieza a comportarse como entrenador + biblioteca vocal.

---

## 26.8 Fase 6 — Pedagogical Orchestrator + LLM

Objetivo: transformar métricas y documentación en feedback premium.

### Qué debe hacer esta fase
- construir contexto pedagógico
- integrar LLM
- generar resúmenes explicativos
- recomendar ejercicios en lenguaje natural

### Sprints sugeridos

#### Sprint 16 — Context builder
- contexto compuesto de métricas + progreso + docs
- plantillas de salida estructurada
- validación de formato

#### Sprint 17 — LLM inicial
- integración del proveedor LLM
- feedback post-sesión
- explicación de error dominante
- recomendación breve del siguiente paso

#### Sprint 18 — Grounding pedagógico
- retrieval conectado al LLM
- enlaces a docs concretas
- mensajes más seguros y consistentes

### Resultado esperado
VOZAZI ya explica, no solo puntúa.

---

## 26.9 Fase 7 — Premium real de análisis y experiencia

Objetivo: subir de un producto bueno a uno de nivel muy alto.

### Qué debe hacer esta fase
- ampliar métricas
- mejorar UX en tiempo real
- reforzar seguridad vocal
- mejorar agenda semanal

### Sprints sugeridos

#### Sprint 19 — Métricas avanzadas
- onset timing
- sustain duration
- vibrato inicial
- consistencia entre repeticiones

#### Sprint 20 — UX premium
- dashboard refinado
- better practice flow
- mejores gráficos
- skill maps
- microfeedback más pulido

#### Sprint 21 — Seguridad y salud vocal
- alertas conservadoras
- señales de fatiga
- docs de riesgo enlazadas
- descansos sugeridos

### Resultado esperado
VOZAZI empieza a sentirse claramente premium.

---

## 26.10 Fase 8 — Escalabilidad y excelencia operativa

Objetivo: preparar VOZAZI para crecer sin romperse.

### Qué debe hacer esta fase
- observabilidad seria
- optimización de latencia
- colas y procesos diferidos más robustos
- optimización del coste por usuario

### Sprints sugeridos

#### Sprint 22 — Observabilidad
- logs estructurados
- métricas de latencia
- dashboards internos
- alertas

#### Sprint 23 — Optimización
- reducir payloads
- mejorar chunking de audio
- optimizar pipeline profundo
- revisar consumo de R2 y Postgres

#### Sprint 24 — Hardening
- rate limits
- tolerancia a fallos
- retries
- mejores mecanismos de recuperación

### Resultado esperado
Arquitectura robusta para usuarios reales y crecimiento serio.

---

## 26.11 Orden real de prioridad

Si hubiera que resumir qué construir primero:

```text
1. práctica usable
2. medición real
3. progreso
4. adaptación
5. documentación
6. pedagogía LLM
7. refinamiento premium
8. escalabilidad
```

---

## 26.12 Definición de “producto ya valioso”

VOZAZI ya aporta valor claro cuando cumple esto:

- mide mejor que un afinador simple
- guarda progreso
- explica al menos un error dominante
- propone qué practicar después
- mantiene continuidad de uso

A partir de ahí, cada fase añade profundidad y barrera competitiva.

---

## 26.13 Principio final del roadmap

```text
No intentar construir todo VOZAZI de golpe.
Construir primero el loop central:
práctica → medición → score → siguiente tarea → progreso.
```

Ese loop es el corazón del producto.

---

## 27. Arquitectura de base de datos completa

La base de datos de VOZAZI debe diseñarse para soportar cinco necesidades al mismo tiempo:

- operación diaria del producto
- progreso longitudinal del usuario
- adaptive training engine
- capa pedagógica
- generación de dataset vocal estructurado

La clave es no guardar solo resultados finales.
Hay que guardar suficiente contexto para reconstruir:

- qué se pidió al usuario
- qué hizo
- qué detectó el sistema
- qué decisión tomó el motor adaptativo
- qué feedback recibió

---

### 27.1 Principio de modelado

```text
Cada sesión debe ser trazable.
Cada tarea debe ser explicable.
Cada resultado debe ser comparable.
```

---

## 27.2 Núcleo de entidades

### Bloques principales del esquema

```text
users
subscriptions
vocal_profiles
sessions
session_segments
session_metrics
session_audio_assets
evaluation_results
tasks
task_runs
task_results
progress_snapshots
knowledge_documents
knowledge_chunks
pedagogical_feedback
product_events
```

---

## 27.3 Tabla `users`

Representa al usuario de producto, enlazado con Clerk.

### Campos recomendados

```text
id
clerk_user_id
email
display_name
timezone
locale
current_plan
onboarding_state
created_at
updated_at
```

### Responsabilidad

- identidad interna del producto
- preferencias base
- referencia a autenticación externa

---

## 27.4 Tabla `subscriptions`

Refleja el estado de suscripción del usuario.

### Campos recomendados

```text
id
user_id
stripe_customer_id
stripe_subscription_id
plan_code
status
billing_cycle
current_period_start
current_period_end
cancel_at_period_end
created_at
updated_at
```

### Responsabilidad

- saber qué funcionalidades están habilitadas
- trazabilidad de estado de billing

---

## 27.5 Tabla `vocal_profiles`

Perfil vocal vivo del usuario.

### Campos recomendados

```text
id
user_id
voice_type_estimated
range_low_note
range_high_note
current_level
dominant_weakness
secondary_weakness
strong_skill
fatigue_risk_state
adherence_state
last_evaluated_at
created_at
updated_at
```

### Responsabilidad

- estado resumido del desarrollo vocal del usuario
- base para personalización

---

## 27.6 Tabla `sessions`

Cada práctica completa del usuario.

### Campos recomendados

```text
id
user_id
task_id_nullable
session_type
status
started_at
ended_at
duration_seconds
overall_score
primary_focus
secondary_focus
dominant_weakness
notes_nullable
created_at
updated_at
```

### Responsabilidad

- unidad principal de práctica
- punto de unión entre audio, métricas, evaluación y feedback

---

## 27.7 Tabla `session_segments`

Fragmentos internos de una sesión.
Útil cuando una sesión tiene varios ejercicios o bloques.

### Campos recomendados

```text
id
session_id
segment_index
exercise_code
exercise_type
target_note_nullable
target_range_low_nullable
target_range_high_nullable
started_at
ended_at
duration_seconds
status
created_at
updated_at
```

### Responsabilidad

- granularidad fina para comparar ejercicios dentro de una sesión

---

## 27.8 Tabla `session_audio_assets`

Referencia a audios almacenados en R2.

### Campos recomendados

```text
id
session_id
segment_id_nullable
asset_type
storage_provider
storage_key
mime_type
sample_rate_nullable
duration_seconds_nullable
file_size_bytes_nullable
noise_estimate_nullable
created_at
```

### Valores típicos de `asset_type`

```text
raw_audio
processed_audio
comparison_clip
export_asset
```

### Responsabilidad

- enlazar la BD con el almacenamiento de audio

---

## 27.9 Tabla `session_metrics`

Métricas crudas o agregadas por sesión o segmento.

### Campos recomendados

```text
id
session_id
segment_id_nullable
metric_scope
metrics_jsonb
created_at
```

### Ejemplo de `metric_scope`

```text
session
segment
repetition
```

### Ejemplo de `metrics_jsonb`

```json
{
  "pitch_accuracy": 0.84,
  "pitch_stability": 0.73,
  "vibrato_rate": 5.4,
  "onset_timing_ms": 118,
  "breath_control": 0.69
}
```

### Responsabilidad

- guardar métricas flexibles sin rigidizar demasiado el esquema

---

## 27.10 Tabla `evaluation_results`

Resultado interpretado del motor de scoring.

### Campos recomendados

```text
id
session_id
segment_id_nullable
score_total
score_pitch_accuracy
score_pitch_stability
score_onset_control
score_breath_support
score_consistency
dominant_weakness
secondary_weakness
technique_focus
error_classification
adaptive_decision
created_at
```

### Responsabilidad

- separar claramente métrica de evaluación
- alimentar Adaptive Training Engine

---

## 27.11 Tabla `tasks`

Tareas generadas para el usuario.

### Campos recomendados

```text
id
user_id
source
status
title
exercise_code
exercise_type
primary_focus
secondary_focus
difficulty_level
priority
duration_minutes
repetitions_nullable
success_criteria_jsonb
scheduled_for
expires_at_nullable
created_at
updated_at
```

### Valores típicos de `source`

```text
adaptive_engine
weekly_plan
manual_assignment
```

### Responsabilidad

- agenda real de trabajo del usuario

---

## 27.12 Tabla `task_runs`

Cada intento de ejecutar una tarea.

### Campos recomendados

```text
id
task_id
user_id
session_id_nullable
started_at
ended_at
status
completion_ratio_nullable
created_at
updated_at
```

### Responsabilidad

- distinguir la tarea planificada del intento real de ejecución

---

## 27.13 Tabla `task_results`

Resultado consolidado de una tarea.

### Campos recomendados

```text
id
task_id
task_run_id
user_id
score_total
completed
dominant_weakness
adaptive_outcome
notes_nullable
created_at
```

### Responsabilidad

- conectar agenda con resultado y adaptación posterior

---

## 27.14 Tabla `progress_snapshots`

Resúmenes longitudinales del usuario.

### Campos recomendados

```text
id
user_id
snapshot_type
period_start
period_end
overall_score
pitch_accuracy_trend
pitch_stability_trend
breath_support_trend
onset_control_trend
consistency_trend
dominant_weakness
strong_skill
fatigue_risk_state
created_at
```

### Valores típicos de `snapshot_type`

```text
weekly
monthly
milestone
```

### Responsabilidad

- acelerar consultas de progreso
- evitar recalcular siempre todo desde sesiones crudas

---

## 27.15 Tabla `pedagogical_feedback`

Feedback textual/estructurado entregado al usuario.

### Campos recomendados

```text
id
user_id
session_id_nullable
task_id_nullable
feedback_type
summary
explanation
recommended_next_step
linked_docs_jsonb
llm_provider_nullable
prompt_version_nullable
created_at
```

### Responsabilidad

- trazabilidad de lo que el usuario vio
- evaluación futura de calidad pedagógica

---

## 27.16 Tablas de conocimiento

### `knowledge_documents`

```text
id
slug
category
subcategory
title
difficulty_level_nullable
risk_level_nullable
related_techniques_jsonb
related_errors_jsonb
status
last_reviewed_at
created_at
updated_at
```

### `knowledge_chunks`

```text
id
document_id
chunk_index
chunk_type
content
metadata_jsonb
embedding_ref_nullable
created_at
updated_at
```

### Responsabilidad

- soportar biblioteca interna y retrieval pedagógico

---

## 27.17 Tabla `product_events`

Eventos relevantes del producto, además de PostHog.

### Campos recomendados

```text
id
user_id_nullable
session_id_nullable
event_name
event_payload_jsonb
occurred_at
```

### Responsabilidad

- trazabilidad interna crítica
- auditoría de flujos importantes
- soporte a procesos de backoffice o debugging

---

## 27.18 Relaciones principales

```text
users
├── subscriptions
├── vocal_profiles
├── sessions
│   ├── session_segments
│   ├── session_audio_assets
│   ├── session_metrics
│   ├── evaluation_results
│   └── pedagogical_feedback
├── tasks
│   ├── task_runs
│   └── task_results
└── progress_snapshots

knowledge_documents
└── knowledge_chunks
```

---

## 27.19 Decisiones de modelado importantes

### 1. Separar métricas de evaluación

No mezclar en la misma tabla:
- datos acústicos crudos
- interpretación del scoring

Por eso existen:
- `session_metrics`
- `evaluation_results`

### 2. Separar tareas de ejecuciones

Una tarea planificada no equivale a una tarea realizada.

Por eso existen:
- `tasks`
- `task_runs`
- `task_results`

### 3. Mantener snapshots

Aunque el histórico crudo sea valioso, los `progress_snapshots` mejoran mucho:
- velocidad de lectura
- reporting
- dashboard
- emails semanales

### 4. Mantener feedback persistido

Guardar lo que el usuario leyó permite:
- evaluar calidad del sistema
- revisar consistencia pedagógica
- reentrenar o mejorar mensajes

---

## 27.20 Campos que conviene indexar

Índices recomendados:

```text
users.clerk_user_id
subscriptions.stripe_subscription_id
sessions.user_id + started_at
tasks.user_id + scheduled_for + status
progress_snapshots.user_id + snapshot_type + period_start
knowledge_documents.slug
knowledge_chunks.document_id + chunk_index
product_events.user_id + occurred_at
```

---

## 27.21 Uso de `jsonb`

Conviene usar `jsonb` para:

- métricas extensibles
- criterios de éxito
- payloads pedagógicos enlazados
- metadatos de chunks
- payloads de eventos

Pero no conviene usarlo para todo.

Campos nucleares como:
- IDs
- estados
- fechas
- relaciones
- scores principales

Deben vivir en columnas normales.

---

## 27.22 Convenciones de estados recomendadas

### `sessions.status`

```text
started
in_progress
completed
failed
abandoned
```

### `tasks.status`

```text
planned
active
completed
skipped
expired
canceled
```

### `subscriptions.status`

```text
trialing
active
past_due
canceled
incomplete
```

---

## 27.23 Qué debe persistirse siempre

Si una sesión termina correctamente, VOZAZI debería guardar siempre:

- sesión
- audio asset o referencia
- métricas
- evaluation result
- task result si aplica
- pedagogical feedback
- evento de sesión completada

Ese es el mínimo para que el sistema conserve valor longitudinal.

---

## 27.24 Esquema de evolución futura

Más adelante podrían añadirse tablas como:

```text
exercise_catalog
exercise_variants
taxonomy_labels
model_versions
fatigue_alerts
coach_notes
academy_accounts
teacher_assignments
```

Pero no son obligatorias para la primera versión premium.

---

## 27.25 Principio final de base de datos

```text
La base de datos de VOZAZI no debe guardar solo actividad.
Debe guardar memoria estructurada del aprendizaje vocal.
```

---

## 28. Exercise Engine

El **Exercise Engine** es la capa que convierte la arquitectura de VOZAZI en entrenamiento real.

El motor acústico mide.
El scoring interpreta.
El adaptive engine decide prioridades.
El **Exercise Engine** traduce todo eso en **ejercicios concretos, ejecutables y progresivos**.

Sin este motor, VOZAZI tendría análisis y pedagogía, pero no un sistema de práctica de alto nivel.

---

### 28.1 Objetivo principal

```text
Convertir objetivos técnicos en tareas vocales precisas, medibles y progresivas.
```

Debe resolver cuatro preguntas:

- qué ejercicio toca ahora
- cómo se ejecuta
- cómo se mide si salió bien
- cómo progresa o se simplifica después

---

### 28.2 Rol dentro de la arquitectura

```text
Adaptive Training Engine
→ decide foco técnico y dificultad

Exercise Engine
→ selecciona y configura ejercicio ejecutable

Motor acústico
→ mide el resultado
```

Esto significa que el Exercise Engine es el puente entre:

- intención pedagógica
- diseño de práctica
- análisis cuantificable

---

### 28.3 Componentes internos del Exercise Engine

#### 1. Exercise Catalog
Responsable de:
- definir todos los ejercicios disponibles
- clasificarlos por técnica, dificultad y objetivo
- mantener variantes reutilizables

#### 2. Exercise Selector
Responsable de:
- elegir el ejercicio adecuado según foco, nivel y contexto
- evitar ejercicios incompatibles con el estado del usuario

#### 3. Exercise Configurator
Responsable de:
- parametrizar duración
- rango o nota objetivo
- repeticiones
- tolerancias
- criterios de éxito

#### 4. Execution Contract Builder
Responsable de:
- construir la especificación exacta que usará frontend + audio-engine
- asegurar que el ejercicio sea medible

#### 5. Exercise Progression Manager
Responsable de:
- determinar cuándo escalar
- cuándo mantener
- cuándo retroceder a una variante más básica

#### 6. Exercise Result Interpreter
Responsable de:
- conectar resultados del scoring con el catálogo
- decidir qué variante sigue después

---

### 28.4 Qué es un ejercicio en VOZAZI

Un ejercicio no es solo un nombre.
Es una unidad estructurada de entrenamiento.

Cada ejercicio debe incluir:

- código único
- técnica principal
- técnicas secundarias
- nivel mínimo
- prerequisitos
- instrucciones
- duración base
- repeticiones base
- inputs esperados
- métricas relevantes
- criterio de éxito
- reglas de progresión
- reglas de regresión
- riesgos o advertencias

---

### 28.5 Estructura conceptual de un ejercicio

```json
{
  "exercise_code": "sustain_note_basic",
  "title": "Nota sostenida básica",
  "primary_technique": "sustain_control",
  "secondary_techniques": ["breath_support", "pitch_stability"],
  "level": 1,
  "prerequisites": [],
  "instructions": "Sostén la nota objetivo con volumen estable y sin tensión.",
  "target_type": "single_note",
  "default_target": "A4",
  "default_duration_seconds": 5,
  "default_repetitions": 3,
  "measured_metrics": ["pitch_stability", "sustain_duration", "pitch_accuracy"],
  "success_criteria": {
    "pitch_stability_min": 0.70,
    "pitch_accuracy_min": 0.75,
    "duration_seconds_min": 4.0
  },
  "progression_rules": {
    "upgrade_if_score_gte": 85,
    "max_success_streak": 3
  },
  "regression_rules": {
    "downgrade_if_score_lt": 60
  },
  "risk_flags": ["fatigue_if_repeated_excessively"]
}
```

---

### 28.6 Dimensiones del catálogo

El catálogo debe organizarse al menos por estas dimensiones:

#### Por técnica principal
- pitch_control
- sustain_control
- breath_support
- clean_onset
- vibrato_control
- resonance_balance
- register_mix
- dynamic_control

#### Por formato de ejercicio
- nota única
- escala
- salto interválico
- frase
- resonancia
- respiración
- vibrato

#### Por nivel
- beginner
- foundation
- intermediate
- advanced
- professional

#### Por complejidad
- simple
- controlado
- combinado
- de transferencia

---

### 28.7 Tipos base de ejercicio

Catálogo inicial recomendado:

```text
sustain_note
pitch_target
scale_run
interval_jump
clean_onset
breath_reset
breath_control
vibrato_intro
vibrato_stability
resonance_forward
resonance_balance
register_bridge
phrase_stability
dynamic_variation
```

Cada uno debe tener variantes por nivel.

---

### 28.8 Variantes y progresión

VOZAZI no debería tener ejercicios aislados, sino **familias de ejercicios**.

Ejemplo:

```text
sustain_note_basic
sustain_note_precision
sustain_note_extended
sustain_note_with_dynamic_control
```

Esto permite una progresión natural.

---

### 28.9 Parámetros configurables

Un mismo ejercicio puede cambiar mucho según su configuración.

Parámetros habituales:

- nota objetivo
- rango objetivo
- duración
- número de repeticiones
- precisión exigida
- velocidad
- intervalo
- descanso entre repeticiones
- volumen objetivo

Esto permite reutilizar el mismo ejercicio base para distintos perfiles.

---

### 28.10 Contrato de ejecución

Cada ejercicio debe generar un contrato claro para el sistema.

Ejemplo conceptual:

```json
{
  "session_id": "s_123",
  "task_id": "t_456",
  "exercise_code": "pitch_target_precision",
  "execution": {
    "target_note": "G4",
    "repetitions": 4,
    "hold_seconds": 3,
    "rest_between_reps_seconds": 2,
    "success_thresholds": {
      "pitch_accuracy": 0.80,
      "pitch_stability": 0.70
    }
  }
}
```

Este contrato es lo que usa:

- frontend para mostrar la práctica
- audio-engine para saber qué medir
- scoring para saber qué evaluar

---

### 28.11 Relación con el scoring

El Exercise Engine debe declarar explícitamente qué métricas importan para cada ejercicio.

Ejemplo:

```text
sustain_note_basic
→ pitch_stability
→ sustain_duration
→ pitch_accuracy
```

```text
clean_onset
→ onset_timing
→ pitch_accuracy
→ consistency
```

Esto evita que todos los ejercicios se midan igual.

---

### 28.12 Relación con la taxonomía

Cada ejercicio debe enlazarse con:

- técnica principal
- errores que corrige
- documentos relacionados
- nivel
- riesgos

Ejemplo:

```text
Ejercicio: clean_onset_drill
→ técnica: clean_onset
→ corrige: flat_entry, delayed_onset
→ docs: flat_entry.md, onset_control.md
```

---

### 28.13 Reglas de selección

El selector de ejercicios debe aplicar reglas como:

- respetar el nivel del usuario
- respetar prerequisitos
- evitar ejercicios redundantes consecutivos
- no usar ejercicios con riesgo alto si hay fatiga
- alternar foco correctivo y consolidación

Esto es clave para que el sistema no se vuelva repetitivo o agresivo.

---

### 28.14 Reglas de progresión

Las reglas de progresión deben vivir en el motor, no dispersas por la app.

Ejemplos:

```text
si score alto + consistencia alta durante 3 ejecuciones
→ siguiente variante

si score medio pero mejorando
→ mantener misma variante

si score bajo repetido
→ simplificar o cambiar familia
```

---

### 28.15 Reglas de regresión

Cuando un ejercicio no funciona, no siempre hay que repetirlo igual.

Posibles respuestas:

- bajar duración
- bajar precisión requerida
- reducir rango
- cambiar a una variante puente
- cambiar a un ejercicio preparatorio

Esto evita frustración y mejora adherencia.

---

### 28.16 Ejercicios puente

VOZAZI debe tener ejercicios que no son el objetivo final, pero preparan al usuario.

Ejemplo:

```text
Problema: unstable_pitch

Objetivo final: sustain_note_precision

Ejercicio puente: breath_reset + sustain_note_basic
```

Esto es especialmente importante en principiantes.

---

### 28.17 Arquitectura de datos del catálogo

Tablas futuras o complementarias recomendadas:

```text
exercise_catalog
exercise_variants
exercise_rules
exercise_prerequisites
exercise_metric_weights
exercise_doc_links
```

Campos conceptuales en `exercise_catalog`:

```text
id
exercise_code
title
primary_technique
secondary_techniques_jsonb
exercise_family
level_min
level_max
status
created_at
updated_at
```

Campos conceptuales en `exercise_variants`:

```text
id
exercise_catalog_id
variant_code
difficulty_level
config_jsonb
success_criteria_jsonb
regression_rules_jsonb
progression_rules_jsonb
created_at
updated_at
```

---

### 28.18 UX del ejercicio

El usuario no debe ver complejidad interna.
Debe ver una instrucción clara.

Ejemplo UX:

```text
Ejercicio: Nota sostenida básica
Objetivo: mantener estabilidad
Duración: 5 min
Meta: sostener 3 notas con desviación menor de 15 cents
```

Y durante la práctica:

- qué hacer ahora
- cuánto falta
- si lo está haciendo bien
- qué corregir

---

### 28.19 Relación con el dataset

Cada ejecución de ejercicio genera una unidad de dataset mucho más valiosa si está bien etiquetada.

Ejemplo:

```json
{
  "exercise_code": "clean_onset_drill",
  "variant_code": "clean_onset_drill_l2_v1",
  "primary_technique": "clean_onset",
  "error_targeted": ["flat_entry", "delayed_onset"],
  "metrics": {
    "onset_timing": 0.66,
    "pitch_accuracy": 0.81
  },
  "result": {
    "score": 74,
    "adaptive_outcome": "maintain"
  }
}
```

Esto convierte el catálogo de ejercicios en una capa muy útil para entrenamiento futuro de modelos.

---

### 28.20 Principio final del Exercise Engine

```text
Un gran vocal coach no solo sabe analizar la voz.
Sabe convertir cada debilidad en una práctica precisa y progresiva.
```

Eso es exactamente lo que debe hacer VOZAZI.

---

## 29. Arquitectura del sistema en tiempo real

El sistema en tiempo real de VOZAZI es una de las capas más delicadas del producto.

Aquí no basta con “analizar audio”.
Hay que equilibrar tres cosas a la vez:

- latencia muy baja
- feedback útil
- coste razonable

Si esta capa se diseña mal, pasan dos cosas:

- el producto se siente lento o torpe
- el análisis profundo encarece demasiado la operación

---

### 29.1 Objetivo principal

```text
Dar feedback inmediato sin sacrificar el análisis serio posterior.
```

Esto obliga a una arquitectura **híbrida**.

---

### 29.2 Principio de diseño del tiempo real

```text
Lo inmediato debe ser ligero.
Lo profundo puede llegar por bloques o al cierre del ejercicio.
```

Esto significa que VOZAZI no debe intentar hacer en milisegundos todo el análisis premium.

Debe separar:

#### Real-time feedback
- nota detectada
- desviación en cents
- confirmación visual
- estabilidad básica
- progreso de repetición

#### Near-real-time / post-block analysis
- score completo
- debilidad dominante
- comparativa con histórico
- decisión adaptativa
- explicación pedagógica

---

### 29.3 Flujo técnico del tiempo real

```text
Micrófono del usuario
→ captura en navegador
→ preprocesado local ligero
→ visualización inmediata
→ chunking de audio
→ envío al audio-engine
→ realtime pipeline
→ feedback rápido
→ deep analysis pipeline
→ score y evaluación por bloque
→ backend de producto
→ actualización de sesión y progreso
```

---

### 29.4 Capas del sistema en tiempo real

#### 1. Capture Layer (cliente)
Responsable de:
- `getUserMedia`
- `MediaRecorder` o flujo PCM/Web Audio
- sincronización de estado de práctica

#### 2. Local Feedback Layer (cliente)
Responsable de:
- visualización instantánea
- indicador de nota actual
- barra de afinación
- estimaciones ligeras si procede

#### 3. Transport Layer
Responsable de:
- agrupar audio en chunks
- enviar por WebSocket o HTTP streaming
- tolerar microcortes

#### 4. Realtime Pipeline (audio-engine)
Responsable de:
- recibir chunks
- normalizar
- devolver feedback rápido

#### 5. Deep Analysis Pipeline (audio-engine)
Responsable de:
- análisis más caro
- métricas serias
- scoring por bloque o cierre

#### 6. Session Sync Layer (backend producto)
Responsable de:
- consolidar estado de la práctica
- guardar resultados
- desencadenar progreso y adaptación

---

### 29.5 Qué debe hacerse en cliente

El cliente debe encargarse de lo que mejora mucho la sensación de inmediatez y no compromete la calidad arquitectónica.

Se recomienda usar el cliente para:

- captura de audio
- visualización en tiempo real
- cronómetro de repetición
- feedback visual de bajo coste
- estado de la sesión

Opcionalmente puede hacer:

- preanálisis ligero
- detección local de pitch simple

Pero no debería asumir:

- scoring definitivo
- decisiones adaptativas
- evaluación técnica profunda

---

### 29.6 Qué debe hacerse en `audio-engine`

El `audio-engine` debe encargarse de:

- normalizar señal
- limpiar ruido cuando proceda
- detectar voz útil
- calcular pitch con fiabilidad
- derivar métricas relevantes
- producir score y clasificación

Esto permite mantener:

- coherencia entre usuarios
- control técnico del producto
- posibilidad de mejora futura del motor

---

### 29.7 Estrategia de chunking

VOZAZI debería procesar audio en bloques en vez de enviar una única grabación al final.

Beneficios:

- feedback más cercano al tiempo real
- menos riesgo de perder sesión completa
- análisis progresivo
- posibilidad de auto-guardado parcial

Tipos de chunk sugeridos:

#### Chunks cortos de feedback
- 200–500 ms
- para feedback rápido y visual

#### Chunks de análisis
- 1–3 s
- para métricas más útiles

#### Bloques de ejercicio
- unidad completa de repetición
- para score y evaluación seria

---

### 29.8 Transporte recomendado

#### WebSocket
Recomendado para:
- sesiones activas
- feedback rápido
- intercambio continuo de estado

#### HTTP / Route Handler
Recomendado para:
- cierre de sesión
- persistencia final
- recuperación de resultados

Arquitectura sugerida:

```text
cliente
→ WebSocket con audio-engine para realtime
→ HTTP con backend de producto para persistencia y reporting
```

---

### 29.9 Estados de una sesión en tiempo real

VOZAZI debe modelar claramente el estado de una práctica.

Estados sugeridos:

```text
idle
preparing
recording
processing_chunk
awaiting_feedback
segment_completed
session_completed
failed
abandoned
```

Esto simplifica mucho la UX y la trazabilidad.

---

### 29.10 Latencia objetivo

No todo requiere la misma latencia.

#### Feedback visual inmediato
Idealmente:

```text
< 100 ms percibidos
```

#### Feedback técnico rápido
Idealmente:

```text
< 300–500 ms
```

#### Score por bloque
Aceptable si llega en:

```text
1–3 s
```

#### Resumen post-ejercicio
Aceptable si llega en:

```text
2–5 s
```

Esto ayuda a no sobrediseñar donde no hace falta.

---

### 29.11 Auto-guardado y tolerancia a fallos

Si el usuario pierde conexión, cierra pestaña o limpia caché, VOZAZI no debería perder todo siempre.

Se recomienda:

- persistencia progresiva de chunks o metadatos
- `task_run` abierto mientras dura la práctica
- recuperación parcial si la sesión quedó a medias
- marcar sesión como `abandoned` o `failed` cuando corresponda

Esto protege valor longitudinal del producto.

---

### 29.12 Sincronización entre capas

El reto no es solo procesar audio, sino mantener sincronizados:

- cliente
- audio-engine
- backend de producto
- base de datos

Flujo recomendado:

```text
cliente abre sesión
→ backend crea session + task_run
→ cliente conecta con audio-engine
→ audio-engine devuelve feedback por chunks
→ backend consolida por segmento o cierre
→ session finalizada
→ progress + adaptive engine se actualizan
```

---

### 29.13 Modo híbrido recomendado

VOZAZI premium debería funcionar así:

#### Cliente
- UX
- cronómetro
- feedback instantáneo
- estado de práctica

#### Audio-engine realtime
- pitch rápido
- estabilidad básica
- validación de repetición

#### Audio-engine deep
- métricas avanzadas
- scoring
- debilidad dominante

#### Backend producto
- persistencia
- progreso
- agenda
- feedback pedagógico

Este reparto es el que mejor equilibra experiencia, coste y rigor.

---

### 29.14 Observabilidad específica del tiempo real

Conviene medir:

- latencia cliente → audio-engine
- tiempo de análisis por chunk
- tasa de errores de sesión
- sesiones abandonadas por problemas técnicos
- pérdida de paquetes o cortes
- tiempo medio hasta primer feedback

Esto es clave para mantener experiencia premium.

---

### 29.15 Riesgos del tiempo real

#### Riesgo 1
Intentar hacer análisis demasiado profundo en cada milisegundo.

Consecuencia:
- latencia alta
- coste alto
- mala UX

#### Riesgo 2
Delegar demasiado en cliente.

Consecuencia:
- inconsistencia entre dispositivos
- pérdida de control técnico

#### Riesgo 3
No separar feedback inmediato de evaluación seria.

Consecuencia:
- mezcla confusa
- decisiones adaptativas pobres

---

### 29.16 Principio final del tiempo real

```text
El tiempo real de VOZAZI no debe perseguir complejidad máxima por segundo.
Debe perseguir sensación inmediata + evaluación fiable.
```

Ese equilibrio es el nivel premium correcto.

---

## 30. Arquitectura de observabilidad, seguridad y resiliencia

Un producto premium no solo debe funcionar cuando todo va bien.
Debe ser **observable, seguro y resistente** cuando algo falla.

En VOZAZI esto es especialmente importante porque combina:

- audio en tiempo real
- persistencia longitudinal
- suscripciones
- documentación pedagógica
- decisiones adaptativas
- datos sensibles de voz

---

### 30.1 Objetivo principal

```text
Poder detectar, entender, contener y corregir problemas sin degradar la confianza del usuario.
```

---

## 30.2 Observabilidad

La observabilidad debe permitir responder preguntas como:

- ¿por qué una sesión fue lenta?
- ¿por qué se perdió un chunk?
- ¿por qué un score salió extraño?
- ¿por qué el usuario abandonó en cierto punto?
- ¿qué parte del sistema está fallando más?

La observabilidad no debe depender solo de logs genéricos.
Debe cubrir:

- producto
- audio-engine
- persistencia
- billing
- RAG / LLM
- jobs en segundo plano

---

### 30.3 Capas de observabilidad

#### 1. Product telemetry
Mide:
- eventos de uso
- funnels
- abandono
- activación
- retención

Herramienta principal:
- **PostHog**

#### 2. Application logging
Mide:
- errores
- warnings
- estados de sesión
- fallos de integración

Debe existir en:
- `apps/web`
- `apps/audio-engine`
- jobs

#### 3. Performance metrics
Mide:
- latencia por endpoint
- tiempo de análisis por chunk
- tiempo medio hasta feedback
- duración de jobs
- tiempos de consulta a DB

#### 4. Domain observability
Mide:
- distribución de scores
- ratios de abandono por ejercicio
- fatiga detectada
- decisiones adaptativas tomadas
- frecuencia de debilidades detectadas

Esto es observabilidad del producto, no solo de infraestructura.

---

### 30.4 Qué conviene loguear

Ejemplos de eventos técnicos importantes:

```text
session_created
session_ws_connected
audio_chunk_received
audio_chunk_failed
realtime_feedback_sent
deep_analysis_completed
evaluation_persisted
task_generated
pedagogical_feedback_generated
billing_webhook_processed
job_weekly_summary_sent
```

Cada log útil debería incluir contexto mínimo como:

- user_id o anonymous marker
- session_id
- task_id si aplica
- timestamp
- stage
- outcome
- error_code si existe

---

### 30.5 Métricas técnicas clave

VOZAZI debería monitorizar al menos:

#### Cliente
- tiempo hasta primer feedback
- tasa de error de acceso a micrófono
- desconexiones durante sesión
- sesiones abandonadas por fallo técnico

#### Backend de producto
- latencia de Server Actions
- errores de DB
- errores de auth
- fallos en webhooks de Stripe

#### Audio-engine
- tiempo medio de procesamiento por chunk
- tiempo medio de deep analysis
- tasa de chunks rechazados
- saturación de workers
- sesiones con latencia excesiva

#### Jobs
- éxito/fracaso de agendas
- éxito/fracaso de emails
- duración de snapshots

---

### 30.6 Alertas operativas recomendadas

Debe haber alertas para situaciones como:

- aumento anómalo de errores en sesiones
- caída del audio-engine
- tiempo de respuesta degradado
- fallos repetidos de Stripe webhooks
- fallos en guardado de audio en R2
- jobs críticos fallando
- crecimiento raro de sesiones `abandoned`

Las alertas deben priorizar:

- impacto en usuario
- impacto económico
- pérdida de datos

---

## 30.7 Seguridad

La seguridad en VOZAZI no es solo login.
Hay que proteger:

- identidad
- suscripción
- datos de voz
- storage de audio
- prompts y contexto pedagógico
- endpoints y jobs

---

### 30.8 Seguridad de acceso

Medidas recomendadas:

- Clerk para identidad y sesión
- autorización por usuario en cada acceso a sesión, tarea o audio
- separación clara entre rutas públicas y privadas
- verificación server-side del plan de suscripción

Principio:

```text
Nunca confiar en el cliente para autorizar acceso a datos vocales o premium.
```

---

### 30.9 Seguridad de almacenamiento

Los audios son especialmente sensibles.

Se recomienda:

- almacenar en R2 con claves no predecibles
- usar URLs firmadas o acceso mediado por backend
- no exponer claves de storage al cliente
- definir política de retención y borrado
- permitir eliminación de audios por parte del usuario

---

### 30.10 Seguridad de APIs y servicios

Medidas recomendadas:

- autenticación entre `web` y `audio-engine`
- rate limiting en endpoints críticos
- validación fuerte de payloads
- timeouts y retries controlados
- separación de secretos por entorno
- rotación de claves y revisión de permisos

---

### 30.11 Seguridad del LLM y RAG

Aunque el LLM no sea el núcleo acústico, sí puede generar problemas si no está bien controlado.

Se recomienda:

- construir prompts desde contexto estructurado
- no inyectar datos crudos sin filtrar
- limitar instrucciones del usuario cuando se mezclen con contexto sensible
- versionar prompts
- persistir versión de prompt y proveedor usado

También conviene:

- aplicar respuestas conservadoras en temas de riesgo vocal
- evitar consejos agresivos si hay señales de fatiga

---

### 30.12 Privacidad y gobernanza del dato

VOZAZI debe tener una postura clara respecto a los datos de voz.

Puntos mínimos:

- consentimiento explícito para guardar audios
- separación entre uso operativo y mejora de modelos
- derecho a borrado
- trazabilidad de qué se almacena
- política clara de retención

Esto no es solo legalidad.
También es confianza de producto.

---

## 30.13 Resiliencia

La resiliencia es la capacidad del sistema para seguir siendo útil incluso cuando partes fallan.

VOZAZI debe diseñarse con degradación controlada.

---

### 30.14 Estrategia de degradación

Si falla una capa, el producto no siempre debe romperse completo.

Ejemplos:

#### Si falla el audio-engine deep
El usuario aún podría recibir:
- feedback visual básico
- guardado de sesión parcial
- análisis pendiente diferido

#### Si falla el LLM
El usuario aún podría recibir:
- score estructurado
- explicación fallback basada en plantillas
- docs recomendadas sin generación libre

#### Si falla PostHog
El producto debe seguir funcionando sin bloquear la experiencia.

#### Si falla Resend
La agenda sigue existiendo aunque no salga el email.

---

### 30.15 Retry y tolerancia a fallos

Conviene implementar reintentos controlados para:

- subida de audio a R2
- webhooks de Stripe
- jobs de emails
- generación de snapshots
- persistencia de eventos no críticos

No todo debe reintentarse igual.

Prioridad alta:
- datos de sesión
- billing
- guardado de audio

Prioridad media:
- emails
- analítica
- notificaciones

---

### 30.16 Idempotencia

Algunas operaciones deben ser idempotentes para evitar duplicados peligrosos.

Ejemplos:

- procesar webhook de Stripe
- cerrar sesión
- generar snapshot semanal
- persistir `task_result`

Esto evita:

- cobros duplicados
- tareas dobles
- resúmenes inconsistentes

---

### 30.17 Recuperación ante fallos de sesión

Si el usuario pierde conexión o cierra el navegador durante una práctica:

VOZAZI debería intentar conservar:

- `session` iniciada
- `task_run` asociado
- chunks ya persistidos
- estado parcial de resultado

Estados útiles:

```text
in_progress
interrupted
abandoned
recoverable
completed
```

Esto permite análisis posterior y evita pérdida total de valor.

---

### 30.18 Health checks y readiness

El sistema debe exponer checks claros para:

- `web`
- `audio-engine`
- DB
- R2
- integraciones críticas

Tipos recomendados:

#### Liveness
¿el servicio está vivo?

#### Readiness
¿el servicio puede atender tráfico útil ahora mismo?

Especialmente importante en `audio-engine`.

---

### 30.19 Backpressure y control de carga

Como VOZAZI maneja audio en tiempo real, conviene pensar en saturación.

El sistema debe poder:

- limitar sesiones simultáneas si una capa se degrada
- encolar deep analysis cuando haga falta
- priorizar feedback básico sobre análisis avanzado si hay estrés
- proteger DB y audio-engine frente a picos

---

### 30.20 Principios operativos premium

#### Principio 1
No romper todo si falla una parte.

#### Principio 2
Persistir primero lo importante.

#### Principio 3
El usuario debe perder la menor cantidad de trabajo posible.

#### Principio 4
Los fallos deben dejar rastro observable.

#### Principio 5
La seguridad de audio, suscripción y progreso es prioritaria.

---

### 30.21 Resumen ejecutivo de esta capa

```text
Observabilidad → saber qué pasa
Seguridad → proteger acceso y datos
Resiliencia → seguir siendo útil cuando algo falla
```

En un producto premium, estas tres cosas no son extras.
Son parte del producto.

---

## 31. Onboarding y perfilado vocal inicial

La UX de VOZAZI será compleja si el sistema intenta mostrar toda su inteligencia demasiado pronto.

Por eso el onboarding no debe sentirse como un formulario técnico ni como una prueba intimidante.
Debe comportarse como una **entrada progresiva al sistema**, donde el producto empieza a conocer la voz del usuario sin abrumarlo.

---

### 31.1 Objetivo principal

```text
Capturar suficiente información para personalizar bien,
sin introducir fricción excesiva ni ansiedad de rendimiento.
```

El onboarding debe resolver cuatro cosas:

- quién es el usuario
- qué busca mejorar
- qué nivel aproximado tiene
- cómo suena y responde su voz en una primera calibración

---

### 31.2 Principio UX del onboarding

```text
Primero confianza.
Luego claridad.
Después personalización.
Nunca intimidación técnica.
```

VOZAZI no debe parecer un examen clínico al primer minuto.
Debe parecer un coach que acompaña.

---

### 31.3 Qué debe recoger el onboarding

#### 1. Contexto del usuario
- experiencia cantando
- objetivo principal
- tiempo disponible por día o semana
- preferencias de práctica
- idioma

#### 2. Contexto vocal declarado
- tesitura percibida si la conoce
- estilos que canta
- problemas que siente
- sensación de fatiga o tensión habitual

#### 3. Señales observadas por el sistema
- rango vocal inicial aproximado
- estabilidad básica
- precisión inicial
- control de nota sostenida
- tolerancia a tareas básicas

#### 4. Configuración de producto
- consentimiento de audio
- notificaciones
- agenda preferida
- frecuencia de recordatorios

---

### 31.4 Flujo recomendado de onboarding

#### Paso 1 — Bienvenida y promesa clara
Objetivo:
- explicar qué hará VOZAZI
- reducir ansiedad
- pedir permiso de micrófono con contexto

El usuario debe entender:

```text
No se le va a juzgar.
Se va a calibrar su punto de partida.
```

---

#### Paso 2 — Objetivo principal
Preguntas sencillas como:

- quiero afinar mejor
- quiero ganar estabilidad
- quiero mejorar respiración
- quiero sentir más control
- quiero entrenar mi voz de forma guiada

Esto alimenta:
- `users`
- `vocal_profiles`
- primeras reglas del adaptive engine

---

#### Paso 3 — Nivel autopercibido
Opciones simples:

- nunca entrené en serio
- canto de forma amateur
- ya entrené algo
- tengo experiencia sólida

No conviene usar demasiada jerga aquí.

---

#### Paso 4 — Tiempo disponible
Ejemplo:

- 5 min
- 10 min
- 15 min
- 20+ min

Esto es clave para la agenda.

---

#### Paso 5 — Calibración vocal inicial
Aquí empieza el verdadero perfilado.

La calibración inicial debería ser corta y segura.

Secuencia sugerida:

1. prueba de nota cómoda
2. nota sostenida básica
3. una o dos repeticiones de afinación guiada
4. cierre positivo con primer resultado simple

No conviene meter demasiados ejercicios aquí.

---

### 31.5 Diseño de la calibración inicial

La calibración debe priorizar:

- simplicidad
- baja fatiga
- buena señal para el sistema
- sensación de logro rápido

Ejercicios recomendados:

#### Ejercicio A — Nota cómoda libre
Sirve para:
- detectar rango aproximado inicial
- ver respuesta básica del sistema

#### Ejercicio B — Nota sostenida breve
Sirve para:
- medir estabilidad
- duración sostenida
- apoyo básico

#### Ejercicio C — Seguir nota objetivo sencilla
Sirve para:
- medir pitch accuracy inicial
- entender si el usuario responde bien a una referencia

---

### 31.6 Qué no debe hacer el onboarding

No debería:

- mostrar demasiadas métricas de golpe
- diagnosticar problemas complejos al inicio
- sugerir riesgo o fatiga con lenguaje alarmista salvo que sea muy necesario
- exigir una sesión larga antes de aportar valor
- bloquear al usuario con demasiadas preguntas

---

### 31.7 Qué debe producir el onboarding

Al terminar, el sistema debería poder generar:

#### 1. Perfil inicial del usuario
Ejemplo:

```json
{
  "estimated_level": 1,
  "initial_focus": "pitch_stability",
  "strong_signal": "pitch_accuracy",
  "practice_window": 10,
  "initial_range": {
    "low": "C3",
    "high": "G4"
  }
}
```

#### 2. Primera agenda breve
Ejemplo:

```text
Hoy:
- 4 min estabilidad
- 3 min afinación guiada
- 2 min nota sostenida
```

#### 3. Mensaje pedagógico inicial
Ejemplo:

```text
Tu voz ya responde bien a la referencia de nota.
Vamos a trabajar primero la estabilidad para que sientas más control desde el principio.
```

---

### 31.8 Tabla o entidad recomendada: `onboarding_profiles`

Aunque parte del estado puede vivir en `users` y `vocal_profiles`, conviene tener una entidad específica para el onboarding inicial.

Campos sugeridos:

```text
id
user_id
experience_self_rating
main_goal
time_available_minutes
styles_jsonb
reported_issues_jsonb
mic_permission_granted
audio_consent_granted
initial_assessment_completed
initial_focus
created_at
updated_at
```

Esto ayuda a diferenciar:
- lo declarado por el usuario
- lo medido por el sistema

---

### 31.9 Relación con el perfil vocal

El onboarding no debe fijar el perfil como verdad definitiva.
Debe crear una hipótesis inicial.

Principio:

```text
El primer perfil es provisional.
El perfil real se afina con el uso.
```

Por eso:
- `onboarding_profiles` captura hipótesis inicial
- `vocal_profiles` evoluciona con sesiones reales

---

### 31.10 Relación con la UX global

Aquí está una de las claves que has señalado bien:

**lo complicado no es solo la arquitectura, es la UX de tanta inteligencia sin generar ruido.**

La solución no es mostrarlo todo.
La solución es usar una UX por capas.

#### Capa 1 — UX visible al usuario
Debe mostrar:
- una sola meta principal
- un solo siguiente paso claro
- feedback corto y útil
- progreso muy fácil de leer

#### Capa 2 — UX contextual
Debe aparecer solo cuando haga falta:
- explicación del error
- doc relacionada
- sugerencia de descanso
- mejora observada

#### Capa 3 — Complejidad interna invisible
Debe quedar oculta:
- scoring completo
- taxonomía
- reglas adaptativas internas
- decisiones de engine

Esto evita saturación cognitiva.

---

### 31.11 Principios UX para un sistema complejo

#### Principio 1
Una pantalla, una intención principal.

#### Principio 2
Un ejercicio, una meta clara.

#### Principio 3
Un reporte, dos o tres aprendizajes máximos.

#### Principio 4
La inteligencia del sistema debe sentirse como claridad, no como complejidad.

#### Principio 5
El usuario no debe estudiar la app para usarla.
La app debe estudiar al usuario para ayudarle.

---

### 31.12 Arquitectura UX por estados del usuario

VOZAZI debería cambiar su UX según madurez del usuario.

#### Estado 1 — Descubrimiento
- onboarding corto
- ejercicios muy guiados
- métricas mínimas
- refuerzo positivo

#### Estado 2 — Consolidación
- aparece historial
- aparece foco técnico
- aparece biblioteca contextual

#### Estado 3 — Profundización
- más comparativas
- más control sobre práctica
- más contexto técnico
- exploración de técnica y anatomía

Esto evita mostrar demasiado demasiado pronto.

---

### 31.13 Primer loop ideal tras onboarding

El onboarding solo tiene éxito si desemboca inmediatamente en el loop central del producto.

```text
onboarding
→ calibración
→ perfil inicial
→ primera tarea
→ primer score
→ primera mejora visible
```

Ese es el momento donde VOZAZI demuestra valor.

---

### 31.14 Principio final del onboarding

```text
El onboarding de VOZAZI no debe explicar toda la complejidad del sistema.
Debe convertir complejidad interna en una primera experiencia clara y segura.
```

---

## 32. Idea fuerza final

```text
VOZAZI no es una app que escucha.
VOZAZI es un sistema arquitectónico que escucha, mide, evalúa, aprende, documenta, adapta y enseña.
```

