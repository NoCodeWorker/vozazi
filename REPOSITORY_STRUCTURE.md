# 📁 VOZAZI Repository Structure

> Complete index of all files and folders in the VOZAZI repository.

---

## 🗂️ Root Level Files

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Monorepo root package with Turbo config |
| `turbo.json` | Turbo build system configuration |
| `tsconfig.json` | TypeScript root configuration |
| `eslint.config.js` | ESLint configuration |
| `.prettierrc` | Prettier formatting rules |
| `.gitignore` | Git ignore patterns |
| `.lintstagedrc.json` | Lint-staged configuration |
| `commitlint.config.js` | Commit linting configuration |
| `vercel-mcp.json` | Vercel MCP configuration |

### Environment Files

| File | Purpose |
|------|---------|
| `.env` | Local environment variables (gitignored) |
| `.env.example` | Environment variables template |

### Docker & Infrastructure

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Docker services orchestration |
| `infrastructure/postgres/init.sql` | PostgreSQL initialization with extensions |

### Documentation (Root Level)

| File | Purpose |
|------|---------|
| `README.md` | Main README with quick start guide |
| `vozazi_arquitectura_tecnica_completa.md` | Complete technical architecture (5817 lines) |
| `I18N_GUIDE.md` | Internationalization guide (6 languages) |
| `TESTING_GUIDE.md` | Testing guide (Vitest, Playwright, pytest) |
| `MCP_INTEGRATION.md` | Model Context Protocol integration guide |

---

## 📂 Directory Structure

### `/apps` - Applications

```
apps/
├── web/                          # Next.js frontend + BFF
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── health/
│   │   │   │       ├── route.ts
│   │   │   │       ├── clerk/route.ts
│   │   │   │       ├── stripe/route.ts
│   │   │   │       └── variables/route.ts
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── __tests__/
│   │   │   │   └── button.test.tsx
│   │   │   └── shared/
│   │   │       └── LanguageSwitcher.tsx
│   │   ├── hooks/
│   │   │   └── useTranslation.ts
│   │   ├── lib/
│   │   │   ├── clerk-mcp.ts         # ✅ 300+ lines
│   │   │   ├── stripe-mcp.ts        # ✅ 400+ lines
│   │   │   ├── i18n.ts
│   │   │   ├── i18n.config.ts
│   │   │   └── utils.ts
│   │   ├── test/
│   │   │   ├── handlers.ts
│   │   │   └── setup.ts
│   │   ├── types/
│   │   │   └── i18next.d.ts
│   │   └── db/ (empty - uses packages/db)
│   ├── public/
│   │   └── locales/
│   │       ├── es/
│   │       │   ├── common.json
│   │       │   ├── dashboard.json
│   │       │   ├── practice.json
│   │       │   ├── history.json
│   │       │   ├── billing.json
│   │       │   ├── library.json
│   │       │   └── settings.json
│   │       ├── en/
│   │       ├── pt/
│   │       ├── fr/
│   │       ├── de/
│   │       └── it/
│   ├── drizzle/
│   ├── e2e/
│   ├── .env.example
│   ├── .env.local
│   ├── .eslintrc.json
│   ├── Dockerfile
│   ├── drizzle.config.ts
│   ├── i18next.config.ts
│   ├── next.config.js
│   ├── package.json              # 60+ dependencies
│   ├── playwright.config.ts
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vitest.config.ts
│
└── audio-engine/                 # FastAPI audio processing
    ├── app/
    │   ├── api/
    │   │   ├── audio.py          # ⚠️ TODO stubs
    │   │   ├── health.py         # ✅ Implemented
    │   │   ├── mcp.py            # ✅ Implemented
    │   │   └── websocket.py      # ⚠️ TODO stub
    │   ├── mcp/
    │   │   ├── manager.py        # ✅ Service manager
    │   │   ├── database.py       # ✅ PostgreSQL MCP (asyncpg + SQLAlchemy)
    │   │   ├── storage.py        # ✅ R2 storage MCP (500+ lines)
    │   │   ├── redis_client.py   # ✅ Redis MCP (300+ lines)
    │   │   ├── openai_client.py  # ✅ OpenAI MCP (400+ lines)
    │   │   ├── anthropic_client.py # ✅ Anthropic MCP (350+ lines)
    │   │   └── server.py
    │   ├── __init__.py
    │   ├── config.py             # ✅ Pydantic settings
    │   └── main.py               # ✅ FastAPI app
    ├── tests/
    │   ├── conftest.py
    │   └── test_health.py
    ├── .env
    ├── .env.example
    ├── Dockerfile
    ├── pyproject.toml
    ├── requirements.txt          # 40+ dependencies
    └── venv/ (Python virtual environment - gitignored)
```

