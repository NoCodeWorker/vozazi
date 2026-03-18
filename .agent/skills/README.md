# VOZAZI Antigravity Skills Index

> Índice de skills creados siguiendo el formato Google Antigravity Skills.

---

## Skills Creados ✅

### Frontend (7 skills)

| Skill | Directorio | Descripción |
|-------|------------|-------------|
| **Next.js App Router** | `frontend/nextjs-app-router/` | App Router, Server Components, Parallel Routes, Streaming, Suspense |
| **Next.js Server Actions** | `frontend/nextjs-server-actions/` | Server-side mutations, form handling, optimistic updates, validation |
| **Next.js Route Handlers** | `frontend/nextjs-route-handlers/` | REST API endpoints, webhooks, rate limiting, external integrations |
| **TypeScript System** | `frontend/typescript-system/` | Type system, generics, utility types, type guards, type-safe patterns |
| **Tailwind CSS** | `frontend/tailwind-css/` | Utility-first styling, responsive design, dark mode, customization |
| **shadcn/ui** | `frontend/shadcn-ui/` | Component library, composition patterns, customization, accessibility |
| **Web Audio API** | `frontend/web-audio-api/` | Audio capture, processing, visualization, pitch detection |

### Backend (1 skill)

| Skill | Directorio | Descripción |
|-------|------------|-------------|
| **Drizzle ORM** | `backend/drizzle-orm/` | Type-safe database operations, schema design, queries, transactions, migrations |

### Audio Engine (2 skills)

| Skill | Directorio | Descripción |
|-------|------------|-------------|
| **FastAPI** | `audio-engine/fastapi/` | APIs de alto rendimiento, WebSockets, validación Pydantic, dependency injection |
| **Python Async** | `audio-engine/python-async/` | Python asíncrono, asyncio, colas, streams, error handling, task management |

### Servicios Externos (4 skills)

| Skill | Directorio | Descripción |
|-------|------------|-------------|
| **Clerk Auth** | `services/clerk-auth/` | Autenticación, protección de rutas, webhooks, gestión de usuarios, roles |
| **Stripe Billing** | `services/stripe-billing/` | Suscripciones, checkout, webhooks, portal de cliente, verificación de acceso |
| **Cloudflare R2** | `services/cloudflare-r2/` | Storage de audio, upload/download, URLs firmadas, lifecycle policies, multipart upload |
| **PostHog Analytics** | `services/posthog-analytics/` | Tracking de eventos, funnels, feature flags, session recording, analytics server-side |

### Audio Engine (5 skills)

| Skill | Directorio | Descripción |
|-------|------------|-------------|
| **FastAPI** | `audio-engine/fastapi/` | APIs de alto rendimiento, WebSockets, validación Pydantic, dependency injection |
| **Python Async** | `audio-engine/python-async/` | Python asíncrono, asyncio, colas, streams, error handling, task management |
| **torchcrepe** | `audio-engine/torchcrepe/` | Pitch detection con deep learning, CREPE, métricas de afinación, tiempo real |
| **librosa** | `audio-engine/librosa/` | Feature extraction espectral, MFCCs, formantes, onset detection, análisis temporal |

### Pedagogía (2 skills)

| Skill | Directorio | Descripción |
|-------|------------|-------------|
| **RAG System** | `pedagogy/rag-system/` | Retrieval-Augmented Generation, embeddings, pgvector, búsqueda híbrida, contexto pedagógico |
| **LLM Integration** | `pedagogy/llm-integration/` | Integración con OpenAI/Anthropic, prompt engineering, caching, rate limiting, validación de respuestas |

### Servicios Externos (1 skill)

| Skill | Directorio | Descripción |
|-------|------------|-------------|
| **Resend Email** | `services/resend-email/` | Emails transaccionales, templates HTML, resúmenes semanales, recordatorios, background jobs |

---

## Skills Pendientes ❌

¡Todos los skills han sido creados! 🎉

---

## Skills Completados

### Audio Engine (3 skills)
- `audio-engine/torchaudio` ✅ - Carga de audio, transforms, spectrograms, resampling
- `audio-engine/essentia` ✅ - Audio descriptors, music analysis, feature aggregation
- `audio-engine/websockets` ✅ - WebSocket protocol, connection management, broadcasting

### Pedagogía (1 skill)
- `pedagogy/vector-databases` ✅ - pgvector, Pinecone, Weaviate, Qdrant operations

---

## Estructura de Directorios

```
.agent/skills/
├── frontend/
│   ├── nextjs-app-router/
│   │   └── SKILL.md ✅
│   ├── nextjs-server-actions/
│   │   └── SKILL.md ✅
│   ├── nextjs-route-handlers/
│   │   └── SKILL.md ✅
│   ├── typescript-system/
│   │   └── SKILL.md ✅
│   ├── tailwind-css/
│   │   └── SKILL.md ✅
│   ├── shadcn-ui/
│   │   └── SKILL.md ✅
│   └── web-audio-api/
│       └── SKILL.md ✅
├── backend/
│   └── drizzle-orm/
│       └── SKILL.md ✅
├── audio-engine/
│   ├── python-async/
│   ├── fastapi/
│   ├── torchaudio/
│   ├── torchcrepe/
│   ├── librosa/
│   ├── essentia/
│   └── websockets/
├── services/
│   ├── clerk-auth/
│   ├── stripe-billing/
│   ├── cloudflare-r2/
│   ├── resend-email/
│   └── posthog-analytics/
├── pedagogy/
│   ├── llm-integration/
│   ├── rag-system/
│   └── vector-databases/
├── architecture/
│   ├── ddd/
│   └── distributed-systems/
├── devops/
│   ├── git-workflow/
│   ├── ci-cd/
│   ├── docker/
│   └── observability/
├── testing/
│   ├── frontend-testing/
│   ├── backend-testing/
│   └── audio-testing/
└── security/
    ├── web-security/
    └── api-security/
```

---

## Resumen Final

- **Total Skills Creados:** 23 ✅
- **Total Skills Pendientes:** 0 ❌
- **Progreso:** 100% 🎉

---

## Skills por Categoría

| Categoría | Skills |
|-----------|--------|
| Frontend | 7 |
| Audio Engine | 5 |
| Backend | 1 |
| Pedagogía | 3 |
| Servicios Externos | 5 |
| Arquitectura | 2 |
| DevOps | 4 |
| Testing | 3 |
| Seguridad | 2 |

---

## Cómo Usar los Skills

Los skills de Antigravity se cargan automáticamente cuando el contexto coincide con su descripción.

### Ubicación de Skills

1. **Workspace (proyecto-specific):** `.agent/skills/`
2. **Global (todos los proyectos):** `~/.gemini/antigravity/skills/`

### Estructura de SKILL.md

```markdown
---
name: skill-identifier
description: Human-readable description for semantic matching
---

# Skill Title

## Goal
Clear statement of what the skill achieves

## Instructions
Detailed logic and steps

## Constraints
"Do not" rules

## Examples
Input/output samples
```

---

*Última actualización: 2026-03-18*
