import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";

export type Scheme = {
  id: string;
  name: string;
  version: string;
  summary: string;
  brands: string[];
  useWhen: string;
  examples: string[];
  components: number;
  answers: number;
  themes: number;
  primary: string;
  /** The primary in the dark mode, for a swatch shown on a dark page. */
  primaryDark: string;
  corners: string;
  font: string;
  motion: string;
};

/** Every scheme, the one this page belongs to (or null on the landing page), and the path inside it. */
export function useScheme() {
  const { siteConfig } = useDocusaurusContext();
  const schemes = siteConfig.customFields?.schemes as Scheme[];
  const { pathname } = useLocation();
  // Paths start with the site's base URL: "/" locally, "/docs/" on open-ds.dev (OD-210).
  const inside = pathname.startsWith(siteConfig.baseUrl) ? pathname.slice(siteConfig.baseUrl.length) : pathname;
  const [first = "", ...rest] = inside.split("/");
  const current = schemes.find((s) => s.id === first) ?? null;
  return { schemes, current, rest: current ? rest.join("/") : "" };
}
