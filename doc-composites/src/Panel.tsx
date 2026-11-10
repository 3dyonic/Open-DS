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
  // A link target, such as part-1-2 on an Anatomy reference.
  id?: string;
  title?: string;
  // A short word beside the title, such as the variant's axis.
  note?: string;
  label?: string;
  tone?: LabelProps["tone"];
  // The first block is a drawing, set beside the words as on RC1 (OD-286); on a phone it stacks above
  // them. side: a narrow column, a part's card. wide: half the panel, the whole component's drawing,
  // never wider than its own pixels.
  media?: "side" | "wide";
  children?: React.ReactNode;
};

export default function Panel({
  id,
  title,
  note,
  label,
  tone,
  media,
  children,
}: PanelProps) {
  const [first, ...rest] = React.Children.toArray(children);
  return (
    <div id={id} data-composite="panel" className="grid">
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
        <CardContent>
          {media ? (
            <div className="flex flex-col gap-[var(--space-gap-group)] md:flex-row md:items-start">
              <div
                className={`shrink-0 [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[var(--radius-option)] [&_p]:m-0 ${media === "side" ? "md:w-72 [&_img]:w-full" : "md:w-1/2 [&_img]:w-auto"}`}
              >
                {first}
              </div>
              <div className="min-w-0 flex-1">{rest}</div>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </div>
  );
}
