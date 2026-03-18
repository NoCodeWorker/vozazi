# VOZAZI — Documento de Implementación

> Guía técnica para la construcción del sistema VOZAZI basada en la arquitectura definida.

---

## 1. Visión General del Sistema

VOZAZI es un vocal coach digital premium que combina:
- **Cliente web potente** para captura de audio y feedback inmediato
- **Backend de producto** para orquestación, progreso y suscripciones
- **Plataforma acústica especializada** para análisis vocal profundo
- **Capa pedagógica** para enseñanza y guía contextualizada

---

## 2. Stack Tecnológico

### 2.1 Cliente (Frontend)
| Tecnología | Propósito |
|------------|-----------|
| Next.js | Framework principal |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos y diseño |
| shadcn/ui | Componentes UI |
| Web Audio API | Procesamiento de audio en cliente |
| getUserMedia | Captura de micrófono |
| MediaRecorder | Grabación de audio |
| i18next + react-i18next | Internacionalización (i18n) |
| i18next-cli | Extracción y gestión de traducciones |

### 2.2 Backend de Producto / BFF
| Tecnología | Propósito |
|------------|-----------|
| Next.js Server Actions | Lógica server-side |
| Next.js Route Handlers | APIs REST |
| Vercel | Hosting y despliegue |
| Drizzle ORM | ORM para PostgreSQL |

### 2.3 Base de Datos Principal
| Tecnología | Propósito |
|------------|-----------|
| PostgreSQL | Base de datos relacional |
| jsonb | Métricas flexibles por sesión |

### 2.4 Plataforma Acústica Especializada
| Tecnología | Propósito |
|------------|-----------|
| Python | Lenguaje principal |
| FastAPI | Framework API |
| WebSockets | Comunicación en tiempo real |
| torchaudio | Procesamiento de audio |
| torchcrepe | Pitch tracking con deep learning |
| librosa | Análisis de audio |
| Essentia | Features acústicos |
| RNNoise | Reducción de ruido |
| Silero VAD | Detección de actividad vocal |

### 2.5 Storage de Archivos
| Tecnología | Propósito |
|------------|-----------|
| Cloudflare R2 | Almacenamiento de audio bruto y procesado |

### 2.6 Servicios Externos
| Servicio | Propósito |
|----------|-----------|
| Clerk | Autenticación y gestión de usuarios |
| Stripe | Suscripciones y billing |
| Resend | Email transaccional |
| PostHog | Analítica de producto |

### 2.7 Capa Pedagógica
| Tecnología | Propósito |
|------------|-----------|
| LLM (desacoplado) | Explicaciones y feedback pedagógico |
| Documentación Markdown | Base de conocimiento estructurada |
| RAG | Retrieval de contenido relevante |

---

## 3. Estructura de Repositorios

### 3.1 Repositorio Principal: `vozazi-platform`

