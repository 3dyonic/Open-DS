/**
 * Marker. A divider or status line inside a conversation, such as a day or someone joining. Not
 * for a message someone wrote.
 *
 * Made by Open DS (MIT). Reads the shadcn variables, which theme.css maps onto the scheme's
 * semantic tokens. The lines are decoration; the words are read.
 */
import * as React from "react";
import { cn } from "../lib/utils";

function Marker({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="marker"
      className={cn(
        "flex items-center gap-[var(--marker-gap)] text-[length:var(--marker-font-size)]/[var(--marker-line-height)] text-[color:var(--marker-label)]",
        className,
      )}
      {...props}
    >
      <span aria-hidden data-slot="marker-line" className="h-[var(--marker-line-thickness)] flex-1 bg-[color:var(--marker-line-background)]" />
      <span data-slot="marker-label">{children}</span>
      <span aria-hidden data-slot="marker-line" className="h-[var(--marker-line-thickness)] flex-1 bg-[color:var(--marker-line-background)]" />
    </div>
  );
}

export { Marker };
