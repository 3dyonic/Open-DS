/**
 * PairsChart: which text may sit on which fill, and the contrast it keeps there, in each mode. Each
 * fill is painted in its color with every text that may sit on it; a pair below its floor is marked.
 * Light and dark are tabs (src/clientModules/scales.ts reads the odv-scale hooks). The docs generator
 * writes the pairs (<page>.json beside the page); the page holds one line: ::pairs-chart{id="aster"}
 *
 * The data is facts only: fills, texts, their primitives and values, each contrast and its floor.
 */
import * as React from "react";

export type Pair = {
  text: string;
  primitive: string;
  hex: string;
  contrast: number;
  floor: number;
};
export type Fill = {
  fill: string;
  primitive: string;
  hex: string;
  pairs: Pair[];
};
export type FillGroup = { title: string; note: string; fills: Fill[] };
export type PairsMode = {
  mode: string;
  page: { canvas: string; text: string; muted: string; edge: string };
  groups: FillGroup[];
};
export type PairsChartData = { modes: PairsMode[] };

export default function PairsChart({ data }: { data: PairsChartData }) {
  return (
    <div data-composite="pairs-chart" className="odv-scale" data-scale="">
      <div className="odv-scale-tabs" role="tablist">
        {data.modes.map((m, i) => (
          <button
            key={m.mode}
            type="button"
            role="tab"
            data-mode={m.mode}
            aria-selected={i === 0}
          >
            {m.mode.charAt(0).toUpperCase() + m.mode.slice(1)} theme
          </button>
        ))}
      </div>
      {data.modes.map((m) => (
        <div
          key={m.mode}
          className="odv-scale-p"
          data-mode={m.mode}
          role="tabpanel"
          style={
            {
              background: m.page.canvas,
              color: m.page.text,
              "--odv-muted": m.page.muted,
              "--odv-edge": m.page.edge,
            } as React.CSSProperties
          }
        >
          {m.groups.map((g) => (
            <div key={g.title} className="odv-pgroup">
              <p className="odv-lane-h">{g.title}</p>
              <p className="odv-pgroup-n">{g.note}</p>
              <div className="odv-tiles">
                {g.fills.map((f) => (
                  <div
                    key={f.fill}
                    className="odv-tile"
                    style={{ background: f.hex }}
                  >
                    <p
                      className="odv-tile-h"
                      style={{ color: f.pairs[0]?.hex ?? "inherit" }}
                    >
                      {f.fill}
                      <small>{f.primitive}</small>
                    </p>
                    {f.pairs.map((p) => (
                      <div key={p.text} className="odv-pr">
                        <span className="odv-pr-aa" style={{ color: p.hex }}>
                          Aa
                        </span>
                        <span className="odv-pr-k" style={{ color: p.hex }}>
                          {p.text}
                          <small>{p.primitive}</small>
                        </span>
                        <span
                          className={`odv-pr-c${p.contrast >= p.floor ? "" : " no"}`}
                          style={{ color: p.hex }}
                        >
                          {p.contrast.toFixed(1)}:1
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
