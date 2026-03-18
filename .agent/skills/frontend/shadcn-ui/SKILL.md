---
name: shadcn-ui
description: shadcn/ui component library, customization, and composition patterns. Use when building UI components with shadcn/ui or creating new component variants.
---

# shadcn/ui Skill

This skill provides expertise in using and customizing shadcn/ui components for VOZAZI's premium UI.

## Goal

Build accessible, consistent, and customizable UI components using shadcn/ui following VOZAZI's design system.

## Instructions

### 1. Component Installation

```bash
# Install individual components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add progress
```

### 2. Core Components Usage

```tsx
// Button variants
import { Button } from '@/components/ui/button';

function ActionButtons() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}

// Card for content containers
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function SessionCard({ session }: { session: Session }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{session.exerciseType}</CardTitle>
        <CardDescription>
          {formatDate(session.startedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold">{session.overallScore}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-2xl font-bold">{session.durationSeconds}s</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
}
```

### 3. Dialog for Modals

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function DeleteSessionDialog({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteSession(sessionId);
    setOpen(false);
    setIsDeleting(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this session? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Tabs for Content Organization

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PracticeTabs() {
  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="week">This Week</TabsTrigger>
        <TabsTrigger value="month">This Month</TabsTrigger>
      </TabsList>
      <TabsContent value="today">
        <TodayPractice />
      </TabsContent>
      <TabsContent value="week">
        <WeekPractice />
      </TabsContent>
      <TabsContent value="month">
        <MonthPractice />
      </TabsContent>
    </Tabs>
  );
}
```

### 5. Progress Indicators

```tsx
import { Progress } from '@/components/ui/progress';

function SkillProgress({ skill, value }: { skill: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{skill}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

function MultiProgress({ values }: { values: { label: string; value: number }[] }) {
  return (
    <div className="space-y-4">
      {values.map(({ label, value }) => (
        <SkillProgress key={label} skill={label} value={value} />
      ))}
    </div>
  );
}
```

### 6. Custom Component Composition

```tsx
// components/practice/practice-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PracticeCardProps {
  title: string;
  description: string;
  progress: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onStart: () => void;
}

export function PracticeCard({ 
  title, 
  description, 
  progress, 
  difficulty,
  onStart 
}: PracticeCardProps) {
  const difficultyColors = {
    beginner: 'text-green-500',
    intermediate: 'text-yellow-500',
    advanced: 'text-red-500',
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <span className={`text-xs font-medium capitalize ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <Button onClick={onStart} className="w-full">
          {progress > 0 ? 'Continue' : 'Start'} Practice
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Constraints

- Do NOT modify shadcn/ui source files directly (use composition instead)
- Do NOT skip accessibility features (ARIA labels, keyboard navigation)
- Do NOT use components without proper error states
- Always customize through CSS variables in globals.css
- Always compose components for reusability
- Always test components with keyboard navigation

## Examples

### Good: Composed Form Component
```tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PracticeSettingsFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function PracticeSettingsForm({ onSubmit, isSubmitting }: PracticeSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Settings</CardTitle>
        <CardDescription>Configure your practice session preferences</CardDescription>
      </CardHeader>
      <form action={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Session Duration (minutes)</Label>
            <Input 
              id="duration" 
              name="duration" 
              type="number" 
              min="5" 
              max="60" 
              defaultValue="15"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Input 
              id="difficulty" 
              name="difficulty" 
              type="number" 
              min="1" 
              max="5" 
              defaultValue="2"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
```
