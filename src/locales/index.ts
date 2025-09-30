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
  
  const language = navigator.language || navigator.languages?.[0] || defaultLocale
  
  // 映射浏览器语言代码到我们支持的语言
  if (language.startsWith('zh')) {
    if (language.includes('TW') || language.includes('HK') || language.includes('MO')) {
      return 'zh-TW'
    }
    return 'zh-CN'
  }
  
  if (language.startsWith('en')) {
    return 'en'
  }
  
  return defaultLocale
}

// 从本地存储获取用户选择的语言
export const getStoredLocale = (): string => {
  if (typeof window === 'undefined') return defaultLocale
  return localStorage.getItem('locale') || getBrowserLocale()
}

// 保存用户选择的语言到本地存储
export const setStoredLocale = (locale: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale)
  }
}