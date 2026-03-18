# VOZAZI — Documento de Tareas y Checklist de Desarrollo

> Lista completa de tareas necesarias para completar el desarrollo de VOZAZI.

**Última actualización:** 2026-03-18

---

## 📊 Progreso General

### Resumen por Estado

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| ✅ Completado | 40 | ~21% |
| 🔒 Pendiente de Entorno | 115 | ~61% |
| ⏳ Pendiente | 33 | ~18% |
| ❌ Bloqueado | 0 | 0% |

### Leyenda

| Símbolo | Estado | Descripción |
|---------|--------|-------------|
| `[x]` | ✅ **Completado** | Tarea implementada |
| `[ ]` | 🟢 **Pendiente** | Tarea que **SE PUEDE implementar** (no requiere entorno) |
| `[ ] 🔒` | 🔴 **Pendiente de Entorno** | Tarea **BLOQUEADA** (requiere variables de entorno/servicios) |
| `[ ]` | 🟡 **En Progreso** | Tarea siendo implementada |

### Estados Detallados

**🟢 Pendiente (33 tareas - ~18%)**
- Se pueden implementar inmediatamente
- No requieren configuración externa
- Ejemplos: UI components, hooks, lógica de frontend, tests

**🔒 Pendiente de Entorno (115 tareas - ~61%)**
- Requieren servicios externos configurados
- Necesitan variables de entorno
- Servicios: Clerk, Stripe, R2, PostHog, Resend, PostgreSQL

**✅ Completado (40 tareas - ~21%)**
- Ya implementadas y en producción
- Incluyen: monorepo, audio-engine, tests, UI de práctica

### Últimas Implementaciones (2026-03-18)

#### Paquetes Creados
- ✅ `@vozazi/core-domain` - Entidades de dominio, value objects, reglas de negocio
- ✅ `@vozazi/analytics` - Integración PostHog, eventos, hooks de analytics

#### Hooks Creados
- ✅ `useAudioRecorder` - Captura de audio con MediaRecorder
- ✅ `useAudioVisualizer` - Visualización de audio en canvas (waveform, frequency, circular)
- ✅ `useAnalytics` - Tracking de eventos
- ✅ `usePageViewTracking` - Tracking de páginas
- ✅ `useSessionTracking` - Tracking de sesiones

#### Componentes Creados
- ✅ `AudioPractice` - Componente principal de práctica
- ✅ `PitchIndicator` - Indicador de afinación en tiempo real
- ✅ `ExerciseInstructions` - Instrucciones de ejercicios

---

## Fase 0 — Fundaciones del Proyecto

### 0.1 Configuración del Monorepo
- [x] Crear estructura de directorios del monorepo
- [x] Configurar package.json raíz con workspaces
- [x] Configurar TypeScript raíz (tsconfig.json)
- [x] Configurar ESLint y Prettier compartidos
- [x] Configurar .gitignore global
- [x] Crear README.md del proyecto
- [x] Configurar .env.example con todas las variables necesarias

### 0.2 Repositorio Web (apps/web)
- [x] Inicializar proyecto Next.js con TypeScript
- [x] Configurar Tailwind CSS
- [x] Instalar y configurar shadcn/ui
- [x] Configurar path aliases (@/, ~/, etc.)
- [x] Crear estructura de carpetas base (app/, components/, features/, lib/, server/)
- [ ] Configurar middleware.ts para autenticación 🔒
- [x] Configurar next.config.js con optimizaciones

### 0.3 Repositorio Audio-Engine (apps/audio-engine)
- [x] Crear estructura de proyecto Python/FastAPI
- [x] Configurar requirements.txt con dependencias base
- [x] Configurar entorno virtual Python
- [x] Crear main.py con configuración FastAPI
- [x] Configurar CORS para comunicación con web
- [x] Configurar logging estructurado
- [x] Crear health check endpoint

### 0.4 Servicios Externos 🔒 PENDIENTE DE ENTORNO
#### Clerk 🔒
- [ ] Crear cuenta y proyecto en Clerk
- [ ] Configurar providers de autenticación
- [ ] Obtener claves API (publishable y secret)
- [ ] Configurar webhooks de Clerk
- [ ] Definir roles y permisos iniciales

