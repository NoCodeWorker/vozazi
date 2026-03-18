# VOZAZI — Documento de Contexto

> Contexto completo del proyecto VOZAZI: visión, problema, solución, arquitectura y decisiones de diseño.

---

## 1. Visión del Producto

### 1.1 ¿Qué es VOZAZI?

VOZAZI es un **vocal coach digital premium** que combina tecnología acústica avanzada con pedagogía vocal estructurada para ofrecer una experiencia de entrenamiento vocal personalizada, medible y adaptable.

### 1.2 Propósito Fundamental

```
No construir un afinador con chat.
Construir un sistema que escucha, mide, aprende, adapta, documenta y enseña.
```

### 1.3 Diferenciación Clave

VOZAZI no es solo una app que analiza audio. Es un **sistema arquitectónico completo** que:

- **Escucha** la voz del usuario con precisión técnica
- **Mide** métricas acústicas relevantes
- **Evalúa** el rendimiento mediante scoring estructurado
- **Aprende** del progreso y patrones del usuario
- **Documenta** la evolución vocal longitudinal
- **Adapta** el entrenamiento en tiempo real
- **Enseña** con base en conocimiento pedagógico validado

---

## 2. Problema que Resuelve

### 2.1 Problema Principal

Los cantantes y estudiantes de voz carecen de:
- **Feedback objetivo e inmediato** sobre su técnica vocal
- **Seguimiento estructurado** de su progreso a lo largo del tiempo
- **Guía personalizada** sobre qué practicar y cómo mejorar
- **Acceso a conocimiento pedagógico** contextualizado a sus problemas específicos

### 2.2 Soluciones Actuales y sus Limitaciones

#### Afinadores Tradicionales
- ❌ Solo muestran nota y afinación
- ❌ No explican por qué estás desafinado
- ❌ No proponen ejercicios correctivos
- ❌ No guardan progreso ni evolución

#### Apps de Karaoke
- ❌ Enfocadas en entretenimiento, no en técnica
- ❌ Scoring superficial y no pedagógico
- ❌ Sin análisis acústico profundo
- ❌ Sin adaptación al nivel del usuario

#### Profesores de Canto Presenciales
- ✅ Feedback experto y personalizado
- ❌ Costo elevado
- ❌ Disponibilidad limitada
- ❌ Sin registro objetivo de progreso entre sesiones

#### Apps de Entrenamiento Vocal Existentes
- ❌ Análisis acústico superficial
- ❌ Pedagogía genérica, no contextualizada
- ❌ Sin adaptación real al progreso del usuario
- ❌ Sin memoria longitudinal del aprendizaje

### 2.3 Oportunidad de VOZAZI

VOZAZI ocupa el espacio entre:
- **Precisión técnica** de un análisis acústico profesional
- **Pedagogía estructurada** de un profesor experto
- **Accesibilidad** de una app digital
- **Personalización** de un coach dedicado

---

## 3. Solución VOZAZI

### 3.1 Propuesta de Valor

```
VOZAZI = Cliente premium + Backend de producto + Motor acústico + Base de datos rica + Knowledge base + LLM pedagógico + Adaptive engine
```

### 3.2 Características Principales

#### Captura y Análisis
- Captura de voz desde micrófono con baja latencia
- Análisis acústico profundo (pitch, estabilidad, vibrato, onset, etc.)
- Feedback visual inmediato durante la práctica

#### Progreso y Memoria
- Almacenamiento de sesiones, métricas y evolución
- Snapshots semanales y mensuales de progreso
- Comparativas históricas y tendencias

#### Adaptación Inteligente
- Detección de debilidad dominante
- Generación de agenda dinámica adaptativa
- Ajuste de dificultad basado en rendimiento

#### Pedagogía Contextualizada
- Explicación de errores en lenguaje humano
- Recomendación de ejercicios correctivos
- Enlaces a documentación pedagógica relevante
- Feedback generado por LLM con grounding real

### 3.3 Loop Central del Producto

```
Práctica → Medición → Score → Evaluación → Tarea siguiente → Progreso
```

Este loop es el **corazón de VOZAZI** y debe funcionar de manera fluida y continua.

---

## 4. Arquitectura del Sistema

### 4.1 Principios Arquitectónicos

#### 4.1.1 Separación de Capas
No mezclar en un mismo módulo:
- Interfaz
- Lógica de producto
- Análisis acústico
- Pedagogía
- Conocimiento documental

#### 4.1.2 Híbrido Cliente + Servidor
- **Cliente**: feedback inmediato y experiencia
- **Servidor**: progreso, lógica de negocio y persistencia
- **Plataforma acústica**: análisis defendible

