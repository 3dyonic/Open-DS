/**
 * Tooltip. A short hint for an icon-only control. Never the only place for important
 * information.
 *
 * Reads only component keys: --tooltip-*, --overlay-radius.
 */
import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 0, // the gap is overlay/offset, a margin on the side it opens to (OD-243)
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "data-[side=bottom]:mt-[var(--overlay-offset)] data-[side=top]:mb-[var(--overlay-offset)] data-[side=left]:mr-[var(--overlay-offset)] data-[side=right]:ml-[var(--overlay-offset)] z-50 rounded-[var(--tooltip-content-radius)] bg-[var(--tooltip-content-background)] text-[var(--tooltip-content-label)] px-[var(--tooltip-content-padding-x)] py-[var(--tooltip-content-padding-y)]",
          // It fades at the panel speed, like every floating panel; no slide or zoom distance is decided yet.
          "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-[var(--tooltip-content-duration)] data-[state=delayed-open]:ease-[var(--transition-enter-easing)] data-[state=instant-open]:ease-[var(--transition-enter-easing)] data-[state=closed]:ease-[var(--transition-exit-easing)] data-[state=closed]:duration-[var(--transition-exit-duration)]",
          "text-[length:var(--tooltip-content-font-size)] [font-family:var(--tooltip-content-font-family)]",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
