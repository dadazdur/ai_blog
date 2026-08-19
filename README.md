# Le Scritture

Sito editoriale sull'intelligenza artificiale per consulenti fiscali e d'impresa: blog ottimizzato per la ricerca organica,
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

Due sistemi distinti, che è utile non confondere:

| Chi la manda | Quali email | Dove si modifica |
| --- | --- | --- |
| **Il sito**, via Resend | conferma iscrizione newsletter, benvenuto | `lib/email.ts` |
| **Supabase** | conferma registrazione, reimposta password, cambio indirizzo | dashboard Supabase — vedi `supabase/email-templates/` |

I template Supabase, già impaginati con la grafica del sito, stanno in
`supabase/email-templates/` insieme alle istruzioni per incollarli e alle impostazioni di
Site URL e Redirect URL. **Quelle impostazioni sono ciò che decide dove porta il link di
conferma**: se restano sul dominio tecnico di Vercel, l'iscritto ci finisce sopra.

Il double opt-in è completo a livello di dati: iscrizione → stato `pending` → link con token → stato `confirmed`.

### La lista di spedizione

Il database resta la verità sul consenso: ha gli stati, i token e le date che il pannello admin mostra.
Resend tiene la copia operativa — i **contatti** da cui partono le newsletter, che si compongono dalla sua
dashboard. I due lati si allineano da soli in tre momenti:

| Quando | Cosa succede in Resend |
| --- | --- |
| un iscritto conferma dal link | il contatto viene creato attivo |
| qualcuno si disiscrive | il contatto viene marcato `unsubscribed` |
| un account conferma l'indirizzo | il titolare entra in lista con proprietà `origine: account` |

**Chi apre un account è iscritto alla newsletter.** Non serve un secondo opt-in perché la casella è già
dimostrata dalla conferma dell'account, e il modulo di registrazione lo dice prima di creare l'account.
La regola che il codice non viola mai: **una disiscrizione non viene mai annullata**. La funzione SQL
`subscribe_account_holder` promuove i `pending` ma lascia intatti gli `unsubscribed`, quindi né un nuovo
accesso né un rilancio dello script rimettono in lista chi se n'è andato.

Se Resend è irraggiungibile nessun flusso si interrompe: l'errore finisce nei log e il disallineamento si
recupera con

```bash
npm run newsletter:sync
```

che iscrive gli account già esistenti e riversa in Resend tutti gli iscritti. È idempotente e non tocca
i `pending`, che in una lista di spedizione non devono ancora comparire.

Senza `RESEND_API_KEY` le email non partono: il link di conferma viene scritto nei log del server e puoi confermare
gli iscritti a mano da `/admin/iscritti`. Appena colleghi un provider (Resend è già integrato, altri richiedono solo
la modifica di `lib/email.ts`) il flusso diventa automatico.

## Deploy su Vercel

Progetto: **ai-blog** (team *Andrea's projects*), collegato al repository.
Produzione: <https://lescritture.com> (il `www` reindirizza all'apex).

### Variabili d'ambiente

Da aggiungere in *Project Settings → Environment Variables*. Senza le prime due il sito online gira sui
contenuti dimostrativi: niente newsletter, niente registrazione, niente area riservata, niente admin.

| Variabile | Ambienti | Note |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | `https://fpiheqzelhylvblyxeoy.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | chiave `anon` da Supabase → API Keys |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | marcala **Sensitive**; mai in una variabile `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | — | non serve: in produzione il dominio è già nel codice |
| `RESEND_API_KEY` | Production | **serve**: senza, le email non partono e i contatti non arrivano in lista |
| `RESEND_SEGMENT_ID` | Production | facoltativa: raduna gli iscritti in un segmento Resend |

`NEXT_PUBLIC_SITE_URL` **non serve più**: in produzione `lib/site.ts` usa `PRODUCTION_URL`, cioè
`https://lescritture.com`. La variabile resta come scavalco, utile solo per uno staging su un altro
dominio. Prima si ricadeva su `VERCEL_PROJECT_PRODUCTION_URL`, che resta l'indirizzo `*.vercel.app` se il
dominio viene collegato dopo la build: canonical, sitemap e link di conferma finivano tutti lì.

### Redirect URL e email su Supabase

Istruzioni complete in `supabase/email-templates/README.md`. In sintesi, *Authentication → URL Configuration*:

- Site URL: `https://lescritture.com`
- Redirect URLs: `https://lescritture.com/**`, `https://www.lescritture.com/**` e `http://localhost:3000/**`

Il codice chiede già di tornare su `/auth/callback` col dominio giusto, ma Supabase onora quella richiesta
solo se l'indirizzo è in questa lista.

### Indicizzazione

Solo il dominio di produzione entra nell'indice. Sulle anteprime `robots.txt` risponde `Disallow: /` e ogni
pagina porta `noindex, nofollow`, così le anteprime non competono con il sito vero sulle stesse parole.
Il comportamento è deciso da `VERCEL_ENV`, che Vercel imposta da sé.

`proxy.ts` sposta con un 308 chi arriva sull'alias `*.vercel.app` del deploy di produzione, percorso e
query intatti: l'alias resta raggiungibile ma non è più un secondo indirizzo indicizzabile, e i link delle
email atterrano sul dominio vero anche se il Site URL di Supabase è impostato male. Le anteprime
(`VERCEL_ENV="preview"`) non sono toccate.

Sempre in `proxy.ts`: un `?code=` che arriva su un percorso qualsiasi viene riportato a `/auth/callback`
con `next=/area-riservata`. Serve quando Supabase scarta l'indirizzo di ritorno richiesto e recapita il
codice sulla radice, dove altrimenti andrebbe perso e l'iscritto resterebbe in home senza sessione.

Il dominio è collegato e il certificato è valido. Resta da inviare `https://lescritture.com/sitemap.xml`
a Google Search Console, dopo il primo deploy che porta online il dominio corretto nei canonical.

## Note

- `middleware`/`proxy.ts` rinnova la sessione a ogni richiesta e blocca `/admin` e `/area-riservata`.
  La stessa protezione è replicata a livello di database dalle policy RLS: anche una chiamata diretta all'API fallisce.
- I file dell'area riservata non sono mai raggiungibili da URL pubblico: ogni download passa da un collegamento
  firmato che scade dopo 60 secondi.
- Le pagine legali in `app/privacy` e `app/cookie-policy` contengono campi da completare con i dati del titolare.
