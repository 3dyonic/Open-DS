import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@open-ds/ui/components/badge";
import styles from "./styles.module.css";

// The decision card of the Token map, apart from the map: a color card (contrast, pairs, clashes) and
// the card of every other scope (cli/src/token-card-scopes.mjs builds its sections). The face wears the
// mode the map is in and the scheme's own type roles. A render test loads this file on its own
// (harness/test/token-card-render.test.mjs), so it reads nothing from React Flow or Docusaurus.

export type Mode = "light" | "dark";
export type Answer = { id: string; question: string; answer: string; why: string | null };
type Better = { name: string; read: boolean } | null;
type Row = { id: string; label: string; better: Better };
export type Component = { component: string; rows: Row[] };
export type Decision = {
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
  meaning?: { level: "group" | "variant"; name: string; says: string }[];
  guide?: { intent: string | null; useFor: string[]; notFor: { when: string; use: string }[] };
  graph?: { reason: string | null } & Record<string, unknown>;
  // The card: the stored shorthand, the step and value it resolves to; for a color token its weakest
  // contrast, its real pairs on real surfaces and the tokens with the same or a near value; for any
  // other token its scope's card in each mode.
  shorthand?: Shorthand | null;
  resolves?: { name: string; value: string } | null;
  contrast?: Contrast | null;
  pairs?: Pair[];
  clashes?: Clash[];
  cards?: Partial<Record<Mode, ScopeCard | null>>;
};
type Shorthand = { headline: string; line: string };
type Contrast = { ratio: number; floor: number; kind: "text" | "non-text"; on: string; against: string | null };
type Pair = {
  as: "text" | "icon" | "edge" | "label";
  on: string;
  text: string;
  ink: string;
  ground: string;
  label?: string;
};
type Clash = { token: string; value: string; distance: number; same: boolean; note: string };
export type Theme = Record<
  "canvas" | "panel" | "sunken" | "text" | "muted" | "line" | "lineStrong" | "accent" | "accentSoft",
  string | null
>;

// A scope card, as the generator writes it.
type IconNode = [string, Record<string, string>];
type Draw = { kind: string } & Record<string, unknown>;
type CardRow =
  | { type: "facts"; pills: string[]; say: string | null }
  | { type: "note"; text: string }
  | { type: "missing"; text: string }
  | { type: "meter"; value: number; floor: number; max: number; text: string }
  | { type: "kinds"; kinds: { word: string; on: boolean }[] }
  | { type: "cases"; cases: { title: string; here: boolean; tag?: string; rows: CardRow[] }[] }
  | { type: "stem"; drawn: number; family: string; size: number; weight: string };
type Specimen = { tag: string; as: string; draw: Draw };
type Section = { ask: string; rows: CardRow[]; specimen?: Specimen | null };
type Hint = {
  ask: string;
  ticks: number[];
  at: number;
  mark: string | null;
  n: number;
  of: number;
  say: string | null;
};
type Note = { token: string; says: string | null; families?: (string | null)[] };
export type ScopeCard = {
  value?: string | null;
  // The utility class the code writes for this token, such as z-modal.
  code?: string | null;
  // The card names the components that use the token under "Used by".
  usedNames?: boolean;
  swatch: Draw;
  where: string[] | null;
  sections: Section[];
  hint: Hint | null;
  shared: Note[];
  pointsHere: Note[];
};

export const ratio = (r: number) => `${Math.round(r * 10) / 10}:1`;
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const sentence = (s: string) => capital(s) + (/[.!?]$/.test(s) ? "" : ".");
export const pxOf = (v: string) => {
  const m = /^([\d.]+)rem$/.exec(v);
  return m ? `${v} · ${parseFloat(m[1]) * 16}px` : v;
};
const short = (id: string) => id.replace(/^color\./, "");
const num = (v: unknown) => (typeof v === "number" ? v : Number(v));
const str = (v: unknown) => (typeof v === "string" ? v : "");

