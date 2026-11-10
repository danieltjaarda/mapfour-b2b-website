import { NextResponse, type NextRequest } from "next/server";
import { negotiateLocale } from "@/i18n/config";

/** "/" stuurt door naar de taal die het best bij de browser past (anders Engels). */
export function GET(request: NextRequest) {
  const locale = negotiateLocale(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}`, request.nextUrl.origin), 307);
}
