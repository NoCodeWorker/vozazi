/**
 * Header Component for VOZAZI
 * 
 * Header principal con logo y menú.
 */

'use client'

import Link from 'next/link'
import { MainNavigation } from './MainNavigation'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { Button } from '@vozazi/ui'
import { Headphones } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Headphones className="h-6 w-6" />
            <span className="font-bold">VOZAZI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              href="/practice"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Práctica
            </Link>
            <Link
              href="/library"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Biblioteca
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm">
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}
