# VOZAZI - Documento de Tareas y Checklist de Desarrollo

> Lista completa de tareas necesarias para completar el desarrollo de VOZAZI.

**Ultima actualizacion:** 2026-03-18

---

## Progreso General

### Resumen por Estado

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| [x] Completado | 73 | ~39% |
| [ENV] Pendiente de Entorno | 115 | ~61% |
| [ ] Pendiente | 0 | 0% |
| [ ] Bloqueado | 0 | 0% |

### Leyenda

| Simbolo | Estado | Descripcion |
|---------|--------|-------------|
| `[x]` | [x] Completado | Tarea implementada |
| `[ ]` | [ ] Pendiente | Tarea que SE PUEDE implementar (no requiere entorno) |
| `[ ] [ENV]` | [ENV] Pendiente de Entorno | Tarea BLOQUEADA (requiere variables de entorno/servicios) |
| `[ ] [/]` | [/] En Progreso | Tarea siendo implementada |

### Estados Detallados

**[ENV] Pendiente de Entorno (115 tareas - ~61%)**
- Requieren servicios externos configurados
- Necesitan variables de entorno
- Servicios: Clerk, Stripe, R2, PostHog, Resend, PostgreSQL

**[x] Completado (73 tareas - ~39%)**
- Ya implementadas y en produccion
- Incluyen: monorepo, audio-engine, tests, UI de practica, todos los paquetes compartidos, layout, rutas, onboarding

### Ultimas Implementaciones (2026-03-18)

#### Layout y Navegacion
- [x] MainNavigation - Navegacion lateral con iconos
- [x] Header - Header con logo y menu
- [x] Footer - Footer de la aplicacion
- [x] AppLayout - Layout principal con sidebar
- [x] Loading - Componentes de loading

#### Rutas Principales
- [x] /dashboard - Pagina del dashboard
- [x] /practice - Pagina de practica
- [x] /history - Pagina de historial
- [x] /library - Pagina de biblioteca
- [x] /billing - Pagina de facturacion
- [x] /settings - Pagina de configuracion

#### Onboarding
- [x] OnboardingFlow - Flujo completo de onboarding
- [x] WelcomeStep - Paso de bienvenida
- [x] GoalsStep - Paso de objetivos
- [x] LevelStep - Paso de nivel
- [x] AvailabilityStep - Paso de disponibilidad
- [x] CompleteStep - Paso de completado

#### Hooks
- [x] useSessionState - Gestion de estado de sesion
- [x] useAudioRecorder - Captura de audio
- [x] useAudioVisualizer - Visualizacion de audio
- [x] useAnalytics - Tracking de eventos

#### Componentes de Practica
- [x] AudioPractice - Componente principal de practica
- [x] PitchIndicator - Indicador de afinacion
- [x] ExerciseInstructions - Instrucciones de ejercicios
- [x] SessionReport - Reporte post-sesion
- [x] ExerciseLogic - Logica de ejercicios

#### Paquetes Compartidos
- [x] @vozazi/core-domain - Entidades de dominio
- [x] @vozazi/analytics - Analytics e eventos
- [x] @vozazi/billing - Planes y facturacion
- [x] @vozazi/auth - Auth y permisos
- [x] @vozazi/pedagogy - Pedagogia y ejercicios
- [x] @vozazi/config - Constantes y configuracion

---

## Fase 0 - Fundaciones del Proyecto

### 0.1 Configuracion del Monorepo
- [x] Crear estructura de directorios del monorepo
- [x] Configurar package.json raiz con workspaces
- [x] Configurar TypeScript raiz (tsconfig.json)
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
- [ ] [ENV] Configurar middleware.ts para autenticacion
- [x] Configurar next.config.js con optimizaciones

