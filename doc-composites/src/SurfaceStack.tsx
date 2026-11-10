/**
 * SurfaceStack: the canvas, then the surfaces content sits on, drawn one inside the other in each
 * mode. Each mode sits in a mode scope (data-mode), so the scheme's tokens paint it; the surfaces
 * are the scheme's own Card on the canvas, with a sunken well inside. The data follows
 * doc-composites/schemas/surface-stack.schema.json; the page holds one line: ::surface-stack{id="aster"}
 */
import * as React from "react";
import Frame from "./base/Frame";

const label = "text-[length:var(--type-label-font-size)] font-semibold";

export type SurfaceStackData = { brand?: string; modes: ("light" | "dark")[] };

const token =
  "text-[length:var(--type-caption-font-size)] [font-family:var(--type-data-font-family)]";

export default function SurfaceStack({ data }: { data: SurfaceStackData }) {
  // Each mode in its own colors: the canvas, the default surface on it, the sunken surface inside.
  return (
    <div data-composite="surface-stack" className="grid gap-[var(--space-gap-group)] sm:grid-cols-2">
      {data.modes.map((mode) => (
        <div key={mode} data-mode={mode}>
          <div data-brand={data.brand}>
            <Frame variant="canvas">
              <div className="flex flex-col gap-[var(--space-gap-default)]">
                <span className={label}>{mode}</span>
                <Frame>
                  <div className="flex flex-col gap-[var(--space-gap-default)]">
                    <span className="flex flex-col">
                      <b className={label}>Default</b>
                      <span className={token}>surface.default</span>
                    </span>
                    <Frame variant="sunken">
                      <span className="flex flex-col">
                        <b className={label}>Sunken</b>
                        <span className={token}>surface.sunken</span>
                      </span>
                    </Frame>
                  </div>
                </Frame>
              </div>
            </Frame>
          </div>
        </div>
      ))}
    </div>
  );
}
