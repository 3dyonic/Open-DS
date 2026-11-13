/**
 * Switch. Turns a setting on or off with an immediate effect.
 *
 * The track is the thumb plus the padding on each side, and twice as wide as it is tall: the thumb
 * slides one track height (OD-300).
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
        "peer relative after:absolute after:top-1/2 after:left-1/2 after:h-[max(100%,var(--switch-hit-area))] after:w-[max(100%,var(--switch-hit-area))] after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] inline-flex [--switch-track-height:calc(var(--switch-thumb-size)+2*var(--switch-padding))] h-[var(--switch-track-height)] w-[calc(2*var(--switch-track-height))] shrink-0 items-center rounded-[var(--switch-radius)] p-[var(--switch-padding)]",
        "bg-[var(--switch-track-background)] data-[state=checked]:bg-[var(--switch-track-background-checked)]",
        "transition-colors duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
        "outline-none focus-visible:ring-[length:var(--switch-focus)] focus-visible:ring-[color:var(--switch-focus-ring)] disabled:bg-[var(--switch-disabled-track)] disabled:data-[state=checked]:bg-[var(--switch-disabled-track)] focus-visible:ring-offset-[length:var(--switch-focus-offset)] focus-visible:ring-offset-[color:var(--switch-focus-ring-offset)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "block size-[var(--switch-thumb-size)] rounded-[var(--switch-thumb-radius)] bg-[var(--switch-thumb-background)]",
          "transition-transform duration-[var(--transition-duration)] ease-[var(--transition-easing)]",
          "data-[state=checked]:translate-x-[var(--switch-track-height)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
