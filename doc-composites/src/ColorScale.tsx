/**
 * ColorScale: one hue's whole scale in each theme, with lanes for what its tokens paint (backgrounds,
 * edges and rings, text), and one row per token under it. Light and dark are tabs; pointing at a row
 * finds its step (src/clientModules/scales.ts reads the odv-scale hooks). The docs generator writes
 * the scale (<page>.json beside the page); the page holds one line: ::color-scale{id="blue"}
 *
 * This is a drawing of the scheme's colors, so it shows their values; its look comes from the docs'
 * scale styles.
 */
import * as React from "react";

type Step = {
  st: string;
  hex: string;
  on: boolean;
  kind?: "fill" | "edge" | "text";
  ink?: string;
  ground?: string;
};
type Row = {
  token: string;
  tag?: string;
  prim: string;
  via?: string;
  hex: string;
  href?: string;
  link?: string;
};
type Lane = { title: string; cols?: string; steps?: Step[]; rows: Row[] };
type Panel = {
  mode: string;
  label: string;
  style: Record<string, string>;
  lanes: Lane[];
};
export type ColorScaleData = { panels: Panel[] };

function StepCell({ s }: { s: Step }) {
  if (!s.on)
    return (
      <div className="odv-sl">
        <span className="n">{s.st}</span>
        <i style={{ background: s.hex }} />
      </div>
    );
  if (s.kind === "fill")
    return (
      <div
        className="odv-st"
        data-link={`fill-${s.st}`}
        style={{ background: s.hex, color: s.ink }}
      >
        <span className="n">{s.st}</span>
        <span className="x">{s.hex}</span>
      </div>
    );
  if (s.kind === "edge")
    return (
      <div className="odv-st odv-st-bare" data-link={`edge-${s.st}`}>
        <span className="n">{s.st}</span>
        <span className="x">{s.hex}</span>
        <span className="mk">
          <i style={{ background: s.hex }} />
          <b style={{ background: s.hex }} />
        </span>
      </div>
    );
  return (
    <div
      className="odv-st odv-st-bare"
      data-link={`text-${s.st}`}
      style={{ color: s.hex, background: s.ground }}
    >
      <span className="n">{s.st}</span>
      <span className="x">{s.hex}</span>
      <span className="aa">Aa</span>
    </div>
  );
}

function TokenRow({ r }: { r: Row }) {
  const inner = (
    <>
      <i className="odv-kv-sw" style={{ background: r.hex }} />
      <span>
        <span className="odv-kv-k">{r.token}</span>
        {r.tag && <span className="odv-kv-tag">{r.tag}</span>}
      </span>
      <span className="odv-kv-v">
        <b>{r.prim}</b>
        {r.via && <small>via {r.via}</small>}
        <small>{r.hex}</small>
      </span>
    </>
  );
  return r.href ? (
    <a className="odv-kv" data-link={r.link} href={r.href}>
      {inner}
    </a>
  ) : (
    <div className="odv-kv" data-link={r.link} tabIndex={0}>
      {inner}
    </div>
  );
}

export default function ColorScale({ data }: { data: ColorScaleData }) {
  return (
    <div data-composite="color-scale" className="odv-scale" data-scale="">
      <div className="odv-scale-tabs" role="tablist">
        {data.panels.map((p, i) => (
          <button
            key={p.mode}
            type="button"
            role="tab"
            data-mode={p.mode}
            aria-selected={i === 0}
          >
            {p.label}
          </button>
        ))}
      </div>
      {data.panels.map((p) => (
        <div
          key={p.mode}
          className="odv-scale-p"
          data-mode={p.mode}
          role="tabpanel"
          style={p.style}
        >
          {p.lanes.map((l) => (
            <div key={l.title} className="odv-lane">
              <p className="odv-lane-h">{l.title}</p>
              {l.steps && (
                <div
                  className="odv-sts"
                  style={{ gridTemplateColumns: l.cols }}
                >
                  {l.steps.map((s) => (
                    <StepCell key={s.st} s={s} />
                  ))}
                </div>
              )}
              {l.rows.length > 0 && (
                <div className="odv-kvs">
                  {l.rows.map((r) => (
                    <TokenRow key={`${r.token}|${r.prim}`} r={r} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
