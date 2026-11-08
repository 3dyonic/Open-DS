import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
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
  useStore,
  useStoreApi,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  columnsFor,
  componentsReading,
  directReaders,
  familiesIn,
  groupsOf,
  mapIndex,
  pathTo,
  search,
  searchEntries,
  stepLabel,
  tokenName,
  COMPONENT_LIMIT,
  type ComponentReads,
  type MapIndex,
  type MapPath,
  type Scope,
  type SearchEntry,
  type TokenGraph,
  type TokenNode,
} from "../../../../cli/src/token-trace.mjs";
import { BACKGROUNDS, contrasts, jobCheck, measure, ratioText } from "../../../../cli/src/token-measure.mjs";
import { layout, type LayoutColumn, type Level } from "./layout";
import styles from "./styles.module.css";

// The Token map page (OD-274). The primitives are the scheme's words and the semantic tokens are the
// decisions that read them, so the map opens from the words: a scope, a family, a step, the word,
// the semantic groups and decisions that read it, and the components that read a decision. Each
// click opens the next column; one box per column is open. The graph comes from static/token-map/
// (scripts/generate.mjs writes it from cli/src/token-graph.mjs); what each column holds is
// cli/src/token-trace.mjs and the numbers are cli/src/token-measure.mjs, the code the tests run.

export type Props = {
  scheme: string;
  /** The graph file of each brand, as a path under static/. */
  files: Record<string, string>;
};
type MapFile = {
  scheme: string;
  name: string;
  scopes: Scope[];
  brands: string[];
  graphs: Record<string, TokenGraph>;
};
type Mode = "light" | "dark";
type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; map: MapFile };

const HEADS: Record<Level, string> = {
  scope: "Scope",
  scale: "Scale",
  step: "Step",
  word: "The word",
  group: "Semantic group",
  decision: "Decision",
  where: "Where you see it",
  start: "Decision",
  readers: "What reads it",
};
const LEVELS: Level[] = ["scope", "scale", "step", "word", "group", "decision"];
// The path's key for each level that holds an open box.
const PATH_KEY: Partial<Record<Level, keyof MapPath>> = {
  scope: "scope",
  scale: "family",
  step: "step",
  group: "group",
  decision: "decision",
};

const isColor = (n: TokenNode | undefined) => n?.type === "color" && Boolean(n.value);
const plural = (n: number, one: string, many: string) => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;
const flowId = (level: Level, id: string) => `${level}:${id}`;

function Swatch({ color }: { color: string | null | undefined }) {
  return color ? <span className={styles.swatch} style={{ background: color }} aria-hidden="true" /> : null;
}

// A box that opens the next column: the whole box is the button.
function OpenButton({
  open,
  label,
  onToggle,
  className,
  children,
}: {
  open: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`nodrag ${styles.node} ${styles.openable} ${open ? styles.open : ""} ${className ?? ""}`}
      aria-expanded={open}
      aria-label={label}
      onClick={onToggle}
    >
      {children}
      <span className={styles.caret} aria-hidden="true">
        {open ? "▾" : "▸"}
      </span>
    </button>
  );
}

type Common = { width: number; faded: boolean; lit: boolean };
type OpenData = Common & {
  open: boolean;
  label: string;
  title: string;
  sub?: string;
  swatch?: string | null;
  onToggle: () => void;
};
type WordData = Common & { node: TokenNode; lines: string[] };
type DecisionData = Common & {
  node: TokenNode;
  open: boolean;
  selected: boolean;
  check: { met: boolean; text: string; rule: string } | null;
  onToggle?: () => void;
  onTrace?: () => void;
};
type WhereData = Common & { reads: ComponentReads; row: string | null };
type HeadData = { label: string; width: number };

const Target = () => <Handle type="target" position={Position.Left} isConnectable={false} className={styles.handle} />;
const Source = () => <Handle type="source" position={Position.Right} isConnectable={false} className={styles.handle} />;
const stateClass = (d: Common) => `${d.faded ? styles.faded : ""} ${d.lit ? styles.lit : ""}`;

