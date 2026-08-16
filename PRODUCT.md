# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Commercialisti italiani. Il sito parla da professionista a professionista: il lettore esercita, ha scadenze,
e valuta in pochi secondi se un contenuto gli farà risparmiare tempo o gli farà perdere tempo.

Il lavoro che sta facendo quando arriva: capire se e come usare l'intelligenza artificiale in un'attività
concreta di studio, senza esporsi su dati dei clienti e responsabilità professionale.

Le copie già scritte nominano anche revisori e consulenti del lavoro come destinatari adiacenti: è
un'estensione plausibile ma non confermata dall'utente.

## Product Purpose

Progetto editoriale: insegnare ai commercialisti italiani a usare l'AI nel lavoro quotidiano di studio.

Il successo si misura in pubblico e iscritti alla newsletter. **Non c'è nessuna offerta commerciale**:
niente corsi, consulenze, abbonamenti o listini. L'eventuale monetizzazione è una decisione rinviata,
e finché resta tale il sito non deve comportarsi come un funnel di vendita.

## Positioning

Contenuti che nascono da attività reali di studio e che dichiarano anche i limiti: dove il modello sbaglia,
cosa non funziona, quanto tempo si recupera davvero. La differenza rispetto alla pubblicistica generalista
sul tema è la specificità dell'adempimento, non l'ampiezza.

**Vincolo aperto:** la firma e le credenziali dell'autore sono una decisione non presa. Nessuna pagina può
affermare qualifiche professionali, iscrizioni ad albi o titoli finché l'utente non li conferma. Il
posizionamento va costruito sul lavoro mostrato, non sul titolo.

## Operating Context

Le attività di studio ricorrenti su cui il progetto lavora, già presenti nei contenuti: commenti di nota
integrativa, riscrittura delle comunicazioni dell'Agenzia per il cliente, sintesi di contratti e statuti,
estrazione dati da PDF non strutturati (visure, locazioni, estratti conto), corrispondenza ricorrente.

I vincoli professionali che ogni contenuto operativo deve rispettare: segreto professionale, GDPR
(il professionista è titolare del trattamento), AI Act per la posizione di utilizzatore.

## Capabilities and Constraints

- Blog pubblico con categorie, archivi paginati e pagine autore; sistema multi-autore già implementato
- Area riservata gratuita con registrazione; risorse scaricabili da bucket privato tramite link firmati a 60 secondi
- Newsletter con double opt-in completo a livello dati; l'invio email richiede un provider non ancora collegato
- Pannello di amministrazione per articoli (editor Markdown con campi SEO), risorse, iscritti, autori, categorie
- Stack: Next.js 16 App Router, TypeScript, Tailwind CSS 4, Supabase (progetto `AI Studio`, eu-west-1), deploy previsto su Vercel
- Lingua unica: italiano
- Dominio non ancora registrato: `NEXT_PUBLIC_SITE_URL` usa un segnaposto
- **La ricerca organica è il canale primario.** Articoli e archivi devono restare generati staticamente e
  pienamente indicizzabili: nessuna scelta visiva può spostarli dietro a rendering client-side

## Brand Commitments

- Nome: **Studio Aumentato**
- **Nessun logo**, per richiesta esplicita dell'utente: l'identità è solo tipografica
- Accesso alle risorse gratuito, senza livelli a pagamento
- Voce: nessun hype, nessuna promessa, nessun linguaggio da convegno. Si dichiarano i limiti
- **Preferenza dichiarata per lo standard di categoria.** Messo davanti a mondi visivi distintivi,
  l'utente ha scelto due volte il versante familiare e poi la convenzione esplicita. Il lavoro futuro
  esegue la convenzione a piena fedeltà, senza ironia e senza vezzi introdotti di nascosto
- **Metro di finitura: Il Post, Stratechery, Every.** Il livello di cura di queste testate è il minimo
  su cui il risultato va giudicato
- Esiti dichiarati come fallimento: sembrare una startup tech, sembrare un blog qualunque, sembrare
  pesante e urlato

## Evidence on Hand

- I 4 articoli e le 4 risorse oggi a database sono **segnaposto scritti da Claude**, non contenuti dell'utente
- **I file scaricabili non esistono**: nel database ci sono solo i metadati (nome file e dimensione)
- La biografia autore a database dichiara l'iscrizione all'Ordine: **testo segnaposto non confermato**, da
  neutralizzare prima di qualsiasi pubblicazione
- Al lancio esisteranno uno o due articoli reali e nessuna risorsa
- Nessuna testimonianza, nessun cliente citabile, nessun dato di pubblico. Da non inventare in nessuna forma

## Product Principles

1. **Lo stato quasi vuoto è la condizione di lancio, non un'eccezione.** Un articolo solo deve sembrare una
   scelta editoriale, mai un sito abbandonato.
2. **Nessuna affermazione non verificata.** Né credenziali, né conteggi di contenuti, né risultati, né prove sociali.
3. **La lettura è il prodotto.** Tutto il resto serve a portarci dentro o a proseguirla.
4. **L'iscrizione è l'unica conversione che conta**, e va guadagnata dopo aver dato valore, non prima.
5. **L'indicizzabilità non è negoziabile.** Se una scelta visiva costa posizionamento organico, si cambia la
   scelta visiva.
