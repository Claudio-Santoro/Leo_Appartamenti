import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // il dominio vale per canonical, hreflang, og:image, sitemap e robots.txt
  site: 'https://leoappartamenti.com',
  integrations: [sitemap({ filter: (p) => !/\/(grazie|thanks)\/$/.test(p) })],
});
