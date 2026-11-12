/**
 * Dropdown menu. A list of actions behind one button, such as the row actions behind a
 * "more" icon button.
 *
 * Reads only component keys: --overlay-*.
 */
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;

export function DropdownMenuContent({
  className,
  sideOffset = 0, // the gap is overlay/offset, a margin on the side it opens to (OD-243)
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "data-[side=bottom]:mt-[var(--overlay-offset)] data-[side=top]:mb-[var(--overlay-offset)] data-[side=left]:mr-[var(--overlay-offset)] data-[side=right]:ml-[var(--overlay-offset)] z-50 min-w-[10rem] p-[var(--dropdown-menu-content-padding)] rounded-[var(--overlay-radius)] bg-[var(--overlay-background)] text-[var(--dropdown-menu-content-label)]",
          "[box-shadow:var(--overlay-shadow)] border-[length:var(--dropdown-menu-content-border-width)] border-[var(--dropdown-menu-content-border)]",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & { tone?: "default" | "danger" }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-default select-none items-center gap-[var(--dropdown-menu-item-gap)] px-[var(--dropdown-menu-item-padding-x)] min-h-[var(--overlay-item-height)] rounded-[var(--dropdown-menu-item-radius)]",
        "text-[length:var(--dropdown-menu-item-font-size)] outline-none focus:bg-[var(--dropdown-menu-item-background-highlight)] data-[disabled]:text-[color:var(--dropdown-menu-item-disabled-label)] data-[disabled]:[&_svg]:text-[color:var(--dropdown-menu-item-disabled-label)]!",
        "[&_svg]:size-[var(--dropdown-menu-item-icon)]",
        tone === "danger" && "text-[var(--dropdown-menu-item-label-destructive)]",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      className={cn(
        "my-[var(--dropdown-menu-separator-margin-y)] h-[var(--dropdown-menu-separator-thickness)] bg-[var(--dropdown-menu-separator-background)]",
        className,
      )}
      {...props}
    />
  );
}
