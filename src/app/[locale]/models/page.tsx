import type { Metadata } from "next";
import { ModelsExplorer } from "@/components/models-explorer";
import { CtaSection } from "@/components/sections";
import { Container, SectionHeading } from "@/components/ui";
import { MODELS } from "@/data/models";
import { toCard } from "@/lib/model-view";
import { getPage, pageMeta, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await getPage(params);
  return pageMeta(locale, "/models", dict.meta.models.title, dict.meta.models.description);
}

export default async function ModelsPage({ params }: LocaleParams) {
  const { locale, dict, intl } = await getPage(params);
  const filters = [
    { key: "all", label: dict.families.all },
    { key: "city", label: dict.families.city.name },
    { key: "trekking", label: dict.families.trekking.name },
    { key: "utility", label: dict.families.utility.name },
  ];
  return (
    <>
      <section className="pb-6 pt-12 lg:pt-20">
        <Container>
          <div className="animate-fade-up">
            <SectionHeading as="h1" title={dict.models.title} text={dict.models.text} />
          </div>
          <div className="mt-10 animate-fade-up [animation-delay:120ms]">
            <ModelsExplorer models={MODELS.map((m) => toCard(m, locale, dict, intl))} filters={filters} priceLabel={`${dict.common.rrp} · ${dict.common.inclVat}`} viewLabel={dict.common.viewModel} />
          </div>
          <p className="mt-8 text-sm text-neutral-500">{dict.models.specNote}</p>
        </Container>
      </section>
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
