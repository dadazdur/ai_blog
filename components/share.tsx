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

  const itemClass = "text-[0.83rem] text-ink-soft transition-colors hover:text-accent";

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="t-label">Condividi</span>
      <a href={linkedin} target="_blank" rel="noopener" className={itemClass}>
        LinkedIn
      </a>
      <a href={whatsapp} target="_blank" rel="noopener" className={itemClass}>
        WhatsApp
      </a>
      <a href={email} className={itemClass}>
        Email
      </a>
      <button type="button" onClick={copy} className={itemClass}>
        {copied ? "Link copiato" : "Copia link"}
      </button>
    </div>
  );
}
