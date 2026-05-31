/**
 * remark-plantuml — 将 ```plantuml 代码块转换为 PlantUML SVG 图片
 * 从 remark-code-blocks 中拆分出的独立插件，仅在文章包含 plantuml 代码块时生效。
 */
import { visit } from "unist-util-visit";
import { deflateSync } from "node:zlib";

const PLANTUML_SERVER = "https://www.plantuml.com/plantuml";

function encode64(data: any) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    let result = "";
    for (let i = 0; i < data.length; i += 3) {
        const b1 = data[i],
            b2 = data[i + 1] || 0,
            b3 = data[i + 2] || 0;
        result += chars[b1 >> 2];
        result += chars[((b1 & 3) << 4) | (b2 >> 4)];
        result += chars[((b2 & 15) << 2) | (b3 >> 6)];
        result += chars[b3 & 63];
    }
    return result;
}

function encodePlantUML(code: any) {
    const deflated = deflateSync(Buffer.from(code, "utf-8"), { level: 9 });
    return encode64(deflated);
}

export function remarkPlantUML() {
    return (tree: any) => {
        visit(tree, "code", (node) => {
            if (node.lang !== "plantuml" || !node.value || !node.value.trim()) return;

            const encoded = encodePlantUML(node.value);
            const src = PLANTUML_SERVER + "/svg/~1" + encoded;
            node.type = "html";
            node.value =
                '<div class="plantuml-diagram"><div class="plantuml-wrapper">' +
                '<img class="plantuml-image" src="' +
                src +
                '" alt="PlantUML diagram" loading="lazy" decoding="async" ' +
                "onerror=\"this.style.display='none';var p=this.parentElement;if(p)p.innerHTML='<span class=&quot;text-sm text-gray-400&quot;>PlantUML 图表加载失败</span>'" +
                '" /></div></div>';
        });
    };
}
