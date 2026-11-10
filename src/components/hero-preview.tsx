import Image from "next/image";
import type { Locale } from "@/i18n/config";

/* Schuin gekantelde schermafbeelding van het B2B Portal (catalogus), in de taal van de bezoeker.
   - De beelden komen uit tools/portal-shots.mjs: public/images/portal/catalog-<taal>.webp
   - Kanteling zonder perspectief: draaien + schuintrekken, zodat regels evenwijdig blijven.
   - Rechts vervaagt het beeld (masker), onderaan loopt het door tot de rand van de hero-sectie. */
export function HeroPreview({ locale, alt }: { locale: Locale; alt: string }) {
  return (
    <div className="pointer-events-none relative h-[300px] select-none sm:h-[400px] lg:h-full lg:min-h-[480px]">
      <div className="absolute -top-28 bottom-0 -left-6 w-[1200px] overflow-hidden [mask-image:linear-gradient(to_right,black_0,black_200px,rgba(0,0,0,0.55)_300px,rgba(0,0,0,0.15)_370px,transparent_420px)] sm:[mask-image:linear-gradient(to_right,black_0,black_380px,rgba(0,0,0,0.55)_520px,rgba(0,0,0,0.15)_620px,transparent_690px)] lg:[mask-image:linear-gradient(to_right,black_0,black_330px,rgba(0,0,0,0.6)_440px,rgba(0,0,0,0.18)_530px,transparent_600px)] xl:[mask-image:linear-gradient(to_right,black_0,black_400px,rgba(0,0,0,0.6)_540px,rgba(0,0,0,0.18)_650px,transparent_730px)]">
        <div className="absolute left-6 top-[10.5rem] w-[720px] origin-top-left overflow-hidden rounded-[20px] bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/25 [transform:rotate(-5.5deg)_skewX(9deg)] sm:w-[880px] lg:top-[12.5rem] lg:w-[1000px]">
          <Image src={`/images/portal/catalog-${locale}.webp`} alt={alt} width={2240} height={1600} priority sizes="(min-width: 1024px) 1000px, (min-width: 640px) 880px, 720px" className="block h-auto w-full" />
        </div>
      </div>
    </div>
  );
}
