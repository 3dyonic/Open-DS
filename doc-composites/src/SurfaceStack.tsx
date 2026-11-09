/**
 * SurfaceStack: the canvas, then the surfaces content sits on, drawn one inside the other in each
 * mode. Each mode sits in a mode scope (data-mode), so the scheme's tokens paint it; the surfaces
 * are the scheme's own Card on the canvas, with a sunken well inside. The data follows
 * doc-composites/schemas/surface-stack.schema.json; the page holds one line: ::surface-stack{id="aster"}
 */
import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@open-ds/ui/components/card";

export type SurfaceStackData = { brand?: string; modes: ("light" | "dark")[] };

const token =
  "text-[length:var(--type-caption-font-size)] [font-family:var(--type-data-font-family)]";

export default function SurfaceStack({ data }: { data: SurfaceStackData }) {
  return (
    <div
      data-composite="surface-stack"
      className="grid gap-[var(--space-gap-group)] sm:grid-cols-2"
    >
      {data.modes.map((mode) => (
        <div key={mode} data-mode={mode}>
          <div
            data-brand={data.brand}
            className="flex flex-col gap-[var(--space-gap-default)] rounded-[var(--radius-container)] border-[length:var(--border-width-default)] border-[var(--color-border-default)] bg-[var(--color-surface-canvas)] p-[var(--space-inset-container)] text-[var(--color-text-primary)]"
          >
            <p className="flex flex-col">
              <b>{mode === "light" ? "Light" : "Dark"} · Canvas</b>
              <span className={token}>surface.canvas</span>
            </p>
            <Card>
              <CardHeader>
                <CardTitle>Default</CardTitle>
                <span className={token}>surface.default</span>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col rounded-[var(--radius-container)] border-[length:var(--border-width-default)] border-[var(--color-border-default)] bg-[var(--color-surface-sunken)] p-[var(--space-inset-container)]">
                  <b>Sunken</b>
                  <span className={token}>surface.sunken</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
