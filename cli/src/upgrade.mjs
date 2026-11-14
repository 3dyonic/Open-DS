// open-ds upgrade (ADR-002 section 7): move a project's source to the installed version. It compares
// three things: the old source, the new source and the overlay. A source change the overlay does not
// touch applies quietly; an overlay entry on a value the source also changed is a conflict; a numbered
// migration rewrites renamed paths in the overlay; a new grammar question goes on the review list.
// An older project with a full scheme.json gets an overlay of its differences first.
// The compare functions are pure. upgradeProject does the file access; fetchRoots is passed in.

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CARRIED_WHY, ENTRY_KINDS, MODES, emptyOverlay, entryKey, sourceValue } from "./overlay.mjs";
import { PROJECT_FILES, buildProject, json, packageInfo, readLock, scopeHashes, sha256 } from "./project.mjs";
import { assetRoots, grammar, loadScheme, questions, schemeIds } from "./schemes.mjs";
import { flatTokens, tokenAt } from "./tokens.mjs";

/**
 * The numbered migrations. Each renames paths in one source version:
 * { id, version, why, tokens: { "<old path>": "<new path>" }, situations: { … }, questions: { … } }.
 * A token path has no tier: "radius.container" renames theme.radius.container and semantic.radius.container.
 * The list is empty while no source version renames a path.
 */
export const MIGRATIONS = [];

/** -1, 0 or 1: how version a compares with version b (major.minor.patch). */
export function compareVersions(a, b) {
  const parts = (v) => String(v).split(/[.+-]/).slice(0, 3).map(Number);
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) < (y[i] || 0) ? -1 : 1;
  return 0;
}

/** The migrations a move from version from to version to runs, in order. */
export function migrationsBetween(from, to, migrations = MIGRATIONS) {
  return migrations
    .filter((m) => compareVersions(m.version, from) > 0 && compareVersions(m.version, to) <= 0)
    .sort((a, b) => a.id - b.id);
}

/** A path renamed by a map of old to new paths: an exact match, or a match on a whole leading part. */
function renamed(path, map) {
  for (const [from, to] of Object.entries(map ?? {}))
    if (path === from || path.startsWith(`${from}.`)) return to + path.slice(from.length);
  return path;
}

/** One migration applied to an overlay: every renamed token, situation and question, in every entry and in reviewed. */
export function migrateOverlay(overlay, migration) {
  const next = structuredClone(overlay);
  const token = (p) => renamed(p, migration.tokens);
  const ref = (v) => (typeof v === "string" ? v.replace(/^\{([^}]+)\}$/, (_, p) => `{${token(p)}}`) : v);
  const tiered = (p) => p.replace(/^(\w+)\.(.+)$/, (_, tier, rest) => `${tier}.${token(rest)}`);
  const question = (q) => migration.questions?.[q] ?? q;
  const cite = (e) => (e.because ? { ...e, because: e.because.map(question) } : e);
  next.answers = next.answers.map((a) => cite({ ...a, question: question(a.question) }));
  next.picks = next.picks.map((p) => cite({ ...p, token: tiered(p.token), value: ref(p.value) }));
  next.tokens = next.tokens.map((t) => cite({ ...t, path: tiered(t.path), value: ref(t.value) }));
  next.usage = next.usage.map((u) =>
    cite({ ...u, situation: migration.situations?.[u.situation] ?? u.situation, use: token(u.use), ...(u.not && { not: token(u.not) }) }),
  );
  next.reviewed = next.reviewed.map((id) => {
    const [kind, rest] = [id.slice(0, id.indexOf(":")), id.slice(id.indexOf(":") + 1)];
    if (kind === "answer") return `answer:${question(rest)}`;
    if (kind === "usage") return `usage:${migration.situations?.[rest] ?? rest}`;
    if (kind === "token") return `token:${tiered(rest)}`;
    if (kind === "pick") return `pick:${rest.replace(/^([^/]+\/[^/]+\/)(.+)$/, (_, head, p) => head + token(p))}`;
    return id;
  });
  return next;
}

/** The part of a source value that an overlay entry replaces, for the three-way compare. */
const core = (kind, v) => (v === undefined ? undefined : JSON.stringify(kind === "answers" ? v.option : kind === "usage" ? [v.use, v.not] : v.value));

/**
 * The three-way compare. For each overlay entry: when the old and the new source hold the same value, the
 * entry stays; when they differ, it is a conflict. decide(key) says "keep" (the overlay's value stays) or
 * "take" (the entry goes, and the new source's value applies); undefined leaves the conflict open.
 * Returns { overlay, conflicts: [{ key, kind, mine, old, new }], kept, taken }. conflicts holds the open ones.
 */
