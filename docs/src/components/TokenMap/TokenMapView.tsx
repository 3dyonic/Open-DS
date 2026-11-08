import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  NodeToolbar,
  Panel,
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
import {
  colorIndex,
  componentsShowing,
  contrastsOf,
  groupsReading,
  impactOf,
  plainName,
  primitiveParts,
  reasonChain,
  rowLabel,
  selectionFor,
  tokenName,
  type Check,
  type ColorIndex,
  type Graph,
  type Reason,
  type ReasonStep,
} from "../../../../cli/src/color-map.mjs";
import { ratioText } from "../../../../cli/src/token-measure.mjs";
import { Picker, type Option } from "../Picker";
import styles from "./styles.module.css";

// The Token map page (OD-274): this scheme's colors. A color value is a word with a meaning; a
// semantic token is a decision that uses the word for one job; a component token is where you see
// the decision. Four boxes pick a hue, a step, a semantic group and a decision; the graph shows the
// same path, and a click on the graph sets the boxes. A selected decision shows the chain of answers
// behind it, and the word shows what changes when its value changes. The numbers and the paths are
// cli/src/color-map.mjs, the code the tests run; the data is static/token-map/ (scripts/generate.mjs).

export type Props = {
  scheme: string;
  /** The map file of each brand, as a path under static/. */
  files: Record<string, string>;
};
type Mode = "light" | "dark";
type MapFile = { scheme: string; brands: string[]; graphs: Record<string, Graph>; reasons: Record<string, Reason> };
type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; map: MapFile };
type Path = { hue: string | null; step: string | null; group: string | null; decision: string | null };

const NONE = "";
const COMPONENT_LIMIT = 4;
// Column x positions and widths, left to right.
const COL = { word: 0, group: 360, decision: 560, component: 940 };
const WIDTH = { word: 300, group: 160, decision: 320, component: 260, reason: 220 };
const GAP = 16;
const REASON_ROW = 190;

// A rough height for a box, from its text, so boxes in a column do not overlap before React Flow
// measures them. Characters per line at the box's width, about 7px a character.
const lines = (text: string | null | undefined, width: number) =>
  text ? Math.ceil(text.length / Math.max(1, Math.floor((width - 24) / 7))) : 0;

const readUrlFocus = () => new URLSearchParams(window.location.search).get("focus");
const writeUrlFocus = (id: string | null) => {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("focus", id);
  else url.searchParams.delete("focus");
  window.history.replaceState(null, "", url);
};

// The same step in the other mode, when the scheme has it: color.blue.light.600 → color.blue.dark.600.
function sameStep(index: ColorIndex, id: string | null): string | null {
  const p = id ? primitiveParts(id) : null;
  if (!p) return null;
  const other = `color.${p.hue}.${index.mode}.${p.step}`;
  return index.nodes.has(other) ? other : null;
}

type WordData = {
  id: string;
  value: string;
  contrasts: { label: string; ratio: number }[];
  impact: string;
  tryOptions: Option[];
  tryStep: string;
  onTry: (id: string) => void;
};
type GroupData = { id: string; count: number; open: boolean; onOpen: () => void };
type DecisionData = {
  id: string;
  description: string | null;
  check: Check;
  trying: boolean;
  selected: boolean;
  onSelect: () => void;
};
type ComponentData = { component: string; rows: { id: string; label: string }[] };
type MoreData = { count: number; open: boolean; onToggle: () => void };
type ReasonData = ReasonStep;

const Source = () => <Handle type="source" position={Position.Right} isConnectable={false} className={styles.handle} />;
const Target = ({ id }: { id?: string }) => (
  <Handle type="target" position={Position.Left} id={id} isConnectable={false} className={styles.handle} />
);

