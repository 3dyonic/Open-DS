/**
 * Swatch: one color drawn as a square, or as a block that holds words. A base form: swatch lists,
 * the key-color band and the status rows extend it. size "sm" sits in a table row, "md" in a list,
 * "block" fills a band cell and holds its label.
 */
import * as React from "react";

const SIZE = {
  sm: "size-4 rounded-[var(--radius-badge)]",
  md: "size-6 rounded-[var(--radius-control)]",
  block: "flex min-h-28 flex-col justify-end p-[var(--space-gap-default)]",
} as const;

export default function Swatch({
  color,
  size = "md",
  children,
}: {
  color: string;
  size?: keyof typeof SIZE;
  children?: React.ReactNode;
}) {
  const edge = size === "block" ? "" : "shrink-0 border-[length:var(--border-width-default)] border-[var(--color-border-default)]";
  return (
    <span aria-hidden={children ? undefined : true} className={`${size === "block" ? "" : "inline-block"} ${SIZE[size]} ${edge}`} style={{ background: color }}>
      {children}
    </span>
  );
}
