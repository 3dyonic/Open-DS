// A directive in a plain .md page becomes the composite it names (OD-284). A line such as
// ::token-table{component="field"} becomes a block; :label[Left out]{tone="warning"} sits inside text.
// The page stays Markdown. The composites live in doc-composites/ and src/theme/MDXComponents.tsx
// registers them. An unknown directive is left for Docusaurus, which shows it as text.
//
// A composite that draws data gets it from the scheme's _composites.json, which the docs generator
// writes: the directive names the entry, and the plugin passes it in as the data prop at build time.
import { readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { visit } from "unist-util-visit";
import { valueToEstree } from "estree-util-value-to-estree";

const COMPOSITES = { label: "Label", "token-table": "TokenTable", "reason-chain": "ReasonChain" };
// The attribute that names a composite's entry in _composites.json.
const DATA_KEY = { "token-table": "component", "reason-chain": "id" };

// One read per scheme file and version: a rebuild after the generator runs reads the new data.
const loaded = new Map();
const compositeData = (file) => {
  const version = statSync(file).mtimeMs;
  if (loaded.get(file)?.version !== version)
    loaded.set(file, { version, data: JSON.parse(readFileSync(file, "utf8")) });
  return loaded.get(file).data;
};

const dataAttribute = (value) => ({
  type: "mdxJsxAttribute",
  name: "data",
  value: {
    type: "mdxJsxAttributeValueExpression",
    value: JSON.stringify(value),
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        comments: [],
        body: [{ type: "ExpressionStatement", expression: valueToEstree(value) }],
      },
    },
  },
});

const jsx = (node, name, data) => ({
  type: node.type === "textDirective" ? "mdxJsxTextElement" : "mdxJsxFlowElement",
  name,
  attributes: [
    ...Object.entries(node.attributes ?? {}).map(([key, value]) => ({ type: "mdxJsxAttribute", name: key, value })),
    ...(data === undefined ? [] : [dataAttribute(data)]),
  ],
  children: node.children ?? [],
});

export default function composites({ docsDir }) {
  return (tree, vfile) => {
    visit(tree, ["leafDirective", "textDirective"], (node, index, parent) => {
      const name = COMPOSITES[node.name];
      if (!name || !parent) return;
      const key = DATA_KEY[node.name];
      let data;
      if (key) {
        const scheme = relative(docsDir, vfile.path).split(sep)[0];
        const file = join(docsDir, scheme, "_composites.json");
        const id = node.attributes?.[key];
        data = compositeData(file)[node.name]?.[id];
        if (data === undefined)
          throw new Error(
            `${vfile.path}: ::${node.name}{${key}="${id}"} has no entry in ${file}. Run node scripts/generate.mjs in docs/, then build again.`,
          );
      }
      parent.children[index] = jsx(node, name, data);
    });
  };
}
