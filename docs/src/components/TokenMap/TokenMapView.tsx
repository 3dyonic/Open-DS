import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStore,
  useStoreApi,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  allOpen,
  defaultOpen,
  nameOptions,
  namePicks,
  renderedIds,
  trace,
  visibleTrace,
  type TokenGraph,
  type TokenNode,
  type Trace,
  type VisibleGroup,
} from "../../../../cli/src/token-trace.mjs";
import { BACKGROUNDS, measure, type MeasureLine } from "../../../../cli/src/token-measure.mjs";
import { Picker } from "../Picker";
import { layout, NODE_HEIGHT } from "./layout";
import styles from "./styles.module.css";

// The Token map page (OD-274): pick a semantic token with three linked pickers and see its chain
// only: the primitive its value comes from on the left, with what that value measures, and the
// semantics and component tokens that read it on the right. Only the trace is drawn. The graph comes
// from static/token-map/ (scripts/generate.mjs writes it from cli/src/token-graph.mjs); the trace,
// what shows of it, the picker options and the measuring are cli/src/token-trace.mjs and
// cli/src/token-measure.mjs, the same code the tests run. The expanded set lives here.

export type Props = {
  scheme: string;
  /** The graph file of each brand, as a path under static/. */
  files: Record<string, string>;
};
type MapFile = {
  scheme: string;
  name: string;
  tiers: { id: string; label: string }[];
  brands: string[];
  graphs: Record<string, TokenGraph>;
};
type Mode = "light" | "dark";
type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; map: MapFile };
type Role = Trace["columns"][number]["role"];

const ROLE_LABELS: Record<Role, string> = {
  primitive: "Primitive",
  source: "Semantic it reads",
  focus: "Semantic",
  reader: "Semantics that read it",
  "component-key": "Component tokens",
};
const PICKED_BY_THEME = "Picked by the theme";
const SAME_IN_EVERY_THEME = "Same in every theme";
const MINUS = "−";

const isColor = (n: TokenNode) => n.type === "color" && Boolean(n.value);
const plural = (n: number, one: string, many: string) => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;

// What a primitive box says about its value: who picks it, then what it measures.
type Facts = { picked: string; lines: MeasureLine[] };

function MeasureLines({ lines, withRule }: { lines: MeasureLine[]; withRule?: boolean }) {
  return (
    <>
      {lines.map((l) => (
        <span key={l.text} className={styles.measureLine} title={l.rule}>
          {l.met !== undefined && <span className={l.met ? styles.met : styles.missed}>{l.met ? "Yes" : "No"}</span>}
          <span>{l.text}</span>
          {withRule && l.rule && l.met !== undefined && <span className={styles.rule}>{l.rule}</span>}
        </span>
      ))}
    </>
  );
}

type Toggle = { count: number; open: boolean; label: string; onToggle: () => void };

function ToggleButton({ toggle }: { toggle: Toggle }) {
  return (
    <button
      type="button"
      className={styles.toggleCount}
      aria-expanded={toggle.open}
      aria-label={toggle.label}
      title={toggle.label}
      onClick={toggle.onToggle}
    >
      {toggle.open ? MINUS : "+"} {toggle.count}
    </button>
  );
}

type NodeData = {
  node: TokenNode;
  role: Role;
  width: number;
  facts?: Facts;
  reads?: string;
  toggle?: Toggle;
  onPick: (id: string) => void;
};
type GroupData = { component: string; count: number; width: number; toggle: Toggle };
type HeadData = { label: string; width: number };

