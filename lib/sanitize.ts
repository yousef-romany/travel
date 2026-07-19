import DOMPurify from "dompurify";

export function sanitizeHTML(dirty: string): string {
  if (typeof window === "undefined") {
    return dirty.replace(/<[^>]*>/g, "");
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a", "span",
      "h1", "h2", "h3", "h4", "h5", "h6", "img", "div", "table", "thead",
      "tbody", "tr", "th", "td", "blockquote", "pre", "code", "hr", "figure",
      "figcaption",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "src", "alt", "width", "height", "loading"],
  });
}
