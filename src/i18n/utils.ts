import {en} from './en'
import {zhCn} from './zhCn'
import {cs} from './cs'
import {config} from "../self.config";

const ui = {
  en,
  'zh-cn':zhCn,
  cs
}

export function useTranslations(lang: keyof typeof ui) {
  if (!Object.keys(ui).includes(lang)) {
    throw new Error(`Invalid language: ${lang}`);
  }
  return function t(key: string) {
    return ui[lang][key] || ui[config.lang][key];
  }
}

export const t = useTranslations(config.lang);

