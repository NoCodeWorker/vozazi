import 'i18next'
import translation from '../public/locales/es/translation.json'
import common from '../public/locales/es/common.json'
import dashboard from '../public/locales/es/dashboard.json'
import practice from '../public/locales/es/practice.json'
import billing from '../public/locales/es/billing.json'
import library from '../public/locales/es/library.json'
import onboarding from '../public/locales/es/onboarding.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof translation
      common: typeof common
      dashboard: typeof dashboard
      practice: typeof practice
      billing: typeof billing
      library: typeof library
      onboarding: typeof onboarding
    }
  }
}
