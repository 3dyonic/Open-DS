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
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[10rem] p-1 rounded-[var(--overlay-radius)] bg-[var(--overlay-background)] text-[var(--color-text-primary)]",
          "[box-shadow:var(--overlay-shadow)] border-[length:var(--border-width-default)] border-[var(--color-border-default)]",
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
        "flex cursor-default select-none items-center gap-2 px-[var(--space-inset-cell-x)] min-h-[var(--overlay-item-height)] rounded-[var(--radius-badge)]",
        "text-[length:var(--type-body-font-size)] outline-none focus:bg-[var(--color-surface-sunken)] data-[disabled]:opacity-[var(--opacity-disabled)]",
        "[&_svg]:size-[var(--size-icon)]",
        tone === "danger" && "text-[var(--color-status-danger)]",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cn("my-1 h-px bg-[var(--color-border-default)]", className)} {...props} />;
}
