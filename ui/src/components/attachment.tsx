/**
 * Attachment. A file shared in a conversation, with its name, type and size, that people open or
 * download. Not for uploading files in a form (a file input), or images meant to be seen inline.
 *
 * Made by Open DS (MIT). Reads the shadcn variables, which theme.css maps onto the scheme's
 * semantic tokens, and the radius that shadcn.css maps onto the scheme's tokens. The link names the
 * file, its type and size, never just "Download".
 */
import { FileTextIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

function Attachment({
  className,
  name,
  type,
  size,
  ...props
}: React.ComponentProps<"a"> & {
  /** The file name. */
  name: string;
  /** The file type, as people read it, such as PDF. */
  type: string;
  /** The file size, as people read it, such as 1.2 MB. */
  size: string;
}) {
  return (
    <a
      data-slot="attachment"
      aria-label={`${name}, ${type}, ${size}`}
      className={cn(
        "flex w-fit max-w-full items-center gap-3 rounded-md border bg-background px-3 py-2 text-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted" aria-hidden>
        <FileTextIcon className="size-4 text-muted-foreground" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">
          {type} · {size}
        </span>
      </span>
    </a>
  );
}

export { Attachment };
