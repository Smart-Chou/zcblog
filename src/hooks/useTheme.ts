export function useTheme() {
    // 客户端逻辑封装
    const getIsDark = () => {
        if (typeof window === "undefined") {
            return false;
        }
        const root = document.documentElement;
        return root.classList.contains("dark");
    };

    let isDark = getIsDark();

    // 初始化时检查本地存储的主题偏好
    if (typeof window !== "undefined") {
        const root = document.documentElement;
        const savedTheme = localStorage.getItem("preferredTheme");
        if (savedTheme) {
            const shouldBeDark = savedTheme === "dark";
            if (shouldBeDark !== isDark) {
                root.classList.toggle("dark", shouldBeDark);
                root.setAttribute("data-theme", savedTheme);
                isDark = shouldBeDark;
            }
        } else {
            // 无保存主题时，使用系统主题
            const systemIsDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            if (systemIsDark !== isDark) {
                root.classList.toggle("dark", systemIsDark);
                root.setAttribute(
                    "data-theme",
                    systemIsDark ? "dark" : "light",
                );
                isDark = systemIsDark;
            }
        }
    }

    // 监听系统主题变化
    if (typeof window !== "undefined") {
        const root = document.documentElement;
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                const savedTheme = localStorage.getItem("preferredTheme");
                if (savedTheme === null) {
                    // 未手动设置时同步系统
                    const newIsDark = e.matches;
                    root.classList.toggle("dark", newIsDark);
                    root.setAttribute(
                        "data-theme",
                        newIsDark ? "dark" : "light",
                    );
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
            localStorage.setItem("preferredTheme", newTheme);
            root.setAttribute("data-theme", newTheme);
            isDark = newIsDark;
        }
    };

    return { isDark, toggleTheme };
}
