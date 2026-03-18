# VOZAZI â€” Documento de Tareas y Checklist de Desarrollo

> Lista completa de tareas necesarias para completar el desarrollo de VOZAZI.

**Ãšltima actualizaciÃ³n:** 2026-03-18

---

## ðŸ“Š Progreso General

### Resumen por Estado

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| âœ… Completado | 40 | ~21% |
| ðŸ”’ Pendiente de Entorno | 115 | ~61% |
| â³ Pendiente | 33 | ~18% |
| âŒ Bloqueado | 0 | 0% |

### Leyenda

| SÃ­mbolo | Estado | DescripciÃ³n |
|---------|--------|-------------|
| `[x]` | âœ… **Completado** | Tarea implementada |
| `[ ]` | ðŸŸ¢ **Pendiente** | Tarea que **SE PUEDE implementar** (no requiere entorno) |
| `[ ] ðŸ”’` | ðŸ”´ **Pendiente de Entorno** | Tarea **BLOQUEADA** (requiere variables de entorno/servicios) |
| `[ ]` | ðŸŸ¡ **En Progreso** | Tarea siendo implementada |

### Estados Detallados

**ðŸŸ¢ Pendiente (33 tareas - ~18%)**
- Se pueden implementar inmediatamente
- No requieren configuraciÃ³n externa
- Ejemplos: UI components, hooks, lÃ³gica de frontend, tests

**ðŸ”’ Pendiente de Entorno (115 tareas - ~61%)**
- Requieren servicios externos configurados
- Necesitan variables de entorno
- Servicios: Clerk, Stripe, R2, PostHog, Resend, PostgreSQL

**âœ… Completado (40 tareas - ~21%)**
- Ya implementadas y en producciÃ³n
- Incluyen: monorepo, audio-engine, tests, UI de prÃ¡ctica

### Ãšltimas Implementaciones (2026-03-18)

#### Paquetes Creados
- âœ… `@vozazi/core-domain` - Entidades de dominio, value objects, reglas de negocio
- âœ… `@vozazi/analytics` - IntegraciÃ³n PostHog, eventos, hooks de analytics

#### Hooks Creados
- âœ… `useAudioRecorder` - Captura de audio con MediaRecorder
- âœ… `useAudioVisualizer` - VisualizaciÃ³n de audio en canvas (waveform, frequency, circular)
- âœ… `useAnalytics` - Tracking de eventos
- âœ… `usePageViewTracking` - Tracking de pÃ¡ginas
- âœ… `useSessionTracking` - Tracking de sesiones

#### Componentes Creados
- âœ… `AudioPractice` - Componente principal de prÃ¡ctica
- âœ… `PitchIndicator` - Indicador de afinaciÃ³n en tiempo real
- âœ… `ExerciseInstructions` - Instrucciones de ejercicios

---

## Fase 0 â€” Fundaciones del Proyecto

### 0.1 ConfiguraciÃ³n del Monorepo
- [x] Crear estructura de directorios del monorepo
- [x] Configurar package.json raÃ­z con workspaces
- [x] Configurar TypeScript raÃ­z (tsconfig.json)
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
- [ ] Configurar middleware.ts para autenticaciÃ³n ðŸ”’
- [x] Configurar next.config.js con optimizaciones

### 0.3 Repositorio Audio-Engine (apps/audio-engine)
- [x] Crear estructura de proyecto Python/FastAPI
- [x] Configurar requirements.txt con dependencias base
- [x] Configurar entorno virtual Python
- [x] Crear main.py con configuraciÃ³n FastAPI
- [x] Configurar CORS para comunicaciÃ³n con web
- [x] Configurar logging estructurado
- [x] Crear health check endpoint

### 0.4 Servicios Externos ðŸ”’ PENDIENTE DE ENTORNO
#### Clerk ðŸ”’
- [ ] Crear cuenta y proyecto en Clerk
- [ ] Configurar providers de autenticaciÃ³n
- [ ] Obtener claves API (publishable y secret)
- [ ] Configurar webhooks de Clerk
- [ ] Definir roles y permisos iniciales

#### Stripe ðŸ”’
- [ ] Crear cuenta Stripe
- [ ] Configurar productos y planes de suscripciÃ³n
- [ ] Obtener claves API (secret y publishable)
- [ ] Configurar webhook endpoint
- [ ] Configurar portal de cliente
- [ ] Configurar checkout sessions

