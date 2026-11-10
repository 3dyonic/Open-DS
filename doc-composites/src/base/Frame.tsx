/**
 * Frame: a bordered box that holds a composite's content. A base form: composites extend it.
 * variant "card" sits on the page's default surface; "sunken" on the sunken surface; "canvas" is the
 * page itself, for a mode drawn in its own colors; "plain" has no
 * fill, for a box drawn in colors the data gives. Every value is the scheme's: radius, border, inset.
 */
import * as React from "react";

const VARIANT = {
  card: "bg-[var(--color-surface-default)]",
  sunken: "bg-[var(--color-surface-sunken)]",
  canvas: "bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)]",
  plain: "",
} as const;

export default function Frame({
  variant = "card",
  style,
  children,
}: {
  variant?: keyof typeof VARIANT;
  // A box drawn in colors from the data (a mode's canvas) passes them here.
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`min-w-0 rounded-[var(--radius-container)] border-[length:var(--border-width-default)] border-[var(--color-border-default)] p-[var(--space-inset-container)] ${VARIANT[variant]}`}
      style={style}
    >
      {children}
    </div>
  );
}