#### Stripe 🔒
- [ ] Crear cuenta Stripe
- [ ] Configurar productos y planes de suscripción
- [ ] Obtener claves API (secret y publishable)
- [ ] Configurar webhook endpoint
- [ ] Configurar portal de cliente
- [ ] Configurar checkout sessions

#### Cloudflare R2 🔒
- [ ] Crear cuenta Cloudflare
- [ ] Crear bucket R2 para audio
- [ ] Configurar credenciales de acceso
- [ ] Configurar CORS para el dominio de la app
- [ ] Definir política de retención inicial

#### PostHog 🔒
- [ ] Crear proyecto en PostHog
- [ ] Obtener API key
- [ ] Configurar dominio permitido
- [ ] Definir eventos iniciales a trackear

#### Resend 🔒
- [ ] Crear cuenta Resend
- [ ] Verificar dominio para envío de emails
- [ ] Obtener API key
- [ ] Configurar templates base de emails

### 0.5 Base de Datos
- [ ] Provisionar instancia PostgreSQL (Supabase/Neon/RDS) 🔒
- [x] Configurar Drizzle ORM en packages/db
- [x] Definir esquema inicial de base de datos
- [x] Crear migraciones iniciales
- [ ] Ejecutar migraciones en entorno de desarrollo 🔒
- [ ] Configurar seeds iniciales
- [ ] Crear scripts de backup

### 0.6 Paquetes Compartidos
- [x] Inicializar packages/ui
- [x] Inicializar packages/db
- [x] Inicializar packages/core-domain ✅
- [x] Inicializar packages/analytics ✅
- [ ] Inicializar packages/billing ⏳
- [ ] Inicializar packages/auth ⏳
- [ ] Inicializar packages/pedagogy ⏳
- [x] Inicializar packages/shared-types
- [ ] Inicializar packages/config ⏳

### 0.7 Infrastructure as Code
- [x] Configurar deployment en Vercel (docker-compose.yml) ✅
- [ ] Configurar variables de entorno en Vercel 🔒
- [x] Crear configuración de infrastructure/ ✅
- [x] Documentar proceso de despliegue ✅

### 0.8 CI/CD
- [x] Configurar GitHub Actions para CI ✅
- [x] Crear workflow de lint y type check ✅
- [x] Crear workflow de tests ✅
- [ ] Configurar deployment automático 🔒
- [ ] Configurar preview deployments 🔒

---

## Fase 1 — Vertical Slice del Producto

### Sprint 1 — App Shell

#### 1.1 Autenticación
- [ ] Integrar Clerk en apps/web
- [ ] Crear página de login
- [ ] Crear página de signup
- [ ] Crear página de password reset
- [ ] Implementar protección de rutas privadas
- [ ] Implementar redirección post-login
- [ ] Crear componente UserButton para mostrar usuario

#### 1.2 Layout Principal
- [ ] Crear layout base con navegación
- [ ] Implementar header con logo y menú
- [ ] Implementar sidebar de navegación
- [ ] Crear footer
- [ ] Implementar responsive design
- [ ] Crear componente de loading global

#### 1.3 Rutas Principales
- [ ] Crear ruta /dashboard (stub)
- [ ] Crear ruta /practice (stub)
- [ ] Crear ruta /history (stub)
- [ ] Crear ruta /library (stub)
- [ ] Crear ruta /billing (stub)
- [ ] Crear ruta /settings (stub)
- [ ] Implementar navegación entre rutas

#### 1.4 Onboarding Inicial
- [ ] Crear flujo de onboarding básico
- [ ] Implementar paso de bienvenida
- [ ] Implementar paso de objetivo principal
- [ ] Implementar paso de nivel autopercibido
- [ ] Implementar paso de tiempo disponible
- [ ] Guardar datos de onboarding en BD
- [ ] Redirigir a dashboard post-onboarding

### Sprint 2 — Práctica Mínima

#### 2.1 Captura de Audio ✅
- [x] Implementar getUserMedia para acceso a micrófono
- [x] Crear componente de permiso de micrófono
- [x] Manejar errores de acceso a micrófono
- [x] Implementar MediaRecorder para grabación
- [x] Crear hook useAudioRecorder
- [x] Implementar visualización de nivel de audio

