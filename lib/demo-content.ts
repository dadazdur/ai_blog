import type { Author, Category, Post, Resource } from "@/lib/types";

/**
 * Contenuti dimostrativi.
 *
 * Servono a due cose: far girare il sito prima ancora di collegare Supabase
 * (così puoi vedere il design con contenuti veri) e popolare il database
 * al primo avvio con `npm run db:seed`.
 * Quando il database è configurato e contiene articoli, questi non vengono usati.
 */

export const demoAuthors: Author[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    slug: "andrea-durante",
    name: "Andrea Durante",
    role_title: null,
    credentials: null,
    // Segnaposto: nessuna qualifica dichiarata finché non la confermi tu.
    bio: "Porta modelli linguistici dentro il lavoro quotidiano di studio: revisione bilanci, ricerca normativa, gestione della corrispondenza con i clienti. Su Le Scritture racconta solo quello che ha testato in prima persona, compresi gli errori.",
    avatar_url: null,
    linkedin_url: "https://www.linkedin.com/in/andrea-durante",
    email: "andrea@lescritture.com",
  },
];

export const demoCategories: Category[] = [
  {
    id: "c1000000-0000-4000-8000-000000000001",
    slug: "primi-passi",
    name: "Primi passi",
    description:
      "Il minimo indispensabile per partire: come funziona davvero un modello linguistico, cosa può fare in studio e cosa no, quali strumenti scegliere.",
    seo_title: "AI per commercialisti: guide per iniziare",
    seo_description:
      "Guide introduttive all'intelligenza artificiale per commercialisti: come funziona, cosa aspettarsi, come scegliere gli strumenti e partire senza sprecare tempo.",
  },
  {
    id: "c1000000-0000-4000-8000-000000000002",
    slug: "prompt-e-tecniche",
    name: "Prompt e tecniche",
    description:
      "Come si scrive una richiesta che produce un risultato utilizzabile in studio. Schemi riutilizzabili, esempi commentati, errori tipici.",
    seo_title: "Prompt per commercialisti: tecniche ed esempi",
    seo_description:
      "Prompt testati per il lavoro di studio: bilanci, ricerca normativa, corrispondenza con i clienti. Schemi pronti da copiare e adattare.",
  },
  {
    id: "c1000000-0000-4000-8000-000000000003",
    slug: "casi-duso",
    name: "Casi d'uso",
    description:
      "Attività concrete dello studio ripensate con l'AI: dalla lettura dei documenti alla nota integrativa, con tempi e risultati misurati.",
    seo_title: "Casi d'uso dell'AI nello studio commercialista",
    seo_description:
      "Applicazioni concrete dell'intelligenza artificiale in studio: estrazione dati da documenti, redazione bilanci, analisi contratti, gestione clienti.",
  },
  {
    id: "c1000000-0000-4000-8000-000000000004",
    slug: "privacy-e-normativa",
    name: "Privacy e normativa",
    description:
      "GDPR, AI Act, segreto professionale. Cosa puoi caricare su uno strumento di AI, con quali cautele e quali carte devi avere in ordine.",
    seo_title: "AI, GDPR e AI Act per lo studio professionale",
    seo_description:
      "Privacy e conformità nell'uso dell'AI in studio: dati dei clienti, GDPR, AI Act, segreto professionale e obblighi documentali.",
  },
];

const categoryBySlug = (slug: string) => demoCategories.find((category) => category.slug === slug) ?? null;
const author = demoAuthors[0];

