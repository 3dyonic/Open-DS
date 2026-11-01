// The product name and tagline. They live only in brand.json.
import brand from "../../../brand.json";

export const brandName = brand.name;
export const brandTagline = brand.tagline;
/** The public contact address (brand.json). */
export const brandContact = brand.contact;

/** Where the site is served: brand.json's url, or SITE_URL at build time. */
export const siteUrl = process.env.SITE_URL ?? brand.url;

/** Open Graph fields every page shares. A page that sets openGraph replaces the layout's, so it spreads these. */
export const openGraphBase = { type: "website", siteName: brand.name, locale: "en" } as const;
