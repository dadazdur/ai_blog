import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

/** Occhiello mono: marca la sezione senza aggiungere rumore visivo. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("t-label", className)}>{children}</p>;
}

const buttonStyles = {
  primary:
    "bg-accent text-accent-contrast hover:bg-accent-hover border border-transparent",
  outline: "border border-rule-strong text-ink hover:border-ink hover:bg-surface",
  ghost: "border border-transparent text-ink-soft hover:text-ink hover:bg-surface-sunken",
} as const;

type ButtonVariant = keyof typeof buttonStyles;

const sizeStyles = {
  md: "h-11 px-5 text-[0.95rem]",
  sm: "h-9 px-3.5 text-[0.85rem]",
} as const;

export function buttonClass(variant: ButtonVariant = "primary", size: keyof typeof sizeStyles = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55",
    buttonStyles[variant],
    sizeStyles[size],
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: keyof typeof sizeStyles }) {
  return <button className={cn(buttonClass(variant, size), className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: keyof typeof sizeStyles }) {
  return <Link className={cn(buttonClass(variant, size), className)} {...props} />;
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-rule bg-surface px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-rule bg-surface", className)}>{children}</div>
  );
}

/** Riquadro di avviso usato per stati di configurazione, errore o conferma. */
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
    info: "border-rule bg-surface text-ink-soft",
    warning: "border-warning/35 bg-warning/8 text-ink",
    error: "border-danger/35 bg-danger/8 text-ink",
    success: "border-accent/35 bg-accent-wash text-ink",
  } as const;

  return (
    <div className={cn("rounded-md border px-4 py-3 text-sm leading-relaxed", tones[tone])}>
      {title ? <p className="mb-1 font-medium text-ink">{title}</p> : null}
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
      <label htmlFor={htmlFor} className="t-label">
        {label}
      </label>
      {children}
      {hint ? <p className="text-[0.78rem] leading-snug text-ink-faint">{hint}</p> : null}
    </div>
  );
}

export const inputClass =
  "w-full rounded-md border border-rule bg-surface px-3 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-none focus-visible:outline-none";
