"use client";

import { Check, Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";

/** Zelfde pagina in een andere taal: /nl/models/roam -> /de/models/roam */
export function switchLocalePath(pathname: string, from: Locale, to: Locale) {
  const rest = pathname.startsWith(`/${from}`) ? pathname.slice(from.length + 1) : "";
  return `/${to}${rest}`;
}

/** Zwevende taalkiezer aan de rechterrand van het scherm (de kop bevat bewust alleen de inlogknop). */
export function FloatingLanguage({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div ref={ref} className="no-print fixed bottom-5 right-0 z-30 xl:bottom-auto xl:top-1/2 xl:-translate-y-1/2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        title={label}
        className="btn grid h-12 w-11 place-items-center rounded-l-2xl bg-white text-brand-500 shadow-[0_10px_30px_-10px_rgba(17,17,19,0.45)] ring-1 ring-black/5 hover:w-12 hover:text-brand-600"
      >
        <Languages className="size-5" strokeWidth={2} />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute bottom-0 right-14 w-48 origin-right animate-scale-in rounded-2xl border border-line bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(17,17,19,0.45)] xl:bottom-auto xl:top-1/2 xl:-translate-y-1/2"
        >
          {LOCALES.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <Link
                href={switchLocalePath(pathname, locale, l)}
                hrefLang={LOCALE_INFO[l].hreflang}
                lang={l}
                className={cn("flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors", l === locale ? "bg-neutral-100 font-medium text-ink" : "text-ink-soft hover:bg-neutral-50 hover:text-ink")}
              >
                {LOCALE_INFO[l].native}
                {l === locale ? <Check className="size-4 text-brand-600" /> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Taallinks in de voettekst. */
export function FooterLanguages({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, locale, l)}
          hrefLang={LOCALE_INFO[l].hreflang}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          className={cn("transition-colors", l === locale ? "font-medium text-white" : "text-white/50 hover:text-white")}
        >
          {LOCALE_INFO[l].native}
        </Link>
      ))}
    </nav>
  );
}
