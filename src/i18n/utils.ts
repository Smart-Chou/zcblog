import { en } from './en'
import { zhCn } from './zhCn'
import { config } from '../self.config'

const languages = {
  en,
  'zh-CN': zhCn,
}

export const defaultLang = config.lang

// 定义支持的语言类型
type SupportedLangs = keyof typeof languages

// 使用支持的语言类型
export function useTranslations(lang: SupportedLangs) {
  if (!Object.keys(languages).includes(lang)) {
    throw new Error(`Invalid language: ${lang}`)
  }
  return function t(key: string) {
    return languages[lang][key] || languages[defaultLang][key]
  }
}

// 确保 defaultLang 类型正确
export const t = useTranslations(defaultLang as SupportedLangs)