export function threeWay({ oldSource, newSource, overlay, decide = () => undefined }) {
  const next = structuredClone(overlay);
  const conflicts = [];
  const kept = [];
  const taken = [];
  for (const kind of ENTRY_KINDS)
    next[kind] = (overlay[kind] ?? []).filter((entry) => {
      const before = core(kind, sourceValue(oldSource, kind, entry));
      const after = core(kind, sourceValue(newSource, kind, entry));
      if (before === after) return true;
      const key = entryKey[kind](entry);
      const choice = decide(key);
      if (choice === "take") {
        taken.push(key);
        return false;
      }
      if (choice === "keep") kept.push(key);
      else conflicts.push({ key, kind, mine: entry, old: sourceValue(oldSource, kind, entry), new: sourceValue(newSource, kind, entry) });
      return true;
    });
  return { overlay: next, conflicts, kept, taken };
}

/** The scopes whose slice differs between two sources: [scope id]. */
export function changedScopes(oldSource, newSource, g) {
  const before = scopeHashes(oldSource, g);
  const after = scopeHashes(newSource, g);
  return Object.keys(after).filter((id) => before[id]?.sha256 !== after[id].sha256);
}

/** A review item for each question the new grammar has and the old one does not. It takes the source's answer. */
export function newQuestions(oldGrammar, newGrammar, newSource) {
  const before = questions(oldGrammar);
  return Object.values(questions(newGrammar))
    .filter((q) => !before[q.id])
    .map((q) => {
      const a = newSource.answers.find((x) => x.question === q.id);
      const label = q.options.find((o) => o.id === a?.option)?.label ?? a?.option ?? "no answer";
      return { id: `answer:${q.id}`, kind: "new question", what: `${q.text} (new question; the source answers ${label})` };
    });
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const because = (...nodes) => nodes.map((n) => n?.$extensions?.["open-ds"]?.because ?? n?.because).find((b) => b?.length);
const scalar = (v) => typeof v === "string" || typeof v === "number";

/**
 * The overlay of an older project: each difference between its full scheme.json and the source it was
 * created from, as an entry with the why "carried over from scheme.json". Returns { overlay, notCarried }.
 * notCarried names each difference an overlay cannot hold, such as the voice or a token the source lacks.
 */
export function importOverlay(source, project) {
  const overlay = emptyOverlay(source);
  const notCarried = [];
  const why = CARRIED_WHY;
  for (const a of project.answers ?? []) {
    const s = source.answers.find((x) => x.question === a.question);
    if (!s) notCarried.push(`answer:${a.question} (the source has no such question)`);
    else if (a.option !== s.option || a.why !== s.why || !same(a.because, s.because))
      overlay.answers.push({ question: a.question, option: a.option, why, ...(!same(a.because, s.because) && { because: a.because ?? [] }) });
  }
  for (const u of project.usage ?? []) {
    const s = source.usage.find((x) => x.situation === u.situation);
    if (s && same(u, s)) continue;
    const cites = because(u, s);
    if (!cites) {
      notCarried.push(`usage:${u.situation} (no because)`);
      continue;
    }
    const { situation, use, not, example } = u;
    overlay.usage.push({ situation, use, ...(not && { not }), ...(example && { example }), because: cites, why });
  }
  for (const [brand, def] of Object.entries(project.tokens?.brands ?? {})) {
    if (!source.tokens.brands[brand]) {
      notCarried.push(`brand ${brand} (the source has no such brand)`);
      continue;
    }
    for (const mode of MODES)
      for (const [path, t] of flatTokens(def.theme?.[mode])) {
        const s = tokenAt(source.tokens.brands[brand].theme?.[mode] ?? {}, path);
        if (s && same(s.$value, t.$value)) continue;
        const key = `pick:${brand}/${mode}/${path}`;
        const cites = because(t, s);
        if (!s) notCarried.push(`${key} (the source has no such pick)`);
        else if (!cites) notCarried.push(`${key} (no because)`);
        else if (!/^\{[^}]+\}$/.test(String(t.$value))) notCarried.push(`${key} (a pick points at a token)`);
        else overlay.picks.push({ brand, mode, token: `theme.${path}`, value: t.$value, because: cites, why });
      }
  }
  for (const tier of ["primitive", "semantic", "component"])
    for (const [path, t] of flatTokens(project.tokens?.[tier])) {
      const s = tokenAt(source.tokens[tier] ?? {}, path);
      if (s && same(s.$value, t.$value)) continue;
      const key = `token:${tier}.${path}`;
      const cites = because(t, s);
      if (!s) notCarried.push(`${key} (the source has no such token)`);
      else if (!cites) notCarried.push(`${key} (no because)`);
      else if (!scalar(t.$value)) notCarried.push(`${key} (a value with parts)`);
      else overlay.tokens.push({ path: `${tier}.${path}`, value: t.$value, because: cites, why });
    }
  const covered = new Set(["answers", "usage", "tokens", "id", "version"]);
  for (const [field, value] of Object.entries(project))
    if (!covered.has(field) && !same(value, source[field])) notCarried.push(field);
  if (!same(project.tokens?.content, source.tokens.content)) notCarried.push("tokens.content");
  return { overlay, notCarried };
}

/**
 * The roots of a released open-ds package, from npm: its schemes and schemas. The caller removes dir.
 * Each released source stays in the npm package history, so an upgrade can always read the old source.
 */
