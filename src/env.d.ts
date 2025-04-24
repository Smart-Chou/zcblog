/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly UMAMI_API_TOKEN: string;
    readonly UMAMI_WEBSITE_ID: string;
    readonly UMAMI_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
