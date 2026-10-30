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
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-[var(--radius-badge)] bg-[var(--tooltip-background)] text-[var(--tooltip-label)] px-[var(--space-gap-default)] py-1",
          "text-[length:var(--type-caption-font-size)] [font-family:var(--type-caption-font-family)]",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
