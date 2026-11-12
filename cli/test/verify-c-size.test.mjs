// Independent verifier: seeded size defects against the OD-298 gate.
import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { editScheme, row, seeded, setToken } from "./verify-c-fixture.mjs";

const addUnused = (n) => (root) =>
  editScheme(root, "dense-data", (s) => {
    for (let i = 1; i <= n; i++) setToken(s, `semantic.space.gap.verify-c-${i}`, "{space.4}");
  });

describe("seeded size defects", () => {
  let base;
  let baseCss;
  before(async () => {
    base = await seeded(() => {});
    baseCss = await seeded(() => {}, { css: true });
  });

  test("token-count defect: five new semantic tokens raise the count", async () => {
    const card = compareSnapshots(base, await seeded(addUnused(5)));
    const r = row(card, "size.tokens");
    assert.ok(r.candidate > r.base, JSON.stringify(r));
    console.log(`size.tokens delta for 5 semantic tokens: ${r.candidate - r.base} (gated=${r.gated})`);
  });

  test("unused-semantics defect 1: five semantic tokens no component reads", async () => {
    const card = compareSnapshots(base, await seeded(addUnused(5)));
    const r = row(card, "size.unused-semantics");
    assert.equal(r.candidate - r.base, 5, JSON.stringify(r));
    assert.ok(!r.pass);
  });

  test("unused-semantics defect 2: a new unused semantic color", async () => {
    const card = compareSnapshots(
      base,
      await seeded((root) => editScheme(root, "dense-data", (s) => setToken(s, "semantic.color.surface.verify-c", "{theme.color.surface.raised}"))),
    );
    const r = row(card, "size.unused-semantics");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
  });

  test("css-bytes defect: the built CSS grows with the new tokens", async () => {
    const card = compareSnapshots(baseCss, await seeded(addUnused(5), { css: true }));
    const r = row(card, "size.css-bytes");
    assert.ok(typeof r.base === "number" && r.candidate > r.base, JSON.stringify(r));
    console.log(`size.css-bytes ${r.base} -> ${r.candidate} (gated=${r.gated})`);
  });

  test("clean: re-pointing an existing semantic token changes no size row", async () => {
    const card = compareSnapshots(base, await seeded((root) => editScheme(root, "dense-data", (s) => setToken(s, "semantic.space.gap.tight", "{space.2}"))));
    for (const id of ["size.tokens", "size.unused-semantics"]) {
      const r = row(card, id);
      assert.equal(r.candidate, r.base, `${id}: ${JSON.stringify(r)}`);
    }
  });
});
