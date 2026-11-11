// OD-229: the data table's parts layer, in the pattern of the menu's approved Anatomy reference.
// The parts people see, their roles, and the answers, rules and tokens each card follows. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";
import { grammar, saveGrammar } from "../cli/src/schemes.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);
const K = (k) => `component.${k}`;

// From the approved Figma page (node 74:266): 13 parts. A number in a cell is still a cell: the number
// face is a rule on the cell, not a part. The frame is no part: its border is set once, for the whole
// table. The empty state is no part of the table: the Empty component shows it.
const TABLE = {
  intro: "the data table",
  drawing: {
    kind: "table",
    toolbar: [
      { kind: "search", label: "Search records", n: 1 },
      { kind: "button", icon: "filter", label: "Status", n: 2 },
      { kind: "count", label: "1 selected", n: 3 },
      { kind: "toggle", options: ["Compact", "Comfortable"], n: 4 },
      { kind: "button", icon: "columns", label: "Columns", n: 5 },
    ],
    header: { row: 6, label: 7, sort: 8, check: 13 },
    columns: [{ label: "Record", sort: true }, { label: "Status" }, { label: "Amount", numeric: true, sort: true }],
    rows: [
      { cells: ["REC-1042", "Open", "1,240.00"], marks: { row: 9, cell: 10 } },
      { cells: ["REC-1043", "Late", "86.50"], state: "highlight", marks: { row: 11 } },
      { cells: ["REC-1044", "Paid", "3,905.10"], state: "selected", checked: true, marks: { row: 12, check: 13 } },
      { cells: ["REC-1045", "Open", "412.00"] },
    ],
  },
  parts: [
    { id: "toolbar", label: "Toolbar", need: "optional", roles: ["affordance"], children: [
      { n: 1, id: "search", label: "Search field", need: "optional", roles: ["affordance", "reach"], tokens: [K("input.height"), K("input.border.@")] },
      { n: 2, id: "filter", label: "Filter", need: "optional", roles: ["grouping", "affordance"], tokens: [K("button.secondary.border")] },
      { n: 3, id: "selection-count", label: "Selection count", need: "state", roles: ["feedback"], tokens: [K("data-table.label")] },
      { n: 4, id: "density", label: "Density switch", need: "optional", roles: ["readability", "reach"], tokens: [K("toggle-group.radius")] },
      { n: 5, id: "columns", label: "Columns", need: "optional", roles: ["affordance"], tokens: [K("button.secondary.border")] },
    ] },
    { id: "header", label: "Header", need: "required", roles: ["hierarchy"], children: [
      { n: 6, id: "header-row", label: "Header row", need: "required", roles: ["hierarchy", "grouping"], tokens: [K("table.header-background")] },
      { n: 7, id: "header-label", label: "Header label", need: "required", roles: ["hierarchy", "readability"], tokens: [K("table.head.label"), K("table.head.font-weight")] },
      { n: 8, id: "sort", label: "Sort control", need: "optional", roles: ["affordance", "feedback"], tokens: [K("data-table.label-hover")] },
    ] },
    { id: "row", label: "Row", need: "required", roles: ["readability", "reach"], children: [
      { n: 9, id: "row-line", label: "Row and its line", need: "required", roles: ["reach", "grouping"], tokens: [K("table.row-height"), K("table.row-border")] },
      { n: 10, id: "cell", label: "Cell", need: "required", roles: ["readability"], tokens: [K("table.label"), K("table.font-size"), K("table.cell.font-family")] },
      { n: 11, id: "highlight-row", label: "Highlight row", need: "state", roles: ["feedback"], tokens: [K("data-table.row.background.hover")] },
      { n: 12, id: "selected-row", label: "Selected row", need: "state", roles: ["meaning", "feedback"], tokens: [K("table.row-selected"), K("table.row-selected-edge")] },
      { n: 13, id: "select-box", label: "Select box", need: "optional", roles: ["affordance", "meaning"], tokens: [K("checkbox.size")] },
    ] },
    { id: "empty", label: "Empty state", need: "state", note: "shown by Empty", roles: ["feedback"], tokens: [] },
  ],
  // Each card's image is its own part, with only its own numbers.
  cards: [
    { title: "Toolbar", parts: [1, 2, 3, 4, 5], image: { sections: ["toolbar"] }, roles: ["affordance", "feedback"], answers: ["tasks.q2", "content.q2"], rules: [], tokens: [K("input.height"), K("button.secondary.border"), K("data-table.label")] },
    { title: "Header", parts: [6, 7, 8], image: { sections: ["header"] }, roles: ["hierarchy", "grouping", "affordance"], answers: ["content.q1", "typography.roles"], rules: [], tokens: [K("table.header-background"), K("table.head.label"), K("data-table.label-hover")] },
    { title: "Row", parts: [9, 10], image: { sections: ["row:0"] }, roles: ["readability", "reach"], answers: ["content.q2", "spacing.values"], rules: ["table-row", "number-in-table"], tokens: [K("table.row-height"), K("table.row-border"), K("table.label"), K("table.cell.font-family")] },
    { title: "Highlight row", parts: [11], image: { sections: ["row:1"] }, roles: ["feedback"], answers: ["accessibility.roles"], rules: ["hover-feedback"], tokens: [K("data-table.row.background.hover")] },
    { title: "Selected row", parts: [12, 13], image: { sections: ["row:2"] }, roles: ["meaning", "feedback"], answers: ["tasks.q1", "accessibility.count"], rules: ["selected-row"], tokens: [K("table.row-selected"), K("table.row-selected-edge"), K("checkbox.size")] },
  ],
};

const g = grammar();
g.catalogue.items.find((i) => i.id === "data-table").anatomy = TABLE;
saveGrammar(g);
console.log("The data table's parts layer, 13 parts, in the grammar.");
