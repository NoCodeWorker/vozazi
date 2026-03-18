# VOZAZI - Propuesta UX/UI Shadcn

> Estructura de diseño basada en Shadcn UI para maximizar potencia con mínima curva de aprendizaje

**Autor:** UX/UI Expert - Shadcn Specialist
**Fecha:** 2026-03-18
**Versión:** 1.0

---

## 🎯 Filosofía de Diseño

### Principios Rectores

1. **Progresiva Complejidad** - Mostrar solo lo necesario en cada momento
2. **Consistencia Shadcn** - Usar patrones familiares de la comunidad
3. **Feedback Inmediato** - El usuario siempre sabe qué está pasando
4. **Accesibilidad Primero** - WCAG 2.1 AA compliant
5. **Mobile-First** - Diseñado para móvil, escalado a desktop

---

## 🏗️ Estructura de la Aplicación

### Layout Principal

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (sticky)                                             │
│ [Logo] [Search]                              [User] [Bell] │
├──────────┬──────────────────────────────────────────────────┤
│ SIDEBAR  │ MAIN CONTENT                                     │
│ (fixed)  │                                                  │
│          │  ┌────────────────────────────────────────────┐ │
│ Dashboard│  │ Breadcrumb                                 │ │
│ Practice │  ├────────────────────────────────────────────┤ │
│ History  │  │                                            │ │
│ Library  │  │  Page Content                              │ │
│ Settings │  │                                            │ │
│          │  │                                            │ │
│          │  └────────────────────────────────────────────┘ │
├──────────┴──────────────────────────────────────────────────┤
│ PLAYER BAR (sticky bottom - cuando hay práctica activa)     │
│ [Play/Pause] [Progress] [Time] [Volume]                    │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation

Basado en `sidebar-01` de Shadcn, adaptado para VOZAZI:

```typescript
const navigationGroups = [
  {
    title: 'Principal',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Mic2, label: 'Práctica', href: '/practice', badge: 'NUEVO' },
      { icon: History, label: 'Historial', href: '/history' }
    ]
  },
  {
    title: 'Aprendizaje',
    items: [
      { icon: BookOpen, label: 'Biblioteca', href: '/library' },
      { icon: GraduationCap, label: 'Lecciones', href: '/lessons' },
      { icon: Target, label: 'Técnicas', href: '/techniques' },
      { icon: Trophy, label: 'Logros', href: '/achievements' }
    ]
  },
  {
    title: 'Gestión',
    items: [
      { icon: CreditCard, label: 'Billing', href: '/billing' },
      { icon: Settings, label: 'Settings', href: '/settings' }
    ]
  }
]
```

---

## 📊 Dashboard Principal

Basado en `dashboard-01` de Shadcn, adaptado para VOZAZI:

### Estructura del Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard                                           [Date]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐│
││ Sesiones    ││ Tiempo      ││ Puntuación  ││ Racha   ││
││    24       ││  8h 32m     ││    78       ││  5 días ││
││  ↑ 12%      ││  ↑ 2h       ││  ↑ 5 pts    ││  🔥     ││
│└─────────────┘└─────────────┘└─────────────┘└────────┘│
│                                                             │
│ ┌─────────────────────────────┐ ┌─────────────────────────┐│
││ Progreso Semanal            ││ Técnica Principal        ││
││                             ││                          ││
││  [Chart - Area Chart]       ││  [Radar Chart]           ││
││                             ││                          ││
││  L M X J V S D              ││  Pitch    ████████░░ 80%  ││
││  █ █ █ █ █ █ █              ││  Breath   ██████░░░░ 60%  ││
││                             ││  Onset    ███████░░░ 70%  ││
│└─────────────────────────────┘└─────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
││ Última Sesión                                            ││
││ ┌──────────────────────────────────────────────────────┐ ││
│││ [Waveform Visualization]                               │ ││
│││ Nota: A4 | Score: 82 | Duración: 2:34                 │ ││
│││ [Ver Detalles]                                         │ ││
││└───────────────────────────────────────────────────────┘││
│└─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────┐ ┌─────────────────────────┐│
││ Próximas Lecciones          ││ Logros Recientes         ││
││                             ││                          ││
││ ○ Respiración Diafragmática ││ 🏆 5 días de racha       ││
││ ○ Afinación Perfecta        ││ 🎯 100 sesiones          ││
││ ○ Vibrato Básico            ││ ⭐ Pitch Master          ││
││                             ││                          ││
││ [Ver todas]                 ││ [Ver todos]              ││
│└─────────────────────────────┘└─────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Componentes Shadcn a Utilizar