export const demoPosts: Post[] = [
  {
    id: "b1000000-0000-4000-8000-000000000001",
    slug: "intelligenza-artificiale-per-commercialisti-da-dove-iniziare",
    title: "Intelligenza artificiale per commercialisti: da dove iniziare davvero",
    excerpt:
      "Una guida operativa in quattro passi per portare l'AI dentro lo studio partendo dalle attività che pesano di più, senza stravolgere il metodo di lavoro.",
    seo_title: "Intelligenza artificiale per commercialisti: guida per iniziare",
    seo_description:
      "Come iniziare a usare l'intelligenza artificiale in studio: quali attività scegliere per prime, quali strumenti servono, quanto tempo si recupera davvero.",
    focus_keyword: "intelligenza artificiale per commercialisti",
    status: "published",
    published_at: "2026-07-08T07:00:00.000Z",
    updated_at: "2026-07-30T07:00:00.000Z",
    created_at: "2026-07-08T07:00:00.000Z",
    category_id: categoryBySlug("primi-passi")!.id,
    author_id: author.id,
    category: categoryBySlug("primi-passi"),
    author,
    cover_url: null,
    cover_alt: null,
    canonical_url: null,
    noindex: false,
    reading_minutes: 8,
    views: 0,
    faq: [
      {
        question: "Serve un abbonamento a pagamento per usare l'AI in studio?",
        answer:
          "Per provare no, ma per lavorare sì. Le versioni gratuite hanno limiti di contesto e non offrono le garanzie contrattuali sul trattamento dei dati che servono a uno studio professionale. Un piano business per persona al mese costa meno di un'ora fatturata.",
      },
      {
        question: "L'AI può sostituire il consulente?",
        answer:
          "No, e non è la domanda utile. Un modello linguistico non si assume responsabilità professionale, non firma, non conosce il cliente. Sostituisce porzioni di lavoro ripetitivo — prima stesura, riordino, controllo incrociato — lasciando al professionista il giudizio.",
      },
      {
        question: "Quanto tempo serve per vedere un risultato?",
        answer:
          "Su una singola attività ben scelta, due settimane. Il tempo si consuma quasi tutto nel definire il formato di output che ti serve: una volta fissato quello, il guadagno è immediato e ripetibile.",
      },
    ],
    content_md: `Ogni studio che ho visto partire con l'intelligenza artificiale ha commesso lo stesso errore: ha iniziato dalla tecnologia invece che dal lavoro. Si apre ChatGPT, si fanno tre domande generiche, il risultato è mediocre e si archivia la questione come "roba che non funziona nel nostro settore".

Il problema non è lo strumento. È che nessuno userebbe mai un praticante nuovo dicendogli "fai qualcosa di utile". Gli si assegna un compito preciso, con un formato atteso e un esempio di riferimento. Con un modello linguistico vale la stessa regola.

Questa guida è il percorso che consiglio a chi parte da zero.

## Primo passo: scegli l'attività, non lo strumento

Prendi l'ultimo mese di lavoro e fai un elenco delle attività che si ripetono. Non quelle complesse: quelle **noiose e ricorrenti**. Nella maggior parte degli studi la lista somiglia a questa:

- riscrivere per il cliente in italiano comprensibile una comunicazione ricevuta dall'Agenzia
- redigere la prima stesura dei commenti della nota integrativa
- estrarre dati da documenti che arrivano in PDF, ognuno con un formato diverso
- preparare la sintesi di un contratto o di uno statuto prima di una riunione
- rispondere alla ventesima email dell'anno che chiede la stessa identica cosa

Un'attività è un buon candidato se ha tre caratteristiche: si ripete almeno una volta a settimana, il risultato è un **testo o una tabella**, e tu sai riconoscere in dieci secondi se il risultato è buono o no.

Quest'ultimo punto è il più importante. L'AI produce risposte plausibili anche quando sono sbagliate: se non hai la competenza per giudicare il risultato in modo rapido, quell'attività non va delegata.

## Secondo passo: dai al modello il contesto che daresti a un collaboratore

La differenza tra una risposta inutile e una risposta utilizzabile sta quasi sempre nel contesto. Un prompt che funziona contiene quattro elementi:

1. **Ruolo e destinatario** — chi scrive e per chi. "Scrivi come consulente fiscale a un cliente artigiano senza formazione contabile" produce un testo diverso da "prepara un promemoria tecnico per un collega".
2. **Materiale** — il documento, i dati, il testo di partenza. Incollato, non riassunto da te.
3. **Formato preciso** — lunghezza, struttura, cosa deve esserci e cosa non deve esserci.
4. **Vincoli** — "non citare norme senza che io le abbia fornite", "segnala i punti dove servono dati che non hai".

Quest'ultimo vincolo è quello che separa gli studi che si fidano dell'AI da quelli che si sono bruciati. Chiedere esplicitamente al modello di **dichiarare cosa non sa** riduce drasticamente le invenzioni.

> Il modello non sbaglia perché è stupido. Sbaglia perché ha imparato che una risposta completa vale più di una risposta incerta. Il tuo compito è invertire quell'incentivo.

## Terzo passo: fissa il formato una volta sola

Qui sta il vero guadagno di tempo, ed è la parte che quasi tutti saltano.

Quando una richiesta produce finalmente il risultato che volevi, **salvala**. Non nella cronologia della chat: in un file di testo, in una nota condivisa, in una libreria di prompt dello studio. La prossima volta cambierai solo il materiale in ingresso.

Uno studio di sei persone che lavora così arriva in pochi mesi ad avere venti o trenta schemi consolidati. È a quel punto che l'AI smette di essere un esperimento personale e diventa un metodo di studio: chiunque entri trova gli schemi già pronti e produce output coerenti con quelli di tutti gli altri.

## Quarto passo: metti per iscritto le regole sui dati

Prima di caricare qualsiasi cosa che riguardi un cliente, servono tre decisioni scritte:

- **quali dati non escono mai dallo studio** (tipicamente: dati identificativi, importi riferibili a una persona fisica, documenti coperti da segreto)
- **quali strumenti sono autorizzati** e con quale piano contrattuale
- **chi risponde** se qualcosa va storto

Non è burocrazia difensiva: è la condizione perché i collaboratori usino l'AI alla luce del sole invece che di nascosto dal proprio account personale, che è lo scenario davvero pericoloso. Nel dettaglio ne parlo nella guida su [privacy e dati dei clienti](/blog/chatgpt-dati-clienti-gdpr-studio-commercialista).

## Cosa aspettarsi nei primi tre mesi

Numeri realistici, non promesse da convegno:

| Attività | Tempo prima | Tempo dopo | Nota |
| --- | --- | --- | --- |
| Prima stesura commenti nota integrativa | 3-4 ore | 1 ora | La revisione umana resta integrale |
| Sintesi di un contratto per riunione | 45 min | 10 min | Da rileggere sempre sulle clausole critiche |
| Riscrittura comunicazione per il cliente | 20 min | 5 min | Guadagno immediato, rischio basso |
| Estrazione dati da PDF non strutturati | 2 min/doc | 15 sec/doc | Richiede controllo a campione |

Il guadagno reale non è nel singolo minuto risparmiato. È che le attività a basso valore smettono di occupare le ore in cui saresti lucido per quelle ad alto valore.

## L'errore da non fare

Non partire da un progetto di automazione totale. Gli studi che comprano una piattaforma prima di aver capito quali attività delegare finiscono per pagare un abbonamento che nessuno usa.

Parti da **un'attività, una persona, due settimane**. Misura. Poi allarga.

Se vuoi gli schemi già pronti, nell'[area riservata](/risorse) trovi la libreria di prompt divisa per attività di studio: sono gli stessi che uso io, con le note su dove tendono a sbagliare.`,
  },
  {
    id: "b1000000-0000-4000-8000-000000000002",
    slug: "prompt-per-commercialisti-esempi-pronti",
    title: "8 prompt per commercialisti che funzionano davvero (con lo schema per costruirne altri)",
    excerpt:
      "Otto richieste pronte per le attività più frequenti di studio, commentate con il motivo per cui sono scritte così e i punti dove il modello tende a sbagliare.",
    seo_title: "Prompt per commercialisti: 8 esempi pronti da usare",
    seo_description:
      "Otto prompt testati per il lavoro di studio: nota integrativa, analisi contratti, email ai clienti, ricerca normativa. Con lo schema per scriverne di nuovi.",
    focus_keyword: "prompt per commercialisti",
    status: "published",
    published_at: "2026-07-22T07:00:00.000Z",
    updated_at: "2026-07-22T07:00:00.000Z",
    created_at: "2026-07-22T07:00:00.000Z",
    category_id: categoryBySlug("prompt-e-tecniche")!.id,
    author_id: author.id,
    category: categoryBySlug("prompt-e-tecniche"),
    author,
    cover_url: null,
    cover_alt: null,
    canonical_url: null,
    noindex: false,
    reading_minutes: 7,
    views: 0,
    faq: [
      {
        question: "Posso incollare questi prompt così come sono?",
        answer:
          "Sì, ma il risultato migliora molto se sostituisci le parti tra parentesi quadre con il contesto del tuo studio e alleghi un esempio di output che consideri corretto.",
      },
      {
        question: "Funzionano su tutti i modelli?",
        answer:
          "Lo schema sì. I modelli più recenti seguono meglio i vincoli di formato; su quelli più leggeri conviene spezzare la richiesta in due passaggi invece di chiederne uno solo complesso.",
      },
    ],
    content_md: `Un prompt non è una domanda: è una **specifica di lavoro**. Chi scrive prompt efficaci non è chi conosce parole magiche, è chi sa descrivere con precisione il risultato che vuole.

Qui sotto trovi otto schemi che uso quotidianamente. Le parti tra parentesi quadre sono quelle da sostituire.

## Lo schema di base

Prima degli esempi, la struttura che sta sotto a tutti:

\`\`\`
RUOLO: chi sei e per chi scrivi
COMPITO: cosa devi produrre, in una frase
MATERIALE: [testo, dati, documento]
FORMATO: struttura esatta dell'output
VINCOLI: cosa non fare, cosa segnalare se manca
\`\`\`

L'ordine conta meno della presenza di tutti e cinque i blocchi. Il blocco che quasi nessuno scrive — e che fa la differenza maggiore — è l'ultimo.

## 1. Tradurre una comunicazione dell'Agenzia per il cliente

\`\`\`
Sei il consulente fiscale di [tipo di cliente: piccolo imprenditore senza
formazione contabile]. Riscrivi la comunicazione qui sotto in un'email
di massimo 150 parole.

Struttura: (1) cosa è arrivato, (2) cosa significa concretamente,
(3) cosa deve fare il cliente e entro quando, (4) cosa faccio io.

Vincoli: niente sigle non spiegate, niente riferimenti normativi nel
corpo del testo, tono calmo. Se dalla comunicazione non si ricava una
scadenza certa, scrivi "[DA VERIFICARE]" invece di ipotizzarla.

COMUNICAZIONE: ---
[incolla]
---
\`\`\`

**Dove sbaglia:** tende ad ammorbidire le conseguenze. Controlla sempre che la parte (3) sia rimasta chiara sulle scadenze.

## 2. Prima stesura di un commento di nota integrativa

\`\`\`
Prepara la bozza del commento alla voce [voce] della nota integrativa
per una società [dimensione, settore], bilancio [abbreviato/ordinario].

MATERIALE: saldo esercizio corrente [x], esercizio precedente [y],
movimentazione: [dettaglio].

FORMATO: massimo 200 parole, stile impersonale, struttura
composizione della voce → variazione rispetto all'esercizio precedente
→ criterio di valutazione applicato.

VINCOLI: non citare numeri di articoli o principi contabili che non ti
ho fornito. Se un'informazione richiesta dallo schema manca nel
materiale, elencala in fondo sotto "DATI MANCANTI".
\`\`\`

**Dove sbaglia:** se non glielo vieti, cita principi contabili a memoria. Il vincolo sulle citazioni non è opzionale.

## 3. Sintesi di un contratto prima di una riunione

\`\`\`
Leggi il contratto allegato e produci una scheda di una pagina.

FORMATO: parti; oggetto in due righe; durata e rinnovo; corrispettivo
e modalità di pagamento; garanzie; clausole di recesso; foro competente;
poi una sezione "PUNTI DI ATTENZIONE" con le clausole che si discostano
dalla prassi o che espongono il cliente a un rischio.

VINCOLI: per ogni voce indica l'articolo di provenienza. Se una voce non
è presente nel contratto, scrivi "non previsto" — non dedurla.
\`\`\`

## 4. Controllo incrociato tra due documenti

\`\`\`
Confronta il documento A con il documento B ed elenca esclusivamente
le differenze in: importi, date, denominazioni, percentuali.

FORMATO: tabella con colonne Elemento | Documento A | Documento B | Tipo
di scostamento.

VINCOLI: non commentare, non interpretare. Se un elemento è presente in
un solo documento, indicalo come "assente".
\`\`\`

Questo è uno dei pochi casi in cui il modello è quasi imbattibile: la lettura comparata è esattamente ciò per cui i limiti di attenzione umana pesano di più.

## 5. Riassunto della posizione di un cliente

\`\`\`
Dai documenti allegati ricostruisci una scheda cliente: attività svolta,
forma giuridica, dimensione, regime contabile e fiscale, adempimenti
ricorrenti, criticità aperte.

FORMATO: elenco puntato, massimo 250 parole.
VINCOLI: ogni affermazione deve poter essere ricondotta a un documento;
metti tra parentesi il nome del file da cui l'hai tratta.
\`\`\`

## 6. Preparare le domande per un primo incontro

\`\`\`
Sto per incontrare un potenziale cliente che opera nel settore [settore]
con [numero] dipendenti e fatturato intorno a [importo].

Prepara 12 domande da fare al primo incontro, ordinate per priorità,
pensate per far emergere criticità fiscali e organizzative non
dichiarate spontaneamente. Per ognuna, una riga sul perché la chiedo.
\`\`\`

## 7. Rendere leggibile un'analisi di bilancio

\`\`\`
Dai seguenti indici [incolla], scrivi il commento per il titolare
dell'azienda, non per un analista.

FORMATO: tre paragrafi — cosa va bene, cosa preoccupa, cosa guardare nei
prossimi sei mesi. Massimo 300 parole.
VINCOLI: nessun tecnicismo senza spiegazione tra parentesi. Nessuna
raccomandazione di investimento o finanziamento.
\`\`\`

## 8. Trasformare una procedura in checklist

\`\`\`
Trasforma la procedura descritta qui sotto in una checklist operativa
per un collaboratore al primo anno.

FORMATO: passi numerati, ognuno con verbo all'imperativo, responsabile e
documento prodotto. In fondo, una sezione "ERRORI FREQUENTI".
VINCOLI: se un passaggio della procedura è ambiguo, non inventare:
elencalo sotto "DA CHIARIRE".
\`\`\`

## La regola che vale più di tutti gli schemi

Quando un output non ti soddisfa, la reazione istintiva è riscrivere il prompt da capo. Quasi sempre è più efficace **rispondere al modello dicendo cosa non va**: "troppo lungo, taglia del 40% eliminando le premesse" oppure "il punto 3 è generico, riscrivilo citando il dato che ti ho dato".

Due o tre correzioni mirate portano a un risultato migliore di dieci riscritture del prompt iniziale. E quando arrivi al risultato buono, chiedi al modello di **scrivere il prompt che avrebbe prodotto quel risultato al primo colpo**: quello è lo schema da salvare in libreria.

Nell'[area riservata](/risorse) trovi la libreria completa, divisa per attività, con le varianti per bilancio, contenzioso e consulenza del lavoro.`,
  },
  {
    id: "b1000000-0000-4000-8000-000000000003",
    slug: "chatgpt-dati-clienti-gdpr-studio-commercialista",
    title: "Dati dei clienti e AI: cosa puoi caricare davvero, senza farti male",
    excerpt:
      "Segreto professionale, GDPR e AI Act applicati al caso concreto: quali documenti puoi dare in pasto a un modello, con quali strumenti e quali carte devi avere in ordine.",
    seo_title: "ChatGPT e dati dei clienti: GDPR per lo studio commercialista",
    seo_description:
      "Cosa può caricare un commercialista su uno strumento di AI: segreto professionale, GDPR, AI Act, scelta del piano contrattuale e regole interne di studio.",
    focus_keyword: "chatgpt gdpr commercialisti",
    status: "published",
    published_at: "2026-08-05T07:00:00.000Z",
    updated_at: "2026-08-05T07:00:00.000Z",
    created_at: "2026-08-05T07:00:00.000Z",
    category_id: categoryBySlug("privacy-e-normativa")!.id,
    author_id: author.id,
    category: categoryBySlug("privacy-e-normativa"),
    author,
    cover_url: null,
    cover_alt: null,
    canonical_url: null,
    noindex: false,
    reading_minutes: 9,
    views: 0,
    faq: [
      {
        question: "Posso caricare un bilancio di un cliente su ChatGPT?",
        answer:
          "Dipende dal piano contrattuale e dal contenuto. Su un piano business o enterprise con esclusione dell'addestramento e un accordo sul trattamento dei dati, il rischio è gestibile. Su un account personale gratuito, no: mancano le garanzie contrattuali che il GDPR richiede al titolare del trattamento.",
      },
      {
        question: "Serve aggiornare l'informativa privacy dello studio?",
        answer:
          "Sì, se l'uso di strumenti di AI comporta il trasferimento di dati personali a un nuovo fornitore. Vanno aggiornati registro dei trattamenti, informativa e, se il fornitore è extra-UE, la base per il trasferimento.",
      },
      {
        question: "L'AI Act riguarda anche uno studio professionale?",
        answer:
          "Lo studio è quasi sempre un utilizzatore (deployer), non un fornitore, quindi gli obblighi sono molto più leggeri di quelli previsti per chi sviluppa i sistemi. Restano rilevanti gli obblighi di alfabetizzazione del personale e le regole di trasparenza verso i clienti.",
      },
    ],
    content_md: `La domanda che ricevo più spesso non è "come si usa l'AI", è "posso caricarci i documenti dei clienti?".

La risposta corretta è: dipende da tre cose, e nessuna delle tre riguarda la tecnologia. Riguardano il contratto che hai firmato con il fornitore, il tipo di dato che stai caricando e le regole che ti sei dato in studio.

> Questo articolo è una guida operativa, non un parere legale. Le valutazioni vanno calate sul singolo studio e verificate sulle fonti ufficiali.

## Il punto di partenza: tu sei il titolare del trattamento

Quando carichi il documento di un cliente su uno strumento di AI, non stai "usando un programma". Stai **trasferendo dati personali a un fornitore esterno**, che li tratta per tuo conto.

Da qui discende tutto il resto:

- ti serve un **accordo sul trattamento** con il fornitore (il DPA, ai sensi dell'art. 28 GDPR)
- il fornitore deve andare in **registro dei trattamenti** tra i responsabili
- se i dati escono dallo Spazio economico europeo serve una base valida per il trasferimento
- l'**informativa** che consegni ai clienti deve riflettere la realtà

Nessuno di questi passaggi è particolarmente oneroso. Il problema è che la maggior parte degli studi salta tutti e quattro, perché lo strumento sembra un sito qualsiasi.

## La differenza che conta: account personale o piano business

È qui che si decide quasi tutto.

Gli account personali e gratuiti dei principali strumenti sono pensati per uso individuale: tipicamente prevedono l'uso delle conversazioni per il miglioramento dei modelli e non offrono un DPA firmabile. Non sono adatti a documenti di clienti — non perché siano insicuri in senso tecnico, ma perché **mancano le garanzie giuridiche** che a te servono come titolare.

I piani business, team ed enterprise degli stessi fornitori generalmente prevedono l'esclusione dei contenuti dall'addestramento, un DPA sottoscrivibile e opzioni sulla localizzazione dei dati.

Prima di scegliere, verifica sulla documentazione del fornitore quattro punti e mettili per iscritto:

1. i contenuti che carico vengono usati per addestrare i modelli? (deve essere: no)
2. esiste un accordo sul trattamento dei dati sottoscrivibile?
3. per quanto tempo vengono conservati i contenuti e le conversazioni?
4. dove sono localizzati i server e su quale base avviene l'eventuale trasferimento extra-UE?

## Una scala pratica del rischio

Non tutti i documenti sono uguali. Questa è la scala che uso in studio.

| Livello | Cosa | Come procedo |
| --- | --- | --- |
| Verde | Testi normativi, prassi pubblica, documenti già pubblici, materiale interno senza dati di clienti | Nessun vincolo |
| Giallo | Documenti di clienti privi di dati identificativi, o resi anonimi prima del caricamento | Solo su strumenti autorizzati dallo studio |
| Arancione | Documenti di clienti con dati identificativi e importi | Solo su piano business con DPA, con annotazione nel registro |
| Rosso | Dati particolari (salute, dati giudiziari), documenti coperti da segreto istruttorio, posizioni in contenzioso penale | Mai su strumenti generalisti |

La riga più utile è la **gialla**. Una parte enorme del lavoro quotidiano — riscrivere, riassumere, controllare, strutturare — non richiede affatto che il modello sappia come si chiama il cliente. Sostituire nome, partita IVA e indirizzo con dei segnaposto prima di incollare costa dieci secondi e sposta il documento di due livelli verso il basso.

## Il segreto professionale non è la privacy

Sono due piani diversi e vanno tenuti separati. Il GDPR protegge la persona a cui i dati si riferiscono; il segreto professionale protegge il rapporto fiduciario con l'assistito e ha una sua autonoma rilevanza deontologica.

Conseguenza pratica: anche quando il trattamento è impeccabile sul piano privacy, resta la valutazione sull'opportunità di far transitare da un fornitore terzo informazioni ricevute in ragione dell'incarico. È una valutazione professionale, e va fatta prima, non dopo.

## AI Act: cosa tocca davvero a uno studio

Il Regolamento europeo sull'intelligenza artificiale si applica in modo scaglionato dalla sua entrata in vigore, con obblighi molto diversi a seconda del ruolo.

Uno studio professionale che usa strumenti di terzi è quasi sempre un **utilizzatore**, non un fornitore. Gli obblighi pesanti — valutazioni di conformità, documentazione tecnica, sistemi di gestione del rischio — riguardano chi sviluppa e immette sul mercato i sistemi.

Restano rilevanti per lo studio due aree:

- **alfabetizzazione**: chi usa questi strumenti deve avere una formazione adeguata all'uso che ne fa. Non serve un corso universitario: serve poter dimostrare di aver formato le persone
- **trasparenza**: se un contenuto destinato al cliente è generato in misura significativa da un sistema di AI, la scelta di dirlo o meno va presa consapevolmente e in modo coerente

Verifica sempre lo stato di applicazione delle singole disposizioni sulle fonti ufficiali: il calendario è scaglionato e cambia.

## Le tre carte da avere in ordine

Se domani un cliente ti chiedesse conto dell'uso dell'AI nel suo fascicolo, dovresti poter mostrare:

1. **Una policy interna di una pagina**: strumenti autorizzati, categorie di dati ammesse, cosa non esce mai dallo studio, chi autorizza le eccezioni.
2. **Il registro aggiornato**: il fornitore inserito tra i responsabili, con finalità e base del trasferimento.
3. **La traccia della formazione**: data, partecipanti, contenuti. Anche una riunione interna di un'ora, verbalizzata.

Sono tre documenti che si preparano in mezza giornata. Nell'[area riservata](/risorse) trovi il modello di policy interna e la checklist di conformità da compilare.

## Il rischio che nessuno considera

Il pericolo maggiore, nella pratica, non è il fornitore che usa male i dati. È il **collaboratore che usa il proprio account personale** perché lo studio non ha dato alternative.

Quando l'uso dell'AI viene vietato senza offrire uno strumento autorizzato, non sparisce: si sposta fuori dal perimetro di controllo dello studio, su dispositivi personali, senza tracciabilità. Dare uno strumento conforme e delle regole chiare è, prima ancora che una scelta di efficienza, una misura di sicurezza.`,
  },
  {
    id: "b1000000-0000-4000-8000-000000000004",
    slug: "estrazione-dati-documenti-ai-studio",
    title: "Far leggere i documenti all'AI: fatture, contratti e visure senza reinserire nulla a mano",
    excerpt:
      "Come impostare un flusso di estrazione dati affidabile dai PDF che arrivano in studio, con il controllo qualità che serve per fidarsi del risultato.",
    seo_title: "Estrazione dati da documenti con l'AI: guida per studi",
    seo_description:
      "Come usare l'AI per estrarre dati da fatture, contratti e visure in PDF: impostazione del flusso, formato di output, controlli di qualità e limiti reali.",
    focus_keyword: "estrazione dati documenti AI",
    status: "published",
    published_at: "2026-08-12T07:00:00.000Z",
    updated_at: "2026-08-12T07:00:00.000Z",
    created_at: "2026-08-12T07:00:00.000Z",
    category_id: categoryBySlug("casi-duso")!.id,
    author_id: author.id,
    category: categoryBySlug("casi-duso"),
    author,
    cover_url: null,
    cover_alt: null,
    canonical_url: null,
    noindex: false,
    reading_minutes: 6,
    views: 0,
    faq: [
      {
        question: "L'AI legge anche i documenti scansionati male?",
        answer:
          "Sì, i modelli multimodali recenti gestiscono scansioni storte e di bassa qualità molto meglio degli OCR tradizionali. Restano difficili i documenti scritti a mano e le tabelle con celle unite su più pagine.",
      },
      {
        question: "Quanto è affidabile l'estrazione?",
        answer:
          "Su documenti tipici di studio, con un prompt ben costruito e un formato di output rigido, l'accuratezza sui campi principali è alta ma non totale. Serve sempre un controllo a campione e un blocco esplicito sui campi che il modello non trova.",
      },
    ],
    content_md: `Il lavoro di studio è pieno di un'attività che non compare in nessun preventivo: **leggere un documento e riscrivere altrove quello che c'è dentro**. Una visura, un contratto di locazione, un estratto conto, la fattura arrivata via email invece che via SdI.

È qui che l'AI produce il guadagno più immediato, perché è esattamente il compito che le riesce meglio: trasformare un testo non strutturato in dati strutturati.

## Il principio: chiedi una struttura, non un riassunto

L'errore tipico è chiedere "dimmi cosa c'è in questo documento". Il modello risponde con un riassunto discorsivo, tu devi rileggerlo, e il tempo risparmiato è zero.

La richiesta corretta definisce **lo schema esatto** dei dati che vuoi:

\`\`\`
Estrai dal documento allegato esclusivamente i campi elencati, in formato
tabella con due colonne (campo, valore):

- denominazione locatore
- codice fiscale locatore
- denominazione conduttore
- indirizzo immobile
- foglio, particella, subalterno
- canone annuo
- data inizio, durata, rinnovo
- deposito cauzionale

Regole: se un campo non è presente nel documento scrivi NON TROVATO.
Non dedurre, non calcolare, non completare. Riporta gli importi come
sono scritti nel documento.
\`\`\`

Le tre regole finali sono la parte che rende il risultato utilizzabile. Senza di esse, il modello riempie i buchi con valori plausibili — ed è l'unico modo in cui questo flusso può farti davvero danno.

## Il campo NON TROVATO è la funzione di sicurezza

Un sistema di estrazione che restituisce sempre tutti i campi pieni non è un sistema accurato: è un sistema che ha imparato a non ammettere di non sapere.

Quando imposti il flusso in studio, tratta la comparsa di **NON TROVATO** come un segnale positivo: significa che il modello sta discriminando. I documenti che tornano con due o tre campi vuoti sono quelli da guardare a mano, ed è esattamente la ripartizione del lavoro che volevi.

## Come impostarlo in pratica, senza sviluppo

Non serve un progetto informatico per partire. Il flusso minimo è:

1. una **cartella condivisa** dove finiscono i PDF da lavorare
2. un **prompt salvato** con lo schema dei campi, uno per tipo di documento (locazioni, visure, estratti conto…)
3. un **foglio di calcolo** con le colonne già intestate come i campi
4. una regola: si incolla il risultato, non si riscrive

Con dieci documenti alla settimana questo basta. Sopra i cinquanta conviene passare a un flusso automatizzato che legge la cartella e scrive nel foglio da solo, ma è una scelta da fare dopo, quando lo schema dei campi si è stabilizzato.

## I controlli che devi tenere

Tre, e sono economici:

- **controllo a campione**: un documento su dieci verificato integralmente a mano, sempre da una persona diversa da chi ha lanciato l'estrazione
- **controlli di coerenza automatici**: sul foglio, formule che segnalano date incoerenti, importi fuori scala, codici fiscali di lunghezza sbagliata. Prendono metà giornata a impostare e catturano la maggior parte degli errori residui
- **il totale**: dove esiste un totale, ricalcolalo. È il controllo con il rapporto costo/efficacia migliore in assoluto

## Dove non funziona

Vale la pena essere netti sui limiti, perché sono prevedibili:

- **documenti scritti a mano**: risultato inaffidabile, non usare
- **tabelle che continuano su più pagine con intestazioni ripetute**: il modello tende a perdere l'allineamento delle righe; conviene spezzare il documento
- **documenti in cui l'informazione sta nella posizione grafica** (moduli con caselle, bolli, timbri): meglio un lettore specializzato
- **importi con separatori ambigui**: chiedi sempre di riportare il valore esattamente come appare, e converti tu

## Il conto economico

Su un flusso reale di studio, l'estrazione di venti campi da un contratto di locazione passa da circa dodici minuti a meno di due, controllo compreso. Su cento contratti l'anno sono venti ore.

Non è la rivoluzione che raccontano ai convegni. È esattamente il tipo di guadagno che rende sostenibile uno studio: venti ore che smettono di essere lavoro di trascrizione e tornano a essere lavoro professionale.`,
  },
];

