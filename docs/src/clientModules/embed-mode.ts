// The live Storybook embeds follow the docs theme (OD-213) and brand (OD-217). Each embed's URL names
// a mode and, with several brands, a brand; this swaps them for the ones the docs show, now and
// whenever the theme switch or the brand pick changes them.
function sync() {
  const mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  for (const frame of document.querySelectorAll<HTMLIFrameElement>(".odv-live iframe, .odv-vstage iframe")) {
    const src = frame.getAttribute("src") ?? "";
    const brand = document.documentElement.dataset.brand;
    let next = src.replace(/mode:(light|dark)/, `mode:${mode}`);
    if (brand) next = next.replace(/(scheme:[a-z-]+)--[a-z]+/, `$1--${brand}`);
    if (next !== src) frame.setAttribute("src", next);
  }
}

if (typeof window !== "undefined") {
  new MutationObserver(sync).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-brand"],
  });
}

export function onRouteDidUpdate() {
  sync();
}
