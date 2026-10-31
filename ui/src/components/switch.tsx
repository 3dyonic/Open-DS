/**
 * Switch. Turns a setting on or off with an immediate effect.
 *
 * Reads only component keys: --control-*, --transition-*.
 */
import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[calc(var(--size-icon)*1.25)] w-[calc(var(--size-icon)*2.25)] shrink-0 items-center rounded-[var(--radius-round)] p-0.5",
        "bg-[var(--control-track)] data-[state=checked]:bg-[var(--control-checked)]",
        "transition-colors duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
        "outline-none focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-[color:var(--button-focus-ring)] disabled:opacity-[var(--opacity-disabled)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-[var(--size-icon)] rounded-[var(--radius-round)] bg-[var(--control-thumb)]",
          "transition-transform duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
          "data-[state=checked]:translate-x-[calc(var(--size-icon)*1)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
