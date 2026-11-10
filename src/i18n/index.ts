import type { Locale } from "./config";
import { de } from "./de";
import { el } from "./el";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { nl, type Dict } from "./nl";
import { zh } from "./zh";

const DICTS: Record<Locale, Dict> = { nl, en, de, fr, es, zh, el };

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
}

export type { Dict };
