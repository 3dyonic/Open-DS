import React, { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { trace, type TokenGraph, type TokenNode } from "../../../../cli/src/token-trace.mjs";
import { layout, NODE_HEIGHT, NODE_WIDTH } from "./layout";
import styles from "./styles.module.css";

// The Token map page (OD-274): pick a decision, a token or a component, and see its chain only: where
// its value comes from and what reads it, one column per tier. The graph comes from
// static/token-map/ (scripts/generate.mjs writes it from cli/src/token-graph.mjs); the trace is
// cli/src/token-trace.mjs, the same code the tests run.

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

const MATCHES_SHOWN = 12;
const words = (s: string) =>
  s
    .toLowerCase()
    .split(/[\s./_-]+/)
    .filter(Boolean);

// The search: every word of the query starts a word of the item's name, id or answer. Shorter names
// first, so "button height" puts button.height before button.compact.height.
function search(nodes: TokenNode[], query: string): TokenNode[] {
  const q = words(query);
  if (!q.length) return [];
  return nodes
    .filter((n) => {
      const hay = words(`${n.label} ${n.id} ${n.tier === "decision" ? `${n.value} ${n.question}` : ""}`);
      return q.every((w) => hay.some((h) => h.startsWith(w)));
    })
    .sort((a, b) => words(a.label).length - words(b.label).length || a.label.localeCompare(b.label));
}

const isColor = (n: TokenNode) => n.type === "color" && Boolean(n.value);

type NodeData = { node: TokenNode; focus: boolean; onPick: (id: string) => void; tierLabel: string };
type ColumnData = { label: string; count: number };

function TokenNodeView({ data }: NodeProps<Node<NodeData>>) {
  const { node, focus, onPick, tierLabel } = data;
  const value = node.tier === "decision" ? `Answer: ${node.value}` : node.value;
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} className={styles.handle} />
      <button
        type="button"
        className={`${styles.node} ${styles[`tier-${node.tier}`] ?? ""} ${focus ? styles.focus : ""}`}
        style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
        onClick={() => onPick(node.id)}
        aria-current={focus ? "true" : undefined}
        aria-label={`${tierLabel}: ${node.label}${value ? `, ${value}` : ""}. Trace it.`}
        title={node.description ?? node.id}
      >
        <span className={styles.nodeLabel}>{node.label}</span>
        {value && (
          <span className={styles.nodeValue}>
            {isColor(node) && <span className={styles.swatch} style={{ background: node.value! }} aria-hidden="true" />}
            <span className={styles.nodeValueText}>{value}</span>
          </span>
        )}
      </button>
      <Handle type="source" position={Position.Right} isConnectable={false} className={styles.handle} />
    </>
  );
}

function ColumnHead({ data }: NodeProps<Node<ColumnData>>) {
  return (
    <div className={styles.columnHead} style={{ width: NODE_WIDTH }}>
      {data.label} <span className={styles.count}>{data.count}</span>
    </div>
  );
}

const nodeTypes = { token: TokenNodeView, column: ColumnHead };

