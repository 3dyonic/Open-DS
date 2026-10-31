// Every page of the site, for search engines. Scheme, scope and moves pages come from the schemes.
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/brand";
import { grammar, schemeIds } from "@/lib/schemes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).toString();
  const pages = ["/", "/take/", "/compare/", "/questions/", "/install/", "/contribute/"];
  const scopes = grammar().scopes.map((s) => s.id);
  for (const id of schemeIds()) {
    pages.push(
      `/schemes/${id}/`,
      `/schemes/${id}/moves/`,
      ...scopes.map((s) => `/schemes/${id}/${s}/`),
    );
  }
  return pages.map((p) => ({
    url: url(p),
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.6,
  }));
}