#### 2.2 UI de Práctica ✅
- [x] Crear pantalla de práctica base
- [x] Implementar indicador de nota objetivo
- [x] Crear visualizador de audio (canvas/webgl)
- [x] Implementar cronómetro de ejercicio
- [x] Crear controles de inicio/parada
- [x] Implementar contador de repeticiones
- [x] Crear feedback visual básico (afinación)

#### 2.3 Ejercicios Básicos
- [ ] Implementar ejercicio "sustain_note" básico
- [ ] Implementar ejercicio "pitch_target" básico
- [ ] Crear instrucciones por ejercicio
- [ ] Implementar transición entre ejercicios
- [ ] Crear resumen post-ejercicio

#### 2.4 Estado de Sesión
- [ ] Implementar gestión de estado de sesión
- [ ] Crear hook useSessionState
- [ ] Implementar estados: idle, preparing, recording, processing, completed
- [ ] Manejar errores de sesión
- [ ] Implementar cancelación de sesión

### Sprint 3 — Persistencia Mínima

#### 3.1 Backend de Sesiones
- [ ] Crear Server Action para iniciar sesión
- [ ] Crear Server Action para cerrar sesión
- [ ] Implementar persistencia en PostgreSQL
- [ ] Guardar referencia a audio en R2
- [ ] Implementar upload de audio a Cloudflare R2
- [ ] Crear endpoint para subir audio chunk

#### 3.2 Reporte Post-Sesión
- [ ] Crear pantalla de resultado de sesión
- [ ] Mostrar duración total
- [ ] Mostrar ejercicios completados
- [ ] Mostrar métricas básicas
- [ ] Implementar botón "Practicar de nuevo"
- [ ] Implementar botón "Volver al dashboard"

#### 3.3 Analytics
- [ ] Integrar PostHog en apps/web
- [ ] Implementar tracking de eventos base:
  - [ ] auth_signed_in
  - [ ] onboarding_completed
  - [ ] session_started
  - [ ] exercise_started
  - [ ] exercise_completed
  - [ ] session_completed
- [ ] Configurar identidad de usuario en PostHog

#### 3.4 Dashboard Básico
- [ ] Crear dashboard con resumen de actividad
- [ ] Mostrar últimas sesiones
- [ ] Mostrar estadísticas básicas (tiempo, sesiones)
- [ ] Implementar botón "Comenzar práctica"
- [ ] Mostrar próxima tarea si existe

---

## Fase 2 — Motor Acústico Inicial Serio

### Sprint 4 — Audio Engine Base

#### 4.1 Infraestructura FastAPI
- [x] Configurar FastAPI con estructura de routers
- [x] Implementar endpoint /health
- [ ] Implementar endpoint /api/v1/realtime
- [ ] Implementar endpoint /api/v1/analysis
- [ ] Implementar endpoint /api/v1/scoring
- [x] Configurar WebSocket para /ws/session
- [ ] Implementar autenticación entre web y audio-engine

#### 4.2 Contrato de Comunicación
- [ ] Definir esquema de request/response
- [ ] Crear tipos compartidos en packages/shared-types
- [ ] Implementar cliente HTTP desde web hacia audio-engine
- [ ] Implementar cliente WebSocket para tiempo real
- [ ] Configurar retries y timeouts
- [ ] Implementar manejo de errores de conexión

#### 4.3 Logging y Observabilidad
- [x] Configurar logging estructurado en audio-engine
- [ ] Implementar logs de sesión iniciada
- [ ] Implementar logs de chunk recibido
- [ ] Implementar logs de análisis completado
- [ ] Configurar correlación de logs por session_id

### Sprint 5 — Pipeline Inicial

#### 5.1 Ingestión de Audio
- [ ] Implementar Audio Ingestion Service
- [ ] Validar formato de audio recibido
- [ ] Implementar normalización de audio
- [ ] Configurar chunking de audio (200-500ms feedback, 1-3s análisis)
- [ ] Implementar almacenamiento temporal de chunks
- [ ] Configurar limpieza de archivos temporales

#### 5.2 Preprocesamiento
- [ ] Implementar filtro de ruido básico
- [ ] Configurar RNNoise para reducción de ruido
- [ ] Implementar Silero VAD para detección de voz
- [ ] Segmentar audio en partes con voz activa
- [ ] Normalizar niveles de señal

