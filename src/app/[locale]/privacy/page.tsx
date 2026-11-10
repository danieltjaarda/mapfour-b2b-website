import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { site } from "@/config/site";
import { getPage, pageMeta, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await getPage(params);
  return pageMeta(locale, "/privacy", dict.meta.privacy.title, dict.meta.privacy.description);
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const { dict } = await getPage(params);
  const p = dict.privacy;
  const c = dict.about.company;
  return (
    <section className="pb-24 pt-12 lg:pt-20">
      <Container className="max-w-3xl">
        <h1 className="animate-fade-up text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{p.title}</h1>
        <p className="mt-3 animate-fade-up text-sm text-neutral-500 [animation-delay:80ms]">{p.updated}</p>
        <div className="mt-12 animate-fade-up space-y-10 [animation-delay:160ms]">
          {p.sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold tracking-tight text-ink">{s.title}</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-neutral-600">{s.text}</p>
            </section>
          ))}
        </div>
        <div className="mt-14 rounded-[28px] bg-canvas p-7 text-[15px]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">{c.title}</h2>
          <dl className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-neutral-500">{c.legal}</dt>
              <dd className="font-medium text-ink">{site.company.legalName}</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-neutral-500">{c.address}</dt>
              <dd className="font-medium text-ink">{site.company.address}</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-neutral-500">{c.vat}</dt>
              <dd className="font-medium text-ink">{site.company.vat}</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-neutral-500">{dict.form.email}</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="font-medium text-ink underline underline-offset-4 hover:text-brand-700">
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
