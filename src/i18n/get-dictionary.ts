import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";
import en from "./dictionaries/en";
import so from "./dictionaries/so";
import ar from "./dictionaries/ar";

const DICTIONARIES: Record<Locale, Dictionary> = { en, so, ar };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
