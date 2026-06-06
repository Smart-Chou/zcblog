/**
 * OG 图片生成集成：注入路由到 /og/[...og].png
 */
import type { AstroIntegration } from "astro";

export default function ogImageIntegration(): AstroIntegration {
    return {
        name: "og-image",
        hooks: {
            "astro:config:setup": ({ injectRoute }) => {
                injectRoute({
                    pattern: "/og/[...og].png",
                    entrypoint: "./src/integrations/og-image-route.ts",
                });
            },
        },
    };
}
