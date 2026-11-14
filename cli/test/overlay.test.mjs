// The overlay, its schema, the review list, the lockfile, and create writing them.
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { schemeValidator } from "../src/build.mjs";
import { applyOverlay, emptyOverlay, overlayProblems, reviewList } from "../src/overlay.mjs";
import { buildProject, joinProject, overlayValidator, PROJECT_FILES, projectScheme, sha256 } from "../src/project.mjs";
import { grammar, loadScheme, storedScheme } from "../src/schemes.mjs";

const g = grammar();
const source = loadScheme("dense-data");
const validate = schemeValidator();
const validateOverlay = overlayValidator();
const joined = (overlay) => joinProject({ source, overlay, g, stored: storedScheme("dense-data"), validate, validateOverlay });
const rounded = { question: "shape.values", option: "rounded", why: "Our users are new to the tool." };
const rounderPick = {
  brand: "default",
  mode: "base",
  token: "theme.radius.control",
  value: "{radius.4}",
  because: ["shape.values"],
  why: "Rounder controls.",
};

test("an empty overlay joins to the source itself", () => {
  const overlay = emptyOverlay(source);
  assert.ok(validateOverlay(overlay), JSON.stringify(validateOverlay.errors));
  assert.deepEqual(applyOverlay(source, overlay), source);
  const r = joined(overlay);
  assert.ok(r.ok, JSON.stringify(r.problems));
  assert.equal(r.review.open, 0);
});

test("an overlay entry replaces the source value, with its why and because", () => {
  const r = joined({ ...emptyOverlay(source), picks: [rounderPick] });
  assert.ok(r.ok, JSON.stringify([...r.problems, ...r.results.flatMap((x) => x.findings)]));
  const node = r.scheme.tokens.brands.default.theme.base.radius.control;
  assert.equal(node.$value, "{radius.4}");
  assert.equal(node.$extensions["open-ds"].why, "Rounder controls.");
  assert.notEqual(source.tokens.brands.default.theme.base.radius.control.$value, "{radius.4}", "the source is not changed");
});

test("the schema rejects an entry with no because, and the join rejects a because the scheme does not answer", () => {
  const noBecause = { ...emptyOverlay(source), usage: [{ situation: "card", use: "space.inset.container", why: "Room to breathe." }] };
  const r = joined(noBecause);
  assert.equal(r.ok, false);
  assert.match(r.problems.join(), /because/);
  assert.equal(r.scheme, undefined, "a rejected overlay builds nothing");
  const wrongCite = {
    ...emptyOverlay(source),
    usage: [{ situation: "card", use: "space.inset.container", because: ["nope.q9"], why: "Room to breathe." }],
  };
  assert.match(overlayProblems(source, wrongCite, g).join(), /cites nope\.q9, which this scheme does not answer/);
  const unknownToken = {
    ...emptyOverlay(source),
    tokens: [{ path: "semantic.color.nothing", value: "{color.slate.light.0}", because: ["shape.values"], why: "x" }],
  };
  assert.match(overlayProblems(source, unknownToken, g).join(), /has no token semantic\.color\.nothing/);
  const wrongOption = { ...emptyOverlay(source), answers: [{ ...rounded, option: "round" }] };
  assert.match(overlayProblems(source, wrongOption, g).join(), /"round" is not an option of shape\.values/);
});

test("a changed answer opens a review list; an edit or a confirm closes an item", () => {
  const changed = { ...emptyOverlay(source), answers: [rounded] };
  const list = reviewList(source, changed, g);
  assert.equal(list.groups.length, 1);
  assert.equal(list.groups[0].answer, "shape.values");
  assert.equal(list.groups[0].to, "rounded");
  const ids = list.groups[0].items.map((i) => i.id);
  assert.ok(ids.includes("usage:control-corner"), ids.join());
  assert.ok(ids.includes("pick:default/base/radius.control"), ids.join());
  assert.equal(list.open, ids.length);
  // The value did not move: a changed answer only opens the review.
  assert.equal(
    applyOverlay(source, changed).tokens.brands.default.theme.base.radius.control.$value,
    source.tokens.brands.default.theme.base.radius.control.$value,
  );
  const closed = reviewList(source, { ...changed, picks: [rounderPick], reviewed: ["usage:control-corner"] }, g);
  assert.equal(closed.open, ids.length - 2);
  assert.equal(reviewList(source, { ...changed, reviewed: ids }, g).open, 0);
  // The same option as the source opens nothing.
  const same = source.answers.find((a) => a.question === "shape.values");
  assert.equal(reviewList(source, { ...emptyOverlay(source), answers: [{ ...same }] }, g).total, 0);
});

