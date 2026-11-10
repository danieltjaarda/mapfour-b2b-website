import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/i18n";
import { isLocale, LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Leest en controleert de taal uit de URL en geeft de vertalingen terug. */
export async function getPage(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, dict: getDict(locale), intl: LOCALE_INFO[locale].intl };
}

/** Metadata met canonical, hreflang-alternatieven en Open Graph. `path` zonder taal, bv. "/models". */
export function pageMeta(locale: Locale, path: string, title: string, description: string, absoluteTitle = false): Metadata {
  const languages: Record<string, string> = Object.fromEntries(LOCALES.map((l) => [LOCALE_INFO[l].hreflang, `/${l}${path}`]));
  languages["x-default"] = `/en${path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: `/${locale}${path}`, languages },
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      siteName: "MapFour B2B",
      locale: LOCALE_INFO[locale].intl.replace("-", "_"),
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "MapFour B2B" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}
