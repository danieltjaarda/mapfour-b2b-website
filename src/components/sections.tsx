import { ArrowRight, BadgePercent, Bike, FileText, Languages, Layers, LogIn, MapPin, Megaphone, Phone, Plus, Tags, Wrench } from "lucide-react";
import Image from "next/image";
import { portalLoginUrl, site } from "@/config/site";
import type { Dict } from "@/i18n";
import { href, type Locale } from "@/i18n/config";
import { Counter } from "./counter";
import { PortalMock } from "./portal-mock";
import { Reveal } from "./reveal";
import { ButtonLink, Container, SectionHeading } from "./ui";

/* ---------- Voordelen dealerprogramma ---------- */

const BENEFIT_ICONS = [BadgePercent, Megaphone, Wrench, Bike];

export function BenefitsGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((b, i) => {
        const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
        return (
          <Reveal key={b.title} delay={i} className="h-full">
            <div className="group h-full rounded-[28px] border border-line bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_24px_50px_-28px_rgba(17,17,19,0.35)]">
              <div className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-500 group-hover:bg-brand-400 group-hover:text-white">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{b.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{b.text}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ---------- B2B Portal ---------- */

const PORTAL_ICONS = [Tags, Layers, FileText, Languages];

export function PortalSection({ locale, dict, intl }: { locale: Locale; dict: Dict; intl: string }) {
  const p = dict.home.portal;
  return (
    <section className="px-3 sm:px-5">
      <div className="relative isolate overflow-hidden rounded-[40px] bg-ink text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[620px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #52b5c4 0%, rgba(82,181,196,0.2) 55%, transparent 100%)" }}
        />
        <div aria-hidden className="dots pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" />
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <Reveal>
              <SectionHeading title={p.title} text={p.text} tone="light" />
            </Reveal>
            <ul className="mt-9 grid gap-x-6 gap-y-7 sm:grid-cols-2">
              {p.features.map((f, i) => {
                const Icon = PORTAL_ICONS[i % PORTAL_ICONS.length];
                return (
                  <Reveal as="li" key={f.title} delay={i + 1}>
                    <div className="grid size-10 place-items-center rounded-xl bg-white/[0.07] text-brand-300 ring-1 ring-white/10">
                      <Icon className="size-[18px]" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-3 font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{f.text}</p>
                  </Reveal>
                );
              })}
            </ul>
            <Reveal delay={5} className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={portalLoginUrl(locale)} variant="light" size="lg" className="max-sm:w-full max-sm:px-5">
                <LogIn className="size-4" strokeWidth={1.75} />
                {dict.common.portalLogin}
              </ButtonLink>
              <ButtonLink href={href(locale, "/dealers#aanvraag")} variant="outlineLight" size="lg" className="max-sm:w-full max-sm:px-5">
                {dict.common.becomeDealer}
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal delay={2} className="lg:translate-x-6">
            <PortalMock dict={dict} intl={intl} />
          </Reveal>
        </Container>
      </div>
    </section>
  );
}

/* ---------- Stappen ---------- */

export function StepsSection({ dict }: { dict: Dict }) {
  const s = dict.home.steps;
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading title={s.title} />
        </Reveal>
        <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden className="absolute left-0 right-0 top-6 hidden border-t border-dashed border-neutral-300 lg:block" />
          {s.items.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i} className="relative">
              <div className="relative z-10 grid size-12 place-items-center rounded-2xl bg-ink text-lg font-semibold text-white shadow-[0_12px_24px_-12px_rgba(17,17,19,0.6)] ring-8 ring-white">{i + 1}</div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ---------- Cijfers ---------- */

export function StatsBand({ dict }: { dict: Dict }) {
  return (
    <section className="border-y border-line bg-canvas">
      <Container className="grid grid-cols-2 lg:grid-cols-4">
        {dict.home.stats.map((s, i) => (
          <Reveal key={s.label} delay={i} className="border-line px-2 py-10 text-center even:border-l lg:border-l lg:first:border-l-0 lg:py-14">
            <Counter value={s.value} suffix={s.suffix} className="text-5xl font-semibold tracking-tight text-ink lg:text-6xl" />
            <div className="mx-auto mt-3 max-w-[14rem] text-sm text-neutral-600">{s.label}</div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}

/* ---------- Store Amsterdam ---------- */

export function StoreSection({ dict }: { dict: Dict }) {
  const s = dict.home.store;
  return (
    <section className="py-20 lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative pb-10 pr-8 sm:pr-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-canvas">
            <Image src="/images/store-front.webp" alt={`${site.store.name} · ${site.store.street}`} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 aspect-[3/2] w-[46%] overflow-hidden rounded-3xl border-[5px] border-white bg-canvas shadow-[0_30px_60px_-30px_rgba(17,17,19,0.5)]">
            <Image src="/images/store-interior.webp" alt="" fill sizes="280px" className="object-cover" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <SectionHeading title={s.title} text={s.text} />
          </Reveal>
          <Reveal delay={1} className="mt-8 rounded-[28px] border border-line bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <MapPin className="size-5" strokeWidth={1.75} />
              </div>
              <address className="not-italic">
                <div className="font-semibold text-ink">{site.store.name}</div>
                <div className="mt-1 text-[15px] leading-relaxed text-neutral-600">
                  {site.store.street}
                  <br />
                  {site.store.postal} {site.store.city}
                </div>
              </address>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={site.store.mapsUrl} target="_blank" rel="noopener noreferrer">
                {s.cta} <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href={`tel:${site.store.phoneHref}`} variant="secondary">
                <Phone className="size-4" strokeWidth={1.75} /> {site.store.phone}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function FaqSection({ dict }: { dict: Dict }) {
  const f = dict.home.faq;
  return (
    <section className="bg-canvas py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading title={f.title} />
        </Reveal>
        <div className="divide-y divide-line overflow-hidden rounded-[28px] border border-line bg-white">
          {f.items.map((item, i) => (
            <details key={item.q} className="faq group" open={i === 0}>
              <summary className="flex items-center justify-between gap-6 px-6 py-5 text-[17px] font-medium text-ink transition-colors hover:bg-neutral-50 sm:px-8">
                {item.q}
                <span className="faq-icon grid size-8 shrink-0 place-items-center rounded-full bg-canvas text-ink transition-transform duration-300">
                  <Plus className="size-4" />
                </span>
              </summary>
              <div className="faq-body px-6 pb-6 text-[15px] leading-relaxed text-neutral-600 sm:px-8">{item.a}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- Afsluitende oproep ---------- */

export function CtaSection({ locale, dict }: { locale: Locale; dict: Dict }) {
  const c = dict.home.cta;
  return (
    <section className="px-3 pb-3 pt-20 sm:px-5 sm:pb-5 lg:pt-28">
      <Reveal className="relative isolate overflow-hidden rounded-[40px] bg-ink text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 left-[-10%] -z-10 size-[640px] rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #52b5c4 0%, rgba(82,181,196,0.25) 55%, transparent 100%)" }}
        />
        <div aria-hidden className="dots pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" />
        <Container className="grid items-center gap-8 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{c.title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">{c.text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={href(locale, "/dealers#aanvraag")} variant="light" size="lg" className="group max-sm:w-full max-sm:px-5">
                {c.primary}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href={portalLoginUrl(locale)} variant="outlineLight" size="lg" className="max-sm:w-full max-sm:px-5">
                <LogIn className="size-4" strokeWidth={1.75} />
                {c.secondary}
              </ButtonLink>
            </div>
          </div>
          <div className="relative hidden h-[340px] lg:block">
            <div className="absolute inset-0 animate-float">
              <Image src="/images/bikes/roam-midnight-blue.webp" alt="MapFour Roam" fill sizes="560px" className="object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.55)]" />
            </div>
          </div>
        </Container>
      </Reveal>
    </section>
  );
}
