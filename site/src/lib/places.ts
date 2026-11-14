// The docs and Storybook on open-ds.dev. Each has its own people and its own path:
// the docs for designers, product teams and agents (why and when), Storybook for developers (see it
// work, copy it). Both are static builds served next to the site, so links to them are plain <a>,
// never next/link, and they open in a new tab. Local runs point them at their dev servers through the env.
export const DOCS = (process.env.NEXT_PUBLIC_DOCS_URL ?? "/docs").replace(/\/$/, "");
export const STORYBOOK = (process.env.NEXT_PUBLIC_STORYBOOK_URL ?? "/storybook").replace(/\/$/, "");

/** True for a link that leaves the Next app: the docs, Storybook, or another site. */
export const leavesApp = (href: string) =>
  /^https?:/.test(href) || href.startsWith(`${DOCS}/`) || href.startsWith(`${STORYBOOK}/`);

/** The scheme's docs home. */
export const docsOf = (id: string) => `${DOCS}/${id}/`;

/** Storybook opened on the scheme. Multi-brand opens on its first brand. */
export const storybookOf = (id: string, brands: string[]) =>
  `${STORYBOOK}/?globals=scheme:${id}${brands.length > 1 ? `--${brands[0]}` : ""}`;
