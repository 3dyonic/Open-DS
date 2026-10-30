import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@open-ds/ui";
import { MoreHorizontal } from "lucide-react";
import { Usage } from "../src/usage";

const rows = [
  { id: "1042", customer: "North depot", total: "1,240.00", status: ["warning", "Late"] },
  { id: "1043", customer: "East depot", total: "860.50", status: ["success", "Paid"] },
  { id: "1044", customer: "City shop", total: "3,015.75", status: ["danger", "Failed"] },
] as const;

const meta = { title: "Components/Table", component: Table } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Orders: Story = {
  render: () => (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={r.id} data-state={i === 1 ? "selected" : undefined}>
              <TableCell className="[font-family:var(--type-data-font-family)]">#{r.id}</TableCell>
              <TableCell>{r.customer}</TableCell>
              <TableCell numeric>{r.total}</TableCell>
              <TableCell>
                <Badge tone={r.status[0]}>{r.status[1]}</Badge>
              </TableCell>
              <TableCell className="w-0">
                <Button variant="ghost" size="icon" aria-label={`Actions for order ${r.id}`}>
                  <MoreHorizontal />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Usage situations={["number-in-table", "table-row", "selected-row", "row-action"]} />
    </div>
  ),
};