#### Cloudflare R2 ðŸ”’
- [ ] Crear cuenta Cloudflare
- [ ] Crear bucket R2 para audio
- [ ] Configurar credenciales de acceso
- [ ] Configurar CORS para el dominio de la app
- [ ] Definir polÃ­tica de retenciÃ³n inicial

#### PostHog ðŸ”’
- [ ] Crear proyecto en PostHog
- [ ] Obtener API key
- [ ] Configurar dominio permitido
- [ ] Definir eventos iniciales a trackear

#### Resend ðŸ”’
- [ ] Crear cuenta Resend
- [ ] Verificar dominio para envÃ­o de emails
- [ ] Obtener API key
- [ ] Configurar templates base de emails

### 0.5 Base de Datos
- [ ] Provisionar instancia PostgreSQL (Supabase/Neon/RDS) ðŸ”’
- [x] Configurar Drizzle ORM en packages/db
- [x] Definir esquema inicial de base de datos
- [x] Crear migraciones iniciales
- [ ] Ejecutar migraciones en entorno de desarrollo ðŸ”’
- [ ] Configurar seeds iniciales
- [ ] Crear scripts de backup

### 0.6 Paquetes Compartidos
- [x] Inicializar packages/ui
- [x] Inicializar packages/db
- [x] Inicializar packages/core-domain âœ…
- [x] Inicializar packages/analytics âœ…
- [ ] Inicializar packages/billing â³
- [ ] Inicializar packages/auth â³
- [ ] Inicializar packages/pedagogy â³
- [x] Inicializar packages/shared-types
- [ ] Inicializar packages/config â³

### 0.7 Infrastructure as Code
- [x] Configurar deployment en Vercel (docker-compose.yml) âœ…
- [ ] Configurar variables de entorno en Vercel ðŸ”’
- [x] Crear configuraciÃ³n de infrastructure/ âœ…
- [x] Documentar proceso de despliegue âœ…

### 0.8 CI/CD
- [x] Configurar GitHub Actions para CI âœ…
- [x] Crear workflow de lint y type check âœ…
- [x] Crear workflow de tests âœ…
- [ ] Configurar deployment automÃ¡tico ðŸ”’
- [ ] Configurar preview deployments ðŸ”’

---

## Fase 1 â€” Vertical Slice del Producto

### Sprint 1 â€” App Shell

#### 1.1 AutenticaciÃ³n
- [ ] Integrar Clerk en apps/web
- [ ] Crear pÃ¡gina de login
- [ ] Crear pÃ¡gina de signup
- [ ] Crear pÃ¡gina de password reset
- [ ] Implementar protecciÃ³n de rutas privadas
- [ ] Implementar redirecciÃ³n post-login
- [ ] Crear componente UserButton para mostrar usuario

#### 1.2 Layout Principal
- [ ] Crear layout base con navegaciÃ³n
- [ ] Implementar header con logo y menÃº
- [ ] Implementar sidebar de navegaciÃ³n
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
- [ ] Implementar navegaciÃ³n entre rutas

#### 1.4 Onboarding Inicial
- [ ] Crear flujo de onboarding bÃ¡sico
- [ ] Implementar paso de bienvenida
- [ ] Implementar paso de objetivo principal
- [ ] Implementar paso de nivel autopercibido
- [ ] Implementar paso de tiempo disponible
- [ ] Guardar datos de onboarding en BD
- [ ] Redirigir a dashboard post-onboarding

### Sprint 2 â€” PrÃ¡ctica MÃ­nima

#### 2.1 Captura de Audio âœ…
- [x] Implementar getUserMedia para acceso a micrÃ³fono
- [x] Crear componente de permiso de micrÃ³fono
- [x] Manejar errores de acceso a micrÃ³fono
- [x] Implementar MediaRecorder para grabaciÃ³n
- [x] Crear hook useAudioRecorder
- [x] Implementar visualizaciÃ³n de nivel de audio

#### 2.2 UI de PrÃ¡ctica âœ…
- [x] Crear pantalla de prÃ¡ctica base
- [x] Implementar indicador de nota objetivo
- [x] Crear visualizador de audio (canvas/webgl)
- [x] Implementar cronÃ³metro de ejercicio
- [x] Crear controles de inicio/parada
- [x] Implementar contador de repeticiones
- [x] Crear feedback visual bÃ¡sico (afinaciÃ³n)

