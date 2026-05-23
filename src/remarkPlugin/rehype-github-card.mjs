/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * GitHub 仓库卡片组件
 * 语法: ::github[owner/repo]
 * 也兼容旧语法: ::github{repo="owner/repo"}
 */
export function GithubCardComponent(properties, children) {
    // New syntax ::github[owner/repo] — label text arrives as children
    // Old syntax ::github{repo="owner/repo"} — repo is in properties
    let repo = properties.repo;
    if (!repo && Array.isArray(children) && children.length > 0) {
        const labelChild = children.find((c) => c.type === "text" && c.value?.trim());
        if (labelChild) repo = labelChild.value.trim();
    }

    if (!repo || !repo.includes("/"))
        return h("div", { class: "hidden" }, [
            'Invalid repository. ("repo" must be in format "owner/repo")',
        ]);
    const cardUuid = `GC${Math.random().toString(36).slice(-6)}`;

    const nAvatar = h(`div#${cardUuid}-avatar`, { class: "gc-avatar" });
    const nLanguage = h(`span#${cardUuid}-language`, { class: "gc-language" }, "Waiting...");

    const nTitle = h("div", { class: "gc-titlebar" }, [
        h("div", { class: "gc-titlebar-left" }, [
            h("div", { class: "gc-owner" }, [
                nAvatar,
                h("div", { class: "gc-user" }, repo.split("/")[0]),
            ]),
            h("div", { class: "gc-divider" }, "/"),
            h("div", { class: "gc-repo" }, repo.split("/")[1]),
        ]),
        h("div", { class: "github-logo" }),
    ]);

    const nDescription = h(
        `div#${cardUuid}-description`,
        { class: "gc-description" },
        "Loading...",
    );
    const nStars = h(`div#${cardUuid}-stars`, { class: "gc-stars" }, "0");
    const nForks = h(`div#${cardUuid}-forks`, { class: "gc-forks" }, "0");
    const nLicense = h(`div#${cardUuid}-license`, { class: "gc-license" }, "N/A");

    const nScript = h(
        `script#${cardUuid}-script`,
        { type: "text/javascript", defer: true },
        `
      fetch('https://api.github.com/repos/${repo}', { referrerPolicy: "no-referrer" }).then(function(r) { return r.json(); }).then(function(data) {
        var descEl = document.getElementById('${cardUuid}-description');
        if (descEl) descEl.innerText = (data.description || "No description").replace(/:[a-zA-Z0-9_]+:/g, '');
        var langEl = document.getElementById('${cardUuid}-language');
        if (langEl) langEl.innerText = data.language || "";
        var forksEl = document.getElementById('${cardUuid}-forks');
        if (forksEl) forksEl.innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.forks).replaceAll("\\u202f", '');
        var starsEl = document.getElementById('${cardUuid}-stars');
        if (starsEl) starsEl.innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.stargazers_count).replaceAll("\\u202f", '');
        var avEl = document.getElementById('${cardUuid}-avatar');
        if (avEl) { avEl.style.backgroundImage = 'url(' + data.owner.avatar_url + '&s=32' + ')'; avEl.style.backgroundColor = 'transparent'; }
        var licEl = document.getElementById('${cardUuid}-license');
        if (licEl) licEl.innerText = (data.license && data.license.spdx_id) || "no-license";
        var card = document.getElementById('${cardUuid}-card');
        if (card) card.classList.remove("fetch-waiting");
      }).catch(function() {
        var card = document.getElementById('${cardUuid}-card');
        if (card) card.classList.add("fetch-error");
      })
    `,
    );

    return h(
        `a#${cardUuid}-card`,
        {
            class: "card-github fetch-waiting",
            href: `https://github.com/${repo}`,
            target: "_blank",
            rel: "noopener noreferrer",
            repo,
        },
        [
            nTitle,
            nDescription,
            h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
            nScript,
        ],
    );
}
