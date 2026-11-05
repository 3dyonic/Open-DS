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
        // The edge sits on the list's line: the trigger reaches down by the line's own width.
        "-mb-[var(--tabs-list-border-width)] inline-flex h-[var(--tabs-trigger-height)] items-center px-[var(--tabs-trigger-padding-x)] border-b-[length:var(--tabs-trigger-edge-width)] border-transparent text-[var(--tabs-trigger-label)]",
        "[font-family:var(--tabs-trigger-font-family)] text-[length:var(--tabs-trigger-font-size)] [font-weight:var(--tabs-trigger-font-weight)]",
        // The current tab: the selected fill and an edge, so it is never shown by color alone.
        "data-[state=active]:bg-[var(--tabs-trigger-background-current)] data-[state=active]:border-[var(--tabs-trigger-edge-current)]",
        "outline-none focus-visible:ring-[length:var(--tabs-trigger-focus-width)] focus-visible:ring-[color:var(--tabs-trigger-focus-ring)] focus-visible:ring-offset-[length:var(--tabs-trigger-focus-offset)] focus-visible:ring-offset-[color:var(--tabs-trigger-focus-ring-offset)]",
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