// A decision has a reason when the scheme records one: its own why, the answers behind it, or a measured fact.
export const hasReason = (d: Decision | undefined) =>
  Boolean(d && (d.graph?.reason || d.why || d.answers.length || d.stepWhy));

export const NoReason = () => (
  <Badge tone="warning" className={styles.gap}>
    No reason recorded yet
  </Badge>
);

// The canvas and its boxes wear the scheme's own surfaces for the mode the map is in.
export const canvasStyle = (t: Theme) =>
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

// A card face wears its own mode's card surface.
export const faceStyle = (t: Theme) => ({ ...canvasStyle(t), background: t.panel ?? undefined }) as React.CSSProperties;

const METER_MAX = 14;
const meterAt = (r: number, max = METER_MAX) => `${Math.min(100, (r / max) * 100)}%`;

const MarkIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className={styles.pairIcon}>
    <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="2" />
    <path d="M10 5.5v5.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="14.2" r="1.2" fill={color} />
  </svg>
);

function PairChip({ p }: { p: Pair }) {
  return (
    <div className={styles.pairChip} style={{ background: p.ground, borderColor: p.as === "edge" ? p.ink : undefined }}>
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

// The card's head: a swatch of the token, its name, and the step and value it resolves to.
function CardHead({
  d,
  swatch,
  value,
  code,
}: {
  d: Decision;
  swatch: React.ReactNode;
  value?: string | null;
  code?: string | null;
}) {
  return (
    <div className={styles.swatchRow}>
      {swatch}
      <div>
        <div className={styles.tokenName}>{d.id}</div>
        {d.resolves && (
          <div className={styles.step}>
            {d.resolves.name} · <span className={styles.mono}>{pxOf(value ?? d.resolves.value)}</span>
            {code && (
              <>
                {" "}
                · class <span className={styles.mono}>{code}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ShorthandOf({ d }: { d: Decision }) {
  return d.shorthand ? (
    <div className={styles.shorthand}>
      {d.shorthand.headline}
      <span className={styles.shortLine}>{d.shorthand.line}</span>
    </div>
  ) : (
    <Badge tone="warning" className={styles.gap}>
      No shorthand recorded yet
    </Badge>
  );
}

function Meter({
  value,
  floor,
  max,
  text,
  color,
}: {
  value: number;
  floor: number;
  max: number;
  text: string;
  color?: string;
}) {
  return (
    <div className={styles.meterRow}>
      <div
        className={styles.track}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={`${text} against a floor of ${floor}`}
      >
        <div className={styles.fill} style={{ width: meterAt(value, max), background: color }} />
        <div className={styles.floor} style={{ left: meterAt(floor, max) }} />
      </div>
      <span className={`${styles.mono} ${value < floor ? styles.missed : ""}`}>{text}</span>
    </div>
  );
}

/** The face of a color card in the map's mode: head, shorthand, the contrast meter, the pairs and the clashes. */
export function CardFace({ d, theme }: { d: Decision; theme: Theme | null }) {
  const swatch = d.resolves && /^#/.test(d.resolves.value) ? d.resolves.value : null;
  const c = d.contrast;
  const pairs = d.pairs ?? [];
  const clashes = d.clashes ?? [];
  return (
    <div className={styles.face} style={theme ? faceStyle(theme) : undefined}>
      <CardHead d={d} swatch={swatch && <span className={styles.swatchBig} style={{ background: swatch }} />} />
      <ShorthandOf d={d} />
      {c && (
        <div>
          <div className={styles.ask}>Can you see it?</div>
          <Meter value={c.ratio} floor={c.floor} max={METER_MAX} text={ratio(c.ratio)} color={swatch ?? undefined} />
          <div className={styles.note}>
            {c.against ? `${short(c.against)} on it` : `On ${short(c.on)}`}. Line: the {ratio(c.floor)} floor
            {c.kind === "text" ? " for text" : " for marks and edges"}.
          </div>
        </div>
      )}
      {pairs.length > 0 && (
        <div className={styles.pairs}>
          <div className={styles.ask}>Pairs with</div>
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

// ---------- The scope card ----------

const Glyph = ({ nodes, size, stroke }: { nodes: IconNode[]; size: number; stroke: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={styles.glyph}
  >
    {nodes.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
  </svg>
);

const Curve = ({
  points,
  w,
  h,
  guide,
}: {
  points: number[];
  w: number;
  h: number;
  guide?: { t: number; floor: number };
}) => {
  const [x1, y1, x2, y2] = points;
  const P = (x: number, y: number) => `${x * w},${(1 - y) * h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" className={styles.curve}>
      {guide && (
        <>
          <line x1={guide.t * w} y1={0} x2={guide.t * w} y2={h} className={styles.guide} />
          <line x1={0} y1={(1 - guide.floor) * h} x2={w} y2={(1 - guide.floor) * h} className={styles.guide} />
        </>
      )}
      <path
        d={`M${P(0, 0)} C${P(x1, y1)} ${P(x2, y2)} ${P(1, 1)}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
};

// The swatch in the head: a small picture of what the token sets.
function Swatch({ s }: { s: Draw }) {
  const inner = (() => {
    switch (s.kind) {
      case "type":
        return <span style={{ fontFamily: str(s.family) }}>Aa</span>;
      case "gap":
        return (
          <span className={styles.swRow}>
            <i style={{ width: 8, height: 8 }} />
            <i style={{ width: 14, height: 6 }} />
          </span>
        );
      case "section-gap":
        return (
          <span className={styles.swCol}>
            <i style={{ width: 24, height: 4 }} />
            <i style={{ width: 24, height: 4 }} />
          </span>
        );
      case "inset":
        return (
          <span className={styles.swBox}>
            <i style={{ width: 12, height: 8 }} />
          </span>
        );
      case "target":
      case "row":
        return <span className={styles.swControl} />;
      case "corner":
        return <span className={styles.swCorner} style={{ borderTopLeftRadius: Math.min(num(s.px) || 0, 28) }} />;
      case "line":
        return <span className={styles.swLine} style={{ borderTopWidth: num(s.px) }} />;
      case "ring":
        return (
          <span
            className={styles.swRing}
            style={{ outline: `${num(s.px)}px solid ${str(s.color)}`, outlineOffset: num(s.offset) }}
          />
        );
      case "layer":
        return (
          <span className={styles.swLayer}>
            <i className={styles.swGround} />
            <i className={styles.swLift} style={{ bottom: 11 + 6 * num(s.lift) }} />
          </span>
        );
      case "stack":
        return (
          <span className={styles.swStack}>
            <i />
            <i />
            <i />
          </span>
        );
      case "duration":
        return (
          <svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true">
            <circle cx="13" cy="13" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M13 13 L13 5 A8 8 0 0 1 20 9 Z" fill="currentColor" />
          </svg>
        );
      case "curve":
        return Array.isArray(s.points) ? <Curve points={s.points as number[]} w={26} h={26} /> : null;
      case "icon":
        return Array.isArray(s.nodes) ? (
          <Glyph nodes={s.nodes as IconNode[]} size={num(s.px)} stroke={num(s.stroke)} />
        ) : null;
      default:
        return null;
    }
  })();
  return (
    <span className={styles.sw} aria-hidden="true">
      {inner}
    </span>
  );
}

// Play runs only on a press. The dot uses the browser's own easing with the token's control points.
function Play({ onPlay }: { onPlay: () => void }) {
  return (
    <button
      type="button"
      className={`${styles.play} nodrag`}
      onClick={(e) => {
        e.stopPropagation();
        onPlay();
      }}
    >
      ▶ Play
    </button>
  );
}

function DurationBar({ ms }: { ms: number }) {
  const bar = useRef<HTMLElement>(null);
  return (
    <>
      <div className={styles.runway}>
        <i ref={bar} />
      </div>
      <Play
        onPlay={() =>
          bar.current?.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
            duration: ms,
            easing: "linear",
            fill: "forwards",
          })
        }
      />
    </>
  );
}

function CurvePlot({ points, ms, guide }: { points: number[]; ms: number; guide: { t: number; floor: number } }) {
  const x = useRef<HTMLSpanElement>(null);
  const y = useRef<HTMLSpanElement>(null);
  const [w, h] = [240, 120];
  return (
    <>
      <div className={styles.plot}>
        <Curve points={points} w={w} h={h} guide={guide} />
        <span className={styles.dotX} ref={x}>
          <span className={styles.dotY} ref={y}>
            <i />
          </span>
        </span>
      </div>
      <Play
        onPlay={() => {
          x.current?.animate([{ transform: "translateX(0)" }, { transform: `translateX(${w}px)` }], {
            duration: ms,
            easing: "linear",
            fill: "forwards",
          });
          y.current?.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-h}px)` }], {
            duration: ms,
            easing: `cubic-bezier(${points.join(",")})`,
            fill: "forwards",
          });
        }}
      />
    </>
  );
}

const Bars = ({ widths }: { widths: string[] }) => (
  <>
    {widths.map((w, i) => (
      <span key={i} className={styles.bar} style={{ width: w }} />
    ))}
  </>
);

const textStyle = (s: Draw): React.CSSProperties => ({
  fontFamily: str(s.family),
  fontSize: num(s.size ?? s.px),
  lineHeight: `${num(s.line)}px`,
  fontWeight: str(s.weight) || undefined,
});

// The part drawn at the token's value.
function Drawing({ s }: { s: Draw }) {
  switch (s.kind) {
    case "text":
      return (
        <div className={styles.lead} style={{ "--lh": `${num(s.line)}px` } as React.CSSProperties}>
          <span className={styles.brace} />
          <p className={styles.spec} style={{ ...textStyle(s), fontSize: num(s.px) }}>
            {str(s.text)}
          </p>
        </div>
      );
    case "groups": {
      const item = (
        <span className={styles.grp} style={{ gap: num(s.inner) }}>
          <span className={styles.ico} />
          <span className={styles.bar} style={{ width: 46 }} />
        </span>
      );
      return (
        <>
          <div className={styles.groups}>
            {item}
            <span style={{ width: num(s.outer), flex: "none" }} />
            {item}
          </div>
          <div className={styles.dims}>
            <span>{num(s.inner)}px inside each group</span>
            <span>{num(s.outer)}px between groups</span>
          </div>
        </>
      );
    }
    case "sections": {
      const sec = (
        <div className={styles.sec} style={{ gap: num(s.inner) }}>
          <Bars widths={["60%", "85%"]} />
        </div>
      );
      return (
        <>
          {sec}
          <div className={styles.gapMark} style={{ height: num(s.outer) }}>
            {Boolean(s.hairline) && <span className={styles.hair} />}
          </div>
          {sec}
          <div className={styles.dims}>
            <span>{num(s.inner)}px between groups</span>
            <span>{num(s.outer)}px between sections</span>
          </div>
        </>
      );
    }
    case "inset":
      return (
        <>
          <div className={styles.box} style={{ padding: num(s.pad) }}>
            <div className={styles.sec} style={{ gap: 6 }}>
              <Bars widths={["55%", "90%", "75%"]} />
            </div>
          </div>
          {s.next !== null && (
            <>
              <div style={{ height: num(s.next) }} />
              <div className={`${styles.box} ${styles.nextBox}`} />
            </>
          )}
          <div className={styles.dims}>
            <span>{num(s.pad)}px to its own edge</span>
            {s.next !== null && <span>{num(s.next)}px to the next box</span>}
          </div>
        </>
      );
    case "target":
      return (
        <div className={styles.ctl}>
          <span className={styles.control} style={{ height: num(s.px) }}>
            <span className={styles.bar} style={{ width: 40 }} />
          </span>
          {s.floor !== null && <span className={styles.floorBox} style={{ height: num(s.floor) }} />}
          {s.floor !== null && <span className={styles.dimText}>{num(s.floor)}px floor</span>}
        </div>
      );
    case "rows":
      return (
        <div className={styles.rows}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ height: num(s.px) }}>
              <span className={styles.bar} style={{ width: `${60 - i * 10}%` }} />
            </span>
          ))}
        </div>
      );
    case "corner":
      return (
        <div
          className={styles.box}
          style={{
            height: num(s.height),
            maxWidth: num(s.height) < 60 ? 220 : undefined,
            borderColor: str(s.edge),
            borderRadius: num(s.px),
          }}
        />
      );
    case "lines":
      return (
        <div className={styles.sec} style={{ gap: 12 }}>
          <div style={{ height: 14, borderBottom: `${num(s.px)}px solid ${str(s.divider)}` }} />
          <div
            className={styles.box}
            style={{
              height: 36,
              maxWidth: 220,
              borderWidth: num(s.px),
              borderColor: str(s.edge),
              borderRadius: num(s.corner),
            }}
          />
        </div>
      );
    case "ring":
      return (
        <div style={{ padding: 10 }}>
          <div
            className={styles.box}
            style={{
              height: 36,
              maxWidth: 200,
              borderColor: str(s.edge),
              borderRadius: num(s.corner),
              outline: `${num(s.px)}px solid ${str(s.color)}`,
              outlineOffset: num(s.offset),
            }}
          />
        </div>
      );
    case "layer":
      return (
        <div className={styles.lift}>
          <div
            className={styles.layer}
            style={{
              background: str(s.fill) || undefined,
              borderColor: str(s.border) || "transparent",
              borderWidth: num(s.width),
              borderRadius: num(s.corner),
              boxShadow: str(s.shadow),
            }}
          />
        </div>
      );
    case "stack": {
      // Each layer is drawn with its own number as its z-index, offset so the overlap shows.
      const layers = s.layers as { token: string | null; z: number; label: string; self?: boolean }[];
      return (
        <div className={styles.stack}>
          {layers.map((l, i) => (
            <div
              key={l.label}
              className={`${styles.stackLayer} ${l.self ? styles.stackSelf : ""}`}
              style={{ zIndex: l.z, top: i * 22, left: i * 26 }}
            >
              {l.label}
            </div>
          ))}
        </div>
      );
    }
    case "duration":
      return <DurationBar ms={num(s.ms)} />;
    case "curve":
      return <CurvePlot points={s.points as number[]} ms={num(s.ms)} guide={s.guide as { t: number; floor: number }} />;
    case "icon":
      return (
        <div className={styles.lineBox} style={{ height: num(s.line) }}>
          <Glyph nodes={s.nodes as IconNode[]} size={num(s.px)} stroke={num(s.stroke)} />
          <span style={textStyle(s)}>{str(s.text)}</span>
        </div>
      );
    case "stroke": {
      const zoom = num(s.zoom);
      return (
        <>
          <div className={styles.beside}>
            <Glyph nodes={s.nodes as IconNode[]} size={num(s.px)} stroke={num(s.stroke)} />
            <span style={textStyle(s)}>{str(s.text)}</span>
          </div>
          <div className={styles.zoom}>
            <Glyph nodes={s.nodes as IconNode[]} size={num(s.px) * zoom} stroke={num(s.stroke)} />
            <span className={styles.as}>
              The same icon at {zoom}× to see the line. It draws {(num(s.stroke) * num(s.px) * zoom) / num(s.grid)}px
              here.
            </span>
          </div>
        </>
      );
    }
    default:
      return null;
  }
}

// The stem of a lowercase l in the body font, measured on this page: the font is drawn at 8× on a
// canvas, and the widest dark run across the letter's middle is its stem, divided back to real pixels.
function useStem(family: string, size: number, weight: string) {
  const [stem, setStem] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    const font = `${weight} ${size * 8}px ${family}`;
    const measure = () => {
      const k = 8;
      const w = size * k * 2;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = w;
      const x = c.getContext("2d");
      if (!x) return null;
      x.fillStyle = "#fff";
      x.fillRect(0, 0, w, w);
      x.fillStyle = "#000";
      x.font = font;
      const base = Math.round(size * k * 1.5);
      x.fillText("l", size * k * 0.5, base);
      const data = x.getImageData(0, Math.round(base - size * k * 0.35), w, 1).data;
      let run = 0;
      let best = 0;
      for (let i = 0; i < w; i++) {
        if (data[i * 4] < 128) best = Math.max(best, ++run);
        else run = 0;
      }
      return best ? Math.round((best / k) * 100) / 100 : null;
    };
    (document.fonts?.load(font) ?? Promise.resolve()).catch(() => null).then(() => live && setStem(measure()));
    return () => {
      live = false;
    };
  }, [family, size, weight]);
  return stem;
}

// The icon line against the text stem. The band is a proposed rule, not the scheme's: within a quarter
// of the stem (0.75× to 1.33×) both read as one weight.
function StemRow({ row }: { row: Extract<CardRow, { type: "stem" }> }) {
  const stem = useStem(row.family, row.size, row.weight);
  if (stem === undefined) return <div className={styles.note}>Measuring the text stem…</div>;
  if (stem === null)
    return <div className={styles.missingNote}>Missing: the text stem could not be measured here.</div>;
  const r = Math.round((row.drawn / stem) * 100) / 100;
  const say =
    r >= 0.75 && r <= 1.33
      ? "Same weight: the icon reads as part of the text."
      : r < 0.75
        ? "Lighter than the text: the icon recedes."
        : "Heavier than the text: the icon shouts.";
  const face = row.family.split(",")[0].replace(/["']/g, "");
  return (
    <>
      <Facts pills={[`${row.drawn}px icon line`, `${stem}px text stem`, `${r}×`]} say={say} />
      <div className={styles.note}>
        Stem of the letter l in {face} {row.size}px, weight {row.weight}, measured on this page. Proposed rule: the icon
        line stays within a quarter of the text stem (0.75× to 1.33×), so both read as one weight.
      </div>
    </>
  );
}

const Facts = ({ pills, say }: { pills: string[]; say: string | null }) => (
  <div className={styles.facts}>
    {pills.map((p) => (
      <b key={p}>{p}</b>
    ))}
    {say && <span>{say}</span>}
  </div>
);

function Rows({ rows }: { rows: CardRow[] }) {
  return (
    <>
      {rows.map((r, i) => {
        switch (r.type) {
          case "facts":
            return (
              <React.Fragment key={i}>
                <Facts pills={r.pills} say={r.say} />
              </React.Fragment>
            );
          case "note":
            return (
              <div key={i} className={styles.note}>
                {r.text}
              </div>
            );
          case "missing":
            return (
              <div key={i} className={styles.missingNote}>
                Missing: {r.text}
              </div>
            );
          case "meter":
            return (
              <React.Fragment key={i}>
                <Meter value={r.value} floor={r.floor} max={r.max} text={r.text} />
              </React.Fragment>
            );
          case "kinds":
            return (
              <div key={i} className={styles.kinds}>
                {r.kinds.map((k) => (
                  <span key={k.word} className={k.on ? styles.kindOn : undefined}>
                    {k.word}
                  </span>
                ))}
              </div>
            );
          case "cases":
            return (
              <div key={i} className={styles.cases}>
                {r.cases.map((c) => (
                  <div key={c.title} className={`${styles.case} ${c.here ? styles.caseHere : ""}`}>
                    <div className={styles.caseTitle}>
                      {c.title}
                      {c.tag ? <em>{c.tag}</em> : c.here ? <em>Here</em> : null}
                    </div>
                    <Rows rows={c.rows} />
                  </div>
                ))}
              </div>
            );
          case "stem":
            return (
              <React.Fragment key={i}>
                <StemRow row={r} />
              </React.Fragment>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

function HintTrack({ h }: { h: Hint }) {
  return (
    <div className={styles.section}>
      <div className={styles.ask}>{h.ask}</div>
      <div className={styles.hintTrack}>
        {h.ticks.map((t, i) => (
          <i key={i} className={styles.tick} style={{ left: `${t}%` }} />
        ))}
        <span className={styles.mark} style={{ left: `${h.at}%` }}>
          {h.mark && <b>{h.mark}</b>}
        </span>
      </div>
      <Facts pills={[`${h.n} of ${h.of}`]} say={h.say} />
    </div>
  );
}

/** The face of any card but color: head, shorthand, its scope's questions with their specimens, the scale hint, and the tokens with its value. */
export function ScopeFace({ d, card, theme }: { d: Decision; card: ScopeCard; theme: Theme | null }) {
  return (
    <div className={styles.face} style={theme ? faceStyle(theme) : undefined}>
      <CardHead d={d} swatch={<Swatch s={card.swatch} />} value={card.value} code={card.code} />
      <ShorthandOf d={d} />
      {card.where && <Facts pills={card.where} say={null} />}
      {card.sections.map((s) => (
        <div key={s.ask} className={styles.section}>
          <div className={styles.ask}>{s.ask}</div>
          <Rows rows={s.rows} />
          {s.specimen && (
            <>
              <div className={styles.spectag}>{s.specimen.tag}</div>
              <div className={styles.specbox}>
                <Drawing s={s.specimen.draw} />
                <span className={styles.as}>{s.specimen.as}</span>
              </div>
            </>
          )}
        </div>
      ))}
      {card.hint && <HintTrack h={card.hint} />}
      {card.shared.map((n) => (
        <div key={n.token} className={styles.shared}>
          {n.families && n.families[0] && n.families[1] && (
            <span className={styles.pairAa}>
              <span style={{ fontFamily: n.families[0] }}>Aa</span>
              <span style={{ fontFamily: n.families[1] }}>Aa</span>
            </span>
          )}
          <p>
            <b>Shared with {n.token}:</b> {n.says ?? ""}
          </p>
        </div>
      ))}
      {card.pointsHere.map((n) => (
        <div key={n.token} className={styles.used}>
          <b className={styles.mono}>{n.token}</b> points here{n.says ? `: ${n.says}` : "."}
        </div>
      ))}
    </div>
  );
}

// The trace: one line per answer behind the token, "question → answer: why". Nothing else.
export function Trace({ ids, answers }: { ids: string[]; answers: Record<string, Answer> }) {
  const list = ids.map((id) => answers[id]).filter(Boolean);
  if (!list.length) return <div className={styles.line}>No answer is recorded for this token.</div>;
  return (
    <ol className={styles.trace}>
      {list.map((a) => (
        <li key={a.id}>
          {a.question} → <b>{a.answer}</b>
          {a.why ? `: ${/^[A-Z][a-z]/.test(a.why) ? a.why.charAt(0).toLowerCase() + a.why.slice(1) : a.why}` : ""}
        </li>
      ))}
    </ol>
  );
}

/**
 * A whole decision card in one mode: the face (color, or the token's scope card), the decision it
 * copies, "Used by N components", and the trace behind "Show the trace", closed until pressed.
 */
export function DecisionCard({
  d,
  mode,
  theme,
  answers,
}: {
  d: Decision;
  mode: Mode;
  theme: Theme | null;
  answers: Record<string, Answer>;
}) {
  const [open, setOpen] = useState(false);
  const used = d.components.length;
  const card = d.cards?.[mode] ?? null;
  return (
    <>
      {card ? <ScopeFace d={d} card={card} theme={theme} /> : <CardFace d={d} theme={theme} />}
      {d.via && <div className={styles.line}>Same as {d.via}</div>}
      <div className={styles.used}>
        {/* The count traces the component code; a token read only by a stylesheet counts none. */}
        {used > 0 ? `Used by ${used} component${used === 1 ? "" : "s"}.` : "No component code reads it."}
        {card?.usedNames && used > 0 && (
          <div className={styles.usedNames}>{d.components.map((c) => c.component).join(" · ")}</div>
        )}
      </div>
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
      {open && <Trace ids={d.answers} answers={answers} />}
    </>
  );
}
