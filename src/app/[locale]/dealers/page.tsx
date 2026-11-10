import { ArrowDown, Check, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { InquiryForm } from "@/components/inquiry-form";
import { Reveal } from "@/components/reveal";
import { BenefitsGrid, FaqSection, PortalSection, StepsSection } from "@/components/sections";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { site } from "@/config/site";
import { href } from "@/i18n/config";
import { getPage, pageMeta, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await getPage(params);
  return pageMeta(locale, "/dealers", dict.meta.dealers.title, dict.meta.dealers.description);
}

export default async function DealersPage({ params }: LocaleParams) {
  const { locale, dict, intl } = await getPage(params);
  const d = dict.dealers;
  const interests = [
    { key: "city", label: dict.families.city.name },
    { key: "trekking", label: dict.families.trekking.name },
    { key: "utility", label: dict.families.utility.name },
    { key: "accessories", label: dict.nav.accessories },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pb-16 pt-10 lg:pb-24 lg:pt-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h1 className="animate-fade-up text-balance text-5xl font-semibold leading-[1.03] tracking-tight text-ink [animation-delay:80ms] sm:text-6xl xl:text-7xl">{d.hero.title}</h1>
            <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-neutral-600 [animation-delay:160ms]">{d.hero.text}</p>
            <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
              <ButtonLink href="#aanvraag" size="lg" className="group max-sm:w-full max-sm:px-5">
                {dict.home.cta.primary}
                <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </ButtonLink>
              <ButtonLink href={href(locale, "/models")} variant="secondary" size="lg" className="max-sm:w-full max-sm:px-5">
                {dict.common.viewModels}
              </ButtonLink>
            </div>
          </div>
          <div className="relative animate-scale-in [animation-delay:200ms]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[36px] bg-canvas">
              {/* Breed bronbeeld in een 4:3-kader: sizes groter dan het kader, anders wordt het onscherp */}
              <Image src="/images/dealer-steps.webp" alt="MapFour Ray" fill priority sizes="(min-width: 1024px) 1280px, 200vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-56 overflow-hidden rounded-3xl border-[5px] border-white bg-canvas shadow-[0_30px_60px_-30px_rgba(17,17,19,0.5)] sm:block">
              <div className="relative aspect-[4/3]">
                <Image src="/images/showroom.webp" alt="" fill sizes="224px" className="object-cover" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Voordelen */}
      <section className="bg-canvas py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading title={d.benefitsTitle} text={dict.home.program.text} />
          </Reveal>
          <div className="mt-12">
            <BenefitsGrid items={dict.home.program.benefits} />
          </div>
        </Container>
      </section>

      <div className="pt-20 lg:pt-24">
        <PortalSection locale={locale} dict={dict} intl={intl} />
      </div>

      <StepsSection dict={dict} />

      {/* Aanvraagformulier */}
      <section id="aanvraag" className="scroll-mt-24 border-t border-line py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <SectionHeading title={d.formTitle} text={d.formText} />
            </Reveal>
            <Reveal delay={1} className="relative mt-10">
              <InquiryForm kind="dealer" locale={locale} t={dict.form} interests={interests} privacyHref={href(locale, "/privacy")} privacyLabel={dict.footer.privacy} />
            </Reveal>
          </div>
          <Reveal delay={2} className="lg:sticky lg:top-28 lg:self-start">
            <aside className="relative isolate overflow-hidden rounded-[32px] bg-ink p-8 text-white">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-40 -right-24 -z-10 size-[420px] rounded-full opacity-60 blur-3xl"
                style={{ background: "radial-gradient(closest-side, #52b5c4 0%, rgba(82,181,196,0.2) 60%, transparent 100%)" }}
              />
              <h2 className="text-xl font-semibold tracking-tight">{d.aside.title}</h2>
              <ol className="mt-6 space-y-4">
                {d.aside.items.map((item, i) => (
                  <li key={item} className="flex gap-3.5 text-[15px] leading-relaxed text-white/75">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white/10 text-xs font-semibold text-white ring-1 ring-white/15">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ol>
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="text-sm font-medium text-white/60">{d.aside.contact}</div>
                <div className="mt-3 space-y-2 text-[15px]">
                  <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-brand-200">
                    <Mail className="size-4 text-brand-300" strokeWidth={1.75} /> {site.email}
                  </a>
                  <a href={`tel:${site.phoneHref}`} className="flex items-center gap-2.5 hover:text-brand-200">
                    <Phone className="size-4 text-brand-300" strokeWidth={1.75} /> {site.phone}
                  </a>
                </div>
              </div>
              <ul className="mt-8 space-y-2 text-sm text-white/60">
                {dict.home.hero.chips.map((chip) => (
                  <li key={chip} className="flex items-center gap-2">
                    <Check className="size-3.5 text-brand-300" strokeWidth={3} /> {chip}
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </Container>
      </section>

      <FaqSection dict={dict} />
    </>
  );
}