### `/packages` - Shared Packages

```
packages/
├── ui/                           # Shared React components
│   └── src/
│       ├── components/
│       │   ├── button.tsx        # ✅ shadcn/ui
│       │   ├── card.tsx          # ✅ shadcn/ui
│       │   ├── input.tsx         # ✅ shadcn/ui
│       │   ├── label.tsx         # ✅ shadcn/ui
│       │   ├── badge.tsx         # ✅ shadcn/ui
│       │   ├── avatar.tsx        # ✅ shadcn/ui
│       │   └── skeleton.tsx      # ✅ shadcn/ui
│       ├── lib/
│       │   └── utils.ts          # ✅ cn() utility
│       └── index.ts              # ✅ Exports
│
├── db/                           # Database schema
│   ├── src/
│   │   ├── schema.ts             # ✅ Complete Drizzle schema (150+ lines)
│   │   │   ├── users table
│   │   │   ├── audioFiles table
│   │   │   ├── subscriptions table
│   │   │   ├── usage table
│   │   │   ├── relations
│   │   │   └── type exports
│   │   └── index.ts              # ✅ Exports
│   ├── .env
│   ├── .env.example
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── shared-types/                 # Shared TypeScript types
    └── src/
        ├── schemas.ts            # ✅ Complete Zod schemas
        ├── api.ts                # ✅ API endpoints & error codes
        ├── types.ts              # ✅ TypeScript types & PlanLimits
        └── index.ts              # ✅ Exports
```

### `/documentacion` - Documentation

```
documentacion/
├── README.md                     # ✅ Documentation index
├── documento_contexto.md         # ✅ Project context
├── documento_implementacion.md   # ✅ Implementation guide
├── documento_tareas_checklist.md # ✅ Tasks checklist
├── documento_skills.md           # ✅ Skills (23/23 completed)
├── documento_buenas_practicas.md # ✅ Best practices
├── DEPENDENCIAS.md               # ✅ Dependencies list
├── VERCEL_ENVIRONMENT_VARIABLES.md # ✅ Vercel env vars
├── AUDITORIA_REPOSITORIO.md      # ✅ Technical audit
├── I18N_GUIDE.md                 # ⚠️ Move to root
├── TESTING_GUIDE.md              # ⚠️ Move to root
└── MCP_INTEGRATION.md            # ⚠️ Move to root
```

### `/.agent/skills` - Antigravity Skills

```
.agent/skills/
├── README.md                     # ✅ Skills index
├── frontend/
│   ├── nextjs-app-router/
│   ├── nextjs-server-actions/
│   ├── nextjs-route-handlers/
│   ├── typescript-system/
│   ├── tailwind-css/
│   ├── shadcn-ui/
│   └── web-audio-api/
├── backend/
│   └── drizzle-orm/
├── audio-engine/
│   ├── fastapi/
│   ├── python-async/
│   ├── torchcrepe/
│   ├── librosa/
│   ├── torchaudio/
│   ├── essentia/
│   └── websockets/
├── pedagogy/
│   ├── rag-system/
│   ├── llm-integration/
│   └── vector-databases/
├── services/
│   ├── clerk-auth/
│   ├── stripe-billing/
│   ├── cloudflare-r2/
│   ├── posthog-analytics/
│   └── resend-email/
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

Total: 23 skills ✅
```

### `/.github` - GitHub Configuration

```
.github/
└── workflows/
    └── ci.yml                  # ✅ CI pipeline
```

