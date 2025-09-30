import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { messages, defaultLocale, getStoredLocale, setStoredLocale } from '../locales'

interface I18nContextType {
  locale: string
  setLocale: (locale: string) => void
  availableLocales: string[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

interface I18nProviderProps {
  children: ReactNode
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>(defaultLocale)

  useEffect(() => {
    const storedLocale = getStoredLocale()
    setLocaleState(storedLocale)
  }, [])

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    setStoredLocale(newLocale)
  }

  const availableLocales = Object.keys(messages)

  return (
    <I18nContext.Provider value={{ locale, setLocale, availableLocales }}>
      <IntlProvider
        messages={messages[locale as keyof typeof messages]}
        locale={locale}
        defaultLocale={defaultLocale}
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  )
}