import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export function renderMarkdown(body: string) {
  return sanitizeHtml(marked.parse(body, { async: false }) as string, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "img"]), allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, a: ["href", "title", "target", "rel"], img: ["src", "alt"] }, allowedSchemes: ["https", "http"] });
}
