// Extract a quality snapshot from one checkout of Open DS (OD-298). The checkout's own code loads its
// schemes and builds its token trees, so each ref is read in its own shape; this tool's code measures
// them. Run as a child process, one per ref, so two refs' modules never share a process:
//
//   node cli/src/quality/extract.mjs --root <checkout> --out <file.json> [--ref <name>] [--sha <sha>]
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { saveGrammar, saveStoredScheme, storedScheme } from "../schemes.mjs";
import { approvalsFrom } from "./approvals.mjs";
import { componentPairsOf } from "./component-pairs.mjs";
import { componentLiterals, cssVarReads, reducedMotionTransforms } from "./sources.mjs";
import { snapshotScheme } from "./snapshot.mjs";

/** Where a checkout records the flags its owner approved, from the repository root. */
export const APPROVALS = join("harness", "quality-approvals.json");
/** Where a checkout records the reasons of the color moves the graded curve makes (OD-299). */
export const SHIFT_REASONS = join("harness", "od-299-shift-reasons.json");

const readText = (path) => (existsSync(path) ? readFileSync(path, "utf8") : null);

/** Every .tsx and .css file under a folder, as [{ file, text }] with paths relative to root. */
export function sourceFiles(root, dir) {
  const out = [];
  const start = join(root, dir);
  if (!existsSync(start)) return out;
  const stack = [start];
  while (stack.length) {
    const d = stack.pop();
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (name === "node_modules") continue;
      if (statSync(full).isDirectory()) stack.push(full);
      else if (/\.(tsx|css)$/.test(name)) out.push({ file: relative(root, full), text: readFileSync(full, "utf8") });
    }
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

/** The component code facts of a checkout: literals, reduced-motion transforms and variable reads. */
export function uiFacts(root) {
  const files = sourceFiles(root, "ui/src");
  return {
    files: files.length,
    literals: componentLiterals(files),
    reducedMotion: reducedMotionTransforms(files),
    reads: cssVarReads(files),
    pairs: componentPairsOf(files),
  };
}

/**
 * The snapshot of a checkout: { ref, sha, grammar, schemes: { id: snapshot }, ui }. blast: false skips
 * the blast radius (one reload per answer and anchor); css: false leaves the built CSS unread. ids
 * narrows the schemes.
 */
export async function extractRef({ root, ref = "working tree", sha = null, blast = true, css: readCss = true, ids = null }) {
  const load = (rel) => import(pathToFileURL(join(root, rel)).href);
  const schemesModule = await load("cli/src/schemes.mjs");
  const { themeTokens } = await load("cli/src/tokens.mjs");
  // The ref's own color scale generator, so a ref reads its generated scales as its own code makes them.
  const generateScale = existsSync(join(root, "cli", "src", "ramps.mjs")) ? (await load("cli/src/ramps.mjs")).scale : undefined;
  const roots = { ...(schemesModule.assetRoots?.() ?? {}), schemes: join(root, "schemes") };
  const grammar = schemesModule.grammar(roots);
  const list = ids ?? schemesModule.schemeIds(roots);
  const ui = uiFacts(root);
  const approvalsFile = join(root, APPROVALS);

  // A changed scheme loads from a copy of the schemes folder, so the checkout is never written.
  const scratch = mkdtempSync(join(tmpdir(), "open-ds-quality-"));
  const scratchRoots = { ...roots, schemes: join(scratch, "schemes") };
  mkdirSync(scratchRoots.schemes);
  // The files go through this checkout's one path (OD-289); the ref's own loader reads them back.
  saveGrammar(grammar, scratchRoots);
  try {
    const schemes = {};
    for (const id of list) {
      const stored = storedScheme(id, roots);
      const scheme = schemesModule.loadScheme(id, roots);
      const reload = (changed) => {
        saveStoredScheme(changed, scratchRoots);
        return schemesModule.loadScheme(id, scratchRoots);
      };
      const dist = join(root, "tokens", "dist", id);
      const css = readCss && existsSync(join(dist, "tokens.css"))
        ? { tokens: readText(join(dist, "tokens.css")), theme: readText(join(dist, "theme.css")), shadcn: readText(join(dist, "shadcn.css")) }
        : null;
      schemes[id] = snapshotScheme({ scheme, stored, grammar, themeTokens, reload: blast ? reload : null, generateScale, css, uiPairs: ui.pairs });
    }
    return {
      ref,
      sha,
      grammar: {
        version: grammar.version ?? null,
        questions: [...(grammar.reasons ?? []), ...(grammar.scopes ?? [])].flatMap((g) => g.questions.map((q) => q.id)),
        traceRules: (grammar.trace ?? []).map((r) => ({ tokens: r.tokens, follows: r.follows })),
      },
      schemes,
      ui,
      approvals: existsSync(approvalsFile) ? approvalsFrom(JSON.parse(readFileSync(approvalsFile, "utf8"))) : [],
      // OD-299: the recorded reason of each review-tier move between the shared and the graded curve.
      shiftReasons: existsSync(join(root, SHIFT_REASONS)) ? JSON.parse(readFileSync(join(root, SHIFT_REASONS), "utf8")).schemes ?? {} : {},
    };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const arg = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const root = arg("--root");
  const out = arg("--out");
  if (!root || !out) {
    console.error("extract needs --root <checkout> and --out <file.json>.");
    process.exit(2);
  }
  const snapshot = await extractRef({ root, ref: arg("--ref") ?? "working tree", sha: arg("--sha") ?? null, blast: !args.includes("--no-blast"), css: !args.includes("--no-css") });
  writeFileSync(out, JSON.stringify(snapshot));
}