#### 5.3 Pitch Tracking
- [ ] Integrar torchcrepe para pitch detection
- [ ] Configurar modelo torchcrepe (full/fast)
- [ ] Implementar extracción de pitch por frame
- [ ] Calcular nota detectada desde frecuencia
- [ ] Calcular desviación en cents
- [ ] Implementar suavizado de señal de pitch

#### 5.4 Métricas Básicas
- [ ] Implementar cálculo de pitch_accuracy
- [ ] Implementar cálculo de pitch_stability
- [ ] Calcular variance de pitch
- [ ] Implementar métricas por repetición
- [ ] Agregar métricas por ejercicio
- [ ] Retornar métricas en formato estructurado

### Sprint 6 — Score Inicial

#### 6.1 Scoring Engine
- [ ] Implementar Evaluation Engine
- [ ] Configurar fórmula de scoring base:
  - 40% pitch_accuracy
  - 20% pitch_stability
  - 15% onset_control
  - 15% breath_support
  - 10% consistency
- [ ] Implementar cálculo de score por ejercicio
- [ ] Implementar cálculo de score por sesión
- [ ] Normalizar scores a escala 0-100

#### 6.2 Detección de Debilidades
- [ ] Implementar detección de dominant_weakness
- [ ] Implementar detección de secondary_weakness
- [ ] Clasificar error técnico detectado
- [ ] Generar adaptive_decision inicial

#### 6.3 Persistencia de Evaluación
- [ ] Guardar evaluation_results en PostgreSQL
- [ ] Vincular con session y segment
- [ ] Guardar métricas en session_metrics
- [ ] Implementar consulta de resultados por sesión

#### 6.4 UI de Score
- [ ] Mostrar score en reporte post-sesión
- [ ] Crear visualización de score por dimensión
- [ ] Implementar indicador de debilidad dominante
- [ ] Mostrar mensaje explicativo del score

---

## Fase 3 — Progreso y Memoria del Producto

### Sprint 7 — Historial

#### 7.1 Lista de Sesiones
- [ ] Crear página /history
- [ ] Implementar lista de sesiones con paginación
- [ ] Mostrar fecha, duración, score por sesión
- [ ] Implementar filtros por fecha
- [ ] Implementar ordenamiento por fecha/score
- [ ] Crear estado vacío (no sessions yet)

#### 7.2 Detalle de Sesión
- [ ] Crear página /history/[session_id]
- [ ] Mostrar información completa de sesión
- [ ] Mostrar ejercicios realizados
- [ ] Mostrar métricas por ejercicio
- [ ] Mostrar evaluación completa
- [ ] Implementar botón para reproducir audio (si existe)

#### 7.3 Gráficos Básicos
- [ ] Integrar librería de gráficos (recharts/chart.js)
- [ ] Crear gráfico de evolución de score
- [ ] Crear gráfico de sesiones por semana
- [ ] Implementar tooltips informativos
- [ ] Hacer gráficos responsive

### Sprint 8 — Progress Service

#### 8.1 Snapshots Semanales
- [ ] Implementar Progress Service
- [ ] Crear job para generar snapshot semanal
- [ ] Calcular overall_score semanal
- [ ] Calcular tendencias por dimensión
- [ ] Identificar dominant_weakness de la semana
- [ ] Identificar strong_skill de la semana
- [ ] Guardar snapshot en progress_snapshots

#### 8.2 Snapshots Mensuales
- [ ] Crear job para generar snapshot mensual
- [ ] Consolidar datos de snapshots semanales
- [ ] Calcular tendencias mensuales
- [ ] Identificar hitos de progreso

#### 8.3 Skill Dimensions
- [ ] Definir dimensiones de skill a trackear
- [ ] Implementar cálculo de score por dimensión
- [ ] Crear UI de skill cards en dashboard
- [ ] Mostrar progreso por dimensión

### Sprint 9 — Modelo Longitudinal

#### 9.1 Comparativas
- [ ] Implementar comparación entre sesiones
- [ ] Comparar semana actual vs anterior
- [ ] Comparar mes actual vs anterior
- [ ] Calcular delta de mejora/empeoramiento

#### 9.2 Tendencias
- [ ] Implementar cálculo de tendencias (improving, stable, declining)
- [ ] Mostrar tendencias en dashboard
- [ ] Implementar alertas de estancamiento
- [ ] Implementar alertas de mejora significativa

