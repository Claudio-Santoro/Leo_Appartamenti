# Analisi funzionale – Sito vetrina casa vacanze a Erice (3 appartamenti)

## 0. Dati della struttura

> Fonte: annuncio Booking ripreso da bedandbreakfast.eu e hotelmix.it (Booking blocca la lettura automatica). Novembre 2026. I punti con ⚠️ vanno confermati dal cliente.

**LEO Appartamenti con vista panoramica** – Viale Conte Pepoli 17, 91016 Erice (TP) – 38.036046, 12.584691
Gestione privata · lingue: italiano, inglese · Booking: **8,7 su 175 recensioni** (altri portali: 9,1 su 158)

| Nome | Mq | Camere / bagni | Ospiti max | Letti | Note |
|---|---|---|---|---|---|
| **Venere** (piano terra) | 90 | 2 + 1 stanza extra / 1 | **7** | 2 letti grandi + divano letto | **Camino**, ingresso indipendente, vista mare |
| **Elimo** | 45 | 2 / 1 | 4 | 1 matrimoniale + divano letto | Vista mare |
| **Balio** | 45 | 2 / 1 | 4 | 1 matrimoniale + divano letto | Vista mare; uguale a Elimo |

**In tutte le unità**: cucina, aria condizionata e riscaldamento, Wi-Fi gratuito, TV satellitare, lavatrice, patio con tavolo all'aperto, doccia e bidet. Niente colazione, niente ascensore.
**Struttura**: giardino, parcheggio sul posto e in strada, **colonnina per auto elettriche**, navetta per l'aeroporto a pagamento, non fumatori, adatta alle famiglie.
**Regole**: check-in **di persona** 15:00–23:30, **orario flessibile su richiesta** (comunicare l'orario di arrivo), check-out 08:00–11:00, animali su richiesta (possibile costo extra), bambini di ogni età, niente feste o addii al celibato/nubilato, nessuna cauzione, contanti accettati.
**Codici**: CIR 19081008C256200 · CIN IT081008C2CK6GS8ZN, IT081008C2JLZFMDZ2 *(2 CIN confermati per 3 unità; ⚠️ manca l'abbinamento CIN ↔ appartamento, che serve per le schede)*
**Distanze** ⚠️ *(stimate dai portali)*: Porta Trapani 110 m, Real Duomo 160 m, Castello di Venere circa 600 m (7 minuti a piedi), porto di Trapani 13 km, aeroporto di Trapani Birgi 30 km, aeroporto di Palermo 90 km.

**Cosa dicono le recensioni**
- 👍 **Vista** "mozzafiato" dal patio su Trapani e sul mare · **posizione** comoda ma tranquilla · **proprietari** disponibili e gentili · spazi puliti, bagni grandi · adatta a famiglie e gruppi
- 👎 Mancano pentole e padelle · in una camera ha fatto caldo (manca un condizionatore o un ventilatore) · alcuni stranieri non capiscono il bidet · a Erice si parcheggia poco · a Ferragosto c'è molta folla

**Cosa cambia rispetto alle ipotesi iniziali**
- La struttura è **appena fuori dalle mura, vicino a Porta Trapani**: c'è parcheggio e l'auto arriva alla porta, quindi il problema della ZTL non c'è. "Come arrivare" diventa più semplice.
- Si possono ospitare **fino a 15 persone** prenotando tutti e 3 gli appartamenti: un'offerta da proporre a gruppi e famiglie allargate.
- Il **camino** nell'appartamento al piano terra serve per vendere la bassa stagione: "Erice d'inverno".
- I tre punti forti sono **vista, host e posizione**: il sito deve metterli in primo piano.

**Altre ipotesi ancora valide**: clientela mista italiana e straniera, sito statico aggiornato poche volte l'anno, budget contenuto.
**Obiettivo: più prenotazioni dirette (risparmiando la commissione di Booking, circa 15–18%) e meno domande ripetitive.**

---

## 1. Analisi funzionale

### 1.1 Obiettivi e KPI

| Obiettivo | KPI | Target 12 mesi |
|---|---|---|
| Aumentare le prenotazioni dirette | % notti prenotate in diretto sul totale | dal ~5% al 25% |
| Convertire le visite in contatti | richieste (form + WhatsApp) / sessioni | ≥ 3% |
| Ridurre le domande ripetitive | messaggi "come arrivo / dove parcheggio / che codice ha la porta" per soggiorno | −50% |
| Essere trovati su Google | posizione per "appartamenti Erice", "casa vacanze Erice centro" | top 10 |
| Fidelizzare gli ospiti | ospiti che tornano o che ci mandano altri clienti | ≥ 10% |

### 1.2 Attori

| Attore | Bisogno principale |
|---|---|
| **Ospite potenziale** (inspirer) | Capire se Erice e questa struttura fanno per lui |
| **Ospite in fase di scelta** | Confrontare gli appartamenti, prezzo, disponibilità, fiducia |
| **Ospite prenotato** | Sapere come arrivare, parcheggiare, fare il check-in |
| **Ospite in soggiorno** | Wi-Fi, regole della casa, cosa fare, dove mangiare, emergenze |
| **Ex ospite** | Lasciare una recensione, tornare con lo sconto |
| **Gestore / proprietario** | Aggiornare prezzi, foto, disponibilità senza chiamare lo sviluppatore |
| **Sistemi esterni** | Channel manager / iCal delle OTA, Google Maps, meteo, WhatsApp, form-to-email |

### 1.3 Requisiti funzionali (MoSCoW)

**Must (MVP)**
- RF01 – Home con il valore della struttura in 5 secondi: foto della vista, posizione, 3 appartamenti, call to action "Verifica disponibilità"
- RF02 – Scheda per ogni appartamento: galleria, posti letto, mq, planimetria semplice, dotazioni, prezzo indicativo "da €X/notte"
- RF03 – Confronto tra i 3 appartamenti in una tabella (persone, letti, bagni, vista, terrazzo, scale, animali)
- RF04 – Disponibilità: **calendario proprio** per ogni appartamento, indipendente da Booking. Le prenotazioni dirette si registrano su un calendario del gestore; Booking legge e scrive tramite iCal; il sito mostra l'unione dei due (vedi `piano-di-lavoro.md`, §2)
- RF05 – Richiesta di prenotazione diretta: form con date, ospiti e appartamento, più link WhatsApp con messaggio già compilato
- RF06 – Pagina "Come arrivare": auto (si arriva fino alla struttura in Viale Conte Pepoli, con parcheggio e colonnina per l'auto elettrica), funivia da Trapani (con avviso che chiude con il vento) e tragitto a piedi dalla stazione di arrivo, bus AST, aeroporti di Trapani e Palermo, navetta a pagamento
- RF07 – Multilingua IT/EN
- RF08 – Note legali: CIN/codice regionale in evidenza, privacy, cookie, tassa di soggiorno, condizioni di cancellazione
- RF09 – Recensioni: estratti da Booking/Google con link alla fonte e punteggio medio
- RF10 – Mappa con la posizione e i punti di interesse vicini

**Should (fase 2)**
- RF11 – Guida digitale per l'ospite (link riservato): Wi-Fi, istruzioni di check-in, regole della casa, raccolta differenziata, numeri utili, consigli locali
- RF12 – Pagina "Cosa fare a Erice e dintorni" con itinerari di mezza giornata e di una giornata
- RF13 – Box "Perché prenotare direttamente": prezzo più basso, check-in flessibile, cortesia di benvenuto
- RF14 – Codice sconto per chi ritorna
- RF15 – Pagina FAQ (nebbia, freddo d'estate la sera, scale, culle, animali, parcheggio)

**Could (fase 3)**
- RF16 – Prenotazione con pagamento online (motore del channel manager oppure Stripe Payment Link per la caparra)
- RF17 – Check-in online: invio dei documenti prima dell'arrivo (per Alloggiati Web)
- RF18 – Meteo e webcam di Erice (utile per capire se c'è nebbia)
- RF19 – Itinerari stagionali (Natale a Erice, Settimana Santa, estate a San Vito)

**Won't (per ora)**
- Area utenti con login, blog con aggiornamenti settimanali, app, chatbot. Costano manutenzione e non portano prenotazioni in proporzione.

### 1.4 Requisiti non funzionali

| ID | Requisito | Criterio |
|---|---|---|
| RNF01 | Prestazioni su mobile | LCP < 2,5 s in 4G; immagini AVIF/WebP con `srcset` e `loading="lazy"` |
| RNF02 | Mobile first | Oltre il 70% del traffico turistico arriva da smartphone |
| RNF03 | SEO locale | Schema.org `LodgingBusiness` / `VacationRental`, profilo Google Business collegato, `hreflang` IT/EN |
| RNF04 | Accessibilità | WCAG 2.1 AA: contrasto, testo alternativo sulle foto, form utilizzabile da tastiera |
| RNF05 | GDPR | Consenso al trattamento nel form; nessun cookie di profilazione senza banner; documenti degli ospiti mai salvati sul sito |
| RNF06 | Conformità di settore | CIN visibile su ogni pagina (obbligo per gli affitti brevi) |
| RNF07 | Manutenibilità | Prezzi, testi e foto in file di contenuto (Markdown/JSON) modificabili senza toccare il codice |
| RNF08 | Costi di gestione | Hosting statico gratuito o quasi (Netlify / Cloudflare Pages / GitHub Pages) |
| RNF09 | Affidabilità | Il sito resta usabile anche se il widget di disponibilità non risponde (ripiego su form e WhatsApp) |

### 1.5 Sitemap

```
/ (Home)
├── /appartamenti
│   ├── /appartamenti/[app-1]
│   ├── /appartamenti/[app-2]
│   └── /appartamenti/[app-3]
├── /disponibilita        ← calendario + richiesta di prenotazione
├── /come-arrivare
├── /erice                ← cosa fare, itinerari, dove mangiare
├── /faq
├── /contatti
├── /guida-ospiti         ← noindex, link inviato dopo la prenotazione
└── /privacy, /cookie, /condizioni
/en/...                   ← stessa struttura in inglese
```

### 1.6 Flussi principali

1. **Dalla ricerca alla richiesta**: Google o Instagram → Home → Appartamenti (confronto) → Scheda → Disponibilità → Form o WhatsApp
2. **Da Booking al diretto** (ospite che ci ha già trovati su un'OTA e cerca il sito): Home → box "Prenota direttamente" → Disponibilità → richiesta
3. **Prima dell'arrivo**: email o WhatsApp di conferma → Guida ospiti → Come arrivare → check-in
4. **Dopo il soggiorno**: messaggio di saluto → link alla recensione su Google → codice sconto per il ritorno

---

## 2. Casi d'uso

### UC01 – Capire in fretta se Erice fa per me
| Campo | Contenuto |
|---|---|
| Attore | Ospite potenziale |
| Precondizioni | Arriva da Google o dai social, da smartphone |
| Flusso principale | 1. Apre la Home 2. Vede la foto con la vista su Trapani/Egadi e il claim con la posizione 3. Scorre fino ai 3 appartamenti 4. Legge 3 punti di forza (centro storico, vista, a piedi da tutto) 5. Tocca "Verifica disponibilità" |
| Flussi alternativi | 2a. Lingua del browser EN → reindirizzamento proposto (non forzato) alla versione inglese |
| Postcondizioni | L'utente entra nel funnel (scheda appartamento o disponibilità) |
| Valore per l'ospite | Decide in meno di 10 secondi |
| Priorità | Must |

### UC02 – Confrontare i 3 appartamenti
| Campo | Contenuto |
|---|---|
| Attore | Ospite in fase di scelta |
| Precondizioni | Ha visto la Home |
| Flusso principale | 1. Apre /appartamenti 2. Vede una tabella con persone, letti, bagni, vista, terrazzo, piano/scale, animali, prezzo "da" 3. Sceglie quello adatto 4. Apre la scheda |
| Flussi alternativi | 2a. Gruppo di 5–7 persone → appartamento al piano terra da 90 mq. 2b. Gruppo di 8–15 persone → "Prenota più appartamenti insieme" con link alla richiesta combinata |
| Postcondizioni | Appartamento scelto |
| Valore per l'ospite | Niente andirivieni tra le pagine |
| Priorità | Must |

### UC03 – Verificare la disponibilità per le mie date
| Campo | Contenuto |
|---|---|
| Attore | Ospite in fase di scelta; sistema esterno (iCal / channel manager) |
| Precondizioni | Calendari delle OTA sincronizzati |
| Flusso principale | 1. Apre /disponibilita o la sezione nella scheda 2. Vede il calendario con le date occupate 3. Seleziona arrivo e partenza 4. Il sistema mostra il prezzo stimato e il soggiorno minimo |
| Flussi alternativi | 2a. Widget non disponibile → mostra form e pulsante WhatsApp. 3a. Date occupate → propone un altro appartamento libero nelle stesse date |
| Postcondizioni | Date valide, pronte per la richiesta |
| Valore per l'ospite | Sa subito se c'è posto, senza dover chiedere |
| Priorità | Must |

### UC04 – Inviare una richiesta di prenotazione diretta
| Campo | Contenuto |
|---|---|
| Attore | Ospite in fase di scelta; gestore |
| Precondizioni | Date selezionate (UC03) |
| Flusso principale | 1. Compila il form: nome, email, telefono, date, ospiti, appartamento, note 2. Accetta l'informativa privacy 3. Invia 4. Riceve una conferma a schermo e via email ("Ti rispondiamo entro X ore") 5. Il gestore riceve email o notifica |
| Flussi alternativi | 1a. Preferisce WhatsApp → link `wa.me` con messaggio precompilato con date e appartamento. 3a. Campi non validi → errore accanto al campo |
| Postcondizioni | Richiesta registrata nella casella del gestore |
| Valore per l'ospite | Prezzo migliore rispetto alle OTA e contatto umano |
| Priorità | Must |

### UC05 – Pagare la caparra online
| Campo | Contenuto |
|---|---|
| Attore | Ospite; gestore; Stripe o motore di prenotazione |
| Precondizioni | Il gestore ha confermato la disponibilità |
| Flusso principale | 1. Il gestore invia un link di pagamento (Stripe Payment Link) 2. L'ospite paga la caparra del 30% 3. Riceve la ricevuta 4. Il gestore blocca le date sul channel manager |
| Flussi alternativi | 2a. Bonifico → IBAN nella mail di conferma |
| Postcondizioni | Prenotazione confermata, calendari aggiornati |
| Valore per l'ospite | Conferma immediata e sicura |
| Priorità | Could |

### UC06 – Capire come arrivare a Erice
| Campo | Contenuto |
|---|---|
| Attore | Ospite prenotato (o in fase di scelta, se non ha l'auto) |
| Precondizioni | Nessuna |
| Flusso principale | 1. Apre /come-arrivare 2. Sceglie il mezzo: auto, funivia, bus, aereo 3. Auto: pin di Viale Conte Pepoli 17 su Maps, "si arriva in auto fino alla porta: niente ZTL", dove parcheggiare, colonnina per l'auto elettrica 4. Funivia: orari, partenza da Trapani, tragitto a piedi fino agli appartamenti, avviso "chiude con il vento forte, alternativa: bus" |
| Flussi alternativi | 2a. Arrivo dall'aeroporto → navetta della struttura (a pagamento, da prenotare) oppure noleggio auto. 3a. Parcheggio pieno ad agosto → alternativa vicina |
| Postcondizioni | Sa come arrivare e dove lasciare l'auto |
| Valore per l'ospite | È la prima domanda di tutti gli ospiti di Erice |
| Priorità | Must |

### UC07 – Organizzare il check-in di persona
| Campo | Contenuto |
|---|---|
| Attore | Ospite prenotato; gestore |
| Precondizioni | Prenotazione confermata; link alla guida ospiti ricevuto |
| Flusso principale | 1. Pochi giorni prima riceve il link alla guida 2. Comunica l'orario di arrivo previsto (WhatsApp precompilato: "Arrivo il [data] verso le [ora]") 3. Legge dove parcheggiare e dove incontrare l'host 4. All'arrivo l'host lo accoglie, consegna le chiavi e registra i documenti |
| Flussi alternativi | 2a. Ritardo → avvisa via WhatsApp dalla guida. 2b. Arrivo fuori dall'orario 15:00–23:30 → check-in flessibile su richiesta, da concordare con l'host via WhatsApp |
| Postcondizioni | Ospite accolto, documenti raccolti per Alloggiati Web |
| Valore per l'ospite | Accoglienza di persona: è il punto più lodato nelle recensioni |
| Priorità | Should |

### UC08 – Inviare i documenti prima dell'arrivo
| Campo | Contenuto |
|---|---|
| Attore | Ospite prenotato; gestore |
| Precondizioni | Prenotazione confermata |
| Flusso principale | 1. Riceve il link al check-in online del channel manager 2. Inserisce i dati dei documenti di tutti gli ospiti 3. Il gestore li trasmette ad Alloggiati Web |
| Flussi alternativi | 2a. Non lo fa → documenti all'arrivo |
| Postcondizioni | Obbligo di registrazione assolto |
| Valore per l'ospite | Check-in più veloce. **Mai raccogliere documenti con un form fatto in casa**: si usa il servizio del channel manager |
| Priorità | Could |

### UC09 – Consultare la guida durante il soggiorno
| Campo | Contenuto |
|---|---|
| Attore | Ospite in soggiorno |
| Precondizioni | Link alla guida ospiti (pagina noindex) |
| Flusso principale | 1. Apre la guida dal telefono 2. Trova Wi-Fi, regole della casa, orari della raccolta differenziata, check-out 3. Sezioni "Mangiare" (pasticcerie con genovesi e dolci di mandorla, ristoranti consigliati), "Vedere" (Castello di Venere, Giardino del Balio, Real Duomo, mura elimo-puniche) |
| Flussi alternativi | 2a. Emergenza → numeri utili, farmacia e guardia medica più vicine |
| Postcondizioni | L'ospite risolve da solo |
| Valore per l'ospite | Tutto in una pagina, nella sua lingua |
| Priorità | Should |

### UC10 – Organizzare una gita nei dintorni
| Campo | Contenuto |
|---|---|
| Attore | Ospite prenotato o in soggiorno |
| Precondizioni | Nessuna |
| Flusso principale | 1. Apre /erice 2. Sceglie un itinerario: Saline di Trapani e Mozia, San Vito Lo Capo e Riserva dello Zingaro, Egadi da Trapani, Segesta 3. Legge tempi, mezzi e consigli 4. Apre il percorso su Maps |
| Flussi alternativi | 2a. Giornata di nebbia o pioggia → itinerario "al chiuso" (musei, cooking class, cantine di Marsala) |
| Postcondizioni | Gita organizzata |
| Valore per l'ospite | Consigli da chi vive lì; buono anche per la SEO ("cosa fare a Erice") |
| Priorità | Should |

### UC11 – Sapere che tempo fa lassù
| Campo | Contenuto |
|---|---|
| Attore | Ospite prenotato |
| Precondizioni | Nessuna |
| Flusso principale | 1. Sulla guida o in Come arrivare vede il link a meteo e webcam di Erice 2. Legge l'avviso: "Erice è a 750 m: anche d'estate di sera serve una felpa; la nebbia è frequente" |
| Flussi alternativi | — |
| Postcondizioni | Ospite preparato, niente sorprese |
| Valore per l'ospite | Evita recensioni del tipo "faceva freddo / non si vedeva niente" |
| Priorità | Could (il testo fisso nelle FAQ è un Must) |

### UC12 – Trovare risposta a un dubbio senza scrivere
| Campo | Contenuto |
|---|---|
| Attore | Ospite potenziale o prenotato |
| Precondizioni | Nessuna |
| Flusso principale | 1. Apre /faq 2. Trova la domanda (animali, culla, scale, aria condizionata, parcheggio, tassa di soggiorno, cancellazione, orario di arrivo dopo le 23:30, cos'è il bidet) 3. Legge la risposta |
| Flussi alternativi | 2a. Non la trova → pulsante WhatsApp in fondo alla pagina |
| Postcondizioni | Dubbio risolto |
| Valore per l'ospite | Risposta subito, anche di notte |
| Priorità | Should |

### UC13 – Lasciare una recensione e tornare
| Campo | Contenuto |
|---|---|
| Attore | Ex ospite; gestore |
| Precondizioni | Soggiorno concluso |
| Flusso principale | 1. Il giorno dopo il check-out riceve un messaggio di ringraziamento 2. Il link porta alla recensione su Google Business 3. Nello stesso messaggio trova un codice sconto per prenotare direttamente la prossima volta |
| Flussi alternativi | 2a. Esperienza negativa → link a un contatto privato per segnalare il problema |
| Postcondizioni | Recensione pubblicata, cliente più propenso a tornare |
| Valore per l'ospite | Sconto e rapporto diretto |
| Priorità | Should |

### UC14 – Aggiornare prezzi, foto e testi
| Campo | Contenuto |
|---|---|
| Attore | Gestore |
| Precondizioni | Accesso al repository o a un CMS leggero |
| Flusso principale | 1. Modifica il file di contenuto dell'appartamento (prezzo "da", foto, dotazioni) 2. Salva 3. Il deploy automatico pubblica il sito |
| Flussi alternativi | 1a. Disponibilità e prezzi giornalieri → si aggiornano solo sul channel manager, il sito li legge da lì |
| Postcondizioni | Sito aggiornato senza intervento dello sviluppatore |
| Valore per il gestore | Autonomia, costo di gestione nullo |
| Priorità | Must |

---

## 3. Elementi di differenziazione

| # | Idea | Impegno | Impatto |
|---|---|---|---|
| 1 | **"Prenota diretto e risparmi"**: prezzo più basso del X% rispetto alle OTA, check-in flessibile e una cortesia di benvenuto (dolci di mandorla di una pasticceria di Erice) | Basso | Alto |
| 2 | **Guida digitale per l'ospite**: una sola pagina per Wi-Fi, check-in, consigli, emergenze | Basso | Alto |
| 3 | **"Arrivi in auto fino alla porta"**: parcheggio e colonnina per l'auto elettrica, un vantaggio raro a Erice, da mettere in Home | Basso | Alto |
| 4 | **Tabella di confronto tra i 3 appartamenti** con offerta "tutta la struttura, fino a 15 persone" per gruppi e rimpatriate | Basso | Alto |
| 4b | **"Erice d'inverno al caminetto"**: pacchetto per la bassa stagione con l'appartamento al piano terra | Basso | Medio |
| 5 | **Itinerari "vista da Erice"**: dalla terrazza si vedono le Saline, le Egadi e San Vito, quindi ogni gita parte da quello che l'ospite vede | Medio | Medio |
| 6 | **Avviso onesto su nebbia e clima**: crea aspettative corrette e migliora le recensioni | Basso | Medio |
| 7 | **Pagine stagionali**: Natale nel borgo, Settimana Santa, Erice d'estate quando sotto fa caldo; buone per la SEO e per le stagioni meno piene | Medio | Medio |
| 8 | **Codice sconto per chi ritorna** nel messaggio dopo il soggiorno | Basso | Medio |

---

## 4. Roadmap

| Fase | Contenuto | Requisiti / casi d'uso |
|---|---|---|
| **MVP** (2–4 settimane) | Sito statico IT/EN: Home, schede e confronto appartamenti, disponibilità tramite widget o iCal, form e WhatsApp, Come arrivare, FAQ di base, note legali, SEO locale | RF01–RF10, RF15 · UC01–UC04, UC06, UC12, UC14 |
| **Fase 2** (1–2 mesi dopo) | Guida ospiti, pagina Erice con itinerari, box prenotazione diretta, recensioni con codice sconto | RF11–RF14 · UC07, UC09, UC10, UC13 |
| **Fase 3** (se le prenotazioni dirette crescono) | Pagamento online o motore di prenotazione, check-in online, meteo/webcam, pagine stagionali | RF16–RF19 · UC05, UC08, UC11 |

### Soluzioni più semplici consigliate
- **Sito**: HTML statico o un generatore di siti statici (Astro/Hugo) su Netlify o Cloudflare Pages, gratis
- **Disponibilità**: il widget del channel manager se ne usi già uno (Smoobu, Beds24, Krossbooking, ...); altrimenti un calendario iCal in sola lettura
- **Form**: Netlify Forms o Formspree, nessun backend
- **WhatsApp**: link `https://wa.me/<numero>?text=...`, nessuna API
- **Pagamenti**: Stripe Payment Link creato a mano dal gestore, nessuna integrazione
- **Recensioni**: estratti statici con link alla fonte, niente widget di terze parti che rallentano il sito

---

## Interventi suggeriti dalle recensioni (non riguardano il sito, ma alzano il punteggio)
- Aggiungere pentole e padelle in ogni cucina
- Mettere un ventilatore o un condizionatore nelle camere che ne sono senza
- Aggiungere al foglio di benvenuto una riga in inglese che spieghi a cosa serve il bidet

## Dati ancora mancanti
1. Foto in alta risoluzione; planimetrie
2. Airbnb o altri canali oltre a Booking
3. **Più avanti** (per ora segnaposto): prezzi per appartamento e stagione, soggiorno minimo, politica di cancellazione, costo per gli animali e per la navetta, abbinamento CIN ↔ appartamento
4. Dominio da registrare (proposte nel piano); profilo Google Business e social
6. Lingue da coprire oltre a IT/EN
