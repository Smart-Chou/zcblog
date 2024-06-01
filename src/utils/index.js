export const calculateWordCount = text => {
    const regex = /[\u4e00-\u9fa5]|[a-zA-Z]+|\d+/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
};

export const calculateReadTime = wordCount => Math.max(1, Math.ceil(wordCount / 200));