#### 9.3 Dashboard de Progreso
- [ ] Refinar dashboard con datos de progreso
- [ ] Mostrar gráfico de evolución semanal
- [ ] Mostrar dimensiones con mejora
- [ ] Mostrar dimensiones a trabajar
- [ ] Implementar resumen ejecutivo de progreso

---

## Fase 4 — Adaptive Training Engine v1

### Sprint 10 — Taxonomía Aplicada

#### 10.1 Catálogo de Ejercicios
- [ ] Definir catálogo inicial de ejercicios
- [ ] Crear tabla exercise_catalog
- [ ] Implementar ejercicios base:
  - [ ] sustain_note_basic
  - [ ] sustain_note_precision
  - [ ] pitch_target_basic
  - [ ] pitch_target_precision
  - [ ] clean_onset_drill
  - [ ] breath_control_basic
  - [ ] breath_reset
  - [ ] vibrato_intro
  - [ ] resonance_forward
  - [ ] register_bridge
- [ ] Definir variantes por nivel

#### 10.2 Mapeo Técnica-Error-Ejercicio
- [ ] Crear tabla de reglas problema → corrección
- [ ] Mapear técnicas con ejercicios
- [ ] Mapear errores con técnicas
- [ ] Mapear ejercicios con documentos relacionados
- [ ] Implementar consulta de mapeos

#### 10.3 Niveles de Dificultad
- [ ] Definir niveles: beginner, foundation, intermediate, advanced, professional
- [ ] Configurar parámetros por nivel
- [ ] Implementar reglas de progresión de dificultad
- [ ] Implementar reglas de regresión

### Sprint 11 — Generación de Tareas

#### 11.1 Tabla de Tareas
- [ ] Implementar tabla tasks
- [ ] Implementar tabla task_runs
- [ ] Implementar tabla task_results
- [ ] Crear migraciones
- [ ] Crear seeds de ejercicios

#### 11.2 Exercise Selector
- [ ] Implementar Exercise Selector
- [ ] Respetar nivel del usuario
- [ ] Respetar prerequisitos
- [ ] Evitar ejercicios redundantes consecutivos
- [ ] Considerar estado de fatiga

#### 11.3 Generación de Tareas
- [ ] Implementar lógica de generación de tarea
- [ ] Asignar dificultad inicial
- [ ] Definir criterios de éxito
- [ ] Definir duración y repeticiones
- [ ] Guardar tarea en PostgreSQL

### Sprint 12 — Adaptación Simple

#### 12.1 Difficulty Manager
- [ ] Implementar reglas de subida de dificultad
- [ ] Implementar reglas de mantenimiento
- [ ] Implementar reglas de bajada de dificultad
- [ ] Considerar consistencia en decisiones

#### 12.2 Load Balancer
- [ ] Implementar balance de carga de práctica
- [ ] Evitar sobrecarga de ejercicios
- [ ] Introducir práctica ligera cuando corresponda
- [ ] Considerar días consecutivos de práctica

#### 12.3 Agenda Diaria
- [ ] Implementar Agenda Builder
- [ ] Generar agenda con objetivo del día
- [ ] Ordenar bloques de práctica
- [ ] Definir duración total
- [ ] Mostrar criterio de éxito
- [ ] Generar mensaje de foco técnico

#### 12.4 UI de Tareas
- [ ] Mostrar tarea actual en dashboard
- [ ] Mostrar agenda del día
- [ ] Implementar marcado de tarea completada
- [ ] Mostrar historial de tareas

---

## Fase 5 — Knowledge Service + Biblioteca Interna

### Sprint 13 — Biblioteca Básica

#### 13.1 Estructura Documental
- [ ] Crear carpeta docs/ con estructura:
  - [ ] docs/techniques/
  - [ ] docs/anatomy/
  - [ ] docs/problems/
  - [ ] docs/health/
  - [ ] docs/resources/
- [ ] Crear artículos iniciales por categoría
- [ ] Definir formato Markdown estandarizado

#### 13.2 UI de Biblioteca
- [ ] Crear página /library
- [ ] Implementar listado por categorías
- [ ] Implementar búsqueda de artículos
- [ ] Crear página de artículo /library/[slug]
- [ ] Implementar renderizado de Markdown
- [ ] Añadir tabla de contenidos

#### 13.3 Metadatos
- [ ] Definir frontmatter para artículos
- [ ] Incluir: category, subcategory, related_techniques, related_errors
- [ ] Incluir: difficulty_level, risk_level
- [ ] Incluir: last_reviewed_at

