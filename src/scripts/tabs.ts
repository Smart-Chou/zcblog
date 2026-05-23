function initTabs() {
    const containers = document.querySelectorAll<HTMLElement>(".tabs-container");
    if (containers.length === 0) return;

    for (const container of containers) {
        // Skip if already initialized
        if (container.dataset.tabsReady) continue;
        container.dataset.tabsReady = "1";

        const tabId = container.dataset.tabsId;
        if (!tabId) continue;

        const nav = container.querySelector<HTMLElement>(":scope > .tabs-nav");
        const panels = container.querySelectorAll<HTMLElement>(
            ":scope > .tabs-panels > .tabs-panel",
        );
        const buttons = nav?.querySelectorAll<HTMLButtonElement>(`[data-tabs-target="${tabId}"]`);

        if (!buttons || buttons.length === 0) continue;

        for (const btn of buttons) {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.dataset.tabsIndex || "0", 10);

                // Update buttons
                for (const b of buttons) {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                }
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");

                // Update panels
                for (const panel of panels) {
                    panel.classList.remove("active");
                    panel.setAttribute("hidden", "true");
                }
                if (panels[idx]) {
                    panels[idx].classList.add("active");
                    panels[idx].removeAttribute("hidden");
                }
            });

            // Keyboard navigation
            btn.addEventListener("keydown", (e) => {
                const currentIdx = Array.from(buttons).indexOf(btn);
                let nextIdx: number | null = null;

                switch (e.key) {
                    case "ArrowLeft":
                        nextIdx = currentIdx > 0 ? currentIdx - 1 : buttons.length - 1;
                        break;
                    case "ArrowRight":
                        nextIdx = currentIdx < buttons.length - 1 ? currentIdx + 1 : 0;
                        break;
                    case "Home":
                        nextIdx = 0;
                        break;
                    case "End":
                        nextIdx = buttons.length - 1;
                        break;
                }

                if (nextIdx !== null) {
                    e.preventDefault();
                    buttons[nextIdx].focus();
                    buttons[nextIdx].click();
                }
            });
        }
    }
}

document.addEventListener("astro:page-load", initTabs);
