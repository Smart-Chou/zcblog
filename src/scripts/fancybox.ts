import "@fancyapps/ui/dist/fancybox/fancybox.css";

export async function setupFancybox() {
    const { Fancybox } = await import("@fancyapps/ui");
    Fancybox.bind(".custom-md img, .post-cover", {
        groupAll: true,
        Carousel: { transition: "slide", preload: 2 },
    });
}

export function cleanupFancybox() {
    // @fancyapps/ui.Fancybox.destroy();
}