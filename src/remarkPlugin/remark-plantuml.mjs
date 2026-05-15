import { visit } from "unist-util-visit";
import { deflateSync } from "node:zlib";

const SERVER = "https://www.plantuml.com/plantuml";

function encode64(data) {
    const chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
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

function encodePlantUML(code) {
    const deflated = deflateSync(Buffer.from(code, "utf-8"), { level: 9 });
    return encode64(deflated);
}

export function remarkPlantuml() {
    return (tree) => {
        visit(tree, "code", (node) => {
            if (node.lang === "plantuml" && node.value && node.value.trim()) {
                const encoded = encodePlantUML(node.value);
                const url = SERVER + "/svg/" + encoded;
                node.type = "plantuml";
                node.data = {
                    hName: "div",
                    hProperties: {
                        className: ["plantuml-container"],
                        "data-plantuml-url": url,
                    },
                    hChildren: [{ type: "text", value: node.value }],
                };
                node.value = undefined;
            }
        });
    };
}
