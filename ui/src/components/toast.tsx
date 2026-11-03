/**
 * Toast. A short confirmation that something happened ("12 orders exported."). It stays long
 * enough to read; write it in the scheme's voice (the success-words usage rule).
 *
 * Call toast("12 alerts exported."), toast.success(...) or toast.danger(...) anywhere, and render
 * <Toaster /> once. The behaviour, stacking, timing, dismissing and announcing politely without taking
 * focus, comes from shadcn/ui's Sonner (MIT); the look is this scheme's (OD-219).
 *
 * Tones: neutral, success, danger. Reads only component keys: --overlay-*.
 */
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Toaster as Sonner, type ToasterProps, toast as sonner } from "sonner";
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
  /** Announce it itself. Off inside the Toaster, which announces for it. */
  live?: boolean;
}

/** One toast's look. toast() shows it; render it directly only to show the look. */
export function Toast({ className, tone, title, description, live = true, children, ...props }: ToastProps) {
  return (
    <div
      role={live ? "status" : undefined}
      aria-live={live ? "polite" : undefined}
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

/** Where toasts appear. Render it once, near the root of the app. */
export function Toaster(props: ToasterProps) {
  return <Sonner {...props} />;
}

type ToastOptions = { description?: string; duration?: number; id?: string | number };
type Tone = NonNullable<VariantProps<typeof toastVariants>["tone"]>;
const show = (tone: Tone, title: string, o: ToastOptions = {}) =>
  sonner.custom(() => <Toast tone={tone} title={title} description={o.description} live={false} />, {
    duration: o.duration,
    id: o.id,
  });

/** Show a toast in the scheme's look: toast("Saved."), toast.success(...), toast.danger(...). */
export const toast = Object.assign((title: string, o?: ToastOptions) => show("neutral", title, o), {
  success: (title: string, o?: ToastOptions) => show("success", title, o),
  danger: (title: string, o?: ToastOptions) => show("danger", title, o),
  dismiss: sonner.dismiss,
});
