/**
 * Data table. A pattern for many records: search, faceted filters, sorting, column choice, row
 * selection with bulk actions, pagination and a density switch.
 *
 * Built from the system's own components (table, input, button, checkbox, popover, toggle group)
 * on TanStack Table, following shadcn/ui's Data Table guide (MIT). Reads only component keys and the
 * shadcn variables that theme.css maps onto the scheme's semantics. Every label is a prop, so the
 * words come from the scheme's voice.
 */
"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, Columns3, ListFilter } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

/** Column options read by the table: numbers align right in the data font. */
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    numeric?: boolean;
    label?: string;
  }
}

export interface DataTableFacet {
  /** The column id to filter by. */
  column: string;
  /** The filter's button label. */
  title: string;
}

export interface DataTableLabels {
  search: string;
  columns: string;
  density: string;
  compact: string;
  comfortable: string;
  selected: (count: number) => string;
  noResults: string;
  previous: string;
  next: string;
  page: (index: number, count: number) => string;
  selectAll: string;
  selectRow: string;
}

const LABELS: DataTableLabels = {
  search: "Search",
  columns: "Columns",
  density: "Row density",
  compact: "Compact",
  comfortable: "Comfortable",
  selected: (n) => `${n} selected`,
  noResults: "No results.",
  previous: "Previous",
  next: "Next",
  page: (i, n) => `Page ${i} of ${n}`,
  selectAll: "Select all rows on this page",
  selectRow: "Select row",
};

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  facets?: DataTableFacet[];
  pageSize?: number;
  /** Actions for the selected rows, shown when at least one row is selected. */
  bulkActions?: (rows: TData[]) => React.ReactNode;
  labels?: Partial<DataTableLabels>;
  className?: string;
}

/** A checkbox column for row selection. Put it first. */
export function dataTableSelectColumn<TData>(labels: Partial<DataTableLabels> = {}): ColumnDef<TData, unknown> {
  const l = { ...LABELS, ...labels };
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        aria-label={l.selectAll}
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox aria-label={l.selectRow} checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
    ),
  };
}

/** A header that sorts its column on click and shows the direction. */
export function DataTableSortHeader({ label, sorted, onSort }: { label: string; sorted: false | "asc" | "desc"; onSort: () => void }) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;
  return (
    <button type="button" onClick={onSort} className="inline-flex items-center gap-1 font-[inherit] hover:text-foreground">
      {label}
      <Icon className="size-3.5" aria-hidden />
    </button>
  );
}

function FacetFilter<TData>({ facet, table }: { facet: DataTableFacet; table: ReturnType<typeof useReactTable<TData>> }) {
  const column = table.getColumn(facet.column);
  if (!column) return null;
  const counts = column.getFacetedUniqueValues();
  const chosen = new Set((column.getFilterValue() as string[] | undefined) ?? []);
  const toggle = (value: string) => {
    const next = new Set(chosen);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    column.setFilterValue(next.size ? [...next] : undefined);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="compact">
          <ListFilter /> {facet.title}
          {chosen.size > 0 && <span className="tabular-nums">· {chosen.size}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <ul className="flex flex-col">
          {[...counts.entries()]
            .sort(([a], [b]) => String(a).localeCompare(String(b)))
            .map(([value, count]) => (
              <li key={String(value)}>
                <label className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-accent">
                  <Checkbox checked={chosen.has(String(value))} onCheckedChange={() => toggle(String(value))} />
                  <span className="flex-1">{String(value)}</span>
                  <span className="text-muted-foreground tabular-nums">{count}</span>
                </label>
              </li>
            ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

const inFacet = <TData,>(row: Row<TData>, id: string, value: string[]) => value.includes(String(row.getValue(id)));

export function DataTable<TData>({ columns, data, facets = [], pageSize = 10, bulkActions, labels = {}, className }: DataTableProps<TData>) {
  const l = { ...LABELS, ...labels };
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [visibility, setVisibility] = React.useState<VisibilityState>({});
  const [selection, setSelection] = React.useState({});
  const [search, setSearch] = React.useState("");
  const [density, setDensity] = React.useState<"compact" | "comfortable">("compact");

  const facetIds = new Set(facets.map((f) => f.column));
  const table = useReactTable({
    data,
    columns: columns.map((c) => (c.id && facetIds.has(c.id)) || ("accessorKey" in c && facetIds.has(String(c.accessorKey))) ? { ...c, filterFn: inFacet } : c),
    state: { sorting, columnFilters: filters, columnVisibility: visibility, rowSelection: selection, globalFilter: search },
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilters,
    onColumnVisibilityChange: setVisibility,
    onRowSelectionChange: setSelection,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });
  const selected = table.getFilteredSelectedRowModel().rows.map((r) => r.original);
  const pages = Math.max(table.getPageCount(), 1);

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-[var(--space-gap-default)]", className)}>
      <div className="flex flex-wrap items-center gap-[var(--space-gap-default)]">
        <Input
          aria-label={l.search}
          placeholder={l.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56"
        />
        {facets.map((f) => (
          <FacetFilter key={f.column} facet={f} table={table} />
        ))}
        {selected.length > 0 && bulkActions && (
          <div className="flex items-center gap-[var(--space-gap-default)]">
            <span className="text-muted-foreground tabular-nums">{l.selected(selected.length)}</span>
            {bulkActions(selected)}
          </div>
        )}
        <div className="ml-auto flex items-center gap-[var(--space-gap-default)]">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            aria-label={l.density}
            value={density}
            onValueChange={(v) => v && setDensity(v as "compact" | "comfortable")}
          >
            <ToggleGroupItem value="compact">{l.compact}</ToggleGroupItem>
            <ToggleGroupItem value="comfortable">{l.comfortable}</ToggleGroupItem>
          </ToggleGroup>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="compact">
                <Columns3 /> {l.columns}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 p-2">
              <ul className="flex flex-col">
                {table
                  .getAllLeafColumns()
                  .filter((c) => c.getCanHide())
                  .map((c) => (
                    <li key={c.id}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-accent">
                        <Checkbox checked={c.getIsVisible()} onCheckedChange={(v) => c.toggleVisibility(!!v)} />
                        {c.columnDef.meta?.label ?? c.id}
                      </label>
                    </li>
                  ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="max-h-[32rem] overflow-auto rounded-[var(--card-radius)] border border-[var(--table-row-border)]">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((h) => (
                  <TableHead key={h.id} className={cn(h.column.columnDef.meta?.numeric && "text-right")}>
                    {h.isPlaceholder ? null : h.column.getCanSort() ? (
                      <DataTableSortHeader
                        label={h.column.columnDef.meta?.label ?? String(h.column.columnDef.header ?? h.id)}
                        sorted={h.column.getIsSorted()}
                        onSort={h.column.getToggleSortingHandler() as () => void}
                      />
                    ) : (
                      flexRender(h.column.columnDef.header, h.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={density === "comfortable" ? "h-[calc(var(--table-row-height)*1.5)]" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} numeric={cell.column.columnDef.meta?.numeric}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="text-center text-muted-foreground">
                  {l.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-[var(--space-gap-default)]">
        <span className="text-muted-foreground tabular-nums">{l.page(table.getState().pagination.pageIndex + 1, pages)}</span>
        <Button variant="secondary" size="compact" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {l.previous}
        </Button>
        <Button variant="secondary" size="compact" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {l.next}
        </Button>
      </div>
    </div>
  );
}
