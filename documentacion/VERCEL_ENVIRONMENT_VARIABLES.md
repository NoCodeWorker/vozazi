# VOZAZI — Variables de Entorno para Vercel

> Lista completa de variables de entorno que debes configurar en Vercel para el despliegue de VOZAZI.

---

## 📋 Resumen Ejecutivo

| Entorno | Cantidad de Variables | Prioridad |
|---------|----------------------|-----------|
| **Producción** | 25+ | 🔴 Crítica |
| **Preview** | 20+ | 🟡 Media |
| **Desarrollo** | 15+ | 🟢 Baja |

---

## 🔐 Variables Principales (Obligatorias)

### Autenticación (Clerk)

```env
# Clerk - OBLIGATORIO
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

**¿Dónde obtenerlas?**
1. Ve a [Clerk Dashboard](https://dashboard.clerk.com)
2. Selecciona tu aplicación
3. API Keys → Copia las claves

---

### Base de Datos (PostgreSQL)

```env
# PostgreSQL - OBLIGATORIO
DATABASE_URL=postgresql://usuario:password@host:5432/vozazi?sslmode=require

# Para Neon (recomendado)
DATABASE_URL=postgresql://vozazi:password@ep-xxx.us-east-2.aws.neon.tech/vozazi?sslmode=require

# Para Supabase
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require
```

**¿Dónde obtenerlas?**
- **Neon:** [neon.tech](https://neon.tech) → Connection Details → Pooled connection
- **Supabase:** Project Settings → Database → Connection string → URI

---

### Stripe (Billing)

```env
# Stripe - OBLIGATORIO para producción
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Para desarrollo (testing)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**¿Dónde obtenerlas?**
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API Keys
3. Webhooks → Add endpoint → Copia el signing secret

---

### Cloudflare R2 (Storage de Audio)

```env
# Cloudflare R2 - OBLIGATORIO
R2_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_BUCKET_NAME=vozazi-audio
```

**¿Dónde obtenerlas?**
1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. R2 Storage → Selecciona tu bucket
3. Settings → R2 API Access → Create API token

---

### Audio Engine (Backend de Audio)

```env
# Audio Engine - OBLIGATORIO
NEXT_PUBLIC_AUDIO_ENGINE_URL=https://audio.vozazi.com
NEXT_PUBLIC_AUDIO_ENGINE_WS_URL=wss://audio.vozazi.com

# Para desarrollo
NEXT_PUBLIC_AUDIO_ENGINE_URL=http://localhost:8000
NEXT_PUBLIC_AUDIO_ENGINE_WS_URL=ws://localhost:8000
```

**Nota:** El audio-engine debe estar desplegado en un servidor separado (no en Vercel).

---

## 📊 Variables de Servicios (Recomendadas)

### PostHog (Analytics)

```env
# PostHog - RECOMENDADO
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**¿Dónde obtenerlas?**
1. Ve a [PostHog Dashboard](https://app.posthog.com)
2. Project Settings → Project API key
3. Data Management → Project → Host URL

---

### Resend (Email)

```env
# Resend - RECOMENDADO
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=VOZAZI <noreply@vozazi.com>
RESEND_REPLY_TO=soporte@vozazi.com
```

**¿Dónde obtenerlas?**
1. Ve a [Resend Dashboard](https://resend.com)
2. API Keys → Create API key
3. Domains → Verifica tu dominio

---

### LLM Providers (Pedagogía)

```env
# OpenAI - RECOMENDADO
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=500

# Anthropic (alternativa) - OPCIONAL
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

