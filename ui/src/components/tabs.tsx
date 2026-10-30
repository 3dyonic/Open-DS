/**
 * Tabs. Switches between views of the same thing.
 *
 * Reads only component keys: --tabs-*.
 */
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center gap-[var(--space-gap-group)] border-b-[length:var(--border-width-default)] border-[var(--color-border-default)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "-mb-px inline-flex h-[var(--size-control-default)] items-center border-b-2 border-transparent text-[var(--tabs-label)]",
        "[font-family:var(--type-label-font-family)] text-[length:var(--type-label-font-size)] [font-weight:var(--type-label-font-weight)]",
        "data-[state=active]:border-[var(--tabs-indicator)] data-[state=active]:text-[var(--tabs-label-active)]",
        "outline-none focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-[color:var(--button-focus-ring)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("pt-[var(--space-gap-default)] outline-none", className)}
      {...props}
    />
  );
}
