// Live components inside one scheme, brand and mode. The tokens do all the styling.
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Toast,
} from "@open-ds/ui";
import { Download, Plus } from "lucide-react";

export function SchemeFrame({
  scheme,
  brand,
  dark = false,
  children,
  className = "",
}: {
  scheme: string;
  brand?: string;
  dark?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-scheme={scheme}
      data-brand={brand}
      className={`${dark ? "dark " : ""}rounded-lg bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)] text-[length:var(--type-body-font-size)] ${className}`}
    >
      {children}
    </div>
  );
}

export function MiniSpecimen({
  scheme,
  brand,
  dark,
}: {
  scheme: string;
  brand?: string;
  dark?: boolean;
}) {
  return (
    <SchemeFrame scheme={scheme} brand={brand} dark={dark} className="p-5">
      <div className="flex flex-wrap items-center gap-[var(--space-gap-default)]">
        <Button>
          <Plus /> New
        </Button>
        <Button variant="secondary">Export</Button>
        <Badge tone="success">Paid</Badge>
        <Badge tone="warning">Late</Badge>
      </div>
      <p className="mt-[var(--space-gap-group)] [font-family:var(--type-heading-font-family)] text-[length:var(--type-heading-font-size)] [font-weight:var(--type-heading-font-weight)] leading-[var(--type-heading-line-height)]">
        Order 1042
      </p>
      <p className="text-[var(--color-text-secondary)]">Due in 3 days · 1,240.00</p>
    </SchemeFrame>
  );
}

export function FullSpecimen({
  scheme,
  brand,
  dark,
}: {
  scheme: string;
  brand?: string;
  dark?: boolean;
}) {
  return (
    <SchemeFrame
      scheme={scheme}
      brand={brand}
      dark={dark}
      className="grid gap-[var(--space-gap-group)] p-6"
    >
      <div className="flex flex-wrap items-center gap-[var(--space-gap-default)]">
        <Button>
          <Plus /> New order
        </Button>
        <Button variant="secondary">
          <Download /> Export
        </Button>
        <Button variant="ghost">Cancel</Button>
        <Badge tone="neutral">Draft</Badge>
        <Badge tone="success">Paid</Badge>
        <Badge tone="danger">Failed</Badge>
      </div>
      <div className="grid gap-[var(--space-gap-group)] md:grid-cols-2">
        <div className="grid gap-[var(--space-gap-tight)]">
          <Label htmlFor={`email-${scheme}-${brand}`}>Email address</Label>
          <Input id={`email-${scheme}-${brand}`} placeholder="name@example.com" />
          <Label className="mt-[var(--space-gap-default)]">
            <Switch defaultChecked aria-label="Email me when an order is late" /> Email me when an
            order is late
          </Label>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>North depot</CardTitle>
            <CardDescription>12 open orders</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#1042</TableCell>
            <TableCell>North depot</TableCell>
            <TableCell numeric>1,240.00</TableCell>
            <TableCell>
              <Badge tone="warning">Late</Badge>
            </TableCell>
          </TableRow>
          <TableRow data-state="selected">
            <TableCell>#1043</TableCell>
            <TableCell>East depot</TableCell>
            <TableCell numeric>860.50</TableCell>
            <TableCell>
              <Badge tone="success">Paid</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Toast tone="success" title="12 orders exported." />
    </SchemeFrame>
  );
}
