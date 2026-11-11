/**
 * Label: a short state on a docs page, such as "In Accessible first" or "Left out". It is the
 * scheme's Badge, used through its tone prop only, so each scheme draws it in its own tokens.
 *
 * In a page: :label[In Accessible first]{tone="info"}
 */
import * as React from "react";
import { Badge, type BadgeProps } from "@open-ds/ui/components/badge";

export type LabelProps = {
  tone?: BadgeProps["tone"];
  children: React.ReactNode;
};

export default function Label({ tone = "neutral", children }: LabelProps) {
  return (
    <Badge tone={tone} data-composite="label">
      {children}
    </Badge>
  );
}
