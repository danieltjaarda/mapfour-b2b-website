import { HeartPulse, Leaf, PiggyBank, ShieldCheck, Smartphone, Sparkles, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { CtaSection, StoreSection } from "@/components/sections";
import { Container, SectionHeading } from "@/components/ui";
import { site } from "@/config/site";
import { getPage, pageMeta, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await getPage(params);
  return pageMeta(locale, "/about", dict.meta.about.title, dict.meta.about.description);
}

const DIFF_ICONS = [Sparkles, Smartphone, Wrench];
const VALUE_ICONS = [Leaf, PiggyBank, HeartPulse, ShieldCheck];

export default async function AboutPage({ params }: LocaleParams) {
  const { locale, dict } = await getPage(params);
  const a = dict.about;
  return (
    <>
      <section className="pt-10 lg:pt-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="animate-fade-up text-balance text-6xl font-semibold leading-[1.02] tracking-tight text-ink [animation-delay:80ms] sm:text-7xl lg:text-8xl">{a.hero.title}</h1>
            <p className="mt-6 max-w-xl animate-fade-up text-xl leading-relaxed text-neutral-600 [animation-delay:160ms]">{a.hero.text}</p>
          </div>
          <div className="relative mt-12 aspect-[16/9] animate-scale-in overflow-hidden rounded-[36px] bg-canvas [animation-delay:240ms] sm:aspect-[21/9]">
            <Image src="/images/amsterdam.webp" alt="MapFour e-bikes in Amsterdam" fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{a.mission.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600">{a.mission.text}</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{a.origin.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600">{a.origin.text}</p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-canvas py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={a.difference.title} />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {a.difference.items.map((item, i) => {
              const Icon = DIFF_ICONS[i % DIFF_ICONS.length];
              return (
                <Reveal key={item.title} delay={i} className="h-full">
                  <div className="h-full rounded-[28px] border border-line bg-white p-7">
                    <div className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="px-3 py-20 sm:px-5 lg:py-24">
        <div className="relative isolate overflow-hidden rounded-[40px] bg-ink text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[560px] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(closest-side, #52b5c4 0%, rgba(82,181,196,0.2) 55%, transparent 100%)" }}
          />
          <div aria-hidden className="dots pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" />
          <Container className="py-16 lg:py-24">
            <Reveal>
              <SectionHeading title={a.values.title} tone="light" />
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {a.values.items.map((v, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <Reveal key={v.title} delay={i}>
                    <div className="grid size-11 place-items-center rounded-xl bg-white/[0.07] text-brand-300 ring-1 ring-white/10">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">{v.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-white/60">{v.text}</p>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </div>
      </section>

      <StoreSection dict={dict} />

      <section className="pb-4">
        <Container>
          <Reveal className="rounded-[28px] border border-line bg-white p-7">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">{a.company.title}</h2>
            <dl className="mt-5 grid gap-x-10 gap-y-4 text-[15px] sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-neutral-500">{a.company.legal}</dt>
                <dd className="mt-0.5 font-medium text-ink">{site.company.legalName}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">{a.company.address}</dt>
                <dd className="mt-0.5 font-medium text-ink">{site.company.address}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">{a.company.vat}</dt>
                <dd className="mt-0.5 font-medium text-ink">{site.company.vat}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">{a.company.register}</dt>
                <dd className="mt-0.5 font-medium text-ink">{site.company.register}</dd>
              </div>
            </dl>
          </Reveal>
        </Container>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
