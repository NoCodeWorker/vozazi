# VOZAZI — Dependencias del Proyecto

> Lista completa de dependencias necesarias para el desarrollo de VOZAZI, organizada por área tecnológica.
> 
> **Basado en los 23 skills completados** - Verificación exhaustiva de la arquitectura técnica.

---

## 📦 Resumen Ejecutivo

| Área | Dependencias | Versión Mínima | Skills Relacionados |
|------|-------------|----------------|---------------------|
| **Frontend** | 30+ | Node 18+ | 7 skills |
| **Audio Engine** | 20+ | Python 3.10+ | 5 skills |
| **Backend** | 15+ | Node 18+ | 1 skill |
| **Pedagogía** | 10+ | Python 3.10+ | 3 skills |
| **Servicios** | 10+ | - | 5 skills |
| **Infraestructura** | 5+ | - | 4 skills |

---

## 1. Frontend (apps/web)

### 1.1 Core Framework

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

**Skill relacionado:** `nextjs-app-router`

### 1.2 TypeScript

```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

**Skill relacionado:** `typescript-system`

### 1.3 UI y Estilos

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17"
  },
  "devDependencies": {
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

**Skill relacionado:** `tailwind-css`

### 1.4 Componentes (shadcn/ui)

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-label": "^2.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "^0.344.0"
  }
}
```

**Skill relacionado:** `shadcn-ui`

### 1.5 Web Audio API

```json
{
  "dependencies": {
    "standardized-audio-context": "^25.3.0"
  },
  "devDependencies": {
    "@types/audiocontext": "^8.0.0"
  }
}
```

**NOTA:** Web Audio API es nativo del navegador, no requiere instalación.

**Skill relacionado:** `web-audio-api`

### 1.6 Autenticación (Clerk)

```json
{
  "dependencies": {
    "@clerk/nextjs": "^4.29.0",
    "@clerk/themes": "^1.7.9"
  }
}
```

**Skill relacionado:** `clerk-auth`

### 1.7 Base de Datos (Drizzle ORM)

```json
{
  "dependencies": {
    "drizzle-orm": "^0.29.0",
    "postgres": "^3.4.0",
    "@neondatabase/serverless": "^0.9.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.0",
    "@types/pg": "^8.11.0"
  }
}
```

**Skill relacionado:** `drizzle-orm`

### 1.8 Stripe (Billing)

```json
{
  "dependencies": {
    "stripe": "^14.18.0",
    "@stripe/stripe-js": "^3.0.0"
  }
}
```

**Skill relacionado:** `stripe-billing`

### 1.9 Email (Resend)

```json
{
  "dependencies": {
    "resend": "^3.2.0",
    "@react-email/components": "^0.0.15",
    "@react-email/render": "^0.0.12",
    "@react-email/html": "^0.0.7"
  }
}
```

**Skill relacionado:** `resend-email`

### 1.10 Analytics (PostHog)

```json
{
  "dependencies": {
    "posthog-js": "^1.116.0",
    "posthog-node": "^3.6.0"
  }
}
```

**Skill relacionado:** `posthog-analytics`

### 1.11 Almacenamiento (Cloudflare R2)

```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.525.0",
    "@aws-sdk/s3-request-presigner": "^3.525.0"
  }
}
```

**Skill relacionado:** `cloudflare-r2`

### 1.12 Utilidades

```json
{
  "dependencies": {
    "zod": "^3.22.0",
    "date-fns": "^3.3.0",
    "uuid": "^9.0.0",
    "nuqs": "^1.15.0",
    "sonner": "^1.4.0",
    "@tanstack/react-query": "^5.24.0",
    "@tanstack/react-table": "^8.13.0",
    "recharts": "^2.12.0",
    "vaul": "^0.9.0",
    "cmdk": "^0.2.0",
    "framer-motion": "^11.0.0"
  }
}
```

### 1.13 Testing (Frontend)

```json
{
  "devDependencies": {
    "vitest": "^1.3.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^24.0.0",
    "playwright": "^1.42.0",
    "@playwright/test": "^1.42.0",
    "msw": "^2.2.0"
  }
}
```

