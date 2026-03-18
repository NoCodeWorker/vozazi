# VOZAZI — Internationalization (i18n) Guide

> Guía completa para la internacionalización de VOZAZI usando i18next CLI.

---

## 📋 Resumen Ejecutivo

VOZAZI soporta múltiples idiomas para alcanzar una audiencia global. La internacionalización se implementa usando **i18next CLI**, una herramienta de alto rendimiento basada en Rust.

### Idiomas Soportados

| Código | Idioma | Estado |
|--------|--------|--------|
| `es` | Español | ✅ Completo (default) |
| `en` | English | 🟡 Parcial |
| `pt` | Português | 🟡 Parcial |
| `fr` | Français | ⏳ Pendiente |
| `de` | Deutsch | ⏳ Pendiente |
| `it` | Italiano | ⏳ Pendiente |

---

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
cd apps/web
npm install i18next react-i18next i18next-resources-to-backend
npm install -D i18next-cli
```

### 2. Extraer claves de traducción

```bash
# Extraer todas las claves del código fuente
npm run i18n:extract

# Ver estado de traducciones
npm run i18n:status

# Sincronizar idiomas
npm run i18n:sync
```

### 3. Usar traducciones en componentes

```tsx
'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function WelcomeCard() {
  const { t } = useTranslation('common')
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('app_description')}</p>
    </div>
  )
}
```

---

## 📁 Estructura de Archivos

```
apps/web/
├── i18next.config.ts              # Configuración de i18next CLI
├── src/
│   ├── lib/
│   │   ├── i18n.ts                # Inicialización de i18next
│   │   └── i18n.config.ts         # Configuración de idiomas
│   ├── hooks/
│   │   └── useTranslation.ts      # Hook personalizado
│   ├── types/
│   │   └── i18next.d.ts           # Tipos TypeScript
│   └── components/
│       └── shared/
│           └── LanguageSwitcher.tsx
└── public/
    └── locales/
        ├── es/                    # Español (idioma principal)
        │   ├── translation.json
        │   ├── common.json
        │   ├── dashboard.json
        │   ├── practice.json
        │   ├── billing.json
        │   ├── library.json
        │   └── onboarding.json
        ├── en/                    # English
        ├── pt/                    # Português
        └── ...
```

---

## 🔧 Configuración

### i18next.config.ts

```typescript
import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['es', 'en', 'pt', 'fr', 'de', 'it'],
  primaryLanguage: 'es',
  
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    output: 'public/locales/{{language}}/{{namespace}}.json',
    functions: ['t', '*.t', 'i18next.t', 'useTranslation'],
    transComponents: ['Trans', 'Translation'],
    defaultNS: 'translation',
    keySeparator: '.',
    removeUnusedKeys: true,
    sort: true
  },
  
  types: {
    input: ['public/locales/es/*.json'],
    output: 'src/types/i18next.d.ts',
    enableSelector: true
  }
});
```

---

## 📝 Namespaces

VOZAZI usa los siguientes namespaces:

| Namespace | Propósito | Ejemplo |
|-----------|-----------|---------|
| `common` | Textos comunes (auth, validación, errores) | `common:auth.login` |
| `translation` | Textos generales | `translation:welcome` |
| `dashboard` | Dashboard del usuario | `dashboard:stats.total_sessions` |
| `practice` | Flujo de práctica | `practice:feedback.overall_score` |
| `billing` | Facturación y planes | `billing:plans.pro.name` |
| `library` | Biblioteca vocal | `library:techniques.title` |
| `onboarding` | Flujo de onboarding | `onboarding:steps.goals.title` |

---

## 🎯 Comandos Disponibles

```bash
# Extraer claves del código fuente
npm run i18n:extract

# Extraer en modo watch (desarrollo)
npx i18next-cli extract --watch

# Ver estado de traducciones
npm run i18n:status

# Ver estado de un idioma específico
npx i18next-cli status es

# Sincronizar idiomas secundarios con el principal
npm run i18n:sync

# Lint de strings hardcoded
npm run i18n:lint

# Generar tipos TypeScript
npm run i18n:types

# Generar tipos en modo watch
npx i18next-cli types --watch
```

---

## 🧪 Mejores Prácticas

### 1. Usar claves descriptivas

```tsx
// ✅ BIEN
t('practice.feedback.overall_score')

// ❌ MAL
t('score')
```

### 2. Usar interpolación para variables

```tsx
// ✅ BIEN
t('dashboard.welcome', { name: userName })
t('validation.min_length', { min: 8 })

