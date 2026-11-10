import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroPreview } from "@/components/hero-preview";
import { HeroSignup } from "@/components/hero-signup";
import { ModelCard } from "@/components/models-explorer";
import { Reveal } from "@/components/reveal";
import { BenefitsGrid, CtaSection, FaqSection, PortalSection, StatsBand, StepsSection, StoreSection } from "@/components/sections";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { portalLoginUrl, site } from "@/config/site";
import { getModel } from "@/data/models";
import { href } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { toCard } from "@/lib/model-view";
import { getPage, pageMeta, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await getPage(params);
  return pageMeta(locale, "", dict.meta.home.title, dict.meta.home.description, true);
}

export default async function HomePage({ params }: LocaleParams) {
  const { locale, dict, intl } = await getPage(params);
  const h = dict.home;

  const interests = [
    { key: "city", label: dict.families.city.name },
    { key: "trekking", label: dict.families.trekking.name },
    { key: "utility", label: dict.families.utility.name },
    { key: "accessories", label: dict.nav.accessories },
  ];

  const brands = [...site.componentBrands, ...site.componentBrands];
  const tech = h.tech.items;
  const featured = ["ray-air", "roam", "loop-pro"].map((s) => getModel(s)!);
  // Frans, Spaans en Grieks hebben een langere kopregel: iets kleiner zetten
  const longTitle = h.hero.title.length > 50;

  return (
    <>
      {/* ---------- Hero: donker met merkgloed. Links de titel met daaronder de gekantelde portal-preview, rechts het aanmeldformulier ---------- */}
      <section className="relative isolate overflow-hidden bg-[#09090a] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 58% 80% at 44% 52%, rgba(82,181,196,0.5) 0%, rgba(59,158,174,0.24) 38%, rgba(9,9,10,0) 72%)" }}
        />
        <Container className="grid gap-x-16 pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:grid-rows-[auto_1fr] lg:pt-20">
          <h1
            className={cn(
              "relative z-10 animate-fade-up text-balance font-bold tracking-tight lg:col-start-1 lg:row-start-1",
              longTitle ? "text-4xl leading-[1.08] sm:text-5xl" : "text-[40px] leading-[1.05] sm:text-6xl",
            )}
          >
            {h.hero.title}
          </h1>
          <div className="relative z-10 mt-10 animate-fade-up [animation-delay:160ms] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center lg:pb-20">
            <HeroSignup
              locale={locale}
              t={dict.form}
              interests={interests}
              privacyHref={href(locale, "/privacy")}
              privacyLabel={dict.footer.privacy}
              loginUrl={portalLoginUrl(locale)}
              loginLabel={dict.nav.login}
            />
          </div>
          <div className="mt-12 animate-fade-in [animation-delay:260ms] lg:col-start-1 lg:row-start-2 lg:mt-0">
            <HeroPreview locale={locale} alt={dict.common.b2bPortal} />
          </div>
        </Container>
      </section>

      {/* ---------- Componentmerken ---------- */}
      <section className="border-y border-line py-6" aria-label={h.brands}>
        <Container className="flex flex-col items-center gap-5 lg:flex-row lg:gap-10">
          <p className="shrink-0 text-sm text-neutral-500">{h.brands}</p>
          <div className="marquee relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="marquee-track flex w-max animate-marquee items-center gap-14 pr-14">
              {brands.map((b, i) => (
                // Echte merklogo's, zwart gemaakt met een CSS-filter (werkt voor SVG en PNG)
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${b.name}-${i}`}
                  src={b.src}
                  alt={i < site.componentBrands.length ? b.name : ""}
                  aria-hidden={i >= site.componentBrands.length}
                  width={Math.round(b.h * b.ratio)}
                  height={b.h}
                  loading="lazy"
                  decoding="async"
                  className="block max-w-none shrink-0 [filter:brightness(0)]"
                  style={{ height: b.h, width: Math.round(b.h * b.ratio) }}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Techniek (bento) ---------- */}
      <section className="bg-canvas py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading title={h.tech.title} />
          </Reveal>
          <div className="mt-12 grid gap-4 lg:grid-cols-6">
            <Reveal className="lg:col-span-4">
              <div className="group relative h-[340px] overflow-hidden rounded-[32px] bg-[#dfe1e4] lg:h-[380px]">
                <Image src="/images/details/ray-air-d1.webp" alt="MapFour Ray Air" fill sizes="(min-width: 1024px) 820px, 100vw" className="object-cover object-right transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#e9eaec] via-[#e9eaec]/85 to-[#e9eaec]/30 sm:via-[#e9eaec]/70 sm:to-transparent" />
                <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-end p-7 sm:p-9">
                  <h3 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{tech[0].title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{tech[0].text}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={1} className="lg:col-span-2">
              <div className="relative isolate flex h-[260px] flex-col justify-between overflow-hidden rounded-[32px] bg-ink p-7 text-white sm:p-9 lg:h-[380px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-32 -right-24 -z-10 size-[360px] rounded-full opacity-70 blur-3xl"
                  style={{ background: "radial-gradient(closest-side, #52b5c4 0%, rgba(82,181,196,0.2) 60%, transparent 100%)" }}
                />
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-200">Mivice X700</span>
                <div>
                  <div className="text-6xl font-semibold tracking-tight sm:text-7xl">{tech[1].title}</div>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/65">{tech[1].text}</p>
                </div>
              </div>
            </Reveal>
            <Reveal className="lg:col-span-2">
              <div className="flex h-[240px] flex-col justify-between rounded-[32px] border border-line bg-white p-7 sm:p-9 lg:h-[280px]">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-700">720 Wh</span>
                <div>
                  <div className="text-6xl font-semibold tracking-tight text-ink">{tech[2].title}</div>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{tech[2].text}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={1} className="lg:col-span-2">
              <div className="flex h-[240px] flex-col justify-between rounded-[32px] bg-brand-400 p-7 text-white sm:p-9 lg:h-[280px]">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/80">8 A</span>
                <div>
                  <div className="text-6xl font-semibold tracking-tight">{tech[3].title}</div>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/85">{tech[3].text}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={2} className="lg:col-span-2 lg:row-span-2">
              <div className="group relative h-[420px] overflow-hidden rounded-[32px] bg-ink lg:h-full lg:min-h-[576px]">
                <Image src="/images/app-hand.webp" alt="MapFour App" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                  <h3 className="text-2xl font-semibold tracking-tight">{tech[4].title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/75">{tech[4].text}</p>
                </div>
              </div>
            </Reveal>
            <Reveal className="lg:col-span-4">
              <div className="group relative h-[280px] overflow-hidden rounded-[32px] bg-[#dfeef4]">
                <Image src="/images/details/roam-belt.webp" alt="Michelin Carbon Belt Drive" fill sizes="(min-width: 1024px) 820px, 100vw" className="object-cover object-right transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#eef6f9] via-[#eef6f9]/90 to-[#eef6f9]/40 sm:via-[#eef6f9]/75 sm:to-transparent" />
                <div className="absolute inset-y-0 left-0 flex max-w-sm flex-col justify-end p-7 sm:p-9">
                  <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{tech[5].title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{tech[5].text}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- Dealerprogramma ---------- */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <SectionHeading title={h.program.title} text={h.program.text} />
            </Reveal>
            <Reveal delay={1}>
              <ButtonLink href={href(locale, "/dealers")} variant="secondary">
                {dict.common.learnMore} <ArrowRight className="size-4" />
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-12">
            <BenefitsGrid items={h.program.benefits} />
          </div>
        </Container>
      </section>

      <PortalSection locale={locale} dict={dict} intl={intl} />

      <StepsSection dict={dict} />

      <StatsBand dict={dict} />

      {/* ---------- Uitgelichte modellen ---------- */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionHeading title={dict.models.title} text={dict.models.text} />
            </Reveal>
            <Reveal delay={1}>
              <ButtonLink href={href(locale, "/models")} variant="secondary">
                {dict.common.allModels} <ArrowRight className="size-4" />
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((m, i) => (
              <Reveal key={m.slug} delay={i}>
                <ModelCard model={toCard(m, locale, dict, intl)} priceLabel={`${dict.common.rrp} · ${dict.common.inclVat}`} viewLabel={dict.common.viewModel} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <StoreSection dict={dict} />

      <FaqSection dict={dict} />

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
