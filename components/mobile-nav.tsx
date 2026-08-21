"use client";

import Link from "next/link";
import { SoloAnonimi } from "@/components/auth-aware";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/lib/site";

const items = [...siteConfig.nav, { label: "Area riservata", href: "/area-riservata" as const }];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    // La classe, non uno stile inline: la media query in globals.css rilascia
    // il blocco da sé sopra i 768px, senza dipendere da un evento.
    document.body.classList.add("menu-aperto");

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // Allargando la finestra il pannello sparisce con `md:hidden`, ma lo stato
    // resterebbe aperto e lo scorrimento bloccato: stesso sintomo, altra causa.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      document.body.classList.remove("menu-aperto");
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const panel = (
    <div
      id="menu-mobile"
      className="fixed inset-x-0 bottom-0 top-[3.25rem] z-40 overflow-y-auto overscroll-contain border-t border-rule bg-paper md:hidden"
      onClick={close}
    >
      <nav className="flex min-h-full flex-col px-[var(--gutter)] py-2" aria-label="Menu">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border-b border-rule py-5 text-[1.35rem] font-medium tracking-[-0.02em] text-ink"
          >
            {item.label}
          </Link>
        ))}
        <SoloAnonimi>
          <Link href="/registrati" className="ui mt-8 self-start text-[0.95rem] text-accent underline underline-offset-4">
            Crea un account gratuito
          </Link>
        </SoloAnonimi>
      </nav>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Chiudi il menu" : "Apri il menu"}
        className="grid h-9 w-9 place-items-center rounded-[3px] text-ink transition-colors hover:bg-sunken"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M3.5 7.5h17M3.5 16.5h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {/*
        Il pannello esce dalla testata con un portale sul body.
        La testata ha `backdrop-filter`, e un elemento che lo usa diventa blocco
        contenitore per i discendenti `position: fixed`: da dentro, `bottom: 0`
        si calcolava sui 53px della barra e il menu nasceva alto 1px, invisibile,
        mentre il blocco dello scorrimento restava attivo.
      */}
      {open ? createPortal(panel, document.body) : null}
    </div>
  );
}
