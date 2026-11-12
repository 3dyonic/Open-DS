// Independent verifier: seeded motion defects against the OD-298 gate.
import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { editFile, editScheme, row, seeded, setToken } from "./verify-c-fixture.mjs";

const REDUCED = "  @media (prefers-reduced-motion: reduce) {\n";
const injectReduced = (decl) => (root) =>
  editFile(root, "ui/src/styles.css", (t) => t.replace(REDUCED, `${REDUCED}    .verify-c { ${decl} }\n`));

describe("seeded motion defects", () => {
  let base;
  before(async () => {
    base = await seeded(() => {});
  });
  const run = async (mutate) => compareSnapshots(base, await seeded(mutate));
  const failed = (card, id) => {
    const r = row(card, id);
    return r.candidate > r.base && !r.pass;
  };

  test("reduced-motion defect 1: transform: translateY inside the reduce block", async () => {
    const card = await run(injectReduced("transform: translateY(0.25rem);"));
    assert.ok(failed(card, "motion.reduced-motion-transforms"), JSON.stringify(row(card, "motion.reduced-motion-transforms")));
  });

  test("reduced-motion defect 2: the individual `scale` property in a new CSS file", async () => {
    const card = await run((root) =>
      editFile(root, "ui/src/verify-c.css", () => "@media (prefers-reduced-motion: reduce) {\n  .sheet {\n    scale: 0.98;\n  }\n}\n"),
    );
    assert.ok(failed(card, "motion.reduced-motion-transforms"), JSON.stringify(row(card, "motion.reduced-motion-transforms")));
  });

  test("reduced-motion defect 3: the individual `translate` property", async () => {
    const card = await run(injectReduced("translate: 0 4px;"));
    assert.ok(failed(card, "motion.reduced-motion-transforms"), JSON.stringify(row(card, "motion.reduced-motion-transforms")));
  });

  test("reduced-motion defect 4: Tailwind motion-reduce:translate-y-1 in a component", async () => {
    const card = await run((root) =>
      editFile(root, "ui/src/components/toggle.tsx", (t) => t.replace('"inline-flex items-center', '"motion-reduce:translate-y-1 inline-flex items-center')),
    );
    assert.ok(failed(card, "motion.reduced-motion-transforms"), JSON.stringify(row(card, "motion.reduced-motion-transforms")));
  });

  test("duration defect 1: feedback duration at 400ms (cap 150)", async () => {
    const card = await run((root) => editScheme(root, "dense-data", (s) => setToken(s, "primitive.duration.fast", "400ms")));
    assert.ok(failed(card, "motion.duration-caps"), JSON.stringify(row(card, "motion.duration-caps")));
  });

  test("duration defect 2: panels at 0.45s, written in seconds (cap 300ms)", async () => {
    const card = await run((root) =>
      editScheme(root, "dense-data", (s) => {
        setToken(s, "primitive.duration.slow", "0.45s");
        setToken(s, "semantic.motion.duration.panels", "{duration.slow}");
      }),
    );
    assert.ok(failed(card, "motion.duration-caps"), JSON.stringify(row(card, "motion.duration-caps")));
  });

  test("clean: feedback at 140ms and an opacity rule in the reduce block are not flagged", async () => {
    const card = await run(async (root) => {
      editScheme(root, "dense-data", (s) => setToken(s, "primitive.duration.fast", "140ms"));
      injectReduced("opacity: 1;")(root);
    });
    for (const id of ["motion.reduced-motion-transforms", "motion.duration-caps"]) {
      const r = row(card, id);
      assert.ok(r.pass && r.candidate <= r.base, `${id}: ${JSON.stringify(r)}`);
    }
  });
});
