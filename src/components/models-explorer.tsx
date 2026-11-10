"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

export type ModelCardData = {
  slug: string;
  href: string;
  name: string;
  family: string;
  familyLabel: string;
  tagline: string;
  price: string;
  badge: string | null;
  stepThrough: string | null;
  colors: { key: string; label: string; hex: string; image: string }[];
  stats: { label: string; value: string }[];
};

export function ModelCard({ model, priceLabel, viewLabel, index = 0 }: { model: ModelCardData; priceLabel: string; viewLabel: string; index?: number }) {
  const [color, setColor] = useState(0);
  return (
    <article
      className="stagger group relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-white transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_30px_60px_-30px_rgba(17,17,19,0.35)]"
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(ellipse_at_center,_#fbfbfb_0%,_#eeeef0_100%)]">
        {model.colors.map((c, i) => (
          <Image
            key={c.key}
            src={c.image}
            alt={`${model.name} ${c.label}`}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-contain p-7 drop-shadow-[0_22px_22px_rgba(0,0,0,0.14)] transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.05]",
              i === color ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {model.badge ? <span className="rounded-lg bg-ink px-2 py-1 text-[11px] font-semibold text-white">{model.badge}</span> : null}
          {model.stepThrough ? <span className="rounded-lg bg-white/90 px-2 py-1 text-[11px] font-medium text-ink-soft ring-1 ring-line backdrop-blur">{model.stepThrough}</span> : null}
        </div>
        {/* z-10: boven de kaartbrede link, zodat de kleuren klikbaar blijven */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 p-1.5 ring-1 ring-line backdrop-blur">
          {model.colors.map((c, i) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setColor(i)}
              aria-label={c.label}
              aria-pressed={i === color}
              title={c.label}
              className={cn("size-5 rounded-full ring-2 ring-offset-2 ring-offset-white transition-[box-shadow,transform] duration-300 hover:scale-110", i === color ? "ring-ink" : "ring-transparent")}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="text-xs font-medium uppercase tracking-wider text-brand-700">{model.familyLabel}</div>
        <h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">
          <Link href={model.href} className="after:absolute after:inset-0 after:content-['']">
            {model.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[15px] text-neutral-600">{model.tagline}</p>
        <dl className="mt-5 grid grid-cols-3 gap-2">
          {model.stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-canvas px-3 py-2">
              <dt className="text-[11px] text-neutral-500">{s.label}</dt>
              <dd className="text-sm font-semibold tabular-nums text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <div className="text-xs text-neutral-500">{priceLabel}</div>
            <div className="text-lg font-semibold tabular-nums text-ink">{model.price}</div>
          </div>
          <span className="btn pointer-events-none inline-flex h-10 items-center gap-1.5 rounded-xl bg-ink px-3.5 text-sm font-medium text-white transition-colors group-hover:bg-brand-600">
            {viewLabel}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function ModelsExplorer({
  models,
  filters,
  priceLabel,
  viewLabel,
}: {
  models: ModelCardData[];
  filters: { key: string; label: string }[];
  priceLabel: string;
  viewLabel: string;
}) {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? models : models.filter((m) => m.family === filter);
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {filters.map((f) => {
          const count = f.key === "all" ? models.length : models.filter((m) => m.family === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "btn inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium",
                filter === f.key ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-neutral-300 hover:text-ink",
              )}
            >
              {f.label}
              <span className={cn("tabular-nums", filter === f.key ? "text-white/60" : "text-neutral-400")}>{count}</span>
            </button>
          );
        })}
      </div>
      <div key={filter} className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((m, i) => (
          <ModelCard key={m.slug} model={m} priceLabel={priceLabel} viewLabel={viewLabel} index={i} />
        ))}
      </div>
    </div>
  );
}
