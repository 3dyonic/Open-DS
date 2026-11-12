// Style rules the owner accepted (OD-297) that live in code, not in a scheme: what a source file must
// not do, measured from its text. No file access: the caller passes the source.

/** The accepted range of letter spacing for uppercase text, in em. */
export const UPPERCASE_TRACKING = { min: 0.05, max: 0.12 };

// Tailwind's named tracking steps, in em.
const TRACKING = { tighter: -0.05, tight: -0.025, normal: 0, wide: 0.025, wider: 0.05, widest: 0.1 };

const lineAt = (text, index) => text.slice(0, index).split("\n").length;

/**
 * Every uppercase label in a source file with its letter spacing in em: CSS blocks with
 * text-transform: uppercase, and class lists with Tailwind's uppercase. [{ line, em }]; em is 0 when no
 * letter spacing is set, and null when it is set in a unit other than em.
 */
export function uppercaseLabels(text) {
  const out = [];
  // CSS, in a stylesheet or a string of CSS: a block is the text between braces.
  for (const m of text.matchAll(/\{([^{}]*text-transform\s*:\s*uppercase[^{}]*)\}/g)) {
    const ls = /letter-spacing\s*:\s*(-?[\d.]+)(em|px|rem)?/.exec(m[1]);
    out.push({ line: lineAt(text, m.index), em: !ls ? 0 : ls[2] === "em" ? Number(ls[1]) : null });
  }
  // Class lists: a quoted string whose classes include uppercase.
  for (const m of text.matchAll(/(["'`])([^"'`]*)\1/g)) {
    const classes = m[2].split(/\s+/);
    if (!classes.includes("uppercase")) continue;
    let em = 0;
    for (const c of classes) {
      const named = /^tracking-([a-z]+)$/.exec(c);
      const raw = /^tracking-\[(-?[\d.]+)(em|px|rem)\]$/.exec(c);
      if (named && named[1] in TRACKING) em = TRACKING[named[1]];
      else if (raw) em = raw[2] === "em" ? Number(raw[1]) : null;
    }
    out.push({ line: lineAt(text, m.index), em });
  }
  return out;
}

/** The uppercase labels whose letter spacing is outside the accepted range. [{ line, em }] */
export function trackingOutOfRange(text, range = UPPERCASE_TRACKING) {
  return uppercaseLabels(text).filter((x) => x.em === null || x.em < range.min || x.em > range.max);
}

/**
 * The classes in a component's source that dim a disabled state with opacity: a variant that names
 * disabled (disabled:, aria-disabled:, data-[disabled]:, has-disabled:, group-data-[disabled=true]/x:)
 * followed by an opacity utility. Disabled reads muted colors; opacity is for loading and dragging.
 */
export function disabledOpacity(text) {
  return [...text.matchAll(/[^\s"'`]*disabled[^\s"'`]*:opacity-[^\s"'`]+/g)].map((m) => ({ line: lineAt(text, m.index), cls: m[0] }));
}

/**
 * Whether a component grows its hit area from a key: a pseudo-element sized at least the key's value,
 * centered on the control. The control keeps its drawn size.
 */
export function readsHitArea(text, cssVar) {
  const at = text.indexOf(`after:h-[max(100%,var(${cssVar}))]`);
  return at >= 0 && text.includes(`after:w-[max(100%,var(${cssVar}))]`) && /after:absolute/.test(text) && /after:content-\[''\]/.test(text);
}

/**
 * What a reduced-motion block in a stylesheet keeps and drops: { found, instant, movesTransform,
 * keepsFade, stopsSlides }. instant: it cuts every transition and animation to (near) zero, so a
 * change no longer shows. movesTransform: transitions may still animate transform or layout.
 */
export function reducedMotion(css) {
  const at = css.indexOf("prefers-reduced-motion: reduce");
  if (at < 0) return { found: false };
  // The block: from the media query to its matching brace.
  let depth = 0;
  let end = css.indexOf("{", at);
  for (let i = end; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) {
      end = i;
      break;
    }
  }
  const block = css.slice(at, end);
  const property = /transition-property\s*:\s*([^;!]+)/.exec(block)?.[1] ?? "all";
  const props = property.split(",").map((p) => p.trim());
  return {
    found: true,
    instant: /(transition|animation)-duration\s*:\s*0(\.0\d*)?m?s/.test(block),
    movesTransform: props.some((p) => ["all", "transform", "translate", "scale", "rotate", "width", "height", "left", "right", "top", "bottom", "margin", "padding"].includes(p)),
    keepsFade: props.includes("opacity") && props.includes("color"),
    stopsSlides: ["--tw-enter-translate-x", "--tw-enter-translate-y", "--tw-enter-scale", "--tw-exit-translate-x", "--tw-exit-translate-y", "--tw-exit-scale"].every((v) => block.includes(v)),
  };
}
