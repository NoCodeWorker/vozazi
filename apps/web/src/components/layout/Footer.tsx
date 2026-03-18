/**
 * Footer Component for VOZAZI
 */

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{' '}
          <Link
            href="/"
            className="font-medium underline underline-offset-4"
          >
            VOZAZI
          </Link>
          . The source code is available on{' '}
          <Link
            href="https://github.com/NoCodeWorker/vozazi"
            className="font-medium underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  )
}
