import type { ModelCardData } from "@/components/models-explorer";
import { COLOR_HEX, type Model } from "@/data/models";
import type { Dict } from "@/i18n";
import { href, type Locale } from "@/i18n/config";
import { formatEuro, formatNumber } from "./format";

/** Vervangt {tokens} in een specificatiewaarde door de vertaling. */
export function specValue(value: string, dict: Dict) {
  const values = dict.specs.values as Record<string, string>;
  return value.replace(/\{(\w+)\}/g, (m, k) => values[k] ?? m);
}

export function badgeLabel(m: Model, dict: Dict) {
  return m.badge === "award" ? dict.common.award : m.badge === "bestseller" ? dict.common.bestseller : null;
}

export function keyStats(m: Model, dict: Dict, intl: string) {
  return [
    { label: dict.common.range, value: `${m.stats.rangeKm} km` },
    { label: dict.common.torque, value: `${m.stats.torqueNm} Nm` },
    { label: dict.common.weight, value: `${formatNumber(m.stats.weightKg, intl)} kg` },
  ];
}

export function toCard(m: Model, locale: Locale, dict: Dict, intl: string): ModelCardData {
  return {
    slug: m.slug,
    href: href(locale, `/models/${m.slug}`),
    name: m.name,
    family: m.family,
    familyLabel: dict.families[m.family].name,
    tagline: dict.models.items[m.slug as keyof typeof dict.models.items].tagline,
    price: formatEuro(m.rrpCents, intl),
    badge: badgeLabel(m, dict),
    stepThrough: m.stepThrough ? dict.common.stepThrough : null,
    colors: m.colors.map((c) => ({ key: c.key, label: dict.colors[c.key], hex: COLOR_HEX[c.key], image: c.image })),
    stats: keyStats(m, dict, intl),
  };
}
