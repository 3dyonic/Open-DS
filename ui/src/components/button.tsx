/**
 * Button. Triggers an action.
 *
 * Variants: primary (the one action that completes the task), secondary (alternatives,
 * cancel, tools), ghost (quiet actions, actions inside rows and text). Sizes: default, compact,
 * icon, large. What each one is for is the grammar's reference (catalogue item button); whether
 * and how a design system uses it is that scheme's decision (inventory button.variants, OD-185).
 *
 * Disabled stays focusable and announced (aria-disabled), so keyboard and screen-reader users can
 * still reach it and hear why; the click is blocked instead of dropping it from the tab order.
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
    "disabled:pointer-events-none disabled:bg-[var(--button-disabled-background)] disabled:text-[var(--button-disabled-label)] disabled:border-[var(--button-disabled-border)]",
    "aria-disabled:cursor-not-allowed aria-disabled:bg-[var(--button-disabled-background)] aria-disabled:text-[var(--button-disabled-label)] aria-disabled:border-[var(--button-disabled-border)] aria-disabled:hover:bg-[var(--button-disabled-background)]",
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
        large: "h-[var(--size-control-large)]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Render the child element (for example a link) with button styles. */
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, disabled, onClick, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      aria-disabled={disabled || undefined}
      onClick={
        disabled
          ? (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : onClick
      }
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
