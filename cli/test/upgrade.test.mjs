// open-ds upgrade: the three-way compare, migrations on overlays, new questions and the import from older projects.
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { CARRIED_WHY, emptyOverlay } from "../src/overlay.mjs";
import { buildProject, json, PROJECT_FILES, projectScheme, readLock, sha256 } from "../src/project.mjs";
import { assetRoots, grammar, loadScheme, saveScheme } from "../src/schemes.mjs";
import { migrateOverlay, migrationsBetween, newQuestions, threeWay, upgradeProject } from "../src/upgrade.mjs";

const roots = assetRoots();
const g = grammar(roots);
const source = loadScheme("dense-data", roots);
let work;
let oldRoots;

// The old source: the brand.q1 answer has another why, and the surface radius pick another value.
before(() => {
  work = mkdtempSync(join(tmpdir(), "open-ds-upgrade-"));
  oldRoots = { ...roots, schemes: join(work, "schemes"), schema: join(work, "schema") };
  cpSync(roots.schemes, oldRoots.schemes, { recursive: true });
  cpSync(roots.schema, oldRoots.schema, { recursive: true });
  const old = loadScheme("dense-data", oldRoots);
  old.answers.find((a) => a.question === "brand.q1").why = "An older reason.";
  old.tokens.brands.default.theme.base.radius.surface.$value = "{radius.2}";
  saveScheme(old, oldRoots);
});
after(() => rmSync(work, { recursive: true, force: true }));

const pick = (token, value, why) => ({ brand: "default", mode: "base", token, value, because: ["shape.values"], why });
const userOverlay = () => ({
  ...emptyOverlay(source),
  answers: [{ question: "shape.values", option: "rounded", why: "Our users are new to the tool." }],
  picks: [pick("theme.radius.control", "{radius.4}", "Rounder controls."), pick("theme.radius.surface", "{radius.0}", "Square panels.")],
});

/** A project built on the old source, as an earlier open-ds would leave it. */
function oldProject(name) {
  const dir = join(work, name);
  mkdirSync(dir);
  writeFileSync(join(dir, PROJECT_FILES.overlay), json(userOverlay()));
  const r = buildProject(dir, { roots: oldRoots, raised: [], newSource: true });
  assert.ok(r.ok, JSON.stringify(r.problems));
  return dir;
}
const fetchOld = () => ({ roots: oldRoots });

test("an upgrade keeps a user edit, asks on a conflict and lists a changed answer for review", () => {
  const dir = oldProject("keeps-edits");
  const overlayBefore = readFileSync(join(dir, PROJECT_FILES.overlay), "utf8");
  // The installed source differs from the lockfile's, so only an upgrade may move it.
  assert.throws(() => buildProject(dir, { roots }), /Run: open-ds upgrade/);

  const stopped = upgradeProject(dir, { roots, fetchRoots: fetchOld });
  assert.equal(stopped.status, "conflicts");
  assert.deepEqual(
    stopped.conflicts.map((c) => [c.key, c.old.value, c.new.value, c.mine.value]),
    [["pick:default/base/radius.surface", "{radius.2}", "{radius.4}", "{radius.0}"]],
  );
  assert.ok(stopped.scopes.includes("shape"), stopped.scopes.join());
  assert.equal(readFileSync(join(dir, PROJECT_FILES.overlay), "utf8"), overlayBefore, "a conflict writes nothing");

  const r = upgradeProject(dir, { roots, fetchRoots: fetchOld, decide: (key) => (key === "pick:default/base/radius.surface" ? "keep" : undefined) });
  assert.equal(r.status, "upgraded");
  assert.deepEqual(r.kept, ["pick:default/base/radius.surface"]);
  const built = projectScheme(dir);
  assert.equal(built.tokens.brands.default.theme.base.radius.control.$value, "{radius.4}", "the user edit stays");
  assert.equal(built.tokens.brands.default.theme.base.radius.surface.$value, "{radius.0}", "the kept conflict stays");
  assert.equal(built.answers.find((a) => a.question === "brand.q1").why, source.answers.find((a) => a.question === "brand.q1").why, "the quiet source change applies");
  const group = r.build.review.groups.find((x) => x.answer === "shape.values");
  assert.ok(group && group.items.some((i) => i.open), "the changed answer is on the review list");
  assert.equal(readLock(dir).chain[0].sha256, sha256(json(source)));
  assert.equal(upgradeProject(dir, { roots, fetchRoots: fetchOld }).status, "current");
});

test("taking the source drops the overlay entry", () => {
  const dir = oldProject("takes-source");
  const r = upgradeProject(dir, { roots, fetchRoots: fetchOld, decide: () => "take" });
  assert.equal(r.status, "upgraded");
  const overlay = JSON.parse(readFileSync(join(dir, PROJECT_FILES.overlay), "utf8"));
  assert.deepEqual(overlay.picks.map((p) => p.token), ["theme.radius.control"]);
  assert.equal(projectScheme(dir).tokens.brands.default.theme.base.radius.surface.$value, "{radius.4}");
});

