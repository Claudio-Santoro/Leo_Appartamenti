// GET /api/disponibilita → { venere: [["2026-12-01","2026-12-05"], ...] | null, elimo: ..., balio: ... }
// Ogni intervallo è [arrivo, partenza): la notte della partenza è libera.
// null = calendario non collegato o non raggiungibile: il sito invita comunque a inviare la richiesta.
//
// Segreti del Worker su Cloudflare (mai nel codice, sono URL segreti):
//   ICAL_VENERE, ICAL_ELIMO, ICAL_BALIO = uno o più URL iCal separati da virgola
//   (Google Calendar del gestore + export di Booking dell'unità)

const APTS = ['venere', 'elimo', 'balio'];

const iso = (d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;

export function parseIcal(text) {
  const unfolded = text.replace(/\r?\n[ \t]/g, '');
  return unfolded.split('BEGIN:VEVENT').slice(1).flatMap((ev) => {
    ev = ev.split('END:VEVENT')[0];
    if (/^STATUS:CANCELLED/m.test(ev)) return [];
    // ponytail: prende solo la parte data; un orario in UTC ("Z") vicino a mezzanotte può spostarsi di un giorno.
    // Booking e gli eventi "tutto il giorno" di Google usano date semplici, quindi va bene così.
    const start = ev.match(/^DTSTART[^:\r\n]*:(\d{8})/m)?.[1];
    if (!start) return [];
    const end = ev.match(/^DTEND[^:\r\n]*:(\d{8})/m)?.[1];
    const s = iso(start);
    let e = end ? iso(end) : s;
    if (e <= s) e = new Date(Date.parse(s) + 864e5).toISOString().slice(0, 10); // evento senza fine: una notte
    return [[s, e]];
  });
}

async function busy(urls, today) {
  const texts = await Promise.all(urls.map(async (u) => {
    const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.text();
  }));
  return texts.flatMap(parseIcal).filter(([, e]) => e > today).sort(([a], [b]) => a.localeCompare(b));
}

export async function disponibilita(request, env, ctx) {
  // Cache di 15 minuti nel data center. Sui domini workers.dev può non funzionare: in quel caso si rilegge ogni volta, niente di rotto.
  const key = new Request(new URL('/api/disponibilita', request.url));
  const hit = await caches.default.match(key);
  if (hit) return hit;
  const today = new Date().toISOString().slice(0, 10);
  const out = {};
  await Promise.all(APTS.map(async (id) => {
    const urls = (env[`ICAL_${id.toUpperCase()}`] || '').split(',').map((s) => s.trim()).filter(Boolean);
    // Se anche un solo calendario non risponde restituisce null: mostrare libere date occupate sarebbe peggio.
    out[id] = urls.length ? await busy(urls, today).catch(() => null) : null;
  }));
  const res = Response.json(out, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=900' } });
  if (!Object.values(out).includes(null)) ctx.waitUntil(caches.default.put(key, res.clone())); // un calendario caduto non resta in cache
  return res;
}
