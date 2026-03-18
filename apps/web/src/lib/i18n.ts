import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { i18nConfig } from './i18n.config'

// Detectar idioma del usuario
const getLocale = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('i18nextLng')
    if (stored && i18nConfig.locales.includes(stored)) {
      return stored
    }
    
    const browserLang = navigator.language.split('-')[0]
    if (i18nConfig.locales.includes(browserLang)) {
      return browserLang
    }
  }
  
  return i18nConfig.defaultLocale
}

i18n
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      return import(`../public/locales/${language}/${namespace}.json`)
    })
  )
  .use(initReactI18next)
  .init({
    lng: getLocale(),
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: 'translation',
    ns: ['translation', 'common', 'dashboard', 'practice', 'billing', 'library', 'onboarding'],
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
    react: {
      useSuspense: true,
    },
    compatibilityJSON: 'v3',
    saveMissing: false,
    missingKeyHandler: false,
  })

export default i18n
