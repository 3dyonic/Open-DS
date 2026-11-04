/**
 * Toggle. A button that stays pressed or not.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Toggle as TogglePrimitive } from "radix-ui";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-[var(--toggle-gap)] rounded-[var(--toggle-radius)] text-[length:var(--toggle-font-size)]/[var(--toggle-line-height)] [font-weight:var(--toggle-font-weight)] whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-[color:var(--toggle-background-hover)] hover:text-[color:var(--toggle-label-hover)] focus-visible:border-[color:var(--toggle-border-focus)] disabled:pointer-events-none disabled:opacity-[var(--toggle-disabled-opacity-disabled)] aria-invalid:border-[color:var(--toggle-border-invalid)] aria-invalid:ring-[color:var(--toggle-focus-ring-invalid)]/20 data-[state=on]:bg-[color:var(--toggle-background-on)] data-[state=on]:text-[color:var(--toggle-label-on)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--toggle-icon-size)] focus-visible:ring-[length:var(--toggle-focus)] focus-visible:ring-[color:var(--toggle-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--toggle-focus-ring-offset-focus)]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-[color:var(--toggle-outline-border)] bg-transparent shadow-[var(--toggle-outline-shadow)] hover:bg-[color:var(--toggle-outline-background-hover)] hover:text-[color:var(--toggle-outline-label-hover)]",
      },
      size: {
        default: "h-9 min-w-9 px-[var(--toggle-default-padding-x)]",
        sm: "h-[var(--toggle-sm-height)] min-w-8 px-[var(--toggle-sm-padding-x)]",
        lg: "h-10 min-w-10 px-[var(--toggle-lg-padding-x)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size, className }))} {...props} />
  );
}

export { Toggle, toggleVariants };
