import React, { useEffect, useMemo, useState } from "react";
import {
  applyNodeChanges,
  Background,
  Controls,
  Handle,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { Badge } from "@open-ds/ui/components/badge";
import styles from "./styles.module.css";

// The Token map page. It reads left to right: area, scale, step, semantic group, decision,
// and the decision's components and copies. Every level keeps its other options in view and opens the
// pressed one in place; after a press the view zooms to the pressed box and what it opened. The data
// is cli/src/token-map-view.mjs, built per scheme and brand by scripts/generate.mjs.

export type Props = {
  scheme: string;
  /** The map file of each brand, as a path under static/. */
  files: Record<string, string>;
};
type Mode = "light" | "dark";
type Answer = { id: string; question: string; answer: string; why: string | null };
type Better = { name: string; read: boolean } | null;
type Row = { id: string; label: string; better: Better };
type Component = { component: string; rows: Row[] };
type Decision = {
  id: string;
  group: string;
  why: string | null;
  description: string | null;
  answers: string[];
  direct: string[];
  components: Component[];
  via?: string | null;
  stepWhy?: string | null;
  mapping?: { property: string | null; says?: string | null; jobs: { title: string; how: string }[] };
  // What each part of the name means, outermost first: the groups, then the last part.
  meaning?: { level: "group" | "variant"; name: string; says: string }[];
  guide?: { intent: string | null; useFor: string[]; notFor: { when: string; use: string }[] };
  // A color token's decision graph: role → jobs → property → answers → rule → connections →
  // value, and the reason sentence the engine writes from those fields.
  graph?: Graph;
  // The card: the stored shorthand, the step and value it resolves to, and for a color token
  // its weakest contrast, its real pairs on real surfaces and the tokens with the same or a near value.
  shorthand?: Shorthand | null;
  resolves?: { name: string; value: string } | null;
  contrast?: Contrast | null;
  pairs?: Pair[];
  clashes?: Clash[];
};
type Shorthand = { headline: string; line: string };
type Contrast = { ratio: number; floor: number; kind: "text" | "non-text"; on: string; against: string | null };
type Pair = { as: "text" | "icon" | "edge" | "label"; on: string; text: string; ink: string; ground: string; label?: string };
type Clash = { token: string; value: string; distance: number; same: boolean; note: string };
type Connection = { kind: string; says: string };
type Graph = {
  role: string;
  to: string;
  gets: string;
  jobs: string[];
  made: { always: string | null; creates: string[]; shapes: string[] };
  rules: { name: string; says: string; holds: boolean | null }[];
  connections: { id: string; via?: string; holds: boolean; checks: number; pairs: string[]; off: string[]; waits: string[] }[];
  value: { name: string; hex: string | null } | null;
  reason: string | null;
};
type Check = { what: string; ratio: number };
type Step = {
  id: string;
  step: string;
  name: string;
  value: string;
  otherMode?: string | null;
  brand?: boolean;
  decisions: string[];
  checks: Check[];
};
type Family = { id: string; area: string; label: string; scope: string; steps: Step[] };
type Theme = Record<
  "canvas" | "panel" | "sunken" | "text" | "muted" | "line" | "lineStrong" | "accent" | "accentSoft",
  string | null
>;
type ModeData = { theme: Theme; families: Family[]; decisions: Record<string, Decision> };
type MapFile = {
  scheme: string;
  name: string;
  brand: string;
  areas: string[];
  answers: Record<string, Answer>;
  connections: Record<string, Connection>;
  shared: { families: Family[]; decisions: Record<string, Decision> };
  modes: Record<Mode, ModeData>;
};
type Model = { families: Family[]; decisions: Record<string, Decision>; theme: Theme };
type Path = {
  area: string | null;
  hue: string | null;
  step: string | null;
  group: string | null;
  decision: string | null;
};
type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; map: MapFile };

const NONE: Path = { area: null, hue: null, step: null, group: null, decision: null };
// Columns, left to right.
const X = { area: 0, family: 210, word: 420, group: 850, decision: 1050 };
const W = { area: 160, family: 160, step: 170, word: 370, group: 160, decision: 370, decisionWide: 730, list: 300 };

const ratio = (r: number) => `${Math.round(r * 10) / 10}:1`;
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const sentence = (s: string) => capital(s) + (/[.!?]$/.test(s) ? "" : ".");
const pxOf = (v: string) => {
  const m = /^([\d.]+)rem$/.exec(v);
  return m ? `${v} · ${parseFloat(m[1]) * 16}px` : v;
};

// A decision has a reason when the scheme records one: its own why, the answers behind it, or a measured fact.
const hasReason = (d: Decision | undefined) => Boolean(d && (d.graph?.reason || d.why || d.answers.length || d.stepWhy));
// A value has a reason when some decision that reads it has one.
const valueHasReason = (model: Model, step: Step) => step.decisions.some((d) => hasReason(model.decisions[d]));

