/**
 * Bubble. A chat message in a bubble that shows who sent it, for a back-and-forth between people
 * or with an assistant. Not for comments or long text (a message or a card).
 *
 * Made by Open DS (MIT). Reads the shadcn variables, which theme.css maps onto the scheme's
 * semantic tokens, and the radius and text scale that shadcn.css maps onto the scheme's tokens.
 * The sender is in the text, not only in the side or color.
 */
import * as React from "react";
import { cn } from "../lib/utils";

// Who sent it decides the side and the fill. It is content, not a design variant.
const SIDE = {
  them: "self-start bg-muted text-foreground",
  me: "self-end bg-primary text-primary-foreground",
};

function Bubble({
  className,
  from = "them",
  author,
  time,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Who sent it: the person viewing (me) or someone else (them). */
  from?: keyof typeof SIDE;
  /** Who sent it, read out with the message. */
  author: React.ReactNode;
  /** When it was sent, as people read it. */
  time?: React.ReactNode;
}) {
  return (
    <div
      data-slot="bubble"
      data-from={from}
      className={cn("flex flex-col gap-1", from === "me" ? "items-end" : "items-start", className)}
      {...props}
    >
      <span className="text-xs text-muted-foreground">
        {author}
        {time && <> · {time}</>}
      </span>
      <div
        data-slot="bubble-body"
        className={cn("w-fit max-w-[80%] rounded-lg px-3 py-2 text-sm leading-normal", SIDE[from])}
      >
        {children}
      </div>
    </div>
  );
}

export { Bubble };
