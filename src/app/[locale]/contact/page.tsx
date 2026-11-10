import { ArrowUpRight, Mail, MapPin, Phone, Wrench } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui";
import { site } from "@/config/site";
import { href } from "@/i18n/config";
import { getPage, pageMeta, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await getPage(params);
  return pageMeta(locale, "/contact", dict.meta.contact.title, dict.meta.contact.description);
}

function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-[28px] border border-line bg-white p-6">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">{icon}</div>
      <div className="min-w-0">
        <h2 className="font-semibold tracking-tight text-ink">{title}</h2>
        <div className="mt-1.5 space-y-1 text-[15px] leading-relaxed text-neutral-600">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactPage({ params }: LocaleParams) {
  const { locale, dict } = await getPage(params);
  const c = dict.contact;
  const subjects = Object.entries(c.subjects).map(([key, label]) => ({ key, label }));
  const linkCls = "font-medium text-ink underline-offset-4 hover:text-brand-700 hover:underline";

  return (
    <section className="pb-24 pt-10 lg:pt-16">
      <Container>
        <div className="max-w-2xl">
          <h1 className="animate-fade-up text-balance text-5xl font-semibold leading-[1.03] tracking-tight text-ink [animation-delay:80ms] sm:text-6xl">{c.hero.title}</h1>
          <p className="mt-6 animate-fade-up text-lg leading-relaxed text-neutral-600 [animation-delay:160ms]">{c.hero.text}</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="space-y-4">
            <Reveal>
              <InfoCard icon={<Mail className="size-5" strokeWidth={1.75} />} title={c.b2b}>
                <a href={`mailto:${site.email}`} className={`${linkCls} block`}>
                  {site.email}
                </a>
                <a href={`tel:${site.phoneHref}`} className="flex items-center gap-2 hover:text-ink">
                  <Phone className="size-3.5" strokeWidth={1.75} /> {site.phone}
                </a>
              </InfoCard>
            </Reveal>
            <Reveal delay={1}>
              <InfoCard icon={<Wrench className="size-5" strokeWidth={1.75} />} title={c.service}>
                <a href={`mailto:${site.serviceEmail}`} className={`${linkCls} block`}>
                  {site.serviceEmail}
                </a>
              </InfoCard>
            </Reveal>
            <Reveal delay={2}>
              <InfoCard icon={<MapPin className="size-5" strokeWidth={1.75} />} title={c.store}>
                <address className="not-italic">
                  {site.store.street}
                  <br />
                  {site.store.postal} {site.store.city}
                </address>
                <a href={`tel:${site.store.phoneHref}`} className="flex items-center gap-2 hover:text-ink">
                  <Phone className="size-3.5" strokeWidth={1.75} /> {site.store.phone}
                </a>
                <a href={site.store.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-1`}>
                  {dict.home.store.cta} <ArrowUpRight className="size-3.5" />
                </a>
              </InfoCard>
            </Reveal>
          </div>

          <Reveal delay={1} className="relative rounded-[32px] border border-line bg-white p-6 sm:p-9">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">{c.formTitle}</h2>
            <div className="mt-7">
              <InquiryForm kind="contact" locale={locale} t={dict.form} subjects={subjects} privacyHref={href(locale, "/privacy")} privacyLabel={dict.footer.privacy} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
