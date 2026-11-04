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
        "flex w-full items-center justify-between gap-[var(--select-trigger-gap)] h-[var(--input-height)] px-[var(--input-padding-x)] rounded-[var(--input-radius)]",
        "bg-[var(--input-background)] text-[var(--input-text)] text-[length:var(--input-font-size)] [font-family:var(--select-trigger-font-family)]",
        "border-[length:var(--select-trigger-border-width)] border-[var(--input-border)] data-[placeholder]:text-[var(--input-placeholder)]",
        "outline-none focus-visible:ring-[length:var(--select-focus)] focus-visible:ring-[color:var(--input-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--select-canvas)]",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-[var(--select-size)] opacity-70" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden p-[var(--select-content-padding)] rounded-[var(--overlay-radius)] bg-[var(--overlay-background)] text-[var(--select-content-label)]",
          "[box-shadow:var(--overlay-shadow)] border-[length:var(--select-content-border-width)] border-[var(--select-content-border)]",
          position === "popper" && "w-[var(--radix-select-trigger-width)] translate-y-1",
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
        "text-[length:var(--select-item-font-size)] outline-none focus:bg-[var(--select-item-sunken)] data-[disabled]:opacity-[var(--select-item-disabled)]",
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
