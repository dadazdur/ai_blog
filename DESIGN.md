# Design

<!-- impeccable:design-doc 1 -->

Registrato dal costruito, non dalle intenzioni. Sorgente di verità: `app/globals.css` e `components/ui.tsx`.

## Direzione

Lo standard di categoria della pubblicazione professionale, eseguito a piena fedeltà. Scelto dall'utente
come porta di uscita dopo due tiri di direzione, con un metro di finitura dichiarato: **Il Post,
Stratechery, Every**. Nessuna ironia, nessun vezzo di contrabbando: la convenzione è l'impegno.

Il contratto di direzione vive come commento HTML nel `<body>` (`app/layout.tsx`) e sopravvive alla build
di produzione. Chiave del seme: `45ef1edb`.

## Colore

Strategia **trattenuta**: neutri più un accento, con l'accento che possiede intere regioni invece di
spargersi. Il fondo chiaro non è un default: il lettore apre il sito in ufficio o sul telefono tra due
appuntamenti, quindi la carta vince.

| Ruolo | Chiaro | Scuro |
| --- | --- | --- |
| `--paper` fondo pagina | `#f5f5f3` | `#131211` |
| `--surface` campo rialzato | `#ffffff` | `#1a1918` |
| `--sunken` campo incassato (blocchi prompt) | `#edece9` | `#201f1d` |
| `--rule` filetto | `#e2e1dd` | `#2e2c29` |
| `--rule-strong` filetto marcato, bordi campo | `#c9c7c1` | `#45423e` |
| `--ink` testo primario | `#161514` | `#edebe7` |
| `--ink-2` testo secondario | `#55534e` | `#a8a49d` |
| `--ink-3` testo terziario | `#6e6b65` | `#837f77` |
| `--accent` link, categorie, stato attivo | `#7b1e2e` | `#d98692` |
| `--accent-solid` riempimenti pieni | `#7b1e2e` | `#8e2839` |
| `--accent-solid-ink` testo sul pieno | `#ffffff` | `#fdf3f4` |
| `--accent-wash` campo tenue | `#f6eaec` | `#2a1c1f` |

L'accento è un oxblood: autorevole senza essere il blu da software né il rosso da segnale. I neutri hanno
una punta di verde-grigio, così la carta legge come carta e non come grigio di sistema.

**Due token per l'accento, non uno.** Sul fondo scuro un rosa chiaro serve al testo ma svilisce un
pulsante; `--accent-solid` resta un vino profondo con testo chiaro in entrambi i temi.

I tre stati del tema sono gestiti per intero: `:root` porta la palette chiara completa, la media query è
protetta da `:root:not([data-theme="light"])`, e `:root[data-theme="dark"]` la ridichiara perché
l'interruttore vinca nei due sensi.

## Tipografia

Tre famiglie, ognuna con un compito e nessuna sconfinante. Servite da `next/font`, con le variabili
dichiarate su `<html>` — non su `<body>`, altrimenti `--stack-*` su `:root` non le risolve e l'intera
dichiarazione diventa invalida.

- **Literata** — titoli e corpo del testo. È la voce editoriale: ha una texture vera in lettura lunga e
  regge bene l'italiano. Pesi in uso: 700 display, 600 h1/h2, 500 h3, 400 corpo, più il corsivo nelle
  citazioni.
- **Archivo** — controlli, navigazione, etichette, metadati, tabelle. Non compare mai come voce display.
- **Chivo Mono** — solo dentro `.prose pre`, dove il contenuto è letteralmente testo-macchina. Il
  monospazio non è un costume per «tecnico».

Scala fluida, tutta in `clamp()`: `.t-display` 1.95→3.9rem, `.t-h1` 1.9→3.1rem, `.t-h2` 1.45→1.95rem,
`.t-h3` 1.15→1.35rem, `.t-deck` 1.08→1.3rem. Corpo articolo 1.15rem su misura `68ch`, con `hyphens: auto`.

**I limiti di misura in `ch` vanno sull'elemento che porta la dimensione**, non sul contenitore: `ch` si
risolve sul font-size dell'elemento su cui è dichiarato.

## Impaginazione

- `Container` — 68rem, per le pagine con colonna laterale.
- `Column` — 46rem in lettura, 27rem per i moduli. La larghezza è una prop, non una classe passata da
  fuori: due utility `max-w-*` sullo stesso elemento si risolvono per ordine nel foglio di stile.
- Gronda fluida: `clamp(1.25rem, 4vw, 3rem)`.
- Home e indice: contenuto più colonna destra da 15–17rem, che collassa sotto `lg`.
- Articolo: colonna di lettura più indice da 13rem, che compare solo da `xl`.

**Nessuna card come impalcatura.** Le voci di elenco sono separate da filetti da 1px, mai racchiuse in
riquadri. L'unico blocco pieno della pagina è la colonna di iscrizione, ed è pieno perché è la regione
che l'accento possiede.

**Nessun occhiello sopra i titoli.** Il titolo porta il proprio peso; le etichette di tipo stanno sotto,
nella riga di metadati.

## Componenti

- `NewsletterPanel` — fondo `--accent-solid` a tutta colonna, spigoli vivi, pulsante invertito.
- `ArticleRow` / `LeadArticle` — riga di metadati (data · categoria · minuti), titolo, sommario; la voce
  in testata aggiunge le prime righe reali dell'articolo.
- `Notice`, `Field`, `inputClass` — bordo `--rule-strong`, raggio 3px, bordo accento al fuoco.
- Pulsanti — raggio 3px (non pillole), altezza 44/36, Archivo 500.
- `Toc` — filetto verticale da 1px con tacca accento sulla sezione attiva.

## Movimento

Un solo momento d'autore, non effetti sparsi.

- `.lede` — sequenza d'ingresso scaglionata (opacità, 0.6rem di risalita, sfocatura in uscita) su
  occhiello, titolo, sommario e firma. Curva `cubic-bezier(0.16, 1, 0.3, 1)`, 0.75s, ritardi da 70ms.
- `.read-progress` — barra di lettura legata allo scorrimento, senza JavaScript, dentro
  `@supports (animation-timeline: scroll())` così dove non è supportata resta assente invece di
  mostrarsi già piena.
- `prefers-reduced-motion` azzera entrambe e disattiva lo scorrimento morbido.

## Superfici del browser

Tematizzate, non lasciate ai default: `::selection`, `caret-color`, `accent-color`, `::placeholder`,
anello di fuoco, barra di scorrimento (`scrollbar-color` più i pseudo-elementi WebKit), e cifre tabellari
ovunque i numeri si incolonnino.

## Stato quasi vuoto

Condizione di lancio, non eccezione. Le sezioni che sarebbero vuote non vengono renderizzate: gli «altri
articoli» e il materiale operativo scompaiono se non c'è nulla da mostrare, e `/risorse` e
`/area-riservata` portano un testo scritto al posto di una griglia vuota. Nessun conteggio di inventario
in interfaccia.

## Cosa non fare

- Reintrodurre una card, un occhiello o una seconda voce display.
- Usare il monospazio fuori dai blocchi di testo-macchina.
- Dichiarare qualifiche professionali o iscrizioni ad albi finché l'utente non le conferma: non nel testo,
  non nel `<title>`, non nei dati strutturati.
- Spostare articoli e archivi dietro un rendering lato client: la ricerca organica è il canale primario.
