/**
 * Button. Triggers an action.
 *
 * Variants: primary (the one action that completes the task), secondary (alternatives,
 * cancel, tools), ghost (quiet actions, actions inside rows and text). Sizes: default, compact.
 * When to use each variant is a scheme decision: read `usage` in schemes/<scheme>.json
 * (situations commit-action, alternative-action, destructive-action, row-action).
 *
 * Reads only component keys: --button-*, --transition-*.
 */
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "h-[var(--button-height)] px-[var(--button-padding-x)] rounded-[var(--button-radius)]",
    "text-[length:var(--button-font-size)] [font-weight:var(--button-font-weight)] [font-family:var(--type-label-font-family)]",
    "transition-colors duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
    "outline-none focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-[color:var(--button-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-canvas)]",
    "disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]",
    "[&_svg]:size-[var(--button-icon-size)] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--button-primary-background)] text-[var(--button-primary-label)] hover:bg-[var(--button-primary-background-hover)]",
        secondary:
          "bg-[var(--button-secondary-background)] text-[var(--button-secondary-label)] border-[length:var(--border-width-default)] border-[var(--button-secondary-border)] hover:bg-[var(--button-secondary-background-hover)]",
        ghost: "bg-transparent text-[var(--button-ghost-label)] hover:bg-[var(--button-ghost-background-hover)]",
      },
      size: {
        default: "",
        compact: "h-[var(--size-control-compact)] px-[var(--space-inset-cell-x)]",
        icon: "w-[var(--button-height)] px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render the child element (for example a link) with button styles. */
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