test("a renamed scheme takes source changes only when the user accepts", () => {
  const dir = oldProject("renamed");
  const overlay = { ...JSON.parse(readFileSync(join(dir, PROJECT_FILES.overlay), "utf8")), id: "acme-ops", name: "Acme ops", picks: [] };
  writeFileSync(join(dir, PROJECT_FILES.overlay), json(overlay));
  assert.ok(buildProject(dir, { roots: oldRoots, newSource: true }).ok);
  assert.equal(upgradeProject(dir, { roots, fetchRoots: fetchOld }).status, "opt-in");
  assert.equal(JSON.parse(readFileSync(join(dir, PROJECT_FILES.overlay), "utf8")).source.version, source.version);
  const r = upgradeProject(dir, { roots, fetchRoots: fetchOld, accept: true });
  assert.equal(r.status, "upgraded");
  assert.deepEqual(readLock(dir).chain.map((l) => l.scheme), ["dense-data", "acme-ops"]);
});

test("the three-way compare leaves an entry alone when the source did not move under it", () => {
  const overlay = userOverlay();
  const r = threeWay({ oldSource: source, newSource: source, overlay });
  assert.deepEqual(r.overlay, overlay);
  assert.deepEqual(r.conflicts, []);
});

test("a migration rewrites renamed paths in an overlay", () => {
  const migration = { id: 1, version: "0.2.0", why: "surface reads better", tokens: { "radius.surface": "radius.panel" }, situations: { card: "panel" } };
  const overlay = {
    ...userOverlay(),
    tokens: [{ path: "semantic.radius.surface", value: "{radius.surface}", because: ["shape.values"], why: "x" }],
    usage: [{ situation: "card", use: "radius.surface", because: ["shape.values"], why: "x" }],
    reviewed: ["pick:default/base/radius.surface", "usage:card"],
  };
  const next = migrateOverlay(overlay, migration);
  assert.deepEqual(next.picks.map((p) => p.token), ["theme.radius.control", "theme.radius.panel"]);
  assert.deepEqual([next.tokens[0].path, next.tokens[0].value], ["semantic.radius.panel", "{radius.panel}"]);
  assert.deepEqual([next.usage[0].situation, next.usage[0].use], ["panel", "radius.panel"]);
  assert.deepEqual(next.reviewed, ["pick:default/base/radius.panel", "usage:panel"]);
  assert.deepEqual(migrationsBetween("0.1.0", "0.2.0", [migration]), [migration]);
  assert.deepEqual(migrationsBetween("0.2.0", "0.3.0", [migration]), []);
});

test("a new grammar question goes on the review list with the source's answer", () => {
  const older = structuredClone(g);
  const scope = older.scopes.find((s) => s.questions.some((q) => q.id === "shape.values"));
  scope.questions = scope.questions.filter((q) => q.id !== "shape.values");
  const items = newQuestions(older, g, source);
  assert.deepEqual(items.map((i) => [i.id, i.kind]), [["answer:shape.values", "new question"]]);
  assert.match(items[0].what, /the source answers/);
});

test("an older project with a full scheme.json gets an overlay of its differences", () => {
  const dir = join(work, "older");
  const project = structuredClone(source);
  project.tokens.brands.default.theme.base.radius.control.$value = "{radius.4}";
  project.usage[0].use = `${project.usage[0].use} (our team's rule)`;
  project.voice = { ...project.voice, extra: true };
  mkdirSync(dir);
  writeFileSync(join(dir, "scheme.json"), json(project));
  writeFileSync(join(dir, "open-ds.json"), json({ kind: "project", scheme: "dense-data", version: source.version }));
  writeFileSync(join(dir, "package.json"), json({ devDependencies: { "open-ds": "^0.3.0" } }));
  let asked;
  const r = upgradeProject(dir, { roots, fetchRoots: (v) => ((asked = v), { roots }) });
  assert.equal(asked, "0.3.0", "the source comes from the version that made the project");
  assert.equal(r.status, "upgraded");
  assert.equal(r.carried, 2);
  assert.deepEqual(r.notCarried, ["voice"]);
  const overlay = JSON.parse(readFileSync(join(dir, PROJECT_FILES.overlay), "utf8"));
  assert.equal(overlay.picks[0].why, CARRIED_WHY);
  assert.equal(overlay.usage[0].situation, project.usage[0].situation);
  const carried = r.build.review.groups.find((x) => x.answer === "carried over");
  assert.equal(carried.items.filter((i) => i.open).length, 2);
  assert.ok(existsSync(join(dir, "scheme.json")), "upgrade deletes nothing");
  assert.equal(projectScheme(dir).tokens.brands.default.theme.base.radius.control.$value, "{radius.4}");
});