export function npmPackageRoots(version) {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-source-"));
  const name = `${packageInfo().name}@${version}`;
  const file = execFileSync("npm", ["pack", name, "--silent", "--pack-destination", dir], { encoding: "utf8" }).trim().split("\n").pop();
  execFileSync("tar", ["-xzf", join(dir, file), "-C", dir]);
  const assets = join(dir, "package", "assets");
  const roots = { schemes: join(assets, "schemes"), schema: join(assets, "schema") };
  if (!existsSync(roots.schemes) || !schemeIds(roots).length)
    throw new Error(`${name} has no schemes. Pass the package version the project was made with: open-ds upgrade --from-package <version>`);
  return { roots, dir };
}

/** The open-ds version an older project was created with, from its package.json, or null. */
function createdWith(dir) {
  const path = join(dir, "package.json");
  if (!existsSync(path)) return null;
  const range = JSON.parse(readFileSync(path, "utf8")).devDependencies?.["open-ds"] ?? "";
  return range.match(/\d+\.\d+\.\d+/)?.[0] ?? null;
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

/**
 * Upgrade the project in dir to the installed source. decide(key) resolves conflicts ("keep" or "take").
 * fetchRoots(version) gives { roots, dir } of a released package (npmPackageRoots by default); dir is
 * removed after. accept takes the source's changes into a renamed scheme, whose upgrades are opt in.
 * Writes nothing while a conflict is open, while a renamed scheme has not accepted, or when the build fails.
 * Returns { status, from, to, scopes, migrations, conflicts, kept, taken, carried, notCarried, raised, build }.
 */
export function upgradeProject(
  dir,
  { roots = assetRoots(), fetchRoots = npmPackageRoots, decide = () => undefined, accept = false, fromPackage, migrations = MIGRATIONS } = {},
) {
  const overlayPath = join(dir, PROJECT_FILES.overlay);
  const lock = readLock(dir);
  const older = !existsSync(overlayPath);
  if (older && !existsSync(join(dir, "scheme.json")))
    throw new Error(`${dir} has no ${PROJECT_FILES.overlay} and no scheme.json. Run upgrade in a project that open-ds create made.`);
  const project = older ? readJson(join(dir, "scheme.json")) : null;
  const before = older ? null : readJson(overlayPath);
  const sourceId = older ? (readJson(join(dir, "open-ds.json")).scheme ?? project.id) : before.source.scheme;
  const g = grammar(roots);
  const newSource = loadScheme(sourceId, roots);
  if (!older && lock?.chain?.[0]?.sha256 === sha256(json(newSource)))
    return { status: "current", from: before.source.version, to: newSource.version, scopes: [] };

  const version = fromPackage ?? (older ? createdWith(dir) : lock?.package?.version);
  if (!version)
    throw new Error(`Cannot tell which open-ds made this project. Run: open-ds upgrade --from-package <version>`);
  const fetched = fetchRoots(version);
  let oldSource;
  let oldGrammar;
  try {
    oldSource = loadScheme(sourceId, fetched.roots);
    oldGrammar = grammar(fetched.roots);
  } finally {
    if (fetched.dir) rmSync(fetched.dir, { recursive: true, force: true });
  }

  const imported = older ? importOverlay(oldSource, project) : null;
  let overlay = imported ? imported.overlay : before;
  const steps = migrationsBetween(oldSource.version, newSource.version, migrations);
  for (const m of steps) overlay = migrateOverlay(overlay, m);
  const compared = threeWay({ oldSource, newSource, overlay, decide });
  const report = {
    from: oldSource.version,
    to: newSource.version,
    scopes: changedScopes(oldSource, newSource, g),
    migrations: steps.map((m) => m.id),
    conflicts: compared.conflicts,
    kept: compared.kept,
    taken: compared.taken,
    carried: imported ? ENTRY_KINDS.reduce((n, k) => n + imported.overlay[k].length, 0) : 0,
    notCarried: imported?.notCarried ?? [],
  };
  if (compared.conflicts.length) return { ...report, status: "conflicts" };
  if (overlay.id && !accept) return { ...report, status: "opt-in" };

  const next = { ...compared.overlay, source: { scheme: newSource.id, version: newSource.version } };
  const raised = [...(lock?.raised ?? []).filter((i) => !(next.reviewed ?? []).includes(i.id)), ...newQuestions(oldGrammar, g, newSource)];
  const unique = [...new Map(raised.map((i) => [i.id, i])).values()];
  const previous = older ? null : readFileSync(overlayPath, "utf8");
  writeFileSync(overlayPath, json(next));
  const build = buildProject(dir, { roots, raised: unique, newSource: true });
  if (!build.ok) {
    // A failed build leaves the project as it was.
    if (previous === null) rmSync(overlayPath, { force: true });
    else writeFileSync(overlayPath, previous);
    return { ...report, raised: unique, build, status: "build-failed" };
  }
  return { ...report, raised: unique, build, status: "upgraded" };
}
