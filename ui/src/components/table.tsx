/**
 * Table. Rows of data. Row height is a scheme decision (situation table-row): compact in
 * Dense data, comfortable or large elsewhere. Numbers use the data text role so columns align
 * where the scheme answers typography.q1 with a data role.
 *
 * Reads only component keys: --table-*.
 */
import * as React from "react";
import { cn } from "../lib/utils";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn(
          "w-full border-collapse text-[length:var(--table-font-size)] text-[var(--color-text-primary)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead data-slot="table-header" className={cn("bg-[var(--table-header-background)]", className)} {...props} />;
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody data-slot="table-body" {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "h-[var(--table-row-height)] border-b-[length:var(--border-width-default)] border-[var(--table-row-border)]",
        "data-[state=selected]:bg-[var(--table-row-selected)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-[var(--table-cell-padding-x)] text-left align-middle text-[var(--color-text-secondary)]",
        "[font-family:var(--type-label-font-family)] text-[length:var(--type-label-font-size)] [font-weight:var(--type-label-font-weight)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  numeric = false,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-[var(--table-cell-padding-x)] align-middle",
        numeric && "text-right tabular-nums [font-family:var(--type-data-font-family)]",
        className,
      )}
      {...props}
    />
  );
}