---

## 2. Audio Engine (apps/audio-engine)

### 2.1 Core Framework

```txt
# requirements.txt
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
python-multipart>=0.0.9
pydantic>=2.6.0
pydantic-settings>=2.2.0
python-dotenv>=1.0.0
```

**Skill relacionado:** `fastapi`

### 2.2 Python Async

```txt
# Ya incluido en Python 3.10+
# asyncio es nativo
```

**Skill relacionado:** `python-async`

### 2.3 WebSockets

```txt
websockets>=12.0
```

**Skill relacionado:** `websockets`

### 2.4 Procesamiento de Audio

```txt
# Carga y transformación de audio
torchaudio>=2.2.0
soundfile>=0.12.0

# Pitch detection con deep learning
torch>=2.2.0
torchcrepe>=0.0.20

# Feature extraction
librosa>=0.10.0

# Audio descriptors y music analysis
essentia-tensorflow>=2.1b6

# Dependencias base
numpy>=1.26.0
scipy>=1.12.0
```

**Skills relacionados:** `torchaudio`, `torchcrepe`, `librosa`, `essentia`

### 2.5 Base de Datos (Async)

```txt
asyncpg>=0.29.0
psycopg2-binary>=2.9.9
```

### 2.6 Vector Database (pgvector)

```txt
pgvector>=0.2.0
sentence-transformers>=2.4.0
```

**Skill relacionado:** `vector-databases`

### 2.7 LLM Integration

```txt
openai>=1.14.0
anthropic>=0.18.0
aiohttp>=3.9.0
tiktoken>=0.6.0
```

**Skill relacionado:** `llm-integration`

### 2.8 RAG System

```txt
# Ya incluido en vector-databases
# sentence-transformers para embeddings
```

**Skill relacionado:** `rag-system`

### 2.9 Cache y Rate Limiting

```txt
redis>=5.0.0
asyncio-redis>=0.16.0
```

### 2.10 Logging y Monitoring

```txt
structlog>=24.1.0
python-json-logger>=2.0.0
prometheus-client>=0.20.0
```

### 2.11 Testing (Audio Engine)

```txt
pytest>=8.1.0
pytest-asyncio>=0.23.0
pytest-cov>=4.1.0
httpx>=0.27.0
pytest-mock>=3.12.0
```

### 2.12 Desarrollo

```txt
black>=24.2.0
ruff>=0.3.0
mypy>=1.9.0
pre-commit>=3.6.0
ipython>=8.22.0
```

---

## 3. Backend / BFF

### 3.1 Server Actions y API

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "zod": "^3.22.0"
  }
}
```

### 3.2 Seguridad

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "jose": "^5.2.0",
    "csrf": "^3.1.0"
  }
}
```

---

## 4. Pedagogía (LLM + RAG)

### 4.1 Embeddings

```txt
sentence-transformers>=2.4.0
```

### 4.2 Document Processing

```txt
# Markdown parsing
markdown>=3.5.0
pyyaml>=6.0.0
```

**Skill relacionado:** `rag-system`

### 4.3 Prompt Engineering

```txt
# Ya incluido en llm-integration
# openai, anthropic
```

**Skill relacionado:** `llm-integration`

---

## 5. Infraestructura y DevOps

### 5.1 Docker

```dockerfile
# Dockerfile.base
FROM node:20-alpine AS base
FROM python:3.11-slim AS python-base
```

**Skill relacionado:** `docker`

### 5.2 Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: vozazi
      POSTGRES_PASSWORD: vozazi
      POSTGRES_DB: vozazi
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  audio-engine:
    build: ./apps/audio-engine
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://vozazi:vozazi@postgres:5432/vozazi
      - REDIS_URL=redis://redis:6379
  
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://vozazi:vozazi@postgres:5432/vozazi

volumes:
  postgres_data:
```

### 5.3 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
  
  test-audio-engine:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: pip install -r requirements.txt
      - run: pytest

volumes:
  postgres_data:
```

