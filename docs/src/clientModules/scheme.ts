// Keeps html[data-scheme] on the scheme of the page you are on (OD-207), so its tokens apply. The
// first paint is set by the inline script in docusaurus.config.ts.
import siteConfig from "@generated/docusaurus.config";

const ids = (siteConfig.customFields?.schemes as { id: string }[]).map((s) => s.id);

export function onRouteDidUpdate({ location }: { location: Location }) {
  const id = location.pathname.split("/")[1];
  const html = document.documentElement;
  if (ids.includes(id)) html.setAttribute("data-scheme", id);
  else html.removeAttribute("data-scheme");
}
