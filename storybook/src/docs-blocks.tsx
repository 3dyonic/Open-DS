// The blocks of every component's docs page. Each reads the component id and situations from the
// stories' parameters (openDs), and the active scheme from the toolbar, so the page explains the
// component in the scheme being viewed.
import { useOf } from "@storybook/addon-docs/blocks";
import { useEffect, useState } from "react";
import grammar from "../../schemes/grammar.json";
import { SCHEMES, type SchemeData } from "./schemes";

type Meta = { component: string; situations: string[] };
type Tree = Record<string, unknown>;

// The component keys each built component reads.
const KEY_GROUP: Record<string, string> = {
  button: "button",
  input: "input",
  select: "input",
  label: "input",
  checkbox: "control",
  switch: "control",
  badge: "badge",
  card: "card",
  table: "table",
  tabs: "tabs",
  dialog: "overlay",
  "dropdown-menu": "overlay",
  toast: "overlay",
  tooltip: "overlay",
};

/** The scheme chosen in the toolbar. The story decorator writes it on <html>. */
function useActiveScheme(): SchemeData {
  const read = () => document.documentElement.dataset.scheme ?? "dense-data";
  const [id, setId] = useState(read);
  useEffect(() => {
    const watch = new MutationObserver(() => setId(read()));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scheme"] });
    return () => watch.disconnect();
  }, []);
  return SCHEMES[id] ?? SCHEMES["dense-data"];
}

function useOpenDs(): Meta {
  const resolved = useOf("meta");
  const meta = resolved.type === "meta" ? resolved.preparedMeta : undefined;
  return (meta?.parameters?.openDs ?? { component: "", situations: [] }) as Meta;
}

const get = (tree: unknown, path: string) =>
  path.split(".").reduce<unknown>((n, p) => (n && typeof n === "object" ? (n as Tree)[p] : undefined), tree);

/** The aliases a key points through, light mode, default brand. */
function chain(s: SchemeData, path: string) {
  const t = (s as unknown as { tokens: Tree }).tokens as {
    primitive: Tree;
    brands: Record<string, { primitive: Tree }>;
    semantic: { base: Tree; light: Tree };
    component: Tree;
  };
  const trees = [t.component, t.semantic.light, t.semantic.base, Object.values(t.brands)[0].primitive, t.primitive];
  const steps: string[] = [];
  let at = path;
  for (let i = 0; i < 8; i++) {
    const node = trees.map((x) => get(x, at)).find((n) => n && typeof n === "object" && "$value" in (n as Tree)) as
      { $value: unknown } | undefined;
    const m = typeof node?.$value === "string" && node.$value.match(/^\{(.+)\}$/);
    if (!m) break;
    steps.push(m[1]);
    at = m[1];
  }
  return steps;
}

export function ComponentInfo() {
  const { component } = useOpenDs();
  const s = useActiveScheme();
  const item = grammar.catalogue.items.find((i) => i.id === component);
  const inv = s.inventory.in.find((i) => i.id === component);
  const out = s.inventory.out.find((i) => i.id === component);
  return (
    <div className="sb-unstyled ods-info">
      <p>{item?.description}</p>
      <p>
        <strong>
          {inv ? "In" : "Not in"} the {s.name} inventory.
        </strong>{" "}
        {inv?.why ?? out?.why ?? "Its answers did not pick it."} {s.inventory.in.length} of{" "}
        {grammar.catalogue.items.length} catalogue components are in.
      </p>
    </div>
  );
}

export function UsageRules() {
  const { situations } = useOpenDs();
  const s = useActiveScheme();
  const titles = Object.fromEntries(grammar.situations.map((x) => [x.id, x.title]));
  const rules = s.usage.filter((u) => situations.includes(u.situation));
  if (!rules.length) return null;
  return (
    <table className="ods-table">
      <thead>
        <tr>
          <th>Situation</th>
          <th>Use</th>
          <th>Not</th>
          <th>Why</th>
        </tr>
      </thead>
      <tbody>
        {rules.map((r) => (
          <tr key={r.situation}>
            <td>{titles[r.situation]}</td>
            <td>{r.use}</td>
            <td>{r.not}</td>
            <td>{r.why}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ComponentKeys() {
  const { component } = useOpenDs();
  const s = useActiveScheme();
  const keys = grammar.component_keys.filter((k) => k.component === KEY_GROUP[component]);
  if (!keys.length)
    return (
      <p>
        From shadcn/ui. It reads shadcn&apos;s variables, which theme.css maps onto the scheme&apos;s semantic tokens,
        and the radius, shadow and text scale in shadcn.css.
      </p>
    );
  return (
    <table className="ods-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>What it controls</th>
          <th>Points to</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((k) => (
          <tr key={k.id}>
            <td>
              <code>{k.id}</code>
            </td>
            <td>{k.description}</td>
            <td>
              {chain(s, k.id.replaceAll("/", ".")).map((x, i) => (
                <span key={x}>
                  {i ? " → " : ""}
                  <code>{x}</code>
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
