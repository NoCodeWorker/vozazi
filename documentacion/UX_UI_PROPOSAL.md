# 🎨 VOZAZI — Propuesta de Diseño UX/UI con Shadcn/ui

> **Autor:** Equipo de Diseño UX/UI (Experto Shadcn/ui)  
> **Fecha:** 2026-03-18  
> **Versión:** 1.0  
> **Inspiración:** `npx shadcn@latest add dashboard-01`

---

## 🎯 Filosofía de Diseño

### Principios Rectores

```
1. ✅ Progresivo: De simple a complejo según el usuario avanza
2. ✅ Contextual: Cada pantalla muestra SOLO lo necesario
3. ✅ Inmediato: Feedback visual en <100ms
4. ✅ Alentador: Celebrar micro-victorias constantemente
5. ✅ Claro: Sin jerga técnica abrumadora al inicio
```

### Curva de Aprendizaje Objetivo

```
Día 1:   ████████░░░░░░░░ 20% - Primer ejercicio completado
Día 7:   ████████████░░░░ 40% - Entiende el flujo básico
Día 30:  ████████████████░░ 70% - Domina funciones principales
Día 90:  ████████████████████ 100% - Usuario avanzado
```

---

## 🏗️ Arquitectura de Información

### Estructura de Navegación Principal

```
┌─────────────────────────────────────────────────────────────────┐
│                         LAYOUT PRINCIPAL                         │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  SIDEBAR     │              MAIN CONTENT AREA                   │
│  (Fixed)     │              (Scrollable)                        │
│              │                                                  │
│  • Dashboard │  ┌────────────────────────────────────────────┐ │
│  • Practicar │  │                                            │ │
│  • Lecciones │  │         Página Activa                      │ │
│  • Técnicas  │  │                                            │ │
│  • Progreso  │  │                                            │ │
│  • Biblioteca│  │                                            │ │
│  ──────────  │  │                                            │ │
│  • Perfil    │  └────────────────────────────────────────────┘ │
│  • Billing   │                                                  │
│  • Settings  │                                                  │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## 📐 Sistema de Layouts

### 1. Dashboard Layout (Inspirado en `dashboard-01`)

**Componentes Shadcn a usar:**

```bash
# Layout base
npx shadcn@latest add sidebar
npx shadcn@latest add breadcrumb
npx shadcn@latest add separator

# Componentes de dashboard
npx shadcn@latest add card
npx shadcn@latest add chart
npx shadcn@latest add progress
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add button
npx shadcn@latest add skeleton
```

**Estructura de Carpetas Propuesta:**

```
apps/web/src/
├── components/
│   ├── layout/
│   │   ├── app-sidebar.tsx           # Sidebar principal
│   │   ├── app-header.tsx            # Header con breadcrumbs
│   │   ├── nav-main.tsx              # Navegación principal
│   │   ├── nav-projects.tsx          # Navegación secundaria
│   │   ├── nav-user.tsx              # User menu
│   │   └── team-switcher.tsx         # (Opcional para multi-tenant)
│   │
│   ├── dashboard/
│   │   ├── overview-chart.tsx        # Gráfico de progreso
│   │   ├── recent-sessions.tsx       # Sesiones recientes
│   │   ├── daily-goal-card.tsx       # Meta del día
│   │   ├── skill-cards.tsx           # Cards de habilidades
│   │   └── quick-start-card.tsx      # Acción rápida
│   │
│   ├── practice/
│   │   ├── pitch-visualizer.tsx      # Visualizador de pitch
│   │   ├── exercise-card.tsx         # Card de ejercicio
│   │   ├── feedback-panel.tsx        # Panel de feedback
│   │   └── recording-controls.tsx    # Controles de grabación
│   │
│   └── lessons/
│       ├── lesson-card.tsx           # Card de lección
│       ├── technique-tree.tsx        # Árbol de técnicas
│       ├── progress-tracker.tsx      # Tracker de progreso
│       └── achievement-badge.tsx     # Badge de logro
│
└── app/
    ├── (auth)/
    │   ├── sign-in/
    │   └── sign-up/
    │
    ├── (dashboard)/
    │   ├── layout.tsx                # Layout con sidebar
    │   ├── page.tsx                  # Dashboard principal
    │   ├── practice/
    │   │   ├── page.tsx              # Lista de ejercicios
    │   │   └── [id]/
    │   │       └── page.tsx          # Ejercicio individual
    │   ├── lessons/
    │   │   ├── page.tsx              # Lista de lecciones
    │   │   └── [id]/
    │   │       └── page.tsx          # Lección individual
    │   ├── techniques/
    │   │   ├── page.tsx              # Árbol de técnicas
    │   │   └── [id]/
    │   │       └── page.tsx          # Técnica individual
    │   ├── progress/
    │   │   ├── page.tsx              # Progreso general
    │   │   └── weekly/
    │   │       └── page.tsx          # Reporte semanal
    │   └── library/
    │       ├── page.tsx              # Biblioteca vocal
    │       └── [slug]/
    │           └── page.tsx          # Artículo individual
    │
    └── (marketing)/
        ├── page.tsx                  # Landing page
        └── pricing/
            └── page.tsx              # Página de precios
