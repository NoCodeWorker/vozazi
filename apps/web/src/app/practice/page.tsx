/**
 * Practice Page
 * 
 * Página principal de práctica.
 */

import { AudioPractice } from '@/components/practice/AudioPractice'

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Práctica</h1>
        <p className="text-muted-foreground">
          Entrena tu voz con ejercicios guiados
        </p>
      </div>

      <AudioPractice
        exerciseType="sustain_note"
        targetNote="A4"
        onSessionComplete={(data) => {
          console.log('Session completed:', data)
        }}
        onSessionCancel={() => {
          console.log('Session cancelled')
        }}
      />
    </div>
  )
}
