/**
 * Menubar. A row of menus, as in desktop apps, for many commands grouped by menu. Not in place of
 * a command palette or a row's own menu.
 *
 * From shadcn/ui (new-york-v4, MIT). Reads the shadcn variables, which theme.css maps onto the
 * scheme's semantic tokens, and the radius and shadow that shadcn.css maps onto the scheme's
 * tokens. Dark mode comes from the tokens, so no dark: classes.
 */
"use client";

import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { Menubar as MenubarPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

function Menubar({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-9 items-center gap-[var(--menubar-gap)] rounded-[var(--menubar-radius)] border bg-[color:var(--menubar-background)] p-1 shadow-[var(--menubar-shadow)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-[var(--menubar-trigger-radius)] px-2 py-1 text-[length:var(--menubar-trigger-font-size)] [font-weight:var(--menubar-trigger-font-weight)] outline-hidden select-none focus:bg-[color:var(--menubar-trigger-background-focus)] focus:text-[color:var(--menubar-trigger-label-focus)] data-[state=open]:bg-[color:var(--menubar-trigger-background-open)] data-[state=open]:text-[color:var(--menubar-trigger-label-open)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-[var(--menubar-content-radius)] border bg-[color:var(--menubar-content-background)] p-1 text-[color:var(--menubar-content-label)] shadow-[var(--menubar-content-shadow)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-[var(--transition-panels-duration)]",
          className,
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-[var(--menubar-item-gap)] rounded-[var(--menubar-item-radius)] px-2 py-1.5 text-[length:var(--menubar-item-font-size)] outline-hidden select-none focus:bg-[color:var(--menubar-item-background-focus)] focus:text-[color:var(--menubar-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--menubar-item-disabled-opacity-disabled)] data-[inset]:pl-8 data-[variant=destructive]:text-[color:var(--menubar-item-label)] data-[variant=destructive]:focus:bg-[color:var(--menubar-item-background-focus-2)]/10 data-[variant=destructive]:focus:text-[color:var(--menubar-item-label-focus-2)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--menubar-item-icon-size)] [&_svg:not([class*='text-'])]:text-[color:var(--menubar-item-label-2)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-[var(--menubar-checkbox-item-gap)] rounded-[var(--menubar-checkbox-item-radius)] py-1.5 pr-2 pl-8 text-[length:var(--menubar-checkbox-item-font-size)] outline-hidden select-none focus:bg-[color:var(--menubar-checkbox-item-background-focus)] focus:text-[color:var(--menubar-checkbox-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--menubar-checkbox-item-disabled-opacity-disabled)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--menubar-checkbox-item-icon-size)]",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-[var(--menubar-icon-size)]" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-[var(--menubar-radio-item-gap)] rounded-[var(--menubar-radio-item-radius)] py-1.5 pr-2 pl-8 text-[length:var(--menubar-radio-item-font-size)] outline-hidden select-none focus:bg-[color:var(--menubar-radio-item-background-focus)] focus:text-[color:var(--menubar-radio-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--menubar-radio-item-disabled-opacity-disabled)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--menubar-radio-item-icon-size)]",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-[length:var(--menubar-label-font-size)] [font-weight:var(--menubar-label-font-weight)] data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-[color:var(--menubar-separator-background)]", className)}
      {...props}
    />
  );
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-[length:var(--menubar-shortcut-font-size)] tracking-widest text-[color:var(--menubar-shortcut-label)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSub({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-[var(--menubar-sub-trigger-radius)] px-2 py-1.5 text-[length:var(--menubar-sub-trigger-font-size)] outline-none select-none focus:bg-[color:var(--menubar-sub-trigger-background-focus)] focus:text-[color:var(--menubar-sub-trigger-label-focus)] data-[inset]:pl-8 data-[state=open]:bg-[color:var(--menubar-sub-trigger-background-open)] data-[state=open]:text-[color:var(--menubar-sub-trigger-label-open)]",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-[var(--menubar-height)] w-4" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-[var(--menubar-sub-content-radius)] border bg-[color:var(--menubar-sub-content-background)] p-1 text-[color:var(--menubar-sub-content-label)] shadow-[var(--menubar-sub-content-shadow)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-[var(--transition-panels-duration)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
