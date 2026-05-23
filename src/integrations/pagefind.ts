import type { HookParameters } from "astro";
import { fileURLToPath } from "node:url";
import * as pagefind from "pagefind";
import type { PagefindConfig } from "../schemas/pagefind";

export async function starlightPagefind({
    dir,
    logger: starlightLogger,
    pagefindConfig,
}: {
    dir: HookParameters<"astro:build:done">["dir"];
    logger: HookParameters<"astro:build:done">["logger"];
    pagefindConfig: PagefindConfig;
}) {
    const logger = starlightLogger.fork("pagefind");

    try {
        const now = performance.now();
        logger.info("Building search index with Pagefind...");

        const newIndexResponse = await pagefind.createIndex({
            forceLanguage: pagefindConfig.forceLanguage,
            excludeSelectors: pagefindConfig.excludeSelectors,
            keepIndexUrl: pagefindConfig.keepIndexUrl,
            writePlayground: pagefindConfig.writePlayground,
            includeCharacters: pagefindConfig.includeCharacters,
        });

        const { index } = assertPagefindResponse<pagefind.NewIndexResponse>(
            newIndexResponse,
            logger,
        );

        const indexingResponse = await index.addDirectory({
            path: fileURLToPath(dir),
            glob: pagefindConfig.glob,
        });
        const { page_count } = assertPagefindResponse<pagefind.IndexingResponse>(
            indexingResponse,
            logger,
        );

        logger.info(`Found ${page_count} HTML files.`);

        const writeFilesResponse = await index.writeFiles({
            outputPath: fileURLToPath(new URL("./pagefind/", dir)),
        });
        assertPagefindResponse<pagefind.WriteFilesResponse>(writeFilesResponse, logger);

        const pagefindTime = performance.now() - now;
        logger.info(
            `Finished building search index in ${pagefindTime < 750 ? `${Math.round(pagefindTime)}ms` : `${(pagefindTime / 1000).toFixed(2)}s`}.`,
        );
    } catch (cause) {
        throw new Error("Failed to run Pagefind.", { cause });
    } finally {
        await pagefind.close();
    }
}

function assertPagefindResponse<T extends { errors: string[] }>(
    response: T,
    logger: ReturnType<HookParameters<"astro:build:done">["logger"]["fork"]>,
) {
    if (response.errors.length > 0) {
        for (const error of response.errors) logger.error(`Pagefind error: ${error}`);
        throw new Error("Pagefind response contained errors.");
    }
    return response as Required<T>;
}
