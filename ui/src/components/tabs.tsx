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
        "inline-flex items-center gap-[var(--tabs-list-gap)] border-b-[length:var(--tabs-list-border-width)] border-[var(--tabs-list-border)]",
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
        "-mb-px inline-flex h-[var(--tabs-trigger-height)] items-center border-b-2 border-transparent text-[var(--tabs-label)]",
        "[font-family:var(--tabs-trigger-font-family)] text-[length:var(--tabs-trigger-font-size)] [font-weight:var(--tabs-trigger-font-weight)]",
        "data-[state=active]:border-[var(--tabs-indicator)] data-[state=active]:text-[var(--tabs-label-active)]",
        "outline-none focus-visible:ring-[length:var(--tabs-focus)] focus-visible:ring-[color:var(--button-focus-ring)] focus-visible:ring-offset-[length:var(--tabs-trigger-focus-offset)] focus-visible:ring-offset-[color:var(--tabs-canvas)]",
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
      className={cn("pt-[var(--tabs-content-padding-top)] outline-none", className)}
      {...props}
    />
  );
}