| Sección | Componente Shadcn | Adaptación |
|---------|-------------------|------------|
| Stats Cards | `card` | Con trend indicators |
| Gráfico Semanal | `chart-area` | Custom colors VOZAZI |
| Radar Técnicas | `chart-radar` | 5 dimensiones |
| Waveform | Custom | Basado en canvas |
| Lecciones | `card` + `progress` | Con estado |
| Logros | `card` + badges | Con iconos |

---

## 🎤 Página de Práctica

### Estructura

```
┌─────────────────────────────────────────────────────────────┐
│ Práctica > Nota Sostenida                      [Info] [?]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │              [TARGET NOTE DISPLAY]                    │ │
│  │                   A4  [440 Hz]                        │ │
│  │                                                       │ │
│  │         [Real-time Pitch Visualization]               │ │
│  │         ═══════════════════════════════               │ │
│  │                                                       │ │
│  │              [Current Note: A4]                       │ │
│  │              ✓ Afinado (-2 cents)                     │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Controles                                             │ │
│  │                                                       │ │
│  │  [◄◄] [▶/⏸] [►►]           [🎤] Grabar              │ │
│  │                                                       │ │
│  │  Progreso: ████████░░░░░░░░  45s / 120s              │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │ Instrucc.   ││ Métricas    ││ Feedback              │  │
│  │             ││             ││                       │  │
│  │ • Respira   ││ Pitch: 82%  ││ ¡Bien hecho!          │  │
│  │ • Relaja    ││ Breath: 75% ││ Mantén el aire...     │  │
│  │ • Sostén    ││ Score: 78   ││                       │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Clave

1. **PitchVisualizer** - Custom canvas component
2. **NoteDisplay** - Basado en `card` con animaciones
3. **RecordingControls** - Custom controls
4. **MetricsCards** - `card` + `progress`
5. **FeedbackPanel** - `alert` + `badge`

---

## 📚 Biblioteca de Técnicas

### Vista de Lista (Grid)

```
┌─────────────────────────────────────────────────────────────┐
│ Técnicas                                      [+ Nueva] [≡] │
├─────────────────────────────────────────────────────────────┤
│ [Search techniques...]  [Filter ▼]  [Sort ▼]               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
││ Respiración  ││ Afinación    ││ Vibrato      │        │
││              ││              ││              │        │
││ [Icon]       ││ [Icon]       ││ [Icon]       │        │
││              ││              ││              │        │
││ 12 ejercicios││ 8 ejercicios ││ 5 ejercicios │        │
││ ★★★★☆       ││ ★★★☆☆       ││ ★★★★★       │        │
││              ││              ││              │        │
││ [Comenzar]   ││ [Comenzar]   ││ [Comenzar]   │        │
│└──────────────┘└──────────────┘└──────────────┘        │
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
││ Onset        ││ Resonancia   ││ Registro     │        │
││              ││              ││              │        │
││ [Icon]       ││ [Icon]       ││ [Icon]       │        │
││              ││              ││              │        │
││ 6 ejercicios ││ 10 ejercicios││ 7 ejercicios │        │
││ ★★★☆☆       ││ ★★★★☆       ││ ★★☆☆☆       │        │
││              ││              ││              │        │
││ [Comenzar]   ││ [Comenzar]   ││ [Comenzar]   │        │
│└──────────────┘└──────────────┘└──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Vista de Detalle de Técnica

