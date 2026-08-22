import DOMPurify from "isomorphic-dompurify";

const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: ["p", "strong", "em", "u", "h2", "h3", "ul", "ol", "li", "blockquote", "br"],
  ALLOWED_ATTR: ["style"],
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Renders stored biography/overview text as safe HTML for the public
 * profile. Content saved via the rich-text editor is already HTML (still
 * re-sanitized here as defense-in-depth); older plain-text rows are
 * converted to paragraphs on the fly so existing biographies keep their
 * spacing instead of collapsing into one run-on line.
 */
export function renderRichText(text: string | null | undefined): string {
  if (!text) return "";
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(text);

  if (looksLikeHtml) {
    return DOMPurify.sanitize(text, SANITIZE_OPTIONS);
  }

  const normalized = text.replace(/\r\n?/g, "\n");

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}
