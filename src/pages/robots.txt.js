// Il dominio viene da astro.config.mjs (site), così resta allineato a canonical e sitemap.
export const GET = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`);