#### 2.3 Ejercicios BÃ¡sicos
- [ ] Implementar ejercicio "sustain_note" bÃ¡sico
- [ ] Implementar ejercicio "pitch_target" bÃ¡sico
- [ ] Crear instrucciones por ejercicio
- [ ] Implementar transiciÃ³n entre ejercicios
- [ ] Crear resumen post-ejercicio

#### 2.4 Estado de SesiÃ³n
- [ ] Implementar gestiÃ³n de estado de sesiÃ³n
- [ ] Crear hook useSessionState
- [ ] Implementar estados: idle, preparing, recording, processing, completed
- [ ] Manejar errores de sesiÃ³n
- [ ] Implementar cancelaciÃ³n de sesiÃ³n

### Sprint 3 â€” Persistencia MÃ­nima

#### 3.1 Backend de Sesiones
- [ ] Crear Server Action para iniciar sesiÃ³n
- [ ] Crear Server Action para cerrar sesiÃ³n
- [ ] Implementar persistencia en PostgreSQL
- [ ] Guardar referencia a audio en R2
- [ ] Implementar upload de audio a Cloudflare R2
- [ ] Crear endpoint para subir audio chunk

#### 3.2 Reporte Post-SesiÃ³n
- [ ] Crear pantalla de resultado de sesiÃ³n
- [ ] Mostrar duraciÃ³n total
- [ ] Mostrar ejercicios completados
- [ ] Mostrar mÃ©tricas bÃ¡sicas
- [ ] Implementar botÃ³n "Practicar de nuevo"
- [ ] Implementar botÃ³n "Volver al dashboard"

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

#### 3.4 Dashboard BÃ¡sico
- [ ] Crear dashboard con resumen de actividad
- [ ] Mostrar Ãºltimas sesiones
- [ ] Mostrar estadÃ­sticas bÃ¡sicas (tiempo, sesiones)
- [ ] Implementar botÃ³n "Comenzar prÃ¡ctica"
- [ ] Mostrar prÃ³xima tarea si existe

---

## Fase 2 â€” Motor AcÃºstico Inicial Serio

### Sprint 4 â€” Audio Engine Base

#### 4.1 Infraestructura FastAPI
- [x] Configurar FastAPI con estructura de routers
- [x] Implementar endpoint /health
- [ ] Implementar endpoint /api/v1/realtime
- [ ] Implementar endpoint /api/v1/analysis
- [ ] Implementar endpoint /api/v1/scoring
- [x] Configurar WebSocket para /ws/session
- [ ] Implementar autenticaciÃ³n entre web y audio-engine

#### 4.2 Contrato de ComunicaciÃ³n
- [ ] Definir esquema de request/response
- [ ] Crear tipos compartidos en packages/shared-types
- [ ] Implementar cliente HTTP desde web hacia audio-engine
- [ ] Implementar cliente WebSocket para tiempo real
- [ ] Configurar retries y timeouts
- [ ] Implementar manejo de errores de conexiÃ³n

#### 4.3 Logging y Observabilidad
- [x] Configurar logging estructurado en audio-engine
- [ ] Implementar logs de sesiÃ³n iniciada
- [ ] Implementar logs de chunk recibido
- [ ] Implementar logs de anÃ¡lisis completado
- [ ] Configurar correlaciÃ³n de logs por session_id

### Sprint 5 â€” Pipeline Inicial

#### 5.1 IngestiÃ³n de Audio
- [ ] Implementar Audio Ingestion Service
- [ ] Validar formato de audio recibido
- [ ] Implementar normalizaciÃ³n de audio
- [ ] Configurar chunking de audio (200-500ms feedback, 1-3s anÃ¡lisis)
- [ ] Implementar almacenamiento temporal de chunks
- [ ] Configurar limpieza de archivos temporales

#### 5.2 Preprocesamiento
- [ ] Implementar filtro de ruido bÃ¡sico
- [ ] Configurar RNNoise para reducciÃ³n de ruido
- [ ] Implementar Silero VAD para detecciÃ³n de voz
- [ ] Segmentar audio en partes con voz activa
- [ ] Normalizar niveles de seÃ±al

#### 5.3 Pitch Tracking
- [ ] Integrar torchcrepe para pitch detection
- [ ] Configurar modelo torchcrepe (full/fast)
- [ ] Implementar extracciÃ³n de pitch por frame
- [ ] Calcular nota detectada desde frecuencia
- [ ] Calcular desviaciÃ³n en cents
- [ ] Implementar suavizado de seÃ±al de pitch

