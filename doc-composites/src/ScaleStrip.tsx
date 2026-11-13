/**
 * ScaleStrip: a scheme's key scale as one wide strip, steps 50 to 950, the key step marked. Built on
 * the Ribbon base form and the scheme's Badge (through Label). The data follows
 * doc-composites/schemas/scale-strip.schema.json; the page holds one line: ::scale-strip{id="key"}
 */
import * as React from "react";
import Label from "./base/Label";
import Ribbon from "./base/Ribbon";

export type ScaleStripData = {
  hue: string;
  key: string;
  steps: { step: string; primitive: string; hex: string }[];
};

export default function ScaleStrip({ data }: { data: ScaleStripData }) {
  const key = data.steps.find((s) => s.step === data.key);
  return (
    <figure data-composite="scale-strip" className="m-0 flex flex-col gap-[var(--space-gap-tight)]">
      <Ribbon steps={data.steps} keyStep={data.key} keyLabel={<Label>Key color</Label>} />
      <figcaption className="text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]">
        The {data.hue} scale, light theme. Step {data.key} is the key color, {key?.hex}, exactly as given. Every other step is built around it.
      </figcaption>
    </figure>
  );
}
