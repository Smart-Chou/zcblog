
export function formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().substring(0, 10);
}

// 国际化日期格式化函数
export function formatDateI18n(
    dateInput: Date | string,
    includeTime?: boolean,
): string {
    const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const lang = "zh_CN";

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    if (includeTime) {
        options.hour = "2-digit";
        options.minute = "2-digit";
        options.second = "2-digit";
    }

    const localeMap: Record<string, string> = {
        zh_CN: "zh-CN",
        zh_TW: "zh-TW",
        en: "en-US",
        ja: "ja-JP",
        ko: "ko-KR",
    };

    const locale = localeMap[lang] || "en-US";
    return includeTime
        ? date.toLocaleString(locale, options)
        : date.toLocaleDateString(locale, options);
}

// 国际化日期时间格式化函数（带时分秒）
export function formatDateI18nWithTime(dateInput: Date | string): string {
    return formatDateI18n(dateInput, true);
}

// 统一格式为 YYYY-MM-DD HH:mm
export function formatDateTimeToYYYYMMDDHHmm(dateInput: Date | string): string {
    const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };

    const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((p) => p.type === type)?.value || "";

    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}
