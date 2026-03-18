# VOZAZI Platform

> AI-powered audio processing and voice analysis platform

---

## 🏗️ Architecture

VOZAZI is built as a monorepo with the following structure:

```
vozazi/
├── apps/
│   ├── web/              # Next.js frontend + BFF
│   └── audio-engine/     # FastAPI audio processing service
├── packages/
│   ├── ui/               # Shared React components
│   ├── db/               # Database schema and utilities
│   └── shared-types/     # Shared TypeScript types and Zod schemas
└── infrastructure/
    └── postgres/         # Database initialization scripts
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.17.0
- Python >= 3.10
- Docker >= 24.0 (optional, for containerized development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd VOZAZI
```

2. **Install dependencies**
```bash
# Install all npm dependencies
npm install

# Install Python dependencies for audio engine
cd apps/audio-engine
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
# Frontend
cp apps/web/.env.example apps/web/.env.local

# Audio Engine
cp apps/audio-engine/.env.example apps/audio-engine/.env
```

4. **Start development servers**

Using Docker Compose (recommended):
```bash
docker-compose up
```

Or manually:
```bash
# Terminal 1: Start PostgreSQL and Redis
docker-compose up postgres redis

# Terminal 2: Start audio engine
cd apps/audio-engine
uvicorn app.main:app --reload --port 8000

# Terminal 3: Start web app
npm run dev
```

---

## 📦 Tech Stack

### Frontend (apps/web)
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Clerk
- **Database:** Drizzle ORM + PostgreSQL
- **Payments:** Stripe
- **Analytics:** PostHog
- **i18n:** i18next (6 languages)

### Audio Engine (apps/audio-engine)
- **Framework:** FastAPI
- **Language:** Python 3.11
- **Audio Processing:** torchaudio, librosa, torch, torchcrepe, essentia
- **LLM:** OpenAI, Anthropic
- **Cache:** Redis
- **Vector DB:** pgvector
- **Storage:** Cloudflare R2

### Infrastructure
- **Database:** PostgreSQL 16 with pgvector
- **Cache:** Redis 7
- **Storage:** Cloudflare R2
- **CI/CD:** GitHub Actions
- **Container:** Docker

---

## 📁 Project Structure

### Applications

| App | Description | Port |
|-----|-------------|------|
| `web` | Next.js frontend and BFF | 3000 |
| `audio-engine` | Python audio processing API | 8000 |

### Shared Packages

| Package | Description |
|---------|-------------|
| `@vozazi/ui` | React component library (shadcn/ui) |
| `@vozazi/db` | Database schema and utilities (Drizzle ORM) |
| `@vozazi/shared-types` | TypeScript types and Zod schemas |

---

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start all apps in development
npm run dev --filter=@vozazi/web    # Start only web app
npm run build            # Build all apps
npm run test             # Run all tests
npm run lint             # Lint all apps

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database

# Testing
npm run test:unit        # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
npm run test:coverage    # Tests with coverage
```

---

## 🌍 Environment Variables

### Frontend (apps/web/.env.local)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `DATABASE_URL` | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `R2_*` | Cloudflare R2 credentials |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog API key |
| `RESEND_API_KEY` | Resend email API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `NEXT_PUBLIC_AUDIO_ENGINE_URL` | Audio engine URL |
| `NEXT_PUBLIC_AUDIO_ENGINE_WS_URL` | Audio engine WebSocket URL |

### Audio Engine (apps/audio-engine/.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `R2_*` | Cloudflare R2 credentials |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic API key |

---

## 🧪 Testing

```bash
# Frontend tests
cd apps/web
npm run test:unit        # Unit tests with Vitest
npm run test:e2e         # E2E tests with Playwright
npm run test:coverage    # Coverage report

# Audio engine tests
cd apps/audio-engine
pytest                   # Run all tests
pytest --cov             # With coverage
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`documentacion/README.md`](./documentacion/README.md) | Documentation index |
| [`vozazi_arquitectura_tecnica_completa.md`](./vozazi_arquitectura_tecnica_completa.md) | Complete technical architecture (5817 lines) |
| [`documentacion/DEPENDENCIAS.md`](./documentacion/DEPENDENCIAS.md) | Complete dependencies list |
| [`documentacion/VERCEL_ENVIRONMENT_VARIABLES.md`](./documentacion/VERCEL_ENVIRONMENT_VARIABLES.md) | Vercel environment variables guide |
| [`I18N_GUIDE.md`](./I18N_GUIDE.md) | Internationalization guide (6 languages) |
| [`TESTING_GUIDE.md`](./TESTING_GUIDE.md) | Testing guide (Vitest, Playwright, pytest) |
| [`MCP_INTEGRATION.md`](./MCP_INTEGRATION.md) | Model Context Protocol integration |

---

## 📄 License

MIT

---

Built with ❤️ by VOZAZI Team
