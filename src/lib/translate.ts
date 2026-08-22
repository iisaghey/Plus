const TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate2";
const CHUNK_SIZE = 100;

type TranslatableLocale = "so" | "ar";

async function callGoogleTranslate(
  texts: string[],
  target: TranslatableLocale,
  format: "text" | "html"
): Promise<string[]> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey || texts.length === 0) return texts;

  const out: string[] = [];
  for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
    const chunk = texts.slice(i, i + CHUNK_SIZE);
    try {
      const res = await fetch(`${TRANSLATE_ENDPOINT}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: chunk, target, source: "en", format }),
        next: { revalidate: 3600 },
      });
      if (!res.ok) {
        console.error(`Google Translate API error (${res.status}): ${await res.text()}`);
        out.push(...chunk);
        continue;
      }
      const json = (await res.json()) as {
        data?: { translations?: { translatedText: string }[] };
      };
      const translations = json.data?.translations;
      if (!translations || translations.length !== chunk.length) {
        out.push(...chunk);
        continue;
      }
      out.push(...translations.map((t) => t.translatedText));
    } catch (err) {
      console.error("Google Translate API request failed:", err);
      out.push(...chunk);
    }
  }
  return out;
}

type Ref = { obj: Record<string, unknown>; key: string };

/**
 * Collects string fields across arbitrary objects and translates them in
 * place via two batched Google Translate calls (plain text + HTML), once
 * `run()` is awaited. No-ops entirely for English or when
 * GOOGLE_TRANSLATE_API_KEY isn't configured, so profile pages keep working
 * (in English) if translation is unavailable rather than breaking.
 */
export class ProfileTranslator {
  private target: TranslatableLocale | null;
  private textRefs: Ref[] = [];
  private htmlRefs: Ref[] = [];

  constructor(locale: string) {
    this.target = locale === "so" || locale === "ar" ? locale : null;
  }

  get active() {
    return this.target !== null;
  }

  /** Queue plain-text string fields on an object for translation. */
  text<T extends Record<string, unknown>>(
    obj: T | null | undefined,
    ...keys: (keyof T & string)[]
  ) {
    if (!this.active || !obj) return;
    for (const key of keys) {
      if (typeof obj[key] === "string" && obj[key]) {
        this.textRefs.push({ obj: obj as Record<string, unknown>, key });
      }
    }
  }

  /**
   * Queue a rich-text field that may be Tiptap-generated HTML or legacy
   * plain text (same detection `renderRichText` uses), routing it to the
   * matching translation format automatically.
   */
  richText<T extends Record<string, unknown>>(obj: T | null | undefined, key: keyof T & string) {
    if (!this.active || !obj) return;
    const value = obj[key];
    if (typeof value !== "string" || !value) return;
    const looksLikeHtml = /<[a-z][\s\S]*>/i.test(value);
    const ref: Ref = { obj: obj as Record<string, unknown>, key };
    if (looksLikeHtml) {
      this.htmlRefs.push(ref);
    } else {
      this.textRefs.push(ref);
    }
  }

  /** Run all queued translations and write results back onto the original objects. */
  async run() {
    if (!this.active) return;
    const target = this.target!;
    const [textResults, htmlResults] = await Promise.all([
      callGoogleTranslate(
        this.textRefs.map((r) => r.obj[r.key] as string),
        target,
        "text"
      ),
      callGoogleTranslate(
        this.htmlRefs.map((r) => r.obj[r.key] as string),
        target,
        "html"
      ),
    ]);
    this.textRefs.forEach((r, i) => {
      r.obj[r.key] = textResults[i];
    });
    this.htmlRefs.forEach((r, i) => {
      r.obj[r.key] = htmlResults[i];
    });
  }
}
