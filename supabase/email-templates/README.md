# Email di Supabase

Queste sono le email che manda **Supabase**, non il sito: conferma della registrazione,
reimpostazione della password, cambio indirizzo. La newsletter è un'altra cosa e vive in
`lib/email.ts`, spedita da Resend.

## 1. Prima di tutto: gli indirizzi di ritorno

*Authentication → URL Configuration*. Senza questi due campi il link nell'email riporta al
posto sbagliato, ed è la ragione per cui prima finiva su `ai-blog-…vercel.app`.

- **Site URL**: `https://www.lescritture.com`
- **Redirect URLs**, uno per riga:
  - `https://www.lescritture.com/**`
  - `http://localhost:3000/**`
  - `https://ai-blog-*-andreas-projects-df4599ea.vercel.app/**` *(solo se vuoi provare le anteprime)*

Il codice chiede già di tornare su `/auth/callback`, ma Supabase onora quella richiesta
**solo se l'indirizzo compare nella lista sopra**: altrimenti ricade sul Site URL.

## 2. I template

*Authentication → Emails → Templates*. Per ognuno incolla il file e imposta l'oggetto:

| Template Supabase | File | Oggetto da mettere |
| --- | --- | --- |
| Confirm signup | `conferma-registrazione.html` | Conferma il tuo account — Le Scritture |
| Reset password | `reimposta-password.html` | Reimposta la password — Le Scritture |
| Change email address | `cambio-email.html` | Conferma il nuovo indirizzo — Le Scritture |

Usano `{{ .ConfirmationURL }}`, la variabile che Supabase sostituisce con il link firmato.
Non rinominarla.

## 3. L'SMTP: il passaggio che quasi tutti saltano

Il servizio email incluso in Supabase è **pensato per lo sviluppo**: ha un limite di poche
email all'ora e parte da un dominio condiviso, quindi finisce in posta indesiderata con
facilità. Per un sito vero serve un SMTP proprio.

Il dominio è già a posto: `lescritture.com` risulta **verificato** in Resend, regione
`eu-west-1`, con DKIM e SPF (record MX e TXT) tutti confermati. Non serve toccare il DNS.

*Authentication → Emails → SMTP Settings*, poi attiva «Enable Custom SMTP»:

| Campo | Valore |
| --- | --- |
| Sender email | `redazione@lescritture.com` |
| Sender name | `Le Scritture` |
| Host | `smtp.resend.com` |
| Port | `465` (oppure `587`) |
| Username | `resend` |
| Password | una chiave API di Resend |

La password è letteralmente una API key di Resend. Quella esistente si chiama «Onboarding»:
se non l'hai più, creane una nuova da *Resend → API Keys* — il valore si vede **una volta
sola**, alla creazione. La stessa chiave serve anche al sito, in `RESEND_API_KEY`.

Dopo aver attivato l'SMTP proprio, alza anche il limite in *Authentication → Rate Limits*:
quello predefinito è calibrato sul servizio di sviluppo.

### Due cose da verificare

- **La casella deve esistere.** In Resend il dominio ha la ricezione disabilitata: significa
  che Resend non riceve posta per te. Se `redazione@lescritture.com` non è una casella vera
  gestita altrove, le risposte degli iscritti finiscono nel nulla.
- **Manca il DMARC.** SPF e DKIM ci sono, il DMARC no. Aggiungi in Cloudflare un record TXT
  su `_dmarc` con valore `v=DMARC1; p=none; rua=mailto:redazione@lescritture.com`. Con
  `p=none` non cambia nulla per la consegna: serve a ricevere i rapporti e a soddisfare i
  requisiti che Gmail e Outlook applicano a chi spedisce.

## 4. Come si prova

1. Registra un indirizzo vero su `/registrati`
2. L'email deve arrivare con la grafica del sito
3. Il link deve puntare a `https://www.lescritture.com/auth/callback?...`
4. Cliccandolo si atterra nell'area riservata, con la sessione attiva
