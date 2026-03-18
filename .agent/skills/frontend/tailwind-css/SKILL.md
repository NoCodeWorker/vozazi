---
name: tailwind-css
description: Tailwind CSS utility-first styling, responsive design, and customization. Use when styling components, implementing responsive layouts, or configuring Tailwind.
---

# Tailwind CSS Skill

This skill provides expertise in Tailwind CSS for VOZAZI's premium UI styling with responsive design and dark mode support.

## Goal

Implement consistent, responsive, and accessible styling using Tailwind CSS utilities following VOZAZI's design system.

## Instructions

### 1. VOZAZI Tailwind Configuration

```javascript
// apps/web/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 2. Responsive Design Patterns

```tsx
// Mobile-first approach
export function PracticeCard() {
  return (
    <div className="
      /* Base (mobile) */
      p-4 space-y-3
      /* Tablet */
      md:p-6 md:space-y-4 md:flex md:items-center
      /* Desktop */
      lg:p-8 lg:grid lg:grid-cols-3 lg:gap-6
      /* Large desktop */
      xl:grid-cols-4 xl:gap-8
    ">
      <div className="col-span-2">
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold">
          Sustain Note Practice
        </h3>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Work on pitch stability and breath control
        </p>
      </div>
      <div className="flex gap-2 md:gap-3">
        <Button size="sm" className="md:w-full">Start</Button>
        <Button variant="outline" size="sm" className="md:w-full">Details</Button>
      </div>
    </div>
  );
}
```

### 3. Dark Mode

```tsx
// Dark mode compatible components
export function SessionCard({ session }: { session: Session }) {
  return (
    <div className="
      bg-card text-card-foreground
      border border-border
      rounded-lg shadow-sm
      hover:shadow-md hover:bg-accent/10
      transition-all duration-200
      dark:bg-card/50 dark:hover:bg-accent/5
    ">
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{session.exerciseType}</span>
          <ScoreBadge score={session.overallScore} />
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(session.startedAt)}
        </div>
      </div>
    </div>
  );
}

// Score badge with color variants
function ScoreBadge({ score }: { score: number }) {
  const colorClass = score >= 80 
    ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20'
    : score >= 60
    ? 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20'
    : 'bg-red-500/10 text-red-500 dark:bg-red-500/20';
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {score}
    </span>
  );
}
```

### 4. Component Patterns

```tsx
// Reusable button variants
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

## Constraints

- Do NOT use arbitrary values (e.g., `w-[357px]`) when Tailwind has a utility
- Do NOT mix Tailwind with inline styles unless dynamically calculated
- Do NOT forget dark mode variants for custom colors
- Always use CSS variables for theme colors
- Always implement responsive design mobile-first
- Always ensure sufficient color contrast for accessibility

## Examples

### Good: Responsive Grid Layout
```tsx
export function DashboardGrid() {
  return (
    <div className="grid gap-4 md:gap-6 lg:gap-8
                    grid-cols-1 
                    md:grid-cols-2 
                    lg:grid-cols-3
                    xl:grid-cols-4">
      {/* Stats cards */}
      <StatsCard title="Total Sessions" value="24" />
      <StatsCard title="Avg Score" value="78" />
      <StatsCard title="Practice Time" value="4.5h" />
      <StatsCard title="Current Streak" value="5 days" />
      
      {/* Recent sessions - full width on mobile, 2 cols on desktop */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
        <RecentSessions />
      </div>
    </div>
  );
}
```
