/**
 * Switch. Turns a setting on or off with an immediate effect.
 *
 * The track is the thumb plus its offset on each side, and twice as wide as it is tall: the thumb
 * slides one track height.
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
        "peer relative after:absolute after:top-1/2 after:left-1/2 after:h-[max(100%,var(--switch-hit-area))] after:w-[max(100%,var(--switch-hit-area))] after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] inline-flex h-[calc(var(--switch-thumb-size)+2*var(--switch-thumb-offset))] w-[calc(2*(var(--switch-thumb-size)+2*var(--switch-thumb-offset)))] shrink-0 items-center rounded-[var(--switch-radius)] p-[var(--switch-thumb-offset)]",
        "bg-[var(--switch-track-background)] data-[state=checked]:bg-[var(--switch-track-background-checked)]",
        "transition-colors duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
        "outline-none focus-visible:ring-[length:var(--switch-focus)] focus-visible:ring-[color:var(--switch-focus-ring)] disabled:bg-[var(--switch-disabled-track)] disabled:data-[state=checked]:bg-[var(--switch-disabled-track)] focus-visible:ring-offset-[length:var(--switch-focus-offset)] focus-visible:ring-offset-[color:var(--switch-focus-ring-offset-color)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "block size-[var(--switch-thumb-size)] rounded-[var(--switch-thumb-radius)] bg-[var(--switch-thumb-background)]",
          "transition-transform duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
          "data-[state=checked]:translate-x-[calc(var(--switch-thumb-size)+2*var(--switch-thumb-offset))] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
