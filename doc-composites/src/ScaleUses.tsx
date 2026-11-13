/**
 * ScaleUses: three real uses of a scheme's key scale, each drawn in the scale's own colors with the
 * WCAG contrast of its text on its fill. A pair below AA says so. Built on the Frame and Columns base
 * forms and the scheme's Badge (through Label). The data follows
 * doc-composites/schemas/scale-uses.schema.json; the page holds one line: ::scale-uses{id="key"}
 */
import * as React from "react";
import Columns from "./base/Columns";
import Frame from "./base/Frame";
import Label from "./base/Label";

type Level = "AAA" | "AA" | "AA-large" | "fail";
export type ScaleUse = {
  use: "button" | "highlight" | "banner";
  sample: string;
  fill: { step: string; hex: string };
  text: { step?: string; name: string; hex: string };
  contrast: number;
  level: Level;
  caption: string;
};
export type ScaleUsesData = { hue: string; uses: ScaleUse[] };

const LEVEL: Record<Level, { tone: "success" | "warning" | "danger"; text: string }> = {
  AAA: { tone: "success", text: "AAA" },
  AA: { tone: "success", text: "AA" },
  "AA-large": { tone: "warning", text: "Large text only" },
  fail: { tone: "danger", text: "Fails AA" },
};

export default function ScaleUses({ data }: { data: ScaleUsesData }) {
  return (
    <div data-composite="scale-uses">
      <Columns count="3">
        {data.uses.map((u) => (
          <Frame key={u.use}>
            <div className="flex flex-col gap-[var(--space-gap-default)]">
              {/* The use, drawn: on the page's surface for a button, on its own fill for text. */}
              <div
                className="flex min-h-24 items-center justify-center rounded-[var(--radius-control)] p-[var(--space-gap-default)] text-center"
                style={u.use === "button" ? undefined : { background: u.fill.hex, color: u.text.hex }}
              >
                {u.use === "button" ? (
                  <span
                    className="whitespace-nowrap rounded-[var(--radius-control)] px-[var(--space-gap-default)] py-[var(--space-gap-tight)] font-semibold"
                    style={{ background: u.fill.hex, color: u.text.hex }}
                  >
                    {u.sample}
                  </span>
                ) : (
                  <span className="font-semibold">{u.sample}</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-[var(--space-gap-tight)]">
                <span className="text-[length:var(--type-title-font-size)] font-bold text-[color:var(--color-text-primary)] [font-family:var(--type-data-font-family)]">
                  {u.contrast.toFixed(1)}:1
                </span>
                <Label tone={LEVEL[u.level].tone}>{LEVEL[u.level].text}</Label>
              </div>
              <p className="m-0 text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">
                {u.caption}
              </p>
            </div>
          </Frame>
        ))}
      </Columns>
    </div>
  );
}
