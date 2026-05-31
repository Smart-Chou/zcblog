/**
 * Remark Include 插件
 *
 * 支持 `:::include[./path/to/file.md]` 语法，将外部文件内容嵌入当前文档。
 *
 * 语法:
 * ```md
 * :::include[./snippets/hello.md]
 * :::
 * ```
 *
 * 支持行范围选择:
 * ```md
 * :::include[./src/foo.ts#L1-L10]
 * :::
 * ```
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { visit } from "unist-util-visit";

let currentFile = "";

export function remarkInclude() {
    return (tree: any, file: any) => {
        // Track the current file being processed for relative path resolution
        currentFile = file.path || "";

        visit(tree, (node, index, parent) => {
            if (
                !parent ||
                index === undefined ||
                node.type !== "containerDirective" ||
                node.name !== "include"
            ) {
                return;
            }

            // Extract path from the directive label
            let includePath = "";
            if (node.children && node.children.length > 0) {
                const firstChild = node.children[0];
                if (
                    firstChild.data &&
                    firstChild.data.directiveLabel &&
                    firstChild.children &&
                    firstChild.children[0]
                ) {
                    includePath = firstChild.children[0].value || "";
                }
            }

            if (!includePath) return;

            // Parse optional line range: path#L1-L10
            let lineStart = 0;
            let lineEnd = Infinity;
            const hashIdx = includePath.indexOf("#L");
            if (hashIdx !== -1) {
                const range = includePath.slice(hashIdx + 2);
                includePath = includePath.slice(0, hashIdx);
                const parts = range.split("-");
                lineStart = Math.max(0, (parseInt(parts[0], 10) || 1) - 1);
                if (parts[1]) {
                    lineEnd = parseInt(parts[1], 10);
                }
            }

            // Resolve path relative to the current markdown file
            const baseDir = currentFile ? dirname(currentFile) : process.cwd();
            const fullPath = resolve(baseDir, includePath);

            if (!existsSync(fullPath)) {
                parent.children[index] = {
                    type: "paragraph",
                    data: {
                        hName: "div",
                        hProperties: {
                            class: "include-error",
                        },
                    },
                    children: [
                        {
                            type: "text",
                            value: `Include error: file not found — ${includePath}`,
                        },
                    ],
                };
                return;
            }

            const raw = readFileSync(fullPath, "utf-8");
            const lines = raw.split("\n");
            const selected = lines.slice(lineStart, lineEnd).join("\n");

            // Insert as raw HTML to preserve formatting
            // For code files, wrap in a code block
            const ext = includePath.split(".").pop()?.toLowerCase();
            const codeExts = new Set([
                "ts",
                "tsx",
                "js",
                "jsx",
                "mjs",
                "cjs",
                "py",
                "rb",
                "go",
                "rs",
                "java",
                "kt",
                "swift",
                "c",
                "cpp",
                "h",
                "hpp",
                "css",
                "scss",
                "less",
                "html",
                "xml",
                "json",
                "yaml",
                "yml",
                "toml",
                "sql",
                "sh",
                "bash",
                "zsh",
                "fish",
                "vue",
                "svelte",
                "astro",
                "dockerfile",
                "makefile",
                "nginx",
            ]);

            if (codeExts.has(ext || "")) {
                parent.children[index] = {
                    type: "code",
                    lang: ext || "",
                    value: selected,
                };
            } else {
                parent.children[index] = {
                    type: "html",
                    value: selected,
                };
            }
        });
    };
}
