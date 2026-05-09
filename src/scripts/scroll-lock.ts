let scrollY = 0;

export function lockScroll() {
    scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.overflow = "hidden";
}

export function unlockScroll() {
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    window.scrollTo(0, scrollY);
}
