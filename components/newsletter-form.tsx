"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { newsletterInitialState } from "@/lib/form-state";
import { buttonClass, inputClass } from "@/components/ui";
import { cn } from "@/lib/utils";

function SubmitButton({ label, onAccent }: { label: string; onAccent?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        onAccent
          ? "ui inline-flex h-11 items-center justify-center rounded-[3px] bg-accent-solid-ink px-5 text-[0.95rem] font-medium text-accent-solid transition-opacity hover:opacity-90 disabled:opacity-50"
          : buttonClass("primary"),
        "shrink-0",
      )}
    >
      {pending ? "Un attimo…" : label}
    </button>
  );
}

export function NewsletterForm({
  source = "sito",
  label = "Iscrivimi",
  stacked = false,
  onAccent = false,
}: {
  source?: string;
  label?: string;
  stacked?: boolean;
  /** Il modulo vive sopra il fondo oxblood: il pulsante si inverte e il testo si schiarisce. */
  onAccent?: boolean;
}) {
  const [state, formAction] = useActionState(subscribeToNewsletter, newsletterInitialState);

  if (state.status === "success" || state.status === "already") {
    return (
      <p
        role="status"
        className={cn(
          "ui px-4 py-3 text-[0.9rem] leading-relaxed",
          onAccent
            ? "border border-accent-solid-ink/35 text-accent-solid-ink"
            : "border border-accent/40 bg-accent-wash text-ink",
        )}
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="source" value={source} />

      <div className={cn("flex gap-2", stacked ? "flex-col" : "flex-col sm:flex-row")}>
        <label htmlFor={`email-${source}`} className="sr-only">
          Indirizzo email
        </label>
        <input
          id={`email-${source}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="nome@studio.it"
          aria-invalid={state.status === "error"}
          className={cn(
            inputClass,
            onAccent && "border-transparent",
            state.status === "error" && "border-danger",
          )}
        />
        <SubmitButton label={label} onAccent={onAccent} />
      </div>

      {/* Honeypot: invisibile alle persone, irresistibile per i bot. */}
      <input
        type="text"
        name="azienda"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <label
        className={cn(
          "ui flex items-start gap-2.5 text-[0.78rem] leading-snug",
          onAccent ? "text-accent-solid-ink/85" : "text-ink-3",
        )}
      >
        <input
          type="checkbox"
          name="consenso"
          required
          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--accent)]"
        />
        <span>
          Acconsento al trattamento dei dati per ricevere la newsletter, come descritto nella{" "}
          <Link href="/privacy" className={onAccent ? "underline underline-offset-2" : "link"}>
            privacy policy
          </Link>
          . Disiscrizione con un clic.
        </span>
      </label>

      {state.status === "error" && state.message ? (
        <p role="alert" className={cn("ui text-[0.85rem] leading-snug", onAccent ? "text-accent-solid-ink" : "text-danger")}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
