import { ArrowRight, Award, Check, ChevronRight, LogIn } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ModelStage } from "@/components/model-stage";
import { ModelCard } from "@/components/models-explorer";
import { Reveal } from "@/components/reveal";
import { CtaSection } from "@/components/sections";
import { ButtonLink, Container, Pill, SectionHeading } from "@/components/ui";
import { portalLoginUrl } from "@/config/site";
import { COLOR_HEX, MODELS, getModel } from "@/data/models";
import { href, LOCALES } from "@/i18n/config";
import { formatEuro, formatNumber } from "@/lib/format";
import { badgeLabel, specValue, toCard } from "@/lib/model-view";
import { getPage, pageMeta } from "@/lib/page";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => MODELS.map((m) => ({ locale, slug: m.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict } = await getPage(params);
  const model = getModel(slug);
  if (!model) return {};
  const copy = dict.models.items[model.slug as keyof typeof dict.models.items];
  return pageMeta(locale, `/models/${model.slug}`, `${model.name} · ${copy.tagline}`, copy.description);
}

export default async function ModelPage({ params }: Params) {
  const { slug } = await params;
  const { locale, dict, intl } = await getPage(params);
  const model = getModel(slug);
  if (!model) notFound();

  const copy = dict.models.items[model.slug as keyof typeof dict.models.items];
  const family = dict.families[model.family];
  const badge = badgeLabel(model, dict);
  const siblings = MODELS.filter((m) => m.family === model.family && m.slug !== model.slug);
  const others = siblings.length ? siblings : MODELS.filter((m) => m.slug !== model.slug).slice(0, 2);
  const [heroShot, ...shots] = model.gallery;
  const details = shots.filter((g) => !g.wide);
  const wides = shots.filter((g) => g.wide);

  const tiles = [
    { label: dict.common.range, value: `${dict.common.upTo} ${model.stats.rangeKm} km` },
    { label: dict.common.torque, value: `${model.stats.torqueNm} Nm` },
    { label: dict.common.weight, value: `${formatNumber(model.stats.weightKg, intl)} kg` },
    { label: dict.common.battery, value: `${model.stats.batteryWh} Wh` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `MapFour ${model.name}`,
    description: copy.description,
    brand: { "@type": "Brand", name: "MapFour" },
    category: family.name,
    image: model.colors.map((c) => c.image),
    sku: model.colors.map((c) => c.sku).join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="pb-16 pt-8 lg:pb-24 lg:pt-12">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 flex animate-fade-in flex-wrap items-center gap-1.5 text-sm text-neutral-500">
            <Link href={href(locale)} className="hover:text-ink">
              {dict.nav.home}
            </Link>
            <ChevronRight className="size-3.5 text-neutral-300" />
            <Link href={href(locale, "/models")} className="hover:text-ink">
              {dict.nav.models}
            </Link>
            <ChevronRight className="size-3.5 text-neutral-300" />
            <span className="font-medium text-ink">{model.name}</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="animate-scale-in">
              <ModelStage
                name={model.name}
                colorsLabel={dict.common.colors}
                colors={model.colors.map((c) => ({
                  key: c.key,
                  label: dict.colors[c.key],
                  hex: COLOR_HEX[c.key],
                  sku: c.sku,
                  views: [{ key: "side", label: dict.models.views.side, src: c.image }, ...(c.angles ?? []).map((a) => ({ key: a.view, label: dict.models.views[a.view], src: a.src }))],
                }))}
              />
            </div>

            <div className="lg:pt-4">
              <div className="flex animate-fade-up flex-wrap items-center gap-2">
                <Pill tone="brand">{family.name}</Pill>
                {badge ? (
                  <Pill tone="dark">
                    {model.badge === "award" ? <Award className="size-3.5" /> : null}
                    {badge}
                  </Pill>
                ) : null}
                {model.stepThrough ? <Pill>{dict.common.stepThrough}</Pill> : null}
              </div>
              <h1 className="mt-5 animate-fade-up text-5xl font-semibold tracking-tight text-ink [animation-delay:60ms] sm:text-6xl">{model.name}</h1>
              <p className="mt-3 animate-fade-up text-xl text-ink-soft [animation-delay:120ms]">{copy.tagline}</p>
              <p className="mt-5 animate-fade-up text-[17px] leading-relaxed text-neutral-600 [animation-delay:180ms]">{copy.description}</p>

              <dl className="mt-8 grid animate-fade-up grid-cols-2 gap-3 [animation-delay:240ms]">
                {tiles.map((t) => (
                  <div key={t.label} className="rounded-2xl border border-line bg-white px-4 py-3.5">
                    <dt className="text-xs text-neutral-500">{t.label}</dt>
                    <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-ink">{t.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 animate-fade-up rounded-[28px] bg-canvas p-6 [animation-delay:300ms]">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm text-neutral-500">{dict.common.rrp}</span>
                  <span className="text-3xl font-semibold tabular-nums tracking-tight text-ink">{formatEuro(model.rrpCents, intl)}</span>
                  <span className="text-sm text-neutral-500">{dict.common.inclVat}</span>
                </div>
                <p className="mt-1.5 text-sm text-brand-700">{dict.common.dealerPrice}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href={portalLoginUrl(locale)} className="group">
                    <LogIn className="size-4" strokeWidth={1.75} />
                    {dict.common.portalLogin}
                  </ButtonLink>
                  <ButtonLink href={href(locale, "/dealers#aanvraag")} variant="secondary">
                    {dict.common.becomeDealer}
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hoogtepunten */}
      <section className="bg-canvas py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={dict.models.highlights} />
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {model.highlights.map((key, i) => {
              const hl = dict.highlights[key];
              return (
                <Reveal as="li" key={key} delay={i % 3} className="h-full">
                  <div className="flex h-full gap-4 rounded-[28px] border border-line bg-white p-6">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      {key === "award" ? <Award className="size-4" /> : <Check className="size-4" strokeWidth={2.5} />}
                    </span>
                    <div>
                      <h3 className="font-semibold tracking-tight text-ink">{hl.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">{hl.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Beelden */}
      <section className="py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={dict.models.gallery} />
          </Reveal>
          {heroShot ? (
            <Reveal className="mt-10">
              <div className="group relative aspect-[16/10] overflow-hidden rounded-[36px] bg-canvas sm:aspect-[21/9]">
                <Image src={heroShot.src} alt={`MapFour ${model.name}`} fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]" />
              </div>
            </Reveal>
          ) : null}
          {details.length ? (
            <div className={`mt-4 grid gap-4 ${details.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {details.map((g, i) => (
                <Reveal key={g.src} delay={i}>
                  <div className={`group relative overflow-hidden rounded-[28px] bg-canvas ${details.length >= 3 ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
                    <Image src={g.src} alt={`MapFour ${model.name}`} fill sizes="(min-width: 640px) 640px, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]" />
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}
          {wides.map((g) => (
            <Reveal key={g.src} className="mt-4">
              <div className="group relative aspect-[16/10] overflow-hidden rounded-[36px] bg-canvas sm:aspect-[21/9]">
                <Image src={g.src} alt={`MapFour ${model.name}`} fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]" />
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Specificaties */}
      <section className="bg-canvas py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={dict.models.specs} text={dict.models.specNote} />
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {model.specs.map((group, gi) => (
              <Reveal key={group.group} delay={gi % 2} className="h-full">
                <div className="h-full overflow-hidden rounded-[28px] border border-line bg-white">
                  <h3 className="border-b border-line px-6 py-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">{dict.specs.groups[group.group]}</h3>
                  <dl className="divide-y divide-line/70">
                    {group.rows.map((row) => (
                      <div key={row.label} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 px-6 py-3 text-[15px]">
                        <dt className="text-neutral-500">{dict.specs.labels[row.label]}</dt>
                        <dd className="font-medium text-ink">{specValue(row.value, dict)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Verwante modellen */}
      <section className="py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={dict.models.siblings} />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {others.map((m, i) => (
              <Reveal key={m.slug} delay={i}>
                <ModelCard model={toCard(m, locale, dict, intl)} priceLabel={`${dict.common.rrp} · ${dict.common.inclVat}`} viewLabel={dict.common.viewModel} />
              </Reveal>
            ))}
            <Reveal delay={others.length} className="h-full">
              <div className="flex h-full min-h-[320px] flex-col justify-between rounded-[28px] bg-ink p-8 text-white">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">{dict.models.order.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/65">{dict.models.order.text}</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={href(locale, "/dealers#aanvraag")} variant="light">
                    {dict.common.becomeDealer} <ArrowRight className="size-4" />
                  </ButtonLink>
                  <ButtonLink href={href(locale, "/models")} variant="outlineLight">
                    {dict.common.allModels}
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
