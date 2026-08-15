"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { newsletterInitialState } from "@/lib/form-state";
import { buttonClass, inputClass } from "@/components/ui";
import { cn } from "@/lib/utils";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(buttonClass("primary"), "shrink-0")}>
      {pending ? "Un attimo…" : label}
    </button>
  );
}

export function NewsletterForm({
  source = "sito",
  label = "Iscrivimi",
  compact = false,
}: {
  source?: string;
  label?: string;
  compact?: boolean;
}) {
  const [state, formAction] = useActionState(subscribeToNewsletter, newsletterInitialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="source" value={source} />

      <div className={cn("flex gap-2", compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row")}>
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
          className={inputClass}
        />
        <SubmitButton label={label} />
      </div>

      {/* Honeypot: nascosto alle persone, irresistibile per i bot. */}
      <input
        type="text"
        name="azienda"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <label className="flex items-start gap-2.5 text-[0.8rem] leading-snug text-ink-soft">
        <input
          type="checkbox"
          name="consenso"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <span>
          Acconsento al trattamento dei dati per ricevere la newsletter, come descritto nella{" "}
          <Link href="/privacy" className="link-underline">
            privacy policy
          </Link>
          . Niente spam, disiscrizione con un clic.
        </span>
      </label>

      {state.status !== "idle" && state.message ? (
        <p
          role="status"
          className={cn(
            "rounded-md border px-3 py-2 text-[0.85rem] leading-snug",
            state.status === "error"
              ? "border-danger/40 text-danger"
              : "border-accent/40 bg-accent-wash text-ink",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