```
┌─────────────────────────────────────────────────────────────┐
│ Técnicas > Respiración                         [Edit] [...] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Respiración Diafragmática                             │ │
│  │ ★★★★☆ (4.2) • 12 ejercicios • 2h 30m total           │ │
│  │                                                       │ │
│  │ La respiración diafragmática es la base de una       │ │
│  │ técnica vocal saludable. Aprende a usar tu diafragma │ │
│  │ para un soporte de aire consistente.                 │ │
│  │                                                       │ │
│  │ [▶ Iniciar Ruta]  [☆ Guardar]  [↗ Compartir]        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Progreso en esta técnica                             │ │
│  │                                                       │ │
│  │ ████████░░░░░░░░░░░░ 40% (5/12 ejercicios)           │ │
│  │                                                       │ │
│  │ [Ver progreso detallado]                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Contenido                                             │ │
│  │                                                       │ │
│  │ ┌─────────────────────────────────────────────────┐  │ │
│  ││ 📖 Introducción                                  │  │ │
│  ││    5 min • Teoría                                │  │ │
│  ││    [✓ Completado]                                │  │ │
│  │└─────────────────────────────────────────────────┘  │ │
│  │ ┌─────────────────────────────────────────────────┐  │ │
│  ││ 🎤 Ejercicio 1: Respiración Básica              │  │ │
│  ││    10 min • Práctica                             │  │ │
│  ││    [▶ Comenzar]                                  │  │ │
│  │└─────────────────────────────────────────────────┘  │ │
│  │ ┌─────────────────────────────────────────────────┐  │ │
│  ││ 🎤 Ejercicio 2: Soporte de Aire                 │  │ │
│  ││    15 min • Práctica                             │  │ │
│  ││    [🔒 Completa el anterior]                     │  │ │
│  │└─────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Shadcn

| Elemento | Componente |
|----------|------------|
| Grid de técnicas | `card` + `badge` |
| Progress | `progress` + `separator` |
| Accordion contenido | `accordion` |
| Steps | Custom con `separator` |
| Rating | `rating` custom |

---

## 🎯 Sistema de Lecciones

### Estructura de Lección

Basado en el patrón de `wizard` de Shadcn:

```
┌─────────────────────────────────────────────────────────────┐
│ Lección 3: Afinación Perfecta                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Paso 3 de 5                                                │
│  ████████████░░░░░░░░░░░░░░░░ 60%                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  [Contenido de la lección]                           │ │
│  │                                                       │ │
│  │  Ahora vamos a practicar con notas específicas.      │ │
│  │  Escucha la nota de referencia y luego cántala.      │ │
│  │                                                       │ │
│  │  [▶ Reproducir referencia]                           │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Tu turno                                              │ │
│  │                                                       │ │
│  │  [🎤 Grabar mi intento]                               │ │
│  │                                                       │ │
│  │  [◄ Anterior]              [Siguiente ►]             │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Componentes para Lecciones

1. **Stepper** - Custom progress indicator
2. **LessonCard** - `card` con contenido rico
3. **AudioPlayer** - Custom player
4. **RecordingButton** - Botón con estados
5. **CompletionBadge** - `badge` animado

---

## 🏆 Sistema de Logros

### Vista de Logros

```
┌─────────────────────────────────────────────────────────────┐
│ Logros                                                      │
├─────────────────────────────────────────────────────────────┤
│ [Todos] [En Progreso] [Completados] [Raros]                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
││ 🔥 Racha de Fuego                                      │  │
││                                                        │  │
││ Practica 7 días seguidos                              │  │
││                                                        │  │
││ ████████░░░░░░░░ 5/7 días                             │  │
││                                                        │  │
││ 🏆 Recompensa: 100 puntos de experiencia              │  │
│└───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
││ 🎯 Pitch Master ✓                                      │  │
││                                                        │  │
││ Consigue 90%+ de afinación en 10 sesiones             │  │
││                                                        │  │
││ ████████████████████ 10/10 sesiones                   │  │
││                                                        │  │
││ 🏆 Recompensa: Badge especial                         │  │
││    [Ver en perfil]                                    │  │
│└───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
││ 🎤 Primera Sesión ✓                                    │  │
││                                                        │  │
││ Completa tu primera sesión de práctica                │  │
││                                                        │  │
││ ████████████████████ Completado                       │  │
││                                                        │  │
││ 🏆 Recompensa: 50 puntos de experiencia               │  │
││    [Reclamar]                                         │  │
│└───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Breakpoints

```typescript
const breakpoints = {
  mobile: '320px',    // Mobile small
  mobileLg: '480px',  // Mobile large
  tablet: '768px',    // Tablet
  laptop: '1024px',   // Laptop
  desktop: '1280px',  // Desktop
  desktopXl: '1536px' // Large desktop
}
```

### Adaptaciones por Dispositivo

| Elemento | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Sidebar | Drawer | Collapsible | Fixed |
| Stats Cards | 1 col | 2 cols | 4 cols |
| Charts | Simplified | Standard | Full |
| Player Bar | Mini | Standard | Full |

---

## 🎨 Design Tokens

### Colores VOZAZI

```typescript
const colors = {
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  accent: {
    500: '#8b5cf6',  // Secondary (purple)
    600: '#7c3aed'
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
}
```

### Typography

```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  }
}
```

---

## 🧩 Componentes Shadcn Recomendados

### Core Components

```bash
# Layout
npx shadcn@latest add sidebar
npx shadcn@latest add breadcrumb
npx shadcn@latest add separator

