/* Alle bedrijfs- en contactgegevens op één plek. Overgenomen van mapfour.com (contact, impressum, about-us);
   controleer ze voordat de site live gaat. */

export const site = {
  name: "MapFour",
  /** Publieke URL van deze website (voor sitemap, canonical en hreflang). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3200").replace(/\/$/, ""),
  /** URL van het B2B Portal (de aparte webapplicatie). */
  portalUrl: (process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3100").replace(/\/$/, ""),
  /** Consumentenwebshop */
  shopUrl: "https://mapfour.com",

  email: "contact@mapfour.com",
  serviceEmail: "service@mapfour.com",
  phone: "+352 266 105 65",
  phoneHref: "+35226610565",

  store: {
    name: "MapFour Amsterdam",
    street: "Kinkerstraat 252 H",
    postal: "1053 DC",
    city: "Amsterdam",
    phone: "+31 619 144 955",
    phoneHref: "+31619144955",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kinkerstraat+252H+1053+DC+Amsterdam",
  },

  company: {
    legalName: "ENGWE INNOVATION S.A.",
    address: "24, Rue Léon Laval, L-3372 Leudelange, Luxembourg",
    vat: "LU36481706",
    register: "RCS Luxembourg B294272",
  },

  social: {
    instagram: "https://www.instagram.com/mapfourebikes/",
    youtube: "https://www.youtube.com/@MapFourEbikes",
    facebook: "https://www.facebook.com/MapFourEbikes",
    linkedin: "https://www.linkedin.com/company/mapfourebikes/",
  },

  /** Merken van de gebruikte componenten (uit de specificaties op mapfour.com), met hun logo.
   *  `h` is de weergavehoogte in px, per logo gekozen zodat ze even zwaar ogen; `ratio` = breedte / hoogte.
   *  Bestanden: public/images/brands (gemaakt met tools/brand-logos.mjs). De site kleurt ze zwart met CSS. */
  componentBrands: [
    { name: "Mivice", src: "/images/brands/mivice.svg", ratio: 1.063, h: 44 },
    { name: "Shimano", src: "/images/brands/shimano.svg", ratio: 7.07, h: 17 },
    { name: "Tektro", src: "/images/brands/tektro.png", ratio: 8.778, h: 16 },
    { name: "Samsung", src: "/images/brands/samsung.svg", ratio: 6.27, h: 18 },
    { name: "LG", src: "/images/brands/lg.svg", ratio: 2.25, h: 30 },
    { name: "Michelin", src: "/images/brands/michelin.svg", ratio: 9.21, h: 16 },
    { name: "Kenda", src: "/images/brands/kenda.png", ratio: 5.07, h: 24 },
    { name: "Selle Royal", src: "/images/brands/selle-royal.svg", ratio: 1.763, h: 40 },
    { name: "Toray", src: "/images/brands/toray.svg", ratio: 4.784, h: 24 },
  ],
} as const;

/** Link naar de loginpagina van het portal, direct in de taal van de bezoeker. */
export function portalLoginUrl(locale: string) {
  return `${site.portalUrl}/taal/set?locale=${encodeURIComponent(locale)}&to=/login`;
}
