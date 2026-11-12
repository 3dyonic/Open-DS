/**
 * Checkbox. Turns one option on or off inside a form.
 *
 * Reads only component keys: --checkbox-*.
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
        "peer relative after:absolute after:top-1/2 after:left-1/2 after:h-[max(100%,var(--checkbox-hit-area))] after:w-[max(100%,var(--checkbox-hit-area))] after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] size-[var(--checkbox-size)] shrink-0 rounded-[var(--checkbox-radius)] bg-[var(--checkbox-background)]",
        // Checked, the fill is the box: its edge steps aside (transparent shows the fill under it).
        "border-[length:var(--checkbox-border-width)] border-[var(--checkbox-border)] data-[state=checked]:border-transparent",
        "data-[state=checked]:bg-[var(--checkbox-background-checked)]",
        "outline-none focus-visible:ring-[length:var(--checkbox-focus)] focus-visible:ring-[color:var(--checkbox-focus-ring)] disabled:bg-[var(--checkbox-disabled-background)] disabled:border-[var(--checkbox-disabled-border)] disabled:data-[state=checked]:bg-[var(--checkbox-disabled-background)] disabled:data-[state=checked]:border-[var(--checkbox-disabled-border)] focus-visible:ring-offset-[length:var(--checkbox-focus-offset)] focus-visible:ring-offset-[color:var(--checkbox-focus-ring-offset)]",
        className,
      )}
      {...props}
    >
      {/* The indicator is there only while the box is checked, so its color needs no state. */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-[var(--checkbox-indicator-icon)] data-[disabled]:text-[var(--checkbox-disabled-indicator)]"
      >
        <Check className="size-[calc(var(--checkbox-size)*0.8)]" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
