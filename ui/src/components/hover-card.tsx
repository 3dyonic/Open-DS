/**
 * Hover card. A preview of a link or a person, shown while the pointer rests on it. Never the only
 * way to reach what it shows: the trigger opens it on focus too, and the link still works.
 *
 * From shadcn/ui (new-york-v4, MIT). Reads the shadcn variables, which theme.css maps onto the
 * scheme's semantic tokens, and the radius and shadow that shadcn.css maps onto the scheme's
 * tokens. Dark mode comes from the tokens, so no dark: classes.
 */
"use client";

import { HoverCard as HoverCardPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 0, // the gap is overlay/offset, a margin on the side it opens to (OD-243)
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "data-[side=bottom]:mt-[var(--overlay-offset)] data-[side=top]:mb-[var(--overlay-offset)] data-[side=left]:mr-[var(--overlay-offset)] data-[side=right]:ml-[var(--overlay-offset)] z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-[var(--hover-card-content-radius)] border-[length:var(--hover-card-content-border-width)] border-[color:var(--hover-card-content-border)] bg-[color:var(--hover-card-content-background)] p-[var(--hover-card-content-padding)] text-[color:var(--hover-card-content-label)] shadow-[var(--hover-card-content-shadow)] outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-[var(--hover-card-content-duration)] data-[state=open]:ease-[var(--transition-enter-easing)] data-[state=closed]:ease-[var(--transition-exit-easing)] data-[state=closed]:duration-[var(--transition-exit-duration)]",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
