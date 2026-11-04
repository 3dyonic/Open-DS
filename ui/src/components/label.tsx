/**
 * Label. Names a field. Keep it visible above the field; never use a placeholder instead.
 *
 * Reads the label text role: --type-label-*.
 */
import { Label as LabelPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "inline-flex items-center gap-[var(--label-gap)] text-[var(--label-label)] [font-family:var(--label-font-family)]",
        "text-[length:var(--label-font-size)] [font-weight:var(--label-font-weight)] leading-[var(--label-line-height)]",
        className,
      )}
      {...props}
    />
  );
}