const NoReason = () => (
  <Badge tone="warning" className={styles.gap}>
    No reason recorded yet
  </Badge>
);

const Hidden = ({ type, pos, id }: { type: "source" | "target"; pos: Position; id?: string }) => (
  <Handle type={type} position={pos} id={id} isConnectable={false} className={styles.handle} />
);

function Answers({ ids, answers }: { ids: string[]; answers: Record<string, Answer> }) {
  const list = ids.map((id) => answers[id]).filter(Boolean);
  if (!list.length) return null;
  return (
    <>
      {list.map((a) => (
        <div key={a.id} className={styles.qa}>
          <div>
            <span className={styles.line}>{a.question}</span> <b>{a.answer}</b>
          </div>
          {a.why && <div className={styles.line}>{a.why}</div>}
        </div>
      ))}
    </>
  );
}

// Open and close, inside a box that React Flow would otherwise take as a press on the box.
function More({ open, onToggle, closed }: { open: boolean; onToggle: () => void; closed: string }) {
  return (
    <button
      type="button"
      className={`${styles.more} nodrag`}
      aria-expanded={open}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {open ? "▾ Less" : `▸ ${closed}`}
    </button>
  );
}

type AreaData = { area: string; count: number; selected: boolean };
function AreaNode({ data }: NodeProps<Node<AreaData>>) {
  return (
    <div className={`${styles.node} ${data.selected ? styles.selected : ""}`}>
      <Hidden type="source" pos={Position.Right} />
      <div className={styles.title}>
        {data.selected ? "▾" : "▸"} {data.area}
      </div>
      <div className={styles.line}>
        {data.count} value{data.count === 1 ? "" : "s"} in use
      </div>
    </div>
  );
}