#### 5.4 MÃ©tricas BÃ¡sicas
- [ ] Implementar cÃ¡lculo de pitch_accuracy
- [ ] Implementar cÃ¡lculo de pitch_stability
- [ ] Calcular variance de pitch
- [ ] Implementar mÃ©tricas por repeticiÃ³n
- [ ] Agregar mÃ©tricas por ejercicio
- [ ] Retornar mÃ©tricas en formato estructurado

### Sprint 6 â€” Score Inicial

#### 6.1 Scoring Engine
- [ ] Implementar Evaluation Engine
- [ ] Configurar fÃ³rmula de scoring base:
  - 40% pitch_accuracy
  - 20% pitch_stability
  - 15% onset_control
  - 15% breath_support
  - 10% consistency
- [ ] Implementar cÃ¡lculo de score por ejercicio
- [ ] Implementar cÃ¡lculo de score por sesiÃ³n
- [ ] Normalizar scores a escala 0-100

#### 6.2 DetecciÃ³n de Debilidades
- [ ] Implementar detecciÃ³n de dominant_weakness
- [ ] Implementar detecciÃ³n de secondary_weakness
- [ ] Clasificar error tÃ©cnico detectado
- [ ] Generar adaptive_decision inicial

#### 6.3 Persistencia de EvaluaciÃ³n
- [ ] Guardar evaluation_results en PostgreSQL
- [ ] Vincular con session y segment
- [ ] Guardar mÃ©tricas en session_metrics
- [ ] Implementar consulta de resultados por sesiÃ³n

#### 6.4 UI de Score
- [ ] Mostrar score en reporte post-sesiÃ³n
- [ ] Crear visualizaciÃ³n de score por dimensiÃ³n
- [ ] Implementar indicador de debilidad dominante
- [ ] Mostrar mensaje explicativo del score

---

## Fase 3 â€” Progreso y Memoria del Producto

### Sprint 7 â€” Historial

#### 7.1 Lista de Sesiones
- [ ] Crear pÃ¡gina /history
- [ ] Implementar lista de sesiones con paginaciÃ³n
- [ ] Mostrar fecha, duraciÃ³n, score por sesiÃ³n
- [ ] Implementar filtros por fecha
- [ ] Implementar ordenamiento por fecha/score
- [ ] Crear estado vacÃ­o (no sessions yet)

#### 7.2 Detalle de SesiÃ³n
- [ ] Crear pÃ¡gina /history/[session_id]
- [ ] Mostrar informaciÃ³n completa de sesiÃ³n
- [ ] Mostrar ejercicios realizados
- [ ] Mostrar mÃ©tricas por ejercicio
- [ ] Mostrar evaluaciÃ³n completa
- [ ] Implementar botÃ³n para reproducir audio (si existe)

#### 7.3 GrÃ¡ficos BÃ¡sicos
- [ ] Integrar librerÃ­a de grÃ¡ficos (recharts/chart.js)
- [ ] Crear grÃ¡fico de evoluciÃ³n de score
- [ ] Crear grÃ¡fico de sesiones por semana
- [ ] Implementar tooltips informativos
- [ ] Hacer grÃ¡ficos responsive

### Sprint 8 â€” Progress Service

#### 8.1 Snapshots Semanales
- [ ] Implementar Progress Service
- [ ] Crear job para generar snapshot semanal
- [ ] Calcular overall_score semanal
- [ ] Calcular tendencias por dimensiÃ³n
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
- [ ] Implementar cÃ¡lculo de score por dimensiÃ³n
- [ ] Crear UI de skill cards en dashboard
- [ ] Mostrar progreso por dimensiÃ³n

### Sprint 9 â€” Modelo Longitudinal

#### 9.1 Comparativas
- [ ] Implementar comparaciÃ³n entre sesiones
- [ ] Comparar semana actual vs anterior
- [ ] Comparar mes actual vs anterior
- [ ] Calcular delta de mejora/empeoramiento

#### 9.2 Tendencias
- [ ] Implementar cÃ¡lculo de tendencias (improving, stable, declining)
- [ ] Mostrar tendencias en dashboard
- [ ] Implementar alertas de estancamiento
- [ ] Implementar alertas de mejora significativa

#### 9.3 Dashboard de Progreso
- [ ] Refinar dashboard con datos de progreso
- [ ] Mostrar grÃ¡fico de evoluciÃ³n semanal
- [ ] Mostrar dimensiones con mejora
- [ ] Mostrar dimensiones a trabajar
- [ ] Implementar resumen ejecutivo de progreso

---

## Fase 4 â€” Adaptive Training Engine v1

