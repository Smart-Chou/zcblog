class ThemeManager {
    private static instance: ThemeManager;
    private isDark: boolean = false;
    private initialized: boolean = false;

    private constructor() {
        this.init();
    }

    static getInstance(): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    private init() {
        if (typeof window === "undefined" || this.initialized) return;

        const savedTheme = localStorage.getItem("preferredTheme");

        if (savedTheme) {
            this.isDark = savedTheme === "dark";
        } else {
            this.isDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
        }

        this.applyTheme();
        this.setupSystemThemeListener();
        this.initialized = true;
    }

    private applyTheme() {
        if (typeof window === "undefined") return;
        const root = document.documentElement;
        root.classList.toggle("dark", this.isDark);
        root.setAttribute("data-theme", this.isDark ? "dark" : "light");
    }

    private setupSystemThemeListener() {
        if (typeof window === "undefined") return;
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                if (localStorage.getItem("preferredTheme") === null) {
                    this.isDark = e.matches;
                    this.applyTheme();
                }
            });
    }

    toggleTheme() {
        if (typeof window === "undefined") return;
        this.isDark = !this.isDark;
        localStorage.setItem("preferredTheme", this.isDark ? "dark" : "light");
        this.applyTheme();
    }

    getIsDark(): boolean {
        return this.isDark;
    }
}

export function useTheme() {
    const manager = ThemeManager.getInstance();
    return {
        isDark: manager.getIsDark(),
        toggleTheme: () => manager.toggleTheme(),
    };
}