#### 4.1.3 Real-time Híbrido
- **Real-time light feedback**: nota, cents, estabilidad básica (durante ejercicio)
- **Deep post-processing**: scoring, vibrato, onset, consistencia (por bloques o al cerrar)

#### 4.1.4 LLM como Intérprete, no como Analista
El LLM debe:
- ✅ Interpretar resultados
- ✅ Enseñar
- ✅ Contextualizar
- ✅ Guiar ejercicios

El LLM NO debe:
- ❌ Inventar métricas
- ❌ Simular análisis acústico
- ❌ Sustituir el motor vocal

#### 4.1.5 Memoria Estructurada
El sistema debe persistir:
- Audio
- Métricas
- Resultados
- Evolución
- Tareas
- Decisiones adaptativas
- Feedback pedagógico

### 4.2 Componentes Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE WEB                               │
│         Next.js + TypeScript + Tailwind + shadcn/ui             │
│                                                                  │
│  - Dashboard                                                      │
│  - Sesión de práctica                                            │
│  - Historial                                                      │
│  - Biblioteca vocal                                              │
│  - Cuenta y suscripción                                          │
│                                                                  │
│  Capacidades locales:                                            │
│  - getUserMedia                                                   │
│  - MediaRecorder                                                  │
│  - Feedback inmediato                                            │
│  - Preanálisis ligero                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APP BACKEND / BFF                             │
│              Next.js Server Actions + Route Handlers             │
│                                                                  │
│  - Autenticación contextual                                      │
│  - Autorización                                                   │
│  - Orquestación de producto                                      │
│  - Billing                                                        │
│  - Agregación de datos                                           │
│  - Gateway hacia servicios especializados                        │
└───────┬──────────────────────┬──────────────────────┬───────────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│     Clerk     │     │    Stripe     │     │   PostHog     │
│ auth / users  │     │ billing / subs│     │ product events│
└───────────────┘     └───────────────┘     └───────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CORE PRODUCT SERVICES                          │
│                                                                  │
│  1. Session Orchestrator                                         │
│  2. Progress Service                                             │
│  3. Adaptive Training Service                                    │
│  4. Knowledge Service                                            │
│  5. Pedagogical Orchestrator                                     │
└───────┬─────────────────────┬──────────────────────┬────────────┘
        │                     │                      │
        ▼                     ▼                      ▼
┌─────────────────┐  ┌─────────────────┐   ┌─────────────────┐
│   PostgreSQL    │  │ Documentation/  │   │   Background    │
│   Core          │  │ RAG             │   │   Jobs          │
│                 │  │                 │   │                 │
│ - users         │  │ - markdown docs │   │ - agendas       │
│ - vocal_profiles│  │ - indexación    │   │ - emails        │
│ - sessions      │  │ - embeddings    │   │ - resúmenes     │
│ - metrics       │  │ - retrieval     │   │ - mantenimiento │
│ - tasks         │  └─────────────────┘   └─────────────────┘
│ - progress      │
│ - subscriptions │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SPECIALIZED AUDIO PLATFORM                      │
│             Python + FastAPI + WebSockets + Workers              │
│                                                                  │
│  A. Audio Ingestion                                              │
│  B. Realtime Analysis Pipeline                                   │
│  C. Deep Acoustic Analysis Pipeline                              │
│  D. Evaluation Engine                                            │
│  E. Audio Asset Processor                                        │
└───────┬─────────────────────────┬───────────────────────────────┘
        │                         │
        ▼                         ▼
┌──────────────────┐     ┌──────────────────┐
│  Cloudflare R2   │     │  Model Layer     │
│                  │     │                  │
│ - raw audio      │     │ - acoustic models│
│ - processed audio│     │ - classifiers    │
│ - exports        │     │ - future tuning  │
└──────────────────┘     └──────────────────┘
        │
        ▼
