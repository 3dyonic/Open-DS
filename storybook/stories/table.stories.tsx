import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@open-ds/ui";
import { MoreHorizontal } from "lucide-react";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: {
    openDs: { component: "table", situations: ["number-in-table", "table-row", "selected-row", "row-action"] },
  },
  title: "Components/Table",
  component: Table,
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Show component="table">
      {(s) => (
        <Table {...args} aria-label={s.table!.caption}>
          <TableHeader>
            <TableRow>
              {s.table!.columns.map((c) => (
                <TableHead key={c.label}>{c.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {s.table!.rows[0].cells.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
              <TableCell>{s.table!.rows[0].status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Show>
  ),
};

export const Examples: Story = {
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
                {t.rows.slice(0, 8).map((r, i) => (
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
          </div>
        );
      }}
    </Show>
  ),
};
