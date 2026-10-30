/**
 * Checkbox. Turns one option on or off inside a form.
 *
 * Reads only component keys: --control-*.
 */
import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-[var(--size-icon)] shrink-0 rounded-[var(--control-radius)] bg-[var(--input-background)]",
        "border-[length:var(--border-width-default)] border-[var(--control-track)]",
        "data-[state=checked]:bg-[var(--control-checked)] data-[state=checked]:border-[var(--control-checked)] data-[state=checked]:text-[var(--control-thumb)]",
        "outline-none focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-[color:var(--button-focus-ring)] disabled:opacity-[var(--opacity-disabled)]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <Check className="size-[calc(var(--size-icon)*0.8)]" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