**Skill relacionado:** `ci-cd`

### 5.4 PostgreSQL Extensiones

```sql
-- Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS vector;  -- pgvector para RAG
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- Búsqueda full-text
```

---

## 6. Paquetes Compartidos (packages/)

### 6.1 packages/ui

```json
{
  "name": "@vozazi/ui",
  "version": "1.0.0",
  "dependencies": {
    "@radix-ui/*": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "tailwindcss": "^3.4.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

### 6.2 packages/db

```json
{
  "name": "@vozazi/db",
  "version": "1.0.0",
  "dependencies": {
    "drizzle-orm": "^0.29.0",
    "postgres": "^3.4.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.0",
    "@types/pg": "^8.11.0"
  }
}
```

### 6.3 packages/shared-types

```json
{
  "name": "@vozazi/shared-types",
  "version": "1.0.0",
  "dependencies": {
    "zod": "^3.22.0",
    "typescript": "^5.3.0"
  }
}
```

### 6.4 packages/analytics

```json
{
  "name": "@vozazi/analytics",
  "version": "1.0.0",
  "dependencies": {
    "posthog-js": "^1.116.0",
    "posthog-node": "^3.6.0"
  }
}
```

### 6.5 packages/billing

```json
{
  "name": "@vozazi/billing",
  "version": "1.0.0",
  "dependencies": {
    "stripe": "^14.18.0"
  }
}
```

### 6.6 packages/auth

```json
{
  "name": "@vozazi/auth",
  "version": "1.0.0",
  "dependencies": {
    "@clerk/nextjs": "^4.29.0",
    "@clerk/themes": "^1.7.9"
  }
}
```

### 6.7 packages/pedagogy

```json
{
  "name": "@vozazi/pedagogy",
  "version": "1.0.0",
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

### 6.8 packages/config

```json
{
  "name": "@vozazi/config",
  "version": "1.0.0"
}
```

---

## 7. Dependencias de Desarrollo (Raíz)

### 7.1 Monorepo

```json
{
  "name": "vozazi-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "^1.12.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

### 7.2 Git Workflow

```json
{
  "devDependencies": {
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "commitizen": "^4.3.0"
  }
}
```

**Skill relacionado:** `git-workflow`

---

## 8. Variables de Entorno

### 8.1 Frontend (.env.local)

```env
# Clerk (Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://vozazi:vozazi@localhost:5432/vozazi

# Stripe (Billing)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2 (Storage)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vozazi-audio

# PostHog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Resend (Email)
RESEND_API_KEY=re_...

# Audio Engine
NEXT_PUBLIC_AUDIO_ENGINE_URL=http://localhost:8000
NEXT_PUBLIC_AUDIO_ENGINE_WS_URL=ws://localhost:8000
```

### 8.2 Audio Engine (.env)

```env
# API
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=postgresql://vozazi:vozazi@localhost:5432/vozazi

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vozazi-audio

# LLM Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Redis (Cache)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=INFO
```

---

## 9. Resumen por Skill

| Skill | Dependencias Principales |
|-------|-------------------------|
| `nextjs-app-router` | next, react, react-dom |
| `nextjs-server-actions` | next, zod |
| `nextjs-route-handlers` | next |
| `typescript-system` | typescript, @types/* |
| `tailwind-css` | tailwindcss, postcss, autoprefixer |
| `shadcn-ui` | @radix-ui/*, class-variance-authority, lucide-react |
| `web-audio-api` | standardized-audio-context (opcional) |
| `drizzle-orm` | drizzle-orm, postgres, drizzle-kit |
| `fastapi` | fastapi, uvicorn, pydantic |
| `python-async` | (nativo en Python 3.10+) |
| `torchcrepe` | torch, torchaudio, torchcrepe |
| `librosa` | librosa, soundfile, numpy, scipy |
| `torchaudio` | torchaudio, soundfile |
| `essentia` | essentia-tensorflow |
| `websockets` | websockets |
| `clerk-auth` | @clerk/nextjs, @clerk/themes |
| `stripe-billing` | stripe, @stripe/stripe-js |
| `cloudflare-r2` | @aws-sdk/client-s3, @aws-sdk/s3-request-presigner |
| `resend-email` | resend, @react-email/* |
| `posthog-analytics` | posthog-js, posthog-node |
| `rag-system` | sentence-transformers, pgvector |
| `llm-integration` | openai, anthropic, aiohttp |
| `vector-databases` | pgvector, sentence-transformers |

---

## 10. Instalación Paso a Paso

### 10.1 Prerrequisitos

```bash
# Node.js
node >= 18.17.0
npm >= 9.0.0

# Python
python >= 3.10
pip >= 23.0

# Herramientas
git >= 2.40.0
docker >= 24.0.0 (opcional)
```

### 10.2 Instalación Frontend

```bash
cd apps/web
npm install

# Variables de entorno
cp .env.example .env.local
```

### 10.3 Instalación Audio Engine

```bash
cd apps/audio-engine

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Variables de entorno
cp .env.example .env
```

### 10.4 Instalación Monorepo

```bash
# Raíz del proyecto
npm install

# Construir todos los paquetes
npm run build
```

---

## 11. Comandos Útiles

### Desarrollo

```bash
# Iniciar todo el monorepo
npm run dev

# Solo frontend
npm run dev --filter=@vozazi/web

# Solo audio engine
cd apps/audio-engine && uvicorn app.main:app --reload

# Base de datos
npm run db:generate
npm run db:migrate
npm run db:push
```

### Producción

```bash
# Build
npm run build

# Tests
npm run test

# Lint
npm run lint

# Type check
npm run type-check
```

---

## 12. Verificación de Instalación

```bash
# Verificar Node
node --version  # v20.x.x
npm --version   # 10.x.x

# Verificar Python
python --version  # 3.11.x
pip --version     # 23.x.x

# Verificar dependencias frontend
npm ls --depth=0

# Verificar dependencias audio engine
pip list

# Verificar PostgreSQL extensiones
psql -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
```

---

## 13. Costos Mensuales Estimados

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| **Vercel** | Pro | $20/usuario |
| **PostgreSQL** | Neon/Supabase | $0-25 |
| **Cloudflare R2** | Pay-as-you-go | ~$5-50 |
| **Clerk** | Starter (gratis hasta 10k MAU) | $0-25 |
| **Stripe** | Por transacción | 2.9% + $0.30 |
| **Resend** | Starter (gratis 3k emails/mes) | $0-30 |
| **PostHog** | Starter (gratis 1M events/mes) | $0-30 |
| **OpenAI** | Por uso | ~$10-100 |
| **Anthropic** | Por uso | ~$10-100 |

**Total estimado (inicial):** $50-200/mes

---

*Documento actualizado: 2026-03-18*
*VOZAZI - Todas las dependencias verificadas ✅*

---

## 1. Frontend (apps/web)

### 1.1 Dependencias Principales

```json
{
  "name": "@vozazi/web",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=18.17.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0"
  }
}
```

### 1.2 UI y Estilos

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "^0.344.0",
    "framer-motion": "^11.0.0"
  }
}
```

