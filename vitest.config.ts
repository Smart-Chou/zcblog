import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        exclude: ["node_modules", "dist", ".astro"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/",
                "dist/",
                "**/*.d.ts",
                "**/*.astro",
                "**/*.config.*",
                "**/test/**",
            ],
        },
    },
    resolve: {
        alias: {
            "~": resolve(__dirname, "./src"),
        },
    },
});
