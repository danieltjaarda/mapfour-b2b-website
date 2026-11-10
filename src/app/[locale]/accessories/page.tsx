import { LogIn } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { CtaSection } from "@/components/sections";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { portalLoginUrl } from "@/config/site";
import { ACCESSORIES } from "@/data/models";
import { formatEuro } from "@/lib/format";
import { getPage, pageMeta, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await getPage(params);
  return pageMeta(locale, "/accessories", dict.meta.accessories.title, dict.meta.accessories.description);
}

export default async function AccessoriesPage({ params }: LocaleParams) {
  const { locale, dict, intl } = await getPage(params);
  const a = dict.accessories;
  return (
    <>
      <section className="pb-8 pt-12 lg:pt-20">
        <Container>
          <div className="animate-fade-up">
            <SectionHeading as="h1" title={a.title} text={a.text} />
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {ACCESSORIES.map((acc, i) => {
              const copy = a.items[acc.slug];
              return (
                <Reveal key={acc.slug} delay={i % 2} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-line bg-white transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_30px_60px_-30px_rgba(17,17,19,0.35)]">
                    <div className="relative aspect-[16/10] bg-[radial-gradient(ellipse_at_center,_#fbfbfb_0%,_#eeeef0_100%)]">
                      <Image src={acc.image} alt={copy.name} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-contain p-10 drop-shadow-[0_22px_22px_rgba(0,0,0,0.14)] transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{copy.name}</h2>
                        <span className="shrink-0 rounded-lg bg-canvas px-2.5 py-1 font-mono text-[11px] text-neutral-500">{acc.sku}</span>
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{copy.text}</p>
                      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                        <div>
                          <div className="text-xs text-neutral-500">
                            {dict.common.rrp} · {dict.common.inclVat}
                          </div>
                          <div className="text-lg font-semibold tabular-nums text-ink">{formatEuro(acc.rrpCents, intl)}</div>
                        </div>
                        <span className="text-sm text-neutral-500">{acc.spec}</span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-canvas px-7 py-5">
            <p className="text-[15px] text-ink-soft">{a.note}</p>
            <ButtonLink href={portalLoginUrl(locale)}>
              <LogIn className="size-4" strokeWidth={1.75} />
              {dict.common.portalLogin}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
