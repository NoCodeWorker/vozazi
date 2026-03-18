---
name: clerk-auth
description: Clerk para autenticación y gestión de usuarios en VOZAZI. Use cuando implemente login, registro, protección de rutas, o gestión de sesiones de usuario.
---

# Clerk Authentication Skill

Esta skill proporciona experiencia en Clerk para implementar autenticación segura y gestión de usuarios en VOZAZI.

## Objetivo

Implementar autenticación robusta, protección de rutas y gestión de sesiones de usuario usando Clerk en la aplicación VOZAZI.

## Instrucciones

### 1. Configuración Inicial

```bash
# Instalar Clerk para Next.js
npm install @clerk/nextjs
```

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/landing(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  // Proteger rutas privadas
  if (!isPublicRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
  
  // Proteger rutas de admin
  if (isAdminRoute(req)) {
    const role = sessionClaims?.metadata?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### 2. Provider Setup

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: '#1A1A1A',
          colorInputBackground: '#2A2A2A',
          colorInputText: '#FFFFFF',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
```

### 3. Componentes de Autenticación

```typescript
// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn 
        routing="path" 
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}

// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp 
        routing="path" 
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/onboarding"
      />
    </div>
  );
}
```

### 4. Obtener Usuario Autenticado

```typescript
// lib/auth/get-current-user.ts
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  return userId;
}

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }
  
  // Buscar usuario en BD local
  const localUser = await db.query.users.findFirst({
    where: eq(users.clerkUserId, userId),
  });
  
  // Si no existe, crearlo
  if (!localUser) {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }
    
    const [newUser] = await db.insert(users).values({
      clerkUserId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      displayName: clerkUser.firstName || clerkUser.username || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return newUser;
  }
  
  return localUser;
}

export async function requireUser() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}
```

### 5. Server Actions con Auth

```typescript
// server/actions/sessions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { revalidatePath } from 'next/cache';

const createSessionSchema = z.object({
  exerciseType: z.enum(['sustain_note', 'pitch_target', 'clean_onset']),
  targetNote: z.string().optional(),
  difficulty: z.number().int().min(1).max(5),
});

export async function createSession(formData: FormData) {
  // 1. Verificar autenticación
  const { userId } = await auth();
  
  if (!userId) {
    return { 
      success: false, 
      error: 'Unauthorized',
      redirectTo: '/sign-in'
    };
  }
  
  // 2. Validar datos
  const validated = createSessionSchema.safeParse({
    exerciseType: formData.get('exerciseType'),
    targetNote: formData.get('targetNote'),
    difficulty: Number(formData.get('difficulty')),
  });
  
  if (!validated.success) {
    return { success: false, error: 'Invalid input' };
  }
  
  // 3. Crear sesión
  try {
    const [session] = await db.insert(sessions).values({
      userId, // clerkUserId
      ...validated.data,
      startedAt: new Date(),
      status: 'started',
    }).returning();
    
    revalidatePath('/dashboard');
    revalidatePath('/history');
    
    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error('Failed to create session:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

export async function getUserSessions() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  return await db.query.sessions.findMany({
    where: eq(sessions.userId, userId),
    orderBy: (sessions, { desc }) => [desc(sessions.startedAt)],
    limit: 20,
  });
}
```

### 6. Componentes con Estado de Auth

```typescript
// components/auth/user-button.tsx
'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserMenuButton() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded) {
    return <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />;
  }
  
  if (!isSignedIn) {
    return (
      <Button variant="outline" onClick={() => window.location.href = '/sign-in'}>
        Sign In
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-2">
          <p className="text-sm font-medium">{user.fullName}</p>
          <p className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.href = '/billing'}>
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.href = '/sign-out'}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 7. Webhooks de Clerk

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    return new Response('Missing CLERK_WEBHOOK_SECRET', { status: 500 });
  }
  
  const payload = await req.text();
  const headerPayload = headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');
  
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 });
  }
  
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;
  
  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', { status: 400 });
  }
  
  const eventType = evt.type;
  
  // Manejar eventos
  switch (eventType) {
    case 'user.created': {
      const { id, email_addresses, first_name, last_name } = evt.data;
      
      await db.insert(users).values({
        clerkUserId: id,
        email: email_addresses[0]?.email_address || '',
        displayName: `${first_name || ''} ${last_name || ''}`.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      break;
    }
    
    case 'user.updated': {
      const { id, email_addresses, first_name, last_name } = evt.data;
      
      await db.update(users)
        .set({
          email: email_addresses[0]?.email_address || '',
          displayName: `${first_name || ''} ${last_name || ''}`.trim(),
          updatedAt: new Date(),
        })
        .where(eq(users.clerkUserId, id));
      
      break;
    }
    
    case 'user.deleted': {
      const { id } = evt.data;
      
      await db.delete(users).where(eq(users.clerkUserId, id));
      
      break;
    }
  }
  
  return new Response('Webhook processed', { status: 200 });
}
```

### 8. Roles y Permisos

```typescript
// lib/auth/roles.ts
import { auth } from '@clerk/nextjs/server';

export type UserRole = 'user' | 'premium' | 'admin';

export async function getUserRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata as { role?: UserRole };
  return metadata?.role || 'user';
}

export async function requireRole(role: UserRole) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  const userRole = await getUserRole();
  
  const roleHierarchy: UserRole[] = ['user', 'premium', 'admin'];
  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(role);
  
  if (userRoleIndex < requiredRoleIndex) {
    throw new Error('Insufficient permissions');
  }
  
  return userRole;
}

// Server Action con verificación de rol
export async function accessPremiumFeature() {
  await requireRole('premium');
  
  // Lógica para usuarios premium
}
```

## Restricciones

- NO confiar en el cliente para verificación de auth
- NO exponer Clerk secret keys en el cliente
- NO olvidar verificar auth en cada Server Action
- NO usar userId sin validar que existe
- Siempre verificar webhooks con firma
- Siempre manejar casos de usuario no encontrado
- Siempre limpiar sesiones al cerrar cuenta

## Ejemplos

### Bueno: Protección Completa de Ruta
```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { DashboardContent } from './dashboard-content';

export default async function DashboardPage() {
  // 1. Verificar autenticación
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // 2. Obtener datos del usuario
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/onboarding');
  }
  
  // 3. Verificar suscripción activa
  const subscription = await getSubscription(user.id);
  
  if (!subscription || subscription.status !== 'active') {
    redirect('/billing');
  }
  
  // 4. Renderizar dashboard
  return <DashboardContent user={user} subscription={subscription} />;
}
```
