import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";

export type Scheme = { id: string; name: string; version: string; summary: string; brands: string[] };

/** Every scheme, the one this page belongs to (or null on the landing page), and the path inside it. */
export function useScheme() {
  const { siteConfig } = useDocusaurusContext();
  const schemes = siteConfig.customFields?.schemes as Scheme[];
  const { pathname } = useLocation();
  const [, first = "", ...rest] = pathname.split("/");
  const current = schemes.find((s) => s.id === first) ?? null;
  return { schemes, current, rest: current ? rest.join("/") : "" };
}