┌──────────────────┐
│  Pedagogical LLM │
│                  │
│ - explanations   │
│ - exercise plans │
│ - contextual help│
└──────────────────┘
```

### 4.3 Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Cliente** | Next.js, TypeScript, Tailwind CSS, shadcn/ui, Web Audio API |
| **Backend Producto** | Next.js Server Actions, Route Handlers, Drizzle ORM, Vercel |
| **Base de Datos** | PostgreSQL (con jsonb para métricas) |
| **Plataforma Acústica** | Python, FastAPI, WebSockets, torchcrepe, librosa, Essentia, RNNoise, Silero VAD |
| **Storage** | Cloudflare R2 |
| **Auth** | Clerk |
| **Billing** | Stripe |
| **Email** | Resend |
| **Analytics** | PostHog |
| **Pedagogía** | LLM (OpenAI/Anthropic), RAG, Markdown docs |

---

## 5. Decisiones de Diseño Clave

### 5.1 ¿Por qué Next.js para el frontend y BFF?

**Decisión:** Usar Next.js tanto para el cliente como para el backend de producto (BFF).

**Razones:**
- Unifica stack de TypeScript
- Server Actions simplifican lógica server-side
- Route Handlers reemplazan necesidad de API separada
- Vercel ofrece deployment optimizado
- Server Components reducen carga en cliente

**Trade-offs:**
- ✅ Menos complejidad de infraestructura
- ✅ Mejor SEO (si aplica)
- ⚠️ Cold starts en Server Functions
- ⚠️ Límites de tiempo de ejecución

### 5.2 ¿Por qué Python para el Audio Engine?

**Decisión:** Servicio especializado en Python/FastAPI separado del backend de producto.

**Razones:**
- Ecosistema maduro de procesamiento de audio (librosa, torchcrepe, Essentia)
- PyTorch para modelos de ML
- FastAPI ofrece alto rendimiento
- Separación clara de responsabilidades

**Trade-offs:**
- ✅ Mejor tooling para audio/ML
- ✅ Independencia de escalado
- ⚠️ Complejidad de comunicación entre servicios
- ⚠️ Necesidad de orquestación adicional

### 5.3 ¿Por qué PostgreSQL como base de datos principal?

**Decisión:** PostgreSQL como única base de datos relacional principal.

**Razones:**
- JSONB permite flexibilidad para métricas
- Extensiones como pgvector para RAG
- Maduro y confiable para datos de producto
- Drizzle ORM ofrece buena DX

**Trade-offs:**
- ✅ Todo en un lugar (menos complejidad)
- ✅ ACID compliance
- ⚠️ Escalabilidad vertical (mitigable con servicios gestionados)

### 5.4 ¿Por qué Cloudflare R2 para storage?

**Decisión:** R2 en lugar de S3 u otras opciones.

**Razones:**
- Sin costos de egress (importante para audio)
- Compatible con API de S3
- Buen rendimiento
- Precios predecibles

**Trade-offs:**
- ✅ Costos más bajos para mucho tráfico
- ✅ Simple de integrar
- ⚠️ Menos maduro que S3 (pero suficiente para este caso)

### 5.5 ¿Por qué Clerk para autenticación?

**Decisión:** Clerk en lugar de construir auth propio o usar Auth0.

**Razones:**
- Integración excelente con Next.js
- Maneja OAuth, MFA, sesiones
- Menos superficie de seguridad propia
- Buena DX

**Trade-offs:**
- ✅ Rápido de implementar
- ✅ Seguro por diseño
- ⚠️ Vendor lock-in (pero aceptable para auth)

### 5.6 ¿Por qué Stripe para billing?

**Decisión:** Stripe como procesador de pagos y suscripciones.

**Razones:**
- Estándar de la industria
- Manejo completo de suscripciones
- Portal de cliente incluido
- Webhooks robustos

**Trade-offs:**
- ✅ Completo y confiable
- ✅ Menos complejidad legal/compliance
- ⚠️ Fees (pero estándar de industria)

### 5.7 ¿Por qué arquitectura híbrida de tiempo real?

**Decisión:** Feedback inmediato en cliente + análisis profundo en servidor.

**Razones:**
- Feedback visual debe ser <100ms (solo posible en cliente)
- Análisis profundo requiere más tiempo y recursos
- Separación permite optimizar cada capa independientemente

**Trade-offs:**
- ✅ Mejor UX (feedback inmediato)
- ✅ Análisis más preciso (sin límites de cliente)
- ⚠️ Complejidad de sincronización

### 5.8 ¿Por qué LLM desacoplado para pedagogía?

**Decisión:** LLM como capa separada que interpreta, no que analiza.

**Razones:**
- LLMs son buenos explicando, no midiendo
- Separación permite mejorar motor acústico sin tocar LLM
- Grounding en documentación real reduce alucinaciones

**Trade-offs:**
- ✅ Explicaciones naturales
- ✅ Control sobre métricas reales
- ⚠️ Costo por llamada (mitigable con caching)

---

## 6. Modelo de Datos

### 6.1 Entidades Principales

```
users
├── subscriptions
├── vocal_profiles
├── sessions
│   ├── session_segments
│   ├── session_metrics
│   ├── session_audio_assets
│   ├── evaluation_results
│   └── pedagogical_feedback
├── tasks
│   ├── task_runs
│   └── task_results
└── progress_snapshots

