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
        "flex w-fit max-w-full items-center gap-3 rounded-[var(--attachment-radius)] border bg-[color:var(--attachment-background)] px-3 py-2 text-[length:var(--attachment-font-size)] outline-none hover:bg-[color:var(--attachment-background-hover)] focus-visible:ring-[length:var(--attachment-focus)] focus-visible:ring-[color:var(--attachment-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--attachment-focus-ring-offset-focus)]",
        className,
      )}
      {...props}
    >
      <span
        className="flex size-[var(--attachment-size)] shrink-0 items-center justify-center rounded-[var(--attachment-radius-2)] bg-[color:var(--attachment-background-2)]"
        aria-hidden
      >
        <FileTextIcon className="size-[var(--attachment-icon-size)] text-[color:var(--attachment-label)]" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate [font-weight:var(--attachment-font-weight)]">{name}</span>
        <span className="text-[length:var(--attachment-font-size-2)] text-[color:var(--attachment-label)]">
          {type} · {size}
        </span>
      </span>
    </a>
  );
}

export { Attachment };
