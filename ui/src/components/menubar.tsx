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
        "flex min-h-[var(--menubar-height)] items-center gap-[var(--menubar-gap)] rounded-[var(--menubar-radius)] border-[length:var(--menubar-border-width)] border-[color:var(--menubar-border)] bg-[color:var(--menubar-background)] p-[var(--menubar-padding)] shadow-[var(--menubar-shadow)]",
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
        "flex items-center rounded-[var(--menubar-trigger-radius)] px-[var(--menubar-trigger-padding-x)] py-[var(--menubar-trigger-padding-y)] text-[length:var(--menubar-trigger-font-size)]/[var(--menubar-trigger-line-height)] [font-weight:var(--menubar-trigger-font-weight)] outline-hidden select-none focus:bg-[color:var(--menubar-trigger-background-highlight)] focus:text-[color:var(--menubar-trigger-label-focus)] data-[state=open]:bg-[color:var(--menubar-trigger-background-open)] data-[state=open]:text-[color:var(--menubar-trigger-label-open)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = 0, // lines up with the bar through its padding key
  sideOffset = 0, // the gap is overlay/offset, a margin on the side it opens to
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
          "data-[side=bottom]:mt-[var(--overlay-offset)] data-[side=top]:mb-[var(--overlay-offset)] data-[side=left]:mr-[var(--overlay-offset)] data-[side=right]:ml-[var(--overlay-offset)] data-[align=start]:-ml-[var(--menubar-content-align-pull)] z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-[var(--menubar-content-radius)] border-[length:var(--menubar-content-border-width)] border-[color:var(--menubar-content-border)] bg-[color:var(--menubar-content-background)] p-[var(--menubar-content-padding)] text-[color:var(--menubar-content-label)] shadow-[var(--menubar-content-shadow)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-[var(--transition-panels-duration)]",
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
        "relative flex cursor-default items-center gap-[var(--menubar-item-gap)] rounded-[var(--menubar-item-radius)] px-[var(--menubar-item-padding-x)] py-[var(--menubar-item-padding-y)] text-[length:var(--menubar-item-font-size)]/[var(--menubar-item-line-height)] outline-hidden select-none focus:bg-[color:var(--menubar-item-background-highlight)] focus:text-[color:var(--menubar-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:text-[color:var(--menubar-item-disabled-label)] data-[disabled]:[&_svg]:text-[color:var(--menubar-item-disabled-label)]! data-[inset]:pl-[var(--menubar-item-padding-left)] data-[variant=destructive]:text-[color:var(--menubar-item-label-destructive)] data-[variant=destructive]:focus:bg-[color:var(--menubar-item-background-destructive-highlight)] data-[variant=destructive]:focus:text-[color:var(--menubar-item-label-destructive-highlight)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--menubar-item-icon-size)] [&_svg:not([class*='text-'])]:text-[color:var(--menubar-item-icon)]",
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
        "relative flex cursor-default items-center gap-[var(--menubar-checkbox-item-gap)] rounded-[var(--menubar-checkbox-item-radius)] py-[var(--menubar-checkbox-item-padding-y)] pr-[var(--menubar-checkbox-item-padding-right)] pl-[var(--menubar-checkbox-item-padding-left)] text-[length:var(--menubar-checkbox-item-font-size)]/[var(--menubar-checkbox-item-line-height)] outline-hidden select-none focus:bg-[color:var(--menubar-checkbox-item-background-highlight)] focus:text-[color:var(--menubar-checkbox-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:text-[color:var(--menubar-checkbox-item-disabled-label)] data-[disabled]:[&_svg]:text-[color:var(--menubar-checkbox-item-disabled-label)]! [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--menubar-checkbox-item-icon-size)]",
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
        "relative flex cursor-default items-center gap-[var(--menubar-radio-item-gap)] rounded-[var(--menubar-radio-item-radius)] py-[var(--menubar-radio-item-padding-y)] pr-[var(--menubar-radio-item-padding-right)] pl-[var(--menubar-radio-item-padding-left)] text-[length:var(--menubar-radio-item-font-size)]/[var(--menubar-radio-item-line-height)] outline-hidden select-none focus:bg-[color:var(--menubar-radio-item-background-highlight)] focus:text-[color:var(--menubar-radio-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:text-[color:var(--menubar-radio-item-disabled-label)] data-[disabled]:[&_svg]:text-[color:var(--menubar-radio-item-disabled-label)]! [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--menubar-radio-item-icon-size)]",
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
        "px-[var(--menubar-label-padding-x)] py-[var(--menubar-label-padding-y)] text-[length:var(--menubar-label-font-size)]/[var(--menubar-label-line-height)] [font-weight:var(--menubar-label-font-weight)] data-[inset]:pl-[var(--menubar-label-padding-left)]",
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
      className={cn(
        "-mx-[var(--menubar-content-padding)] my-[var(--menubar-separator-margin-y)] h-[var(--menubar-separator-thickness)] bg-[color:var(--menubar-separator-background)]",
        className,
      )}
      {...props}
    />
  );
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-[length:var(--menubar-shortcut-font-size)]/[var(--menubar-shortcut-line-height)] tracking-widest text-[color:var(--menubar-shortcut-label)]",
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
        "flex cursor-default items-center rounded-[var(--menubar-sub-trigger-radius)] px-[var(--menubar-sub-trigger-padding-x)] py-[var(--menubar-sub-trigger-padding-y)] text-[length:var(--menubar-sub-trigger-font-size)]/[var(--menubar-sub-trigger-line-height)] outline-none select-none focus:bg-[color:var(--menubar-sub-trigger-background-highlight)] focus:text-[color:var(--menubar-sub-trigger-label-focus)] data-[inset]:pl-[var(--menubar-sub-trigger-padding-left)] data-[state=open]:bg-[color:var(--menubar-sub-trigger-background-open)] data-[state=open]:text-[color:var(--menubar-sub-trigger-label-open)]",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-[var(--menubar-sub-trigger-icon-size)]" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-[var(--menubar-sub-content-radius)] border-[length:var(--menubar-sub-content-border-width)] border-[color:var(--menubar-sub-content-border)] bg-[color:var(--menubar-sub-content-background)] p-[var(--menubar-sub-content-padding)] text-[color:var(--menubar-sub-content-label)] shadow-[var(--menubar-sub-content-shadow)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-[var(--transition-panels-duration)] data-[state=open]:ease-[var(--transition-enter-easing)] data-[state=closed]:ease-[var(--transition-exit-easing)] data-[state=closed]:duration-[var(--transition-exit-duration)]",
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