test("a renamed overlay is a new scheme with a link to its source", () => {
  const r = joined({ ...emptyOverlay(source), id: "acme-ops", name: "Acme ops", version: "1.0.0" });
  assert.ok(r.ok, JSON.stringify(r.problems));
  assert.equal(r.scheme.id, "acme-ops");
  assert.equal(r.scheme.name, "Acme ops");
  assert.equal(r.scheme.version, "1.0.0");
});

test("create writes the overlay, the lockfile and the built scheme in place of scheme.json", async () => {
  const { createProject } = await import("../src/create.mjs");
  const work = mkdtempSync(join(tmpdir(), "open-ds-overlay-"));
  const dir = join(work, "ds");
  try {
    const record = createProject("dense-data", dir);
    assert.ok(!existsSync(join(dir, "scheme.json")), "create still copies scheme.json");
    for (const f of [PROJECT_FILES.overlay, PROJECT_FILES.lock, PROJECT_FILES.built]) {
      assert.ok(existsSync(join(dir, f)), f);
      assert.ok(record.files.includes(f), `open-ds.json does not list ${f}`);
    }
    const overlay = JSON.parse(readFileSync(join(dir, PROJECT_FILES.overlay), "utf8"));
    assert.deepEqual(overlay.source, { scheme: "dense-data", version: source.version });
    const lock = JSON.parse(readFileSync(join(dir, PROJECT_FILES.lock), "utf8"));
    const built = readFileSync(join(dir, PROJECT_FILES.built), "utf8");
    assert.equal(lock.built.sha256, sha256(built));
    assert.equal(lock.overlay.sha256, sha256(readFileSync(join(dir, PROJECT_FILES.overlay), "utf8")));
    assert.equal(lock.grammar.version, g.version);
    assert.deepEqual(lock.chain.map((l) => l.scheme), ["dense-data"]);
    assert.deepEqual(Object.keys(lock.scopes), g.scopes.map((s) => s.id));
    assert.deepEqual(JSON.parse(built), source);
    assert.deepEqual(projectScheme(dir), source);

    // An edit to the overlay makes the built file out of date until the next build.
    writeFileSync(join(dir, PROJECT_FILES.overlay), JSON.stringify({ ...overlay, answers: [rounded] }, null, 2));
    assert.throws(() => projectScheme(dir), /Out of date: overlay\.json changed after the last build\. Run: open-ds build/);
    const r = buildProject(dir);
    assert.ok(r.ok);
    assert.ok(r.review.open > 0);
    assert.equal(projectScheme(dir).answers.find((a) => a.question === "shape.values").option, "rounded");

    // A hand edit to the built file is caught.
    writeFileSync(join(dir, PROJECT_FILES.built), `${readFileSync(join(dir, PROJECT_FILES.built), "utf8")} `);
    assert.throws(() => projectScheme(dir), /does not match open-ds\.lock/);

    // A rejected overlay writes nothing: the last good lockfile stays.
    const before = readFileSync(join(dir, PROJECT_FILES.lock), "utf8");
    writeFileSync(join(dir, PROJECT_FILES.overlay), JSON.stringify({ ...overlay, answers: [{ ...rounded, option: "round" }] }));
    const bad = buildProject(dir);
    assert.equal(bad.ok, false);
    assert.deepEqual(bad.written, []);
    assert.equal(readFileSync(join(dir, PROJECT_FILES.lock), "utf8"), before);

    // A source that differs from the lockfile's moves only through an upgrade.
    writeFileSync(join(dir, PROJECT_FILES.overlay), JSON.stringify(overlay));
    const lockData = JSON.parse(before);
    lockData.chain[0].sha256 = "0".repeat(64);
    writeFileSync(join(dir, PROJECT_FILES.lock), JSON.stringify(lockData));
    assert.throws(() => buildProject(dir), /Run: open-ds upgrade/);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
});
