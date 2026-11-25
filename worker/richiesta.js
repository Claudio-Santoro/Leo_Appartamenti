// POST /api/richiesta: controlla il modulo e lo invia per email al gestore con Resend.
// Segreti del Worker: RESEND_KEY, MAIL_TO. Facoltativo: MAIL_FROM (dopo aver verificato il dominio su Resend).
// ponytail: antispam = campo esca, stessa origine e limite per IP; se arriva spam vero, aggiungere Turnstile.
const MAX = { nome: 120, email: 200, telefono: 40, messaggio: 4000 };
const THANKS = { it: '/grazie/', en: '/en/thanks/' };
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const it = (s) => s.split('-').reverse().join('/'); // 2027-03-01 → 01/03/2027

// Dai campi del modulo all'email, oppure null se manca o non torna qualcosa.
export function componi(form) {
  const get = (k) => String(form.get(k) ?? '').trim().slice(0, MAX[k] ?? 60);
  const nome = get('nome').replace(/\s+/g, ' '), email = get('email'), arrivo = get('arrivo'), partenza = get('partenza');
  if (!nome || !/^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/.test(email)) return null;
  if (!isDate(arrivo) || !isDate(partenza) || partenza <= arrivo || get('privacy') !== 'accettata') return null;
  const apts = form.getAll('appartamenti').map((a) => String(a).slice(0, 20)).slice(0, 5).join(', ') || 'nessuna preferenza';
  return {
    reply_to: email,
    subject: `Richiesta dal sito: ${nome}, ${it(arrivo)} → ${it(partenza)}`,
    text: [
      `Nome: ${nome}`, `Email: ${email}`, `Telefono: ${get('telefono') || '-'}`, `Appartamenti: ${apts}`,
      `Arrivo: ${it(arrivo)}`, `Partenza: ${it(partenza)}`, `Adulti: ${get('adulti') || '-'}`, `Bambini: ${get('bambini') || '0'}`,
      `Animale: ${get('animale') || 'no'}`, `Lingua: ${get('lingua') || 'it'}`, '', get('messaggio') || '(nessun messaggio)',
    ].join('\n'),
  };
}

export async function richiesta(request, env) {
  const url = new URL(request.url);
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const fail = (status, msg) => (wantsJson ? Response.json({ ok: false, msg }, { status }) : new Response(msg, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));

  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return fail(403, 'Origine non valida.');
  if (Number(request.headers.get('content-length') ?? 0) > 20_000) return fail(413, 'Richiesta troppo lunga.');
  if (env.LIMITE && !(await env.LIMITE.limit({ key: request.headers.get('cf-connecting-ip') ?? '' })).success) return fail(429, 'Troppe richieste, riprova tra un minuto.');

  const form = await request.formData().catch(() => null);
  if (!form) return fail(400, 'Modulo non valido.');
  const done = () => (wantsJson ? Response.json({ ok: true }) : Response.redirect(new URL(THANKS[form.get('lingua')] ?? THANKS.it, url), 303));
  if (form.get('bot-field')) return done(); // un bot: si risponde come se fosse andata

  const mail = componi(form);
  if (!mail) return fail(400, 'Controlla nome, email, date e consenso privacy.');
  if (!env.RESEND_KEY || !env.MAIL_TO) { console.error('RESEND_KEY o MAIL_TO mancanti'); return fail(503, 'Invio non configurato.'); }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.MAIL_FROM || 'LEO Appartamenti <onboarding@resend.dev>', to: env.MAIL_TO, ...mail }),
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) return done();
    console.error('Resend', r.status, await r.text());
  } catch (e) { console.error('Resend', e); }
  return fail(502, 'Invio non riuscito, riprova o scrivici su WhatsApp.');
}