**¿Dónde obtenerlas?**
- **OpenAI:** [platform.openai.com](https://platform.openai.com) → API Keys
- **Anthropic:** [console.anthropic.com](https://console.anthropic.com) → Get API keys

---

## ⚙️ Variables de Configuración (Opcionales)

### Aplicación

```env
# Configuración de la App - OPCIONAL
NEXT_PUBLIC_APP_URL=https://vozazi.com
NEXT_PUBLIC_APP_NAME=VOZAZI
NODE_ENV=production
NEXT_PUBLIC_NODE_ENV=production

# Feature Flags - OPCIONAL
NEXT_PUBLIC_FEATURE_AI_FEEDBACK=true
NEXT_PUBLIC_FEATURE_ADAPTIVE_ENGINE=true
NEXT_PUBLIC_FEATURE_WEEKLY_SUMMARIES=true
```

### Cache y Rate Limiting

```env
# Redis (Cache) - OPCIONAL
REDIS_URL=redis://localhost:6379
REDIS_TOKEN=xxxxxx

# Para Upstash (recomendado en Vercel)
UPSTASH_REDIS_REST_URL=https://xxx.xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxx
```

### Logging y Monitoring

```env
# Logging - OPCIONAL
LOG_LEVEL=info
NEXT_PUBLIC_LOG_LEVEL=info

# Sentry (Error Tracking) - OPCIONAL
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=vozazi
SENTRY_PROJECT=vozazi-web
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Configuración en Vercel

### Paso 1: Ir al Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto VOZAZI
3. Settings → Environment Variables

### Paso 2: Añadir Variables

Para cada variable:

1. Click en "Add New"
2. Nombre: `DATABASE_URL`
3. Valor: `postgresql://...`
4. Entornos: ✅ Production ✅ Preview ✅ Development
5. Click en "Save"

### Paso 3: Agrupar por Entorno

```
┌─────────────────────────────────────────────────────────────┐
│ Production Variables                                        │
├─────────────────────────────────────────────────────────────┤
│ DATABASE_URL         = postgresql://... (producción)       │
│ STRIPE_SECRET_KEY    = sk_live_...                          │
│ OPENAI_API_KEY       = sk-...                                │
│ NEXT_PUBLIC_APP_URL  = https://vozazi.com                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Preview Variables                                           │
├─────────────────────────────────────────────────────────────┤
│ DATABASE_URL         = postgresql://... (staging)          │
│ STRIPE_SECRET_KEY    = sk_test_...                          │
│ OPENAI_API_KEY       = sk-...                                │
│ NEXT_PUBLIC_APP_URL  = https://preview.vozazi.com          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Development Variables                                       │
├─────────────────────────────────────────────────────────────┤
│ DATABASE_URL         = postgresql://localhost:5432/vozazi  │
│ STRIPE_SECRET_KEY    = sk_test_...                          │
│ NEXT_PUBLIC_APP_URL  = http://localhost:3000               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Checklist de Verificación

### Variables Críticas (Debe tener todas)

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `DATABASE_URL`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `R2_ACCOUNT_ID`
- [ ] `R2_ACCESS_KEY_ID`
- [ ] `R2_SECRET_ACCESS_KEY`
- [ ] `R2_BUCKET_NAME`
- [ ] `NEXT_PUBLIC_AUDIO_ENGINE_URL`
- [ ] `NEXT_PUBLIC_AUDIO_ENGINE_WS_URL`

### Variables Recomendadas

- [ ] `NEXT_PUBLIC_POSTHOG_KEY`
- [ ] `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] `RESEND_API_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `UPSTASH_REDIS_REST_URL` (si usas cache)

### Variables Opcionales

- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `LOG_LEVEL`
- [ ] `SENTRY_DSN`
- [ ] `NEXT_PUBLIC_FEATURE_*`

---

## 🔒 Mejores Prácticas de Seguridad

### 1. No Subir `.env` al Repositorio

```bash
# .gitignore
.env
.env.local
.env.production
.env.preview
```

### 2. Usar Variables Encriptadas

Vercel encripta automáticamente todas las variables de entorno.

### 3. Rotar Claves Periódicamente

```bash
# Cada 90 días recomienda rotar:
- Clerk API Keys
- Stripe API Keys
- R2 Access Keys
- OpenAI API Keys
```

### 4. Separar Entornos

```
✅ Production: Claves de producción (live)
✅ Preview: Claves de testing
✅ Development: Claves locales
```

### 5. No Exponer Variables Sensibles al Cliente

```env
# ✅ BIEN: Variable solo en servidor
CLERK_SECRET_KEY=sk_...
STRIPE_SECRET_KEY=sk_...
OPENAI_API_KEY=sk_...

# ❌ MAL: Variable expuesta al cliente (NEXT_PUBLIC_*)
# Nunca usar NEXT_PUBLIC_ para claves secretas
```

---

## 🧪 Verificación de Variables

### Script de Verificación

```typescript
// app/api/health/variables/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const required = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'DATABASE_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'NEXT_PUBLIC_AUDIO_ENGINE_URL',
  ];

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Missing environment variables',
        missing,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: 'ok',
    message: 'All required variables configured',
  });
}
```

### Endpoint de Health Check

Después de desplegar, verifica:

```bash
curl https://vozazi.com/api/health/variables
```

Respuesta esperada:

```json
{
  "status": "ok",
  "message": "All required variables configured"
}
```

---

## 📊 Variables por Servicio

### Resumen por Servicio

| Servicio | Variables | Prefijo | Sensibles |
|----------|-----------|---------|-----------|
| **Clerk** | 6 | `NEXT_PUBLIC_CLERK_`, `CLERK_` | ✅ Secret Key |
| **Stripe** | 4 | `STRIPE_`, `NEXT_PUBLIC_STRIPE_` | ✅ Secret Key, Webhook |
| **R2** | 4 | `R2_` | ✅ Access Key, Secret |
| **PostgreSQL** | 1 | `DATABASE_URL` | ✅ Password |
| **PostHog** | 3 | `NEXT_PUBLIC_POSTHOG_`, `POSTHOG_` | ❌ |
| **Resend** | 2 | `RESEND_` | ✅ API Key |
| **OpenAI** | 3 | `OPENAI_` | ✅ API Key |
| **Audio Engine** | 2 | `NEXT_PUBLIC_AUDIO_ENGINE_` | ❌ |

---

## 🔄 Actualización de Variables

### Cómo Actualizar Variables Existentes

1. Ve a Vercel → Project → Settings → Environment Variables
2. Click en la variable a editar
3. Modifica el valor
4. Click en "Save"
5. **Importante:** Redeploy para aplicar cambios

### Redeploy Después de Cambiar Variables

```bash
# Forzar redeploy desde CLI
vercel --prod