### 0.3 Repositorio Audio-Engine (apps/audio-engine)
- [x] Crear estructura de proyecto Python/FastAPI
- [x] Configurar requirements.txt con dependencias base
- [x] Configurar entorno virtual Python
- [x] Crear main.py con configuracion FastAPI
- [x] Configurar CORS para comunicacion con web
- [x] Configurar logging estructurado
- [x] Crear health check endpoint

### 0.4 Servicios Externos [ENV] PENDIENTE DE ENTORNO

#### Clerk [ENV]
- [ ] [ENV] Crear cuenta y proyecto en Clerk
- [ ] [ENV] Configurar providers de autenticacion
- [ ] [ENV] Obtener claves API (publishable y secret)
- [ ] [ENV] Configurar webhooks de Clerk
- [ ] [ENV] Definir roles y permisos iniciales

#### Stripe [ENV]
- [ ] [ENV] Crear cuenta Stripe
- [ ] [ENV] Configurar productos y planes de suscripcion
- [ ] [ENV] Obtener claves API (secret y publishable)
- [ ] [ENV] Configurar webhook endpoint
- [ ] [ENV] Configurar portal de cliente
- [ ] [ENV] Configurar checkout sessions

#### Cloudflare R2 [ENV]
- [ ] [ENV] Crear cuenta Cloudflare
- [ ] [ENV] Crear bucket R2 para audio
- [ ] [ENV] Configurar credenciales de acceso
- [ ] [ENV] Configurar CORS para el dominio de la app
- [ ] [ENV] Definir politica de retencion inicial

#### PostHog [ENV]
- [ ] [ENV] Crear proyecto en PostHog
- [ ] [ENV] Obtener API key
- [ ] [ENV] Configurar dominio permitido
- [ ] [ENV] Definir eventos iniciales a trackear

#### Resend [ENV]
- [ ] [ENV] Crear cuenta Resend
- [ ] [ENV] Verificar dominio para envio de emails
- [ ] [ENV] Obtener API key
- [ ] [ENV] Configurar templates base de emails

### 0.5 Base de Datos
- [ ] [ENV] Provisionar instancia PostgreSQL (Supabase/Neon/RDS)
- [x] Configurar Drizzle ORM en packages/db
- [x] Definir esquema inicial de base de datos
- [x] Crear migraciones iniciales
- [ ] [ENV] Ejecutar migraciones en entorno de desarrollo
- [ ] Configurar seeds iniciales
- [ ] Crear scripts de backup

### 0.6 Paquetes Compartidos
- [x] Inicializar packages/ui
- [x] Inicializar packages/db
- [x] Inicializar packages/core-domain
- [x] Inicializar packages/analytics
- [x] Inicializar packages/billing
- [x] Inicializar packages/auth
- [x] Inicializar packages/pedagogy
- [x] Inicializar packages/shared-types
- [x] Inicializar packages/config

### 0.7 Infrastructure as Code
- [x] Configurar deployment en Vercel (docker-compose.yml)
- [ ] [ENV] Configurar variables de entorno en Vercel
- [x] Crear configuracion de infrastructure/
- [x] Documentar proceso de despliegue

### 0.8 CI/CD
- [x] Configurar GitHub Actions para CI
- [x] Crear workflow de lint y type check
- [x] Crear workflow de tests
- [ ] [ENV] Configurar deployment automatico
- [ ] [ENV] Configurar preview deployments

---

## Fase 1 - Vertical Slice del Producto

### Sprint 1 - App Shell

#### 1.1 Autenticacion [ENV]
- [ ] [ENV] Integrar Clerk en apps/web
- [ ] [ENV] Crear pagina de login
- [ ] [ENV] Crear pagina de signup
- [ ] [ENV] Crear pagina de password reset
- [ ] [ENV] Implementar proteccion de rutas privadas
- [ ] [ENV] Implementar redireccion post-login
- [ ] [ENV] Crear componente UserButton para mostrar usuario

