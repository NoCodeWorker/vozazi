/**
 * App Layout Component
 * 
 * Layout principal con navegación lateral.
 */

import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { MainNavigation } from './MainNavigation'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full flex-col">
            <div className="flex h-[3.65rem] items-center border-b px-4">
              <span className="font-semibold">Menú</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              <MainNavigation />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
