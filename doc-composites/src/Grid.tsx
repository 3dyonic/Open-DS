/**
 * Grid: lays the panels inside it out in columns, one column on a phone. Layout only, on the Columns
 * base form:
 *
 *   ::::grid{columns="2"}
 *   :::panel{…}
 *   :::
 *   ::::
 */
import * as React from "react";
import Columns from "./base/Columns";

export default function Grid({
  columns = "2",
  children,
}: {
  columns?: "2" | "3";
  children?: React.ReactNode;
}) {
  return (
    <div data-composite="grid">
      <Columns count={columns}>{children}</Columns>
    </div>
  );
}