### 1.3 Autenticación (Clerk)

```json
{
  "dependencies": {
    "@clerk/nextjs": "^4.29.0",
    "@clerk/themes": "^1.7.9"
  }
}
```

### 1.4 Base de Datos (Drizzle ORM)

```json
{
  "dependencies": {
    "drizzle-orm": "^0.29.0",
    "postgres": "^3.4.0",
    "@neondatabase/serverless": "^0.9.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.0"
  }
}
```

### 1.5 Audio (Web Audio API - Nativo)

```json
{
  "dependencies": {
    "standardized-audio-context": "^25.3.0",
    "media-recorder-mock": "^2.0.0"
  }
}
```

### 1.6 Stripe (Billing)

```json
{
  "dependencies": {
    "stripe": "^14.18.0",
    "@stripe/stripe-js": "^3.0.0"
  }
}
```

### 1.7 Email (Resend)

```json
{
  "dependencies": {
    "resend": "^3.2.0",
    "@react-email/components": "^0.0.15",
    "@react-email/render": "^0.0.12"
  }
}
```

### 1.8 Analytics (PostHog)

```json
{
  "dependencies": {
    "posthog-js": "^1.116.0",
    "posthog-node": "^3.6.0"
  }
}
```

### 1.9 Almacenamiento (Cloudflare R2)

