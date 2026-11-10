import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ---------- Knoppen ---------- */

export type Variant = "primary" | "secondary" | "ghost" | "light" | "outlineLight" | "brand";
export type Size = "sm" | "md" | "lg";

const base =
  "btn inline-flex items-center justify-center gap-2 whitespace-nowrap select-none font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 disabled:pointer-events-none disabled:opacity-60";
/* Knoppen zijn bewust vlak: geen gloed of schaduw. */
const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-neutral-800",
  secondary: "bg-white text-ink border border-line hover:border-neutral-300 hover:bg-neutral-50",
  ghost: "text-ink-soft hover:bg-neutral-100 hover:text-ink",
  light: "bg-white text-ink hover:bg-neutral-100",
  outlineLight: "border border-white/25 text-white hover:border-white/40 hover:bg-white/10",
  brand: "bg-brand-400 font-semibold text-ink hover:bg-brand-300",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-xl",
  md: "h-11 px-5 text-[15px] rounded-2xl",
  lg: "h-13 px-7 text-base rounded-2xl",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

/** Interne links via next/link, externe (http/mailto/tel) als gewone <a>. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode } & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  const cls = buttonClass(variant, size, className);
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

/* ---------- Layout ---------- */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>{children}</div>;
}

/* Titels staan bewust zonder labeltje erboven. */
export function SectionHeading({
  title,
  text,
  align = "left",
  tone = "dark",
  className,
  as: Tag = "h2",
}: {
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <Tag className={cn("text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-[44px]", tone === "light" ? "text-white" : "text-ink")}>{title}</Tag>
      {text ? <p className={cn("mt-4 text-pretty text-[17px] leading-relaxed", tone === "light" ? "text-white/65" : "text-neutral-600")}>{text}</p> : null}
    </div>
  );
}

export function Pill({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "brand" | "dark" | "glass"; className?: string }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700",
    brand: "bg-brand-50 text-brand-700",
    dark: "bg-ink text-white",
    glass: "bg-white/10 text-white ring-1 ring-white/15 backdrop-blur",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap", tones[tone], className)}>{children}</span>;
}
