// Apply a list of key operations to the grammar and every scheme (OD-243), in order. Each op names one
// of the key scripts; renames and moves leave component sources alone (--no-source), because the
// sources arrive whole, from whoever wrote the ops. Used to merge parallel work without conflicts.
//
//   node scripts/apply-ops.mjs ops.json [more.json …]
//
// ops.json: [{ "op": "add", "id": "x/y", "to": "color.border.default", "description": "…" },
//            { "op": "rename", "from": "x/a", "id": "x/b", "to"?: "…", "description"?: "…" },
//            { "op": "move", "from": "x/a", "id": "x/b", "description"?: "…" },
//            { "op": "link", "id": "x/y", "to": "…", "description"?: "…" },
//            { "op": "deprecate", "id": "x/old", "by": "x/new" }]
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const env = { ...process.env, OPS_LOG: "" }; // replaying ops never logs them again
const run = (script, args) => execFileSync("node", [`${ROOT}scripts/${script}`, ...args], { encoding: "utf8", env }).trim();
const opt = (o, k, flag = k) => (o[k] ? [`--${flag}`, o[k]] : []);
let n = 0;
for (const file of process.argv.slice(2)) {
  const text = readFileSync(file, "utf8").trim();
  // A JSON list, or JSON lines as the scripts write them with OPS_LOG set.
  const ops = text.startsWith("[") ? JSON.parse(text) : text.split("\n").filter(Boolean).map((l) => JSON.parse(l));
  for (const o of ops) {
    const out =
      o.op === "add" ? run("add-key.mjs", [o.id, ...opt(o, "to"), ...opt(o, "description")])
      : o.op === "rename" ? run("rename-key.mjs", [o.from, o.id, ...opt(o, "to"), ...opt(o, "description"), "--ticket", o.ticket ?? "OD-243", "--no-source"])
      : o.op === "move" ? run("move-key.mjs", [o.from, o.id, ...opt(o, "description"), "--no-source"])
      : o.op === "link" ? run("link-key.mjs", [o.id, ...opt(o, "to"), ...opt(o, "description")])
      : o.op === "deprecate" ? run("deprecate-key.mjs", [o.id, ...opt(o, "by"), "--ticket", o.ticket ?? "OD-243"])
      : (() => { throw new Error(`${file}: unknown op ${JSON.stringify(o)}`); })();
    console.log(out.split("\n").pop());
    n++;
  }
}
console.log(`${n} key operations applied.`);
