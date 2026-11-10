import { ClipboardList, LayoutGrid, ShoppingCart } from "lucide-react";
import Image from "next/image";
import type { Dict } from "@/i18n";
import { formatEuro } from "@/lib/format";
import { cn } from "@/lib/cn";
import { MapfourLogo } from "./logo";

/** Gestileerde weergave van het B2B Portal (illustratief; bedragen zijn voorbeelden). */
export function PortalMock({ dict, intl }: { dict: Dict; intl: string }) {
  const m = dict.home.portal.mock;
  const items = [
    { name: "Ray Air", color: dict.colors["ink-green"], img: "/images/bikes/ray-air-ink-green.webp", price: 115000, list: 121800, badge: true, tiers: ["3+", "5+", "10+"], pct: ["−3%", "−6%", "−10%"], active: 0 },
    { name: "Roam", color: dict.colors["space-grey"], img: "/images/bikes/roam-space-grey.webp", price: 235200, list: null, badge: false, tiers: ["2+", "4+"], pct: ["−4%", "−8%"], active: -1 },
    { name: "Loop Pro", color: dict.colors.champagne, img: "/images/bikes/loop-pro-champagne.webp", price: 176400, list: null, badge: false, tiers: ["3+", "5+", "10+"], pct: ["−3%", "−6%", "−10%"], active: -1 },
  ];
  const nav = [
    { icon: LayoutGrid, label: m.catalog, active: true, badge: 0 },
    { icon: ShoppingCart, label: m.cart, active: false, badge: 3 },
    { icon: ClipboardList, label: m.orders, active: false, badge: 0 },
  ];

  return (
    <div aria-hidden className="select-none overflow-hidden rounded-[28px] bg-white text-ink shadow-[0_50px_100px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
      <div className="flex h-10 items-center gap-2 border-b border-line bg-neutral-50 px-4">
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="mx-auto rounded-md bg-white px-3 py-0.5 text-[11px] text-neutral-400 ring-1 ring-line">{dict.common.b2bPortal}</span>
      </div>
      <div className="flex">
        <div className="hidden w-44 shrink-0 border-r border-line bg-neutral-50 p-3 md:block">
          <MapfourLogo className="mb-4 ml-1 mt-1 h-3.5 w-auto text-ink" />
          <div className="space-y-0.5">
            {nav.map((n) => (
              <div key={n.label} className={cn("flex h-8 items-center gap-2 rounded-lg px-2.5 text-xs font-medium", n.active ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.06]" : "text-neutral-500")}>
                <n.icon className={cn("size-3.5", n.active ? "text-brand-600" : "")} strokeWidth={1.75} />
                <span className="truncate">{n.label}</span>
                {n.badge ? <span className="ml-auto rounded-md bg-brand-400 px-1.5 text-[10px] font-semibold text-white">{n.badge}</span> : null}
              </div>
            ))}
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 p-4 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={it.name} className={cn("rounded-2xl border border-line p-3", i === 2 && "hidden lg:block")}>
              <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_center,_#fafafa_0%,_#f0f0f2_100%)]">
                <Image src={it.img} alt="" fill sizes="220px" className="object-contain p-3" />
                {it.badge ? <span className="absolute left-2 top-2 rounded-md bg-brand-400 px-1.5 py-0.5 text-[9px] font-semibold text-white">{m.yourPrice}</span> : null}
              </div>
              <div className="text-[13px] font-semibold leading-tight">
                {it.name} <span className="font-normal text-neutral-500">· {it.color}</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-sm font-semibold tabular-nums">{formatEuro(it.price, intl)}</span>
                {it.list ? <span className="text-[11px] tabular-nums text-neutral-400 line-through">{formatEuro(it.list, intl)}</span> : null}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {it.tiers.map((tier, ti) => (
                  <span key={tier} className={cn("rounded-md border px-1.5 py-0.5 text-[10px] tabular-nums", ti === it.active ? "border-brand-400 bg-brand-50 font-semibold text-brand-800" : "border-line text-neutral-500")}>
                    {tier} · {it.pct[ti]}
                  </span>
                ))}
              </div>
              {i === 0 ? <div className="mt-1.5 text-[10px] text-brand-700">{m.next}</div> : <div className="mt-1.5 h-[15px]" />}
              <div className="mt-2 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-ink text-[11px] font-medium text-white">
                <ShoppingCart className="size-3" strokeWidth={2} /> {m.add}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
