/**
 * PairsChart: which text may sit on which fill, and the contrast each pair keeps, in each mode. Each
 * fill is painted in its own color with every text that may sit on it; a pair below its floor is
 * marked with a Badge. Built from the scheme's Tabs and Badge, used through their props only;
 * the fills are drawings of values. The data follows doc-composites/schemas/pairs-chart.schema.json;
 * the page holds one line: ::pairs-chart{id="aster"}
 */
import * as React from "react";
import Frame from "./base/Frame";
import { Badge } from "@open-ds/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@open-ds/ui/components/tabs";

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
  mode: "light" | "dark";
  page: { canvas: string; text: string; muted: string; edge: string };
  groups: FillGroup[];
};
export type PairsChartData = { modes: PairsMode[] };

const small =
  "text-[length:var(--type-caption-font-size)] [font-family:var(--type-data-font-family)]";

function FillTile({ f, page }: { f: Fill; page: PairsMode["page"] }) {
  return (
    <div
      className="flex min-w-0 flex-col gap-[var(--space-gap-tight)] rounded-[var(--radius-container)] border p-[var(--space-gap-default)]"
      style={{
        background: f.hex,
        borderColor: page.edge,
        color: f.pairs[0]?.hex,
      }}
    >
      <p className="flex flex-col whitespace-nowrap font-semibold">
        {f.fill}
        <span className={small}>{f.primitive}</span>
      </p>
      {f.pairs.map((p) => (
        <div
          key={p.text}
          className="flex items-center gap-[var(--space-gap-tight)]"
          style={{ color: p.hex }}
        >
          <b className="text-[length:var(--type-title-font-size)]">Aa</b>
          <span className={`flex min-w-0 flex-1 flex-col truncate ${small}`}>
            {p.text}
            <span>{p.primitive}</span>
          </span>
          <span className={`shrink-0 whitespace-nowrap rounded-full border border-current px-[var(--space-gap-tight)] ${small}`}>
            {p.contrast.toFixed(1)}:1
          </span>
          {p.contrast < p.floor && (
            <Badge tone="danger">Below {p.floor}:1</Badge>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PairsChart({
  data,
  mode = "light",
}: {
  data: PairsChartData;
  mode?: "light" | "dark";
}) {
  const start = data.modes.some((m) => m.mode === mode)
    ? mode
    : data.modes[0].mode;
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
                <Frame variant="plain" style={{ background: m.page.canvas, color: m.page.text, borderColor: m.page.edge }}>
                <div className="flex flex-col gap-[var(--space-gap-group)]">
                  {m.groups.map((g) => (
                    <section
                      key={g.title}
                      className="flex flex-col gap-[var(--space-gap-tight)]"
                    >
                      <h4
                        className="text-[length:var(--type-caption-font-size)] font-semibold uppercase tracking-wide"
                        style={{ color: m.page.muted }}
                      >
                        {g.title}
                      </h4>
                      <p className="text-[length:var(--type-caption-font-size)]" style={{ color: m.page.muted }}>
                        {g.note}
                      </p>
                      <div className="grid gap-[var(--space-gap-tight)] sm:grid-cols-2 lg:grid-cols-3">
                        {g.fills.map((f) => (
                          <FillTile key={f.fill} f={f} page={m.page} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
                </Frame>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
}
