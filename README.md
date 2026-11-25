# Leo Appartamenti – sito

Sito statico (Astro) in italiano e inglese per i 3 appartamenti a Erice. Analisi e piano di lavoro in `docs/`.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm test         # test del lettore iCal e del modulo
npx wrangler dev # dopo npm run build: sito + /api/* come su Cloudflare (http://localhost:8787)
```

## Cosa si modifica e dove
| Cosa | File |
|---|---|
| Contatti, codici CIN/CIR, voto Booking, condizioni (segnaposto `[[…]]`) | `src/data/sito.json` |
| Dati, testi e prezzi degli appartamenti | `src/data/appartamenti.json` |
| Foto | `src/assets/<venere|elimo|balio|erice>/NN-nome.jpg` (l'ordine dei nomi è l'ordine in galleria; la prima è la copertina) |
| Testi delle pagine | `src/views/*.astro` |

I segnaposto ancora da compilare appaiono sul sito evidenziati in giallo.

## Pubblicazione (Cloudflare Workers)
`wrangler.jsonc`: i file di `dist/` sono serviti da Cloudflare, solo `/api/*` passa dal Worker in `worker/`.

1. Cloudflare → Workers & Pages → Create → importa questo repo da GitHub.
2. Nome del Worker `leo-appartamenti`, build command `npm run build`, deploy command `npx wrangler deploy`.
3. Finché si prova: Settings → Build → Branch control, ramo di produzione `cloudflare`. Dopo il passaggio: `main`.
4. Settings → Variables and Secrets, tipo Secret: quelli qui sotto.

## Calendario
`worker/disponibilita.js` legge i calendari iCal e li espone su `/api/disponibilita` (cache 15 minuti).
Segreti: `ICAL_VENERE`, `ICAL_ELIMO`, `ICAL_BALIO` = URL iCal separati da virgola (Google Calendar del gestore + export di Booking).
Finché non sono impostati, il sito mostra "calendario non disponibile" e invita a inviare la richiesta.

## Modulo di richiesta
`worker/richiesta.js` controlla il modulo e lo manda per email con [Resend](https://resend.com) (gratis: 100 email al giorno, 3.000 al mese).
Le richieste non sono archiviate: restano nella casella di posta (e 30 giorni su Resend). Segreti:

| Nome | Valore |
|---|---|
| `RESEND_KEY` | chiave API di Resend, permesso "Sending access" |
| `MAIL_TO` | dove arrivano le richieste. **Senza dominio verificato deve essere l'email con cui si è creato l'account Resend** |
| `MAIL_FROM` | solo dopo aver verificato il dominio su Resend, es. `Leo Appartamenti <sito@leoappartamenti.it>` |

Prima di spegnere Netlify: inviare una richiesta di prova e controllare che arrivi (anche nello spam).