knowledge_documents
└── knowledge_chunks
```

### 6.2 Principios de Modelado

#### 6.2.1 Trazabilidad Completa
Cada sesión debe ser trazable desde inicio hasta feedback pedagógico.

#### 6.2.2 Separación de Métricas y Evaluación
- `session_metrics`: datos acústicos crudos
- `evaluation_results`: interpretación del scoring

#### 6.2.3 Tareas vs Ejecuciones
- `tasks`: lo planificado
- `task_runs`: intentos de ejecución
- `task_results`: resultado consolidado

#### 6.2.4 Snapshots para Rendimiento
`progress_snapshots` acelera consultas de dashboard y reporting.

#### 6.2.5 Flexibilidad con JSONB
Usar JSONB para:
- Métricas extensibles
- Criterios de éxito
- Payloads pedagógicos
- Metadatos de eventos

---

## 7. Taxonomía Vocal

### 7.1 Dimensiones Técnicas Principales

```
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

### 7.2 Técnicas Entrenables

```
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

### 7.3 Tipos de Errores

```
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

### 7.4 Tipos de Ejercicios

```
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

### 7.5 Sistema de Scoring

```
Score total =
  40% * pitch_accuracy +
  20% * pitch_stability +
  15% * onset_control +
  15% * breath_support +
  10% * consistency
