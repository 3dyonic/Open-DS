/**
 * Combobox. A text field with a filtered list of choices.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "../lib/utils";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";

import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";

const Combobox = ComboboxPrimitive.Root;

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-[var(--combobox-trigger-icon-size)]", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="combobox-trigger-icon"
        className="pointer-events-none size-[var(--combobox-trigger-icon-icon-size)] text-[color:var(--combobox-trigger-icon-label)]"
      />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<ComboboxPrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset" | "anchor">) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "group/combobox-content relative max-h-96 w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-[var(--combobox-content-radius)] bg-[color:var(--combobox-content-background)] text-[color:var(--combobox-content-label)] shadow-[var(--combobox-content-shadow)] border-[length:var(--combobox-content-border-width)] border-[color:var(--combobox-content-border)] data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-[var(--combobox-input-height)] *:data-[slot=input-group]:border-[color:var(--combobox-input-border)] *:data-[slot=input-group]:bg-[color:var(--combobox-input-background)] *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 duration-[var(--transition-panels-duration)]",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-[var(--combobox-list-padding)] data-empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-[var(--combobox-item-gap)] rounded-[var(--combobox-item-radius)] py-[var(--combobox-item-padding-y)] pr-[var(--combobox-item-padding-right)] pl-[var(--combobox-item-padding-left)] text-[length:var(--combobox-item-font-size)]/[var(--combobox-item-line-height)] outline-hidden select-none data-highlighted:bg-[color:var(--combobox-item-background)] data-highlighted:text-[color:var(--combobox-item-label)] data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--combobox-item-disabled-opacity-disabled)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--combobox-item-icon-size)]",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        data-slot="combobox-item-indicator"
        render={
          <span className="pointer-events-none absolute right-2 flex size-[var(--combobox-icon-size)] items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none size-[var(--combobox-icon-size)] pointer-coarse:size-5" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />;
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "px-[var(--combobox-label-padding-x)] py-[var(--combobox-label-padding-y)] text-[length:var(--combobox-label-font-size)]/[var(--combobox-label-line-height)] text-[color:var(--combobox-label-label)] pointer-coarse:px-[var(--combobox-label-padding-x-2)] pointer-coarse:py-[var(--combobox-label-padding-y)] pointer-coarse:text-[length:var(--combobox-label-font-size-2)]/[var(--combobox-label-line-height-2)]",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />;
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-[var(--combobox-empty-padding-y)] text-center text-[length:var(--combobox-empty-font-size)]/[var(--combobox-empty-line-height)] text-[color:var(--combobox-empty-label)] group-data-empty/combobox-content:flex",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-[color:var(--combobox-separator-background)]", className)}
      {...props}
    />
  );
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-[var(--combobox-chips-gap)] rounded-[var(--combobox-chips-radius)] border-[length:var(--combobox-chips-border-width)] border-[color:var(--combobox-chips-border)] bg-transparent bg-clip-padding px-[var(--combobox-chips-padding-x)] py-[var(--combobox-chips-padding-y)] text-[length:var(--combobox-chips-font-size)]/[var(--combobox-chips-line-height)] shadow-[var(--combobox-chips-shadow)] transition-[color,box-shadow] focus-within:border-[color:var(--combobox-chips-border-focus)] focus-within:ring-[length:var(--combobox-chips-focus-width)] focus-within:ring-[color:var(--combobox-chips-focus-ring-highlight)] has-aria-invalid:border-[color:var(--combobox-chips-border-invalid)] has-aria-invalid:ring-[length:var(--combobox-chips-focus-width)] has-aria-invalid:ring-[color:var(--combobox-chips-focus-ring-invalid)] has-data-[slot=combobox-chip]:px-[var(--combobox-chips-padding-x-2)]",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-[var(--combobox-chip-gap)] rounded-[var(--combobox-chip-radius)] bg-[color:var(--combobox-chip-background)] px-[var(--combobox-chip-padding-x)] text-[length:var(--combobox-chip-font-size)]/[var(--combobox-chip-line-height)] [font-weight:var(--combobox-chip-font-weight)] whitespace-nowrap text-[color:var(--combobox-chip-label)] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-[var(--combobox-chip-disabled-opacity)] has-data-[slot=combobox-chip-remove]:pr-0",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon" />}
          className="-ml-1 opacity-[var(--combobox-disabled-opacity)] hover:opacity-100"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({ className, children, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 outline-none", className)}
      {...props}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
