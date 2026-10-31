import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@open-ds/ui";
import { MoreHorizontal } from "lucide-react";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Table", component: Table } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Rows: Story = {
  render: () => (
    <Show component="table">
      {(s) => {
        const t = s.table!;
        return (
          <div>
            <p className="mb-[var(--space-gap-default)] [font-weight:var(--type-heading-font-weight)]">{t.caption}</p>
            <Table aria-label={t.caption}>
              <TableHeader>
                <TableRow>
                  {t.columns.map((c) => (
                    <TableHead key={c.label} className={c.numeric ? "text-right" : undefined}>
                      {c.label}
                    </TableHead>
                  ))}
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.rows.map((r, i) => (
                  <TableRow key={r.cells[0]} data-state={i === 1 ? "selected" : undefined}>
                    {r.cells.map((cell, j) =>
                      t.columns[j].numeric ? (
                        <TableCell key={j} numeric>
                          {cell}
                        </TableCell>
                      ) : (
                        <TableCell
                          key={j}
                          className={j === 0 ? "[font-family:var(--type-data-font-family)]" : undefined}
                        >
                          {cell}
                        </TableCell>
                      ),
                    )}
                    <TableCell>
                      <Badge tone={toneOf(s, r.status)}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="w-0">
                      <Button variant="ghost" size="icon" aria-label={`${s.menu?.trigger ?? "Actions"}: ${r.cells[0]}`}>
                        <MoreHorizontal />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Usage situations={["number-in-table", "table-row", "selected-row", "row-action"]} />
          </div>
        );
      }}
    </Show>
  ),
};