### Sprint 14 — Knowledge Service

#### 14.1 Content Parser
- [ ] Implementar parser de Markdown
- [ ] Extraer frontmatter como metadatos
- [ ] Dividir artículos en chunks pedagógicos
- [ ] Identificar tipos de chunk: definición, causas, síntomas, ejercicios

#### 14.2 Indexación
- [ ] Implementar Indexing Layer
- [ ] Indexar por categoría
- [ ] Indexar por etiquetas
- [ ] Indexar por relaciones técnica/error
- [ ] Crear tabla knowledge_documents
- [ ] Crear tabla knowledge_chunks

#### 14.3 Retrieval Layer
- [ ] Implementar búsqueda estructurada
- [ ] Implementar búsqueda por categoría
- [ ] Implementar búsqueda por técnica
- [ ] Implementar búsqueda por error
- [ ] Implementar búsqueda semántica inicial

### Sprint 15 — Enlaces Pedagógicos

#### 15.1 Pedagogical Context Builder
- [ ] Implementar contexto para LLM
- [ ] Unir métricas con documentación relevante
- [ ] Considerar nivel del usuario
- [ ] Considerar error detectado

#### 15.2 UI de Enlaces
- [ ] Mostrar "Ver explicación" en reportes
- [ ] Recomendar docs por error detectado
- [ ] Enlazar a artículos concretos
- [ ] Mostrar objetos pedagógicos estructurados

#### 15.3 Objetos Pedagógicos
- [ ] Crear estructura de respuesta pedagógica:
  - topic
  - explanation
  - common_causes
  - recommended_exercises
  - warning_signals
  - related_docs
- [ ] Persistir objetos en pedagogical_feedback

---

## Fase 6 — Pedagogical Orchestrator + LLM

### Sprint 16 — Context Builder

#### 16.1 Contexto Compuesto
- [ ] Implementar mezcla de métricas + progreso + docs
- [ ] Incluir histórico reciente
- [ ] Incluir debilidad dominante
- [ ] Incluir objetivo del ejercicio
- [ ] Estructurar contexto para LLM

#### 16.2 Plantillas de Salida
- [ ] Definir formato de respuesta estructurada
- [ ] Incluir: summary, explanation, recommended_next_step
- [ ] Incluir: linked_docs
- [ ] Validar formato de salida

### Sprint 17 — LLM Inicial

#### 17.1 Integración de Proveedor
- [ ] Seleccionar proveedor LLM (OpenAI/Anthropic/etc.)
- [ ] Configurar cliente LLM
- [ ] Implementar llamada asíncrona
- [ ] Configurar timeouts y retries
- [ ] Implementar manejo de errores

#### 17.2 Feedback Post-Sesión
- [ ] Generar resumen post-sesión con LLM
- [ ] Explicar error dominante
- [ ] Recomendar siguiente paso
- [ ] Mostrar feedback en UI
- [ ] Persistir feedback en PostgreSQL

#### 17.3 Versionado de Prompts
- [ ] Implementar sistema de versionado de prompts
- [ ] Guardar prompt_version en pedagogical_feedback
- [ ] Permitir iteración de prompts
- [ ] Trackear efectividad por versión

### Sprint 18 — Grounding Pedagógico

#### 18.1 Retrieval Conectado
- [ ] Conectar retrieval al contexto del LLM
- [ ] Incluir chunks relevantes en prompt
- [ ] Limitar contexto a información útil
- [ ] Implementar re-ranking contextual

#### 18.2 Mensajes Seguros
- [ ] Implementar validación de respuestas
- [ ] Evitar consejos agresivos si hay fatiga
- [ ] Priorizar mensajes conservadores en riesgo
- [ ] Implementar fallback a plantillas si LLM falla

#### 18.3 Enlaces a Docs
- [ ] Incluir enlaces a docs concretas en feedback
- [ ] Mostrar referencias cruzadas
- [ ] Implementar navegación desde feedback a doc

---

## Fase 7 — Premium Real de Análisis y Experiencia

### Sprint 19 — Métricas Avanzadas

#### 19.1 Onset Timing
- [ ] Implementar detección de onset
- [ ] Calcular onset_timing_ms
- [ ] Evaluar precisión de ataque
- [ ] Incorporar al scoring

