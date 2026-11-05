/**
 * Select. Pick one option from a list. Uses the input keys for the trigger and the overlay keys
 * for the list.
 *
 * Reads only component keys: --input-*, --overlay-*.
 */
import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex w-full items-center justify-between gap-[var(--select-trigger-gap)] h-[var(--select-trigger-height)] px-[var(--select-trigger-padding-x)] rounded-[var(--select-trigger-radius)]",
        "bg-[var(--select-trigger-background)] text-[var(--select-trigger-text)] text-[length:var(--select-trigger-font-size)] [font-family:var(--select-trigger-font-family)]",
        "border-[length:var(--select-trigger-border-width)] border-[var(--select-trigger-border)] data-[placeholder]:text-[var(--select-trigger-placeholder)]",
        "outline-none focus-visible:ring-[length:var(--select-trigger-focus-width)] focus-visible:ring-[color:var(--select-trigger-border-focus)] focus-visible:ring-offset-[length:var(--select-trigger-focus-offset)] focus-visible:ring-offset-[color:var(--select-trigger-focus-ring-offset)]",
        "aria-invalid:border-[var(--select-trigger-border-invalid)] disabled:bg-[var(--select-trigger-disabled-background)] disabled:border-[var(--select-trigger-disabled-border)] disabled:text-[var(--select-trigger-disabled-text)]",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-[var(--select-size)] text-[var(--select-trigger-icon)]" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 0, // the gap is overlay/offset, a margin on the side it opens to (OD-243)
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={position === "popper" ? sideOffset : undefined}
        className={cn(
          "data-[side=bottom]:mt-[var(--overlay-offset)] data-[side=top]:mb-[var(--overlay-offset)] data-[side=left]:mr-[var(--overlay-offset)] data-[side=right]:ml-[var(--overlay-offset)] z-50 min-w-[8rem] overflow-hidden p-[var(--select-content-padding)] rounded-[var(--overlay-radius)] bg-[var(--overlay-background)] text-[var(--select-content-label)]",
          "[box-shadow:var(--overlay-shadow)] border-[length:var(--select-content-border-width)] border-[var(--select-content-border)]",
          position === "popper" && "w-[var(--radix-select-trigger-width)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-[var(--select-item-gap)] pl-[var(--select-item-padding-left)] pr-[var(--select-item-padding-right)] min-h-[var(--overlay-item-height)] rounded-[var(--select-item-radius)]",
        "text-[length:var(--select-item-font-size)] outline-none focus:bg-[var(--select-item-background-highlight)] data-[disabled]:opacity-[var(--select-item-disabled)]",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex items-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-[var(--select-size)]" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}
