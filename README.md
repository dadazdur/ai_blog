# Studio Aumentato

Sito editoriale sull'intelligenza artificiale per commercialisti: blog ottimizzato per la ricerca organica,
area riservata con risorse scaricabili e pannello di amministrazione per gestire tutto senza toccare il codice.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres + Auth + Storage) · deploy su Vercel.

---

## Avvio rapido

```bash
npm install && npm run dev
```

Il sito parte subito su <http://localhost:3000> con i contenuti dimostrativi, anche senza database.
Servono le credenziali Supabase solo per newsletter, area riservata e amministrazione.

## Stato della configurazione

Il progetto Supabase **AI Studio** (`fpiheqzelhylvblyxeoy`, regione eu-west-1) è già collegato:

- ✅ schema, funzioni, policy RLS e bucket privato applicati (`supabase/migrations/`)
- ✅ `.env.local` compilato con URL e chiave anon
- ✅ 4 articoli, 4 categorie, 1 autore e 4 risorse caricati nel database
- ⬜ `SUPABASE_SERVICE_ROLE_KEY` da incollare in `.env.local` (newsletter e seed)
- ⬜ Redirect URL da impostare su Supabase (vedi sotto)
- ⬜ Primo account da promuovere ad amministratore

### I tre passaggi che restano

**1. Chiave service role.** Supabase → *Project Settings → API Keys* → `service_role` → *Reveal*.
Incollala in `.env.local` accanto a `SUPABASE_SERVICE_ROLE_KEY=` e riavvia `npm run dev`.
Senza questa chiave l'iscrizione alla newsletter risponde con un errore: è l'unica funzione che la richiede.

**2. Redirect URL.** Supabase → *Authentication → URL Configuration*: imposta Site URL su
`http://localhost:3000` e aggiungi tra i Redirect URL `http://localhost:3000/auth/callback`
(e più avanti `https://iltuodominio.it/auth/callback`). Senza questo passaggio i link di conferma
registrazione e di recupero password non funzionano.

**3. Il tuo account admin.** Registrati su <http://localhost:3000/registrati>, poi nell'SQL Editor di Supabase:

```sql
update public.profiles set role = 'admin' where email = 'tua@email.it';
```

Da quel momento <http://localhost:3000/admin> è accessibile.

### Ripartire da zero su un altro progetto

Esegui in ordine i file di `supabase/migrations/` nell'SQL Editor, compila `.env.local` da `.env.example`,
poi carica i contenuti dimostrativi con `npm run db:seed` (richiede la chiave service role).

## Struttura

| Percorso | Cosa contiene |
| --- | --- |
| `app/` | Rotte pubbliche, area riservata (`/area-riservata`), amministrazione (`/admin`) |
| `app/actions/` | Server action: newsletter, autenticazione, salvataggi dell'admin |
| `components/` | Componenti condivisi; `components/admin/` è l'editor |
| `lib/` | Configurazione sito, accesso ai dati, SEO, Markdown, client Supabase |
| `lib/demo-content.ts` | Articoli e risorse dimostrativi (fallback e sorgente del seed) |
| `supabase/migrations/` | Schema SQL con RLS |
| `SEO-PLAYBOOK.md` | Strategia editoriale e di posizionamento |

## Cosa fa il pannello admin

- **Articoli** — editor Markdown con barra strumenti e anteprima, campi SEO dedicati (titolo, meta description,
  keyword, canonical, noindex), domande frequenti che generano il markup FAQ, controlli SEO calcolati mentre scrivi,
  bozza/pubblicato con data programmabile.
- **Risorse** — caricamento file nel bucket privato, prompt copiabili, video esterni, ordinamento e visibilità.
- **Iscritti** — newsletter (con conferma manuale se non usi un provider email) e account registrati, esportabili in CSV.
- **Autori e categorie** — le firme finiscono nei dati strutturati di ogni articolo; le categorie sono pagine indicizzabili.

Ogni salvataggio rigenera le pagine pubbliche interessate (articolo, indice, categoria, sitemap, feed).

## SEO già implementato

- Titoli, meta description e canonical per ogni pagina, con override manuale per articolo
- `sitemap.xml` dinamica (articoli, categorie, autori, pagine di archivio) e `robots.txt`
- Dati strutturati: `Organization`, `WebSite`, `BlogPosting`, `Person`, `BreadcrumbList`, `FAQPage`, `CollectionPage`
- Immagini social generate al volo (`/api/og`), coerenti con l'identità visiva
- Feed RSS completo su `/feed.xml`
- Articoli e archivi generati staticamente con rigenerazione incrementale
- Ancore automatiche sui titoli, indice dei contenuti, breadcrumb navigabili
- Header di sicurezza e area riservata esclusa dall'indicizzazione

## Email

Il double opt-in è completo a livello di dati: iscrizione → stato `pending` → link con token → stato `confirmed`.

Senza `RESEND_API_KEY` le email non partono: il link di conferma viene scritto nei log del server e puoi confermare
gli iscritti a mano da `/admin/iscritti`. Appena colleghi un provider (Resend è già integrato, altri richiedono solo
la modifica di `lib/email.ts`) il flusso diventa automatico.

## Deploy su Vercel

1. Carica il progetto su un repository Git e importalo su Vercel.
2. Aggiungi le stesse variabili di `.env.local` (con `NEXT_PUBLIC_SITE_URL` sul dominio definitivo).
3. Collega il dominio e aggiorna i Redirect URL su Supabase.
4. Invia la sitemap in Google Search Console: `https://iltuodominio.it/sitemap.xml`.

## Note

- `middleware`/`proxy.ts` rinnova la sessione a ogni richiesta e blocca `/admin` e `/area-riservata`.
  La stessa protezione è replicata a livello di database dalle policy RLS: anche una chiamata diretta all'API fallisce.
- I file dell'area riservata non sono mai raggiungibili da URL pubblico: ogni download passa da un collegamento
  firmato che scade dopo 60 secondi.
- Le pagine legali in `app/privacy` e `app/cookie-policy` contengono campi da completare con i dati del titolare.