### Sprint 10 â€” TaxonomÃ­a Aplicada

#### 10.1 CatÃ¡logo de Ejercicios
- [ ] Definir catÃ¡logo inicial de ejercicios
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

#### 10.2 Mapeo TÃ©cnica-Error-Ejercicio
- [ ] Crear tabla de reglas problema â†’ correcciÃ³n
- [ ] Mapear tÃ©cnicas con ejercicios
- [ ] Mapear errores con tÃ©cnicas
- [ ] Mapear ejercicios con documentos relacionados
- [ ] Implementar consulta de mapeos

#### 10.3 Niveles de Dificultad
- [ ] Definir niveles: beginner, foundation, intermediate, advanced, professional
- [ ] Configurar parÃ¡metros por nivel
- [ ] Implementar reglas de progresiÃ³n de dificultad
- [ ] Implementar reglas de regresiÃ³n

### Sprint 11 â€” GeneraciÃ³n de Tareas

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

#### 11.3 GeneraciÃ³n de Tareas
- [ ] Implementar lÃ³gica de generaciÃ³n de tarea
- [ ] Asignar dificultad inicial
- [ ] Definir criterios de Ã©xito
- [ ] Definir duraciÃ³n y repeticiones
- [ ] Guardar tarea en PostgreSQL

### Sprint 12 â€” AdaptaciÃ³n Simple

#### 12.1 Difficulty Manager
- [ ] Implementar reglas de subida de dificultad
- [ ] Implementar reglas de mantenimiento
- [ ] Implementar reglas de bajada de dificultad
- [ ] Considerar consistencia en decisiones

#### 12.2 Load Balancer
- [ ] Implementar balance de carga de prÃ¡ctica
- [ ] Evitar sobrecarga de ejercicios
- [ ] Introducir prÃ¡ctica ligera cuando corresponda
- [ ] Considerar dÃ­as consecutivos de prÃ¡ctica

#### 12.3 Agenda Diaria
- [ ] Implementar Agenda Builder
- [ ] Generar agenda con objetivo del dÃ­a
- [ ] Ordenar bloques de prÃ¡ctica
- [ ] Definir duraciÃ³n total
- [ ] Mostrar criterio de Ã©xito
- [ ] Generar mensaje de foco tÃ©cnico

#### 12.4 UI de Tareas
- [ ] Mostrar tarea actual en dashboard
- [ ] Mostrar agenda del dÃ­a
- [ ] Implementar marcado de tarea completada
- [ ] Mostrar historial de tareas

---

## Fase 5 â€” Knowledge Service + Biblioteca Interna

### Sprint 13 â€” Biblioteca BÃ¡sica

#### 13.1 Estructura Documental
- [ ] Crear carpeta docs/ con estructura:
  - [ ] docs/techniques/
  - [ ] docs/anatomy/
  - [ ] docs/problems/
  - [ ] docs/health/
  - [ ] docs/resources/
- [ ] Crear artÃ­culos iniciales por categorÃ­a
- [ ] Definir formato Markdown estandarizado

#### 13.2 UI de Biblioteca
- [ ] Crear pÃ¡gina /library
- [ ] Implementar listado por categorÃ­as
- [ ] Implementar bÃºsqueda de artÃ­culos
- [ ] Crear pÃ¡gina de artÃ­culo /library/[slug]
- [ ] Implementar renderizado de Markdown
- [ ] AÃ±adir tabla de contenidos

#### 13.3 Metadatos
- [ ] Definir frontmatter para artÃ­culos
- [ ] Incluir: category, subcategory, related_techniques, related_errors
- [ ] Incluir: difficulty_level, risk_level
- [ ] Incluir: last_reviewed_at

### Sprint 14 â€” Knowledge Service

#### 14.1 Content Parser
- [ ] Implementar parser de Markdown
- [ ] Extraer frontmatter como metadatos
- [ ] Dividir artÃ­culos en chunks pedagÃ³gicos
- [ ] Identificar tipos de chunk: definiciÃ³n, causas, sÃ­ntomas, ejercicios

#### 14.2 IndexaciÃ³n
- [ ] Implementar Indexing Layer
- [ ] Indexar por categorÃ­a
- [ ] Indexar por etiquetas
- [ ] Indexar por relaciones tÃ©cnica/error
- [ ] Crear tabla knowledge_documents
- [ ] Crear tabla knowledge_chunks

