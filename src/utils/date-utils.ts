/** 按 pubDate 降序排列（最新在前）。支持 Date 和 string 类型的 pubDate。 */
export function sortByPubDate<T extends { data: { pubDate: Date | string } }>(posts: T[]): T[] {
    return [...posts].sort(compareByPubDate);
}

/** pubDate 降序比较器，用于自定义排序中作为回退。支持 Date 和 string 类型。 */
export function compareByPubDate<T extends { data: { pubDate: Date | string } }>(
    a: T,
    b: T,
): number {
    const aTime =
        typeof a.data.pubDate === "string"
            ? new Date(a.data.pubDate).getTime()
            : a.data.pubDate.getTime();
    const bTime =
        typeof b.data.pubDate === "string"
            ? new Date(b.data.pubDate).getTime()
            : b.data.pubDate.getTime();
    return bTime - aTime;
}

export function formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().substring(0, 10);
}

// 国际化日期格式化函数
export function formatDateI18n(dateInput: Date | string, includeTime?: boolean): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
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