function OpenNodeView({ data }: NodeProps<Node<OpenData>>) {
  return (
    <div className={stateClass(data)} style={{ width: data.width }}>
      <Target />
      <OpenButton open={data.open} label={data.label} onToggle={data.onToggle}>
        <span className={styles.nodeTop}>
          <Swatch color={data.swatch} />
          <span className={styles.nodeTitle}>{data.title}</span>
        </span>
        {data.sub && <span className={styles.nodeSub}>{data.sub}</span>}
      </OpenButton>
      <Source />
    </div>
  );
}

function WordView({ data }: NodeProps<Node<WordData>>) {
  const { node } = data;
  return (
    <div className={stateClass(data)} style={{ width: data.width }}>
      <Target />
      <div className={`${styles.node} ${styles.word}`} aria-current="true">
        <span className={styles.nodeTop}>
          <span className={styles.nodeTitle}>{node.id}</span>
        </span>
        {node.value && (
          <span className={styles.nodeValue}>
            {isColor(node) && <Swatch color={node.value} />}
            <span className={styles.nodeValueText}>{node.value}</span>
          </span>
        )}
        {node.meaning && <span className={styles.nodeLine}>{node.meaning}</span>}
        {data.lines.map((line) => (
          <span key={line} className={styles.nodeSub}>
            {line}
          </span>
        ))}
      </div>
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
  const { node, check } = data;
  const name = tokenName(node.id);
  const body = (
    <>
      <span className={styles.nodeTop}>
        <span className={`${styles.nodeTitle} ${styles.tokenName}`}>{name}</span>
      </span>
      {node.description && <span className={styles.nodeLine}>{node.description}</span>}
      {(node.answers ?? []).map((a) => (
        <span key={a.question} className={styles.answer}>
          {a.question} → {a.answer}
        </span>
      ))}
      {check && (
        <span className={check.met ? styles.checkMet : styles.checkMissed} title={check.rule}>
          {check.text}
        </span>
      )}
    </>
  );
  return (
    <div className={stateClass(data)} style={{ width: data.width }}>
      <NodeToolbar isVisible={data.selected} position={Position.Top} className={styles.toolbarNode}>
        <CopyButton text={name} />
        {data.onTrace && (
          <button type="button" className={`nodrag ${styles.toolButton}`} onClick={data.onTrace}>
            Trace from here
          </button>
        )}
      </NodeToolbar>
      <Target />
      {data.onToggle ? (
        <OpenButton
          open={data.open}
          label={`${data.open ? "Close" : "Open"} ${name}`}
          onToggle={data.onToggle}
          className={`${styles.decision} ${data.selected ? styles.selected : ""}`}
        >
          {body}
        </OpenButton>
      ) : (
        <div className={`${styles.node} ${styles.decision} ${styles.selected}`}>{body}</div>
      )}
      <Source />
    </div>
  );
}

function WhereView({ data }: NodeProps<Node<WhereData>>) {
  return (
    <div className={stateClass(data)} style={{ width: data.width }}>
      <div className={`${styles.node} ${styles.where}`}>
        <span className={styles.nodeTitle}>{data.reads.label}</span>
        <ul className={styles.rows}>
          {data.reads.rows.map((r) => (
            <li key={r.id} className={`${styles.row} ${data.row === r.id ? styles.rowFound : ""}`} title={r.id}>
              <Handle
                type="target"
                id={r.id}
                position={Position.Left}
                isConnectable={false}
                className={styles.handle}
              />
              {r.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HeadView({ data }: NodeProps<Node<HeadData>>) {
  return (
    <div className={styles.columnHead} style={{ width: data.width }}>
      {data.label}
    </div>
  );
}

const nodeTypes = { open: OpenNodeView, word: WordView, decision: DecisionView, where: WhereView, head: HeadView };

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

// The search: a combobox over every value, semantic token and component token. Arrows move, Enter
// opens the path to the match, Escape closes the list, then clears the box.
function Search({ entries, onPick }: { entries: SearchEntry[]; onPick: (e: SearchEntry) => void }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const { matches, total } = useMemo(() => search(entries, query), [entries, query]);
  const showList = expanded && query.trim().length > 0;
  const pick = (e: SearchEntry) => {
    onPick(e);
    setExpanded(false);
    setQuery(e.label);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setExpanded(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => Math.min(Math.max(a + step, 0), Math.max(matches.length - 1, 0)));
    } else if (e.key === "Enter" && showList && matches[active]) {
      e.preventDefault();
      pick(matches[active]);
    } else if (e.key === "Escape") {
      if (showList) setExpanded(false);
      else setQuery("");
    }
  };
  return (
    <div className={styles.search}>
      <input
        id={`${listId}-input`}
        aria-label="Find a value, token or component"
        className={styles.searchInput}
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        placeholder="Find a value, token or component…"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && matches[active] ? `${listId}-${active}` : undefined}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setExpanded(true);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setExpanded(false)}
      />
      <div className={styles.searchPopup} hidden={!showList}>
        <ul id={listId} role="listbox" aria-label="Matches" className={styles.searchList}>
          {matches.map((m, i) => (
            <li
              key={m.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`${styles.searchOption} ${i === active ? styles.searchActive : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(m);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span className={styles.searchLabel}>{m.label}</span>
              <span className={styles.searchKind}>{m.kind}</span>
              {m.detail && <span className={styles.searchDetail}>{m.detail}</span>}
            </li>
          ))}
        </ul>
        <p className={styles.searchNote} role="status">
          {total === 0
            ? "Nothing matches."
            : total > matches.length
              ? `${plural(total - matches.length, "more match", "more matches")}. Type more to narrow.`
              : ""}
        </p>
      </div>
    </div>
  );
}

type Crumb = { label: string; onClick?: () => void };

function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Open path" className={styles.breadcrumb}>
      <ol>
        {crumbs.map((c, i) => (
          <li key={`${i}:${c.label}`}>
            {c.onClick ? (
              <button type="button" className={styles.crumb} onClick={c.onClick}>
                {c.label}
              </button>
            ) : (
              <span aria-current="location" className={styles.crumbHere}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// The room the framed map leaves at each edge: at the top for the selected box's toolbar, and at the
// bottom, where the legend and the minimap sit.
const PAD = { top: 56, side: 24, bottom: 128 };
const MIN_ZOOM = 0.55;

/**
 * The view that frames the map: as wide as the canvas allows, never below MIN_ZOOM, from the top. A
 * long column runs past the bottom, and the reader scrolls it; the view moves down only as far as
 * the open boxes and the first box of the last column need.
 */
function frameOf({
  nodes,
  drawn,
  heights,
  canvas,
}: {
  nodes: Node[];
  drawn: Drawn;
  heights: Record<string, number>;
  canvas: { width: number; height: number };
}) {
  const boxes = nodes.filter((n) => n.type !== "head");
  const right = Math.max(...nodes.map((n) => n.position.x + ((n.data as { width?: number }).width ?? 0)));
  const zoom = Math.min(1, Math.max(MIN_ZOOM, (canvas.width - 2 * PAD.side) / right));
  const keepIds = new Set(drawn.columns.flatMap((c) => (c.open ? [c.open] : [])));
  const last = drawn.columns.at(-1)?.ids[0];
  if (last) keepIds.add(last);
  const keep = boxes.filter((n) => keepIds.has(n.id));
  const bottom = Math.max(0, ...keep.map((n) => n.position.y + (heights[n.id] ?? 0)));
  const room = (canvas.height - PAD.top - PAD.bottom) / zoom;
  const top = Math.max(0, bottom - room);
  const x = Math.max(PAD.side, (canvas.width - right * zoom) / 2);
  return { x, y: PAD.top - top * zoom, zoom };
}

const readFocus = () => new URLSearchParams(window.location.search).get("focus");
const writeFocus = (id: string | null) => {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("focus", id);
  else url.searchParams.delete("focus");
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
};

// What the map draws: its columns, and the boxes and lines on the selected path.
type Drawn = { columns: LayoutColumn[]; edges: Edge[]; lit: Set<string> };

function MapView({ map, mode, onMode, brand }: { map: MapFile; mode: Mode; onMode: (m: Mode) => void; brand: string }) {
  const graph = map.graphs[`${brand}/${mode}`] ?? Object.values(map.graphs)[0];
  const index: MapIndex = useMemo(() => mapIndex(graph, { scopes: map.scopes, mode }), [graph, map.scopes, mode]);
  const [opened] = useState(() => {
    const focus = readFocus();
    return focus ? pathTo(index, focus) : null;
  });
  const [rawPath, setRawPath] = useState<MapPath>(opened?.path ?? {});
  const [more, setMore] = useState(opened?.more ?? false);
  const [row, setRow] = useState<string | null>(opened?.row ?? null);
  const [traceFrom, setTraceFrom] = useState<string | null>(null);
  // The measured heights of the boxes drawn so far, so long boxes push the next ones down.
  const [heights, setHeights] = useState<Record<string, number>>({});
  const flow = useReactFlow();
  const store = useStoreApi();
  // Changes whenever React Flow measures a box again.
  const canvasWidth = useStore((s) => s.width);
  const canvasHeight = useStore((s) => s.height);
  const canvas = useMemo(() => ({ width: canvasWidth, height: canvasHeight }), [canvasWidth, canvasHeight]);
  const measured = useStore((s) => {
    let key = "";
    for (const n of s.nodeLookup.values()) key += `${n.id}:${n.measured?.height ?? 0};`;
    return key;
  });

  const columns = useMemo(() => columnsFor(index, rawPath, { more }), [index, rawPath, more]);
  // The path as it holds in this mode: a column's open box, by level.
  const path: MapPath = useMemo(() => {
    const out: MapPath = {};
    for (const c of columns) {
      const key = PATH_KEY[c.level as Level];
      if (key && c.open) out[key] = c.open;
    }
    return out;
  }, [columns]);
  const selected = traceFrom ?? path.decision ?? null;

  const go = useCallback((next: MapPath, options: { more?: boolean; row?: string | null } = {}) => {
    setRawPath(next);
    setMore(options.more ?? false);
    setRow(options.row ?? null);
    setTraceFrom(null);
  }, []);
  const openTo = useCallback(
    (id: string) => {
      const found = pathTo(index, id);
      if (found) go(found.path, { more: found.more, row: found.row });
    },
    [index, go],
  );

  useEffect(() => {
    writeFocus(traceFrom ?? path.decision ?? (path.step ? (index.words.get(path.step)?.id ?? null) : null));
  }, [traceFrom, path, index]);

  const backgrounds = useMemo(
    () => BACKGROUNDS.map((id) => ({ id, value: index.byId.get(id)?.value ?? null })).filter((b) => b.value),
    [index],
  );
  const valueOf = useCallback((id: string) => index.byId.get(id)?.value ?? null, [index]);
  const checkOf = useCallback(
    (node: TokenNode) => jobCheck({ id: node.id, value: node.value, tone: node.tone }, { backgrounds, valueOf }),
    [backgrounds, valueOf],
  );
  // What the word's value measures: its contrast on each background for a color, else the tap size
  // or focus ring checks.
  const wordLines = useCallback(
    (node: TokenNode) => {
      if (isColor(node)) {
        const on = contrasts(node.value, backgrounds);
        return on.length ? [`Contrast ${on.map((c) => `${ratioText(c.ratio)}:1 on ${c.label}`).join(" · ")}`] : [];
      }
      return measure(node, { backgrounds }).map((l) =>
        l.met === undefined ? l.text : `${l.met ? "✓" : "✗"} ${l.text}`,
      );
    },
    [backgrounds],
  );

  const toggle = useCallback(
    (level: Level, id: string) => {
      const key = PATH_KEY[level]!;
      const keep: MapPath = {};
      for (const l of LEVELS) {
        const k = PATH_KEY[l];
        if (!k) continue;
        if (k === key) break;
        if (path[k]) keep[k] = path[k];
      }
      go(path[key] === id ? keep : { ...keep, [key]: id });
    },
    [path, go],
  );

  const drawn: Drawn = useMemo(() => {
    const lit = new Set<string>();
    const edges: Edge[] = [];
    const edge = (source: string, target: string, kind: "lit" | "open" | "plain", targetHandle?: string) =>
      edges.push({
        id: `${source}>${target}${targetHandle ? `#${targetHandle}` : ""}`,
        source,
        target,
        targetHandle,
        className: kind === "lit" ? styles.edgeLit : kind === "open" ? styles.edgeOpen : styles.edge,
        focusable: false,
      });

    if (traceFrom) {
      const readers = directReaders(index, traceFrom);
      const comps = componentsReading(index, traceFrom);
      const shown = more ? comps : comps.slice(0, COMPONENT_LIMIT);
      const ids = [
        ...readers.map((r) => flowId("readers", r)),
        ...shown.map((c) => flowId("where", c.component)),
        ...(comps.length > shown.length || (more && comps.length > COMPONENT_LIMIT) ? ["more:readers"] : []),
      ];
      const start = flowId("start", traceFrom);
      for (const r of readers) edge(start, flowId("readers", r), "lit");
      for (const c of shown) for (const r of c.rows) edge(start, flowId("where", c.component), "lit", r.id);
      const cols: LayoutColumn[] = [{ level: "start", ids: [start], open: start }];
      if (ids.length) cols.push({ level: "readers", ids, open: null });
      return { columns: cols, edges, lit };
    }

    const cols: LayoutColumn[] = [];
    let parent: string | null = null;
    // The boxes on the open path, lit when a decision is selected.
    for (const c of columns) {
      const level = c.level as Level;
      const ids = c.ids.map((id) => flowId(level, id));
      if (level === "where" && (c.hidden || (more && c.ids.length > COMPONENT_LIMIT))) ids.push("more:where");
      cols.push({ level, ids, open: c.open ? flowId(level, c.open) : null });
      if (c.open) lit.add(flowId(level, c.open));
      if (parent)
        for (const id of c.ids) {
          const target = flowId(level, id);
          if (level === "where") {
            const reads = componentsReading(index, path.decision!).find((r) => r.component === id);
            for (const r of reads?.rows ?? []) edge(parent, target, selected ? "lit" : "open", r.id);
            lit.add(target);
          } else edge(parent, target, id === c.open ? (selected ? "lit" : "open") : "plain");
        }
      parent = c.open ? flowId(level, c.open) : null;
    }
    return { columns: cols, edges, lit };
  }, [traceFrom, index, more, columns, path.decision, selected]);

  const nodes: Node[] = useMemo(() => {
    const estimate = (id: string) => {
      const level = id.split(":")[0];
      if (level === "word") return 120;
      if (level === "decision" || level === "start" || level === "readers") return 120;
      if (level === "where") return 40 + 26 * 3;
      return level === "scope" || level === "group" ? 56 : 40;
    };
    const { placed, heads } = layout({ columns: drawn.columns, heightOf: (id) => heights[id] ?? estimate(id) });
    const fade = (id: string) => Boolean(selected) && !traceFrom && !drawn.lit.has(id);
    const comps = (decision: string) => componentsReading(index, decision);
    const whereOf = traceFrom ?? path.decision ?? "";
    const allComps = whereOf ? comps(whereOf) : [];

    const flowNodes: Node[] = heads.map((h) => ({
      id: `head:${h.level}`,
      type: "head",
      position: { x: h.x, y: 0 },
      data: { label: HEADS[h.level], width: h.width },
      draggable: false,
      selectable: false,
      focusable: false,
    }));
    for (const p of placed) {
      // The box's kind is its id's prefix: the "What reads it" column holds decisions and components.
      const level = p.id.slice(0, p.id.indexOf(":")) as Level;
      const id = p.id.slice(p.id.indexOf(":") + 1);
      const common = {
        id: p.id,
        position: { x: p.x, y: p.y },
        draggable: false,
        focusable: false,
        selectable: false,
      };
      const look = { width: p.width, faded: fade(p.id), lit: Boolean(selected) && drawn.lit.has(p.id) && !traceFrom };
      const openData = (title: string, sub: string | undefined, swatch?: string | null) => {
        const open = path[PATH_KEY[level]!] === id;
        return {
          ...look,
          open,
          title,
          sub,
          swatch,
          label: `${open ? "Close" : "Open"} ${title}${sub ? `, ${sub}` : ""}`,
          onToggle: () => toggle(level, id),
        };
      };
      if (p.id.startsWith("more:")) {
        const hidden = allComps.length - COMPONENT_LIMIT;
        flowNodes.push({
          ...common,
          type: "open",
          data: {
            ...look,
            faded: false,
            open: more,
            title: more ? "Show fewer components" : `+ ${plural(hidden, "more component", "more components")}`,
            label: more ? "Show fewer components" : `Show ${plural(hidden, "more component", "more components")}`,
            onToggle: () => setMore((m) => !m),
          },
        });
      } else if (level === "scope") {
        const scope = index.scopes.find((s) => s.id === id)!;
        flowNodes.push({
          ...common,
          type: "open",
          data: openData(scope.title, plural(scope.keys.length, "value", "values")),
        });
      } else if (level === "scale") {
        const family = familiesIn(index, path.scope!)!.find((f) => f.id === id)!;
        const swatch = family.swatch ? index.byId.get(index.words.get(family.swatch)!.id)?.value : null;
        flowNodes.push({ ...common, type: "open", data: openData(family.label, undefined, swatch) });
      } else if (level === "step") {
        const node = index.byId.get(index.words.get(id)!.id)!;
        const label = stepLabel(index, { key: id, family: path.family });
        flowNodes.push({
          ...common,
          type: "open",
          data: openData(
            label,
            isColor(node) ? undefined : (node.value ?? undefined),
            isColor(node) ? node.value : null,
          ),
        });
      } else if (level === "word") {
        const node = index.byId.get(index.words.get(id)!.id)!;
        flowNodes.push({ ...common, type: "word", data: { ...look, node, lines: wordLines(node) } });
      } else if (level === "group") {
        const group = groupsOf(index, path.step!).find((g) => g.id === id)!;
        flowNodes.push({
          ...common,
          type: "open",
          data: openData(group.label, plural(group.decisions.length, "decision", "decisions")),
        });
      } else if (level === "decision" || level === "start" || level === "readers") {
        const node = index.byId.get(id)!;
        const isOpen = level === "decision" && path.decision === id;
        flowNodes.push({
          ...common,
          type: "decision",
          data: {
            ...look,
            node,
            open: isOpen,
            selected: isOpen || level === "start",
            check: checkOf(node),
            onToggle:
              level === "decision" ? () => toggle("decision", id) : level === "readers" ? () => openTo(id) : undefined,
            onTrace: level === "decision" ? () => setTraceFrom(id) : undefined,
          },
        });
      } else if (level === "where") {
        const reads = allComps.find((c) => c.component === id)!;
        flowNodes.push({ ...common, type: "where", data: { ...look, reads, row } });
      }
    }
    return flowNodes;
  }, [drawn, heights, selected, traceFrom, index, path, more, row, toggle, openTo, wordLines, checkOf]);

  // Once the boxes are drawn, keep their real heights; a change lays the map out again. The page
  // passes its nodes in without a change handler, so the sizes are read from React Flow's store.
  const framed = useRef("");
  useEffect(() => {
    const drawnNodes = [...store.getState().nodeLookup.values()].filter((n) => n.type !== "head");
    if (!drawnNodes.length || drawnNodes.some((n) => !n.measured?.height)) return;
    const next = Object.fromEntries(drawnNodes.map((n) => [n.id, Math.ceil(n.measured.height!)]));
    if (Object.entries(next).some(([id, h]) => heights[id] !== h)) {
      // Lay out again on the next frame, not inside the browser's resize pass: a new layout moves and
      // resizes boxes, and doing that in the same frame makes the browser report a ResizeObserver loop.
      const frame = requestAnimationFrame(() => setHeights((old) => ({ ...old, ...next })));
      return () => cancelAnimationFrame(frame);
    }
    // Frame the map again only when its set of boxes changes, so a reader's own pan and zoom stay.
    const key = nodes.map((n) => n.id).join("|");
    if (framed.current === key || !canvas.width) return;
    framed.current = key;
    const frame = requestAnimationFrame(() =>
      flow.setViewport(frameOf({ nodes, drawn, heights, canvas }), { duration: 0 }),
    );
    return () => cancelAnimationFrame(frame);
  }, [measured, nodes, heights, store, flow, drawn, canvas]);

  const entries = useMemo(() => searchEntries(index), [index]);
  const onFind = useCallback((e: SearchEntry) => openTo(e.id), [openTo]);

  const crumbs: Crumb[] = [{ label: map.name, onClick: () => go({}) }];
  const crumbFor = (label: string, upTo: MapPath) => crumbs.push({ label, onClick: () => go(upTo) });
  if (path.scope) crumbFor(index.scopes.find((s) => s.id === path.scope)!.title, { scope: path.scope });
  if (path.family)
    crumbFor(familiesIn(index, path.scope!)!.find((f) => f.id === path.family)!.label, {
      scope: path.scope,
      family: path.family,
    });
  const upToStep = { scope: path.scope, family: path.family, step: path.step };
  if (path.step) crumbFor(stepLabel(index, { key: path.step, family: path.family }), upToStep);
  if (path.group)
    crumbFor(groupsOf(index, path.step!).find((g) => g.id === path.group)!.label, { ...upToStep, group: path.group });
  if (path.decision) crumbFor(tokenName(path.decision), { ...upToStep, group: path.group, decision: path.decision });
  if (traceFrom) crumbs.push({ label: `What reads ${tokenName(traceFrom)}` });
  // The last crumb is where the map is: it names it and is not a button.
  crumbs[crumbs.length - 1] = { label: crumbs[crumbs.length - 1].label };

  const ariaLabel = selected ? `Token map: ${tokenName(selected)} and what reads it` : `Token map of ${map.name}`;

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Breadcrumb crumbs={crumbs} />
        <div className={styles.toolbarEnd}>
          <Search entries={entries} onPick={onFind} />
          <ModeToggle mode={mode} onMode={onMode} />
        </div>
      </div>
      {index.scopes.length === 0 ? (
        <div className={styles.empty}>
          <p>This scheme has no primitives to show.</p>
        </div>
      ) : (
        <div className={styles.canvas}>
          <ReactFlow
            nodes={nodes}
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
            aria-label={ariaLabel}
          >
            <Background gap={24} size={1} />
            <Panel position="bottom-left" className={styles.legend}>
              <p>Click a box to open the next column: ▸ closed, ▾ open.</p>
              <p>Click an open box again to close it.</p>
              <p>A line runs from a value to what reads it.</p>
              <p>Select a decision to light its path and its parts.</p>
            </Panel>
            <Controls
              showInteractive={false}
              position="top-right"
              orientation="horizontal"
              className={styles.controls}
            />
            <MiniMap
              position="bottom-right"
              pannable
              zoomable
              className={styles.minimap}
              ariaLabel="Overview of the map"
            />
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
  if (load.map.scheme !== scheme || !load.map.scopes)
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
