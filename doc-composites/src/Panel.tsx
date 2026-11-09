/**
 * Panel: a card around the page's own Markdown, such as one variant or one rule. Built from the
 * scheme's Card and Badge (through Label), used through their props only. The words stay in the page:
 *
 *   :::panel{title="primary" note="variant" label="Used in Accessible first" tone="success"}
 *   **What it is for.** …
 *   :::
 */
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@open-ds/ui/components/card";
import Label, { type LabelProps } from "./Label";

export type PanelProps = {
  title?: string;
  // A short word beside the title, such as the variant's axis.
  note?: string;
  label?: string;
  tone?: LabelProps["tone"];
  children?: React.ReactNode;
};

export default function Panel({
  title,
  note,
  label,
  tone,
  children,
}: PanelProps) {
  return (
    <div data-composite="panel" className="grid">
      <Card>
        {(title || label) && (
          <CardHeader>
            <div className="flex flex-wrap items-center gap-[var(--space-gap-tight)]">
              {title && <CardTitle>{title}</CardTitle>}
              {note && <CardDescription>{note}</CardDescription>}
              {label && <Label tone={tone}>{label}</Label>}
            </div>
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
