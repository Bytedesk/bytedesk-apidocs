import enMessages from './en.json'
import zhCNMessages from './zh-CN.json'
import zhTWMessages from './zh-TW.json'

export const messages = {
  en: enMessages,
  'zh-CN': zhCNMessages,
  'zh-TW': zhTWMessages,
}

export const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
]

export const defaultLocale = 'zh-CN'

// 获取浏览器语言偏好
export const getBrowserLocale = (): string => {
  if (typeof window === 'undefined') return defaultLocale
  
  try {
    // 获取浏览器语言列表，优先使用第一个
    const languages = navigator.languages || [navigator.language] || [defaultLocale]
    
    for (const lang of languages) {
      const language = lang.toLowerCase()
      
      // 映射浏览器语言代码到我们支持的语言
      if (language.startsWith('zh')) {
        if (language.includes('tw') || language.includes('hk') || language.includes('mo')) {
          return 'zh-TW'
        }
        return 'zh-CN'
      }
      
      if (language.startsWith('en')) {
        return 'en'
      }
    }
    
    return defaultLocale
  } catch (error) {
    console.warn('Failed to detect browser locale, using default:', error)
    return defaultLocale
  }
}

// 从本地存储获取用户选择的语言
export const getStoredLocale = (): string => {
  if (typeof window === 'undefined') return defaultLocale
  
  try {
    const stored = localStorage.getItem('locale')
    if (stored && Object.keys(messages).includes(stored)) {
      return stored
    }
    // 如果没有存储的语言或存储的语言不支持，使用浏览器语言
    return getBrowserLocale()
  } catch (error) {
    console.warn('Failed to get stored locale, using browser locale:', error)
    return getBrowserLocale()
  }
}

// 保存用户选择的语言到本地存储
export const setStoredLocale = (locale: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale)
  }
}