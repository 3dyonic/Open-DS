/**
 * Message scroller. A scrolling list of messages that keeps the newest in view, for a live
 * conversation where new messages arrive at the bottom. Not for a static list (a scroll area).
 *
 * Made by Open DS (MIT). Reads the shadcn variables, which theme.css maps onto the scheme's
 * semantic tokens. It is a log: new messages are announced politely and never move focus. Give it
 * a name with aria-label.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";

function MessageScroller({ className, children, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const count = React.Children.count(children);
  // Keep the newest message in view as messages arrive, unless the reader has scrolled up.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom || el.scrollTop === 0) el.scrollTop = el.scrollHeight;
  }, [count]);
  return (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      tabIndex={0}
      data-slot="message-scroller"
      className={cn(
        "flex max-h-80 flex-col gap-4 overflow-y-auto rounded-md outline-none focus-visible:ring-[length:var(--border-width-focus)] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { MessageScroller };
