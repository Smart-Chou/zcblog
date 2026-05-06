import zh from "~/data/i18n/zh.json";
import en from "~/data/i18n/en.json";

export const defaultLocale = "zh";
export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

const translations: Record<Locale, typeof zh> = {
    zh,
    en,
};

export function getLocale(locale: string): Locale {
    if (locale === "en" || locale === "zh") {
        return locale;
    }
    return defaultLocale;
}

export function t(
    locale: Locale,
    key: string,
    params?: Record<string, string | number>,
): string {
    const keys = key.split(".");
    let value: unknown = translations[locale];

    for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
            value = (value as Record<string, unknown>)[k];
        } else {
            return key;
        }
    }

    if (typeof value !== "string") {
        return key;
    }

    if (params) {
        return value.replace(
            /\{\{(\w+)\}\}/g,
            (_, paramKey) => params[paramKey]?.toString() ?? `{{${paramKey}}}`,
        );
    }

    return value;
}

export function getLocalePath(locale: Locale, path: string = ""): string {
    if (locale === defaultLocale) {
        return path || "/";
    }
    return `/${locale}${path || "/"}`;
}

export function getAlternateLink(
    currentLocale: Locale,
    currentPath: string,
): { locale: Locale; href: string }[] {
    return locales.map((locale) => ({
        locale,
        href: getLocalePath(locale, currentPath),
    }));
}
