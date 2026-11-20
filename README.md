# LEO Appartamenti – sito

Sito statico (Astro) in italiano e inglese per i 3 appartamenti a Erice. Analisi e piano di lavoro in `docs/`.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm test         # test del lettore iCal
```

## Cosa si modifica e dove
| Cosa | File |
|---|---|
| Contatti, codici CIN/CIR, voto Booking, condizioni (segnaposto `[[…]]`) | `src/data/sito.json` |
| Dati, testi e prezzi degli appartamenti | `src/data/appartamenti.json` |
| Foto | `src/assets/<venere|elimo|balio|erice>/NN-nome.jpg` (l'ordine dei nomi è l'ordine in galleria; la prima è la copertina) |
| Testi delle pagine | `src/views/*.astro` |

I segnaposto ancora da compilare appaiono sul sito evidenziati in giallo.

## Calendario
`netlify/functions/disponibilita.mjs` legge i calendari iCal e li espone su `/api/disponibilita`.
Su Netlify, in Site settings → Environment variables:
`ICAL_VENERE`, `ICAL_ELIMO`, `ICAL_BALIO` = URL iCal separati da virgola (Google Calendar del gestore + export di Booking).
Finché non sono impostate, il sito mostra "calendario non disponibile" e invita a inviare la richiesta.

## Modulo di richiesta
Netlify Forms (modulo `richiesta`). Le notifiche via email si attivano in Netlify → Forms → Form notifications.