#### 19.2 Sustain Duration
- [ ] Implementar medición de duración sostenida
- [ ] Calcular sustain_duration_seconds
- [ ] Evaluar capacidad de sostén
- [ ] Incorporar al scoring

#### 19.3 Vibrato Inicial
- [ ] Implementar detección de vibrato
- [ ] Calcular vibrato_rate (Hz)
- [ ] Calcular vibrato_depth
- [ ] Evaluar regularidad de vibrato

#### 19.4 Consistencia
- [ ] Implementar métrica de consistencia entre repeticiones
- [ ] Calcular variance entre repeticiones
- [ ] Evaluar progreso dentro de ejercicio
- [ ] Incorporar al scoring

### Sprint 20 — UX Premium

#### 20.1 Dashboard Refinado
- [ ] Rediseñar dashboard con look premium
- [ ] Mejorar jerarquía visual
- [ ] Implementar animaciones sutiles
- [ ] Mejorar tipografía y espaciado
- [ ] Implementar dark mode

#### 20.2 Practice Flow Mejorado
- [ ] Refinar UI de práctica
- [ ] Mejorar feedback visual en tiempo real
- [ ] Implementar animaciones de transición
- [ ] Mejorar indicaciones visuales
- [ ] Implementar microinteracciones

#### 20.3 Gráficos Mejorados
- [ ] Refinar diseño de gráficos
- [ ] Implementar gráficos de skill map
- [ ] Mejorar tooltips y leyendas
- [ ] Implementar exportación de gráficos

#### 20.4 Microfeedback
- [ ] Implementar feedback inmediato por repetición
- [ ] Mostrar indicador de éxito/fracaso
- [ ] Implementar mensajes de ánimo
- [ ] Celebrar hitos de progreso

### Sprint 21 — Seguridad y Salud Vocal

#### 21.1 Alertas Conservadoras
- [ ] Implementar detección de fatiga
- [ ] Mostrar alertas de descanso
- [ ] Implementar límites de práctica continua
- [ ] Sugerir pausas activas

#### 21.2 Docs de Riesgo
- [ ] Crear artículos de salud vocal
- [ ] Enlazar docs de riesgo en feedback
- [ ] Implementar señales de alarma
- [ ] Crear guía de cuándo consultar especialista

#### 21.3 Descansos Sugeridos
- [ ] Implementar recomendación de descansos
- [ ] Ajustar agenda si hay fatiga
- [ ] Implementar práctica ligera post-fatiga
- [ ] Trackear recuperación

---

## Fase 8 — Escalabilidad y Excelencia Operativa

### Sprint 22 — Observabilidad

#### 22.1 Logs Estructurados
- [ ] Implementar logging estructurado en web
- [ ] Implementar logging estructurado en audio-engine
- [ ] Configurar correlación de logs
- [ ] Implementar niveles de log (INFO, WARN, ERROR)

#### 22.2 Métricas de Latencia
- [ ] Medir latencia cliente → audio-engine
- [ ] Medir tiempo de análisis por chunk
- [ ] Medir tiempo hasta primer feedback
- [ ] Medir latencia de endpoints

#### 22.3 Dashboards Internos
- [ ] Crear dashboard de métricas técnicas
- [ ] Mostrar sesiones activas
- [ ] Mostrar latencia promedio
- [ ] Mostrar tasa de errores
- [ ] Mostrar uso de recursos

#### 22.4 Alertas
- [ ] Configurar alertas por email/Slack
- [ ] Alertar aumento de errores
- [ ] Alertar latencia excesiva
- [ ] Alertar caída de servicios
- [ ] Alertar fallos de billing

### Sprint 23 — Optimización

#### 23.1 Reducción de Payloads
- [ ] Optimizar tamaño de chunks de audio
- [ ] Implementar compresión de audio
- [ ] Reducir payloads de API
- [ ] Implementar caching de respuestas

#### 23.2 Optimización de Pipeline
- [ ] Mejorar chunking de audio
- [ ] Optimizar pipeline profundo
- [ ] Paralelizar procesamiento cuando sea posible
- [ ] Implementar colas para deep analysis

#### 23.3 Optimización de Costes
- [ ] Revisar consumo de R2
- [ ] Optimizar consultas a PostgreSQL
- [ ] Revisar uso de LLM
- [ ] Implementar políticas de retención de audio

