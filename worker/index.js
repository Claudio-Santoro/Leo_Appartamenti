// Worker di Cloudflare: i file statici li serve Cloudflare da dist/, qui arrivano solo le richieste a /api/* (wrangler.jsonc).
import { disponibilita } from './disponibilita.js';
import { richiesta } from './richiesta.js';

export default {
  fetch(request, env, ctx) {
    const route = `${request.method} ${new URL(request.url).pathname}`;
    if (route === 'GET /api/disponibilita') return disponibilita(request, env, ctx);
    if (route === 'POST /api/richiesta') return richiesta(request, env);
    return new Response('Not found', { status: 404 });
  },
};
