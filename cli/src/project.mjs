// A project's scheme files (ADR-002 sections 3 to 6): overlay.json (the user's layer), open-ds.lock (the
// versions and hashes it was built from) and build/scheme.json (the joined scheme every reader reads).
// joinProject and lockFor are pure; buildProject, readLock and projectScheme do the file access.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { builtText, schemeValidator } from "./build.mjs";
import { MODES, applyOverlay, overlayProblems, reviewList } from "./overlay.mjs";
import { checkScheme } from "./scheme-checks.mjs";
import { assetRoots, grammar, loadScheme, overlaySchema, storedScheme } from "./schemes.mjs";

/** Where a project keeps its scheme files, relative to the project folder. */
export const PROJECT_FILES = { overlay: "overlay.json", lock: "open-ds.lock", built: "build/scheme.json" };

/** The lockfile format version. A change to the lockfile's shape raises it. */
export const LOCKFILE_VERSION = 1;

const PACKAGE = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8"));

/** The installed open-ds package: its name and version. */
export const packageInfo = () => ({ name: PACKAGE.name, version: PACKAGE.version });

export const sha256 = (text) => createHash("sha256").update(text).digest("hex");
export const json = (data) => `${JSON.stringify(data, null, 2)}\n`;

/** The compiled overlay schema: a function that takes an overlay and sets .errors when it fails. */
export function overlayValidator(roots = assetRoots()) {
  return new Ajv2020({ allErrors: true, strict: false }).compile(overlaySchema(roots));
}

/**
 * The part of a scheme each grammar scope owns: its answers, the usage rules of its situations, and its
 * token groups in the semantics, the component keys, the content and each brand's theme. The lockfile
 * hashes each slice, so an upgrade can say which scopes changed.
 */
export function scopeSlices(scheme, g) {
  const at = (tree, path) => path.split(".").reduce((n, p) => n?.[p], tree);
  const tier = (path) => (path === "component" || path === "content" ? at(scheme.tokens, path) : at(scheme.tokens.semantic, path));
  const slices = {};
  for (const scope of g.scopes) {
    const ids = new Set(scope.questions.map((q) => q.id));
    const situations = new Set(scope.situations ?? []);
    slices[scope.id] = {
      answers: scheme.answers.filter((a) => ids.has(a.question)),
      usage: scheme.usage.filter((u) => situations.has(u.situation)),
      tokens: (scope.owns ?? []).map((path) => ({
        path,
        tokens: tier(path) ?? null,
        brands: Object.fromEntries(
          Object.entries(scheme.tokens.brands).map(([b, def]) => [
            b,
            Object.fromEntries(MODES.map((m) => [m, at(def.theme?.[m], path) ?? null])),
          ]),
        ),
      })),
    };
  }
  return slices;
}

/** Each scope's version and hash: { <scope>: { version, sha256 } }. A scope takes its scheme's version. */
export function scopeHashes(scheme, g) {
  return Object.fromEntries(
    Object.entries(scopeSlices(scheme, g)).map(([id, slice]) => [id, { version: scheme.version, sha256: sha256(json(slice)) }]),
  );
}

/**
 * The lockfile (ADR-002 section 6): the package and grammar versions, the chain of schemes (root first),
 * each scope's version and hash, the overlay's hash and the built file's hash. raised holds the review
 * items a tool added, such as a new grammar question after an upgrade.
 */
export function lockFor({ source, g, overlay, overlayText, builtHash, raised = [], pkg = packageInfo() }) {
  const chain = [{ scheme: source.id, version: source.version, sha256: sha256(json(source)) }];
  // A renamed overlay is a scheme of its own, linked to its source (ADR-002 section 9).
  if (overlay.id) chain.push({ scheme: overlay.id, version: overlay.version ?? source.version, sha256: sha256(overlayText) });
  return {
    $comment: "Written by open-ds build. Do not edit: the versions and hashes this project's scheme was built from.",
    lockfile: LOCKFILE_VERSION,
    package: pkg,
    grammar: { version: g.version, sha256: sha256(json(g)) },
    chain,
    scopes: scopeHashes(source, g),
    overlay: { path: PROJECT_FILES.overlay, sha256: sha256(overlayText) },
    built: { path: PROJECT_FILES.built, sha256: builtHash },
    raised,
  };
}

/**
 * Join a source and an overlay, and check the result (ADR-002 section 3). No file access.
 * Returns { ok, problems, results, scheme, text, hash, review }. problems are overlay problems; results are
 * the scheme rules. When the overlay fails its schema or its problems, nothing else runs.
 */
