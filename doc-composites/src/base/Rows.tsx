/**
 * Rows: a stack of rows with a divider between them, in the scheme's border color. A base form: the
 * status rows, the type roles and the type families extend it.
 */
import * as React from "react";

export default function Rows({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col [&>*]:border-b-[length:var(--border-width-default)] [&>*]:border-[var(--color-border-default)] [&>*]:py-[var(--space-gap-default)] [&>*:last-child]:border-b-0">
      {children}
    </div>
  );
}