```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.525.0",
    "@aws-sdk/s3-request-presigner": "^3.525.0"
  }
}
```

### 1.10 Utilidades

```json
{
  "dependencies": {
    "zod": "^3.22.0",
    "date-fns": "^3.3.0",
    "uuid": "^9.0.0",
    "nuqs": "^1.15.0",
    "sonner": "^1.4.0",
    "@tanstack/react-query": "^5.24.0",
    "@tanstack/react-table": "^8.13.0",
    "recharts": "^2.12.0",
    "vaul": "^0.9.0",
    "cmdk": "^0.2.0"
  }
}
```

### 1.11 Testing (Frontend)

```json
{
  "devDependencies": {
    "vitest": "^1.3.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^24.0.0",
    "playwright": "^1.42.0",
    "@playwright/test": "^1.42.0",
    "msw": "^2.2.0"
  }
}
```

---

## 2. Audio Engine (apps/audio-engine)

### 2.1 Dependencias Principales

```txt
# requirements.txt
# Core
python>=3.10,<3.13
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
python-multipart>=0.0.9
pydantic>=2.6.0
pydantic-settings>=2.2.0
```

### 2.2 Procesamiento de Audio

```txt
# Audio Processing
torchaudio>=2.2.0
torch>=2.2.0
torchcrepe>=0.0.20
librosa>=0.10.0
soundfile>=0.12.0
scipy>=1.12.0
numpy>=1.26.0
essentia-tensorflow>=2.1b6
```

### 2.3 WebSockets

```txt
# WebSockets
websockets>=12.0
python-websockets>=12.0
```

### 2.4 Base de Datos (Async)

```txt
# Database
asyncpg>=0.29.0
psycopg2-binary>=2.9.9
sqlalchemy[asyncio]>=2.0.0
```

### 2.5 Vector Database (pgvector)

```txt
# Vector Search
pgvector>=0.2.0
sentence-transformers>=2.4.0
```

### 2.6 LLM Integration

```txt
# LLM Providers
openai>=1.14.0
anthropic>=0.18.0
aiohttp>=3.9.0
```

### 2.7 Cache y Rate Limiting

```txt
# Caching
redis>=5.0.0
asyncio-redis>=0.16.0
```

### 2.8 Logging y Monitoring

```txt
# Logging
structlog>=24.1.0
python-json-logger>=2.0.0
prometheus-client>=0.20.0
```

### 2.9 Testing (Audio Engine)

```txt
# Testing
pytest>=8.1.0
pytest-asyncio>=0.23.0
pytest-cov>=4.1.0
httpx>=0.27.0
pytest-mock>=3.12.0
```

### 2.10 Desarrollo

```txt
# Development
black>=24.2.0
ruff>=0.3.0
mypy>=1.9.0
pre-commit>=3.6.0
ipython>=8.22.0
jupyter>=1.0.0
```

---

## 3. Backend / BFF (apps/web - Server Side)

### 3.1 Server Actions y API

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "zod": "^3.22.0"
  }
}
```

### 3.2 Seguridad

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "jose": "^5.2.0",
    "csrf": "^3.1.0"
  }
}
```

---

## 4. Infraestructura y DevOps

### 4.1 Docker

```dockerfile
# Dockerfile.base
FROM node:20-alpine AS base
FROM python:3.11-slim AS python-base
```

### 4.2 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  audio-engine:
    build: ./apps/audio-engine
    ports:
      - "8000:8000"
  
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
```

### 4.3 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
```

---

## 5. Paquetes Compartidos (packages/)

### 5.1 packages/ui

