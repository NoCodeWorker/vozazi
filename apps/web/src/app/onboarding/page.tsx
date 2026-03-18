/**
 * Onboarding Page
 * 
 * Página de onboarding para nuevos usuarios.
 */

import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export default function OnboardingPage() {
  return (
    <div className="container max-w-2xl py-12">
      <OnboardingFlow />
    </div>
  )
}
