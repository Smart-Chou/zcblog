export function useTheme() {
    // 客户端逻辑封装
    const getIsDark = () => {
        if (typeof window === "undefined") {
            return false;
        }
        const savedTheme = localStorage.getItem("preferredTheme");
        const systemDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        return savedTheme === "dark" || (savedTheme === null && systemDark);
    };

    let isDark = getIsDark();

    // 同步HTML根元素类名和data-theme属性
    if (typeof window !== "undefined") {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
        }

        // 监听系统主题变化
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                const savedTheme = localStorage.getItem("preferredTheme");
                if (savedTheme === null) {
                    // 未手动设置时同步系统
                    const newIsDark = e.matches;
                    root.classList.toggle("dark", newIsDark);
                    root.setAttribute("data-theme", newIsDark ? "dark" : "light");
                    isDark = newIsDark;
                }
            });
    }

    // 切换主题方法
    const toggleTheme = () => {
        if (typeof window !== "undefined") {
            const root = document.documentElement;
            root.classList.toggle("dark");
            const newIsDark = root.classList.contains("dark");
            const newTheme = newIsDark ? "dark" : "light";
            localStorage.setItem(
                "preferredTheme",
                newTheme
            );
            root.setAttribute("data-theme", newTheme);
            isDark = newIsDark;
        }
    };

    return { isDark, toggleTheme };
}
