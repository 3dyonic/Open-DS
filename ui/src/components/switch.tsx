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
        "peer inline-flex h-[calc(var(--switch-height)*1.25)] w-[calc(var(--switch-width)*2.25)] shrink-0 items-center rounded-[var(--switch-radius)] p-0.5",
        "bg-[var(--control-track)] data-[state=checked]:bg-[var(--control-checked)]",
        "transition-colors duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
        "outline-none focus-visible:ring-[length:var(--switch-focus)] focus-visible:ring-[color:var(--button-focus-ring)] disabled:opacity-[var(--switch-disabled)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--switch-canvas)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-[var(--switch-size)] rounded-[var(--switch-radius)] bg-[var(--control-thumb)]",
          "transition-transform duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
          "data-[state=checked]:translate-x-[calc(var(--switch-icon)*1)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
