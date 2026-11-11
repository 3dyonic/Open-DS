/**
 * Icon. One Lucide icon at the scheme's icon size and stroke (OD-285). Use it in content and new UI:
 * an icon beside its word, an icon button (give it a label), the large size, and the contained looks.
 * The shadcn components draw their own Lucide icons directly; both follow the same tokens, and
 * ui/src/icons.css sets the stroke on every Lucide icon.
 *
 * Decorative by default: hidden from screen readers, so the word beside it carries the meaning. With
 * a label it is announced, for an icon with no word on screen. Reads only component keys: --icon-*.
 */
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

export const iconVariants = cva("inline-flex shrink-0 items-center justify-center align-middle", {
  variants: {
    size: {
      default: "[&>svg]:size-[var(--icon-size)]",
      large: "[&>svg]:size-[var(--icon-size-large)]",
    },
    variant: {
      plain: "",
      "contained-tint":
        "rounded-[var(--icon-contained-radius)] p-[var(--icon-contained-padding)] bg-[var(--icon-contained-tint-background)] text-[var(--icon-contained-tint-color)]",
      "contained-solid":
        "rounded-[var(--icon-contained-radius)] p-[var(--icon-contained-padding)] bg-[var(--icon-contained-solid-background)] text-[var(--icon-contained-solid-color)]",
    },
  },
  defaultVariants: { size: "default", variant: "plain" },
});

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof iconVariants> {
  /** The Lucide icon to draw, such as Search from lucide-react. */
  icon: LucideIcon;
  /** The accessible name. Give it when no word on screen says what the icon means. */
  label?: string;
}

export function Icon({ icon: Glyph, label, size, variant, className, ...props }: IconProps) {
  return (
    <span
      data-slot="icon"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(iconVariants({ size, variant }), className)}
      {...props}
    >
      <Glyph aria-hidden="true" />
    </span>
  );
}
