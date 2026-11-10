"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Dict } from "@/i18n";
import { Button } from "./ui";

type Kind = "dealer" | "contact";
type Errors = Record<string, string>;

const inputCls =
  "h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] text-ink placeholder:text-neutral-400 transition-[box-shadow,border-color] focus:border-neutral-400 focus:outline-none focus:ring-4 focus:ring-brand-400/15 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-red-400/10";

function Field({ label, optional, error, children, className }: { label: string; optional?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-ink-soft">
        {label}
        {optional ? <span className="font-normal text-neutral-400">{optional}</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block animate-fade-in text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function InquiryForm({
  kind,
  locale,
  t,
  interests,
  subjects,
  privacyHref,
  privacyLabel,
}: {
  kind: Kind;
  locale: string;
  t: Dict["form"];
  /** Dealerformulier: aanvinkbare interesses */
  interests?: { key: string; label: string }[];
  /** Contactformulier: onderwerpen */
  subjects?: { key: string; label: string }[];
  privacyHref: string;
  privacyLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, unknown> = { kind, locale };
    fd.forEach((v, k) => {
      if (k === "interest") return;
      data[k] = typeof v === "string" ? v.trim() : v;
    });
    data.interest = fd.getAll("interest");
    data.consent = fd.get("consent") === "on";

    // Zelfde controles als op de server, voor directe feedback
    const errs: Errors = {};
    const required = kind === "dealer" ? ["company", "name", "email", "country"] : ["name", "email", "message"];
    for (const k of required) if (!data[k]) errs[k] = t.errors.required;
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email))) errs.email = t.errors.email;
    if (!data.consent) errs.consent = t.errors.consent;
    setErrors(errs);
    setFormError(null);
    if (Object.keys(errs).length) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/aanvraag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string>; error?: string };
      if (res.ok && body.ok) {
        setStatus("done");
        return;
      }
      if (body.errors) {
        const mapped: Errors = {};
        for (const [k, code] of Object.entries(body.errors)) mapped[k] = t.errors[code as keyof typeof t.errors] ?? t.errors.required;
        setErrors(mapped);
      }
      setFormError(res.status === 429 ? t.errors.rate : body.errors ? null : t.errors.generic);
      setStatus("idle");
    } catch {
      setFormError(t.errors.generic);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="animate-scale-in rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-8 text-center sm:p-12" role="status">
        <div className="mx-auto grid size-14 animate-pop place-items-center rounded-2xl bg-emerald-600 text-white">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink">{kind === "dealer" ? t.successTitle : t.successContactTitle}</h3>
        <p className="mt-2 text-neutral-600">{t.successText}</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-medium text-emerald-800 underline underline-offset-4 hover:text-emerald-900">
          {t.again}
        </button>
      </div>
    );
  }

  const err = (k: string) => errors[k];
  const invalid = (k: string) => (errors[k] ? true : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot tegen spambots: onzichtbaar voor mensen */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {kind === "dealer" ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.company} error={err("company")} className="sm:col-span-2">
              <input name="company" className={inputCls} autoComplete="organization" aria-invalid={invalid("company")} />
            </Field>
            <Field label={t.name} error={err("name")}>
              <input name="name" className={inputCls} autoComplete="name" aria-invalid={invalid("name")} />
            </Field>
            <Field label={t.email} error={err("email")}>
              <input name="email" type="email" className={inputCls} autoComplete="email" aria-invalid={invalid("email")} />
            </Field>
            <Field label={t.phone} optional={t.optional}>
              <input name="phone" type="tel" className={inputCls} autoComplete="tel" />
            </Field>
            <Field label={t.website} optional={t.optional}>
              <input name="website" className={inputCls} placeholder="www." autoComplete="url" />
            </Field>
            <Field label={t.country} error={err("country")}>
              <input name="country" className={inputCls} autoComplete="country-name" aria-invalid={invalid("country")} />
            </Field>
            <Field label={t.city} optional={t.optional}>
              <input name="city" className={inputCls} autoComplete="address-level2" />
            </Field>
            <Field label={t.shopType} className="sm:col-span-2">
              <span className="relative block">
                <select name="shopType" className={cn(inputCls, "appearance-none pr-10")} defaultValue="store">
                  {Object.entries(t.shopTypes).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
                <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </Field>
          </div>
          {interests?.length ? (
            <fieldset>
              <legend className="mb-2 text-[13px] font-medium text-ink-soft">{t.interest}</legend>
              <div className="flex flex-wrap gap-2">
                {interests.map((it) => (
                  <label key={it.key} className="btn cursor-pointer select-none rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink-soft has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white hover:border-neutral-300">
                    <input type="checkbox" name="interest" value={it.key} className="sr-only" />
                    {it.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <Field label={t.message} optional={t.optional}>
            <textarea name="message" rows={4} placeholder={t.messagePlaceholder} className={cn(inputCls, "h-auto min-h-28 py-3 leading-relaxed")} maxLength={3000} />
          </Field>
        </>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.name} error={err("name")}>
              <input name="name" className={inputCls} autoComplete="name" aria-invalid={invalid("name")} />
            </Field>
            <Field label={t.email} error={err("email")}>
              <input name="email" type="email" className={inputCls} autoComplete="email" aria-invalid={invalid("email")} />
            </Field>
            <Field label={t.company} optional={t.optional}>
              <input name="company" className={inputCls} autoComplete="organization" />
            </Field>
            <Field label={t.subject}>
              <span className="relative block">
                <select name="subject" className={cn(inputCls, "appearance-none pr-10")}>
                  {subjects?.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </Field>
          </div>
          <Field label={t.message} error={err("message")}>
            <textarea name="message" rows={5} placeholder={t.messagePlaceholder} className={cn(inputCls, "h-auto min-h-32 py-3 leading-relaxed")} maxLength={3000} aria-invalid={invalid("message")} />
          </Field>
        </>
      )}

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-neutral-600">
          <input type="checkbox" name="consent" className="mt-1 size-4 shrink-0 rounded border-neutral-300 accent-ink" aria-invalid={invalid("consent")} />
          <span>
            {t.consent}{" "}
            <Link href={privacyHref} className="font-medium text-ink underline underline-offset-4 hover:text-brand-700">
              {privacyLabel}
            </Link>
          </span>
        </label>
        {err("consent") ? <span className="mt-1.5 block animate-fade-in pl-7 text-xs text-red-600">{err("consent")}</span> : null}
      </div>

      {formError ? (
        <p role="alert" className="animate-scale-in rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {formError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "sending"} aria-busy={status === "sending"} className="group w-full sm:w-auto">
        {status === "sending" ? <Spinner /> : null}
        {status === "sending" ? t.sending : kind === "dealer" ? t.submit : t.submitContact}
        {status !== "sending" ? <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" /> : null}
      </Button>
    </form>
  );
}
