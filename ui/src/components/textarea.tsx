/**
 * Textarea. Multi-line text entry.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
import * as React from "react";
import { cn } from "../lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-[var(--textarea-radius)] border border-[color:var(--textarea-border)] bg-transparent px-[var(--textarea-padding-x)] py-[var(--textarea-padding-y)] text-[length:var(--textarea-font-size)]/[var(--textarea-line-height)] shadow-[var(--textarea-shadow)] transition-[color,box-shadow] outline-none placeholder:text-[color:var(--textarea-label-placeholder)] focus-visible:border-[color:var(--textarea-border-focus)] disabled:cursor-not-allowed disabled:opacity-[var(--textarea-disabled-opacity-disabled)] aria-invalid:border-[color:var(--textarea-border-invalid)] aria-invalid:ring-[color:var(--textarea-focus-ring-invalid)]/20 md:text-[length:var(--textarea-font-size)]/[var(--textarea-line-height)] focus-visible:ring-[length:var(--textarea-focus)] focus-visible:ring-[color:var(--textarea-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--textarea-focus-ring-offset-focus)]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
