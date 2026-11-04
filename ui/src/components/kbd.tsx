/**
 * Kbd. A keyboard key or shortcut.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
import { cn } from "../lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-[var(--kbd-gap)] rounded-[var(--kbd-radius)] bg-[color:var(--kbd-background)] px-1 font-sans text-[length:var(--kbd-font-size)]/[var(--kbd-line-height)] [font-weight:var(--kbd-font-weight)] text-[color:var(--kbd-label)] select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-[color:var(--kbd-background-2)]/20 [[data-slot=tooltip-content]_&]:text-[color:var(--kbd-label-2)]",
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-[var(--kbd-group-gap)]", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
