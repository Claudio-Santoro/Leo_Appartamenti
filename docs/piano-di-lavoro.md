# Piano di lavoro – Sito LEO Appartamenti (Erice)

> Fa riferimento a `analisi-funzionale.md`. I valori `[[…]]` sono segnaposto da sostituire quando il cliente fornisce i dati.

## 1. Decisioni tecniche

| Tema | Scelta | Perché |
|---|---|---|
| Generatore del sito | **Astro** (sito statico) | IT/EN senza duplicare le pagine, contenuti in file Markdown/JSON, nessun server da mantenere |
| Hosting | **Netlify** (piano gratuito) | Include form e funzioni serverless, quindi niente backend |
| Form di richiesta | Netlify Forms + email al gestore | Gratis fino a 100 invii al mese |
| WhatsApp | Link `wa.me` con messaggio precompilato | Nessuna API |
| Disponibilità | Calendario proprio + sincronizzazione iCal (§2) | Indipendenza da Booking |
| Mappe | Google Maps incorporata, caricata dopo il consenso ai cookie | GDPR |
| Statistiche | Plausible o Netlify Analytics (senza cookie) | Nessun banner per le statistiche |

## 2. Calendario indipendente da Booking

### Come funziona
```
┌──────────────────────────┐    iCal (import)    ┌──────────────┐
│ Google Calendar del      │ ──────────────────▶ │   Booking    │
│ gestore, 1 per           │ ◀────────────────── │  (1 calendario│
│ appartamento:            │    iCal (export)    │  per unità)  │
│ Venere / Elimo / Balio   │                     └──────────────┘
│ (prenotazioni dirette)   │
└──────────┬───────────────┘
           │ iCal privato             ┌─────────── Booking export iCal
           ▼                          ▼
   ┌───────────────────────────────────────┐
   │ Funzione Netlify /api/disponibilita   │  unisce i calendari, cache 15 minuti
   │ (gli URL iCal restano segreti, nelle  │
   │  variabili d'ambiente)                │
   └──────────────────┬────────────────────┘
                      ▼ JSON {venere:[[da,a],…], elimo:…, balio:…}
              Calendario sul sito (giorni occupati)
```

- **Il riferimento è il calendario del gestore** (Google Calendar, gratis), non Booking. Se un giorno si lascia Booking, il calendario e il sito continuano a funzionare.
- **Prenotazione diretta**: l'ospite invia la richiesta, il gestore conferma e crea l'evento su Google Calendar. Booking chiude quelle date alla sincronizzazione successiva.
- **Prenotazione da Booking**: la funzione la legge dall'export iCal di Booking e il sito mostra le date come occupate.
- Airbnb o altri portali, se ci sono, si collegano allo stesso modo con import ed export iCal.

### Limite noto
La sincronizzazione iCal **non è in tempo reale**: Booking aggiorna i calendari esterni ogni qualche ora. Per questo il sito raccoglie **richieste** e non conferme immediate: il gestore controlla prima di confermare, e il rischio di doppia prenotazione resta sotto controllo.
**Quando passare a un channel manager** (Smoobu, Beds24, Krossbooking; circa 20–40 € al mese, sincronizzazione via API quasi istantanea): se si vuole la prenotazione con pagamento immediato o se le prenotazioni dirette diventano molte.

