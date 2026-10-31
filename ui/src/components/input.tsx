/**
 * Input. Single-line text entry. Pair it with a Label that stays visible.
 *
 * Reads only component keys: --input-*.
 */
import * as React from "react";
import { cn } from "../lib/utils";

export function Input({ className, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 h-[var(--input-height)] px-[var(--input-padding-x)] rounded-[var(--input-radius)]",
        "bg-[var(--input-background)] text-[var(--input-text)] text-[length:var(--input-font-size)] [font-family:var(--type-body-font-family)]",
        "border-[length:var(--border-width-default)] border-[var(--input-border)] placeholder:text-[var(--input-placeholder)]",
        "outline-none focus-visible:border-[var(--input-border-focus)] focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-[color:var(--input-border-focus)]",
        "aria-invalid:border-[var(--color-status-danger)] disabled:bg-[var(--input-disabled-background)] disabled:border-[var(--input-disabled-border)] disabled:text-[var(--input-disabled-text)]",
        className,
      )}
      {...props}
    />
  );
}
