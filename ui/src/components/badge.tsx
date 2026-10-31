/**
 * Badge. A short status such as Paid, Late or Failed. Always put a word inside; color alone is
 * not enough (situation status-label in every scheme).
 *
 * Tones: neutral, info, success, warning, danger. Pick the status that matches the real risk: info,
 * then warning, then danger (the urgency order in the grammar). Never go up a level to get attention. Reads only component keys: --badge-*.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils";

export const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 whitespace-nowrap rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-0.5",
    "text-[length:var(--badge-font-size)] [font-weight:var(--type-label-font-weight)] [font-family:var(--type-caption-font-family)]",
    "[&_svg]:size-[1em]",
  ],
  {
    variants: {
      tone: {
        neutral: "bg-[var(--badge-neutral-background)] text-[var(--badge-neutral-label)]",
        info: "bg-[var(--badge-info-background)] text-[var(--badge-info-label)]",
        success: "bg-[var(--badge-success-background)] text-[var(--badge-success-label)]",
        warning: "bg-[var(--badge-warning-background)] text-[var(--badge-warning-label)]",
        danger: "bg-[var(--badge-danger-background)] text-[var(--badge-danger-label)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props} />;
}