function TokenNodeView({ data }: NodeProps<Node<NodeData>>) {
  const { node, role, width, facts, reads, toggle, onPick } = data;
  const canPick = role === "source" || role === "reader";
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} className={styles.handle} />
      <div
        className={`${styles.node} ${styles[`role-${role}`] ?? ""}`}
        style={{ width, minHeight: NODE_HEIGHT }}
        title={node.description ?? node.id}
        aria-current={role === "focus" ? "true" : undefined}
      >
        <span className={styles.nodeTop}>
          {canPick ? (
            <button
              type="button"
              className={`${styles.nodeLabel} ${styles.nodePick}`}
              onClick={() => onPick(node.id)}
              aria-label={`Trace ${node.label}`}
            >
              {node.label}
            </button>
          ) : (
            <span className={styles.nodeLabel}>{node.label}</span>
          )}
          {toggle && <ToggleButton toggle={toggle} />}
        </span>
        {node.value && (
          <span className={styles.nodeValue}>
            {isColor(node) && <span className={styles.swatch} style={{ background: node.value }} aria-hidden="true" />}
            <span className={styles.nodeValueText}>{node.value}</span>
          </span>
        )}
        {facts && (
          <span className={styles.measure}>
            <span className={styles.picked}>{facts.picked}</span>
            <MeasureLines lines={facts.lines} />
          </span>
        )}
        {reads && <span className={styles.picked}>Reads {reads}</span>}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={false} className={styles.handle} />
    </>
  );
}

function GroupView({ data }: NodeProps<Node<GroupData>>) {
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} className={styles.handle} />
      <div className={`${styles.node} ${styles.group}`} style={{ width: data.width }}>
        <span className={styles.nodeTop}>
          <span className={styles.nodeLabel}>
            {data.component} · {plural(data.count, "token", "tokens")}
          </span>
          <ToggleButton toggle={data.toggle} />
        </span>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={false} className={styles.handle} />
    </>
  );
}

function HeadView({ data }: NodeProps<Node<HeadData>>) {
  return (
    <div className={styles.columnHead} style={{ width: data.width }}>
      {data.label}
    </div>
  );
}

const nodeTypes = { token: TokenNodeView, group: GroupView, head: HeadView };

// The three linked pickers that name a semantic token: Group (color), Kind (border), Token (focus).
// They are the docs' listbox picker, never a native select (Open DS decision, 2026-11-05).
function NamePicker({
  semantics,
  picks,
  onPicks,
  onPick,
}: {
  semantics: TokenNode[];
  picks: string[];
  onPicks: (picks: string[]) => void;
  onPick: (id: string) => void;
}) {
  const [family = "", role = "", name] = picks;
  const { families, roles, names } = useMemo(() => nameOptions(semantics, [family, role]), [semantics, family, role]);
  const twoPart = roles.find((r) => r.value === role)?.id;
  const nameId = names.find((n) => n.value === name)?.id ?? "";
  return (
    <div className={styles.picker}>
      <Picker
        label="Group"
        className={styles.pick}
        value={family}
        options={families.map((f) => ({ id: f, label: f }))}
        onPick={(f) => onPicks([f])}
      />
      <Picker
        label="Kind"
        className={styles.pick}
        value={role}
        disabled={!family}
        options={roles.map((r) => ({ id: r.value, label: r.value }))}
        onPick={(value) => {
          const picked = roles.find((r) => r.value === value);
          if (picked?.id) onPick(picked.id);
          else onPicks([family, value]);
        }}
      />
      {twoPart ? (
        <Picker
          label="Token"
          className={styles.pick}
          value={twoPart}
          disabled
          options={[{ id: twoPart, label: `${family}.${role} has no more parts` }]}
          onPick={() => {}}
        />
      ) : (
        <Picker
          label="Token"
          className={styles.pick}
          value={nameId}
          disabled={!role}
          options={names.map((n) => ({ id: n.id, label: n.value || `${family}.${role} itself` }))}
          onPick={onPick}
        />
      )}
    </div>
  );
}

