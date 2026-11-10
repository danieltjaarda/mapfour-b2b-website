"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

export type StageColor = {
  key: string;
  label: string;
  hex: string;
  sku: string;
  /** Aanzichten van deze kleur; het eerste is het zijaanzicht. */
  views: { key: string; label: string; src: string }[];
};

/** Groot productbeeld met kleurkiezer en, waar beschikbaar, extra aanzichten (voor, achter, opgevouwen). */
export function ModelStage({ name, colors, colorsLabel }: { name: string; colors: StageColor[]; colorsLabel: string }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [viewIndex, setViewIndex] = useState(0);
  const current = colors[colorIndex];
  const view = Math.min(viewIndex, current.views.length - 1);

  const pickColor = (i: number) => {
    setColorIndex(i);
    setViewIndex(0);
  };

  return (
    <div>
      <div className="relative aspect-[5/4] overflow-hidden rounded-[36px] bg-[radial-gradient(ellipse_at_50%_40%,_#fcfcfc_0%,_#ececef_100%)]">
        <span aria-hidden className="absolute bottom-[12%] left-1/2 h-8 w-2/3 -translate-x-1/2 rounded-[100%] bg-black/15 blur-2xl" />
        {colors.map((c, ci) =>
          c.views.map((v, vi) => {
            const active = ci === colorIndex && vi === view;
            return (
              <Image
                key={`${c.key}-${v.key}`}
                src={v.src}
                alt={`${name} ${c.label} · ${v.label}`}
                fill
                priority={ci === 0 && vi === 0}
                sizes="(min-width: 1024px) 680px, 100vw"
                aria-hidden={!active}
                className={cn(
                  "object-contain p-8 drop-shadow-[0_30px_30px_rgba(0,0,0,0.16)] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-12",
                  active ? "scale-100 opacity-100" : "scale-[0.97] opacity-0",
                )}
              />
            );
          }),
        )}
      </div>

      {current.views.length > 1 ? (
        <div key={current.key} className="mt-3 flex animate-fade-in gap-2.5" role="tablist">
          {current.views.map((v, vi) => (
            <button
              key={v.key}
              type="button"
              role="tab"
              aria-selected={vi === view}
              aria-label={v.label}
              title={v.label}
              onClick={() => setViewIndex(vi)}
              className={cn(
                "btn relative h-[68px] w-[88px] overflow-hidden rounded-2xl border-2 bg-[#f1f1f3] sm:h-[76px] sm:w-[100px]",
                vi === view ? "border-ink" : "border-transparent hover:border-neutral-300",
              )}
            >
              <Image src={v.src} alt="" fill sizes="100px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="text-sm text-neutral-500">{colorsLabel}</span>
        <div className="flex flex-wrap gap-2">
          {colors.map((c, i) => (
            <button
              key={c.key}
              type="button"
              onClick={() => pickColor(i)}
              aria-pressed={i === colorIndex}
              data-color={c.key}
              className={cn(
                "btn inline-flex h-10 items-center gap-2.5 rounded-xl border pl-2 pr-3.5 text-sm font-medium",
                i === colorIndex ? "border-ink bg-white text-ink shadow-[0_6px_18px_-10px_rgba(17,17,19,0.5)]" : "border-line bg-white text-ink-soft hover:border-neutral-300",
              )}
            >
              <span className="size-6 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c.hex }} />
              {c.label}
            </button>
          ))}
        </div>
        <span data-sku className="ml-auto font-mono text-xs text-neutral-400">
          {current.sku}
        </span>
      </div>
    </div>
  );
}