function WordView({ data }: NodeProps<Node<WordData>>) {
  return (
    <div className={`${styles.node} ${styles.word}`} style={{ width: WIDTH.word }}>
      <span className={styles.title}>{plainName(data.id)}</span>
      <span className={styles.id}>{data.id}</span>
      <span className={styles.swatchRow}>
        <span className={styles.swatchBig} style={{ background: data.value }} aria-hidden="true" />
        <span className={styles.mono}>{data.value}</span>
      </span>
      {data.contrasts.length > 0 && (
        <span className={styles.line}>
          Contrast: {data.contrasts.map((c) => `${ratioText(c.ratio)}:1 on ${c.label}`).join(" · ")}
        </span>
      )}
      <span className={styles.impact}>{data.impact}</span>
      {data.tryOptions.length > 0 && (
        <div className={`nodrag nopan ${styles.try}`}>
          <Picker label="Try another step" options={data.tryOptions} value={data.tryStep} onPick={data.onTry} />
        </div>
      )}
      <Source />
    </div>
  );
}

function GroupView({ data }: NodeProps<Node<GroupData>>) {
  return (
    <div className={styles.slot} style={{ width: WIDTH.group }}>
      <Target />
      <button
        type="button"
        className={`nodrag ${styles.node} ${styles.button} ${data.open ? styles.open : styles.closed}`}
        aria-expanded={data.open}
        onClick={data.onOpen}
      >
        <span className={styles.title}>
          {data.id} <span aria-hidden="true">{data.open ? "▾" : "▸"}</span>
        </span>
        <span className={styles.line}>{data.count === 1 ? "1 decision" : `${data.count} decisions`}</span>
      </button>
      <Source />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [note, setNote] = useState("");
  const copy = () => {
    const done = navigator.clipboard?.writeText(text);
    if (!done) {
      setNote("Copy is not available here. Select the name to copy it.");
      return;
    }
    done.then(
      () => setNote("Copied"),
      () => setNote("Copy did not work. Select the name to copy it."),
    );
  };
  return (
    <>
      <button type="button" className={`nodrag ${styles.toolButton}`} onClick={copy}>
        Copy token
      </button>
      <span role="status" className={styles.toolNote}>
        {note}
      </span>
    </>
  );
}

function DecisionView({ data }: NodeProps<Node<DecisionData>>) {
  const name = tokenName(data.id);
  return (
    <div className={styles.slot} style={{ width: WIDTH.decision }}>
      <NodeToolbar isVisible={data.selected} position={Position.Top} className={styles.toolbar}>
        <CopyButton text={name} />
      </NodeToolbar>
      <Target />
      <button
        type="button"
        className={`nodrag ${styles.node} ${styles.button} ${data.selected ? styles.selected : styles.open}`}
        aria-pressed={data.selected}
        onClick={data.onSelect}
      >
        <span className={`${styles.title} ${styles.mono}`}>{name}</span>
        {data.description && <span className={styles.line}>{data.description}</span>}
        {data.check && (
          <span className={data.check.met ? styles.met : styles.missed} title={data.check.rule}>
            {data.trying ? "With the step you try: " : ""}
            {data.check.text}
          </span>
        )}
      </button>
      <Source />
    </div>
  );
}

function ComponentView({ data }: NodeProps<Node<ComponentData>>) {
  return (
    <div className={`${styles.node} ${styles.component}`} style={{ width: WIDTH.component }}>
      <span className={styles.componentHead}>{data.component}</span>
      {data.rows.map((r) => (
        <span key={r.id} className={styles.row} title={r.id}>
          <Target id={r.id} />
          {r.label}
        </span>
      ))}
    </div>
  );
}

function MoreView({ data }: NodeProps<Node<MoreData>>) {
  return (
    <button
      type="button"
      className={`nodrag ${styles.node} ${styles.button} ${styles.closed}`}
      style={{ width: WIDTH.component }}
      aria-expanded={data.open}
      onClick={data.onToggle}
    >
      <span className={styles.title}>
        {data.open ? "Show fewer components" : `${data.count} more components`}{" "}
        <span aria-hidden="true">{data.open ? "▾" : "▸"}</span>
      </span>
    </button>
  );
}

function ReasonView({ data }: NodeProps<Node<ReasonData>>) {
  return (
    <div className={`${styles.node} ${styles.reason}`} style={{ width: WIDTH.reason }}>
      <Target />
      <span className={styles.reasonGroup}>{data.group}</span>
      <span className={styles.title}>{data.answer}</span>
      {data.why && <span className={styles.line}>{data.why}</span>}
      <Source />
    </div>
  );
}

const nodeTypes = {
  word: WordView,
  group: GroupView,
  decision: DecisionView,
  component: ComponentView,
  more: MoreView,
  reason: ReasonView,
};

function MapView({ map, mode, onMode, brand }: { map: MapFile; mode: Mode; onMode: (m: Mode) => void; brand: string }) {
  const index = useMemo(() => colorIndex(map.graphs[`${brand}/${mode}`], mode), [map, brand, mode]);
  const [path, setPath] = useState<Path>(() => {
    const focus = readUrlFocus();
    const s = focus ? selectionFor(index, focus) : null;
    return s ?? { hue: null, step: null, group: null, decision: null };
  });
  const [tryStep, setTryStep] = useState(NONE);
  const [more, setMore] = useState(false);
  const flow = useReactFlow();

  // A new mode keeps the path: the same step of the other ramp, and the decision while it still reads it.
  useEffect(() => {
    setPath((p) => {
      if (!p.step || primitiveParts(p.step)?.mode === index.mode) return p;
      const step = sameStep(index, p.step);
      if (!step) return { hue: p.hue, step: null, group: null, decision: null };
      const groups = groupsReading(index, step);
      const group = groups.find((g) => g.id === p.group);
      const decision = group?.decisions.includes(p.decision ?? "") ? p.decision : null;
      return { hue: p.hue, step, group: group ? group.id : null, decision };
    });
    setTryStep(NONE);
  }, [index]);

  useEffect(() => writeUrlFocus(path.decision ?? path.step), [path.decision, path.step]);

  const choose = useCallback((next: Partial<Path>) => {
    setPath((p) => {
      const out = { ...p, ...next };
      if ("hue" in next && next.hue !== p.hue) Object.assign(out, { step: null, group: null, decision: null });
      else if ("step" in next && next.step !== p.step) Object.assign(out, { group: null, decision: null });
      else if ("group" in next && next.group !== p.group) Object.assign(out, { decision: null });
      return out;
    });
    if ("hue" in next || "step" in next) setTryStep(NONE);
    setMore(false);
  }, []);

  const hue = index.hues.find((h) => h.id === path.hue) ?? null;
  const step = path.step && primitiveParts(path.step)?.mode === index.mode ? path.step : null;
  const groups = step ? groupsReading(index, step) : [];
  const group = groups.find((g) => g.id === path.group) ?? null;
  const decision = group && path.decision && group.decisions.includes(path.decision) ? path.decision : null;

  // The boxes: each lists only what exists under the one before it.
  const hueOptions: Option[] = index.hues.map((h) => ({
    id: h.id,
    label: h.id,
    color: h.steps[Math.floor(h.steps.length / 2)]?.value,
  }));
  const stepOptions: Option[] = (hue?.steps ?? []).map((s) => ({ id: s.id, label: s.step, color: s.value }));
  const groupOptions: Option[] = groups.map((g) => ({ id: g.id, label: g.id }));
  const decisionOptions: Option[] = (group?.decisions ?? []).map((d) => ({ id: d, label: tokenName(d) }));

  const value = step ? String(index.nodes.get(step)?.value) : "";
  const tried = tryStep && index.nodes.has(tryStep) ? String(index.nodes.get(tryStep)?.value) : null;
  const impact = useMemo(() => (step ? impactOf(index, step, tried ?? undefined) : null), [index, step, tried]);
  const checkOf = (d: string) => impact?.checks.find((c) => c.decision === d)?.check ?? null;
  const chain = useMemo(() => (decision ? reasonChain(index, map.reasons, decision) : null), [index, map, decision]);

  const drawn = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    if (!step || !impact) return { nodes, edges };
    const lit = (on: boolean) => (on ? styles.edgeLit : styles.edge);

    // The chain of reasons, a row above the graph: the deepest reason on the left, into the decision.
    let top = 0;
    if (chain && chain.steps.length) {
      const depth = new Map<string, number>([["decision", 0]]);
      const depthOf = (id: string): number => {
        if (depth.has(id)) return depth.get(id)!;
        const to = chain.links.filter((l) => l.from === id).map((l) => depthOf(l.to));
        const d = Math.max(0, ...to) + 1;
        depth.set(id, d);
        return d;
      };
      chain.steps.forEach((s) => depthOf(s.id));
      const max = Math.max(...chain.steps.map((s) => depth.get(s.id)!));
      const rows = new Map<number, number>();
      for (const s of chain.steps) {
        const d = depth.get(s.id)!;
        const row = rows.get(d) ?? 0;
        rows.set(d, row + 1);
        nodes.push({
          id: `reason:${s.id}`,
          type: "reason",
          position: { x: (max - d) * (WIDTH.reason + 40), y: row * REASON_ROW },
          data: s,
        });
      }
      // The graph starts below the tallest reason box, with room for the toolbar of the decision.
      const tallest = Math.max(
        ...chain.steps.map((s) => 56 + 20 * (lines(s.answer, WIDTH.reason) + lines(s.why, WIDTH.reason))),
      );
      top = (Math.max(...rows.values()) - 1) * REASON_ROW + tallest + 90;
      for (const l of chain.links)
        edges.push({
          id: `why:${l.from}>${l.to}`,
          source: `reason:${l.from}`,
          target: l.to === "decision" ? `decision:${decision}` : `reason:${l.to}`,
          className: styles.edgeReason,
        });
    }

    const tryOptions: Option[] = [
      { id: NONE, label: "No other step" },
      ...(hue?.steps ?? []).filter((s) => s.id !== step).map((s) => ({ id: s.id, label: s.step, color: s.value })),
    ];
    const n = impact.decisions;
    const c = impact.components;
    const impactText =
      n === 0
        ? "No decision uses this step yet."
        : `Changing ${plainName(step)} changes ${n === 1 ? "1 decision" : `${n} decisions`} and ${
            c === 1 ? "1 component" : `${c} components`
          }.`;
    nodes.push({
      id: "word",
      type: "word",
      position: { x: COL.word, y: top },
      data: {
        id: step,
        value,
        contrasts: contrastsOf(index, value),
        impact: impactText,
        tryOptions: n ? tryOptions : [],
        tryStep,
        onTry: setTryStep,
      },
    });

    let y = top;
    for (const g of groups) {
      const open = g.id === group?.id;
      nodes.push({
        id: `group:${g.id}`,
        type: "group",
        position: { x: COL.group, y },
        data: { id: g.id, count: g.decisions.length, open, onOpen: () => choose({ group: open ? null : g.id }) },
      });
      edges.push({ id: `w>${g.id}`, source: "word", target: `group:${g.id}`, className: lit(open) });
      y += 64 + GAP;
    }

    if (group) {
      y = top;
      for (const d of group.decisions) {
        const node = index.nodes.get(d);
        const selected = d === decision;
        nodes.push({
          id: `decision:${d}`,
          type: "decision",
          position: { x: COL.decision, y },
          data: {
            id: d,
            description: node?.description ?? null,
            check: checkOf(d),
            trying: !!tried,
            selected,
            onSelect: () => choose({ decision: selected ? null : d }),
          },
        });
        edges.push({ id: `${group.id}>${d}`, source: `group:${group.id}`, target: `decision:${d}`, className: lit(selected) });
        y += 70 + 18 * (lines(node?.description, WIDTH.decision) + 2) + GAP;
      }
    }

    if (decision) {
      const shown = componentsShowing(index, decision);
      const list = more ? shown : shown.slice(0, COMPONENT_LIMIT);
      y = top;
      for (const s of list) {
        const rows = s.rows.map((r) => ({ id: r, label: rowLabel(r) }));
        nodes.push({
          id: `component:${s.component}`,
          type: "component",
          position: { x: COL.component, y },
          data: { component: s.component, rows },
        });
        for (const r of rows)
          edges.push({
            id: `${decision}>${r.id}`,
            source: `decision:${decision}`,
            target: `component:${s.component}`,
            targetHandle: r.id,
            className: styles.edgeLit,
          });
        y += 44 + 30 * rows.length + GAP;
      }
      if (shown.length > COMPONENT_LIMIT)
        nodes.push({
          id: "more",
          type: "more",
          position: { x: COL.component, y },
          data: { count: shown.length - COMPONENT_LIMIT, open: more, onToggle: () => setMore((m) => !m) },
        });
    }
    return { nodes, edges };
  }, [index, step, impact, chain, hue, group, groups, decision, more, tryStep, tried, value, choose]);

  // Frame what is drawn on the next frame, after React Flow has measured the boxes.
  useEffect(() => {
    const frame = requestAnimationFrame(() => flow.fitView({ padding: 0.14, maxZoom: 1, duration: 0 }));
    return () => cancelAnimationFrame(frame);
  }, [drawn, flow]);

  return (
    <div className={styles.root}>
      <div className={styles.boxes}>
        <Picker
          label="Hue"
          options={hueOptions}
          value={hue?.id ?? NONE}
          onPick={(id) => choose({ hue: id })}
        />
        <Picker
          label="Step"
          options={stepOptions}
          value={step ?? NONE}
          onPick={(id) => choose({ step: id })}
          disabled={!hue}
        />
        <Picker
          label="Semantic group"
          options={groupOptions}
          value={group?.id ?? NONE}
          onPick={(id) => choose({ group: id })}
          disabled={!groupOptions.length}
        />
        <Picker
          label="Decision"
          options={decisionOptions}
          value={decision ?? NONE}
          onPick={(id) => choose({ decision: id })}
          disabled={!decisionOptions.length}
          wide
        />
        <div className={styles.toggle} role="group" aria-label="Values in">
          <span className={styles.fieldLabel}>Values in</span>
          <span className={styles.toggleButtons}>
            {(["light", "dark"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`${styles.toggleButton} ${m === mode ? styles.toggleOn : ""}`}
                aria-pressed={m === mode}
                onClick={() => onMode(m)}
              >
                {m === "light" ? "Light" : "Dark"}
              </button>
            ))}
          </span>
        </div>
      </div>
      {!step ? (
        <div className={styles.empty}>
          <p>Pick a hue and a step to see the decisions that use that color and the components where you see them.</p>
        </div>
      ) : (
        <div className={styles.canvas}>
          <ReactFlow
            nodes={drawn.nodes}
            edges={drawn.edges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            nodesFocusable={false}
            edgesFocusable={false}
            elementsSelectable={false}
            minZoom={0.2}
            maxZoom={1.5}
            panOnScroll
            zoomOnScroll={false}
            proOptions={{ hideAttribution: true }}
            aria-label={`Token map: ${plainName(step)}`}
          >
            <Background gap={24} size={1} />
            <Panel position="bottom-left" className={styles.legend}>
              <p>Solid lines: the value and what uses it.</p>
              <p>Dashed lines: the answers behind a decision.</p>
            </Panel>
            <Controls showInteractive={false} position="top-right" orientation="horizontal" className={styles.controls} />
            <MiniMap position="bottom-right" pannable zoomable className={styles.minimap} style={{ width: 140, height: 90 }} ariaLabel="Overview of the map" />
          </ReactFlow>
        </div>
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
  if (load.map.scheme !== scheme || !load.map.reasons)
    return (
      <div className={styles.error} role="alert">
        <p>The map file is not this page's map. Run pnpm --dir docs generate and build the docs again.</p>
      </div>
    );
  return (
    <ReactFlowProvider>
      <MapView map={load.map} mode={mode} onMode={setMode} brand={brand} />
    </ReactFlowProvider>
  );
}
