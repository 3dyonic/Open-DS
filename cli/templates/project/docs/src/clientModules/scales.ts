// The scale view on the color primitives page (OD-223). Light and dark tabs, one choice for every
// color on the page, starting from the docs theme. Pointing at a token row lights up its step, and the
// other way round.
const KEY = "odv-scale-mode";

function show(mode: string) {
  for (const box of document.querySelectorAll<HTMLElement>("[data-scale]")) {
    const has = box.querySelector(`.odv-scale-p[data-mode="${mode}"]`);
    const m = has
      ? mode
      : (box.querySelector<HTMLElement>(".odv-scale-p")?.dataset.mode ?? mode);
    for (const b of box.querySelectorAll<HTMLElement>(".odv-scale-tabs button"))
      b.setAttribute("aria-selected", String(b.dataset.mode === m));
    for (const p of box.querySelectorAll<HTMLElement>(".odv-scale-p"))
      p.hidden = p.dataset.mode !== m;
  }
}

function start() {
  if (!document.querySelector("[data-scale]")) return;
  let mode: string | null = null;
  try {
    mode = sessionStorage.getItem(KEY);
  } catch {
    mode = null;
  }
  show(
    mode ??
      (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
  );
}

function light(el: Element, on: boolean) {
  const k = (el as HTMLElement).dataset.link;
  const panel = el.closest(".odv-lane");
  if (!k || !panel) return;
  for (const x of panel.querySelectorAll(`[data-link="${k}"]`))
    x.classList.toggle("hl", on);
}

if (typeof window !== "undefined") {
  document.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLElement>(
      ".odv-scale-tabs button",
    );
    if (!b?.dataset.mode) return;
    try {
      sessionStorage.setItem(KEY, b.dataset.mode);
    } catch {
      /* not stored: the choice holds for this page only */
    }
    show(b.dataset.mode);
  });
  for (const [type, on] of [
    ["mouseover", true],
    ["mouseout", false],
    ["focusin", true],
    ["focusout", false],
  ] as const)
    document.addEventListener(type, (e) => {
      const el = (e.target as Element).closest?.(".odv-scale [data-link]");
      if (el) light(el, on);
    });
}

/** A row on the scale view links to its token's guidance: scroll to that row and mark it. */
function arrive() {
  const id = new URLSearchParams(location.search).get("for");
  const mark = id && document.getElementById(`for-${id}`);
  const row = mark && mark.closest("tr");
  if (!row) return;
  row.scrollIntoView({ block: "center" });
  row.classList.add("odv-for");
}

export function onRouteDidUpdate() {
  start();
  setTimeout(arrive, 120);
}
