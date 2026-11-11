/**
 * Grid: lays the panels inside it out in columns, one column on a phone. Layout only:
 *
 *   ::::grid{columns="2"}
 *   :::panel{…}
 *   :::
 *   ::::
 */
import * as React from "react";

export default function Grid({
  columns = "2",
  children,
}: {
  columns?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      data-composite="grid"
      className={
        columns === "3"
          ? "grid gap-[var(--space-gap-default)] sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-[var(--space-gap-default)] sm:grid-cols-2"
      }
    >
      {children}
    </div>
  );
}
