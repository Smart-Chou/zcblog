import { visit } from "unist-util-visit";

const variants = new Set([
  "note",
  "info",
  "important",
  "tip",
  "warning",
  "danger",
]);

function defaultLabel(v) {
  switch (v) {
    case "info":
      return "信息";
    case "note":
      return "注意";
    case "important":
      return "重要";
    case "tip":
      return "提示";
    case "warning":
      return "警告";
    case "danger":
      return "危险";
    default:
      return "";
  }
}

export function remarkAsides(options) {
  options = {
    label: defaultLabel,
    ...options,
  };
  const isAsideVariant = (s) => variants.has(s);

  const asideIcons = {
    info: "ℹ️",
    note: "📝",
    important: "⚠️",
    tip: "💡",
    warning: "⚠️",
    danger: "🚨",
  };

  return function transformer(tree) {
    visit(tree, (node, index, parent) => {
      // Check if this is a container directive
      if (node.type === "containerDirective" && isAsideVariant(node.name)) {
        // Get title from directive label or use default
        let title = node.attributes && node.attributes.label 
          ? node.attributes.label 
          : options.label?.(node.name);
        
        // Create an opening HTML node
        const openingNode = {
          type: "html",
          value: `<aside class="remark-aside remark-aside--${node.name}">
            <h4 class="remark-aside__title">${asideIcons[node.name]} ${title}</h4>
            <div class="remark-aside__content">`
        };
        
        // Create a closing HTML node
        const closingNode = {
          type: "html",
          value: `</div>
          </aside>`
        };
        
        // Replace the directive with our new nodes and keep the original content
        if (node.children && node.children.length > 0) {
          // Insert opening tag, then original content, then closing tag
          parent.children.splice(index, 1, openingNode, ...node.children, closingNode);
        } else {
          // If no content, just insert the aside with empty content
          parent.children[index] = {
            type: "html",
            value: `<aside class="remark-aside remark-aside--${node.name}">
              <h4 class="remark-aside__title">${asideIcons[node.name]} ${title}</h4>
              <div class="remark-aside__content">
              </div>
            </aside>`
          };
        }
      }
    });
  };
}