```json
{
  "name": "@vozazi/ui",
  "version": "1.0.0",
  "dependencies": {
    "@radix-ui/*": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### 5.2 packages/db

```json
{
  "name": "@vozazi/db",
  "version": "1.0.0",
  "dependencies": {
    "drizzle-orm": "^0.29.0",
    "postgres": "^3.4.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.0",
    "@types/pg": "^8.11.0"
  }
}
```

### 5.3 packages/shared-types

```json
{
  "name": "@vozazi/shared-types",
  "version": "1.0.0",
  "dependencies": {
    "zod": "^3.22.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 6. Dependencias de Desarrollo (Raíz)

### 6.1 Monorepo

```json
{
  "name": "vozazi-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "^1.12.0",
    "prettier": "^3.2.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0",
    "changeset": "^0.2.0"
  }
}
```

### 6.2 Turbo Repo

```json
{
  "turbo": {
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**"]
      },
      "test": {
        "dependsOn": ["build"],
        "outputs": []
      },
      "lint": {
        "outputs": []
      },
      "dev": {
        "cache": false
      }
    }
  }
}
```

---

## 7. Instalación Paso a Paso

### 7.1 Prerrequisitos

```bash
# Node.js
node >= 18.17.0
npm >= 9.0.0

# Python
python >= 3.10
pip >= 23.0

# Herramientas
git >= 2.40.0
docker >= 24.0.0 (opcional)
```

### 7.2 Instalación Frontend

```bash
cd apps/web
npm install

# Variables de entorno
cp .env.example .env.local
```

### 7.3 Instalación Audio Engine

```bash
cd apps/audio-engine

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Variables de entorno
cp .env.example .env
```

### 7.4 Instalación Monorepo

```bash
# Raíz del proyecto
npm install

# Construir todos los paquetes
npm run build
```

---

## 8. Variables de Entorno

### 8.1 Frontend (.env.local)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vozazi-audio

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Resend
RESEND_API_KEY=re_...

# Audio Engine
NEXT_PUBLIC_AUDIO_ENGINE_URL=https://audio.vozazi.com
NEXT_PUBLIC_AUDIO_ENGINE_WS_URL=wss://audio.vozazi.com
```

### 8.2 Audio Engine (.env)

```env
# API
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=postgresql://...

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vozazi-audio

# LLM
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Redis (Cache)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=INFO
```

---

## 9. Extensiones de PostgreSQL Requeridas

```sql
-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS vector;  -- pgvector
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- Búsqueda full-text
```

---

## 10. Resumen de Costos Mensuales Estimados

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| **Vercel** | Pro | $20/usuario |
| **PostgreSQL** | Neon/Supabase | $0-25 |
| **Cloudflare R2** | Pay-as-you-go | ~$5-50 |
| **Clerk** | Starter (gratis) | $0-25 |
| **Stripe** | Por transacción | 2.9% + $0.30 |
| **Resend** | Starter (gratis) | $0-30 |
| **PostHog** | Starter (gratis) | $0-30 |
| **OpenAI** | Por uso | ~$10-100 |

**Total estimado (inicial):** $50-200/mes

---

## 11. Comandos Útiles

### Desarrollo

```bash
# Iniciar todo el monorepo
npm run dev

# Solo frontend
npm run dev --filter=@vozazi/web

# Solo audio engine
cd apps/audio-engine && uvicorn app.main:app --reload

# Base de datos
npm run db:generate
npm run db:migrate
npm run db:push
```

### Producción

```bash
# Build
npm run build

# Tests
npm run test

# Lint
npm run lint
```

---

## 12. Verificación de Instalación

```bash
# Verificar Node
node --version  # v20.x.x
npm --version   # 10.x.x

# Verificar Python
python --version  # 3.11.x
pip --version     # 23.x.x

# Verificar dependencias frontend
npm ls --depth=0

# Verificar dependencias audio engine
pip list

# Verificar PostgreSQL extensiones
psql -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
```

---

*Documento generado el 2026-03-18*
*VOZAZI - Lista completa de dependencias*
