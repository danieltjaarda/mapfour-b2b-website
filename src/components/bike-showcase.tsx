"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type ShowcaseSlide = {
  slug: string;
  href: string;
  name: string;
  family: string;
  color: string;
  image: string;
  stats: { label: string; value: string }[];
};

const INTERVAL = 4600;

/** Donkere showcase met automatisch wisselende, zwevende fietsen. Pauzeert bij hover en bij "minder beweging". */
export function BikeShowcase({ slides, viewLabel }: { slides: ShowcaseSlide[]; viewLabel: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2 || reduced.current) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(timer);
  }, [paused, slides.length, index]);

  const current = slides[index];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="relative isolate flex h-[520px] flex-col overflow-hidden rounded-[36px] bg-ink p-6 text-white sm:h-[600px] sm:p-8 lg:h-[640px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 -z-10 size-[560px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #52b5c4 0%, rgba(82,181,196,0.25) 55%, transparent 100%)" }}
      />
      <div aria-hidden className="pointer-events-none absolute -right-28 -top-24 -z-10 size-[380px] rounded-full bg-white/[0.06] blur-2xl" />
      <div aria-hidden className="dots pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" />

      <div className="flex items-center justify-between text-xs">
        <span key={current.family} className="animate-fade-in rounded-lg bg-white/10 px-2.5 py-1 font-medium uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/10">
          {current.family}
        </span>
        <span className="font-mono tabular-nums text-white/50">
          {pad(index + 1)} <span className="text-white/25">/ {pad(slides.length)}</span>
        </span>
      </div>

      <div className="relative flex-1">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] opacity-80 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(82,181,196,0.45) 0%, rgba(255,255,255,0.10) 45%, transparent 100%)" }}
        />
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.slug}
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                active ? "translate-x-0 scale-100 opacity-100" : "pointer-events-none translate-x-8 scale-[0.96] opacity-0",
              )}
            >
              <div className={cn("relative size-full", active && "animate-float")}>
                <Image
                  src={s.image}
                  alt={`${s.name} ${s.color}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 600px, 92vw"
                  className="object-contain p-2 drop-shadow-[0_40px_40px_rgba(0,0,0,0.55)] sm:p-6"
                />
              </div>
            </div>
          );
        })}
        <span aria-hidden className="absolute bottom-[9%] left-1/2 h-8 w-2/3 -translate-x-1/2 rounded-[100%] bg-black/45 blur-2xl" />
      </div>

      <div>
        <div key={current.slug} className="animate-fade-up">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-3xl font-semibold tracking-tight sm:text-4xl">{current.name}</div>
              <div className="mt-1 text-sm text-white/55">{current.color}</div>
            </div>
            <Link href={current.href} className="btn group inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/10 px-3.5 text-sm font-medium ring-1 ring-white/15 hover:bg-white/15">
              {viewLabel}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-2">
            {current.stats.map((st) => (
              <div key={st.label} className="rounded-2xl bg-white/[0.06] px-3 py-2.5 ring-1 ring-white/10">
                <dt className="text-[11px] uppercase tracking-wider text-white/45">{st.label}</dt>
                <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{st.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-5 flex items-center gap-2" role="tablist">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={s.name}
              onClick={() => setIndex(i)}
              className={cn("h-1.5 rounded-full transition-[width,background-color] duration-500", i === index ? "w-9 bg-brand-400" : "w-3 bg-white/25 hover:bg-white/50")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