export const demoResources: Resource[] = [
  {
    id: "e1000000-0000-4000-8000-000000000001",
    slug: "libreria-prompt-studio",
    title: "Libreria prompt per lo studio",
    description:
      "Trenta schemi di prompt divisi per attività: bilancio, contenzioso, corrispondenza con i clienti, consulenza del lavoro. Ognuno con le note sui punti in cui il modello tende a sbagliare.",
    type: "prompt",
    prompt_text: `RUOLO: sei il consulente fiscale di [tipo di cliente].
COMPITO: [cosa deve produrre, in una frase].
MATERIALE: ---
[incolla qui documento o dati]
---
FORMATO: [struttura esatta, lunghezza massima].
VINCOLI: non citare norme o principi che non ti ho fornito. Se manca
un'informazione necessaria, elencala in fondo sotto "DATI MANCANTI"
invece di ipotizzarla.`,
    external_url: null,
    file_path: null,
    file_name: null,
    file_size: null,
    published: true,
    downloads: 0,
    created_at: "2026-07-01T07:00:00.000Z",
  },
  {
    id: "e1000000-0000-4000-8000-000000000002",
    slug: "policy-interna-ai-studio",
    title: "Modello di policy interna sull'uso dell'AI",
    description:
      "Documento di due pagine da adattare e far firmare ai collaboratori: strumenti autorizzati, categorie di dati ammesse, procedura per le eccezioni, responsabilità.",
    type: "template",
    prompt_text: null,
    external_url: null,
    file_path: null,
    file_name: "policy-interna-ai-studio.docx",
    file_size: 48000,
    published: true,
    downloads: 0,
    created_at: "2026-07-10T07:00:00.000Z",
  },
  {
    id: "e1000000-0000-4000-8000-000000000003",
    slug: "checklist-conformita-ai",
    title: "Checklist di conformità: AI e dati dei clienti",
    description:
      "Le verifiche da fare prima di autorizzare uno strumento di AI in studio: contratto, DPA, registro dei trattamenti, informativa, formazione del personale.",
    type: "guida",
    prompt_text: null,
    external_url: null,
    file_path: null,
    file_name: "checklist-conformita-ai.pdf",
    file_size: 214000,
    published: true,
    downloads: 0,
    created_at: "2026-07-18T07:00:00.000Z",
  },
  {
    id: "e1000000-0000-4000-8000-000000000004",
    slug: "foglio-estrazione-dati-contratti",
    title: "Foglio di estrazione dati da contratti",
    description:
      "Foglio di calcolo con le colonne già intestate e i controlli di coerenza impostati: date incoerenti, importi fuori scala, codici fiscali di lunghezza errata.",
    type: "template",
    prompt_text: null,
    external_url: null,
    file_path: null,
    file_name: "estrazione-contratti.xlsx",
    file_size: 92000,
    published: true,
    downloads: 0,
    created_at: "2026-08-01T07:00:00.000Z",
  },
];
