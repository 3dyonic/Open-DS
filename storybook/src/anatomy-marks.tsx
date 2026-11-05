// The live drawing of an Anatomy reference (OD-229): a story rendered with the `anatomy` global puts
// a number on each part, on the element its data-slot names, from the component's parts layer in the
// grammar. `anatomy:<component>` numbers every part; with `anatomyparts:<n>-<n>`, only those (a card's
// own). A state part is shown by setting the data attribute the component already styles; a drawing
// may name a trigger to open first (a dialog, a menu). Nothing here decides a value: the component and
// the scheme's tokens draw it.
import { useEffect } from "react";
import grammar from "../../schemes/grammar.json";

type Part = {
  n?: number;
  id: string;
  slot?: string;
  nth?: number;
  state?: { attr: string; value: string };
  children?: Part[];
};
type Spec = { drawing?: { kind?: string; open?: string }; parts: Part[] };

const flat = (list: Part[]): Part[] => list.flatMap((p) => [p, ...(p.children ? flat(p.children) : [])]);

export function parseAnatomy(
  component: unknown,
  parts: unknown,
): { component: string; only: Set<number> | null } | null {
  if (!component || typeof component !== "string") return null;
  const nums = parts !== undefined && parts !== null && parts !== "" ? String(parts).split("-").map(Number) : null;
  return { component, only: nums ? new Set(nums) : null };
}

export function AnatomyMarks({ component, only }: { component: string; only: Set<number> | null }) {
  useEffect(() => {
    const item = (grammar as { catalogue: { items: { id: string; anatomy?: Spec }[] } }).catalogue.items.find(
      (i) => i.id === component,
    );
    const spec = item?.anatomy;
    if (!spec || spec.drawing?.kind !== "live") return;
    const parts = flat(spec.parts).filter((p) => p.n && p.slot && (!only || only.has(p.n)));
    const layer = document.createElement("div");
    layer.setAttribute("data-anatomy-layer", "");
    layer.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483647";
    document.body.append(layer);
    let opened = false;
    const draw = () => {
      if (spec.drawing?.open && !opened) {
        const t = document.querySelector<HTMLElement>(`[data-slot="${spec.drawing.open}"]`);
        if (t) {
          t.click();
          opened = true;
        }
      }
      const at = new Map<Element, number>();
      layer.replaceChildren();
      for (const p of parts) {
        const all = [...document.querySelectorAll<HTMLElement>(`[data-slot="${p.slot}"]`)].filter(
          (e) => !layer.contains(e),
        );
        if (!all.length) continue;
        // The nth element, or nothing: a part this example doesn't show is not drawn on another one.
        let el = all[p.nth ?? 0];
        if (!el) continue;
        if (p.state) {
          // The element already in that state, or the nth one put into it.
          const has = all.find((e) => e.getAttribute(p.state!.attr) === p.state!.value);
          if (has) el = has;
          else el.setAttribute(p.state.attr, p.state.value);
        }
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        const k = at.get(el) ?? 0;
        at.set(el, k + 1);
        const b = document.createElement("span");
        b.textContent = String(p.n);
        b.style.cssText = [
          "position:absolute",
          // Parts that share an element take its corners in turn: top right, top left, bottom right, bottom left.
          `left:${(k % 2 ? r.left : r.right) + window.scrollX - 9 + (k > 3 ? (k - 3) * 22 : 0)}px`,
          `top:${(k % 4 < 2 ? r.top : r.bottom) + window.scrollY - 9}px`,
          "min-width:18px;height:18px;padding:0 4px;border-radius:9px",
          "display:flex;align-items:center;justify-content:center",
          "font:600 11px/1 var(--type-body-font-family, system-ui)",
          "background:var(--color-action-primary);color:var(--color-text-on-action)",
          "box-shadow:0 0 0 2px var(--color-surface-canvas)",
        ].join(";");
        layer.append(b);
      }
    };
    // Components settle (fonts, portals, animations): draw again for a moment, then on resize.
    const timers = [0, 150, 400, 900, 1600].map((ms) => window.setTimeout(draw, ms));
    window.addEventListener("resize", draw);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", draw);
      layer.remove();
    };
  }, [component, only]);
  return null;
}
