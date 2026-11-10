/**
 * PairsChart: which text may sit on which fill, and the contrast each pair keeps, in each mode. Each
 * fill is painted in its own color with every text that may sit on it; a pair below its floor is
 * marked with the scheme's Badge. Built on the Frame base form, with the scheme's Tabs and Badge
 * used through their props only; the fills are drawings of values. Each tab sits in its mode's own
 * colors, read live from the tokens. The data follows doc-composites/schemas/pairs-chart.schema.json;
 * the page holds one line: ::pairs-chart{id="default"}
 */
import * as React from "react";
import { Badge } from "@open-ds/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@open-ds/ui/components/tabs";
import Frame from "./base/Frame";

export type Pair = { text: string; primitive: string; hex: string; contrast: number; floor?: number };
export type Fill = { fill: string; primitive: string; hex: string; pairs: Pair[] };
type Tone = "page" | "light" | "dark";
export type PairsMode = { mode: "light" | "dark"; fills: Partial<Record<Tone, Fill[]>> };
export type PairsChartData = { floor: number; modes: PairsMode[] };

// The chart's own words for each group of fills: what the fills are and which text they take.
const TONES: { tone: Tone; title: string; note: string }[] = [
  { tone: "page", title: "The page's own surfaces", note: "The page's own text sits on them: primary, secondary, muted and links." },
  { tone: "light", title: "Light fills", note: "Their tone is light, so the text on them is text.on-light, or a status's -on-light text." },
  { tone: "dark", title: "Dark fills", note: "Their tone is dark, so the text on them is text.on-dark, or a status's -on-dark text." },
];

const small = "text-[length:var(--type-caption-font-size)] [font-family:var(--type-data-font-family)]";
const muted = "text-[color:var(--color-text-muted)]";
// The page shows token names without their color. prefix.
const name = (token: string) => token.replace(/^color\./, "");

function FillTile({ f, floor }: { f: Fill; floor: number }) {
  return (
    <div
      className="flex min-w-0 flex-col gap-[var(--space-gap-tight)] rounded-[var(--radius-container)] border-[length:var(--border-width-default)] border-[var(--color-border-default)] p-[var(--space-gap-default)]"
      style={{ background: f.hex, color: f.pairs[0]?.hex }}
    >
      <p className="flex flex-col whitespace-nowrap font-semibold">
        {name(f.fill)}
        <span className={small}>{name(f.primitive)}</span>
      </p>
      {f.pairs.map((p) => (
        <div key={p.text} className="flex items-center gap-[var(--space-gap-tight)]" style={{ color: p.hex }}>
          <b className="text-[length:var(--type-title-font-size)]">Aa</b>
          <span className={`flex min-w-0 flex-1 flex-col truncate ${small}`}>
            {name(p.text)}
            <span>{name(p.primitive)}</span>
          </span>
          <span className={`shrink-0 whitespace-nowrap rounded-full border border-current px-[var(--space-gap-tight)] ${small}`}>
            {p.contrast.toFixed(1)}:1
          </span>
          {p.contrast < (p.floor ?? floor) && <Badge tone="danger">Below {p.floor ?? floor}:1</Badge>}
        </div>
      ))}
    </div>
  );
}

export default function PairsChart({ data, mode = "light" }: { data: PairsChartData; mode?: "light" | "dark" }) {
  const start = data.modes.some((m) => m.mode === mode) ? mode : data.modes[0].mode;
  return (
    <div data-composite="pairs-chart">
      <Tabs defaultValue={start}>
        <TabsList>
          {data.modes.map((m) => (
            <TabsTrigger key={m.mode} value={m.mode}>
              {m.mode === "light" ? "Light theme" : "Dark theme"}
            </TabsTrigger>
          ))}
        </TabsList>
        {data.modes.map((m) => (
          <TabsContent key={m.mode} value={m.mode}>
            {/* Inside data-mode the tokens resolve to this mode's values, whatever the page's mode. */}
            <div data-mode={m.mode}>
              <Frame variant="canvas">
                <div className="flex flex-col gap-[var(--space-gap-group)]">
                  {TONES.filter((t) => m.fills[t.tone]?.length).map((t) => (
                    <section key={t.tone} className="flex flex-col gap-[var(--space-gap-tight)]">
                      <h4 className={`text-[length:var(--type-caption-font-size)] font-semibold uppercase tracking-wide ${muted}`}>
                        {t.title}
                      </h4>
                      <p className={`text-[length:var(--type-caption-font-size)] ${muted}`}>{t.note}</p>
                      <div className="grid gap-[var(--space-gap-tight)] sm:grid-cols-2 lg:grid-cols-3">
                        {m.fills[t.tone]!.map((f) => (
                          <FillTile key={f.fill} f={f} floor={data.floor} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </Frame>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
