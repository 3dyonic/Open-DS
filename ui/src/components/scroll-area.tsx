/**
 * Scroll area. A region with styled scrollbars.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("group/scroll-area relative", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[length:var(--scroll-area-viewport-focus)] focus-visible:ring-[color:var(--scroll-area-viewport-focus-ring-focus)] focus-visible:ring-offset-[length:var(--scroll-area-viewport-focus-offset)] focus-visible:ring-offset-[color:var(--scroll-area-viewport-focus-ring-offset-focus)]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l-[length:var(--scroll-area-scrollbar-border-width)] border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t-[length:var(--scroll-area-scrollbar-border-width)] border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-[var(--scroll-area-thumb-radius)] bg-[color:var(--scroll-area-thumb-background)] transition-colors duration-[var(--transition-duration)] ease-[var(--transition-easing)] hover:bg-[color:var(--scroll-area-thumb-background-hover)] group-has-[[data-slot=scroll-area-viewport]:focus-visible]/scroll-area:bg-[color:var(--scroll-area-thumb-background-focus)]"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