```

**Reglas de progresión:**
- score >= 85 → subir dificultad
- score 60-85 → mantener nivel
- score < 60 → repetir con corrección

---

## 8. Estrategia de Datos como Activo

### 8.1 VOZAZI como Máquina de Dataset

VOZAZI debe diseñarse para generar un **dataset vocal estructurado** único:

```
Audio + Contexto + Métricas + Decisiones + Evolución
```

### 8.2 Qué Guardar por Sesión

1. **Audio bruto** - archivo original
2. **Audio procesado** - versión limpiada
3. **Contexto del ejercicio** - tipo, dificultad, objetivo
4. **Métricas acústicas** - pitch, stability, vibrato, etc.
5. **Resultado pedagógico** - debilidad, feedback, recomendación
6. **Contexto temporal** - fecha, hora, posición
7. **Señales de comportamiento** - completado, repetido, abandonado

### 8.3 Valor del Dataset Longitudinal

La gran ventaja competitiva es observar **la evolución de una misma voz en el tiempo**:

- Curvas de mejora
- Detección de estancamiento
- Perfiles de aprendizaje
- Sensibilidad a ejercicios
- Respuesta a cambios de dificultad

### 8.4 Uso Futuro del Dataset

El dataset estructurado permite:
- Mejorar scoring con datos reales
- Entrenar clasificadores de errores vocales
- Detectar patrones de fatiga
- Mejorar recomendación de ejercicios
- Construir barrera tecnológica

---

## 9. Roadmap de Implementación

### Fase 0 — Fundaciones
- Monorepo y repositorios
- Servicios externos configurados
- Base de datos y ORM

### Fase 1 — Vertical Slice (Sprints 1-3)
- App shell con navegación
- Auth con Clerk
- Práctica básica con getUserMedia
- Persistencia mínima de sesiones

### Fase 2 — Motor Acústico (Sprints 4-6)
- FastAPI levantado
- Pipeline inicial con torchcrepe
- Primer scoring técnico

### Fase 3 — Progreso (Sprints 7-9)
- Historial visual
- Progress Service
- Snapshots semanales/mensuales

### Fase 4 — Adaptive Engine v1 (Sprints 10-12)
- Taxonomía aplicada
- Generación de tareas
- Agenda diaria básica

### Fase 5 — Knowledge Service (Sprints 13-15)
- Biblioteca básica
- Parser de Markdown
- Chunking inicial

### Fase 6 — Pedagogical LLM (Sprints 16-18)
- Context builder
- Integración LLM
- Feedback post-sesión

### Fase 7 — Premium Real (Sprints 19-21)
- Métricas avanzadas
- UX premium refinada
- Seguridad y salud vocal

### Fase 8 — Escalabilidad (Sprints 22-24)
- Observabilidad seria
- Optimización de latencia
- Hardening del sistema

---

## 10. Riesgos Técnicos

### 10.1 Riesgos Identificados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Latencia excesiva | Alto | Separar feedback light de análisis deep |
| Mala calidad de audio | Alto | Validar formato, normalizar, usar RNNoise |
| Scoring mal calibrado | Alto | Iterar con datos reales, feedback de usuarios |
| Dependencia excesiva de LLM | Medio | Grounding en docs, fallback a plantillas |
| Acoplamiento producto/audio | Medio | Contratos claros entre servicios |
| Documentación pobre | Medio | Proceso editorial, revisión pedagógica |

### 10.2 Estrategias de Mitigación

- **Iteración rápida**: Construir, medir, aprender
- **Observabilidad**: Logs, métricas, alertas desde el inicio
- **Degradación graceful**: El sistema debe funcionar aunque fallen partes
- **Testing con usuarios reales**: Validar suposiciones temprano

---

## 11. Métricas de Éxito del Producto

### 11.1 Métricas de Activación
- % de usuarios que completan onboarding
- % de usuarios que completan primera sesión
- Tiempo hasta primera sesión completada

### 11.2 Métricas de Engagement
- Sesiones por usuario por semana
- Duración promedio de sesión
- Retención a 7, 30, 90 días

### 11.3 Métricas de Progreso
- % de usuarios con mejora en score
- Tiempo hasta primera mejora significativa
- Tasa de completitud de tareas

### 11.4 Métricas de Conversión
- % de usuarios que inician trial
- % de conversión a suscripción paga
- Churn rate mensual

### 11.5 Métricas Técnicas
- Latencia promedio de feedback
- Tasa de errores de sesión
- Uptime del audio-engine

---

## 12. Principios de Diseño de UX

### 12.1 Principios Fundamentales

```
1. Una pantalla, una intención principal
2. Un ejercicio, una meta clara
3. Un reporte, 2-3 aprendizajes máximos
4. La inteligencia debe sentirse como claridad, no complejidad
5. El usuario no debe estudiar la app para usarla
```

### 12.2 UX por Capas de Complejidad

#### Capa 1 — UX Visible (Usuario)
- Una sola meta principal
- Un solo siguiente paso claro
- Feedback corto y útil
- Progreso fácil de leer

#### Capa 2 — UX Contextual (Cuando hace falta)
- Explicación del error
- Doc relacionada
- Sugerencia de descanso
- Mejora observada

#### Capa 3 — Complejidad Interna (Oculta)
- Scoring completo
- Taxonomía
- Reglas adaptativas
- Decisiones de engine

### 12.3 Onboarding como Entrada Progresiva

El onboarding debe:
- ✅ Capturar información suficiente para personalizar
- ✅ Reducir ansiedad de rendimiento
- ✅ Generar primera victoria rápida
- ✅ Establecer confianza

No debe:
- ❌ Mostrar demasiadas métricas de golpe
- ❌ Diagnosticar problemas complejos al inicio
- ❌ Exigir sesión larga antes de aportar valor

---

## 13. Consideraciones de Privacidad y Seguridad

### 13.1 Privacidad de Datos de Voz

Los datos de voz son sensibles. VOZAZI debe:

- Consentimiento explícito para guardar audios
- Separación entre uso operativo y mejora de modelos
- Derecho a borrado claro y accesible
- Trazabilidad de qué se almacena
- Política clara de retención

### 13.2 Seguridad de Acceso

- Clerk para identidad y sesión
- Autorización por usuario en cada recurso
- Separación clara entre rutas públicas y privadas
- Verificación server-side del plan de suscripción

**Principio:** Nunca confiar en el cliente para autorizar acceso a datos vocales o premium.

### 13.3 Seguridad de Almacenamiento

- Almacenar en R2 con claves no predecibles
- URLs firmadas o acceso mediado por backend
- No exponer claves de storage al cliente
- Política de retención y borrado definida

---

## 14. Visión a Largo Plazo

### 14.1 Evolución del Producto

**Año 1:** Producto base funcional premium
- Loop central sólido
- Análisis acústico confiable
- Pedagogía básica

**Año 2:** Dataset y mejora de modelos
- Dataset vocal estructurado significativo
- Mejora de scoring con datos reales
- Clasificadores de errores entrenados

**Año 3:** IA pedagógica avanzada
- Modelos propios de recomendación
- Detección predictiva de abandono
- Personalización profunda

### 14.2 Barreras Competitivas

1. **Dataset vocal longitudinal** - Difícil de replicar
2. **Taxonomía y conocimiento estructurado** - Acumulativo
3. **Motor de scoring calibrado** - Mejora con datos
4. **Adaptive engine probado** - Mejora con uso
5. **Marca y comunidad** - Red effect

### 14.3 Idea Fuerza Final

```
VOZAZI no es una app que escucha.
VOZAZI es un sistema arquitectónico que escucha, mide, evalúa,
aprende, documenta, adapta y enseña.
```

---

*Documento generado a partir de "vozazi_arquitectura_tecnica_completa.md"*
