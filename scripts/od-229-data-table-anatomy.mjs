// OD-229: the data table's parts layer, in the pattern of the menu's approved Anatomy reference.
// The parts people see, their roles, and the answers, rules and tokens each card follows. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);
const K = (k) => `component.${k}`;

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
    frame: 6,
    header: { row: 7, label: 8, sort: 9, check: 15 },
    columns: [{ label: "Record", sort: true }, { label: "Status" }, { label: "Amount", numeric: true, sort: true }],
    rows: [
      { cells: ["REC-1042", "Open", "1,240.00"], marks: { row: 10, cell: 11, number: 12 } },
      { cells: ["REC-1043", "Late", "86.50"], state: "highlight", marks: { row: 13 } },
      { cells: ["REC-1044", "Paid", "3,905.10"], state: "selected", checked: true, marks: { row: 14 } },
      { cells: ["REC-1045", "Open", "412.00"] },
    ],
    empty: { label: "No records match these filters.", n: 16 },
  },
  parts: [
    { id: "toolbar", label: "Toolbar", need: "optional", roles: ["affordance"], children: [
      { n: 1, id: "search", label: "Search field", need: "optional", roles: ["affordance", "reach"], tokens: [K("input.height"), K("input.border.@")] },
      { n: 2, id: "filter", label: "Filter", need: "optional", roles: ["grouping", "affordance"], tokens: [K("button.secondary.border")] },
      { n: 3, id: "selection-count", label: "Selection count", need: "state", roles: ["feedback"], tokens: [K("data-table.label")] },
      { n: 4, id: "density", label: "Density switch", need: "optional", roles: ["readability", "reach"], tokens: [K("toggle-group.radius")] },
      { n: 5, id: "columns", label: "Columns", need: "optional", roles: ["affordance"], tokens: [K("button.secondary.border")] },
    ] },
    { n: 6, id: "frame", label: "Table frame", need: "required", roles: ["containment"], tokens: [K("data-table.container.border"), K("data-table.container.radius")] },
    { id: "header", label: "Header", need: "required", roles: ["hierarchy"], children: [
      { n: 7, id: "header-row", label: "Header row", need: "required", roles: ["hierarchy", "grouping"], tokens: [K("table.header-background")] },
      { n: 8, id: "header-label", label: "Header label", need: "required", roles: ["hierarchy", "readability"], tokens: [K("table.head.label"), K("table.head.font-weight")] },
      { n: 9, id: "sort", label: "Sort control", need: "optional", roles: ["affordance", "feedback"], tokens: [K("data-table.label-hover")] },
    ] },
    { id: "row", label: "Row", need: "required", roles: ["readability", "reach"], children: [
      { n: 10, id: "row-line", label: "Row and its line", need: "required", roles: ["reach", "grouping"], tokens: [K("table.row-height"), K("table.row-border")] },
      { n: 11, id: "cell", label: "Cell", need: "required", roles: ["readability"], tokens: [K("table.label"), K("table.font-size")] },
      { n: 12, id: "number-cell", label: "Number cell", need: "optional", roles: ["readability"], tokens: [K("table.cell.font-family")] },
      { n: 13, id: "highlight-row", label: "Highlight row", need: "state", roles: ["feedback"], tokens: [K("data-table.row.background.hover")] },
      { n: 14, id: "selected-row", label: "Selected row", need: "state", roles: ["meaning", "feedback"], tokens: [K("table.row-selected"), K("table.row-selected-edge")] },
      { n: 15, id: "select-box", label: "Select box", need: "optional", roles: ["affordance", "meaning"], tokens: [K("checkbox.size")] },
    ] },
    { n: 16, id: "empty", label: "Empty state", need: "state", roles: ["feedback"], tokens: [K("data-table.label")] },
  ],
  cards: [
    { title: "Toolbar", parts: [1, 2, 3, 4, 5], image: { sections: ["toolbar"] }, roles: ["affordance", "feedback"], answers: ["tasks.q2", "content.q2"], rules: [], tokens: [K("input.height"), K("button.secondary.border"), K("data-table.label")] },
    { title: "Table frame", parts: [6], image: { sections: ["frame"] }, roles: ["containment"], answers: ["elevation.definition", "shape.values"], rules: ["card"], tokens: [K("data-table.container.border"), K("data-table.container.border-width"), K("data-table.container.radius")] },
    { title: "Header", parts: [7, 8, 9], image: { sections: ["header"] }, roles: ["hierarchy", "grouping", "affordance"], answers: ["content.q1", "typography.roles"], rules: [], tokens: [K("table.header-background"), K("table.head.label"), K("data-table.label-hover")] },
    { title: "Row", parts: [10, 11], image: { sections: ["header", "row:0"] }, roles: ["readability", "reach"], answers: ["content.q2", "spacing.values"], rules: ["table-row"], tokens: [K("table.row-height"), K("table.row-border"), K("table.label")] },
    { title: "Number cell", parts: [12], image: { sections: ["header", "row:0"] }, roles: ["readability"], answers: ["typography.roles", "tasks.q1"], rules: ["number-in-table"], tokens: [K("table.cell.font-family")] },
    { title: "Highlight row", parts: [13], image: { sections: ["row:1"] }, roles: ["feedback"], answers: ["accessibility.roles"], rules: ["hover-feedback"], tokens: [K("data-table.row.background.hover")] },
    { title: "Selected row", parts: [14, 15], image: { sections: ["row:2"] }, roles: ["meaning", "feedback"], answers: ["tasks.q1", "accessibility.count"], rules: ["selected-row"], tokens: [K("table.row-selected"), K("table.row-selected-edge"), K("checkbox.size")] },
    { title: "Empty state", parts: [16], image: { sections: ["empty"] }, roles: ["feedback"], answers: ["voice.lands"], rules: ["empty-words"], tokens: [K("data-table.label")] },
  ],
};

const g = read("schemes/grammar.json");
g.catalogue.items.find((i) => i.id === "data-table").anatomy = TABLE;
write("schemes/grammar.json", g);
console.log("The data table's parts layer, 16 parts, in the grammar.");
