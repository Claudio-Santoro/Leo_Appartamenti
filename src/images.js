// Le foto stanno in src/assets/<cartella>/NN-nome.jpg: l'ordine del nome file è l'ordine in galleria.
// Per aggiungere o togliere una foto basta aggiungere o togliere il file.
const all = import.meta.glob('/src/assets/**/*.jpg', { eager: true, import: 'default' });

const words = {
  cortile: ['cortile', 'courtyard'], soggiorno: ['soggiorno', 'living room'], pranzo: ['zona pranzo', 'dining area'],
  tavolo: ['tavolo da pranzo', 'dining table'], cucina: ['cucina', 'kitchen'], camera: ['camera da letto', 'bedroom'],
  bagno: ['bagno', 'bathroom'], doccia: ['doccia', 'shower'], ingresso: ['ingresso', 'entrance'],
  tetti: ['i tetti di Erice', 'the rooftops of Erice'], tramonto: ['Erice al tramonto', 'Erice at sunset'], vicolo: ['un vicolo di Erice', 'an alley in Erice'],
};

export function photos(folder, lang = 'it', prefix = '') {
  return Object.entries(all)
    .filter(([p]) => p.includes(`/assets/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([p, src]) => {
      const key = p.split('/').pop().replace(/^\d+-/, '').split(/[-.]/)[0];
      const label = words[key]?.[lang === 'it' ? 0 : 1] ?? key;
      return { src, alt: prefix ? `${prefix} – ${label}` : label };
    });
}
