/**
 * Command. A search-first menu of actions, opened from the keyboard.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../lib/utils";
import { SearchIcon } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[var(--command-radius)] bg-[color:var(--command-background)] text-[color:var(--command-label)]",
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className={cn("overflow-hidden p-0", className)}>
        <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-[var(--command-padding-x)] [&_[cmdk-group-heading]]:[font-weight:var(--command-font-weight)] [&_[cmdk-group-heading]]:text-[color:var(--command-label-2)] [&_[cmdk-group]]:px-[var(--command-padding-x)] [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-[var(--command-padding-x)] [&_[cmdk-item]]:py-[var(--command-padding-y)] [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-[var(--command-input-wrapper-height)] items-center gap-[var(--command-input-wrapper-gap)] border-b-[length:var(--command-input-wrapper-border-width)] border-[color:var(--command-input-wrapper-border)] px-[var(--command-input-wrapper-padding-x)]"
    >
      <SearchIcon className="size-[var(--command-icon-size)] shrink-0 text-[color:var(--command-input-wrapper-icon)]" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-full w-full rounded-[var(--command-input-radius)] bg-transparent py-[var(--command-input-padding-y)] text-[length:var(--command-input-font-size)]/[var(--command-input-line-height)] outline-hidden placeholder:text-[color:var(--command-input-label-placeholder)] disabled:cursor-not-allowed disabled:text-[color:var(--command-input-disabled-text)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
      {...props}
    />
  );
}

function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-[var(--command-empty-padding-y)] text-center text-[length:var(--command-empty-font-size)]/[var(--command-empty-line-height)]"
      {...props}
    />
  );
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-[var(--command-group-padding)] text-[color:var(--command-group-label)] [&_[cmdk-group-heading]]:px-[var(--command-group-padding-x)] [&_[cmdk-group-heading]]:py-[var(--command-group-padding-y)] [&_[cmdk-group-heading]]:text-[length:var(--command-group-font-size)]/[var(--command-group-line-height)] [&_[cmdk-group-heading]]:[font-weight:var(--command-group-font-weight)] [&_[cmdk-group-heading]]:text-[color:var(--command-group-label-2)]",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(
        "-mx-[var(--command-group-padding)] h-[var(--command-separator-thickness)] bg-[color:var(--command-separator-background)]",
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-[var(--command-item-gap)] rounded-[var(--command-item-radius)] px-[var(--command-item-padding-x)] py-[var(--command-item-padding-y)] text-[length:var(--command-item-font-size)]/[var(--command-item-line-height)] outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:text-[color:var(--command-item-disabled-label)] data-[disabled=true]:[&_svg]:text-[color:var(--command-item-disabled-label)]! data-[selected=true]:bg-[color:var(--command-item-background-highlight)] data-[selected=true]:text-[color:var(--command-item-label-highlight)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--command-item-icon-size)] [&_svg:not([class*='text-'])]:text-[color:var(--command-item-icon)]",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-[length:var(--command-shortcut-font-size)]/[var(--command-shortcut-line-height)] tracking-widest text-[color:var(--command-shortcut-label)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