```
vozazi/
├── apps/
│   ├── web/                          # Aplicación web principal
│   │   ├── app/
│   │   │   ├── (marketing)/          # Páginas de marketing
│   │   │   ├── (auth)/               # Rutas de autenticación
│   │   │   ├── dashboard/            # Dashboard del usuario
│   │   │   ├── practice/             # Flujo de práctica
│   │   │   ├── history/              # Historial de sesiones
│   │   │   ├── library/              # Biblioteca vocal
│   │   │   ├── billing/              # Gestión de suscripción
│   │   │   └── api/                  # Endpoints API
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── practice/
│   │   │   ├── charts/
│   │   │   ├── library/
│   │   │   ├── billing/
│   │   │   └── shared/
│   │   ├── features/
│   │   │   ├── sessions/
│   │   │   ├── progress/
│   │   │   ├── tasks/
│   │   │   ├── library/
│   │   │   ├── onboarding/
│   │   │   └── subscription/
│   │   ├── lib/
│   │   │   ├── auth/
│   │   │   ├── db/
│   │   │   ├── analytics/
│   │   │   ├── audio/
│   │   │   ├── pedagogy/
│   │   │   └── utils/
│   │   ├── server/
│   │   │   ├── actions/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── mappers/
│   │   └── middleware.ts
│   │
│   └── audio-engine/                 # Servicio de análisis acústico
│       ├── app/
│       │   ├── main.py
│       │   ├── api/
│       │   │   ├── health.py
│       │   │   ├── realtime.py
│       │   │   ├── analysis.py
│       │   │   └── scoring.py
│       │   └── ws/
│       │       └── session_ws.py
│       ├── domain/
│       │   ├── audio/
│       │   ├── metrics/
│       │   ├── scoring/
│       │   ├── taxonomy/
│       │   └── evaluation/
│       ├── pipelines/
│       │   ├── realtime/
│       │   ├── deep/
│       │   └── preprocessing/
│       ├── models/
│       │   ├── pitch/
│       │   ├── classifiers/
│       │   └── fatigue/
│       ├── services/
│       │   ├── ingestion_service.py
│       │   ├── analysis_service.py
│       │   ├── scoring_service.py
│       │   └── asset_processor.py
│       ├── infrastructure/
│       │   ├── storage/
│       │   ├── logging/
│       │   └── settings/
│       ├── tests/
│       └── requirements.txt
│
├── packages/
│   ├── ui/                           # Componentes compartidos
│   ├── db/                           # Esquema Drizzle y migraciones
│   ├── core-domain/                  # Entidades y reglas de negocio
│   ├── analytics/                    # Helpers para PostHog
│   ├── billing/                      # Integración Stripe
│   ├── auth/                         # Utilidades Clerk
│   ├── pedagogy/                     # Plantillas y contexto LLM
│   ├── shared-types/                 # Tipos compartidos
│   └── config/                       # Configuración común
│
├── docs/                             # Base de conocimiento
│   ├── techniques/
│   ├── anatomy/
│   ├── problems/
│   ├── health/
│   └── resources/
│
├── infrastructure/
│   ├── vercel/
│   ├── database/
│   ├── stripe/
│   ├── clerk/
│   ├── resend/
│   ├── posthog/
│   └── r2/
│
├── scripts/
├── .github/
└── README.md
```

### 3.2 Paquetes Compartidos

#### `packages/ui`
- Componentes reutilizables
- Design system
- Bloques visuales de dashboard y práctica

#### `packages/db`
- Esquema Drizzle
- Migraciones
- Seeds
- Acceso tipado a PostgreSQL

#### `packages/core-domain`
- Entidades centrales (Session, Task, Progress, Evaluation)
- Reglas de negocio puras
- Vocabulario del dominio

#### `packages/analytics`
- Nombres de eventos estandarizados
- Helpers para PostHog
- Tracking consistente

#### `packages/billing`
- Adaptadores Stripe
- Mapeo de planes
- Webhooks y utilidades

#### `packages/auth`
- Utilidades de Clerk
- Guards de autenticación
- Helpers de sesión

#### `packages/pedagogy`
- Plantillas de feedback
- Esquemas de contexto para LLM
- Mapeo técnica/error → explicación

#### `packages/shared-types`
- Tipos compartidos entre web y audio-engine
- DTOs
- Contratos entre servicios

#### `packages/config`
- Configuración común
- Env typing
- Constantes del sistema

---

## 4. Esquema de Base de Datos

### 4.1 Entidades Principales

