export const LOCALES = ["nl", "en", "de", "fr", "es", "zh", "el"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_INFO: Record<Locale, { native: string; intl: string; hreflang: string; short: string }> = {
  nl: { native: "Nederlands", intl: "nl-NL", hreflang: "nl", short: "NL" },
  en: { native: "English", intl: "en-GB", hreflang: "en", short: "EN" },
  de: { native: "Deutsch", intl: "de-DE", hreflang: "de", short: "DE" },
  fr: { native: "Français", intl: "fr-FR", hreflang: "fr", short: "FR" },
  es: { native: "Español", intl: "es-ES", hreflang: "es", short: "ES" },
  zh: { native: "中文", intl: "zh-CN", hreflang: "zh", short: "中文" },
  el: { native: "Ελληνικά", intl: "el-GR", hreflang: "el", short: "EL" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Kiest de beste taal uit een Accept-Language-header. */
export function negotiateLocale(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const wanted = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((x) => x.tag && Number.isFinite(x.q))
    .sort((a, b) => b.q - a.q);
  for (const { tag } of wanted) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

/** Pad binnen een taal: href("nl", "/models") -> "/nl/models" */
export function href(locale: Locale, path = "") {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

/** Vervangt {naam}-plaatshouders. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}
