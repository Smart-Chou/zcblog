import pangu from "pangu";
import { visit } from "unist-util-visit";

export function remarkPangu() {
    return function transformer(tree) {
        visit(tree, "text", (node) => {
            node.value = pangu.spacingText(node.value);

            // deruntify: prevent orphan/widow words at line endings
            if (node.value.split(" ").length >= 4) {
                node.value = node.value.replace(/ ([^ ]*)$/, " $1");
            }
        });
    };
}
