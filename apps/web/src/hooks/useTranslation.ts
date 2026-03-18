'use client'

import { useEffect, useState } from 'react'
import i18n from '@/lib/i18n'
import { i18nConfig, type Locale } from '@/lib/i18n.config'

export function useTranslation(ns: string | string[] = 'translation') {
  const [ready, setReady] = useState(false)
  const [language, setLanguage] = useState<Locale>(i18n.language as Locale || i18nConfig.defaultLocale)

  useEffect(() => {
    const initI18n = async () => {
      if (!i18n.isInitialized) {
        await import('@/lib/i18n')
      }
      setReady(true)
      setLanguage(i18n.language as Locale)
    }

    initI18n()

    const handleLanguageChanged = (lng: string) => {
      setLanguage(lng as Locale)
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [])

  const t = i18n.t.bind(i18n)
  
  const changeLanguage = async (lng: Locale) => {
    await i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
    document.documentElement.lang = lng
  }

  return {
    t,
    i18n: i18n,
    ready,
    language,
    changeLanguage
  }
}