```

---

## 🎨 Diseño de Páginas Clave

### 1. Dashboard Principal (`/dashboard`)

**Objetivo:** Mostrar estado actual y siguiente acción clara

```tsx
// app/(dashboard)/page.tsx
export default function DashboardPage() {
  return (
    <>
      {/* Header con breadcrumbs */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={[{ title: "Dashboard" }]} />
        <UserMenu />
      </div>

      {/* Contenido principal en grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Meta del Día */}
        <DailyGoalCard 
          current={3}
          total={5}
          unit="ejercicios"
        />

        {/* Card 2: Racha Actual */}
        <StreakCard 
          days={7}
          icon="🔥"
        />

        {/* Card 3: Puntuación Promedio */}
        <ScoreCard 
          score={78}
          trend="+5%"
        />

        {/* Card 4: Tiempo Practicado */}
        <TimeCard 
          minutes={45}
          weeklyGoal={300}
        />
      </div>

      {/* Sección 2: Gráfico de Progreso */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Progreso Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <OverviewChart data={weeklyData} />
          </CardContent>
        </Card>

        {/* Sección 3: Próximo Ejercicio Recomendado */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Siguiente Ejercicio</CardTitle>
            <CardDescription>
              Basado en tu última sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuickStartCard 
              exercise="Sostén de Nota"
              difficulty="Beginner"
              duration="5 min"
              focus="Estabilidad de pitch"
            />
          </CardContent>
        </Card>
      </div>

      {/* Sección 4: Sesiones Recientes */}
      <RecentSessionsTable sessions={recentSessions} />
    </>
  )
}
```

**Wireframe Visual:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard / Progreso                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ 📊 Meta Día │ │ 🔥 Racha    │ │ ⭐ Score    │ │ ⏱️ Tiempo   ││
│  │   3/5       │ │   7 días    │ │   78 (+5%)  │ │  45/300min  ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│                                                                  │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐│
│  │                             │ │  SIGUIENTE EJERCICIO        ││
│  │   GRÁFICO DE PROGRESO       │ │                             ││
│  │   (Línea de 7 días)         │ │  🎯 Sostén de Nota          ││
│  │                             │ │  ⭐ Beginner · 5 min        ││
│  │                             │ │                             ││
│  │                             │ │  [Comenzar →]               ││
│  └─────────────────────────────┘ └─────────────────────────────┘│
│                                                                  │
│  SESIONES RECIENTES                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Fecha  │ Ejercicio      │ Score │ Duración │ Ver →         ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ Hoy    │ Sostén Nota    │   82  │  4 min   │               ││
│  │ Ayer   │ Pitch Target   │   75  │  6 min   │               ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

### 2. Página de Práctica (`/practice`)

**Objetivo:** Flujo de práctica sin distracciones

```tsx
// app/(dashboard)/practice/page.tsx
export default function PracticePage() {
  return (
    <>
      {/* Header con filtro de ejercicios */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Practicar" }
        ]} />
        
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los ejercicios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pitch">Pitch</SelectItem>
              <SelectItem value="breath">Respiración</SelectItem>
              <SelectItem value="vibrato">Vibrato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de ejercicios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            title={exercise.title}
            description={exercise.description}
            difficulty={exercise.difficulty}
            duration={exercise.duration}
            bestScore={exercise.bestScore}
            onPractice={() => router.push(`/practice/${exercise.id}`)}
          />
        ))}
      </div>
    </>
  )
}
```

**Wireframe Visual:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard / Practicar                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Filtros: [Todos ▼]  [Dificultad ▼]  [Duración ▼]               │
│                                                                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ 🎯 Sostén Nota  │ │ 🎵 Pitch Target │ │ 🌬️ Respiración  │   │
│  │                 │ │                 │ │                 │   │
│  │ Estabilidad     │ │ Afinación       │ │ Control de aire │   │
│  │                 │ │                 │ │                 │   │
│  │ ⭐ Beginner     │ │ ⭐ Intermediate  │ │ ⭐ Beginner     │   │
│  │ ⏱️ 5 min       │ │ ⏱️ 8 min       │ │ ⏱️ 3 min       │   │
│  │ 🏆 82 pts       │ │ 🏆 75 pts       │ │ 🏆 90 pts       │   │
│  │                 │ │                 │ │                 │   │
│  │ [Practicar →]   │ │ [Practicar →]   │ │ [Practicar →]   │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ 🎼 Vibrato      │ │ 🎤 Resonancia   │ │ 🎶 Escalas      │   │
│  │ ...             │ │ ...             │ │ ...             │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. Página de Ejercicio Individual (`/practice/[id]`)

**Objetivo:** Inmersión total en el ejercicio

```tsx
// app/(dashboard)/practice/[id]/page.tsx
export default function PracticeSessionPage({ params }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header minimalista */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold">{exercise.title}</h1>
          <p className="text-sm text-muted-foreground">
            Repetición {currentRep} de {totalReps}
          </p>
        </div>
        
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Área principal de práctica */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8">
          
          {/* Visualizador de Pitch */}
          <PitchVisualizer
            targetNote={exercise.targetNote}
            currentPitch={currentPitch}
            centsDeviation={centsDeviation}
            isRecording={isRecording}
          />

          {/* Feedback en tiempo real */}
          <FeedbackPanel
            status={feedbackStatus}
            message={feedbackMessage}
            score={currentScore}
          />

          {/* Controles de grabación */}
          <RecordingControls
            isRecording={isRecording}
            onStart={startRecording}
            onStop={stopRecording}
          />
        </div>
      </div>

      {/* Footer con progreso */}
      <div className="p-4 border-t">
        <Progress value={(currentRep / totalReps) * 100} />
      </div>
    </div>
  )
}
```

**Wireframe Visual:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ←                    Sostén de Nota                    ?       │
│                        Repetición 2 de 5                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│                    ┌─────────────────────┐                      │
│                    │                     │                      │
│                    │   VISUALIZADOR      │                      │
│                    │   DE PITCH          │                      │
│                    │                     │                      │
│                    │   Target: A4        │                      │
│                    │   Actual: G#4       │                      │
│                    │   -15 cents         │                      │
│                    │                     │                      │
│                    └─────────────────────┘                      │
│                                                                  │
│                    ┌─────────────────────┐                      │
│                    │  ¡Muy bien! 🎉      │                      │
│                    │  Score: 82          │                      │
│                    └─────────────────────┘                      │
│                                                                  │
│                    ┌─────────────────────┐                      │
│                    │   🔴 GRABAR         │                      │
│                    └─────────────────────┘                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Progreso: ████████░░░░░░░░░░░░░ 40%                           │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Página de Lecciones (`/lessons`)

**Objetivo:** Progreso claro a través de contenido educativo

```tsx
// app/(dashboard)/lessons/page.tsx
export default function LessonsPage() {
  return (
    <>
      {/* Header con progreso del curso */}
      <div className="space-y-4">
        <Breadcrumbs items={[{ title: "Lecciones" }]} />
        
        <Card>
          <CardHeader>
            <CardTitle>Tu Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <ProgressCard
                title="Lecciones Completadas"
                value={12}
                total={30}
                icon="📚"
              />
              <ProgressCard
                title="Técnicas Aprendidas"
                value={5}
                total={12}
                icon="🎯"
              />
              <ProgressCard
                title="Tiempo Total"
                value={180}
                unit="minutos"
                icon="⏱️"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de lecciones en acordeón */}
      <div className="space-y-4">
        {modules.map((module) => (
          <Accordion type="single" collapsible key={module.id}>
            <AccordionItem value={module.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-4">
                  <Badge variant={module.completed ? "default" : "secondary"}>
                    {module.completed ? "✓" : `${module.completedLessons}/${module.totalLessons}`}
                  </Badge>
                  <div>
                    <h3 className="font-semibold">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      onStart={() => router.push(`/lessons/${lesson.id}`)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </>
  )
}
```

**Wireframe Visual:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard / Lecciones                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ TU PROGRESO                                                  ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                    ││
│  │  │ 📚 12/30 │ │ 🎯 5/12  │ │ ⏱️ 180min│                    ││
│  │  │ Lecciones│ │ Técnicas │ │  Total   │                    ││
│  │  └──────────┘ └──────────┘ └──────────┘                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  MÓDULOS                                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ▼ Módulo 1: Fundamentos                          [3/5] ✓    ││
│  │   ┌───────────────────────────────────────────────────────┐ ││
│  │   │ ✓ Lección 1: Introducción a la voz       [Completo]   │ ││
│  │   │ ✓ Lección 2: Respiración básica          [Completo]   │ ││
│  │   │ ✓ Lección 3: Postura correcta            [Completo]   │ ││
│  │   │ ○ Lección 4: Calentamiento vocal         [Pendiente]  │ ││
│  │   │ ○ Lección 5: Primer ejercicio            [Pendiente]  │ ││
│  │   └───────────────────────────────────────────────────────┘ ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ ▶ Módulo 2: Técnica de Pitch                   [0/8]        ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ ▶ Módulo 3: Control de Vibrato                 [0/6]        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

### 5. Página de Técnicas (`/techniques`)

**Objetivo:** Visualizar el árbol de habilidades como un juego

```tsx
// app/(dashboard)/techniques/page.tsx
export default function TechniquesPage() {
  return (
    <>
      <Breadcrumbs items={[{ title: "Árbol de Técnicas" }]} />
      
      {/* Árbol de técnicas visual */}
      <div className="relative">
        <TechniqueTree
          nodes={techniques}
          onNodeClick={(technique) => router.push(`/techniques/${technique.id}`)}
        />
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span>Dominada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500" />
          <span>En Progreso</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <span>Bloqueada</span>
        </div>
      </div>
    </>
  )
}
```

**Wireframe Visual:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard / Árbol de Técnicas                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌─────────────┐                              │
│                    │ 🎯 Inicio   │  ← Completado ✓              │
│                    └──────┬──────┘                              │
│                           │                                      │
│              ┌────────────┼────────────┐                        │
│              │            │            │                        │
│         ┌────▼────┐  ┌────▼────┐  ┌────▼────┐                  │
│         │ Pitch   │  │ Breath  │  │ Onset   │  ← En progreso   │
│         │  ●     │  │  ●     │  │  ○     │                    │
│         └────┬────┘  └────┬────┘  └─────────┘                  │
│              │            │                                      │
│         ┌────▼────┐  ┌────▼────┐                                │
│         │ Vibrato │  │ Support │  ← Bloqueadas                  │
│         │  ○     │  │  ○     │                                  │
│         └─────────┘  └─────────┘                                │
│                                                                  │
│  Leyenda: ● Dominada  ● En Progreso  ○ Bloqueada               │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. Página de Progreso (`/progress`)

**Objetivo:** Mostrar evolución clara y motivadora

```tsx
// app/(dashboard)/progress/page.tsx
export default function ProgressPage() {
  return (
    <>
      <Breadcrumbs items={[{ title: "Mi Progreso" }]} />
      
      {/* Selector de período */}
      <div className="flex gap-2 mb-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mes</SelectItem>
            <SelectItem value="year">Último Año</SelectItem>
            <SelectItem value="all">Todo el Tiempo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Precisión de Pitch"
          value={accuracy}
          trend={accuracyTrend}
          chart={<Sparkline data={accuracyData} />}
        />
        <MetricCard
          title="Estabilidad"
          value={stability}
          trend={stabilityTrend}
          chart={<Sparkline data={stabilityData} />}
        />
        <MetricCard
          title="Control de Respiración"
          value={breathControl}
          trend={breathTrend}
          chart={<Sparkline data={breathData} />}
        />
        <MetricCard
          title="Consistencia"
          value={consistency}
          trend={consistencyTrend}
          chart={<Sparkline data={consistencyData} />}
        />
      </div>

      {/* Gráfico principal */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Evolución General</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart data={overallData} />
        </CardContent>
      </Card>

      {/* Habilidades por nivel */}
      <SkillBreakdown skills={skills} />
    </>
  )
}
```

---

## 🎨 Sistema de Componentes

### Componentes Críticos a Crear

```bash
# Componentes base de Shadcn
npx shadcn@latest add sidebar
npx shadcn@latest add breadcrumb
npx shadcn@latest add card
npx shadcn@latest add chart
npx shadcn@latest add progress
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add button
npx shadcn@latest add skeleton
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add select
npx shadcn@latest add toast
npx shadcn@latest add sonner
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add slider
npx shadcn@latest add switch
```

### Componentes Personalizados VOZAZI

```
components/vozazi/
├── pitch-visualizer.tsx          # Visualizador de pitch en tiempo real
├── exercise-card.tsx             # Card de ejercicio con score
├── feedback-panel.tsx            # Panel de feedback post-ejercicio
├── recording-controls.tsx        # Controles de grabación
├── technique-tree.tsx            # Árbol de técnicas visual
├── lesson-row.tsx                # Fila de lección en acordeón
├── metric-card.tsx               # Card de métrica con sparkline
├── skill-breakdown.tsx           # Desglose de habilidades
├── daily-goal-card.tsx           # Card de meta diaria
├── streak-card.tsx               # Card de racha
└── achievement-badge.tsx         # Badge de logro
```

---

## 🎯 Flujo de Onboarding

### Paso 1: Bienvenida (2 min)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│              🎤                                                  │
│                                                                  │
│           Bienvenido a VOZAZI                                   │
│                                                                  │
│        Tu entrenador vocal personal con IA                      │
│                                                                  │
│              [Comenzar →]                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Paso 2: Objetivo Principal (1 min)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ¿Qué quieres mejorar principalmente?                           │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ 🎯          │ │ 🎵          │ │ 🌬️          │               │
│  │ Afinación   │ │ Estabilidad │ │ Respiración │               │
│  │             │ │             │ │             │               │
│  │ [Seleccionar│ │ [Seleccionar│ │ [Seleccionar│               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Paso 3: Nivel Autopercibido (1 min)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ¿Cómo describirías tu nivel actual?                            │
│                                                                  │
│  ○ Nunca he entrenado mi voz                                    │
│  ○ Canto de forma amateur                                       │
│  ○ Ya he entrenado algo                                         │
│  ○ Tengo experiencia sólida                                     │
│                                                                  │
│              [Continuar →]                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Paso 4: Tiempo Disponible (30 seg)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ¿Cuánto tiempo puedes practicar al día?                       │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   5 min  │ │  10 min  │ │  15 min  │ │  20+ min │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                  │
│              [Continuar →]                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Paso 5: Calibración Inicial (3 min)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ¡Vamos a conocer tu voz!                                       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │              🎤                                               ││
│  │                                                             ││
│  │         Canta esta nota: A4                                 ││
│  │                                                             ││
│  │              [🔴 GRABAR]                                    ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Paso 6: Primer Resultado (1 min)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  🎉 ¡Excelente comienzo!                                        │
│                                                                  │
│  Tu puntuación inicial: 72                                      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Área a trabajar: Estabilidad de pitch                       ││
│  │                                                             ││
│  │ Primer ejercicio recomendado:                               ││
│  │ 🎯 Sostén de Nota Básica                                    ││
│  │ ⏱️ 5 minutos                                                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│              [Comenzar Primer Ejercicio →]                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Breakpoints

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop pequeño
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Desktop grande
    }
  }
}
```

### Adaptación por Dispositivo

| Dispositivo | Layout | Sidebar | Cards por Row |
|-------------|--------|---------|---------------|
| **Mobile** | Stack | Oculto (hamburger) | 1 |
| **Tablet** | Stack | Colapsable | 2 |
| **Desktop** | Horizontal | Fijo | 3-4 |

---

## 🎨 Sistema de Colores VOZAZI

### Paleta Principal

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // VOZAZI Brand Colors
        primary: {
          DEFAULT: "hsl(262, 83%, 58%)",  // Púrpura vibrante
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          DEFAULT: "hsl(280, 65%, 65%)",  // Lavanda
          foreground: "hsl(0, 0%, 100%)",
        },
        accent: {
          DEFAULT: "hsl(330, 81%, 60%)",  // Rosa vibrante
          foreground: "hsl(0, 0%, 100%)",
        },
        
        // Feedback Colors
        success: "hsl(142, 76%, 36%)",    // Verde
        warning: "hsl(38, 92%, 50%)",     // Ámbar
        error: "hsl(0, 84%, 60%)",        // Rojo
        info: "hsl(217, 91%, 60%)",       // Azul
        
        // Score Colors
        score-low: "hsl(0, 84%, 60%)",    // < 60
        score-medium: "hsl(38, 92%, 50%)",// 60-80
        score-high: "hsl(142, 76%, 36%)", // > 80
      }
    }
  }
}
```

---

## ✅ Checklist de Implementación

### Fase 1: Layout Base (1 semana)

- [ ] Instalar componentes Shadcn base
- [ ] Crear `app-sidebar.tsx`
- [ ] Crear `app-header.tsx`
- [ ] Configurar sistema de breadcrumbs
- [ ] Implementar responsive design

### Fase 2: Dashboard (1 semana)

- [ ] Crear `DailyGoalCard`
- [ ] Crear `StreakCard`
- [ ] Crear `ScoreCard`
- [ ] Crear `TimeCard`
- [ ] Implementar `OverviewChart`
- [ ] Crear `QuickStartCard`
- [ ] Crear `RecentSessionsTable`

### Fase 3: Práctica (2 semanas)

- [ ] Crear `ExerciseCard`
- [ ] Crear `PitchVisualizer`
- [ ] Crear `FeedbackPanel`
- [ ] Crear `RecordingControls`
- [ ] Implementar página de lista de ejercicios
- [ ] Implementar página de ejercicio individual

### Fase 4: Lecciones (1 semana)

- [ ] Crear `LessonCard`
- [ ] Crear `TechniqueTree`
- [ ] Implementar sistema de acordeón
- [ ] Crear `ProgressTracker`
- [ ] Crear `AchievementBadge`

### Fase 5: Progreso (1 semana)

- [ ] Crear `MetricCard`
- [ ] Implementar sparklines
- [ ] Crear `AreaChart`
- [ ] Crear `SkillBreakdown`
- [ ] Implementar selector de período

### Fase 6: Onboarding (1 semana)

- [ ] Crear flujo de 6 pasos
- [ ] Implementar calibración inicial
- [ ] Crear primera recomendación
- [ ] Implementar tracking de progreso

---

## 🎯 Métricas de Éxito UX

| Métrica | Objetivo | Cómo Medir |
|---------|----------|------------|
| **Tiempo a Primer Ejercicio** | < 5 min | Analytics de onboarding |
| **Tasa de Completitud de Onboarding** | > 80% | Funnel de PostHog |
| **Ejercicios por Sesión** | > 3 | Analytics de práctica |
| **Retención Día 7** | > 60% | Cohortes de PostHog |
| **Retención Día 30** | > 40% | Cohortes de PostHog |
| **NPS (Net Promoter Score)** | > 50 | Encuestas in-app |

---

## 📚 Referencias de Inspiración

### Shadcn Examples

- ✅ `dashboard-01` - Layout principal
- ✅ `dashboard-02` - Variants de cards
- ✅ `authentication-01` - Páginas de auth

### Otras Fuentes

- **Duolingo** - Gamificación y progreso
- **Strava** - Tracking de progreso deportivo
- **Headspace** - Onboarding progresivo
- **Notion** - Jerarquía visual clara

---

*Documento de Diseño UX/UI v1.0*  
*VOZAZI Platform - 2026-03-18*