// ❌ MAL
t(`dashboard.welcome_${userName}`)
```

### 3. Usar plurales correctamente

```json
{
  "sessions": "sesión",
  "sessions_plural": "sesiones",
  "sessions_with_count": "{{count}} sesión",
  "sessions_with_count_plural": "{{count}} sesiones"
}
```

```tsx
t('sessions_with_count', { count: 5 }) // "5 sesiones"
```

### 4. Contextos para género

```json
{
  "welcome": "Bienvenido",
  "welcome_female": "Bienvenida",
  "welcome_male": "Bienvenido"
}
```

```tsx
t('welcome', { context: user.gender })
```

### 5. Componente Trans para JSX

```tsx
import { Trans } from 'react-i18next'

<Trans
  i18nKey="onboarding.welcome"
  components={{ bold: <strong /> }}
  values={{ name: userName }}
/>
```

```json
{
  "onboarding.welcome": "¡Bienvenido <bold>{{name}}</bold>!"
}
```

---

## 🌍 Cambio de Idioma

### Componente LanguageSwitcher

```tsx
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  )
}
```

### Programáticamente

```tsx
import { useTranslation } from '@/hooks/useTranslation'

function Settings() {
  const { changeLanguage } = useTranslation()
  
  return (
    <button onClick={() => changeLanguage('en')}>
      Switch to English
    </button>
  )
}
```

---

## 🔍 Extracción de Claves

### Patrones Soportados

```tsx
// Función t
t('key')
t('ns:key')
t('key', { defaultValue: 'Default' })
t('key', { count: 2 })
t('key', { context: 'female' })

// Hook useTranslation
const { t } = useTranslation('namespace')
const { t } = useTranslation(['ns1', 'ns2'])

// Componente Trans
<Trans i18nKey="welcome">Welcome {{name}}</Trans>
<Trans>common:button.save</Trans>

// Alias
const translate = t
translate('key')

// getFixedT
const fixedT = getFixedT('en', 'namespace')
fixedT('key')
```

---

## 🧪 Testing

### Test de componentes con i18n

```tsx
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  
  return render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    </I18nextProvider>
  )
}

test('displays welcome message', () => {
  renderWithProviders(<WelcomeCard />)
  expect(screen.getByText(/bienvenido/i)).toBeInTheDocument()
})
```

---

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/i18n.yml
name: i18n Check

on: [push, pull_request]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Check i18n extraction
        run: npm run i18n:extract -- --ci
      
      - name: Check i18n lint
        run: npm run i18n:lint
```

---

## 🔗 Locize Integration (Opcional)

Para gestión profesional de traducciones:

```bash
npm install i18next-locize-backend
```

```typescript
// src/lib/i18n.locize.ts
import LocizeBackend from 'i18next-locize-backend'

i18n.use(LocizeBackend).init({
  backend: {
    loadPath: 'https://api.locize.app/missing/{{lng}}/{{ns}}',
    addPath: 'https://api.locize.app/missing/{{lng}}/{{ns}}',
    projectId: 'your-project-id',
    apiKey: 'your-api-key'
  }
})
```

---

## 📊 Estado de Traducciones

Ver estado actual:

```bash
npx i18next-cli status
```

Salida de ejemplo:

```
📊 Translation Status

Locale: es (primary)
  translation.json    ✅ 100% (25/25 keys)
  common.json         ✅ 100% (45/45 keys)
  dashboard.json      ✅ 100% (20/20 keys)

Locale: en
  translation.json    🟡 80% (20/25 keys)
  common.json         🟡 90% (40/45 keys)
  dashboard.json      ✅ 100% (20/20 keys)
```

---

## 🐛 Solución de Problemas

### Error: "Key not found"

```tsx
// Asegúrate de que el namespace está cargado
const { t, ready } = useTranslation('dashboard')

if (!ready) return <Loading />

return <h1>{t('title')}</h1>
```

### Error: "Types not generated"

```bash
# Regenerar tipos
npm run i18n:types

# Verificar configuración en i18next.config.ts
```

### Claves no se extraen

```typescript
// Para claves dinámicas, usar preservePatterns
export default defineConfig({
  extract: {
    preservePatterns: [
      'status\\..*',
      'role\\..*'
    ]
  }
})
```

---

## 📚 Recursos

- [i18next Documentation](https://www.i18next.com)
- [react-i18next Documentation](https://react.i18next.com)
- [i18next CLI](https://github.com/i18next/i18next-cli)
- [Locize](https://locize.com)

---

*Last updated: 2026-03-18*
*VOZAZI Internationalization Guide*
