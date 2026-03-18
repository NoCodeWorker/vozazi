/**
 * Main Navigation Component for VOZAZI
 * 
 * Navegación principal de la aplicación.
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Mic2,
  History,
  BookOpen,
  CreditCard,
  Settings,
  Headphones
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Práctica',
    href: '/practice',
    icon: Mic2
  },
  {
    name: 'Historial',
    href: '/history',
    icon: History
  },
  {
    name: 'Biblioteca',
    href: '/library',
    icon: BookOpen
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

export function MainNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
