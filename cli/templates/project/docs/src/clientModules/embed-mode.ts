// The live Storybook embeds follow the docs theme (OD-213). Each embed starts with mode:light in its
// URL; this swaps it for the mode the docs show, now and whenever the theme switch changes it.
function sync() {
  const mode =
    document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  for (const frame of document.querySelectorAll<HTMLIFrameElement>(
    ".odv-live iframe, .odv-vstage iframe",
  )) {
    const src = frame.getAttribute("src") ?? "";
    const next = src.replace(/mode:(light|dark)/, `mode:${mode}`);
    if (next !== src) frame.setAttribute("src", next);
  }
}

if (typeof window !== "undefined") {
  new MutationObserver(sync).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}

export function onRouteDidUpdate() {
  sync();
}