### `/.vscode` - VS Code Configuration

```
.vscode/
├── settings.json
└── mcp/
    └── README.md
```

### `/.husky` - Git Hooks

```
.husky/
└── pre-commit
```

---

## 📊 File Statistics

| Category | Count |
|----------|-------|
| **Applications** | 2 (web, audio-engine) |
| **Shared Packages** | 3 (ui, db, shared-types) |
| **Documentation Files** | 12 (.md files) |
| **Antigravity Skills** | 23 skills |
| **i18n Languages** | 6 (es, en, pt, fr, de, it) |
| **i18n Translation Files** | 42 JSON files |
| **Test Files** | ~10 (configured, minimal implementation) |
| **Configuration Files** | ~15 |

---

## 🎯 Implementation Status

### ✅ Fully Implemented (Production-Ready)

| Component | Status | Lines |
|-----------|--------|-------|
| Monorepo Setup | ✅ Complete | - |
| UI Components (shadcn/ui) | ✅ Complete | 500+ |
| Database Schema | ✅ Complete | 150+ |
| Clerk MCP Client | ✅ Complete | 300+ |
| Stripe MCP Client | ✅ Complete | 400+ |
| R2 Storage MCP | ✅ Complete | 500+ |
| Redis MCP | ✅ Complete | 300+ |
| OpenAI MCP | ✅ Complete | 400+ |
| Anthropic MCP | ✅ Complete | 350+ |
| i18n System | ✅ Complete | 42 JSON files |
| Testing Infrastructure | ✅ Complete | - |
| CI/CD Pipeline | ✅ Complete | - |
| Docker Configuration | ✅ Complete | - |
| Documentation | ✅ Complete | 10,000+ lines |

### ⚠️ Stubs / TODOs (Needs Implementation)

| Component | Status | TODO Count |
|-----------|--------|------------|
| Audio Processing Endpoints | ⚠️ Stubs | 3 TODOs |
| WebSocket Realtime | ⚠️ Stub | 1 TODO |
| Server Actions | ❌ Missing | 0 files |
| Stripe Webhooks | ❌ Missing | 0 files |
| Auth Middleware | ❌ Missing | 0 files |
| User Pages (dashboard, practice, etc.) | ❌ Missing | 0 files |

---

## 🔍 Key Files to Review

### Critical Implementation Files

1. **Database Schema**: `packages/db/src/schema.ts`
2. **Clerk MCP**: `apps/web/src/lib/clerk-mcp.ts`
3. **Stripe MCP**: `apps/web/src/lib/stripe-mcp.ts`
4. **Audio Engine Main**: `apps/audio-engine/app/main.py`
5. **Audio Processing**: `apps/audio-engine/app/api/audio.py` (⚠️ TODOs)
6. **Shared Types**: `packages/shared-types/src/schemas.ts`

### Critical Missing Files

1. **Server Actions**: `apps/web/src/server/actions/*.ts`
2. **Stripe Webhooks**: `apps/web/src/app/api/webhooks/stripe/route.ts`
3. **Auth Middleware**: `apps/web/middleware.ts`
4. **User Pages**: `apps/web/src/app/dashboard/page.tsx`, etc.

---

## 📝 Cleanup Recommendations

### Files to Remove

```bash
# Remove .md files from node_modules (not needed)
find ./vozazi/node_modules -name "*.md" -type f -delete

# Remove .md files from venv (not needed)
find ./apps/audio-engine/venv -name "*.md" -type f -delete

# Remove .history folders
find ./vozazi/node_modules -type d -name ".history" -exec rm -rf {} +
```

### Files to Consolidate

- ✅ `documentacion/I18N_GUIDE.md` → `I18N_GUIDE.md` (root)
- ✅ `documentacion/TESTING_GUIDE.md` → `TESTING_GUIDE.md` (root)
- ✅ `documentacion/MCP_INTEGRATION.md` → `MCP_INTEGRATION.md` (root)
- ✅ `documentacion/vozazi_arquitectura_tecnica_completa.md` → root

---

*Last updated: 2026-03-18*  
*VOZAZI Repository Structure Index*
