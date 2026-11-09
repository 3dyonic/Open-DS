// The scale view on the color primitives page (OD-223). Light and dark tabs, one choice for every
// color on the page, starting from the docs theme. Pointing at a token row lights up its step, and the
// other way round.
const KEY = "odv-scale-mode";

function show(mode: string) {
  for (const box of document.querySelectorAll<HTMLElement>("[data-scale]")) {
    const has = box.querySelector(`.odv-scale-p[data-mode="${mode}"]`);
    const m = has ? mode : (box.querySelector<HTMLElement>(".odv-scale-p")?.dataset.mode ?? mode);
    for (const b of box.querySelectorAll<HTMLElement>(".odv-scale-tabs button"))
      b.setAttribute("aria-selected", String(b.dataset.mode === m));
    for (const p of box.querySelectorAll<HTMLElement>(".odv-scale-p")) p.hidden = p.dataset.mode !== m;
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
  show(mode ?? (document.documentElement.dataset.theme === "dark" ? "dark" : "light"));
}

function light(el: Element, on: boolean) {
  const k = (el as HTMLElement).dataset.link;
  const panel = el.closest(".odv-lane");
  if (!k || !panel) return;
  for (const x of panel.querySelectorAll(`[data-link="${k}"]`)) x.classList.toggle("hl", on);
}

if (typeof window !== "undefined") {
  document.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLElement>(".odv-scale-tabs button");
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
  decidedRoute();
  start();
  setTimeout(arrive, 120);
}

// Decision reference (OD-239): one section open at a time. Opening one closes the others without
// moving the one you clicked: its header stays where it was on screen. A link to a section or a
// question opens its section, the address follows the open section, and the section menu in the
// left sidebar marks it. On any other page that menu folds away.
function setOpen(sec: Element | null, open: boolean) {
  const btn = sec?.querySelector<HTMLButtonElement>(":scope > .odv-qsec-h");
  const body = sec?.querySelector<HTMLElement>(":scope > .odv-qsec-b");
  if (!btn || !body) return;
  btn.setAttribute("aria-expanded", String(open));
  body.hidden = !open;
}

function openOnly(sec: Element | null, keep?: Element | null) {
  const anchor = keep ?? sec;
  const before = anchor?.getBoundingClientRect().top ?? 0;
  for (const o of document.querySelectorAll(".odv-qsec")) setOpen(o, o === sec);
  // Closing a section above moves everything below it up; scroll back so the header stays put.
  if (anchor) window.scrollBy(0, anchor.getBoundingClientRect().top - before);
  history.replaceState(null, "", sec ? `#${sec.id}` : location.pathname);
  markMenu();
}

function openFor(hash: string) {
  const el = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  const sec = el?.closest(".odv-qsec");
  if (sec) for (const o of document.querySelectorAll(".odv-qsec")) setOpen(o, o === sec);
  markMenu();
  if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
}

function markMenu() {
  const open = document.querySelector('.odv-qsec-h[aria-expanded="true"]')?.parentElement?.id ?? "";
  for (const a of document.querySelectorAll<HTMLAnchorElement>(".odv-dmenu-a"))
    a.classList.toggle("on", a.dataset.section === open);
}

// Docusaurus opens a category on its own page but never closes it when you leave. Fold the
// Decision reference menu on every other page.
function foldMenu() {
  const cat = document.querySelector(".odv-dmenu-cat");
  if (!cat || document.querySelector(".odv-decided, [data-composite=fold]")) return;
  if (cat.classList.contains("menu__list-item--collapsed")) return;
  cat.querySelector<HTMLButtonElement>(".menu__caret")?.click();
}

if (typeof window !== "undefined") {
  document.addEventListener("click", (e) => {
    const t = e.target as Element;
    const head = t.closest(".odv-qsec-h");
    if (head) {
      const sec = head.parentElement;
      openOnly(head.getAttribute("aria-expanded") === "true" ? null : sec, sec);
      return;
    }
    const a = t.closest<HTMLAnchorElement>("a[href*='#']");
    if (!a || !document.querySelector(".odv-decided, [data-composite=fold]") || a.pathname !== location.pathname)
      return;
    e.preventDefault();
    history.pushState(null, "", a.hash);
    openFor(a.hash);
  });
  window.addEventListener("hashchange", () => openFor(location.hash));
}

function decidedRoute() {
  foldMenu();
  if (!document.querySelector(".odv-decided, [data-composite=fold]")) return;
  openFor(location.hash);
}
