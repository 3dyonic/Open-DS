/**
 * Columns: items side by side, one column on a phone. A base form: the grids, the mode pairs and the
 * typeface cards extend it. count "2" sets two columns from a small screen up; "3" adds a third on a
 * large one. gap "default" or "group" is the scheme's gap between the items.
 */
import * as React from "react";

const COUNT = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
} as const;
const GAP = {
  default: "gap-[var(--space-gap-default)]",
  group: "gap-[var(--space-gap-group)]",
} as const;

export default function Columns({
  count = "2",
  gap = "default",
  children,
}: {
  count?: keyof typeof COUNT;
  gap?: keyof typeof GAP;
  children: React.ReactNode;
}) {
  return <div className={`grid ${GAP[gap]} ${COUNT[count]}`}>{children}</div>;
}
