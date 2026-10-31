import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, DataTable, dataTableSelectColumn } from "@open-ds/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { Show, toneOf } from "../src/samples";
import type { Samples } from "../src/samples";

const meta = {
  parameters: {
    openDs: { component: "data-table", situations: ["number-in-table", "table-row", "selected-row", "row-action"] },
  },
  title: "Components/Data table",
  component: DataTable,
  args: { columns: [], data: [] },
} satisfies Meta<typeof DataTable>;
export default meta;
type Story = StoryObj<typeof meta>;

type Row = Record<string, string>;

// The scheme's own rows: its table columns, then the status column, all sortable; status and the
// second column are filters.
function tableOf(s: Samples) {
  const t = s.table!;
  const keys = t.columns.map((c) => c.label);
  const data: Row[] = t.rows.map((r) => ({
    ...Object.fromEntries(keys.slice(0, -1).map((k, i) => [k, r.cells[i]])),
    [keys.at(-1)!]: r.status,
  }));
  const status = keys.at(-1)!;
  const columns: ColumnDef<Row, unknown>[] = [
    dataTableSelectColumn<Row>(),
    ...keys.map((k, i) => ({
      accessorKey: k,
      header: k,
      meta: { label: k, numeric: t.columns[i].numeric },
      cell: ({ getValue }: { getValue: () => unknown }) =>
        k === status ? <Badge tone={toneOf(s, String(getValue()))}>{String(getValue())}</Badge> : String(getValue()),
    })),
  ];
  return {
    data,
    columns,
    facets: [
      { column: status, title: status },
      { column: keys[1], title: keys[1] },
    ],
  };
}

export const Playground: Story = {
  render: (args) => (
    <Show component="data-table">
      {(s) => {
        const t = tableOf(s);
        return <DataTable {...args} columns={t.columns} data={t.data} facets={t.facets} pageSize={5} />;
      }}
    </Show>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="data-table">
      {(s) => {
        const t = tableOf(s);
        return (
          <div className="flex flex-col gap-[var(--space-gap-default)]">
            <p className="[font-weight:var(--type-heading-font-weight)]">{s.table!.caption}</p>
            <DataTable
              columns={t.columns}
              data={t.data}
              facets={t.facets}
              pageSize={8}
              labels={{ search: s.icon_action ?? "Search" }}
              bulkActions={() => (
                <>
                  <Button variant="secondary" size="compact">
                    {s.actions.secondary}
                  </Button>
                  {s.confirm && (
                    <Button variant="ghost" size="compact">
                      {s.confirm.confirm}
                    </Button>
                  )}
                </>
              )}
            />
          </div>
        );
      }}
    </Show>
  ),
};
