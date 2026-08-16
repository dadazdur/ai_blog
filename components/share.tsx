"use client";

import { useState } from "react";

export function Share({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const email = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;

  const item = "text-[0.86rem] text-ink-2 transition-colors hover:text-accent";

  return (
    <div className="ui flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="text-[0.82rem] font-semibold text-ink">Condividi</span>
      <a href={linkedin} target="_blank" rel="noopener" className={item}>
        LinkedIn
      </a>
      <a href={whatsapp} target="_blank" rel="noopener" className={item}>
        WhatsApp
      </a>
      <a href={email} className={item}>
        Email
      </a>
      <button type="button" onClick={copy} className={item}>
        {copied ? "Link copiato" : "Copia link"}
      </button>
    </div>
  );
}
