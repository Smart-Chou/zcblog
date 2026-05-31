/**
 * rehype-encrypted — 将标记的加密容器转为 EncryptedContent HTML
 *
 * 需要配合 remark-encrypted 使用。
 * remark-encrypted 将 :::encrypted{password="xxx" hint="yyy"} 转为
 * <div class="encrypted-container-wrapper" data-password="..." data-hint="...">，
 * 本插件在 rehype 阶段将其子节点渲染为 HTML 后加密。
 */
import { createHash } from "node:crypto";
import { toHtml } from "hast-util-to-html";
import { encryptContent } from "../utils/encrypt.js";
import { visit } from "unist-util-visit";

function childrenToHtml(nodes: any) {
    return toHtml({ type: "root", children: nodes || [] });
}

export function rehypeEncrypted() {
    return (tree: any) => {
        visit(tree, "element", (node, index, parent) => {
            if (!parent || index === undefined) return;

            const cls = node.properties?.className;
            const classList = Array.isArray(cls)
                ? cls
                : typeof cls === "string"
                  ? cls.split(/\s+/)
                  : [];
            if (!classList.includes("encrypted-container-wrapper")) return;

            const password = String(node.properties["data-password"] || "");
            const hint = String(node.properties["data-hint"] || "");

            if (!password) return;

            const innerHtml = childrenToHtml(node.children || []);

            // Use SHA-256 hash for deterministic salt/IV derivation
            const hash = createHash("sha256").update(password).digest("hex");
            const context = "ctx-" + hash.slice(0, 8);

            const encryptedData = encryptContent(innerHtml, password, context);

            const uid = "ec-" + Math.random().toString(36).slice(2, 8);

            parent.children[index] = {
                type: "element",
                tagName: "div",
                properties: {
                    id: `encrypted-container-${uid}`,
                    "data-encrypted": encryptedData,
                    "data-slug": context,
                    "data-version": "2",
                    className: [],
                },
                children: [
                    buildPasswordUI(hint, uid),
                    {
                        type: "element",
                        tagName: "div",
                        properties: {
                            id: `decrypted-content-${uid}`,
                            className: ["hidden"],
                        },
                        children: [],
                    },
                    buildDecryptScript(uid),
                ],
            };
        });
    };
}

function buildPasswordUI(hint: any, uid: any) {
    const children = [
        el("h2", ["text-lg", "font-bold"], [txt("内容已加密")]),
        el(
            "p",
            ["text-sm", "text-gray-500", "dark:text-gray-400", "text-center"],
            [txt("请输入密码查看隐藏内容")],
        ),
    ];

    if (hint) {
        children.push(el("p", ["text-xs", "text-gray-400", "text-center"], [txt(`提示：${hint}`)]));
    }

    children.push({
        type: "element",
        tagName: "form",
        properties: {
            id: `password-form-${uid}`,
            className: ["w-full", "mt-2", "space-y-2"],
        },
        children: [
            {
                type: "element",
                tagName: "input",
                properties: {
                    id: `password-input-${uid}`,
                    type: "password",
                    placeholder: "输入密码",
                    autocomplete: "off",
                    className: [
                        "w-full",
                        "px-3",
                        "py-2",
                        "rounded-lg",
                        "text-sm",
                        "border",
                        "border-gray-200",
                        "dark:border-gray-600",
                        "bg-gray-50",
                        "dark:bg-gray-700",
                        "outline-none",
                    ],
                },
                children: [],
            },
            {
                type: "element",
                tagName: "button",
                properties: {
                    type: "submit",
                    className: [
                        "w-full",
                        "py-2",
                        "rounded-lg",
                        "text-sm",
                        "font-medium",
                        "bg-blue-500",
                        "text-white",
                        "hover:bg-blue-600",
                    ],
                },
                children: [txt("解密")],
            },
        ],
    });

    children.push(
        el(
            "p",
            ["text-xs", "text-red-500", "hidden"],
            [txt("密码错误，请重试")],
            `password-error-${uid}`,
        ),
    );

    return {
        type: "element",
        tagName: "div",
        properties: {
            id: `password-ui-${uid}`,
            className: ["flex", "justify-center", "py-16", "px-4"],
        },
        children: [
            {
                type: "element",
                tagName: "div",
                properties: {
                    className: [
                        "flex",
                        "flex-col",
                        "items-center",
                        "gap-3",
                        "max-w-md",
                        "w-full",
                        "p-8",
                        "rounded-xl",
                        "border",
                        "border-gray-200",
                        "dark:border-gray-700",
                        "bg-white",
                        "dark:bg-gray-800",
                    ],
                },
                children,
            },
        ],
    };
}

function buildDecryptScript(uid: any) {
    const script = `
(function(){var c=document.getElementById("encrypted-container-${uid}");if(!c)return;
var d=c.getAttribute("data-encrypted"),s=c.getAttribute("data-slug");
var u=document.getElementById("password-ui-${uid}");
var f=document.getElementById("password-form-${uid}");
var i=document.getElementById("password-input-${uid}");
var e=document.getElementById("password-error-${uid}");
var t=document.getElementById("decrypted-content-${uid}");
var ck="pw:"+s;
function b64toBuf(b){var a=atob(b),u=new Uint8Array(a.length);for(var i=0;i<a.length;i++)u[i]=a.charCodeAt(i);return u}
async function dec(pwd){var r=b64toBuf(d),s=r.slice(0,16),iv=r.slice(16,28),tag=r.slice(28,44),ct=r.slice(44);
var c=new Uint8Array(ct.length+16);c.set(ct);c.set(tag,ct.length);
var enc=new TextEncoder();
var km=await crypto.subtle.importKey("raw",enc.encode(pwd),"PBKDF2",false,["deriveBits","deriveKey"]);
var key=await crypto.subtle.deriveKey({name:"PBKDF2",salt:s,iterations:100000,hash:"SHA-256"},km,{name:"AES-GCM",length:256},false,["decrypt"]);
return new TextDecoder().decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:iv},key,c))}
function show(h){t.innerHTML=h;t.classList.remove("hidden");u.classList.add("hidden");
var st=t.querySelectorAll("script");for(var j=0;j<st.length;j++){var sc=st[j],ns=document.createElement("script");
for(var k=0;k<sc.attributes.length;k++)ns.setAttribute(sc.attributes[k].name,sc.attributes[k].value);
ns.textContent=sc.textContent;sc.parentNode.replaceChild(ns,sc)}}
f.addEventListener("submit",function(ev){ev.preventDefault();var p=i.value.trim();if(!p)return;e.classList.add("hidden");
dec(p).then(function(h){sessionStorage.setItem(ck,p);show(h)}).catch(function(){e.classList.remove("hidden")})});
var cached=sessionStorage.getItem(ck);if(cached)dec(cached).then(show).catch(function(){sessionStorage.removeItem(ck)});
})();`;
    return { type: "raw", value: `<script>${script}</script>` };
}

function el(tag: any, cls: any, children: any, id?: any) {
    const props: Record<string, any> = { className: cls };
    if (id) props.id = id;
    return { type: "element", tagName: tag, properties: props, children };
}

function txt(value: any) {
    return { type: "text", value };
}
