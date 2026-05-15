export interface AdImage {
    src: string;
    alt?: string;
    link?: string;
    external?: boolean;
}

export interface AdLink {
    text: string;
    url: string;
    external?: boolean;
}

export interface AdPadding {
    all?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

export interface AdConfig {
    title?: string;
    content?: string;
    image?: AdImage;
    link?: AdLink;
    closable?: boolean;
    displayCount?: number;
    expireDate?: string;
    padding?: AdPadding;
}
