// Regole del calendario, senza DOM: così si provano con `npm test`.
// data = risposta di /api/disponibilita: { venere: [[arrivo, partenza), ...] | null, ... }. Le date sono stringhe 'YYYY-MM-DD'.
export const add = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

// Un appartamento nelle notti [from, to): la notte della partenza non conta. Senza calendario è 'unknown', mai 'free'.
export function aptState(data, id, from, to) {
  const ranges = data?.[id];
  if (!ranges) return 'unknown';
  return ranges.some(([a, b]) => a < to && from < b) ? 'busy' : 'free';
}

// Gli appartamenti scelti divisi per stato nelle notti [from, to).
export function split(data, ids, from, to) {
  const out = { free: [], busy: [], unknown: [] };
  for (const id of ids) out[aptState(data, id, from, to)].push(id);
  return out;
}

// Una notte per tutti gli appartamenti scelti: free = tutti, booked = nessuno, partial = qualcuno occupato, unknown = da verificare.
export function dayState(data, ids, d) {
  const s = split(data, ids, d, add(d, 1));
  if (s.busy.length === ids.length) return 'booked';
  if (s.busy.length) return 'partial';
  return s.unknown.length ? 'unknown' : 'free';
}
