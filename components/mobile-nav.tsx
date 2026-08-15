"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

export function MobileNav({ isAuthed, isAdmin }: { isAuthed: boolean; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Chiudi il menu" : "Apri il menu"}
        className="grid h-9 w-9 place-items-center rounded-full border border-rule text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-[57px] bottom-0 z-40 overflow-y-auto border-t border-rule bg-ground px-5 py-6">
          <nav className="flex flex-col" onClick={close}>
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-rule py-4 font-display text-2xl text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/area-riservata" className="border-b border-rule py-4 font-display text-2xl text-ink">
              Area riservata
            </Link>
            {isAdmin ? (
              <Link href="/admin" className="border-b border-rule py-4 font-display text-2xl text-ink">
                Amministrazione
              </Link>
            ) : null}
            {!isAuthed ? (
              <Link href="/registrati" className="mt-6 t-label text-accent">
                Crea un account gratuito →
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
