/**
 * Toast. A short confirmation that something happened ("12 orders exported."). It stays long
 * enough to read; write it in the scheme's voice (voice.tone.success).
 *
 * Tones: neutral, success, danger. Reads only component keys: --overlay-*.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils";

export const toastVariants = cva(
  [
    "pointer-events-auto flex w-full max-w-sm items-start gap-[var(--space-gap-default)] p-[var(--space-inset-container)]",
    "rounded-[var(--overlay-radius)] bg-[var(--overlay-background)] text-[var(--color-text-primary)] [box-shadow:var(--overlay-shadow)]",
    "border-[length:var(--border-width-default)] border-l-4",
  ],
  {
    variants: {
      tone: {
        neutral: "border-[var(--color-border-default)]",
        success: "border-[var(--color-border-default)] border-l-[var(--color-status-success)]",
        danger: "border-[var(--color-border-default)] border-l-[var(--color-status-danger)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
}

export function Toast({ className, tone, title, description, children, ...props }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-slot="toast"
      className={cn(toastVariants({ tone }), className)}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-1">
        <p className="[font-weight:var(--type-label-font-weight)] text-[length:var(--type-body-font-size)]">{title}</p>
        {description ? (
          <p className="text-[var(--color-text-secondary)] text-[length:var(--type-caption-font-size)]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
