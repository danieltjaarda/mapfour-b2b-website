"use client";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { Dict } from "@/i18n";

type Values = {
  company: string; name: string; email: string; phone: string; website: string;
  country: string; city: string; shopType: string; message: string; interest: string[]; consent: boolean; hp: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { company: "", name: "", email: "", phone: "", website: "", country: "", city: "", shopType: "store", message: "", interest: [], consent: false, hp: "" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const field =
  "h-14 w-full rounded-2xl border-2 border-transparent bg-white px-5 text-[15px] text-ink placeholder:text-neutral-500 transition-[box-shadow,border-color] focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-400/30 aria-[invalid=true]:border-red-400";

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Aanmeldformulier in de hero: stap 1 (bedrijf en contact), stap 2 (details en toestemming). */
export function HeroSignup({
  locale,
  t,
  interests,
  privacyHref,
  privacyLabel,
  loginUrl,
  loginLabel,
}: {
  locale: string;
  t: Dict["form"];
  interests: { key: string; label: string }[];
  privacyHref: string;
  privacyLabel: string;
  loginUrl: string;
  loginLabel: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setV((old) => ({ ...old, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const focusFirst = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
  };

  function validateStep1(): Errors {
    const e: Errors = {};
    if (!v.company.trim()) e.company = t.errors.required;
    if (!v.name.trim()) e.name = t.errors.required;
    if (!v.email.trim()) e.email = t.errors.required;
    else if (!EMAIL.test(v.email.trim())) e.email = t.errors.email;
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setFormError(null);
    if (step === 1) {
      const e = validateStep1();
      setErrors(e);
      if (Object.keys(e).length) return focusFirst(e);
      setStep(2);
      return;
    }
    const e: Errors = {};
    if (!v.country.trim()) e.country = t.errors.required;
    if (!v.consent) e.consent = t.errors.consent;
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);

    setStatus("sending");
    try {
      const res = await fetch("/api/aanvraag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "dealer", locale, ...v }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string> };
      if (res.ok && body.ok) return setStatus("done");
      if (body.errors) {
        const mapped: Errors = {};
        for (const [k, code] of Object.entries(body.errors)) mapped[k as keyof Values] = t.errors[code as keyof typeof t.errors] ?? t.errors.required;
        setErrors(mapped);
        if (mapped.company || mapped.name || mapped.email) setStep(1);
      }
      setFormError(res.status === 429 ? t.errors.rate : body.errors ? null : t.errors.generic);
    } catch {
      setFormError(t.errors.generic);
    }
    setStatus("idle");
  }

  if (status === "done") {
    return (
      <div className="animate-scale-in rounded-[28px] bg-white/[0.06] p-8 text-center ring-1 ring-white/15 backdrop-blur sm:p-10" role="status">
        <div className="mx-auto grid size-14 animate-pop place-items-center rounded-2xl bg-brand-400 text-ink">
          <CheckCircle2 className="size-7" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">{t.successTitle}</h2>
        <p className="mt-2 text-white/70">{t.successText}</p>
      </div>
    );
  }

  const err = (k: keyof Values) => (errors[k] ? <span className="mt-1.5 block animate-fade-in pl-1 text-xs text-red-300">{errors[k]}</span> : null);
  const invalid = (k: keyof Values) => (errors[k] ? true : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label={t.submit}>
      {/* Honeypot tegen spambots: onzichtbaar voor mensen */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" value={v.hp} onChange={(e) => set("hp", e.target.value)} />
        </label>
      </div>

      <div className="mb-4 flex items-center gap-3" aria-hidden>
        <span className="h-1 flex-1 rounded-full bg-brand-400" />
        <span className={cn("h-1 flex-1 rounded-full transition-colors duration-500", step === 2 ? "bg-brand-400" : "bg-white/20")} />
        <span className="text-xs tabular-nums text-white/60">{t.step.replace("{n}", String(step))}</span>
      </div>

      {step === 1 ? (
        <div key="s1" className="animate-fade-up space-y-3.5">
          <div>
            <input name="company" value={v.company} onChange={(e) => set("company", e.target.value)} placeholder={`${t.company} *`} aria-label={t.company} aria-invalid={invalid("company")} autoComplete="organization" className={field} />
            {err("company")}
          </div>
          <div>
            <input name="name" value={v.name} onChange={(e) => set("name", e.target.value)} placeholder={`${t.name} *`} aria-label={t.name} aria-invalid={invalid("name")} autoComplete="name" className={field} />
            {err("name")}
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <input name="email" type="email" value={v.email} onChange={(e) => set("email", e.target.value)} placeholder={`${t.email} *`} aria-label={t.email} aria-invalid={invalid("email")} autoComplete="email" className={field} />
              {err("email")}
            </div>
            <input name="phone" type="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t.phone} aria-label={t.phone} autoComplete="tel" className={field} />
          </div>
          <input name="website" value={v.website} onChange={(e) => set("website", e.target.value)} placeholder={t.website} aria-label={t.website} autoComplete="url" className={field} />
          <button type="submit" className="btn group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-400 text-base font-semibold text-ink hover:bg-brand-300">
            {t.next}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      ) : (
        <div key="s2" className="animate-fade-up space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <input name="country" value={v.country} onChange={(e) => set("country", e.target.value)} placeholder={`${t.country} *`} aria-label={t.country} aria-invalid={invalid("country")} autoComplete="country-name" className={field} />
              {err("country")}
            </div>
            <input name="city" value={v.city} onChange={(e) => set("city", e.target.value)} placeholder={t.city} aria-label={t.city} autoComplete="address-level2" className={field} />
          </div>
          <span className="relative block">
            <select name="shopType" value={v.shopType} onChange={(e) => set("shopType", e.target.value)} aria-label={t.shopType} className={cn(field, "appearance-none pr-12")}>
              {Object.entries(t.shopTypes).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
          <fieldset>
            <legend className="mb-2 text-[13px] font-medium text-white/70">{t.interest}</legend>
            <div className="flex flex-wrap gap-2">
              {interests.map((it) => {
                const on = v.interest.includes(it.key);
                return (
                  <button
                    key={it.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("interest", on ? v.interest.filter((k) => k !== it.key) : [...v.interest, it.key])}
                    className={cn("btn rounded-xl px-3.5 py-2 text-sm font-medium ring-1", on ? "bg-brand-400 text-ink ring-brand-400" : "bg-white/[0.06] text-white ring-white/20 hover:bg-white/10")}
                  >
                    {it.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <textarea name="message" value={v.message} onChange={(e) => set("message", e.target.value)} rows={3} maxLength={3000} placeholder={t.messagePlaceholder} aria-label={t.message} className={cn(field, "h-auto min-h-24 py-4 leading-relaxed")} />
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/75">
              <input type="checkbox" name="consent" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={invalid("consent")} className="mt-1 size-4 shrink-0 rounded accent-brand-400" />
              <span>
                {t.consent}{" "}
                <Link href={privacyHref} className="font-medium text-white underline underline-offset-4 hover:text-brand-300">
                  {privacyLabel}
                </Link>
              </span>
            </label>
            {errors.consent ? <span className="mt-1.5 block animate-fade-in pl-7 text-xs text-red-300">{errors.consent}</span> : null}
          </div>
          {formError ? (
            <p role="alert" className="animate-scale-in rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {formError}
            </p>
          ) : null}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn flex h-14 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-medium text-white ring-1 ring-white/25 hover:bg-white/10">
              <ArrowLeft className="size-4" />
              {t.back}
            </button>
            <button
              type="submit"
              disabled={status === "sending"}
              aria-busy={status === "sending"}
              className="btn group flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-400 text-base font-semibold text-ink hover:bg-brand-300 disabled:opacity-70"
            >
              {status === "sending" ? <Spinner /> : null}
              {status === "sending" ? t.sending : t.submit}
              {status !== "sending" ? <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" /> : null}
            </button>
          </div>
        </div>
      )}

      <p className="mt-7 text-center text-[15px] text-white/80">
        {t.already}{" "}
        <a href={loginUrl} className="font-semibold text-white underline underline-offset-4 hover:text-brand-300">
          {loginLabel}
        </a>
      </p>
    </form>
  );
}
