"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const items = [...siteConfig.nav, { label: "Area riservata", href: "/area-riservata" as const }];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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

      {open ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 bottom-0 top-[3.25rem] z-40 overflow-y-auto border-t border-rule bg-paper"
        >
          <nav className="flex flex-col px-[var(--gutter)] py-2" onClick={close}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-rule py-5 text-[1.35rem] font-medium tracking-[-0.02em] text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/registrati" className="ui mt-8 text-[0.95rem] text-accent underline underline-offset-4">
              Crea un account gratuito
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
