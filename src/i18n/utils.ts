import {en} from './en'
import {zhCn} from './zhCn'
import {cs} from './cs'
import {config} from "../self.config";

const ui = {
  en,
  'zh-cn':zhCn,
  cs
}

// 定义支持的语言类型
type SupportedLangs = keyof typeof ui;

// 使用支持的语言类型
export function useTranslations(lang: SupportedLangs) {
  if (!Object.keys(ui).includes(lang)) {
    throw new Error(`Invalid language: ${lang}`);
  }
  return function t(key: string) {
    return ui[lang][key] || ui[config.lang][key];
  };
}

// 确保 config.lang 类型正确
export const t = useTranslations(config.lang as SupportedLangs);

