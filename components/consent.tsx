"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { buttonClass } from "@/components/ui";
import { readConsent, resetConsent, subscribeConsent, writeConsent, type ConsentRecord } from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * Lo stato del consenso letto con useSyncExternalStore: sul server è sempre
 * null, quindi il banner non finisce nell'HTML statico e non c'è disallineamento
 * in idratazione.
 */
export function useConsent(): ConsentRecord | null {
  return useSyncExternalStore(subscribeConsent, readConsent, () => null);
}

export function CookieBanner() {
  const consent = useConsent();
  if (consent) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="titolo-cookie"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-rule-strong bg-surface"
    >
      <div className="mx-auto flex w-full max-w-[68rem] flex-col gap-4 px-[var(--gutter)] py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-[62ch]">
          <h2 id="titolo-cookie" className="text-[1rem] font-semibold tracking-[-0.015em]">
            Cookie di misurazione
          </h2>
          <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-2">
            Vorremmo capire quali articoli vengono letti e dove la lettura si interrompe, usando Microsoft
            Clarity. Sono cookie non necessari: senza il tuo consenso non vengono installati e il sito funziona
            lo stesso.{" "}
            <Link href="/cookie-policy" className="link">
              Dettagli nella cookie policy
            </Link>
            .
          </p>
        </div>

        {/* Rifiutare deve costare quanto accettare: stesso posto, stesso peso. */}
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => writeConsent("rifiutato")} className={cn(buttonClass("outline"))}>
            Rifiuta
          </button>
          <button type="button" onClick={() => writeConsent("accettato")} className={cn(buttonClass("primary"))}>
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}

/** Revocare deve essere facile quanto acconsentire: da qui la scelta si riapre. */
export function CookiePreferences({ className }: { className?: string }) {
  const consent = useConsent();

  return (
    <button
      type="button"
      onClick={resetConsent}
      className={cn("ui text-left text-[0.88rem] text-ink-2 transition-colors hover:text-accent", className)}
    >
      Preferenze cookie
      {consent ? (
        <span className="meta-sm ml-2">({consent.scelta === "accettato" ? "accettati" : "rifiutati"})</span>
      ) : null}
    </button>
  );
}
