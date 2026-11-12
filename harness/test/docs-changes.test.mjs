import assert from "node:assert/strict";
import { test } from "node:test";
import { changesMarkdown, lineCounts, pageChanges, pageOf } from "../../scripts/docs-changes.mjs";

test("a generated file maps to its scheme and page", () => {
  assert.deepEqual(pageOf("docs/dense-data/foundations/color.md"), { scheme: "dense-data", page: "foundations/color" });
  assert.deepEqual(pageOf("docs/dense-data/foundations/color.json"), {
    scheme: "dense-data",
    page: "foundations/color",
  });
  assert.deepEqual(pageOf("static/token-map/multi-brand/aster.json"), { scheme: "multi-brand", page: "token-map" });
  assert.deepEqual(pageOf("static/token-map/dense-data.json"), { scheme: "dense-data", page: "token-map" });
  assert.deepEqual(pageOf("static/dense-data/llms.txt"), { scheme: "dense-data", page: "llms.txt" });
  assert.equal(pageOf("static/anatomy/dense-data/button/tree.png"), null);
});

test("line counts ignore a moved line", () => {
  assert.deepEqual(lineCounts("a\nb\nc", "c\na\nb"), { added: 0, removed: 0 });
  assert.deepEqual(lineCounts("a\nb", "a\nx\ny"), { added: 2, removed: 1 });
  assert.deepEqual(lineCounts("", "a\nb"), { added: 2, removed: 0 });
});

test("a page with its data file is one row; unchanged pages are left out", () => {
  const base = {
    "docs/s/a.md": "one\ntwo",
    "docs/s/a.json": "{}",
    "docs/s/same.md": "x",
    "docs/s/gone.md": "g1\ng2",
  };
  const head = {
    "docs/s/a.md": "one\ntwo",
    "docs/s/a.json": '{"k":1}',
    "docs/s/same.md": "x",
    "docs/t/new.mdx": "n",
  };
  assert.deepEqual(pageChanges(base, head), [
    { scheme: "s", page: "a", status: "changed", added: 1, removed: 1 },
    { scheme: "s", page: "gone", status: "removed", added: 0, removed: 2 },
    { scheme: "t", page: "new", status: "added", added: 1, removed: 0 },
  ]);
});

test("the summary caps the table and says how to see the rest", () => {
  const rows = Array.from({ length: 5 }, (_, i) => ({
    scheme: "s",
    page: `p${i}`,
    status: "changed",
    added: 1,
    removed: 0,
  }));
  const md = changesMarkdown({ rows, base: "aaa", head: "bbb", limit: 2 });
  assert.match(md, /5 pages: 0 added, 0 removed, 5 changed/);
  assert.equal((md.match(/\| `p\d` \|/g) ?? []).length, 2);
  assert.match(md, /The table shows 2 of 5 pages/);
  assert.match(changesMarkdown({ rows: [], base: "aaa", head: "bbb" }), /No docs page changes/);
});