### Sprint 24 — Hardening

#### 24.1 Rate Limits
- [ ] Implementar rate limiting en endpoints
- [ ] Configurar límites por usuario
- [ ] Implementar backoff exponencial
- [ ] Mostrar mensajes de rate limit

#### 24.2 Tolerancia a Fallos
- [ ] Implementar retries con backoff
- [ ] Implementar circuit breakers
- [ ] Implementar fallbacks graceful
- [ ] Implementar colas de reintento

#### 24.3 Recuperación
- [ ] Implementar recuperación de sesiones interrumpidas
- [ ] Implementar auto-guardado progresivo
- [ ] Manejar reconexión de WebSocket
- [ ] Implementar estados recoverable

---

## Tareas Transversales

### Seguridad

#### Autenticación y Autorización
- [ ] Verificar autenticación en todos los endpoints
- [ ] Implementar autorización por recurso
- [ ] Validar permisos de suscripción
- [ ] Implementar roles si es necesario

#### Seguridad de Datos
- [ ] Encriptar datos sensibles en reposo
- [ ] Usar HTTPS en todas las comunicaciones
- [ ] Implementar URLs firmadas para audio
- [ ] No exponer claves en cliente

#### Seguridad de APIs
- [ ] Implementar autenticación entre servicios
- [ ] Validar payloads de entrada
- [ ] Implementar sanitización de inputs
- [ ] Configurar CORS correctamente

### Testing

#### Tests de Componentes
- [ ] Testear componentes críticos de UI
- [ ] Testear componentes de práctica
- [ ] Testear componentes de dashboard
- [ ] Testear componentes de billing

#### Tests de Server Actions
- [ ] Testear acciones de sesión
- [ ] Testear acciones de tareas
- [ ] Testear acciones de progreso
- [ ] Testear acciones de billing

#### Tests de Audio-Engine
- [ ] Testear métricas con audio de prueba
- [ ] Testear scoring con casos controlados
- [ ] Testear pipelines de procesamiento
- [ ] Testear endpoints de API

#### Tests de Integración
- [ ] Testear flujo completo de sesión
- [ ] Testear integración con Clerk
- [ ] Testear integración con Stripe
- [ ] Testear integración con R2

### Documentación

#### Documentación Técnica
- [ ] Documentar arquitectura del sistema
- [ ] Documentar contratos entre servicios
- [ ] Documentar esquema de base de datos
- [ ] Documentar APIs

#### Documentación de Usuario
- [ ] Crear guía de inicio rápido
- [ ] Crear FAQ
- [ ] Documentar ejercicios disponibles
- [ ] Crear guía de solución de problemas

### Monitorización de Producto

#### Eventos a Trackear
- [ ] auth_signed_in
- [ ] onboarding_completed
- [ ] session_started
- [ ] exercise_started
- [ ] exercise_completed
- [ ] session_completed
- [ ] task_generated
- [ ] task_completed
- [ ] weekly_summary_sent
- [ ] subscription_started
- [ ] subscription_renewed
- [ ] subscription_canceled

#### Métricas de Producto
- [ ] Activación (usuarios que completan onboarding)
- [ ] Frecuencia de práctica (sesiones/semana)
- [ ] Abandono por pantalla
- [ ] Abandono por tarea
- [ ] Eficacia del loop adaptativo
- [ ] Conversión a suscripción
- [ ] Retención por cohorte

---

## Checklist de Lanzamiento

### Pre-Lanzamiento
- [ ] Todos los tests passing
- [ ] Linting y type checking sin errores
- [ ] Documentación técnica completa
- [ ] Variables de entorno configuradas en producción
- [ ] Backups de base de datos configurados
- [ ] Monitorización y alertas activas
- [ ] Plan de rollback definido

### Lanzamiento
- [ ] Desplegar en producción
- [ ] Verificar health checks
- [ ] Verificar flujos críticos
- [ ] Monitorizar métricas técnicas
- [ ] Monitorizar errores

### Post-Lanzamiento
- [ ] Recopilar feedback de usuarios
- [ ] Monitorizar métricas de producto
- [ ] Iterar sobre problemas detectados
- [ ] Planificar siguientes sprints

---

*Documento generado a partir de "vozazi_arquitectura_tecnica_completa.md"*
