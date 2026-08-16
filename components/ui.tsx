import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[68rem] px-[var(--gutter)]", className)}>{children}</div>;
}

/**
 * Colonna stretta per testi lunghi e pagine di servizio.
 * La larghezza è una prop e non una classe passata da fuori: due utility
 * `max-w-*` sullo stesso elemento si risolvono per ordine nel foglio di
 * stile, non per ordine nell'attributo, e la vincente diventa imprevedibile.
 */
export function Column({
  children,
  className,
  width = "reading",
}: {
  children: ReactNode;
  className?: string;
  width?: "reading" | "form";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--gutter)]",
        width === "form" ? "max-w-[27rem]" : "max-w-[46rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

const variants = {
  primary: "bg-accent-solid text-accent-solid-ink hover:bg-accent-solid-hover border border-transparent",
  outline: "border border-rule-strong text-ink hover:border-ink hover:bg-surface",
  ghost: "border border-transparent text-ink-2 hover:text-ink hover:bg-sunken",
} as const;

const sizes = {
  md: "h-11 px-5 text-[0.95rem]",
  sm: "h-9 px-3.5 text-[0.875rem]",
} as const;

export function buttonClass(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md") {
  return cn(
    "ui inline-flex items-center justify-center gap-2 rounded-[3px] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof variants; size?: keyof typeof sizes }) {
  return <button className={cn(buttonClass(variant, size), className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof variants; size?: keyof typeof sizes }) {
  return <Link className={cn(buttonClass(variant, size), className)} {...props} />;
}

/** Contenitore con filetto. Usato per moduli e blocchi di servizio, mai come impalcatura di pagina. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[4px] border border-rule bg-surface", className)}>{children}</div>;
}

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "error" | "success";
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    info: "border-rule bg-surface text-ink-2",
    warning: "border-rule-strong bg-sunken text-ink",
    error: "border-danger/45 text-ink",
    success: "border-accent/40 bg-accent-wash text-ink",
  } as const;

  return (
    <div className={cn("ui rounded-[4px] border px-4 py-3 text-[0.88rem] leading-relaxed", tones[tone])}>
      {title ? <p className="mb-1 font-semibold text-ink">{title}</p> : null}
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="ui text-[0.82rem] font-medium text-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="ui text-[0.78rem] leading-snug text-ink-3">{hint}</p> : null}
    </div>
  );
}

export const inputClass =
  "ui w-full rounded-[3px] border border-rule-strong bg-surface px-3 py-2.5 text-[0.95rem] text-ink transition-colors focus:border-accent focus:outline-none focus-visible:outline-none";

/** Titolo di sezione: il titolo porta il proprio peso, senza etichetta sopra. */
export function SectionHead({
  title,
  intro,
  action,
  className,
}: {
  title: string;
  intro?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-3", className)}>
      <div className="max-w-2xl">
        <h2 className="t-h2">{title}</h2>
        {intro ? <p className="t-deck mt-3">{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}
