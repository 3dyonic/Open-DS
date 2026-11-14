// The docs' page behaviour that is not inside a composite (the scales' tabs and hover live in
// their composites now). A link from a color scale row opens its token's guidance on Foundations ›
// Color and marks the row; the Decision reference opens one section at a time.

/** A row on the scale view links to its token's guidance: scroll to that row and mark it. */
function arrive() {
  const id = new URLSearchParams(location.search).get("for");
  // The row whose first cell names the token: its name, in the same form as the link's ?for=.
  const key = (t: string) =>
    t
      .replaceAll(".@", "")
      .replace(/[^a-z0-9-]+/gi, "-")
      .toLowerCase();
  const row =
    id &&
    Array.from(document.querySelectorAll("tr")).find((r) => {
      const code = r.querySelector("td:first-child code");
      return code && key(code.textContent ?? "") === id;
    });
  if (!row) return;
  row.scrollIntoView({ block: "center" });
  row.classList.add("odv-for");
}

export function onRouteDidUpdate() {
  decidedRoute();
  setTimeout(arrive, 120);
}

// Decision reference: one section open at a time. Opening one closes the others without
// moving the one you clicked: its header stays where it was on screen. A link to a section or a
// question opens its section, the address follows the open section, and the section menu in the
// left sidebar marks it. On any other page that menu folds away.
function setOpen(sec: Element | null, open: boolean) {
  const btn = sec?.querySelector<HTMLButtonElement>(":scope [data-fold-head]");
  const body = sec?.querySelector<HTMLElement>(":scope [data-fold-body]");
  if (!btn || !body) return;
  btn.setAttribute("aria-expanded", String(open));
  body.hidden = !open;
}

function openOnly(sec: Element | null, keep?: Element | null) {
  const anchor = keep ?? sec;
  const before = anchor?.getBoundingClientRect().top ?? 0;
  for (const o of document.querySelectorAll("[data-fold]")) setOpen(o, o === sec);
  // Closing a section above moves everything below it up; scroll back so the header stays put.
  if (anchor) window.scrollBy(0, anchor.getBoundingClientRect().top - before);
  history.replaceState(null, "", sec ? `#${sec.id}` : location.pathname);
  markMenu();
}

function openFor(hash: string) {
  const el = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  const sec = el?.closest("[data-fold]");
  if (sec) for (const o of document.querySelectorAll("[data-fold]")) setOpen(o, o === sec);
  markMenu();
  if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
}

function markMenu() {
  const open = document.querySelector('[data-fold-head][aria-expanded="true"]')?.closest("[data-fold]")?.id ?? "";
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
    const head = t.closest("[data-fold-head]");
    if (head) {
      const sec = head.closest("[data-fold]");
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
