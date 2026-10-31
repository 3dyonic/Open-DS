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
        "inline-flex items-center gap-2 text-[var(--color-text-primary)] [font-family:var(--type-label-font-family)]",
        "text-[length:var(--type-label-font-size)] [font-weight:var(--type-label-font-weight)] leading-[var(--type-label-line-height)]",
        className,
      )}
      {...props}
    />
  );
}
