// Percorsi per lingua: le pagine IT e EN sono wrapper sottili sulle stesse viste in src/views.
export const routes = {
  home: { it: '/', en: '/en/' },
  apts: { it: '/appartamenti/', en: '/en/apartments/' },
  avail: { it: '/disponibilita/', en: '/en/availability/' },
  arrive: { it: '/come-arrivare/', en: '/en/getting-here/' },
  erice: { it: '/cosa-vedere-a-erice/', en: '/en/things-to-do-in-erice/' },
  natale: { it: '/erice-a-natale/', en: '/en/erice-at-christmas/' },
  faq: { it: '/faq/', en: '/en/faq/' },
  privacy: { it: '/privacy/', en: '/en/privacy/' },
  terms: { it: '/condizioni/', en: '/en/terms/' },
  thanks: { it: '/grazie/', en: '/en/thanks/' },
  credits: { it: '/crediti/', en: '/en/credits/' },
};

export const url = (page, lang, id) => routes[page][lang] + (id ? `${id}/` : '');

export const ui = {
  it: {
    nav: { apts: 'Appartamenti', erice: 'Erice', ericeLong: 'Cosa vedere a Erice', arrive: 'Come arrivare', faq: 'Domande', book: 'Disponibilità' },
    langName: 'English',
    tagline: 'Appartamenti con vista panoramica a Erice',
    guests: 'ospiti',
    beds: 'Letti',
    baths: 'Bagni',
    details: 'Scopri',
    checkAvail: 'Verifica disponibilità',
    fireplace: 'Camino',
    footer: { christmas: 'Erice a Natale', address: 'Indirizzo', contacts: 'Contatti', explore: 'Esplora', codes: 'Codici identificativi', privacy: 'Privacy e cookie', terms: 'Condizioni di soggiorno', credits: 'Crediti fotografici', photos: 'Foto di Erice: Wikimedia Commons, con licenze libere, e dei proprietari.' },
    menu: 'Menu', close: 'Chiudi', skip: 'Vai al contenuto',
    lamps: 'Accendi i lampioni (modalità notte)',
  },
  en: {
    nav: { apts: 'Apartments', erice: 'Erice', ericeLong: 'Things to do in Erice', arrive: 'Getting here', faq: 'FAQ', book: 'Availability' },
    langName: 'Italiano',
    tagline: 'Apartments with panoramic views in Erice',
    guests: 'guests',
    beds: 'Beds',
    baths: 'Bathrooms',
    details: 'Discover',
    checkAvail: 'Check availability',
    fireplace: 'Fireplace',
    footer: { christmas: 'Erice at Christmas', address: 'Address', contacts: 'Contacts', explore: 'Explore', codes: 'Registration codes', privacy: 'Privacy & cookies', terms: 'Terms of stay', credits: 'Photo credits', photos: 'Photos of Erice: Wikimedia Commons, freely licensed, and the owners.' },
    menu: 'Menu', close: 'Close', skip: 'Skip to content',
    lamps: 'Light the street lamps (night mode)',
  },
};