```sql
-- users: Identidad del usuario
CREATE TABLE users (
  id UUID PRIMARY KEY,
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  timezone VARCHAR(50),
  locale VARCHAR(10),
  current_plan VARCHAR(50),
  onboarding_state VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- subscriptions: Estado de suscripción
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan_code VARCHAR(50),
  status VARCHAR(50),
  billing_cycle VARCHAR(20),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- vocal_profiles: Perfil vocal del usuario
CREATE TABLE vocal_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  voice_type_estimated VARCHAR(50),
  range_low_note VARCHAR(10),
  range_high_note VARCHAR(10),
  current_level INTEGER,
  dominant_weakness VARCHAR(50),
  secondary_weakness VARCHAR(50),
  strong_skill VARCHAR(50),
  fatigue_risk_state VARCHAR(50),
  adherence_state VARCHAR(50),
  last_evaluated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- sessions: Prácticas completas
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  session_type VARCHAR(50),
  status VARCHAR(50),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INTEGER,
  overall_score INTEGER,
  primary_focus VARCHAR(50),
  secondary_focus VARCHAR(50),
  dominant_weakness VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- session_segments: Fragmentos de sesión
CREATE TABLE session_segments (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  segment_index INTEGER,
  exercise_code VARCHAR(100),
  exercise_type VARCHAR(50),
  target_note VARCHAR(10),
  target_range_low VARCHAR(10),
  target_range_high VARCHAR(10),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INTEGER,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- session_audio_assets: Referencias a audio
CREATE TABLE session_audio_assets (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  segment_id UUID REFERENCES session_segments(id),
  asset_type VARCHAR(50),
  storage_provider VARCHAR(50),
  storage_key VARCHAR(500),
  mime_type VARCHAR(50),
  sample_rate INTEGER,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  noise_estimate DECIMAL(5,4),
  created_at TIMESTAMP DEFAULT NOW()
);

-- session_metrics: Métricas acústicas
CREATE TABLE session_metrics (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  segment_id UUID REFERENCES session_segments(id),
  metric_scope VARCHAR(50),
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- evaluation_results: Resultados de evaluación
CREATE TABLE evaluation_results (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  segment_id UUID REFERENCES session_segments(id),
  score_total INTEGER,
  score_pitch_accuracy DECIMAL(5,4),
  score_pitch_stability DECIMAL(5,4),
  score_onset_control DECIMAL(5,4),
  score_breath_support DECIMAL(5,4),
  score_consistency DECIMAL(5,4),
  dominant_weakness VARCHAR(50),
  secondary_weakness VARCHAR(50),
  technique_focus VARCHAR(50),
  error_classification VARCHAR(100),
  adaptive_decision VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- tasks: Tareas asignadas
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  source VARCHAR(50),
  status VARCHAR(50),
  title VARCHAR(255),
  exercise_code VARCHAR(100),
  exercise_type VARCHAR(50),
  primary_focus VARCHAR(50),
  secondary_focus VARCHAR(50),
  difficulty_level INTEGER,
  priority INTEGER,
  duration_minutes INTEGER,
  repetitions INTEGER,
  success_criteria JSONB,
  scheduled_for TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- task_runs: Intentos de ejecución
CREATE TABLE task_runs (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  status VARCHAR(50),
  completion_ratio DECIMAL(5,4),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- task_results: Resultados de tareas
CREATE TABLE task_results (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  task_run_id UUID REFERENCES task_runs(id),
  user_id UUID REFERENCES users(id),
  score_total INTEGER,
  completed BOOLEAN,
  dominant_weakness VARCHAR(50),
  adaptive_outcome VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- progress_snapshots: Resúmenes longitudinales
CREATE TABLE progress_snapshots (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  snapshot_type VARCHAR(50),
  period_start TIMESTAMP,
  period_end TIMESTAMP,
  overall_score INTEGER,
  pitch_accuracy_trend VARCHAR(20),
  pitch_stability_trend VARCHAR(20),
  breath_support_trend VARCHAR(20),
  onset_control_trend VARCHAR(20),
  consistency_trend VARCHAR(20),
  dominant_weakness VARCHAR(50),
  strong_skill VARCHAR(50),
  fatigue_risk_state VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- pedagogical_feedback: Feedback generado
CREATE TABLE pedagogical_feedback (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  task_id UUID REFERENCES tasks(id),
  feedback_type VARCHAR(50),
  summary TEXT,
  explanation TEXT,
  recommended_next_step TEXT,
  linked_docs JSONB,
  llm_provider VARCHAR(50),
  prompt_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- knowledge_documents: Base de conocimiento
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50),
  subcategory VARCHAR(50),
  title VARCHAR(255),
  difficulty_level VARCHAR(50),
  risk_level VARCHAR(50),
  related_techniques JSONB,
  related_errors JSONB,
  status VARCHAR(50),
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- knowledge_chunks: Chunks para RAG
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES knowledge_documents(id),
  chunk_index INTEGER,
  chunk_type VARCHAR(50),
  content TEXT,
  metadata JSONB,
  embedding_ref VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- product_events: Eventos de producto
CREATE TABLE product_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  event_name VARCHAR(100),
  event_payload JSONB,
  occurred_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Índices Recomendados

```sql
CREATE INDEX idx_users_clerk ON users(clerk_user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_sessions_user_started ON sessions(user_id, started_at);
CREATE INDEX idx_tasks_user_scheduled ON tasks(user_id, scheduled_for, status);
CREATE INDEX idx_progress_user_type ON progress_snapshots(user_id, snapshot_type, period_start);
CREATE INDEX idx_knowledge_slug ON knowledge_documents(slug);
CREATE INDEX idx_chunks_document ON knowledge_chunks(document_id, chunk_index);
CREATE INDEX idx_events_user_occurred ON product_events(user_id, occurred_at);
```

---

## 5. Arquitectura de Servicios

### 5.1 Session Orchestrator
**Responsable de:**
- Abrir sesión
- Cerrar sesión
- Coordinar pasos del flujo
- Vincular tareas con resultados

### 5.2 Progress Service
**Responsable de:**
- Consolidar resultados
- Generar snapshots
- Calcular evolución por dimensión

### 5.3 Adaptive Training Service
**Responsable de:**
- Decidir próxima tarea
- Ajustar dificultad
- Detectar estancamiento
- Balancear carga de práctica

### 5.4 Knowledge Service
**Responsable de:**
- Servir artículos
- Buscar contenido relevante
- Estructurar docs por categoría

### 5.5 Pedagogical Orchestrator
**Responsable de:**
- Preparar contexto para LLM
- Mezclar métricas + progreso + documentación
- Producir feedback final estructurado

---

## 6. Plataforma Acústica

### 6.1 Audio Ingestion Service
**Responsable de:**
- Recibir stream o chunks
- Validar formato
- Normalizar audio
- Enrutar al pipeline correcto

### 6.2 Realtime Analysis Pipeline
**Responsable de:**
- Feedback rápido
- Nota detectada
- Cents de desviación
- Estabilidad básica

### 6.3 Deep Acoustic Analysis Pipeline
**Responsable de:**
- Limpieza robusta
- VAD preciso
- Pitch tracking fino
- Features avanzadas
- Segmentación útil

### 6.4 Evaluation Engine
**Responsable de:**
- Scoring por ejercicio
- Scoring por sesión
- Detección de debilidad dominante
- Reglas de avance

### 6.5 Audio Asset Processor
**Responsable de:**
- Preparar versiones optimizadas
- Conservar segmentos clave
- Soportar comparativas futuras

---

## 7. Flujo Técnico de una Sesión

```
1. Usuario entra en VOZAZI
2. Clerk valida identidad y permisos
3. Backend carga objetivo del día y tarea actual
4. Frontend inicia captura con getUserMedia
5. Web Audio API prepara señal para visualización inmediata
6. Usuario comienza a cantar
7. Cliente muestra feedback visual inmediato
8. Audio se envía por bloques a la plataforma acústica
9. Audio Ingestion normaliza el flujo
10. Realtime Pipeline devuelve señal para feedback rápido
11. Deep Pipeline ejecuta análisis profundo
12. Evaluation Engine calcula métricas y score
13. Resultados se persisten en PostgreSQL
14. Audio bruto y procesado se guarda en R2
15. Progress Service compara contra histórico
16. Adaptive Training Service calcula siguiente tarea
17. Knowledge Service recupera contenido pedagógico relevante
18. Pedagogical Orchestrator construye contexto completo
19. LLM devuelve explicación, consejo y siguiente paso
20. Frontend muestra resumen y nueva tarea
21. PostHog registra eventos clave
22. Background job puede generar resumen o email posterior
```

---

## 8. Sistema de Scoring

### 8.1 Fórmula Base

```
Score total =
  40% * pitch_accuracy +
  20% * pitch_stability +
  15% * onset_control +
  15% * breath_support +
  10% * consistency
```

### 8.2 Reglas de Progresión

```
si score >= 85 → subir dificultad
si score entre 60-85 → mantener nivel
si score < 60 → repetir con corrección
si cae rendimiento repetidamente → revisar fatiga o exceso de dificultad
```

---

## 9. Taxonomía Vocal

### 9.1 Técnicas Entrenables
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

### 9.2 Tipos de Errores
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

### 9.3 Tipos de Ejercicios
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

---

## 10. Estrategia de Datos

### 10.1 Qué Guardar por Sesión

1. **Audio bruto** - archivo original
2. **Audio procesado** - versión limpiada
3. **Contexto del ejercicio** - tipo, dificultad, objetivo
4. **Métricas acústicas** - pitch, stability, vibrato, etc.
5. **Resultado pedagógico** - debilidad, feedback, recomendación
6. **Contexto temporal** - fecha, hora, posición en sesión
7. **Señales de comportamiento** - completado, repetido, abandonado

### 10.2 Estructura del Dataset

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

## 11. Roadmap de Implementación

### Fase 0 — Fundaciones (Sprint 0)
- Monorepo creado
- Repositorios configurados
- Servicios externos (Clerk, Stripe, R2, PostHog, Resend)
- PostgreSQL + Drizzle configurados

### Fase 1 — Vertical Slice (Sprints 1-3)
- App shell con navegación
- Auth con Clerk
- Práctica básica con getUserMedia
- Persistencia mínima de sesiones

### Fase 2 — Motor Acústico (Sprints 4-6)
- FastAPI levantado
- Endpoints y WebSocket básicos
- Pipeline inicial con torchcrepe
- Primer scoring técnico

### Fase 3 — Progreso (Sprints 7-9)
- Historial visual
- Progress Service
- Snapshots semanales/mensuales
- Comparativas básicas

### Fase 4 — Adaptive Engine v1 (Sprints 10-12)
- Taxonomía aplicada
- Generación de tareas
- Agenda diaria básica
- Adaptación de dificultad simple

### Fase 5 — Knowledge Service (Sprints 13-15)
- Biblioteca básica
- Parser de Markdown
- Chunking inicial
- Enlaces pedagógicos

### Fase 6 — Pedagogical LLM (Sprints 16-18)
- Context builder
- Integración LLM
- Feedback post-sesión
- Grounding pedagógico

### Fase 7 — Premium Real (Sprints 19-21)
- Métricas avanzadas
- UX premium refinada
- Seguridad y salud vocal

### Fase 8 — Escalabilidad (Sprints 22-24)
- Observabilidad seria
- Optimización de latencia
- Hardening del sistema

---

## 12. Contratos entre Servicios

### 12.1 Contrato Web ↔ Audio-Engine

**Request:**
```json
{
  "session_id": "s_123",
  "task_id": "t_456",
  "audio_chunk_url": "...",
  "expected_target": "A4",
  "exercise_type": "sustain_note"
}
```

**Response:**
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

## 13. Variables de Entorno

### 13.1 Apps/Web (.env)
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vozazi-audio

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
POSTHOG_HOST=https://app.posthog.com

# Resend
RESEND_API_KEY=re_...

# Audio Engine
AUDIO_ENGINE_URL=https://audio-engine.vozazi.com
AUDIO_ENGINE_WS_URL=wss://audio-engine.vozazi.com
```

### 13.3 Apps/Web - i18n (.env)
```env
# Idioma por defecto
NEXT_PUBLIC_DEFAULT_LOCALE=es

# Idiomas soportados (comma-separated)
NEXT_PUBLIC_SUPPORTED_LOCALES=es,en,pt,fr,de,it

# Locize (opcional, para gestión profesional de traducciones)
LOCIZE_PROJECT_ID=...
LOCIZE_API_KEY=...
```

### 13.4 Apps/Audio-Engine (.env)
```env
# API
HOST=0.0.0.0
PORT=8000

# Storage
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vozazi-audio

# Database
DATABASE_URL=postgresql://...

# Models
TORCHCREPE_MODEL=full
VAD_MODEL=silero_vad

# Logging
LOG_LEVEL=INFO
```

---

## 14. Consideraciones de Despliegue

### 14.1 Vercel (Web App)
- Configurar variables de entorno
- Habilitar Server Functions
- Configurar dominios personalizados
- Habilitar logs y observabilidad

### 14.2 Audio-Engine (Python/FastAPI)
- Desplegar en servidor dedicado o contenedor
- Configurar auto-escalado
- Habilitar WebSockets
- Configurar health checks

### 14.3 PostgreSQL
- Usar servicio gestionado (Supabase, Neon, RDS)
- Configurar backups automáticos
- Habilitar conexión SSL
- Configurar pool de conexiones

### 14.4 Cloudflare R2
- Configurar bucket privado
- Habilitar CORS para el dominio
- Configurar políticas de retención
- Habilitar versionado si es necesario

---

## 16. Internacionalización (i18n)

### 16.1 Idiomas Soportados

| Código | Idioma | Estado |
|--------|--------|--------|
| `es` | Español | ✅ Default |
| `en` | English | 🟡 Parcial |
| `pt` | Português | 🟡 Parcial |
| `fr` | Français | ⏳ Pendiente |
| `de` | Deutsch | ⏳ Pendiente |
| `it` | Italiano | ⏳ Pendiente |

### 16.2 Comandos i18n

```bash
# Extraer claves del código fuente
npm run i18n:extract

# Ver estado de traducciones
npm run i18n:status

# Sincronizar idiomas
npm run i18n:sync

# Lint de strings hardcoded
npm run i18n:lint

# Generar tipos TypeScript
npm run i18n:types
```

### 16.3 Uso en Componentes

```tsx
'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function WelcomeCard() {
  const { t, language, changeLanguage } = useTranslation('common')
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('app_description')}</p>
      <LanguageSwitcher />
    </div>
  )
}
```

### 16.4 Namespaces

- `common` - Textos comunes (auth, validación, errores)
- `translation` - Textos generales
- `dashboard` - Dashboard del usuario
- `practice` - Flujo de práctica
- `billing` - Facturación y planes
- `library` - Biblioteca vocal
- `onboarding` - Flujo de onboarding

---

## 17. Testing UI/UX

### 17.1 Tipos de Tests

| Tipo | Herramienta | Propósito |
|------|-------------|-----------|
| **Unit Tests** | Vitest | Componentes y utilidades |
| **Integration Tests** | Testing Library | Interacción entre componentes |
| **E2E Tests** | Playwright | Flujos completos |
| **Visual Regression** | Playwright Screenshots | Detección de cambios visuales |
| **Accessibility** | axe-core | Verificación de accesibilidad |
| **UX Flows** | Playwright | Experiencia de usuario |
| **API Integration** | Vitest + MSW | Endpoints y server actions |
| **WebSocket** | Vitest | Comunicación en tiempo real |
| **Performance** | Vitest | Métricas de rendimiento |
| **Security** | Vitest | Vulnerabilidades |
| **Audio Processing** | pytest | Pipeline de audio |
| **MCP Clients** | pytest | Servicios externos |

### 17.2 Comandos de Test

```bash
cd apps/web

# Todos los tests
npm run test

# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Visual regression tests
npx playwright test e2e/visual-regression.spec.ts

# Accessibility tests
npx playwright test e2e/accessibility.spec.ts

# UX flow tests
npx playwright test e2e/ux-flows.spec.ts

# API integration tests
npm run test -- api-integration

# WebSocket tests
npm run test -- websocket

# Performance tests
npm run test -- performance

# Security tests
npm run test -- security

# Coverage
npm run test:coverage

# UI mode (interactive)
npm run test:ui
```

```bash
cd apps/audio-engine

# Todos los tests
pytest

# Audio processing tests
pytest tests/test_audio_processing.py

# MCP client tests
pytest tests/test_mcp_clients.py

# Con coverage
pytest --cov=app

# Tests específicos por categoría
pytest tests/ -k "pitch"
pytest tests/ -k "vad"
pytest tests/ -k "scoring"
```

### 17.3 Tests de Regresión Visual

```typescript
// e2e/visual-regression.spec.ts
test('homepage should look the same', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage-full.png', {
    fullPage: true,
    maxDiffPixels: 100,
  })
})

test('dark mode homepage', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await expect(page).toHaveScreenshot('homepage-dark.png')
})
```

### 17.4 Tests de Accesibilidad

```typescript
// e2e/accessibility.spec.ts
import AxeBuilder from '@axe-core/playwright'

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('all images should have alt text', async ({ page }) => {
  await page.goto('/')
  const images = page.locator('img')
  const count = await images.count()
  
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt')
    expect(alt !== null).toBeTruthy()
  }
})
```

### 17.5 Tests de Flujos UX

```typescript
// e2e/ux-flows.spec.ts
test('complete onboarding flow', async ({ page }) => {
  await page.goto('/onboarding')
  
  // Step 1: Welcome
  await page.click('[data-testid="next-button"]')
  
  // Step 2: Goals
  await page.click('[data-testid="goal-improve-pitch"]')
  await page.click('[data-testid="next-button"]')
  
  // Should redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/)
})

test('keyboard navigation', async ({ page }) => {
  await page.goto('/')
  
  // Tab through all elements
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  }
})
```

### 17.6 Tests de API Integration

```typescript
// src/lib/__tests__/api-integration.test.ts
describe('POST /api/audio/upload', () => {
  it('should create presigned upload URL', async () => {
    const response = await fetch('/api/audio/upload', {
      method: 'POST',
      body: JSON.stringify({ filename: 'test.wav' })
    })
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.uploadUrl).toBeDefined()
  })
})
```

### 17.7 Tests de WebSocket

```typescript
// src/lib/__tests__/websocket.test.ts
test('should receive real-time pitch feedback', () => {
  ws.simulateMessage({
    type: 'pitch_feedback',
    note: 'A4',
    cents: -5,
    confidence: 0.95
  })
  
  expect(feedbackHandler).toHaveBeenCalledWith({
    type: 'pitch_feedback',
    note: 'A4',
    cents: -5
  })
})
```

### 17.8 Tests de Audio Processing (Python)

```python
# tests/test_audio_processing.py
def test_pitch_accuracy_calculation():
    accuracy = calculate_pitch_accuracy(
        detected_freqs=[440.0, 440.0, 440.0],
        target_freq=440.0
    )
    assert accuracy > 0.95

def test_overall_score_calculation():
    metrics = {
        'pitch_accuracy': 0.85,
        'pitch_stability': 0.78,
        'breath_support': 0.72
    }
    score = calculate_overall_score(metrics)
    assert 70 <= score <= 85
```

### 17.9 Estructura de Tests

```
apps/web/
├── e2e/
│   ├── home.spec.ts
│   ├── visual-regression.spec.ts
│   ├── accessibility.spec.ts
│   └── ux-flows.spec.ts
├── src/
│   ├── components/__tests__/
│   ├── lib/__tests__/
│   │   ├── api-integration.test.ts
│   │   ├── websocket.test.ts
│   │   ├── performance.test.ts
│   │   └── security.test.ts
│   └── app/api/**/__tests__/
└── vitest.config.ts

apps/audio-engine/
├── tests/
│   ├── conftest.py
│   ├── test_health.py
│   ├── test_audio_processing.py
│   └── test_mcp_clients.py
└── pyproject.toml
```

### 17.10 Best Practices

**Data Test IDs:**
```tsx
// Usar data-testid para selectors de test
<button data-testid="start-practice">Comenzar</button>

// Evitar selectors frágiles
// ❌ MAL: button:nth-child(3)
// ✅ BIEN: [data-testid="start-practice"]
```

**Esperar estados:**
```typescript
// Esperar carga completa
await page.waitForLoadState('networkidle')

// Esperar elemento específico
await expect(page.getByTestId('content')).toBeVisible()

// Esperar timeout para animaciones
await page.waitForTimeout(1000)
```

**Screenshots:**
```typescript
// Configurar umbrales razonables
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixels: 100,  // Píxeles diferentes permitidos
  fullPage: true,       // Capturar toda la página
})
```

**Fixtures en Python:**
```python
# tests/conftest.py
@pytest.fixture
def sample_audio_file(tmp_path):
    return create_wav_file(tmp_path / 'test.wav')

@pytest.fixture
async def db_session():
    session = await db_mcp.get_session().__aenter__()
    yield session
    await session.close()
```

---

## 18. Próximos Pasos

1. **Inicializar repositorios** - Crear estructura base del monorepo
2. **Configurar servicios externos** - Clerk, Stripe, R2, PostHog, Resend
3. **Configurar base de datos** - PostgreSQL + Drizzle ORM
4. **Implementar auth** - Integración con Clerk
5. **Implementar i18n** - Configurar i18next CLI y traducciones iniciales
6. **Crear app shell** - Layout, navegación, rutas básicas
7. **Implementar tests UI/UX** - Visual regression, accessibility, UX flows
8. **Implementar práctica básica** - getUserMedia + feedback visual
9. **Conectar audio-engine** - Primer pipeline de análisis
10. **Implementar scoring** - Primeras métricas y evaluación
11. **Construir progreso** - Historial y snapshots
12. **Implementar adaptive engine** - Generación de tareas

---

*Documento generado a partir de "vozazi_arquitectura_tecnica_completa.md"*
*Actualizado: 2026-03-18 - Con i18n y tests UI/UX integrados*

*Documento generado a partir de "vozazi_arquitectura_tecnica_completa.md"*
*Actualizado: 2026-03-18 - Con i18n integrado*
