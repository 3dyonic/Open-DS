// The product name and tagline. They live only in brand.json.
import brand from "../../../brand.json";

export const brandName = brand.name;
export const brandTagline = brand.tagline;

/** Where the site is served: brand.json's url, or SITE_URL at build time. */
export const siteUrl = process.env.SITE_URL ?? brand.url;
