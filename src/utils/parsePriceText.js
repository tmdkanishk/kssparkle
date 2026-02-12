const parsePriceText = (text = '') => {
    // match: "17 <img ... />"
    const priceWithImgRegex = /(\d+\s*<img[^>]*>)/;

    const match = text.match(priceWithImgRegex);

    if (!match) {
        return { before: text, priceHtml: null, after: '' };
    }

    const priceHtml = match[1];

    const [before, after] = text.split(priceHtml);

    return {
        before: before.replace(/\s+$/, ''),
        priceHtml: priceHtml.trim(),
        after: after.replace(/^\s+/, ''),
    };
};

export default parsePriceText;
