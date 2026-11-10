// A directive in a plain .md page becomes the composite it names (OD-284). A line such as
// ::token-table{component="field"} becomes a block; :label[Left out]{tone="warning"} sits inside text;
// :::intro{…} … ::: wraps Markdown that stays in the page. This is the extension Docusaurus documents:
// a remark plugin that gives a short syntax to a component (its admonitions work the same way), with
// the components registered by wrapping @theme/MDXComponents (src/theme/MDXComponents.tsx).
// An unknown directive is left for Docusaurus, which shows it as text.
//
// A composite that draws data gets it from the page's own data file beside it (field.md, field.json),
// which the docs generator writes. The plugin imports that file into the compiled page and passes the
// entry the directive names as the data prop, so the bundler tracks the file: a change to the data
// rebuilds the page, in a build and in the dev server.
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import { visit } from "unist-util-visit";

const COMPOSITES = {
  label: "Label",
  "token-table": "TokenTable",
  "reason-chain": "ReasonChain",
  "card-grid": "CardGrid",
  preview: "Preview",
  intro: "Intro",
  hero: "Hero",
  "sample-screen": "SampleScreen",
  "surface-stack": "SurfaceStack",
  "pairs-chart": "PairsChart",
  specimen: "Specimen",
  panel: "Panel",
  grid: "Grid",
  fold: "Fold",
  brand: "BrandSet",
  sample: "Sample",
  "mode-preview": "ModePreview",
  "color-scale": "ColorScale",
  "anatomy-drawing": "AnatomyDrawing",
  "token-swatches": "TokenSwatches",
  "type-roles": "TypeRoles",
  steps: "Steps",
  "decision-tree": "DecisionTree",
  "decision-answer": "DecisionAnswer",
  group: "Group",
  "primitive-table": "PrimitiveTable",
  "color-keys": "ColorKeys",
  "status-colors": "StatusColors",
  "mode-changes": "ModeChanges",
  "mode-constants": "ModeConstants",
};
// The attribute that names a composite's entry in the page's data file.
const DATA_KEY = {
  "token-table": "component",
  "reason-chain": "id",
  "card-grid": "id",
  preview: "id",
  specimen: "id",
  "anatomy-drawing": "id",
  "color-scale": "id",
  "mode-preview": "id",
  "pairs-chart": "id",
  "surface-stack": "id",
  "sample-screen": "id",
  "token-swatches": "id",
  "type-roles": "id",
  steps: "id",
  "decision-tree": "id",
  "decision-answer": "id",
  "primitive-table": "id",
  "color-keys": "id",
  "status-colors": "id",
  "mode-changes": "id",
  "mode-constants": "id",
};
// The name the page's data has inside the compiled page.
const DATA = "__compositeData";

const literal = (value) => ({ type: "Literal", value });
// __compositeData["token-table"]["field"]
const entry = (kind, id) => ({
  type: "MemberExpression",
  computed: true,
  optional: false,
  object: {
    type: "MemberExpression",
    computed: true,
    optional: false,
    object: { type: "Identifier", name: DATA },
    property: literal(kind),
  },
  property: literal(id),
});
const dataAttribute = (kind, id) => ({
  type: "mdxJsxAttribute",
  name: "data",
  value: {
    type: "mdxJsxAttributeValueExpression",
    value: `${DATA}[${JSON.stringify(kind)}][${JSON.stringify(id)}]`,
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        comments: [],
        body: [{ type: "ExpressionStatement", expression: entry(kind, id) }],
      },
    },
  },
});
// import __compositeData from "./field.json";
const importData = (file) => ({
  type: "mdxjsEsm",
  value: `import ${DATA} from ${JSON.stringify(`./${file}`)};`,
  data: {
    estree: {
      type: "Program",
      sourceType: "module",
      comments: [],
      body: [
        {
          type: "ImportDeclaration",
          specifiers: [{ type: "ImportDefaultSpecifier", local: { type: "Identifier", name: DATA } }],
          source: literal(`./${file}`),
        },
      ],
    },
  },
});

const jsx = (node, name, data) => ({
  type: node.type === "textDirective" ? "mdxJsxTextElement" : "mdxJsxFlowElement",
  name,
  attributes: [
    ...Object.entries(node.attributes ?? {}).map(([key, value]) => ({ type: "mdxJsxAttribute", name: key, value })),
    ...(data ? [data] : []),
  ],
  children: node.children ?? [],
});

export default function composites() {
  return (tree, vfile) => {
    const file = vfile.path.replace(/\.mdx?$/, ".json");
    // The data file is read here only to fail early, with a plain message, when an entry is missing.
    const known = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
    let needsData = false;
    visit(tree, ["containerDirective", "leafDirective", "textDirective"], (node, index, parent) => {
      const name = COMPOSITES[node.name];
      if (!name || !parent) return;
      const key = DATA_KEY[node.name];
      let data;
      if (key) {
        const id = node.attributes?.[key];
        if (known[node.name]?.[id] === undefined)
          throw new Error(
            `${vfile.path}: ::${node.name}{${key}="${id}"} has no entry in ${file}. Run node scripts/generate.mjs in docs/, then build again.`,
          );
        data = dataAttribute(node.name, id);
        needsData = true;
      }
      parent.children[index] = jsx(node, name, data);
    });
    if (needsData) tree.children.unshift(importData(basename(file)));
  };
}
