import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";

/* Ontvangt dealeraanvragen en contactberichten van de formulieren.
   - Slaat elke inzending op als één JSON-regel in data/aanvragen.jsonl (werkt op een eigen server / lokaal).
   - Stuurt de inzending optioneel door naar een webhook (LEAD_WEBHOOK_URL), bv. Slack, Make, Zapier of een eigen API.
   Op serverless hosting (Vercel) is het bestandssysteem niet blijvend: stel daar de webhook in. */

export const runtime = "nodejs";

// Op Vercel is alleen /tmp schrijfbaar (en niet blijvend): daar is LEAD_WEBHOOK_URL nodig om aanvragen te bewaren.
const DATA_FILE = process.env.VERCEL ? "/tmp/aanvragen.jsonl" : path.join(process.cwd(), "data", "aanvragen.jsonl");
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: bots vullen dit veld in; doe alsof het gelukt is.
  if (str(body.hp)) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });

  const kind = body.kind === "contact" ? "contact" : "dealer";
  const entry = {
    kind,
    locale: str(body.locale, 5),
    company: str(body.company),
    name: str(body.name),
    email: str(body.email).toLowerCase(),
    phone: str(body.phone, 60),
    country: str(body.country, 80),
    city: str(body.city, 80),
    website: str(body.website, 200),
    shopType: str(body.shopType, 30),
    subject: str(body.subject, 30),
    interest: Array.isArray(body.interest) ? body.interest.map((i) => str(i, 30)).filter(Boolean).slice(0, 8) : [],
    message: str(body.message, 3000),
    consent: body.consent === true,
  };

  const errors: Record<string, string> = {};
  const required = kind === "dealer" ? (["company", "name", "email", "country"] as const) : (["name", "email", "message"] as const);
  for (const k of required) if (!entry[k]) errors[k] = "required";
  if (entry.email && !EMAIL.test(entry.email)) errors.email = "email";
  if (!entry.consent) errors.consent = "consent";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const record = { receivedAt: new Date().toISOString(), ...entry };

  let stored = false;
  try {
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    await appendFile(DATA_FILE, JSON.stringify(record) + "\n", "utf8");
    stored = true;
  } catch (e) {
    console.error("[aanvraag] opslaan mislukt:", e);
  }

  let forwarded = false;
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record), signal: AbortSignal.timeout(8000) });
      forwarded = res.ok;
    } catch (e) {
      console.error("[aanvraag] webhook mislukt:", e);
    }
  }

  if (!stored && !forwarded) return NextResponse.json({ ok: false, error: "generic" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