function Search({
  nodes,
  tierLabel,
  onPick,
}: {
  nodes: TokenNode[];
  tierLabel: Record<string, string>;
  onPick: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const id = useId();
  const matches = useMemo(() => search(nodes, query), [nodes, query]);
  const shown = matches.slice(0, MATCHES_SHOWN);
  const pick = (n: TokenNode) => {
    onPick(n.id);
    setQuery("");
    setOpen(false);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, shown.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && shown[active]) {
      e.preventDefault();
      pick(shown[active]);
    } else if (e.key === "Escape") setOpen(false);
  };
  const listOpen = open && query.trim() !== "";
  return (
    <div className={styles.search}>
      <label htmlFor={`${id}-input`} className={styles.fieldLabel}>
        Find a decision, token or component
      </label>
      <input
        id={`${id}-input`}
        className={styles.input}
        type="search"
        role="combobox"
        aria-expanded={listOpen}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={listOpen && shown[active] ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        placeholder="For example: button height"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => setOpen(true)}
      />
      {listOpen && (
        <div className={styles.results}>
          <ul id={`${id}-list`} role="listbox" aria-label="Matches" className={styles.list}>
            {shown.map((n, i) => (
              <li
                key={n.id}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                className={`${styles.option} ${i === active ? styles.optionActive : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(n);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span className={styles.optionLabel}>{n.label}</span>
                <span className={styles.optionTier}>{tierLabel[n.tier]}</span>
              </li>
            ))}
          </ul>
          <p className={styles.resultNote} role="status">
            {matches.length === 0
              ? "No matches. Try a shorter word."
              : matches.length > shown.length
                ? `${shown.length} of ${matches.length} matches. Type more to narrow them.`
                : `${matches.length} ${matches.length === 1 ? "match" : "matches"}.`}
          </p>
        </div>
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

const readFocus = () => new URLSearchParams(window.location.search).get("focus");

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
  const tierLabel = useMemo(() => Object.fromEntries(map.tiers.map((t) => [t.id, t.label])), [map]);
  const [focus, setFocus] = useState<string | null>(() => {
    const f = readFocus();
    return f && byId.has(f) ? f : null;
  });
  const flow = useReactFlow();

  const pick = useCallback((id: string) => {
    setFocus(id);
    const url = new URL(window.location.href);
    url.searchParams.set("focus", id);
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const traced = useMemo(() => (focus && byId.has(focus) ? trace(graph, focus) : null), [graph, focus, byId]);

  const { nodes, edges, perTier, span } = useMemo(() => {
    if (!traced)
      return { nodes: [] as Node[], edges: [] as Edge[], perTier: [] as { tier: string; ids: string[] }[], span: 0 };
    const ids = [...traced.nodes].filter((id) => byId.has(id));
    const list = [...traced.edges].map((i) => graph.edges[i]);
    const tierOf = (id: string) => byId.get(id)!.tier;
    const { placed, columns } = layout({ ids, edges: list, tierOf, tiers: map.tiers.map((t) => t.id) });
    const count = (tier: string) => ids.filter((id) => tierOf(id) === tier).length;
    const flowNodes: Node[] = [
      ...columns.map((c) => ({
        id: `column:${c.tier}`,
        type: "column",
        position: { x: c.x, y: c.top - 48 },
        data: { label: tierLabel[c.tier], count: count(c.tier) },
        draggable: false,
        selectable: false,
        focusable: false,
      })),
      ...placed.map((p) => ({
        id: p.id,
        type: "token",
        position: { x: p.x, y: p.y },
        data: { node: byId.get(p.id)!, focus: p.id === focus, onPick: pick, tierLabel: tierLabel[tierOf(p.id)] },
        draggable: false,
        focusable: false,
      })),
    ];
    const flowEdges: Edge[] = [...traced.edges].map((i) => {
      const e = graph.edges[i];
      return {
        id: `e${i}`,
        source: e.from,
        target: e.to,
        className: e.kind === "decision" ? styles.edgeDecision : styles.edgeReference,
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
        focusable: false,
      };
    });
    const perTier = columns.map((c) => ({
      tier: c.tier,
      ids: placed.filter((p) => tierOf(p.id) === c.tier).map((p) => p.id),
    }));
    // The drawing's height at full size, column heads included: a short chain gets a short canvas.
    const span = Math.max(...placed.map((p) => p.y)) + NODE_HEIGHT - (columns[0]?.top ?? 0) + 48;
    return { nodes: flowNodes, edges: flowEdges, perTier, span };
  }, [traced, graph, byId, map, tierLabel, focus, pick]);

  // Frame the whole chain whenever the item changes. A chain too long to read at half size frames
  // the item and its direct links instead; the rest is a pan or a zoom away.
  useEffect(() => {
    if (!nodes.length || !focus) return;
    const near = new Set([focus]);
    for (const e of edges) {
      if (e.source === focus) near.add(e.target);
      if (e.target === focus) near.add(e.source);
    }
    const t = setTimeout(async () => {
      await flow.fitView({ padding: 0.08, maxZoom: 1, duration: 0 });
      if (flow.getZoom() < 0.5)
        await flow.fitView({
          nodes: [...near].map((id) => ({ id })),
          padding: 0.15,
          maxZoom: 1,
          minZoom: 0.5,
          duration: 0,
        });
    }, 0);
    return () => clearTimeout(t);
  }, [focus, nodes, edges, flow]);

  const focused = focus ? byId.get(focus) : null;
  const examples = useMemo(() => {
    const prefer = ["decision/accessibility.values", "component.button.height", "ui/button"];
    const found = prefer.map((id) => byId.get(id)).filter(Boolean) as TokenNode[];
    if (found.length) return found;
    return ["decision", "semantic", "component"]
      .map((t) => graph.nodes.find((n) => n.tier === t))
      .filter(Boolean) as TokenNode[];
  }, [byId, graph]);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Search nodes={graph.nodes} tierLabel={tierLabel} onPick={pick} />
        <ModeToggle mode={mode} onMode={onMode} />
      </div>
      {!focused ? (
        <div className={styles.empty}>
          <p>
            Pick an item to trace it. The map holds {graph.nodes.length.toLocaleString("en-US")} items and{" "}
            {graph.edges.length.toLocaleString("en-US")} links. It shows one chain at a time.
          </p>
          <p className={styles.examplesLabel}>Try one of these:</p>
          <ul className={styles.examples}>
            {examples.map((n) => (
              <li key={n.id}>
                <button type="button" className={styles.example} onClick={() => pick(n.id)}>
                  {n.label} <span className={styles.optionTier}>{tierLabel[n.tier]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <section className={styles.summary} aria-live="polite" aria-label="The item you trace">
            <p className={styles.summaryHead}>
              <span className={styles.summaryTier}>{tierLabel[focused.tier]}</span>
              <strong className={styles.summaryTitle}>{focused.label}</strong>
              {focused.value && (
                <span className={styles.summaryValue}>
                  {isColor(focused) && (
                    <span className={styles.swatch} style={{ background: focused.value }} aria-hidden="true" />
                  )}
                  {focused.tier === "decision" ? `Answer: ${focused.value}` : focused.value}
                  {focused.tier !== "decision" && focused.tier !== "component" && (
                    <span className={styles.summaryMode}>in {mode}</span>
                  )}
                </span>
              )}
            </p>
            {focused.description && <p className={styles.summaryWhy}>{focused.description}</p>}
            <p className={styles.summaryCount}>
              {traced!.nodes.size} items in this chain:{" "}
              {perTier
                .map((t) => `${t.ids.length} ${tierLabel[t.tier].toLowerCase()}${t.ids.length === 1 ? "" : "s"}`)
                .join(", ")}
              .
            </p>
          </section>
          <div
            className={styles.canvas}
            style={{ height: `clamp(20rem, ${Math.ceil(span) + 96}px, calc(100vh - 8rem))` }}
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
              onlyRenderVisibleElements
              minZoom={0.05}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
              aria-label={`Token map: the chain of ${focused.label}`}
            >
              <Background gap={24} size={1} />
              <Controls
                showInteractive={false}
                position="bottom-right"
                orientation="horizontal"
                className={styles.controls}
              />
            </ReactFlow>
          </div>
          <p className={styles.legend}>
            <span className={styles.legendReference} aria-hidden="true" /> Solid line: the value flows to the item that
            reads it.
            <span className={styles.legendDecision} aria-hidden="true" /> Dashed line: a decision picks the value.
            Select an item to trace it.
          </p>
          <details className={styles.asList}>
            <summary>The chain as a list</summary>
            {perTier.map((t) => (
              <div key={t.tier}>
                <h3 className={styles.listTier}>{tierLabel[t.tier]}</h3>
                <ul>
                  {t.ids.map((id) => {
                    const n = byId.get(id)!;
                    return (
                      <li key={id}>
                        <button type="button" className={styles.linkButton} onClick={() => pick(id)}>
                          {n.label}
                        </button>
                        {n.value ? `: ${n.tier === "decision" ? `answer ${n.value}` : n.value}` : ""}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </details>
        </>
      )}
    </div>
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
