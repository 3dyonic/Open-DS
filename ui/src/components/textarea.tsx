/**
 * Textarea. Multi-line text entry.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads only component keys: --textarea-*. A field like the input: the field height (as its least
 * height), the surface fill, the disabled roles, no card shadow. Dark mode comes from the tokens,
 * so no dark: classes.
 */
import * as React from "react";
import { cn } from "../lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[var(--textarea-min-height)] w-full rounded-[var(--textarea-radius)] border-[length:var(--textarea-border-width)] border-[color:var(--textarea-border)] bg-[color:var(--textarea-background)] px-[var(--textarea-padding-x)] py-[var(--textarea-padding-y)] text-[length:var(--textarea-font-size)]/[var(--textarea-line-height)] transition-[color,box-shadow] duration-[var(--textarea-duration)] ease-[var(--textarea-easing)] outline-none placeholder:text-[color:var(--textarea-label-placeholder)]",
        "focus-visible:border-[color:var(--textarea-border-focus)] focus-visible:ring-[length:var(--textarea-focus)] focus-visible:ring-[color:var(--textarea-focus-ring-focus)] focus-visible:ring-offset-[length:var(--textarea-focus-offset)] focus-visible:ring-offset-[color:var(--textarea-focus-ring-offset-focus)]",
        "aria-invalid:border-[color:var(--textarea-border-invalid)] aria-invalid:ring-[color:var(--textarea-focus-ring-invalid)]",
        "disabled:cursor-not-allowed disabled:bg-[color:var(--textarea-disabled-background)] disabled:border-[color:var(--textarea-disabled-border)] disabled:text-[color:var(--textarea-disabled-text)]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
