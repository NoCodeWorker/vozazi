export const i18nConfig = {
  locales: ['es', 'en', 'pt', 'fr', 'de', 'it'] as const,
  defaultLocale: 'es' as const,
  localeNames: {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano'
  }
} as const

export type Locale = (typeof i18nConfig.locales)[number]
