import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { questionsFor } from "../../site/src/lib/check.mjs";

export const SHARED_BASE = "3dyonic";

const here = dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = JSON.parse(readFileSync(join(here, "../../schema/token-paths.json"), "utf8"));

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function commentsOf(text) {
  return [...text.matchAll(/\/\*([\s\S]*?)\*\//g)].map((match) => match[1].trim()).filter(Boolean);
}

function parseProps(body) {
  const props = new Map();
  for (const line of body.split("\n")) {
    const match = line.match(/--([A-Za-z0-9-]+)\s*:\s*([^;]+);/);
    if (match) props.set(`--${match[1]}`, match[2].trim());
  }
  return props;
}

function parseThemes(css) {
  const light = new Map();
  const dark = new Map();
  const order = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let match = re.exec(css);
  while (match) {
    const selector = match[1];
    const props = parseProps(match[2]);
    const isDark = selector.includes('data-theme="dark"') && !selector.includes('data-theme="light"');
    const target = isDark ? dark : light;
    for (const [prop, value] of props) {
      target.set(prop, value);
      if (!order.includes(prop)) order.push(prop);
    }
    match = re.exec(css);
  }
  return { light, dark, order };
}

function setPath(root, path, value) {
  const parts = path.split(".");
  let cursor = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") cursor[parts[i]] = {};
    cursor = cursor[parts[i]];
  }
  cursor[parts[parts.length - 1]] = value;
}

function ensureToken(tokens, prop) {
  const path = TOKEN_PATH[prop];
  if (!path) return null;
  let cursor = tokens;
  for (let i = 0; i < path.length - 1; i += 1) {
    if (!cursor[path[i]] || typeof cursor[path[i]] !== "object") cursor[path[i]] = {};
    cursor = cursor[path[i]];
  }
  const key = path[path.length - 1];
  if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
  return cursor[key];
}

function writeLiteral(token, cssValue) {
  const dim = /^(-?\d*\.?\d+)(rem|px|ms)$/.exec(cssValue);
  const num = /^(-?\d*\.?\d+)$/.exec(cssValue);
  if (dim) {
    token.$type = token.$type || "dimension";
    token.$value = { value: Number(dim[1]), unit: dim[2] };
    return;
  }
  if (num) {
    token.$type = token.$type || "number";
    token.$value = Number(num[1]);
    return;
  }
  token.$type = token.$type || "other";
  token.$value = cssValue;
}

function markDefaults(node) {
  if (!node || typeof node !== "object") return;
  if (Object.prototype.hasOwnProperty.call(node, "$value")) {
    if (!node.$description) node.$description = "base default";
    return;
  }
  for (const value of Object.values(node)) markDefaults(value);
}

function applyFragment(state, item) {
  if (item.fragment.endsWith(".json")) {
    const data = JSON.parse(item.text);
    if (data.defaultTheme === "light" || data.defaultTheme === "dark") state.defaultTheme = data.defaultTheme;
    for (const [prop, value] of Object.entries(data.css?.both || {})) {
      for (const theme of ["light", "dark"]) {
        state[theme].set(prop, value);
        state.notes[theme].set(prop, item.question);
      }
    }
    for (const theme of ["light", "dark"]) {
      for (const [prop, value] of Object.entries(data.css?.[theme] || {})) {
        state[theme].set(prop, value);
        state.notes[theme].set(prop, item.question);
      }
    }
    for (const [path, value] of Object.entries(data.tokens || {})) setPath(state.tokens, path, value);
    const note = data.note ? `. ${data.note}` : "";
    state.fileNotes.push(`decision: ${item.question} (${item.option})${note}`);
    return;
  }
  const prose = commentsOf(item.text).filter((note) => !/^default-theme:\s*(light|dark)$/.test(note));
  for (const note of commentsOf(item.text)) {
    const theme = note.match(/^default-theme:\s*(light|dark)$/);
    if (theme) state.defaultTheme = theme[1];
  }
  if (prose.length) {
    for (const note of prose) state.fileNotes.push(`decision: ${item.question} (${item.option}). ${note}`);
  } else {
    state.fileNotes.push(`decision: ${item.question} (${item.option})`);
  }
  if (item.text.includes("{")) {
    const re = /([^{}]+)\{([^{}]*)\}/g;
    let match = re.exec(item.text);
    while (match) {
      const selector = match[1];
      const props = parseProps(match[2]);
      const themes = [];
      if (selector.includes('data-theme="light"')) themes.push("light");
      if (selector.includes('data-theme="dark"')) themes.push("dark");
      if (!themes.length) themes.push("light", "dark");
      for (const theme of themes) {
        for (const [prop, value] of props) {
          state[theme].set(prop, value);
          state.notes[theme].set(prop, item.question);
        }
      }
      match = re.exec(item.text);
    }
    return;
  }
  for (const theme of ["light", "dark"]) {
    for (const [prop, value] of parseProps(item.text)) {
      state[theme].set(prop, value);
      state.notes[theme].set(prop, item.question);
    }
  }
}

function renderBlock(selector, props, notes, order) {
  const keys = [...order.filter((key) => props.has(key)), ...[...props.keys()].filter((key) => !order.includes(key))];
  const lines = keys.map((prop) => {
    const mark = notes.get(prop) ? `decision: ${notes.get(prop)}` : "base default";
    return `  ${prop}: ${props.get(prop)}; /* ${mark} */`;
  });
  return `${selector} {\n${lines.join("\n")}\n}`;
}

function renderCss(state) {
  const header = [
    "/* Authored theme values. Open DS did not calculate these colors. */",
    ...state.fileNotes.map((note) => `/* ${note} */`),
  ];
  const lightSelector = ':root,\n[data-theme="light"]';
  const darkSelector = '[data-theme="dark"]';
  const rootSelector = state.defaultTheme === "dark" ? ':root,\n[data-theme="dark"]' : lightSelector;
  const otherSelector = state.defaultTheme === "dark" ? '[data-theme="light"]' : darkSelector;
  const rootTheme = state.defaultTheme === "dark" ? "dark" : "light";
  const otherTheme = rootTheme === "dark" ? "light" : "dark";
  return [
    ...header,
    "",
    renderBlock(rootSelector, state[rootTheme], state.notes[rootTheme], state.order),
    "",
    renderBlock(otherSelector, state[otherTheme], state.notes[otherTheme], state.order),
    "",
  ].join("\n");
}

export function renderDecisionBlock(recipe, packs, kind) {
  const questions = Object.fromEntries(questionsFor(packs, recipe.packs).map((question) => [question.id, question]));
  const lines = ["<!-- decisions:start -->"];
  lines.push(kind === "readme" ? "## Decisions" : "## Decision rules", "");
  const picks = [...recipe.picks].sort((a, b) => (a.question < b.question ? -1 : a.question > b.question ? 1 : 0));
  for (const pick of picks) {
    const option = questions[pick.question].options.find((item) => item.id === pick.option);
    const source = option.sources[0];
    const rationale = String(pick.rationale).trim();
    if (kind === "readme") {
      lines.push(
        `### ${pick.question}`,
        "",
        `- decision: ${pick.question}`,
        `- Option: \`${pick.option}\``,
        `- Reason: ${rationale}`,
        `- Source: ${source.name}, ${source.title}`,
        `- Cost: ${option.trade_offs[0]}`,
        "",
      );
    } else {
      lines.push(
        `- decision: ${pick.question}`,
        `  Do follow option \`${pick.option}\`.`,
        `  Do not drop the reason: ${rationale}`,
        "",
      );
    }
  }
  lines.push("<!-- decisions:end -->");
  return lines.join("\n");
}

function chainSection(recipe) {
  const lines = ["## Chain from Purpose", "", `- Purpose: ${recipe.serves}`];
  for (const link of recipe.chain || []) lines.push(`- ${link.line}`);
  return lines.join("\n");
}

function renderReadme(recipe, packs) {
  return [
    "# What this design system serves",
    "",
    recipe.serves,
    "",
    "Open DS assembled this boilerplate from the shared base and the recipe's fragments. It did not calculate token values.",
    "",
    chainSection(recipe),
    "",
    renderDecisionBlock(recipe, packs, "readme"),
    "",
  ].join("\n");
}

function renderAgents(recipe, packs, fingerprint) {
  return [
    "# Agent rules",
    "",
    `The recipe fingerprint is ${fingerprint}.`,
    "",
    "Do use the theme tokens for color, type, radius, and motion.",
    "Do not put raw colors, font sizes, or radii in component files.",
    "Do not change locked fields after init.",
    "",
    chainSection(recipe),
    "",
    renderDecisionBlock(recipe, packs, "agents"),
    "",
  ].join("\n");
}

export function assemble({ recipe, packs, root, outDir, fingerprint }) {
  const base = join(root, "boilerplates", SHARED_BASE);
  if (!existsSync(join(base, "manifest.json"))) {
    const error = new Error("No boilerplate for this recipe.");
    error.code = "missing-boilerplate";
    throw error;
  }
  mkdirSync(outDir, { recursive: true });
  cpSync(base, outDir, { recursive: true });
  const byId = Object.fromEntries(questionsFor(packs, recipe.packs).map((question) => [question.id, question]));
  const applied = [];
  for (const pick of recipe.picks) {
    const option = (byId[pick.question]?.options || []).find((item) => item.id === pick.option);
    if (!option?.fragment || option.fragment.split(/[\\/]/).includes("..")) continue;
    const file = join(root, option.fragment);
    if (!existsSync(file)) {
      const error = new Error(`missing-fragment: ${option.fragment}`);
      error.code = "missing-fragment";
      throw error;
    }
    applied.push({ question: pick.question, option: pick.option, fragment: option.fragment, text: readFileSync(file, "utf8") });
  }
  const cssPath = join(outDir, "theme", "tokens.css");
  const parsed = parseThemes(readFileSync(cssPath, "utf8"));
  const state = {
    light: parsed.light,
    dark: parsed.dark,
    order: parsed.order,
    notes: { light: new Map(), dark: new Map() },
    tokens: readJson(join(outDir, "theme", "tokens.json")),
    defaultTheme: "light",
    fileNotes: [],
  };
  for (const item of applied) applyFragment(state, item);
  const mirror = state.defaultTheme === "dark" ? state.dark : state.light;
  const mirrorNotes = state.notes[state.defaultTheme === "dark" ? "dark" : "light"];
  for (const prop of Object.keys(TOKEN_PATH)) {
    if (!mirror.has(prop)) continue;
    const token = ensureToken(state.tokens, prop);
    writeLiteral(token, mirror.get(prop));
    token.$description = mirrorNotes.get(prop) ? `decision: ${mirrorNotes.get(prop)}` : "base default";
  }
  markDefaults(state.tokens);
  state.tokens.$description = state.fileNotes.length ? state.fileNotes.join("; ") : "base default";
  writeFileSync(cssPath, renderCss(state));
  writeFileSync(join(outDir, "theme", "tokens.json"), `${JSON.stringify(state.tokens, null, 2)}\n`);
  const presetPath = join(outDir, "theme", "tailwind.preset.cjs");
  const preset = readFileSync(presetPath, "utf8").replace(/^\/\*\*[\s\S]*?\*\/\n/, "");
  const presetNotes = ["/**", " * Tailwind preset. Values point at the theme CSS variables.", " * Open DS did not calculate these values."];
  for (const note of state.fileNotes) presetNotes.push(` * ${note}`);
  presetNotes.push(" */", "");
  writeFileSync(presetPath, `${presetNotes.join("\n")}${preset}`);
  writeFileSync(join(outDir, "README.md"), renderReadme(recipe, packs));
  writeFileSync(join(outDir, "AGENTS.md"), renderAgents(recipe, packs, fingerprint));
  const manifest = readJson(join(outDir, "manifest.json"));
  manifest.recipeId = recipe.id;
  manifest.recipePath = `recipes/${recipe.id}.json`;
  manifest.fingerprint = fingerprint;
  manifest.serves = recipe.serves;
  manifest.decisions = recipe.picks.map((pick) => ({
    id: pick.question,
    option: pick.option,
    rationale: String(pick.rationale).trim(),
  }));
  writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}