#### 14.3 Retrieval Layer
- [ ] Implementar bÃºsqueda estructurada
- [ ] Implementar bÃºsqueda por categorÃ­a
- [ ] Implementar bÃºsqueda por tÃ©cnica
- [ ] Implementar bÃºsqueda por error
- [ ] Implementar bÃºsqueda semÃ¡ntica inicial

### Sprint 15 â€” Enlaces PedagÃ³gicos

#### 15.1 Pedagogical Context Builder
- [ ] Implementar contexto para LLM
- [ ] Unir mÃ©tricas con documentaciÃ³n relevante
- [ ] Considerar nivel del usuario
- [ ] Considerar error detectado

#### 15.2 UI de Enlaces
- [ ] Mostrar "Ver explicaciÃ³n" en reportes
- [ ] Recomendar docs por error detectado
- [ ] Enlazar a artÃ­culos concretos
- [ ] Mostrar objetos pedagÃ³gicos estructurados

#### 15.3 Objetos PedagÃ³gicos
- [ ] Crear estructura de respuesta pedagÃ³gica:
  - topic
  - explanation
  - common_causes
  - recommended_exercises
  - warning_signals
  - related_docs
- [ ] Persistir objetos en pedagogical_feedback

---

## Fase 6 â€” Pedagogical Orchestrator + LLM

### Sprint 16 â€” Context Builder

#### 16.1 Contexto Compuesto
- [ ] Implementar mezcla de mÃ©tricas + progreso + docs
- [ ] Incluir histÃ³rico reciente
- [ ] Incluir debilidad dominante
- [ ] Incluir objetivo del ejercicio
- [ ] Estructurar contexto para LLM

#### 16.2 Plantillas de Salida
- [ ] Definir formato de respuesta estructurada
- [ ] Incluir: summary, explanation, recommended_next_step
- [ ] Incluir: linked_docs
- [ ] Validar formato de salida

### Sprint 17 â€” LLM Inicial

#### 17.1 IntegraciÃ³n de Proveedor
- [ ] Seleccionar proveedor LLM (OpenAI/Anthropic/etc.)
- [ ] Configurar cliente LLM
- [ ] Implementar llamada asÃ­ncrona
- [ ] Configurar timeouts y retries
- [ ] Implementar manejo de errores

#### 17.2 Feedback Post-SesiÃ³n
- [ ] Generar resumen post-sesiÃ³n con LLM
- [ ] Explicar error dominante
- [ ] Recomendar siguiente paso
- [ ] Mostrar feedback en UI
- [ ] Persistir feedback en PostgreSQL

#### 17.3 Versionado de Prompts
- [ ] Implementar sistema de versionado de prompts
- [ ] Guardar prompt_version en pedagogical_feedback
- [ ] Permitir iteraciÃ³n de prompts
- [ ] Trackear efectividad por versiÃ³n

### Sprint 18 â€” Grounding PedagÃ³gico

#### 18.1 Retrieval Conectado
- [ ] Conectar retrieval al contexto del LLM
- [ ] Incluir chunks relevantes en prompt
- [ ] Limitar contexto a informaciÃ³n Ãºtil
- [ ] Implementar re-ranking contextual

#### 18.2 Mensajes Seguros
- [ ] Implementar validaciÃ³n de respuestas
- [ ] Evitar consejos agresivos si hay fatiga
- [ ] Priorizar mensajes conservadores en riesgo
- [ ] Implementar fallback a plantillas si LLM falla

#### 18.3 Enlaces a Docs
- [ ] Incluir enlaces a docs concretas en feedback
- [ ] Mostrar referencias cruzadas
- [ ] Implementar navegaciÃ³n desde feedback a doc

---

## Fase 7 â€” Premium Real de AnÃ¡lisis y Experiencia

### Sprint 19 â€” MÃ©tricas Avanzadas

#### 19.1 Onset Timing
- [ ] Implementar detecciÃ³n de onset
- [ ] Calcular onset_timing_ms
- [ ] Evaluar precisiÃ³n de ataque
- [ ] Incorporar al scoring

#### 19.2 Sustain Duration
- [ ] Implementar mediciÃ³n de duraciÃ³n sostenida
- [ ] Calcular sustain_duration_seconds
- [ ] Evaluar capacidad de sostÃ©n
- [ ] Incorporar al scoring

#### 19.3 Vibrato Inicial
- [ ] Implementar detecciÃ³n de vibrato
- [ ] Calcular vibrato_rate (Hz)
- [ ] Calcular vibrato_depth
- [ ] Evaluar regularidad de vibrato

