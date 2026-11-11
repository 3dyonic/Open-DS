/**
 * FillTones: each fill and its tone in each mode. A chip in the fill's own color, in that mode, with
 * "Aa" in the text its tone picks, the tone's name, and below it the step the fill reads: a gray
 * names its neutral step, any other color its primitive. Built on the Swatch base form; each chip
 * sits in its mode's scope, so its token resolves to that mode's value. The data follows
 * doc-composites/schemas/fill-tones.schema.json; the page holds one line: ::fill-tones{id="default"}
 */
import * as React from "react";
import Swatch from "./base/Swatch";
import { tokenVar } from "./base/token";

type Tone = "light" | "dark";
export type FillTonesData = {
  modes: Tone[];
  fills: {
    fill: string;
    tones: { mode: Tone; tone: Tone; primitive?: string; via?: string; waits?: string }[];
  }[];
};

const head = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] uppercase tracking-wider text-[color:var(--color-text-muted)]";
const data = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)]";
// Three columns when there is room; on a narrow page the fill name sits above its two chips.
const cols = "grid grid-cols-2 items-center gap-x-[var(--space-gap-default)] gap-y-[var(--space-gap-tight)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";
// The page shows token names without their color. prefix.
const name = (token: string) => token.replace(/^color\./, "");

export default function FillTones({ data: d }: { data: FillTonesData }) {
  return (
    <div data-composite="fill-tones" className="flex flex-col gap-[var(--space-gap-default)]">
      <div className={cols}>
        <span className={`max-sm:col-span-2 ${head}`}>Fill</span>
        {d.modes.map((m) => (
          <span key={m} className={head}>
            {m} mode
          </span>
        ))}
      </div>
      {d.fills.map((f) => (
        <div key={f.fill} className={cols}>
          <code className={`min-w-0 max-sm:col-span-2 ${data}`}>{name(f.fill)}</code>
          {f.tones.map((t) => {
            const source = t.via ?? t.primitive;
            return (
              <div key={t.mode} data-mode={t.mode} className="min-w-0">
                <Swatch color={tokenVar(f.fill)} size="chip">
                  <span
                    className="flex min-w-0 items-center gap-[var(--space-gap-default)]"
                    style={{ color: tokenVar(t.tone === "light" ? "color.text.on-light" : "color.text.on-dark") }}
                  >
                    <b>Aa</b>
                    <span className={`flex min-w-0 flex-col leading-tight ${data}`}>
                      <span className="font-medium">
                        {t.tone}
                        {t.waits && ` · waits for ${t.waits}`}
                      </span>
                      {source && <span className="opacity-75">{name(source)}</span>}
                    </span>
                  </span>
                </Swatch>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
