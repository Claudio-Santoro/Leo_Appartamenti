import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // ponytail: dominio provvisorio, aggiornare quando registrato (serve per canonical, hreflang e sitemap)
  site: 'https://leoappartamenti.it',
  integrations: [sitemap({ filter: (p) => !/\/(grazie|thanks)\/$/.test(p) })],
});
