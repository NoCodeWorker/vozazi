'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { i18nConfig } from '@/lib/i18n.config'

export function LanguageSwitcher() {
  const { language, changeLanguage, ready } = useTranslation()

  if (!ready) {
    return null
  }

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value as typeof i18nConfig.locales[number])}
      className="px-3 py-1.5 text-sm border border-input rounded-md bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Select language"
    >
      {Object.entries(i18nConfig.localeNames).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  )
}
