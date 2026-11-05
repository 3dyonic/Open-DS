/**
 * Switch. Turns a setting on or off with an immediate effect.
 *
 * Reads only component keys: --switch-*, --transition-*.
 */
import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[calc(var(--switch-height)*1.25)] w-[calc(var(--switch-width)*2.25)] shrink-0 items-center rounded-[var(--switch-radius)] p-[var(--switch-padding)]",
        "bg-[var(--switch-track-background)] data-[state=checked]:bg-[var(--switch-track-background-checked)]",
        "transition-colors duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
        "outline-none focus-visible:ring-[length:var(--switch-focus)] focus-visible:ring-[color:var(--switch-focus-ring)] disabled:opacity-[var(--switch-disabled)] focus-visible:ring-offset-[length:var(--switch-focus-offset)] focus-visible:ring-offset-[color:var(--switch-focus-ring-offset)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "block size-[var(--switch-thumb-size)] rounded-[var(--switch-thumb-radius)] bg-[var(--switch-thumb-background)]",
          "transition-transform duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
          "data-[state=checked]:translate-x-[calc(var(--switch-thumb-travel)*1)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
