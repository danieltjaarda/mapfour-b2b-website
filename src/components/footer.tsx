import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FacebookIcon as Facebook, InstagramIcon as Instagram, LinkedinIcon as Linkedin, YoutubeIcon as Youtube } from "./social-icons";
import { portalLoginUrl, site } from "@/config/site";
import { MODELS } from "@/data/models";
import { href, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";
import { FooterLanguages } from "./language-switcher";
import { MapfourLogo } from "./logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dict }) {
  const year = new Date().getFullYear();
  const col = "space-y-2.5 text-sm";
  const link = "text-white/60 transition-colors hover:text-white";
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="dots pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 left-1/2 size-[720px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #52b5c4 0%, rgba(82,181,196,0.2) 55%, transparent 100%)" }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <MapfourLogo className="h-6 w-auto text-white" title="MapFour" />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">{dict.footer.tagline}</p>
            <div className="mt-6 flex items-center gap-2" aria-label={dict.footer.follow}>
              {(
                [
                  [site.social.instagram, Instagram, "Instagram"],
                  [site.social.youtube, Youtube, "YouTube"],
                  [site.social.facebook, Facebook, "Facebook"],
                  [site.social.linkedin, Linkedin, "LinkedIn"],
                ] as const
              ).map(([url, Icon, name]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="btn grid size-10 place-items-center rounded-xl bg-white/[0.06] text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">{dict.footer.products}</h3>
              <ul className={col}>
                {MODELS.map((m) => (
                  <li key={m.slug}>
                    <Link href={href(locale, `/models/${m.slug}`)} className={link}>
                      {m.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={href(locale, "/accessories")} className={link}>
                    {dict.nav.accessories}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">{dict.footer.dealers}</h3>
              <ul className={col}>
                <li>
                  <Link href={href(locale, "/dealers")} className={link}>
                    {dict.nav.dealers}
                  </Link>
                </li>
                <li>
                  <a href={portalLoginUrl(locale)} className={`${link} inline-flex items-center gap-1`}>
                    {dict.footer.portal} <ArrowUpRight className="size-3.5" />
                  </a>
                </li>
                <li>
                  <Link href={href(locale, "/models")} className={link}>
                    {dict.common.allModels}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">{dict.footer.company}</h3>
              <ul className={col}>
                <li>
                  <Link href={href(locale, "/about")} className={link}>
                    {dict.nav.about}
                  </Link>
                </li>
                <li>
                  <Link href={href(locale, "/contact")} className={link}>
                    {dict.nav.contact}
                  </Link>
                </li>
                <li>
                  <Link href={href(locale, "/privacy")} className={link}>
                    {dict.footer.privacy}
                  </Link>
                </li>
                <li>
                  <a href={site.shopUrl} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-1`}>
                    {dict.footer.consumer} <ArrowUpRight className="size-3.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <FooterLanguages locale={locale} label={dict.nav.language} />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} MapFour. {dict.footer.rights}
          </p>
          <p>
            <a href={`mailto:${site.email}`} className="hover:text-white/70">
              {site.email}
            </a>
            <span className="mx-2">·</span>
            <a href={`tel:${site.phoneHref}`} className="hover:text-white/70">
              {site.phone}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