type FamilyData = {
  label: string;
  count: number;
  selected: boolean;
  swatch: string | null;
  gaps: number;
  why: string[];
  answers: Record<string, Answer>;
};
function FamilyNode({ data }: NodeProps<Node<FamilyData>>) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.node} ${data.selected ? styles.selected : ""}`}>
      <Hidden type="target" pos={Position.Left} />
      <Hidden type="source" pos={Position.Right} />
      <div className={styles.swatchRow}>
        {data.swatch && <span className={styles.chip} style={{ background: data.swatch }} />}
        <span className={styles.title}>
          {data.selected ? "▾" : "▸"} {data.label}
        </span>
      </div>
      <div className={styles.line}>
        {data.count} step{data.count === 1 ? "" : "s"}
      </div>
      {data.gaps > 0 && (
        <div className={styles.gapCount}>
          {data.gaps} value{data.gaps === 1 ? "" : "s"} with no reason
        </div>
      )}
      {data.why.length > 0 && <More open={open} onToggle={() => setOpen(!open)} closed="More" />}
      {open && <Answers ids={data.why} answers={data.answers} />}
    </div>
  );
}

type StepData = { id: string; name: string; value: string; color: boolean };
function StepNode({ data }: NodeProps<Node<StepData>>) {
  return (
    <div className={styles.node}>
      <Hidden type="target" pos={Position.Left} />
      <div className={styles.swatchRow}>
        {data.color && <span className={styles.chip} style={{ background: data.value }} />}
        <span className={styles.title}>{data.name}</span>
      </div>
      <div className={styles.mono}>{pxOf(data.value)}</div>
    </div>
  );
}

// The value: what it is and the checks it passes on top; why it is here behind "more".
type WordData = {
  step: Step;
  family: Family;
  keyLine: string | null;
  why: { text: string; answers: string[] }[];
  readers: Decision[];
  answers: Record<string, Answer>;
};
function WordNode({ data }: NodeProps<Node<WordData>>) {
  const [open, setOpen] = useState(false);
  const s = data.step;
  return (
    <div className={`${styles.node} ${styles.word}`}>
      <Hidden type="target" pos={Position.Left} />
      <Hidden type="source" pos={Position.Right} />
      <div className={styles.swatchRow}>
        {data.family.area === "Color" && <span className={styles.swatchBig} style={{ background: s.value }} />}
        <span className={styles.title}>{s.name}</span>
        <span className={styles.mono}>{pxOf(s.value)}</span>
      </div>
      {data.keyLine && <div className={styles.key}>{data.keyLine}</div>}
      {s.checks.length > 0 && (
        <div>
          {s.checks.map((c, i) => (
            <span key={c.what}>
              {i ? " · " : ""}✓ {c.what} <span className={styles.line}>{ratio(c.ratio)}</span>
            </span>
          ))}
        </div>
      )}
      {(data.why.length > 0 || data.readers.length > 0) && (
        <More open={open} onToggle={() => setOpen(!open)} closed="Why it's here" />
      )}
      {open &&
        data.why.map((w, i) => (
          <div key={i}>
            {w.text && <div>{w.text}</div>}
            <Answers ids={w.answers} answers={data.answers} />
          </div>
        ))}
      {open && data.readers.length > 0 && (
        <>
          <div className={styles.cap}>Read by</div>
          {data.readers.map((d) => (
            <div key={d.id} className={styles.qa}>
              <span className={styles.mono}>{d.id}</span>
              {d.description && <span className={styles.line}>{d.description}</span>}
              {d.why ? <span>{sentence(d.why)}</span> : <Answers ids={d.answers} answers={data.answers} />}
              {!hasReason(d) && <NoReason />}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

type GroupData = { group: string; count: number; valueName: string; selected: boolean };
function GroupNode({ data }: NodeProps<Node<GroupData>>) {
  return (
    <div className={`${styles.node} ${data.selected ? styles.selected : ""}`}>
      <Hidden type="target" pos={Position.Left} />
      <Hidden type="source" pos={Position.Right} />
      <div className={styles.cap}>Semantic group</div>
      <div className={styles.title}>
        {data.selected ? "▾" : "▸"} {data.group}
      </div>
      <div className={styles.line}>
        {data.count} token{data.count === 1 ? " uses" : "s use"} {data.valueName}
      </div>
    </div>
  );
}

// A decision: the card shows what the token is and does from data only. For a color token, light
// and dark sit side by side, each in its own mode's surfaces. The trace (the answers behind it) opens below.
type DecisionData = {
  d: Decision;
  selected: boolean;
  answers: Record<string, Answer>;
  connections: Record<string, Connection>;
  // A color token's card in each mode, with that mode's surfaces; null for a token that is the same in both.
  modes: { mode: Mode; d: Decision; theme: Theme }[] | null;
};
const short = (id: string) => id.replace(/^color\./, "");
const METER_MAX = 14;
const meterAt = (r: number) => `${Math.min(100, (r / METER_MAX) * 100)}%`;

const MarkIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className={styles.pairIcon}>
    <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="2" />
    <path d="M10 5.5v5.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="14.2" r="1.2" fill={color} />
  </svg>
);

function PairChip({ p }: { p: Pair }) {
  return (
    <div
      className={styles.pairChip}
      style={{ background: p.ground, borderColor: p.as === "edge" ? p.ink : undefined }}
    >
      {p.as === "icon" ? (
        <div className={styles.swatchRow}>
          <MarkIcon color={p.ink} />
          <span className={styles.pairText} style={{ color: p.label }}>
            {p.text}
          </span>
        </div>
      ) : (
        <span className={styles.pairText} style={{ color: p.as === "edge" ? p.label : p.ink }}>
          {p.text}
        </span>
      )}
      <span className={styles.pairOn} style={{ color: p.as === "icon" || p.as === "edge" ? p.label : p.ink }}>
        as {p.as} · on {short(p.on)}
      </span>
    </div>
  );
}

// One mode's face of a card: header, shorthand, the contrast meter, the pairs and the clashes.
function CardFace({ d, mode, theme }: { d: Decision; mode: Mode | null; theme: Theme | null }) {
  const swatch = d.resolves && /^#/.test(d.resolves.value) ? d.resolves.value : null;
  const c = d.contrast;
  const pairs = d.pairs ?? [];
  const clashes = d.clashes ?? [];
  return (
    <div className={styles.face} style={theme ? faceStyle(theme) : undefined}>
      {mode && <div className={styles.cap}>{mode === "light" ? "Light" : "Dark"}</div>}
      <div className={styles.swatchRow}>
        {swatch && <span className={styles.swatchBig} style={{ background: swatch }} />}
        <div>
          <div className={`${styles.title} ${styles.mono}`}>{d.id}</div>
          {d.resolves && (
            <div className={styles.line}>
              {d.resolves.name} · <span className={styles.mono}>{pxOf(d.resolves.value)}</span>
            </div>
          )}
        </div>
      </div>
      {d.shorthand ? (
        <div className={styles.shorthand}>
          {d.shorthand.headline}
          <span className={styles.shortLine}>{d.shorthand.line}</span>
        </div>
      ) : (
        <Badge tone="warning" className={styles.gap}>
          No shorthand recorded yet
        </Badge>
      )}
      {c && (
        <div>
          <div className={styles.cap}>Weakest contrast</div>
          <div className={styles.meterRow}>
            <div
              className={styles.track}
              role="meter"
              aria-valuemin={0}
              aria-valuemax={METER_MAX}
              aria-valuenow={c.ratio}
              aria-label={`${ratio(c.ratio)} against a ${ratio(c.floor)} floor`}
            >
              <div className={styles.fill} style={{ width: meterAt(c.ratio), background: swatch ?? undefined }} />
              <div className={styles.floor} style={{ left: meterAt(c.floor) }} />
            </div>
            <span className={`${styles.mono} ${c.ratio < c.floor ? styles.missed : ""}`}>{ratio(c.ratio)}</span>
          </div>
          <div className={styles.line}>
            {c.against ? `${short(c.against)} on it` : `On ${short(c.on)}`}. Line: the {ratio(c.floor)} floor
            {c.kind === "text" ? " for text" : " for marks and edges"}.
          </div>
        </div>
      )}
      {pairs.length > 0 && (
        <div className={styles.pairs}>
          <div className={styles.cap}>Pairs with</div>
          {pairs.map((p) => (
            <React.Fragment key={`${p.as}:${p.on}`}>
              <PairChip p={p} />
            </React.Fragment>
          ))}
        </div>
      )}
      {clashes.length > 0 && (
        <div className={styles.clash}>
          <div className={styles.dots}>
            {[swatch, ...clashes.map((x) => x.value)].filter(Boolean).map((v, i) => (
              <i key={i} style={{ background: v as string }} />
            ))}
          </div>
          <div>
            {clashes.map((x) => (
              <div key={x.token}>
                <b>Clash:</b> {x.note}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DecisionNode({ data }: NodeProps<Node<DecisionData>>) {
  const [open, setOpen] = useState(false);
  const d = data.d;
  const used = d.components.length;
  return (
    <div className={`${styles.node} ${styles.word} ${data.selected ? styles.selected : ""}`}>
      <Hidden type="target" pos={Position.Left} />
      <Hidden type="source" pos={Position.Right} />
      <div className={styles.cap}>Decision</div>
      {data.modes ? (
        <div className={styles.faces}>
          {data.modes.map((m) => (
            <React.Fragment key={m.mode}>
              <CardFace d={m.d} mode={m.mode} theme={m.theme} />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <CardFace d={d} mode={null} theme={null} />
      )}
      {d.via && <div className={styles.line}>Same as {d.via}</div>}
      {used === 0 && !d.via && !(d.guide && d.guide.useFor.length) && <div className={styles.line}>No component uses it.</div>}
      {!hasReason(d) && <NoReason />}
      <button
        type="button"
        className={`${styles.more} nodrag`}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {open ? "▾ Hide the trace" : "▸ Show the trace"}
      </button>
      {open && (
        <>
          {d.meaning && d.meaning.length > 0 && (
            <>
              <div className={styles.cap}>What the name means</div>
              {d.meaning.map((m) => (
                <div key={m.name} className={styles.qa}>
                  <b className={styles.mono}>{m.level === "variant" ? `.${m.name}` : m.name}</b> <span className={styles.line}>{m.says}</span>
                </div>
              ))}
            </>
          )}
          {d.graph?.reason ? (
            <div className={styles.key}>{d.graph.reason}</div>
          ) : d.why ? (
            <div className={styles.key}>{sentence(d.why)}</div>
          ) : (
            d.description && <div>{d.description}</div>
          )}
          {d.graph?.reason && d.why && <div className={styles.line}>Measured: {sentence(d.why)}</div>}
          {d.guide?.intent && <div>{d.guide.intent}</div>}
          {d.guide && d.guide.useFor.length > 0 && <div className={styles.line}>Use for: {d.guide.useFor.join(", ")}</div>}
          {d.guide?.notFor.map((n) => (
            <div key={n.when} className={styles.line}>
              Not for {n.when.toLowerCase()}: use {n.use}
            </div>
          ))}
          {d.graph ? (
            <ColorGraph graph={d.graph} mapping={d.mapping} connections={data.connections} answers={data.answers} />
          ) : (
            <>
              {d.stepWhy && <div>{d.stepWhy}</div>}
              {d.answers.length > 0 && <div className={styles.cap}>{d.mapping ? "Decided by" : "The answers behind it"}</div>}
              <Answers ids={d.answers} answers={data.answers} />
            </>
          )}
          {d.mapping && !d.graph && (
            <>
              {d.mapping.property && <div className={styles.cap}>Property: {d.mapping.property}</div>}
              {d.mapping.says && <div className={styles.line}>{d.mapping.says}</div>}
              {d.mapping.jobs.map((j) => (
                <div key={j.title} className={styles.qa}>
                  <b>{j.title}</b> <span className={styles.line}>{j.how}</span>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

// The color decision graph of a token, in the order it inherits its reason: role, jobs, property, the
// answers that create or shape it, rule, connections and value.
function ColorGraph({
  graph,
  mapping,
  connections,
  answers,
}: {
  graph: Graph;
  mapping: Decision["mapping"];
  connections: Record<string, Connection>;
  answers: Record<string, Answer>;
}) {
  return (
    <>
      <div className={styles.cap}>Role</div>
      <div>
        {capital(graph.role)}: in order to {graph.to}. So {graph.gets}.
      </div>
      <div className={styles.cap}>Jobs</div>
      {graph.jobs.map((title) => (
        <div key={title} className={styles.qa}>
          <b>{title}</b> <span className={styles.line}>{mapping?.jobs.find((j) => j.title === title)?.how}</span>
        </div>
      ))}
      {mapping?.property && <div className={styles.cap}>Property: {mapping.property}</div>}
      {graph.made.always && <div className={styles.line}>Always on: {sentence(graph.made.always)}</div>}
      {graph.made.creates.length > 0 && <div className={styles.cap}>Created by</div>}
      <Answers ids={graph.made.creates} answers={answers} />
      {graph.made.shapes.length > 0 && <div className={styles.cap}>Shaped by</div>}
      <Answers ids={graph.made.shapes} answers={answers} />
      {graph.rules.map((r) => (
        <div key={r.name} className={styles.qa}>
          <b>Rule</b> <span className={styles.line}>{r.says}</span>
          {r.holds === false && <span> (this pick differs)</span>}
        </div>
      ))}
      {graph.connections.length > 0 && <div className={styles.cap}>Connections</div>}
      {graph.connections.map((c) => (
        <div key={c.id} className={styles.qa}>
          <b>{connections[c.id]?.kind ?? c.id}</b> <span className={styles.line}>{connections[c.id]?.says}</span>{" "}
          {c.via && <span className={styles.line}>Through {c.via}. </span>}
          {c.holds ? (
            <span>Holds ({c.checks} checks).</span>
          ) : (
            <span>
              {c.checks - c.waits.length - c.off.length} of {c.checks} checks hold.
            </span>
          )}
          {c.pairs.map((p) => (
            <div key={p} className={styles.line}>
              {p}
            </div>
          ))}
          {c.waits.map((w) => (
            <div key={w}>waits: {w}</div>
          ))}
          {c.off.length > 0 && <div>Does not hold: {c.off.join("; ")}.</div>}
        </div>
      ))}
      {graph.value && (
        <div className={styles.qa}>
          <b>Value</b> <span className={styles.mono}>{graph.value.name}</span> {graph.value.hex && <span className={styles.line}>{graph.value.hex}</span>}
        </div>
      )}
    </>
  );
}

// One box per decision listing its components; a row opens to its token names, one row at a time.
type ListData = {
  title: string;
  owner: string;
  items: Component[];
  open: string | null;
  onToggle: ((key: string) => void) | null;
};
function ListNode({ data }: NodeProps<Node<ListData>>) {
  return (
    <div className={`${styles.node} ${styles.component}`}>
      <Hidden type="target" pos={Position.Left} />
      <div className={styles.componentHead}>
        {data.title} <span className={styles.line}>{data.items.length}</span>
      </div>
      {data.items.map((c) => {
        const key = `${data.owner}|${c.component}`;
        const open = data.open === key;
        return (
          <div
            key={key}
            className={`${styles.row} ${data.onToggle ? styles.pick : ""} ${open ? styles.rowOn : ""}`}
            onClick={
              data.onToggle
                ? (e) => {
                    e.stopPropagation();
                    data.onToggle!(key);
                  }
                : undefined
            }
          >
            {data.onToggle ? (open ? "▾ " : "▸ ") : ""}
            {c.component}
            {c.rows.length > 0 && <span className={styles.line}> {c.rows.length}</span>}
            {open &&
              c.rows.map((r) => (
                <div key={r.id} className={styles.tokenRow}>
                  {r.better && (
                    <div>
                      {r.better.name}
                      {!r.better.read && <span className={styles.line}> · no component code reads it</span>}
                    </div>
                  )}
                  <div className={styles.mono}>{r.id}</div>
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}

const nodeTypes = {
  area: AreaNode,
  family: FamilyNode,
  step: StepNode,
  word: WordNode,
  semantic: GroupNode,
  decision: DecisionNode,
  list: ListNode,
};

// The scope's general answers, shown once on the family. Color answers per step instead.
const familyWhyOf = (map: MapFile, family: Family) =>
  family.area === "Color"
    ? []
    : [`${family.scope}.definition`, `${family.scope}.values`].filter((id) => map.answers[id]);

// Why a value is here, from the scheme's own answers: the brand hue's palette answer; a color step that
// is the lightest to pass its label floor (measured); for other areas, the decisions that read the step.
function whyOf(map: MapFile, model: Model, family: Family, step: Step) {
  if (family.area !== "Color") {
    const readers = step.decisions.map((d) => model.decisions[d]).filter(Boolean);
    return { keyLine: null, why: [], readers };
  }
  const why: { text: string; answers: string[] }[] = [];
  const palette = map.answers["color.definition"];
  if (step.brand && palette?.why) why.push({ text: "", answers: ["color.definition"] });
  const lightest = step.decisions.map((d) => model.decisions[d]?.stepWhy).find(Boolean);
  if (lightest)
    why.push({ text: lightest, answers: map.answers["accessibility.definition"] ? ["accessibility.definition"] : [] });
  return { keyLine: step.brand && palette?.why ? palette.why : null, why, readers: [] as Decision[] };
}

function build(map: MapFile, model: Model, path: Path, openComp: string | null, toggleComp: (k: string) => void) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const at = (x: number, y: number) => ({ x, y });
  map.areas.forEach((a, i) =>
    nodes.push({
      id: `area:${a}`,
      type: "area",
      position: at(X.area, i * 100),
      style: { width: W.area },
      data: {
        area: a,
        selected: a === path.area,
        count: model.families.filter((f) => f.area === a).reduce((s, f) => s + f.steps.length, 0),
      },
    }),
  );
  if (!path.area) return { nodes, edges };
  const fams = model.families.filter((f) => f.area === path.area);
  fams.forEach((f, i) => {
    const mid = f.steps.find((s) => s.step === "600") ?? f.steps[Math.floor(f.steps.length / 2)];
    nodes.push({
      id: `fam:${f.id}`,
      type: "family",
      position: at(X.family, i * 100),
      style: { width: W.family },
      data: {
        label: f.label,
        count: f.steps.length,
        selected: f.id === path.hue,
        swatch: f.area === "Color" ? (mid?.value ?? null) : null,
        gaps: f.steps.filter((s) => !valueHasReason(model, s)).length,
        why: familyWhyOf(map, f),
        answers: map.answers,
      },
    });
    edges.push({ id: `e:area:${f.id}`, source: `area:${path.area}`, target: `fam:${f.id}`, className: styles.edge });
  });
  const hue = fams.find((f) => f.id === path.hue);
  if (!hue) return { nodes, edges };
  const step = hue.steps.find((s) => s.id === path.step);
  hue.steps.forEach((s, i) => {
    if (s === step) {
      const w = whyOf(map, model, hue, s);
      nodes.push({
        id: "word",
        type: "word",
        position: at(X.word, i * 80),
        style: { width: W.word },
        data: { step: s, family: hue, ...w, answers: map.answers },
      });
      edges.push({ id: "e:fam:word", source: `fam:${hue.id}`, target: "word", className: styles.edgeLit });
    } else {
      nodes.push({
        id: `step:${s.id}`,
        type: "step",
        position: at(X.word, i * 80),
        style: { width: W.step },
        data: { id: s.id, name: s.name, value: s.value, color: hue.area === "Color" },
      });
      edges.push({ id: `e:fam:${s.id}`, source: `fam:${hue.id}`, target: `step:${s.id}`, className: styles.edge });
    }
  });
  if (!step) return { nodes, edges };
  const groups = [...new Set(step.decisions.map((d) => model.decisions[d]?.group).filter(Boolean))] as string[];
  let gy = 0;
  let dy = 0;
  let cy = 0;
  for (const g of groups) {
    if (path.group && path.group !== g) continue;
    const ds = step.decisions.filter((d) => model.decisions[d]?.group === g);
    nodes.push({
      id: `g:${g}`,
      type: "semantic",
      position: at(X.group, gy),
      style: { width: W.group },
      data: { group: g, count: ds.length, valueName: step.name, selected: path.group === g },
    });
    edges.push({
      id: `e:w:${g}`,
      source: "word",
      target: `g:${g}`,
      className: path.group === g ? styles.edgeLit : styles.edge,
    });
    gy += 110;
    if (path.group !== g) continue;
    for (const id of ds) {
      if (path.decision && path.decision !== id) continue;
      const d = model.decisions[id];
      const top = Math.max(dy, cy);
      // A color card shows light and dark side by side, each from its own mode's map.
      const modes = map.modes.light.decisions[id]
        ? (["light", "dark"] as const)
            .filter((m) => map.modes[m].decisions[id])
            .map((m) => ({ mode: m, d: map.modes[m].decisions[id], theme: map.modes[m].theme }))
        : null;
      const width = modes && modes.length > 1 ? W.decisionWide : W.decision;
      const listX = X.decision + width + 60;
      nodes.push({
        id: `d:${id}`,
        type: "decision",
        position: at(X.decision, top),
        style: { width },
        data: { d, selected: path.decision === id, answers: map.answers, connections: map.connections ?? {}, modes },
      });
      edges.push({ id: `e:${g}:${id}`, source: `g:${g}`, target: `d:${id}`, className: styles.edgeLit });
      dy = top + 160;
      cy = top;
      if (d.components.length) {
        nodes.push({
          id: `cl:${id}`,
          type: "list",
          position: at(listX, cy),
          style: { width: W.list },
          data: { title: "Components", owner: id, items: d.components, open: openComp, onToggle: toggleComp },
        });
        edges.push({ id: `e:cl:${id}`, source: `d:${id}`, target: `cl:${id}`, className: styles.edgeLit });
        cy += 60 + d.components.length * 32;
      }
      const copies = Object.values(model.decisions).filter((x) => x.via === id);
      if (copies.length) {
        nodes.push({
          id: `al:${id}`,
          type: "list",
          position: at(listX, cy),
          style: { width: W.list },
          data: {
            title: "Aliases",
            owner: id,
            items: copies.map((c) => ({ component: c.id, rows: [] })),
            open: null,
            onToggle: null,
          },
        });
        edges.push({ id: `e:al:${id}`, source: `d:${id}`, target: `al:${id}`, className: styles.edgeLit });
        cy += 60 + copies.length * 32;
      }
      cy += 30;
    }
  }
  return { nodes, edges };
}

// The boxes to zoom to after a press: the node pressed and what it opened.
function focusOf(map: MapFile, model: Model, path: Path, openComp: string | null): string[] {
  if (openComp) return [`cl:${openComp.split("|")[0]}`];
  if (!path.area) return map.areas.map((a) => `area:${a}`);
  const fams = model.families.filter((f) => f.area === path.area);
  const hue = fams.find((f) => f.id === path.hue);
  if (!hue) return [`area:${path.area}`, ...fams.map((f) => `fam:${f.id}`)];
  const step = hue.steps.find((s) => s.id === path.step);
  if (!step) return [`fam:${hue.id}`, ...hue.steps.map((s) => `step:${s.id}`)];
  const groups = [...new Set(step.decisions.map((d) => model.decisions[d]?.group).filter(Boolean))];
  if (!path.group) return ["word", ...groups.map((g) => `g:${g}`)];
  const ds = step.decisions.filter(
    (d) => model.decisions[d]?.group === path.group && (!path.decision || d === path.decision),
  );
  const lists = ds.flatMap((d) => [
    model.decisions[d].components.length ? `cl:${d}` : null,
    Object.values(model.decisions).some((x) => x.via === d) ? `al:${d}` : null,
  ]);
  return [path.decision ? null : `g:${path.group}`, ...ds.map((d) => `d:${d}`), ...lists].filter(Boolean) as string[];
}

// The canvas and its boxes wear the scheme's own surfaces for the values' mode.
const canvasStyle = (t: Theme) =>
  ({
    background: t.canvas ?? undefined,
    color: t.text ?? undefined,
    "--color-surface-default": t.panel,
    "--color-surface-sunken": t.sunken,
    "--color-surface-canvas": t.canvas,
    "--color-text-primary": t.text,
    "--color-text-secondary": t.muted,
    "--color-border-default": t.line,
    "--color-border-strong": t.lineStrong,
    "--color-border-selected": t.accent,
    "--color-surface-selected": t.accentSoft,
  }) as React.CSSProperties;

// A card face wears its own mode's card surface, so light and dark read side by side.
const faceStyle = (t: Theme) => ({ ...canvasStyle(t), background: t.panel ?? undefined }) as React.CSSProperties;

function MapView({ map, mode, onMode }: { map: MapFile; mode: Mode; onMode: (m: Mode) => void }) {
  const model: Model = useMemo(() => {
    const m = map.modes[mode];
    return {
      families: [...m.families, ...map.shared.families],
      decisions: { ...m.decisions, ...map.shared.decisions },
      theme: m.theme,
    };
  }, [map, mode]);
  const [path, setPath] = useState<Path>(NONE);
  const [openComp, setOpenComp] = useState<string | null>(null);
  const flow = useReactFlow();
  const [nodes, setNodes] = useNodesState<Node>([]);
  const isColor = path.area === "Color";

  const set = (next: Path) => {
    setPath(next);
    setOpenComp(null);
  };
  // The same step in the other mode, so switching the values keeps your place.
  useEffect(() => {
    if (!path.step) return;
    const [, hue, , step] = path.step.split(".");
    const same = map.modes[mode].families.find((f) => f.id === hue)?.steps.find((s) => s.step === step);
    if (path.step.startsWith("color.") && same && same.id !== path.step) setPath({ ...path, step: same.id });
  }, [mode]);

  const graph = useMemo(
    () => build(map, model, path, openComp, (k) => setOpenComp((o) => (o === k ? null : k))),
    [map, model, path, openComp],
  );
  useEffect(() => setNodes(graph.nodes), [graph]);

  // Stack each column by the boxes' measured heights, so a box that grows pushes the ones below it.
  const onNodesChange = (changes: NodeChange[]) =>
    setNodes((ns) => {
      const next = applyNodeChanges(changes, ns);
      if (!changes.some((c) => c.type === "dimensions")) return next;
      const cols: Record<number, Node[]> = {};
      for (const n of next) (cols[n.position.x] ??= []).push(n);
      const y: Record<string, number> = {};
      for (const col of Object.values(cols)) {
        col.sort((a, b) => a.position.y - b.position.y);
        let bottom = -Infinity;
        for (const n of col) {
          const top = Math.max(n.position.y, bottom + 16);
          y[n.id] = top;
          bottom = top + (n.measured?.height ?? 80);
        }
      }
      return next.map((n) => (y[n.id] !== n.position.y ? { ...n, position: { ...n.position, y: y[n.id] } } : n));
    });

  // After each press, zoom to the pressed box and what it opened, once those boxes are measured and
  // have stopped moving (the column stacking moves them once).
  const focus = useMemo(() => focusOf(map, model, path, openComp), [map, model, path, openComp]);
  const focusKey = focus.join(",");
  useEffect(() => {
    let frame = 0;
    let last = "";
    let stable = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const want = new Set(focus);
      const got = flow.getNodes().filter((n) => want.has(n.id));
      const ready = got.length === want.size && got.every((n) => n.measured?.width && n.measured?.height);
      const sig = got.map((n) => `${n.id}:${n.position.x},${n.position.y},${n.measured?.height}`).join("|");
      stable = ready && sig === last ? stable + 1 : 0;
      last = sig;
      if (stable >= 2 || frame++ > 60) {
        if (got.length)
          flow.fitView({ nodes: got.map((n) => ({ id: n.id })), padding: 0.2, maxZoom: 1.2, duration: 350 });
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [focusKey, mode]);

  // A press picks a box and shows what connects to it; pressing the picked box again steps back.
  const onNodeClick = (_: React.MouseEvent, n: Node) => {
    const data = n.data as Record<string, unknown>;
    if (n.type === "area") {
      if (path.area === data.area) return set(NONE);
      const fams = model.families.filter((f) => f.area === data.area);
      return set({ ...NONE, area: data.area as string, hue: fams.length === 1 ? fams[0].id : null });
    }
    if (n.type === "family") {
      const id = n.id.slice(4);
      return set({ ...NONE, area: path.area, hue: path.hue === id ? null : id });
    }
    if (n.type === "step") return set({ ...path, step: data.id as string, group: null, decision: null });
    if (n.type === "word") return set({ ...path, step: null, group: null, decision: null });
    if (n.type === "semantic")
      return set({ ...path, group: path.group === data.group ? null : (data.group as string), decision: null });
    if (n.type === "decision") {
      const id = n.id.slice(2);
      return set({ ...path, group: model.decisions[id].group, decision: path.decision === id ? null : id });
    }
  };

  return (
    <div className={styles.canvas} style={canvasStyle(isColor ? model.theme : map.modes.light.theme)}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        nodesConnectable={false}
        elementsSelectable
        nodesDraggable
        nodeDragThreshold={10}
        nodeClickDistance={10}
        paneClickDistance={10}
        panOnScroll
        minZoom={0.2}
        proOptions={{ hideAttribution: true }}
        aria-label={`Token map of ${map.name}`}
      >
        <Background gap={24} size={1} />
        <Controls showInteractive={false} position="bottom-left" className={styles.controls} />
        {isColor && (
          <Panel position="top-right">
            <div className={styles.toggleButtons} role="group" aria-label="Values in">
              {(["light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`${styles.toggleButton} ${mode === m ? styles.toggleOn : ""}`}
                  aria-pressed={mode === m}
                  onClick={() => onMode(m)}
                >
                  {m === "light" ? "Light" : "Dark"}
                </button>
              ))}
            </div>
          </Panel>
        )}
      </ReactFlow>
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
  if (load.map.scheme !== scheme || !load.map.modes)
    return (
      <div className={styles.error} role="alert">
        <p>The map file is not this page's map. Run pnpm --dir docs generate and build the docs again.</p>
      </div>
    );
  return (
    <ReactFlowProvider>
      <React.Fragment key={load.map.brand}>
        <MapView map={load.map} mode={mode} onMode={setMode} />
      </React.Fragment>
    </ReactFlowProvider>
  );
}
