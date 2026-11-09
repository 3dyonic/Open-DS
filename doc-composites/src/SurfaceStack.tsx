/**
 * SurfaceStack: the canvas, then the surfaces content sits on, drawn one inside the other in each
 * theme, from that theme's own colors. The docs generator writes the themes (<page>.json beside the
 * page); the page holds one line: ::surface-stack{id="aster"}
 */
import * as React from "react";

export type StackTheme = {
  theme: string;
  canvas: string;
  surface: string;
  sunken: string;
  text: string;
  border: string;
};
export type SurfaceStackData = { themes: StackTheme[] };

export default function SurfaceStack({ data }: { data: SurfaceStackData }) {
  return (
    <div data-composite="surface-stack" className="odv-grid two">
      {data.themes.map((t) => (
        <div
          key={t.theme}
          className="odv-stack"
          style={{ background: t.canvas, color: t.text, borderColor: t.border }}
        >
          <div
            style={{
              inset: "12px 12px auto 12px",
              border: 0,
              background: "none",
            }}
          >
            <b>{t.theme}</b>
          </div>
          <div
            style={{
              inset: "44px 16px 16px 16px",
              background: t.surface,
              borderColor: t.border,
            }}
          >
            <b>Default</b>
            <code>surface.default</code>
          </div>
          <div
            style={{
              inset: "104px 44px 36px 44px",
              background: t.sunken,
              borderColor: t.border,
            }}
          >
            <b>Sunken</b>
            <code>surface.sunken</code>
          </div>
        </div>
      ))}
    </div>
  );
}
