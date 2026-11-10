import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { MapfourLogo } from "./logo";

/* Bewust kaal: alleen het logo en de inlogknop. Navigatie loopt via de pagina zelf en de voettekst;
   de taalkiezer zweeft aan de rechterrand (FloatingLanguage). */
export function Header({
  locale,
  loginUrl,
  shopUrl,
  labels,
}: {
  locale: Locale;
  loginUrl: string;
  shopUrl: string;
  labels: { login: string; home: string; consumer: string };
}) {
  return (
    <>
      <a
        href={shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="no-print block bg-brand-400 px-4 py-2.5 text-center text-[13px] font-medium text-ink transition-colors hover:bg-brand-300 sm:text-sm"
      >
        {labels.consumer} <span aria-hidden>›</span>
      </a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-4 px-5 sm:h-[84px] sm:px-8">
          <Link href={`/${locale}`} aria-label={labels.home} className="flex shrink-0 items-center gap-3">
            <MapfourLogo className="h-5 w-auto text-white sm:h-[26px]" title="MapFour" />
            <span aria-hidden className="h-5 w-px bg-white/25" />
            <span className="text-sm font-semibold tracking-[0.14em] text-brand-300 sm:text-base">B2B</span>
          </Link>
          <a
            href={loginUrl}
            className="btn group inline-flex h-11 items-center gap-2 rounded-2xl bg-brand-400 px-5 text-[15px] font-semibold text-ink hover:bg-brand-300 sm:h-[52px] sm:px-7 sm:text-base"
          >
            {labels.login}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:size-[18px]" />
          </a>
        </div>
      </header>
    </>
  );
}
