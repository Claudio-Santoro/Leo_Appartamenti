import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import { componi } from '../worker/richiesta.js';

const ok = { nome: 'Anna Rossi', email: 'anna@example.com', arrivo: '2027-05-01', partenza: '2027-05-04', adulti: '2', privacy: 'accettata', lingua: 'it' };
const form = (o) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.append(k, v); return f; };
const env = { RESEND_KEY: 'chiave', MAIL_TO: 'gestore@example.com' };
const post = (o, e = env, headers = {}) => worker.fetch(new Request('https://sito.test/api/richiesta', { method: 'POST', body: form(o), headers }), e, {});
const conResend = async (status, fn) => {
  const calls = [];
  const m = mock.method(globalThis, 'fetch', async (u, i) => { calls.push({ u, ...i, body: JSON.parse(i.body) }); return new Response('{}', { status }); });
  mock.method(console, 'error', () => {});
  try { await fn(calls); } finally { m.mock.restore(); mock.restoreAll(); }
};

test('richiesta valida: email al gestore con reply_to, poi pagina di ringraziamento', () => conResend(200, async (calls) => {
  const r = await post(ok);
  assert.equal(r.status, 303); assert.equal(new URL(r.headers.get('location')).pathname, '/grazie/');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.to, env.MAIL_TO); assert.equal(calls[0].body.reply_to, ok.email); assert.match(calls[0].body.text, /Anna Rossi/);
  assert.equal(new URL((await post({ ...ok, lingua: 'en' })).headers.get('location')).pathname, '/en/thanks/');
  const j = await post(ok, env, { accept: 'application/json' });
  assert.equal(j.status, 200); assert.deepEqual(await j.json(), { ok: true });
}));

test('campi mancanti o sbagliati: 400 e nessuna email', () => conResend(200, async (calls) => {
  for (const bad of [{ nome: '' }, { email: 'non-valida' }, { email: 'a@b.it\nBcc: x@y.it' }, { partenza: '2027-05-01' }, { arrivo: 'domani' }, { privacy: '' }])
    assert.equal((await post({ ...ok, ...bad })).status, 400, JSON.stringify(bad));
  assert.equal(calls.length, 0);
}));

test('campo esca compilato: finto successo, nessuna email', () => conResend(200, async (calls) => {
  assert.equal((await post({ ...ok, 'bot-field': 'x' })).status, 303); assert.equal(calls.length, 0);
}));

test('se Resend rifiuta o non è configurato il visitatore vede un errore, mai un finto grazie', () => conResend(403, async () => {
  assert.equal((await post(ok)).status, 502);
  assert.equal((await post(ok, {})).status, 503);
}));

test('origine diversa e limite per IP', () => conResend(200, async (calls) => {
  assert.equal((await post(ok, env, { origin: 'https://altro.test' })).status, 403);
  assert.equal((await post(ok, { ...env, LIMITE: { limit: async () => ({ success: false }) } })).status, 429);
  assert.equal(calls.length, 0);
}));

test("il nome non può aggiungere righe all'oggetto", () => {
  assert.equal(componi(form({ ...ok, nome: 'Anna\r\nBcc: x' })).subject.includes('\n'), false);
});

test('altri percorsi: 404', async () => {
  assert.equal((await worker.fetch(new Request('https://sito.test/api/altro'), {}, {})).status, 404);
});
