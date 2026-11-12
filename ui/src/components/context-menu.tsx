/**
 * Context menu. A menu on right-click.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";

function ContextMenu({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}

function ContextMenuGroup({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

function ContextMenuPortal({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

function ContextMenuSub({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-[var(--context-menu-sub-trigger-radius)] px-[var(--context-menu-sub-trigger-padding-x)] py-[var(--context-menu-sub-trigger-padding-y)] text-[length:var(--context-menu-sub-trigger-font-size)]/[var(--context-menu-sub-trigger-line-height)] outline-hidden select-none focus:bg-[color:var(--context-menu-sub-trigger-background-highlight)] focus:text-[color:var(--context-menu-sub-trigger-label-focus)] data-[inset]:pl-[var(--context-menu-sub-trigger-padding-left)] data-[state=open]:bg-[color:var(--context-menu-sub-trigger-background-open)] data-[state=open]:text-[color:var(--context-menu-sub-trigger-label-open)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--context-menu-sub-trigger-icon-size)] [&_svg:not([class*='text-'])]:text-[color:var(--context-menu-sub-trigger-icon)]",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-[var(--context-menu-sub-content-radius)] border-[length:var(--context-menu-sub-content-border-width)] border-[color:var(--context-menu-sub-content-border)] bg-[color:var(--context-menu-sub-content-background)] p-[var(--context-menu-sub-content-padding)] text-[color:var(--context-menu-sub-content-label)] shadow-[var(--context-menu-sub-content-shadow)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-[var(--transition-panels-duration)] data-[state=open]:ease-[var(--transition-enter-easing)] data-[state=closed]:ease-[var(--transition-exit-easing)] data-[state=closed]:duration-[var(--transition-exit-duration)]",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[var(--context-menu-content-radius)] border-[length:var(--context-menu-content-border-width)] border-[color:var(--context-menu-content-border)] bg-[color:var(--context-menu-content-background)] p-[var(--context-menu-content-padding)] text-[color:var(--context-menu-content-label)] shadow-[var(--context-menu-content-shadow)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-[var(--transition-panels-duration)] data-[state=open]:ease-[var(--transition-enter-easing)] data-[state=closed]:ease-[var(--transition-exit-easing)] data-[state=closed]:duration-[var(--transition-exit-duration)]",
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-[var(--context-menu-item-gap)] rounded-[var(--context-menu-item-radius)] px-[var(--context-menu-item-padding-x)] py-[var(--context-menu-item-padding-y)] text-[length:var(--context-menu-item-font-size)]/[var(--context-menu-item-line-height)] outline-hidden select-none focus:bg-[color:var(--context-menu-item-background-highlight)] focus:text-[color:var(--context-menu-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:text-[color:var(--context-menu-item-disabled-label)] data-[disabled]:[&_svg]:text-[color:var(--context-menu-item-disabled-label)]! data-[inset]:pl-[var(--context-menu-item-padding-left)] data-[variant=destructive]:text-[color:var(--context-menu-item-label-destructive)] data-[variant=destructive]:focus:bg-[color:var(--context-menu-item-background-destructive-highlight)] data-[variant=destructive]:focus:text-[color:var(--context-menu-item-label-destructive-highlight)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--context-menu-item-icon-size)] [&_svg:not([class*='text-'])]:text-[color:var(--context-menu-item-icon)] data-[variant=destructive]:*:[svg]:text-[color:var(--context-menu-item-label-destructive)]!",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-[var(--context-menu-checkbox-item-gap)] rounded-[var(--context-menu-checkbox-item-radius)] py-[var(--context-menu-checkbox-item-padding-y)] pr-[var(--context-menu-checkbox-item-padding-right)] pl-[var(--context-menu-checkbox-item-padding-left)] text-[length:var(--context-menu-checkbox-item-font-size)]/[var(--context-menu-checkbox-item-line-height)] outline-hidden select-none focus:bg-[color:var(--context-menu-checkbox-item-background-highlight)] focus:text-[color:var(--context-menu-checkbox-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:text-[color:var(--context-menu-checkbox-item-disabled-label)] data-[disabled]:[&_svg]:text-[color:var(--context-menu-checkbox-item-disabled-label)]! [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--context-menu-checkbox-item-icon-size)]",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-[var(--context-menu-icon-size)]" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-[var(--context-menu-radio-item-gap)] rounded-[var(--context-menu-radio-item-radius)] py-[var(--context-menu-radio-item-padding-y)] pr-[var(--context-menu-radio-item-padding-right)] pl-[var(--context-menu-radio-item-padding-left)] text-[length:var(--context-menu-radio-item-font-size)]/[var(--context-menu-radio-item-line-height)] outline-hidden select-none focus:bg-[color:var(--context-menu-radio-item-background-highlight)] focus:text-[color:var(--context-menu-radio-item-label-focus)] data-[disabled]:pointer-events-none data-[disabled]:text-[color:var(--context-menu-radio-item-disabled-label)] data-[disabled]:[&_svg]:text-[color:var(--context-menu-radio-item-disabled-label)]! [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--context-menu-radio-item-icon-size)]",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-[var(--context-menu-label-padding-x)] py-[var(--context-menu-label-padding-y)] text-[length:var(--context-menu-label-font-size)]/[var(--context-menu-label-line-height)] [font-weight:var(--context-menu-label-font-weight)] text-[color:var(--context-menu-label-label)] data-[inset]:pl-[var(--context-menu-label-padding-left)]",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(
        "-mx-[var(--context-menu-content-padding)] my-[var(--context-menu-separator-margin-y)] h-[var(--context-menu-separator-thickness)] bg-[color:var(--context-menu-separator-background)]",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-[length:var(--context-menu-shortcut-font-size)]/[var(--context-menu-shortcut-line-height)] tracking-widest text-[color:var(--context-menu-shortcut-label)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
