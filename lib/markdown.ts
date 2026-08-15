import { marked } from "marked";
import GithubSlugger from "github-slugger";

export type TocItem = { id: string; text: string; level: number };

/** Il testo dell'indice viene stampato da React: le entità vanno riportate a carattere. */
function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

marked.setOptions({ gfm: true, breaks: false });

/**
 * Converte il Markdown dell'articolo in HTML, aggiungendo:
 * - id e ancora su ogni H2/H3 (link diretti alle sezioni, utili per i sitelink)
 * - indice dei contenuti
 * - contenitore scorrevole attorno alle tabelle, così la pagina non scorre in orizzontale
 */
export function renderMarkdown(markdown: string): { html: string; toc: TocItem[] } {
  const raw = marked.parse(markdown ?? "", { async: false }) as string;
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];

  let html = raw.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (_match, level: string, attrs: string, inner: string) => {
    const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
    const id = slugger.slug(text);
    toc.push({ id, text, level: Number(level) });
    return `<h${level} id="${id}"${attrs ?? ""}>${inner}<a class="heading-anchor" href="#${id}" aria-label="Collegamento a questa sezione">#</a></h${level}>`;
  });

  html = html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" rel="noopener" target="_blank"');

  return { html, toc };
}
