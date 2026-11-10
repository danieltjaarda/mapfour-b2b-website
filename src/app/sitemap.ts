import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { MODELS } from "@/data/models";
import { LOCALE_INFO, LOCALES } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/models", ...MODELS.map((m) => `/models/${m.slug}`), "/accessories", "/dealers", "/about", "/contact", "/privacy"];
  const now = new Date();
  return paths.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: `${site.url}/${locale}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p === "/dealers" || p === "/models" ? 0.9 : 0.7,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [LOCALE_INFO[l].hreflang, `${site.url}/${l}${p}`])) },
    })),
  );
}
