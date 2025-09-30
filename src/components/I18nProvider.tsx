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
  // 初始化时就使用正确的locale，避免显示国际化ID
  const [locale, setLocaleState] = useState<string>(() => {
    // 在客户端时立即获取正确的locale
    if (typeof window !== 'undefined') {
      return getStoredLocale()
    }
    return defaultLocale
  })

  useEffect(() => {
    // 确保在客户端hydration后再次检查locale
    const storedLocale = getStoredLocale()
    if (storedLocale !== locale) {
      setLocaleState(storedLocale)
    }
  }, [locale])

  const setLocale = (newLocale: string) => {
    if (Object.keys(messages).includes(newLocale)) {
      setLocaleState(newLocale)
      setStoredLocale(newLocale)
    } else {
      console.warn(`Unsupported locale: ${newLocale}`)
    }
  }

  const availableLocales = Object.keys(messages)
  
  // 确保messages存在，避免在生产环境中出现undefined
  const currentMessages = messages[locale as keyof typeof messages] || messages[defaultLocale as keyof typeof messages]

  // 动态更新页面标题
  useEffect(() => {
    if (typeof document !== 'undefined' && currentMessages) {
      // 使用国际化的app.title更新页面标题
      const titleKey = 'app.title'
      const title = currentMessages[titleKey as keyof typeof currentMessages] || 'API Docs'
      document.title = title as string
      
      // 同时更新html的lang属性
      const htmlElement = document.documentElement
      if (htmlElement) {
        // 设置正确的语言代码
        const langCode = locale === 'zh-CN' ? 'zh-CN' : 
                        locale === 'zh-TW' ? 'zh-TW' : 'en'
        htmlElement.setAttribute('lang', langCode)
      }
    }
  }, [locale, currentMessages])

  return (
    <I18nContext.Provider value={{ locale, setLocale, availableLocales }}>
      <IntlProvider
        messages={currentMessages}
        locale={locale}
        defaultLocale={defaultLocale}
        onError={(error) => {
          // 在生产环境中不显示错误，避免控制台污染
          if (import.meta.env.DEV) {
            console.warn('IntlProvider error:', error)
          }
        }}
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  )
}