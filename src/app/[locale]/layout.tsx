import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FloatingLanguage } from "@/components/language-switcher";
import { portalLoginUrl, site } from "@/config/site";
import { LOCALES } from "@/i18n/config";
import { getPage } from "@/lib/page";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext", "greek"], variable: "--font-inter", display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#111113", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { dict } = await getPage(params);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.home.title, template: `%s · ${dict.meta.siteName}` },
    description: dict.meta.home.description,
    applicationName: dict.meta.siteName,
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale, dict } = await getPage(params);
  return (
    <html lang={locale} className={inter.variable}>
      <head>
        {/* Zonder JavaScript moet alle inhoud gewoon zichtbaar zijn */}
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink">
          {dict.nav.skip}
        </a>
        <Header locale={locale} loginUrl={portalLoginUrl(locale)} shopUrl={site.shopUrl} labels={{ login: dict.nav.login, home: dict.nav.home, consumer: dict.topbar.consumer }} />
        <main id="main">{children}</main>
        <Footer locale={locale} dict={dict} />
        <FloatingLanguage locale={locale} label={dict.nav.language} />
      </body>
    </html>
  );
}
