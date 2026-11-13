/**
 * ScaleCurve: how a scale's steps climb in lightness. One dot per step, filled with the step's own
 * color; higher is lighter (OKLCH L). The scheme's eased curve is the solid line, a linear curve the
 * dashed one. The middle band is shaded and named. A held step is a dashed ring, linked to where the
 * curve would put it. Built on the Frame base form; the drawing reads the data and the scheme's tokens.
 * The data follows doc-composites/schemas/scale-curve.schema.json; the page holds one line:
 * ::scale-curve{id="key"}
 */
import * as React from "react";
import Frame from "./base/Frame";

export type ScaleCurveStep = {
  step: string;
  hex: string;
  lightness: number;
  curve: number;
  linear: number;
  held?: string;
  curveHex?: string;
};
export type ScaleCurveData = {
  hue: string;
  key: string;
  option: string;
  easing: number;
  band: { from: string; to: string; wider: number };
  steps: ScaleCurveStep[];
};

// The drawing's own grid, in viewBox units: it scales with the page.
const W = 860;
const H = 360;
const LEFT = 64;
const RIGHT = 24;
const TOP = 28;
const BOTTOM = 44;
const LOW = 0.05;
// Room between the axis and the first and last dots.
const PAD = 28;

const caption = "text-[length:var(--type-caption-font-size)]";
// Words inside the drawing, in viewBox units, so they scale with the drawing.
const LABEL = 15;

export default function ScaleCurve({ data }: { data: ScaleCurveData }) {
  const n = data.steps.length;
  const x = (i: number) => LEFT + PAD + (i * (W - LEFT - RIGHT - 2 * PAD)) / (n - 1);
  const y = (L: number) => TOP + (1 - (L - LOW) / (1 - LOW)) * (H - TOP - BOTTOM);
  const line = (pick: (s: ScaleCurveStep) => number) =>
    data.steps.map((s, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(pick(s)).toFixed(1)}`).join(" ");
  const keyIndex = data.steps.findIndex((s) => s.step === data.key);
  const key = data.steps[keyIndex];
  const from = data.steps.findIndex((s) => s.step === data.band.from);
  const to = data.steps.findIndex((s) => s.step === data.band.to);
  const half = (W - LEFT - RIGHT - 2 * PAD) / (n - 1) / 2;
  const linear = data.easing === 0;
  const bandName = linear
    ? "Middle steps: the same rule as the ends"
    : `Middle steps: up to ${data.band.wider} times the linear gap`;
  const held = data.steps.some((s) => s.held);
  return (
    <div data-composite="scale-curve">
      <Frame>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Lightness of each ${data.hue} step, with the ${data.option.toLowerCase()} curve and a linear curve`}>
          <rect x={x(from) - half} y={TOP} width={x(to) - x(from) + 2 * half} height={H - TOP - BOTTOM} rx="10" fill="var(--color-surface-sunken)" />
          <text x={(x(from) + x(to)) / 2} y={TOP + 18} textAnchor="middle" fontWeight="600" fill="var(--color-text-secondary)" fontSize={LABEL}>
            {bandName}
          </text>
          {[0.2, 0.4, 0.6, 0.8, 1].map((L) => (
            <g key={L}>
              <line x1={LEFT} x2={W - RIGHT} y1={y(L)} y2={y(L)} stroke="var(--color-border-default)" />
              <text x={LEFT - 10} y={y(L) + 4} textAnchor="end" fill="var(--color-text-muted)" fontSize={LABEL}>
                {L.toFixed(1)}
              </text>
            </g>
          ))}
          <text x={14} y={(TOP + H - BOTTOM) / 2} textAnchor="middle" fill="var(--color-text-muted)" fontSize={LABEL} transform={`rotate(-90 14 ${(TOP + H - BOTTOM) / 2})`}>
            lightness
          </text>
          {data.steps.map((s, i) => (
            <text key={s.step} x={x(i)} y={H - 16} textAnchor="middle" fill="var(--color-text-secondary)" fontWeight={s.step === data.key ? "700" : undefined} fontSize={LABEL}>
              {s.step}
            </text>
          ))}
          {!linear && <path d={line((s) => s.linear)} fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeDasharray="6 6" />}
          <path d={line((s) => s.curve)} fill="none" stroke={key?.hex} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {data.steps.map((s, i) =>
            s.held ? (
              <g key={s.step}>
                <line x1={x(i)} x2={x(i)} y1={y(s.curve)} y2={y(s.lightness)} stroke={key?.hex} strokeDasharray="2 3" />
                <circle cx={x(i)} cy={y(s.curve)} r="4" fill={s.curveHex ?? key?.hex} stroke="var(--color-surface-default)" />
                <circle cx={x(i)} cy={y(s.lightness)} r="16" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx={x(i)} cy={y(s.lightness)} r="11" fill={s.hex} stroke="var(--color-border-strong)" strokeWidth="1.5">
                  <title>{`${s.step}: held (${s.held}), lightness ${s.lightness}; the curve puts it at ${s.curve}`}</title>
                </circle>
              </g>
            ) : (
              <circle key={s.step} cx={x(i)} cy={y(s.lightness)} r={s.step === data.key ? 16 : 12} fill={s.hex} stroke="var(--color-border-strong)" strokeWidth="1.5">
                <title>{`${s.step}: ${s.hex}, lightness ${s.lightness}`}</title>
              </circle>
            ),
          )}
          {key && (
            <text x={x(keyIndex) + 22} y={y(key.lightness) + 5} fontWeight="700" fill="var(--color-text-primary)" fontSize={LABEL}>
              {`${data.key}: the key color, exact`}
            </text>
          )}
        </svg>
        <ul className={`m-0 flex list-none flex-wrap gap-x-[var(--space-gap-group)] gap-y-[var(--space-gap-tight)] p-0 ${caption} text-[color:var(--color-text-secondary)]`}>
          <li className="flex items-center gap-[var(--space-gap-tight)]">
            <svg width="28" height="8" aria-hidden="true"><line x1="0" x2="28" y1="4" y2="4" stroke={key?.hex} strokeWidth="3.5" strokeLinecap="round" /></svg>
            {data.option}: this scheme's curve (easing {data.easing})
          </li>
          {!linear && (
            <li className="flex items-center gap-[var(--space-gap-tight)]">
              <svg width="28" height="8" aria-hidden="true"><line x1="0" x2="28" y1="4" y2="4" stroke="var(--color-text-muted)" strokeWidth="2" strokeDasharray="6 6" /></svg>
              Linear: no ease, for comparison
            </li>
          )}
          <li className="flex items-center gap-[var(--space-gap-tight)]">
            <svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="var(--color-surface-default)" stroke="var(--color-border-strong)" strokeWidth="1.5" /></svg>
            A step, in its own color
          </li>
          {held && (
            <li className="flex items-center gap-[var(--space-gap-tight)]">
              <svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeDasharray="3 2" /></svg>
              Held: kept at its earlier value for now
            </li>
          )}
        </ul>
      </Frame>
    </div>
  );
}
