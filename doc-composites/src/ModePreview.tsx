/**
 * ModePreview: a small screen in each mode of a brand, painted from that mode's own colors and
 * corners: a surface with the scheme's name and a scenario, two statuses, and the commit and cancel
 * actions. The docs generator writes the modes (<page>.json beside the page); the page holds one
 * line: ::mode-preview{id="aster"}
 *
 * This is a drawing of the theme, so it shows its values; its look comes from the docs' mode styles.
 */
import * as React from "react";

export type ModeColors = {
  canvas: string;
  surface: string;
  border: string;
  text: string;
  secondary: string;
  action: string;
  onAction: string;
  sunken: string;
};
export type Mode = {
  mode: string;
  brand?: string;
  colors: ModeColors;
  radius: { container: string; badge: string; control: string };
  statuses: { label: string; color: string; fill: string }[];
};
export type ModePreviewData = {
  name: string;
  scenario: string;
  actions: { commit: string; cancel: string };
  modes: Mode[];
};

export default function ModePreview({ data }: { data: ModePreviewData }) {
  return (
    <div data-composite="mode-preview" className="odv-modes">
      {data.modes.map((m) => (
        <div
          key={m.mode}
          className="odv-mode-prev"
          style={{
            background: m.colors.canvas,
            color: m.colors.text,
            borderColor: m.colors.border,
          }}
        >
          <div className="odv-mode-head">
            <span>{m.mode.charAt(0).toUpperCase() + m.mode.slice(1)}</span>
            {m.brand && <span>{m.brand}</span>}
          </div>
          <div
            className="odv-mode-surf"
            style={{
              background: m.colors.surface,
              borderColor: m.colors.border,
              borderRadius: m.radius.container,
            }}
          >
            <b>{data.name}</b>
            <span style={{ color: m.colors.secondary }}>{data.scenario}</span>
            {m.statuses.length > 0 && (
              <span className="odv-mode-row">
                {m.statuses.map((s) => (
                  <span
                    key={s.label}
                    className="odv-mode-pill"
                    style={{
                      background: s.fill,
                      color: s.color,
                      borderRadius: m.radius.badge,
                    }}
                  >
                    {s.label}
                  </span>
                ))}
              </span>
            )}
            <span className="odv-mode-row">
              <span
                className="odv-mode-btn"
                style={{
                  background: m.colors.action,
                  color: m.colors.onAction,
                  borderRadius: m.radius.control,
                }}
              >
                {data.actions.commit}
              </span>
              <span
                className="odv-mode-btn"
                style={{
                  background: m.colors.sunken,
                  color: m.colors.text,
                  borderRadius: m.radius.control,
                }}
              >
                {data.actions.cancel}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
