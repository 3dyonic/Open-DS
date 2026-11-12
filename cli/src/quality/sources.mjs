// What component code and CSS decide on their own (OD-298): raw literals that bypass the tokens, motion
// that a reduced-motion rule keeps, and the CSS variables the code reads. Pure: files come in as
// [{ file, text }].

// A transform that still moves: anything but none, 0 or a reset.
const STILL = /^\s*(none|0|0px|initial|unset|revert|inherit)\s*(!important)?\s*$/i;

/** The text without comments, line breaks kept so line numbers still match. */
export function withoutComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, lead) => lead + " ".repeat(m.length - lead.length));
}

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

const LITERALS = [
  { kind: "hex", re: /(?<![\w&-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g },
  { kind: "px", re: /(?<![\w.-])\d*\.?\d+px\b/g },
  { kind: "ms", re: /(?<![\w.-])\d*\.?\d+ms\b/g },
];

/** Raw hex colors, px lengths and ms durations in component code and CSS: [{ file, line, kind, text }]. */
export function componentLiterals(files) {
  const out = [];
  for (const { file, text } of files) {
    const src = withoutComments(text);
    for (const { kind, re } of LITERALS)
      for (const m of src.matchAll(re)) out.push({ file, line: lineOf(src, m.index), kind, text: m[0] });
  }
  return out.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

// The body of each @media block that applies under reduced motion, with where it starts.
function reducedBlocks(src) {
  const out = [];
  const re = /@media[^{]*prefers-reduced-motion\s*:\s*reduce[^{]*\{/g;
  for (const m of src.matchAll(re)) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < src.length && depth; i++) depth += src[i] === "{" ? 1 : src[i] === "}" ? -1 : 0;
    out.push({ start: m.index + m[0].length, body: src.slice(m.index + m[0].length, i - 1) });
  }
  return out;
}

/**
 * Motion that reduced motion keeps: a transform, translate, scale or rotate declaration inside a
 * prefers-reduced-motion: reduce block, or a motion-reduce: utility that moves. [{ file, line, text }]
 */
export function reducedMotionTransforms(files) {
  const out = [];
  for (const { file, text } of files) {
    const src = withoutComments(text);
    for (const b of reducedBlocks(src))
      for (const m of b.body.matchAll(/(?<![\w-])(transform|translate|scale|rotate)\s*:\s*([^;}]+)/g))
        if (!STILL.test(m[2])) out.push({ file, line: lineOf(src, b.start + m.index), text: `${m[1]}: ${m[2].trim()}` });
    for (const m of src.matchAll(/motion-reduce:(-?(?:translate|scale|rotate|transform)[\w\-[\]().%/]*)/g))
      if (!/^(transform-none|-?translate-[xy]-0|scale-100|rotate-0)$/.test(m[1]))
        out.push({ file, line: lineOf(src, m.index), text: `motion-reduce:${m[1]}` });
  }
  return out;
}

/** The CSS variable names code reads through var(--name), with no duplicates. */
export function cssVarReads(files) {
  const names = new Set();
  for (const { text } of files) for (const m of text.matchAll(/var\(--([a-z0-9-]+)/g)) names.add(m[1]);
  return [...names].sort();
}