#### 19.4 Consistencia
- [ ] Implementar mÃ©trica de consistencia entre repeticiones
- [ ] Calcular variance entre repeticiones
- [ ] Evaluar progreso dentro de ejercicio
- [ ] Incorporar al scoring

### Sprint 20 â€” UX Premium

#### 20.1 Dashboard Refinado
- [ ] RediseÃ±ar dashboard con look premium
- [ ] Mejorar jerarquÃ­a visual
- [ ] Implementar animaciones sutiles
- [ ] Mejorar tipografÃ­a y espaciado
- [ ] Implementar dark mode

#### 20.2 Practice Flow Mejorado
- [ ] Refinar UI de prÃ¡ctica
- [ ] Mejorar feedback visual en tiempo real
- [ ] Implementar animaciones de transiciÃ³n
- [ ] Mejorar indicaciones visuales
- [ ] Implementar microinteracciones

#### 20.3 GrÃ¡ficos Mejorados
- [ ] Refinar diseÃ±o de grÃ¡ficos
- [ ] Implementar grÃ¡ficos de skill map
- [ ] Mejorar tooltips y leyendas
- [ ] Implementar exportaciÃ³n de grÃ¡ficos

#### 20.4 Microfeedback
- [ ] Implementar feedback inmediato por repeticiÃ³n
- [ ] Mostrar indicador de Ã©xito/fracaso
- [ ] Implementar mensajes de Ã¡nimo
- [ ] Celebrar hitos de progreso

### Sprint 21 â€” Seguridad y Salud Vocal

#### 21.1 Alertas Conservadoras
- [ ] Implementar detecciÃ³n de fatiga
- [ ] Mostrar alertas de descanso
- [ ] Implementar lÃ­mites de prÃ¡ctica continua
- [ ] Sugerir pausas activas

#### 21.2 Docs de Riesgo
- [ ] Crear artÃ­culos de salud vocal
- [ ] Enlazar docs de riesgo en feedback
- [ ] Implementar seÃ±ales de alarma
- [ ] Crear guÃ­a de cuÃ¡ndo consultar especialista

#### 21.3 Descansos Sugeridos
- [ ] Implementar recomendaciÃ³n de descansos
- [ ] Ajustar agenda si hay fatiga
- [ ] Implementar prÃ¡ctica ligera post-fatiga
- [ ] Trackear recuperaciÃ³n

---

## Fase 8 â€” Escalabilidad y Excelencia Operativa

### Sprint 22 â€” Observabilidad

#### 22.1 Logs Estructurados
- [ ] Implementar logging estructurado en web
- [ ] Implementar logging estructurado en audio-engine
- [ ] Configurar correlaciÃ³n de logs
- [ ] Implementar niveles de log (INFO, WARN, ERROR)

#### 22.2 MÃ©tricas de Latencia
- [ ] Medir latencia cliente â†’ audio-engine
- [ ] Medir tiempo de anÃ¡lisis por chunk
- [ ] Medir tiempo hasta primer feedback
- [ ] Medir latencia de endpoints

#### 22.3 Dashboards Internos
- [ ] Crear dashboard de mÃ©tricas tÃ©cnicas
- [ ] Mostrar sesiones activas
- [ ] Mostrar latencia promedio
- [ ] Mostrar tasa de errores
- [ ] Mostrar uso de recursos

#### 22.4 Alertas
- [ ] Configurar alertas por email/Slack
- [ ] Alertar aumento de errores
- [ ] Alertar latencia excesiva
- [ ] Alertar caÃ­da de servicios
- [ ] Alertar fallos de billing

### Sprint 23 â€” OptimizaciÃ³n

#### 23.1 ReducciÃ³n de Payloads
- [ ] Optimizar tamaÃ±o de chunks de audio
- [ ] Implementar compresiÃ³n de audio
- [ ] Reducir payloads de API
- [ ] Implementar caching de respuestas

#### 23.2 OptimizaciÃ³n de Pipeline
- [ ] Mejorar chunking de audio
- [ ] Optimizar pipeline profundo
- [ ] Paralelizar procesamiento cuando sea posible
- [ ] Implementar colas para deep analysis

#### 23.3 OptimizaciÃ³n de Costes
- [ ] Revisar consumo de R2
- [ ] Optimizar consultas a PostgreSQL
- [ ] Revisar uso de LLM
- [ ] Implementar polÃ­ticas de retenciÃ³n de audio

### Sprint 24 â€” Hardening