export function joinProject({ source, overlay, g, stored, raised = [], validate, validateOverlay }) {
  if (!validateOverlay(overlay)) {
    const problems = (validateOverlay.errors ?? []).map((e) => `${PROJECT_FILES.overlay} ${e.instancePath || "/"} ${e.message}`);
    return { ok: false, problems, results: [] };
  }
  const problems = overlayProblems(source, overlay, g);
  if (problems.length) return { ok: false, problems, results: [] };
  const scheme = applyOverlay(source, overlay);
  const results = checkScheme(scheme, { grammar: g, validate, stored });
  const { text, hash } = builtText(scheme);
  const review = reviewList(source, overlay, g, raised);
  return { ok: results.every((r) => !r.findings.length), problems, results, scheme, text, hash, review };
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

/** The project's lockfile, or null when it has none. */
export function readLock(dir) {
  const path = join(dir, PROJECT_FILES.lock);
  return existsSync(path) ? readJson(path) : null;
}

/** True when dir holds a project with an overlay. */
export const isOverlayProject = (dir) => existsSync(join(dir, PROJECT_FILES.overlay));

/** The project's overlay and its text. Fails with a plain message when the file is not JSON. */
export function readOverlay(dir) {
  const path = join(dir, PROJECT_FILES.overlay);
  if (!existsSync(path))
    throw new Error(`No ${PROJECT_FILES.overlay} in ${dir}. Run "open-ds create" for a new project, or "open-ds upgrade" in an older one.`);
  const text = readFileSync(path, "utf8");
  try {
    return { overlay: JSON.parse(text), text };
  } catch (error) {
    throw new Error(`${PROJECT_FILES.overlay} is not valid JSON: ${error.message}. Fix the file, then run: open-ds build`);
  }
}

/** The source scheme an overlay names, from the installed package. Fails when the versions differ. */
export function sourceFor(overlay, roots = assetRoots()) {
  const source = loadScheme(overlay.source.scheme, roots);
  if (source.version !== overlay.source.version)
    throw new Error(
      `${PROJECT_FILES.overlay} is written against ${source.id} ${overlay.source.version}, and this open-ds has ${source.version}. Run: open-ds upgrade`,
    );
  return source;
}

/**
 * Build a project: join its source and overlay.json, check the result, and write build/scheme.json and
 * open-ds.lock. A failed check writes nothing. raised replaces the lockfile's raised items; by default
 * they stay. A source that differs from the lockfile's fails, because only an upgrade may move it;
 * newSource lets the upgrade through. Returns joinProject's result with { lock, written }.
 */
export function buildProject(dir, { roots = assetRoots(), raised, newSource = false } = {}) {
  const { overlay, text: overlayText } = readOverlay(dir);
  const g = grammar(roots);
  const source = sourceFor(overlay, roots);
  const before = readLock(dir);
  if (!newSource && before && before.chain?.[0]?.sha256 !== sha256(json(source)))
    throw new Error(
      `The installed open-ds ${packageInfo().version} has a different ${source.id} source than ${PROJECT_FILES.lock} (open-ds ${before.package?.version}). Run: open-ds upgrade`,
    );
  const keep = raised ?? before?.raised ?? [];
  const r = joinProject({
    source,
    overlay,
    g,
    stored: storedScheme(source.id, roots),
    raised: keep,
    validate: schemeValidator(roots),
    validateOverlay: overlayValidator(roots),
  });
  if (!r.ok) return { ...r, written: [] };
  const lock = lockFor({ source, g, overlay, overlayText, builtHash: r.hash, raised: keep });
  mkdirSync(join(dir, dirname(PROJECT_FILES.built)), { recursive: true });
  writeFileSync(join(dir, PROJECT_FILES.built), r.text);
  writeFileSync(join(dir, PROJECT_FILES.lock), json(lock));
  return { ...r, lock, written: [PROJECT_FILES.built, PROJECT_FILES.lock] };
}

/**
 * The joined scheme of a project, from build/scheme.json. null when dir is not a project with an overlay
 * and a lockfile. Fails with "Out of date" when the overlay or the built file changed after the last build.
 */
export function projectScheme(dir) {
  const lock = readLock(dir);
  if (!lock || !isOverlayProject(dir)) return null;
  const builtPath = join(dir, PROJECT_FILES.built);
  const overlayText = readFileSync(join(dir, PROJECT_FILES.overlay), "utf8");
  if (sha256(overlayText) !== lock.overlay.sha256)
    throw new Error(`Out of date: ${PROJECT_FILES.overlay} changed after the last build. Run: open-ds build`);
  if (!existsSync(builtPath)) throw new Error(`Out of date: ${PROJECT_FILES.built} is missing. Run: open-ds build`);
  const text = readFileSync(builtPath, "utf8");
  if (sha256(text) !== lock.built.sha256)
    throw new Error(`Out of date: ${PROJECT_FILES.built} does not match ${PROJECT_FILES.lock}. Do not edit it by hand. Run: open-ds build`);
  return JSON.parse(text);
}