# O desde la UI de Vercel
Deployments → Redeploy
```

---

## 📋 Template para Copiar y Pegar

### Production (.env.production)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vozazi-audio

# Audio Engine
NEXT_PUBLIC_AUDIO_ENGINE_URL=https://audio.vozazi.com
NEXT_PUBLIC_AUDIO_ENGINE_WS_URL=wss://audio.vozazi.com

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Resend
RESEND_API_KEY=re_...
RESEND_FROM=VOZAZI <noreply@vozazi.com>

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=500

# App
NEXT_PUBLIC_APP_URL=https://vozazi.com
NODE_ENV=production
LOG_LEVEL=info
```

---

## 🆘 Solución de Problemas

### Error: `Missing Environment Variable`

**Causa:** Variable no configurada en Vercel

**Solución:**
1. Verifica el nombre exacto en Vercel
2. Asegúrate de estar en el entorno correcto (Production/Preview)
3. Redeploy después de añadir la variable

### Error: `Clerk: You need to provide a secret key`

**Causa:** `CLERK_SECRET_KEY` no está configurada

**Solución:**
1. Añade `CLERK_SECRET_KEY` en Vercel
2. Verifica que NO tenga prefijo `NEXT_PUBLIC_`
3. Redeploy

### Error: `Invalid Stripe API Key`

**Causa:** Clave de Stripe incorrecta o de entorno equivocado

**Solución:**
1. Verifica que usas `sk_live_` para producción
2. Verifica que usas `sk_test_` para desarrollo
3. Regenera la clave en Stripe Dashboard

### Error: `Cannot connect to database`

**Causa:** `DATABASE_URL` incorrecta o SSL no configurado

**Solución:**
1. Verifica el connection string
2. Añade `?sslmode=require` al final
3. Verifica credenciales en tu proveedor de PostgreSQL

---

## 📚 Recursos Adicionales

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Clerk Environment Variables](https://clerk.com/docs/references/nextjs/environment-variables)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [Cloudflare R2 API Access](https://developers.cloudflare.com/r2/api/s3/tokens/)

---

*Documento actualizado: 2026-03-18*
*VOZAZI - Guía de Variables de Entorno para Vercel*