# Data Display
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add progress

# Navigation
npx shadcn@latest add button
npx shadcn@latest add tabs
npx shadcn@latest add scroll-area

# Forms
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add slider
npx shadcn@latest add switch

# Feedback
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add skeleton
npx shadcn@latest add sonner

# Charts
npx shadcn@latest add chart
npx shadcn@latest add chart-area
npx shadcn@latest add chart-bar
npx shadcn@latest add chart-radar
```

### Componentes Custom VOZAZI

```
components/
├── audio/
│   ├── PitchVisualizer.tsx
│   ├── WaveformDisplay.tsx
│   ├── AudioPlayer.tsx
│   ├── RecordingButton.tsx
│   └── Metronome.tsx
├── practice/
│   ├── ExerciseCard.tsx
│   ├── SessionReport.tsx
│   ├── TargetNote.tsx
│   └── FeedbackPanel.tsx
├── learning/
│   ├── LessonStepper.tsx
│   ├── TechniqueCard.tsx
│   ├── ProgressTracker.tsx
│   └── AchievementBadge.tsx
└── dashboard/
    ├── StatsCard.tsx
    ├── WeeklyChart.tsx
    ├── RecentSession.tsx
    └── QuickActions.tsx
```

---

## 🚀 Roadmap de Implementación UX/UI

### Fase 1 - Foundation (Sprint 1-2)
- [ ] Configurar design tokens
- [ ] Implementar layout principal
- [ ] Sidebar navigation
- [ ] Header component
- [ ] Player bar

### Fase 2 - Dashboard (Sprint 3)
- [ ] Stats cards
- [ ] Weekly chart
- [ ] Radar chart técnicas
- [ ] Recent sessions
- [ ] Quick actions

### Fase 3 - Practice (Sprint 4-5)
- [ ] Pitch visualizer
- [ ] Recording controls
- [ ] Feedback panel
- [ ] Session report

### Fase 4 - Library (Sprint 6)
- [ ] Technique grid
- [ ] Technique detail
- [ ] Lesson stepper
- [ ] Progress tracker

### Fase 5 - Gamification (Sprint 7)
- [ ] Achievement system
- [ ] Badges
- [ ] Leaderboard (opcional)
- [ ] Profile page

---

## 📋 Checklist de Accesibilidad

- [ ] Contrast ratios WCAG AA
- [ ] Keyboard navigation completa
- [ ] Screen reader labels
- [ ] Focus indicators visibles
- [ ] Error messages descriptivos
- [ ] Loading states announcements
- [ ] Skip links
- [ ] Reduced motion support

---

## 🎯 Métricas de Éxito UX

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Time to First Practice | < 2 min | Analytics |
| Task Completion Rate | > 85% | Analytics |
| User Error Rate | < 5% | Error tracking |
| Session Duration | > 10 min | Analytics |
| Return Rate (7d) | > 60% | Analytics |
| SUS Score | > 80 | User surveys |

---

*Documento creado: 2026-03-18*
*VOZAZI UX/UI Proposal - Shadcn Based*
