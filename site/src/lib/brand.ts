// The product name, tagline, address and contact. They live only in the root package.json
// (displayName, description, homepage, bugs.email), which is private: never published to npm.
import pkg from "../../../package.json";

export const brandName = pkg.displayName;
export const brandTagline = pkg.description;
/** The public contact address. */
export const brandContact = pkg.bugs.email;

/** Where the site is served: the root package.json's homepage, or SITE_URL at build time. */
export const siteUrl = process.env.SITE_URL ?? pkg.homepage;

/** Open Graph fields every page shares. A page that sets openGraph replaces the layout's, so it spreads these. */
export const openGraphBase = { type: "website", siteName: pkg.displayName, locale: "en" } as const;