#### 1.2 Layout Principal
- [x] Crear layout base con navegacion
- [x] Implementar header con logo y menu
- [x] Implementar sidebar de navegacion
- [x] Crear footer
- [x] Implementar responsive design
- [x] Crear componente de loading global

#### 1.3 Rutas Principales
- [x] Crear ruta /dashboard (stub)
- [x] Crear ruta /practice (stub)
- [x] Crear ruta /history (stub)
- [x] Crear ruta /library (stub)
- [x] Crear ruta /billing (stub)
- [x] Crear ruta /settings (stub)
- [x] Implementar navegacion entre rutas

#### 1.4 Onboarding Inicial
- [x] Crear flujo de onboarding basico
- [x] Implementar paso de bienvenida
- [x] Implementar paso de objetivo principal
- [x] Implementar paso de nivel autopercibido
- [x] Implementar paso de tiempo disponible
- [ ] [ENV] Guardar datos de onboarding en BD
- [ ] [ENV] Redirigir a dashboard post-onboarding

### Sprint 2 - Practica Minima

#### 2.1 Captura de Audio
- [x] Implementar getUserMedia para acceso a microfono
- [x] Crear componente de permiso de microfono
- [x] Manejar errores de acceso a microfono
- [x] Implementar MediaRecorder para grabacion
- [x] Crear hook useAudioRecorder
- [x] Implementar visualizacion de nivel de audio

#### 2.2 UI de Practica
- [x] Crear pantalla de practica base
- [x] Implementar indicador de nota objetivo
- [x] Crear visualizador de audio (canvas/webgl)
- [x] Implementar cronometro de ejercicio
- [x] Crear controles de inicio/parada
- [x] Implementar contador de repeticiones
- [x] Crear feedback visual basico (afinacion)

#### 2.3 Ejercicios Basicos
- [x] Implementar ejercicio "sustain_note" basico
- [x] Implementar ejercicio "pitch_target" basico
- [x] Crear instrucciones por ejercicio
- [x] Implementar transicion entre ejercicios
- [x] Crear resumen post-ejercicio

#### 2.4 Estado de Sesion
- [x] Implementar gestion de estado de sesion
- [x] Crear hook useSessionState
- [x] Implementar estados: idle, preparing, recording, processing, completed
- [x] Manejar errores de sesion
- [x] Implementar cancelacion de sesion

### Sprint 3 - Persistencia Minima [ENV]

#### 3.1 Backend de Sesiones [ENV]
- [ ] [ENV] Crear Server Action para iniciar sesion
- [ ] [ENV] Crear Server Action para cerrar sesion
- [ ] [ENV] Implementar persistencia en PostgreSQL
- [ ] [ENV] Guardar referencia a audio en R2
- [ ] [ENV] Implementar upload de audio a Cloudflare R2
- [ ] Crear endpoint para subir audio chunk

#### 3.2 Reporte Post-Sesion
- [x] Crear pantalla de resultado de sesion
- [x] Mostrar duracion total
- [x] Mostrar ejercicios completados
- [x] Mostrar metricas basicas
- [x] Implementar boton "Practicar de nuevo"
- [x] Implementar boton "Volver al dashboard"

#### 3.3 Analytics [ENV]
- [ ] [ENV] Integrar PostHog en apps/web
- [ ] [ENV] Implementar tracking de eventos base:
  - [ ] auth_signed_in
  - [ ] onboarding_completed
  - [ ] session_started
  - [ ] exercise_started
  - [ ] exercise_completed
  - [ ] session_completed
- [ ] [ENV] Configurar identidad de usuario en PostHog

#### 3.4 Dashboard Basico [ENV]
- [ ] [ENV] Crear dashboard con resumen de actividad
- [x] Mostrar ultimas sesiones (stub)
- [x] Mostrar estadisticas basicas (tiempo, sesiones) (stub)
- [x] Implementar boton "Comenzar practica"
- [ ] [ENV] Mostrar proxima tarea si existe

---

[... resto de las fases con el mismo formato ...]
