"use client";

import { cn } from "@/lib/utils";

type Check = { label: string; ok: boolean; hint: string };

/**
 * Controlli SEO calcolati mentre scrivi. Non sono regole assolute: sono i
 * segnali che, sui contenuti professionali, spostano davvero il posizionamento.
 */
export function SeoCheck({
  title,
  slug,
  seoTitle,
  seoDescription,
  keyword,
  content,
  excerpt,
}: {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  keyword: string;
  content: string;
  excerpt: string;
}) {
  const key = keyword.trim().toLowerCase();
  const body = content.toLowerCase();
  const words = content.split(/\s+/).filter(Boolean).length;
  const headings = (content.match(/^##\s+/gm) ?? []).length;
  const internalLinks = (content.match(/\]\(\//g) ?? []).length;
  const firstBlock = body.slice(0, 400);
  const effectiveTitle = (seoTitle || title).trim();
  const occurrences = key ? (body.match(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length : 0;
  const density = words ? (occurrences / words) * 100 : 0;

  const checks: Check[] = [
    {
      label: "Keyword impostata",
      ok: key.length > 2,
      hint: "Scegli la ricerca esatta che vuoi intercettare, non un tema generico.",
    },
    {
      label: "Keyword nel titolo",
      ok: Boolean(key) && effectiveTitle.toLowerCase().includes(key),
      hint: "Deve comparire nel titolo SEO, meglio se nella prima metà.",
    },
    {
      label: "Keyword nello slug",
      ok: Boolean(key) && slug.includes(key.replace(/\s+/g, "-")),
      hint: "L'URL è uno dei pochi segnali che non puoi cambiare senza costi.",
    },
    {
      label: "Keyword nelle prime righe",
      ok: Boolean(key) && firstBlock.includes(key),
      hint: "Chi legge (e chi indicizza) deve capire subito di cosa si parla.",
    },
    {
      label: `Titolo SEO 40-60 caratteri (${effectiveTitle.length})`,
      ok: effectiveTitle.length >= 40 && effectiveTitle.length <= 62,
      hint: "Oltre i 62 caratteri Google lo taglia in risultati.",
    },
    {
      label: `Meta description 120-158 caratteri (${seoDescription.length})`,
      ok: seoDescription.length >= 120 && seoDescription.length <= 158,
      hint: "È il testo che convince a cliccare: promettere un risultato funziona meglio che riassumere.",
    },
    {
      label: "Sommario compilato",
      ok: excerpt.trim().length > 60,
      hint: "Compare nelle liste del blog e nelle anteprime social.",
    },
    {
      label: `Almeno 3 sezioni H2 (${headings})`,
      ok: headings >= 3,
      hint: "Le sezioni generano l'indice e permettono i sitelink nei risultati.",
    },
    {
      label: `Almeno 900 parole (${words})`,
      ok: words >= 900,
      hint: "Sui temi professionali gli articoli che posizionano sono approfonditi, non lunghi per forza.",
    },
    {
      label: `Almeno 2 link interni (${internalLinks})`,
      ok: internalLinks >= 2,
      hint: "Collega gli articoli dello stesso cluster: è il segnale che costruisce l'autorevolezza tematica.",
    },
    {
      label: `Densità keyword sotto l'1,5% (${density.toFixed(2)}%)`,
      ok: density <= 1.5,
      hint: "Ripeterla non aiuta. Usa varianti e sinonimi.",
    },
  ];

  const passed = checks.filter((check) => check.ok).length;

  return (
    <div className="rounded-md border border-rule bg-surface">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <p className="ui text-[0.82rem] font-medium text-ink">Controlli SEO</p>
        <span className="font-mono text-[0.75rem] text-ink-2 num">
          {passed}/{checks.length}
        </span>
      </div>
      <ul className="flex flex-col">
        {checks.map((check) => (
          <li key={check.label} className="group border-b border-rule px-4 py-2 last:border-b-0">
            <div className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  check.ok ? "bg-accent" : "bg-ink-faint",
                )}
              />
              <span className={cn("text-[0.83rem] leading-snug", check.ok ? "text-ink-2" : "text-ink")}>
                {check.label}
              </span>
            </div>
            {!check.ok ? <p className="mt-1 pl-4 text-[0.76rem] leading-snug text-ink-3">{check.hint}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