### Configurazione (lato gestore, circa 1 ora)
1. Creare su Google Calendar 3 calendari: "LEO – Venere", "LEO – Elimo", "LEO – Balio"
2. Per ognuno, copiare l'"indirizzo segreto in formato iCal" e incollarlo in Booking → Extranet → Tariffe e disponibilità → Sincronizza calendari → Importa
3. Da Booking, copiare il link di **export** di ogni unità e darlo allo sviluppatore (va nelle variabili d'ambiente di Netlify, mai nel codice)

## 3. Contenuti con segnaposto

`src/data/appartamenti.json` (unico file che il gestore aggiorna per prezzi e dati):
```json
[
  {
    "id": "venere",
    "nome": "Venere",
    "mq": 90,
    "ospiti": 7,
    "letti": "2 letti grandi + divano letto",
    "camino": true,
    "cin": "[[IT081008C2…]]",
    "prezzi": {
      "bassa":  "[[€ XX]]",
      "media":  "[[€ XX]]",
      "alta":   "[[€ XX]]",
      "picco":  "[[€ XX]]"
    }
  },
  { "id": "elimo", "nome": "Elimo", "mq": 45, "ospiti": 4, "letti": "1 matrimoniale + divano letto", "cin": "[[…]]", "prezzi": "[[…]]" },
  { "id": "balio", "nome": "Balio", "mq": 45, "ospiti": 4, "letti": "1 matrimoniale + divano letto", "cin": "[[…]]", "prezzi": "[[…]]" }
]
```
Venere è l'appartamento al piano terra da 90 mq con camino. Elimo e Balio sono uguali, da 45 mq.
Check-in di persona dalle 15:00 alle 23:30, **flessibile su richiesta**: va messo in evidenza nel box "Prenota direttamente".

| Dato | Segnaposto per ora |
|---|---|
| Stagioni | bassa `[[nov–mar]]` · media `[[apr–giu, set–ott]]` · alta `[[lug–ago]]` · picco `[[Ferragosto, Natale–Capodanno, Pasqua]]` |
| Soggiorno minimo | `[[N notti]]` per stagione |
| Cancellazione | `[[gratuita fino a N giorni prima]]` |
| Animali, navetta | `[[€ XX]]` |
| Sconto per chi prenota direttamente | `[[X%]]` |

## 4. Fasi e attività

### Fase 1 – MVP (circa 10–12 giorni di lavoro)
| # | Attività | Giorni |
|---|---|---|
| 1.1 | Progetto Astro, IT/EN, layout responsive, colori e font | 1 |
| 1.2 | Home: foto della vista, 3 punti di forza (vista · host · auto fino alla porta), 3 appartamenti, recensioni, call to action | 1,5 |
| 1.3 | Schede Venere / Elimo / Balio + tabella di confronto (dati da `appartamenti.json`) | 1,5 |
| 1.4 | Funzione `/api/disponibilita` (lettura iCal, unione, cache) + test | 1 |
| 1.5 | Calendario sul sito (mese per mese, giorni occupati, scelta delle date) + prezzo stimato con i segnaposto | 1,5 |
| 1.6 | Form di richiesta (anche per più appartamenti insieme) + link WhatsApp precompilato | 0,5 |
| 1.7 | Come arrivare (auto e parcheggio, colonnina, funivia, bus, aeroporti, navetta) + mappa | 0,5 |
| 1.8 | FAQ, Contatti, Privacy, Cookie, Condizioni; CIN e CIR in fondo a ogni pagina | 1 |
| 1.9 | SEO: schema `LodgingBusiness`, sitemap, `hreflang`, Open Graph | 0,5 |
| 1.10 | Test su mobile, accessibilità (Lighthouse ≥ 90), dominio, messa online | 1 |

### Fase 2 – Esperienza dell'ospite (circa 5 giorni)
- Guida ospiti (`noindex`): orario di arrivo via WhatsApp, Wi-Fi, regole, raccolta differenziata, numeri utili, consigli
- Pagina "Erice e dintorni": itinerari (Saline e Mozia, San Vito e Zingaro, Egadi, Segesta) e piano B per la nebbia
- Box "Prenota direttamente", codice sconto per chi ritorna, messaggio standard dopo il soggiorno con link alla recensione su Google
- Pagine stagionali: "Erice d'inverno al caminetto", "Tutta la struttura per gruppi fino a 15 persone"

### Fase 3 – Se le prenotazioni dirette crescono
- Caparra con Stripe Payment Link, oppure passaggio a un channel manager con motore di prenotazione
- Terza lingua (DE o FR)

## 5. Dominio
Proposte (**la disponibilità va verificata** su un registrar, per esempio Aruba o Register.it):
`leoappartamenti.it` · `leoappartamentierice.it` · `leoerice.it`
Costo circa 10–15 € l'anno, collegato a Netlify (HTTPS automatico).

## 6. Costi ricorrenti
| Voce | Costo |
|---|---|
| Dominio | circa 10–15 € l'anno |
| Hosting Netlify, form, funzioni | 0 € (entro i limiti del piano gratuito) |
| Google Calendar | 0 € |
| Statistiche Plausible (facoltative) | circa 9 € al mese, oppure 0 € con Netlify Analytics di base |
| **Totale minimo** | **circa 15 € l'anno** |

## 7. Da avere prima della messa online
- [x] Abbinamento nome ↔ unità (Venere = 90 mq; Elimo e Balio = 45 mq)
- [ ] Abbinamento CIN ↔ appartamento (più avanti)
- [ ] Foto in alta risoluzione (vista, patio, camino, ogni stanza) e, se possibile, un servizio fotografico professionale
- [ ] Prezzi, soggiorno minimo e cancellazione (al posto dei segnaposto)
- [ ] 3 calendari Google creati, link di export di Booking
- [ ] Dominio registrato
- [ ] Testi di privacy e condizioni approvati dal titolare
- [ ] Profilo Google Business creato o rivendicato e collegato al sito