#### 24.1 Rate Limits
- [ ] Implementar rate limiting en endpoints
- [ ] Configurar lÃ­mites por usuario
- [ ] Implementar backoff exponencial
- [ ] Mostrar mensajes de rate limit

#### 24.2 Tolerancia a Fallos
- [ ] Implementar retries con backoff
- [ ] Implementar circuit breakers
- [ ] Implementar fallbacks graceful
- [ ] Implementar colas de reintento

#### 24.3 RecuperaciÃ³n
- [ ] Implementar recuperaciÃ³n de sesiones interrumpidas
- [ ] Implementar auto-guardado progresivo
- [ ] Manejar reconexiÃ³n de WebSocket
- [ ] Implementar estados recoverable

---

## Tareas Transversales

### Seguridad

#### AutenticaciÃ³n y AutorizaciÃ³n
- [ ] Verificar autenticaciÃ³n en todos los endpoints
- [ ] Implementar autorizaciÃ³n por recurso
- [ ] Validar permisos de suscripciÃ³n
- [ ] Implementar roles si es necesario

#### Seguridad de Datos
- [ ] Encriptar datos sensibles en reposo
- [ ] Usar HTTPS en todas las comunicaciones
- [ ] Implementar URLs firmadas para audio
- [ ] No exponer claves en cliente

#### Seguridad de APIs
- [ ] Implementar autenticaciÃ³n entre servicios
- [ ] Validar payloads de entrada
- [ ] Implementar sanitizaciÃ³n de inputs
- [ ] Configurar CORS correctamente

### Testing

#### Tests de Componentes
- [ ] Testear componentes crÃ­ticos de UI
- [ ] Testear componentes de prÃ¡ctica
- [ ] Testear componentes de dashboard
- [ ] Testear componentes de billing

#### Tests de Server Actions
- [ ] Testear acciones de sesiÃ³n
- [ ] Testear acciones de tareas
- [ ] Testear acciones de progreso
- [ ] Testear acciones de billing

#### Tests de Audio-Engine
- [ ] Testear mÃ©tricas con audio de prueba
- [ ] Testear scoring con casos controlados
- [ ] Testear pipelines de procesamiento
- [ ] Testear endpoints de API

#### Tests de IntegraciÃ³n
- [ ] Testear flujo completo de sesiÃ³n
- [ ] Testear integraciÃ³n con Clerk
- [ ] Testear integraciÃ³n con Stripe
- [ ] Testear integraciÃ³n con R2

### DocumentaciÃ³n

#### DocumentaciÃ³n TÃ©cnica
- [ ] Documentar arquitectura del sistema
- [ ] Documentar contratos entre servicios
- [ ] Documentar esquema de base de datos
- [ ] Documentar APIs

#### DocumentaciÃ³n de Usuario
- [ ] Crear guÃ­a de inicio rÃ¡pido
- [ ] Crear FAQ
- [ ] Documentar ejercicios disponibles
- [ ] Crear guÃ­a de soluciÃ³n de problemas

### MonitorizaciÃ³n de Producto

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

#### MÃ©tricas de Producto
- [ ] ActivaciÃ³n (usuarios que completan onboarding)
- [ ] Frecuencia de prÃ¡ctica (sesiones/semana)
- [ ] Abandono por pantalla
- [ ] Abandono por tarea
- [ ] Eficacia del loop adaptativo
- [ ] ConversiÃ³n a suscripciÃ³n
- [ ] RetenciÃ³n por cohorte

---

## Checklist de Lanzamiento

### Pre-Lanzamiento
- [ ] Todos los tests passing
- [ ] Linting y type checking sin errores
- [ ] DocumentaciÃ³n tÃ©cnica completa
- [ ] Variables de entorno configuradas en producciÃ³n
- [ ] Backups de base de datos configurados
- [ ] MonitorizaciÃ³n y alertas activas
- [ ] Plan de rollback definido

### Lanzamiento
- [ ] Desplegar en producciÃ³n
- [ ] Verificar health checks
- [ ] Verificar flujos crÃ­ticos
- [ ] Monitorizar mÃ©tricas tÃ©cnicas
- [ ] Monitorizar errores

### Post-Lanzamiento
- [ ] Recopilar feedback de usuarios
- [ ] Monitorizar mÃ©tricas de producto
- [ ] Iterar sobre problemas detectados
- [ ] Planificar siguientes sprints

---

*Documento generado a partir de "vozazi_arquitectura_tecnica_completa.md"*

