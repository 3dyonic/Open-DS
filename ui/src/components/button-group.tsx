/**
 * Button group. Related buttons joined into one control, such as previous and next, or a split
 * action. Not for a choice that stays selected (toggle group) or for unrelated actions.
 *
 * From shadcn/ui (new-york-v4, MIT). Reads the shadcn variables, which theme.css maps onto the
 * scheme's semantic tokens, and the radius that shadcn.css maps onto the scheme's tokens. The
 * buttons inside keep their own component keys.
 */
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";
import { Separator } from "./separator";

// The direction the buttons run in. It is layout, not a design variant. Stacked buttons touch, so their
// hit areas do not grow: one would cover the next (OD-300).
const ORIENTATION = {
  horizontal:
    "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
  vertical:
    "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot=button]]:after:hidden",
};

/** A group needs a name: pass aria-label, or aria-labelledby. */
function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & { orientation?: keyof typeof ORIENTATION }) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-[var(--button-group-gap)] [&>input]:flex-1",
        ORIENTATION[orientation],
        className,
      )}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-[var(--button-group-text-gap)] rounded-[var(--button-group-text-radius)] border-[length:var(--button-group-text-border-width)] border-[color:var(--button-group-text-border)] bg-[color:var(--button-group-text-background)] px-[var(--button-group-text-padding-x)] text-[length:var(--button-group-text-font-size)]/[var(--button-group-text-line-height)] [font-weight:var(--button-group-text-font-weight)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[var(--button-group-text-icon-size)]",
        className,
      )}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative !m-0 self-stretch bg-[color:var(--button-group-separator-background)] data-[orientation=vertical]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
