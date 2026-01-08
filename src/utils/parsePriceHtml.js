// utils/parsePriceHtml.js
export const parsePriceHtml = (html = '') => {
  if (!html) return { text: '', image: null };

  // Extract number text
  const text = html
    .replace(/<img[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

  // Extract image src
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/);

  return {
    text,
    image: imgMatch ? imgMatch[1] : null,
  };
};