function ModeToggle({ mode, onMode }: { mode: Mode; onMode: (m: Mode) => void }) {
  return (
    <div role="group" aria-label="Values in" className={styles.toggle}>
      <span className={styles.fieldLabel} aria-hidden="true">
        Values in
      </span>
      <div className={styles.toggleButtons}>
        {(["light", "dark"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            className={`${styles.toggleButton} ${mode === m ? styles.toggleOn : ""}`}
            onClick={() => onMode(m)}
          >
            {m === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </div>
    </div>
  );
}

// The room the framed chain leaves at each edge: more at the bottom, where the buttons sit.
const FIT_PADDING = { top: "24px", right: "24px", bottom: "112px", left: "24px" } as const;

// The canvas grows with the chain up to the window's height, less room for the page's top bar.
const maxCanvasHeight = () => window.innerHeight - 96;

const readFocus = () => new URLSearchParams(window.location.search).get("focus");
const writeFocus = (id: string | null) => {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("focus", id);
  else url.searchParams.delete("focus");
  window.history.replaceState(window.history.state, "", url);
};

function TraceView({
  map,
  mode,
  onMode,
  brand,
}: {
  map: MapFile;
  mode: Mode;
  onMode: (m: Mode) => void;
  brand: string;
}) {
  const graph = map.graphs[`${brand}/${mode}`] ?? Object.values(map.graphs)[0];
  const byId = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);
  const semantics = useMemo(() => graph.nodes.filter((n) => n.tier === "semantic"), [graph]);
  const isSemantic = useCallback((id: string | null) => byId.get(id ?? "")?.tier === "semantic", [byId]);
  const [focus, setFocus] = useState<string | null>(() => {
    const f = readFocus();
    return f && isSemantic(f) ? f : null;
  });
  // The picks before a token is named: [group] or [group, kind].
  const [partial, setPartial] = useState<string[]>([]);
  // The expanded set, for the token it was set on; a new token starts from its defaults.
  const [expanded, setExpanded] = useState<{ focus: string; open: Set<string> } | null>(null);
  // The measured heights of the boxes drawn so far, so long boxes push the next ones down.
  const [heights, setHeights] = useState<Record<string, number>>({});
  const flow = useReactFlow();
  const store = useStoreApi();
  const canvasWidth = useStore((s) => s.width) || 1000;
  // Changes whenever React Flow measures a box again.
  const measured = useStore((s) => {
    let key = "";
    for (const n of s.nodeLookup.values()) key += `${n.id}:${n.measured?.height ?? 0};`;
    return key;
  });

  const pick = useCallback((id: string) => {
    setFocus(id);
    writeFocus(id);
  }, []);
  const onPicks = useCallback((picks: string[]) => {
    setPartial(picks);
    setFocus(null);
    writeFocus(null);
  }, []);
  const picks = focus ? namePicks(semantics, focus) : partial;

  const traced = useMemo(() => (focus && isSemantic(focus) ? trace(graph, focus) : null), [graph, focus, isSemantic]);
  const open = useMemo(
    () =>
      traced ? (expanded?.focus === traced.focus ? expanded.open : defaultOpen(graph, traced)) : new Set<string>(),
    [traced, expanded, graph],
  );
  const visible = useMemo(() => (traced ? visibleTrace(graph, traced, open) : null), [graph, traced, open]);
  const setOpen = useCallback(
    (next: Set<string>) => traced && setExpanded({ focus: traced.focus, open: next }),
    [traced],
  );
  const flip = useCallback(
    (id: string) => {
      const next = new Set(open);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setOpen(next);
    },
    [open, setOpen],
  );

  const backgrounds = useMemo(
    () => BACKGROUNDS.map((id) => ({ id, value: byId.get(id)?.value ?? null })).filter((b) => b.value),
    [byId],
  );
  // Each primitive of the trace: whether the theme picks it for the semantic that reads it, and what
  // its value measures in this mode.
  const facts = useMemo(() => {
    const out = new Map<string, Facts>();
    if (!traced) return out;
    for (const id of traced.columns.find((c) => c.role === "primitive")?.ids ?? []) {
      const readers = [...traced.edges].map((i) => graph.edges[i]).filter((e) => e.from === id);
      const picked = readers.some((e) => byId.get(e.to)?.theme) ? PICKED_BY_THEME : SAME_IN_EVERY_THEME;
      out.set(id, { picked, lines: measure(byId.get(id)!, { backgrounds }) });
    }
    return out;
  }, [traced, graph, byId, backgrounds]);

  const { nodes, edges, bottom } = useMemo(() => {
    if (!traced || !visible) return { nodes: [] as Node[], edges: [] as Edge[], bottom: 0 };
    const roleOf = new Map<string, Role>();
    const columnOf = new Map<string, number>();
    visible.columns.forEach((c, i) => {
      for (const id of c.ids) roleOf.set(id, c.role);
      for (const id of [...c.ids, ...(c.groups ?? []).map((g) => g.id)]) columnOf.set(id, i);
    });
    const groups = new Map<string, VisibleGroup>(
      visible.columns.flatMap((c) => c.groups ?? []).map((g): [string, VisibleGroup] => [g.id, g]),
    );
    const estimate = (id: string) =>
      groups.has(id) ? 48 : NODE_HEIGHT + 22 * ((facts.get(id)?.lines.length ?? -1) + 1);
    // Lay the component groups out in as many side-by-side columns as reads largest on the canvas.
    const tryLayout = (groupColumns: number) =>
      layout({
        columns: visible.columns,
        heightOf: (id) => heights[id] ?? estimate(id),
        labelOf: (role) => ROLE_LABELS[role as Role],
        groupColumns,
      });
    const fits = (l: ReturnType<typeof tryLayout>) =>
      Math.min(1, canvasWidth / (l.right + 64), maxCanvasHeight() / (l.bottom + 136));
    const { placed, heads, bottom } = [2, 3, 4]
      .map(tryLayout)
      .reduce((best, next) => (fits(next) > fits(best) + 0.01 ? next : best), tryLayout(1));
    // Only the boxes of the trace that show: nothing else of the scheme's graph is drawn.
    const rendered = new Set(renderedIds(visible));
    const toggleOf = (id: string): Toggle | undefined => {
      const t = visible.toggles[id];
      if (!t) return undefined;
      const group = groups.get(id);
      const what = group
        ? plural(t.count, `${group.component} token`, `${group.component} tokens`)
        : `${plural(t.count, "token that reads", "tokens that read")} ${byId.get(id)?.label}`;
      return { ...t, label: `${t.open ? "Hide" : "Show"} ${what}`, onToggle: () => flip(id) };
    };
    const flowNodes: Node[] = [
      ...heads.map((h) => ({
        id: `column:${h.key}`,
        type: "head",
        position: { x: h.x, y: h.y },
        data: { label: h.label, width: h.width },
        draggable: false,
        selectable: false,
        focusable: false,
      })),
      ...placed
        .filter((p) => rendered.has(p.id))
        .map((p) => {
          const group = groups.get(p.id);
          const common = { id: p.id, position: { x: p.x, y: p.y }, draggable: false, focusable: false };
          if (group)
            return {
              ...common,
              type: "group",
              data: { component: group.component, count: group.count, width: p.width, toggle: toggleOf(p.id)! },
            };
          const reads = traced.reads[p.id];
          return {
            ...common,
            type: "token",
            data: {
              node: byId.get(p.id)!,
              role: roleOf.get(p.id)!,
              width: p.width,
              facts: facts.get(p.id),
              reads: reads ? byId.get(reads)?.label : undefined,
              toggle: toggleOf(p.id),
              onPick: pick,
            },
          };
        }),
    ];
    // A line runs left to right only. A component token that reads another one of its component says
    // so in its box ("Reads ...") instead of a line inside the column.
    const flowEdges: Edge[] = visible.edges
      .filter((e) => (columnOf.get(e.from) ?? 0) < (columnOf.get(e.to) ?? 0))
      .map((e) => ({
        id: `${e.from}>${e.to}`,
        source: e.from,
        target: e.to,
        className: styles.edge,
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
        focusable: false,
      }));
    return { nodes: flowNodes, edges: flowEdges, bottom };
  }, [traced, visible, byId, facts, heights, pick, flip, canvasWidth]);

  // Once the boxes are drawn, keep their real heights; a change lays the trace out again. The page
  // passes its nodes in without a change handler, so the sizes are read from React Flow's store.
  useEffect(() => {
    const drawn = [...store.getState().nodeLookup.values()].filter((n) => n.type !== "head");
    if (!drawn.length || drawn.some((n) => !n.measured?.height)) return;
    const next = Object.fromEntries(drawn.map((n) => [n.id, Math.ceil(n.measured.height!)]));
    if (Object.entries(next).some(([id, h]) => heights[id] !== h)) {
      // Lay out again on the next frame, not inside the browser's resize pass: a new layout moves and
      // resizes boxes, and doing that in the same frame makes the browser report a ResizeObserver loop.
      const frame = requestAnimationFrame(() => setHeights((old) => ({ ...old, ...next })));
      return () => cancelAnimationFrame(frame);
    }
    // The layout holds the real heights: frame every box that shows.
    const t = setTimeout(() => flow.fitView({ padding: FIT_PADDING, maxZoom: 1, minZoom: 0.2, duration: 0 }), 0);
    return () => clearTimeout(t);
  }, [measured, nodes, heights, store, flow]);

  const focused = focus ? byId.get(focus) : null;
  const column = (role: Role) => traced?.columns.filter((c) => c.role === role) ?? [];
  const count = (role: Role) => column(role).reduce((sum, c) => sum + c.ids.length, 0);
  const groups = column("component-key")[0]?.groups ?? [];

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <NamePicker semantics={semantics} picks={picks} onPicks={onPicks} onPick={pick} />
        <ModeToggle mode={mode} onMode={onMode} />
      </div>
      {!focused || !traced || !visible ? (
        <div className={styles.empty}>
          <p>
            Pick a group, a kind and a token to trace it. This scheme has{" "}
            {plural(semantics.length, "semantic token", "semantic tokens")}. The map shows one chain at a time.
          </p>
        </div>
      ) : (
        <>
          <section className={styles.summary} aria-live="polite" aria-label="The token you trace">
            <p className={styles.summaryHead}>
              <span className={styles.summaryTier}>Semantic</span>
              <strong className={styles.summaryTitle}>{focused.label}</strong>
              {focused.value && (
                <span className={styles.summaryValue}>
                  {isColor(focused) && (
                    <span className={styles.swatch} style={{ background: focused.value }} aria-hidden="true" />
                  )}
                  {focused.value}
                  <span className={styles.summaryMode}>in {mode}</span>
                </span>
              )}
            </p>
            {focused.description && <p className={styles.summaryWhy}>{focused.description}</p>}
            <p className={styles.summaryCount}>
              {count("primitive")
                ? `It takes its value from ${plural(count("primitive"), "primitive", "primitives")}`
                : "It holds its value itself, with no primitive"}
              {count("source") ? `, through ${plural(count("source"), "semantic", "semantics")}` : ""}.{" "}
              {count("reader") ? `${plural(count("reader"), "semantic reads", "semantics read")} it. ` : ""}
              {count("component-key")
                ? `${plural(count("component-key"), "component token", "component tokens")} in ${plural(groups.length, "component", "components")} read it.`
                : "No component token reads it."}
            </p>
          </section>
          <div
            className={styles.canvas}
            style={{ height: `clamp(24rem, ${Math.ceil(bottom) + 160}px, calc(100vh - 6rem))` }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              nodesConnectable={false}
              nodesFocusable={false}
              edgesFocusable={false}
              elementsSelectable={false}
              minZoom={0.05}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
              aria-label={`Token map: the chain of ${focused.label}`}
            >
              <Background gap={24} size={1} />
              <Panel position="bottom-right" className={styles.expandPanel}>
                <button type="button" className={styles.panelButton} onClick={() => setOpen(allOpen(traced))}>
                  Expand all
                </button>
                <button type="button" className={styles.panelButton} onClick={() => setOpen(new Set())}>
                  Collapse all
                </button>
              </Panel>
              <Controls
                showInteractive={false}
                position="bottom-right"
                orientation="horizontal"
                className={styles.controls}
              />
            </ReactFlow>
          </div>
          <p className={styles.legend}>
            <span className={styles.legendLine} aria-hidden="true" /> A line points from the token a value comes from to
            the token that reads it. Select a semantic to trace it. Use + and {MINUS} to show or hide what reads a
            token. Values are for {mode} mode.
          </p>
          <details className={styles.asList}>
            <summary>The chain as a list</summary>
            <p className={styles.listNote}>The list holds the whole chain, expanded or not on the map.</p>
            {traced.columns.map((c, i) => (
              <div key={`${c.role}${i}`}>
                <h3 className={styles.listTier}>{ROLE_LABELS[c.role]}</h3>
                {c.groups ? (
                  <ul>
                    {c.groups.map((g) => (
                      <li key={g.component}>
                        {g.component} · {plural(g.ids.length, "token", "tokens")}
                        <ul>
                          {g.ids.map((id) => (
                            <React.Fragment key={id}>
                              <ListItem node={byId.get(id)!} reads={byId.get(traced.reads[id] ?? "")?.label} />
                            </React.Fragment>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul>
                    {c.ids.map((id) => (
                      <React.Fragment key={id}>
                        <ListItem
                          node={byId.get(id)!}
                          facts={facts.get(id)}
                          onPick={c.role === "source" || c.role === "reader" ? pick : undefined}
                        />
                      </React.Fragment>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </details>
        </>
      )}
    </div>
  );
}

function ListItem({
  node,
  facts,
  reads,
  onPick,
}: {
  node: TokenNode;
  facts?: Facts;
  reads?: string;
  onPick?: (id: string) => void;
}) {
  return (
    <li>
      {onPick ? (
        <button type="button" className={styles.linkButton} onClick={() => onPick(node.id)}>
          {node.label}
        </button>
      ) : (
        node.label
      )}
      {node.value ? `: ${node.value}` : ""}
      {reads ? ` (reads ${reads})` : ""}
      {facts && (
        <span className={styles.listMeasure}>
          <span className={styles.picked}>{facts.picked}</span>
          <MeasureLines lines={facts.lines} withRule />
        </span>
      )}
    </li>
  );
}

// The page's own mode: Docusaurus sets data-theme on <html>.
const pageMode = (): Mode => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

export default function TokenMapView({ scheme, files }: Props) {
  const [mode, setMode] = useState<Mode>(pageMode);
  useEffect(() => {
    // The page's light and dark switch moves the values too; the toggle here moves only the values.
    const watch = new MutationObserver(() => setMode(pageMode()));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => watch.disconnect();
  }, []);
  const brands = Object.keys(files);
  const pageBrand = document.documentElement.getAttribute("data-brand");
  const brand = pageBrand && files[pageBrand] ? pageBrand : brands[0];
  const url = useBaseUrl(files[brand]);
  const [load, setLoad] = useState<Load>({ state: "loading" });

  useEffect(() => {
    let live = true;
    setLoad({ state: "loading" });
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`The map file answered ${r.status}.`);
        return r.json() as Promise<MapFile>;
      })
      .then((map) => live && setLoad({ state: "ready", map }))
      .catch((e: Error) => live && setLoad({ state: "error", message: e.message }));
    return () => {
      live = false;
    };
  }, [url]);

  if (load.state === "loading") return <p className={styles.status}>Loading the token map.</p>;
  if (load.state === "error")
    return (
      <div className={styles.error} role="alert">
        <p>The token map did not load. {load.message}</p>
        <p>Reload the page. If it fails again, run pnpm --dir docs generate and build the docs again.</p>
      </div>
    );
  if (load.map.scheme !== scheme)
    return (
      <div className={styles.error} role="alert">
        <p>
          The map file is for {load.map.scheme}, not {scheme}. Run pnpm --dir docs generate.
        </p>
      </div>
    );
  return (
    <ReactFlowProvider>
      <TraceView map={load.map} mode={mode} onMode={setMode} brand={brand} />
    </ReactFlowProvider>
  );
}
