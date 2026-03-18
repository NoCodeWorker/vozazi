import { Button } from '@vozazi/ui'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">VOZAZI</h1>
      <p className="text-xl text-muted-foreground mb-8">
        AI-powered audio processing and voice analysis
      </p>
      <Button>Get Started</Button>
    </main>
  )
}
