import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ru from './locales/ru.json'
import kk from './locales/kk.json'
import en from './locales/en.json'

export type Language = 'ru' | 'kk' | 'en'

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'kk', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      kk: { translation: kk },
      en: { translation: en },
    },
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'kk', 'en'],
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'crm-language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
