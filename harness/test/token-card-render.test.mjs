// The Token map's decision cards, rendered to HTML from the real map data: the color card and the card
// of every other scope show their sections in the approved order, in the mode the map is in. The card
// file is TypeScript with JSX; the docs package's own typescript compiles it, and react-dom/server
// renders it, so the test needs no build and no browser.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assetRoots, grammar, loadScheme } from "../../cli/src/schemes.mjs";
import { tokenMapView } from "../../cli/src/token-map-view.mjs";

const repo = fileURLToPath(new URL("../..", import.meta.url));
const docs = join(repo, "docs");
const fromDocs = createRequire(join(docs, "package.json"));
const roots = assetRoots();
const g = grammar(roots);
// The icon the cards draw, as the docs generator passes it; one path is enough for the render.
const glyph = { name: "Filter", nodes: [["path", { d: "M3 3h18l-7 8v6l-4 3v-9z" }]] };
const maps = Object.fromEntries(
  ["content-first", "dense-data"].map((id) => [id, tokenMapView({ scheme: loadScheme(id, roots), grammar: g, glyph })]),
);

let dir;
let card;
let React;
let server;
before(async () => {
  dir = mkdtempSync(join(tmpdir(), "token-card-render-"));
  // The compiled card resolves react from the docs package.
  symlinkSync(join(docs, "node_modules"), join(dir, "node_modules"), "dir");
  writeFileSync(join(dir, "styles.mjs"), "export default new Proxy({}, { get: (_, key) => String(key) });\n");
  writeFileSync(
    join(dir, "badge.mjs"),
    'import React from "react";\nexport const Badge = ({ children }) => React.createElement("span", { "data-badge": "" }, children);\n',
  );
  const ts = fromDocs("typescript");
  const source = readFileSync(join(docs, "src/components/TokenMap/CardFace.tsx"), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  writeFileSync(
    join(dir, "CardFace.mjs"),
    outputText
      .replace('"./styles.module.css"', '"./styles.mjs"')
      .replace('"@open-ds/ui/components/badge"', '"./badge.mjs"'),
  );
  card = await import(pathToFileURL(join(dir, "CardFace.mjs")).href);
  React = fromDocs("react");
  server = fromDocs("react-dom/server");
});
after(() => rmSync(dir, { recursive: true, force: true }));

// The card of one decision, as text in reading order.
function render(scheme, id, mode = "light") {
  const map = maps[scheme];
  const d = map.modes[mode].decisions[id] ?? map.shared.decisions[id];
  assert.ok(d, `${scheme} has no decision ${id}`);
  const html = server.renderToStaticMarkup(
    React.createElement(card.DecisionCard, { d, mode, theme: map.modes[mode].theme, answers: map.answers }),
  );
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
  return { d, html, text };
}

// Each text is on the card, in this order.
function inOrder(text, parts, label) {
  let at = -1;
  for (const part of parts) {
    const next = text.indexOf(part, at + 1);
    assert.ok(next > at, `${label}: "${part}" is missing or out of order`);
    at = next;
  }
}

test("the color card shows its contrast, its pairs, its components and a closed trace", () => {
  const { d, text, html } = render("content-first", "color.status.warning");
  const used = d.components.length ? `Used by ${d.components.length} component` : "No component code reads it.";
  inOrder(text, [d.id, d.shorthand.headline, "Can you see it?", "Pairs with", used, "Show the trace"], "color");
  assert.match(text, /\d+(\.\d)?:1/);
  assert.ok(!html.includes("<ol"), "the trace starts closed");
});

// The tokens the approved cards show, with the questions their cards answer.
const CASES = [
  ["type.body.font-size", ["Can you read it?", "Specimen · set at", "What do you read first?"]],
  ["space.gap.tight", ["What belongs together?", "Specimen ·", "Where it sits"]],
  ["space.gap.section", ["What belongs together?", "Specimen ·", "Where it sits"]],
  ["space.inset.container", ["Does the content sit inside its box?", "Specimen ·", "Where it sits"]],
  ["size.control.default", ["Can you hit it?", "Floor 24px", "Specimen ·", "Where it sits"]],
  ["radius.control", ["What kind of thing has this corner?", "Specimen ·", "Where it sits"]],
  ["radius.surface", ["What kind of thing has this corner?", "Specimen ·", "Where it sits"]],
  ["border-width.default", ["Where does one region end?", "A control's only edge", "Specimen ·", "Where it sits"]],
  ["focus.ring.width", ["Where is the keyboard?", "ring corner", "Specimen ·", "Where it sits"]],
  ["elevation.card", ["What sits on top, and how high?", "Is it seen in", "Specimen ·", "Where it sits"]],
  ["elevation.overlay", ["What sits on top, and how high?", "Is it seen in", "Specimen ·", "Where it sits"]],
  [
    "motion.duration.feedback",
    ["Is it fast enough to feel instant?", "Specimen ·", "With less motion", "Where it sits"],
  ],
  ["motion.easing.enter", ["How does it arrive?", "Specimen · cubic-bezier", "With less motion"]],
  ["motion.easing.exit", ["How does it arrive?", "Specimen · cubic-bezier", "With less motion"]],
  ["size.icon", ["Can you tell what it is?", "Specimen ·", "Alone as a button?", "Where it sits"]],
  ["icon.stroke-width", ["Does it match the text weight?", "Specimen ·", "Where it sits"]],
];

for (const [id, asks] of CASES)
  test(`the ${id} card answers its scope's question in the approved order, in both schemes and modes`, () => {
    for (const scheme of Object.keys(maps))
      for (const mode of ["light", "dark"]) {
        const { d, text } = render(scheme, id, mode);
        const label = `${scheme} ${mode} ${id}`;
        const c = d.cards?.[mode];
        assert.ok(c, `${label}: no card`);
        const head = d.shorthand?.headline ?? "No shorthand recorded yet";
        const used = d.components.length ? "Used by" : "No component code reads it.";
        inOrder(text, [d.id, head, ...asks, used, "Show the trace"], label);
        // Numbers in pills, then one phrase; a shared value or a reference says which token.
        assert.ok(
          c.sections.every((s) => s.rows.length > 0),
          `${label}: a section with no rows`,
        );
        for (const n of c.shared)
          assert.ok(text.includes(`Shared with ${n.token}`), `${label}: shared with ${n.token}`);
        for (const n of c.pointsHere)
          assert.ok(text.includes(`${n.token} points here`), `${label}: ${n.token} points here`);
        // A token that points at another is a reference, never "Shared".
        if (d.via) assert.ok(!text.includes("Shared with"), `${label}: a reference shows as shared`);
      }
  });

test("a card shows the token's value in the map's mode: the dark shadow on the dark face", () => {
  const light = render("content-first", "elevation.overlay", "light").text;
  const dark = render("content-first", "elevation.overlay", "dark").text;
  assert.ok(light.includes("#1F1B1629") && light.includes("16% shade"));
  assert.ok(dark.includes("#00000080") && dark.includes("50% shade") && !dark.includes("#1F1B1629"));
});
