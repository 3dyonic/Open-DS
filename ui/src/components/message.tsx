/**
 * Message. One message with its author and time, in a conversation, comments or an activity feed.
 * Not for status about the system (an alert or a toast).
 *
 * Made by Open DS (MIT). Reads the shadcn variables, which theme.css maps onto the scheme's
 * semantic tokens, and the text scale that shadcn.css maps onto the scheme's tokens.
 */
import * as React from "react";
import { cn } from "../lib/utils";

function Message({
  className,
  author,
  time,
  avatar,
  children,
  ...props
}: React.ComponentProps<"article"> & {
  /** Who wrote it. */
  author: React.ReactNode;
  /** When it was sent, as people read it. */
  time?: React.ReactNode;
  /** An avatar beside the author. */
  avatar?: React.ReactNode;
}) {
  return (
    <article
      data-slot="message"
      className={cn(
        "flex items-start gap-[var(--message-gap)] text-[length:var(--message-font-size)]/[var(--message-line-height)]",
        className,
      )}
      {...props}
    >
      {avatar}
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--message-gap-2)]">
        <header className="flex flex-wrap items-baseline gap-x-[var(--message-gap-x)]">
          <span data-slot="message-author" className="[font-weight:var(--message-author-font-weight)]">
            {author}
          </span>
          {time && (
            <time
              data-slot="message-time"
              className="text-[length:var(--message-time-font-size)]/[var(--message-time-line-height)] text-[color:var(--message-time-label)]"
            >
              {time}
            </time>
          )}
        </header>
        <div data-slot="message-body" className="leading-normal">
          {children}
        </div>
      </div>
    </article>
  );
}

export { Message };
