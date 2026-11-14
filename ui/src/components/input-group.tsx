/**
 * Input group. An input with addons such as icons or buttons.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads only component keys: --input-group-*. The group is the field: the field height, the surface
 * fill, the disabled roles, no card shadow; the input or textarea inside drops its own edge and
 * corner and fills the group. Dark mode comes from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex w-full items-center rounded-[var(--input-group-radius)] border-[length:var(--input-group-border-width)] border-[color:var(--input-group-border)] bg-[color:var(--input-group-background)] transition-[color,box-shadow] duration-[var(--input-group-duration)] ease-[var(--input-group-easing)] outline-none",
        "h-[var(--input-group-height)] min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-[var(--input-group-padding-left)]",
        "has-[>[data-align=inline-end]]:[&>input]:pr-[var(--input-group-padding-right)]",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-[var(--input-group-padding-bottom)]",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-[var(--input-group-padding-top)]",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-[color:var(--input-group-border-focus)] has-[[data-slot=input-group-control]:focus-visible]:ring-[length:var(--input-group-focus-width)] has-[[data-slot=input-group-control]:focus-visible]:ring-offset-[length:var(--input-group-focus-offset)] has-[[data-slot=input-group-control]:focus-visible]:ring-offset-[color:var(--input-group-focus-ring-offset-color)] has-[[data-slot=input-group-control]:focus-visible]:ring-[color:var(--input-group-focus-ring-highlight)]",

        // Disabled state: the disabled roles, like the input.
        "has-[[data-slot=input-group-control]:disabled]:bg-[color:var(--input-group-disabled-background)] has-[[data-slot=input-group-control]:disabled]:border-[color:var(--input-group-disabled-border)]",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:border-[color:var(--input-group-border-invalid)] has-[[data-slot][aria-invalid=true]]:ring-[color:var(--input-group-focus-ring-invalid)]",

        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-[var(--input-group-addon-gap)] py-[var(--input-group-addon-padding-y)] text-[length:var(--input-group-addon-font-size)]/[var(--input-group-addon-line-height)] [font-weight:var(--input-group-addon-font-weight)] text-[color:var(--input-group-addon-label)] select-none group-data-[disabled=true]/input-group:text-[color:var(--input-group-addon-disabled-label)] group-has-[[data-slot=input-group-control]:disabled]/input-group:text-[color:var(--input-group-addon-disabled-label)] [&>kbd]:rounded-[var(--input-group-addon-kbd-radius)] [&>svg:not([class*='size-'])]:size-[var(--input-group-addon-icon-size)]",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-[var(--input-group-addon-inline-start-padding-left)] has-[>button]:pl-[var(--input-group-addon-button-inset)] has-[>kbd]:pl-[var(--input-group-addon-kbd-inset)]",
        "inline-end":
          "order-last pr-[var(--input-group-addon-inline-end-padding-right)] has-[>button]:pr-[var(--input-group-addon-button-inset)] has-[>kbd]:pr-[var(--input-group-addon-kbd-inset)]",
        "block-start":
          "order-first w-full justify-start px-[var(--input-group-addon-block-start-padding-x)] pt-[var(--input-group-addon-block-start-padding-top)] group-has-[>input]/input-group:pt-[var(--input-group-addon-block-start-padding-top-2)] [.border-b]:pb-[var(--input-group-addon-block-start-padding-bottom)]",
        "block-end":
          "order-last w-full justify-start px-[var(--input-group-addon-block-end-padding-x)] pb-[var(--input-group-addon-block-end-padding-bottom)] group-has-[>input]/input-group:pb-[var(--input-group-addon-block-end-padding-bottom-2)] [.border-t]:pt-[var(--input-group-addon-block-end-padding-top)]",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-[var(--input-group-addon-gap)] text-[length:var(--input-group-addon-font-size)]/[var(--input-group-addon-line-height)]",
  {
    variants: {
      size: {
        xs: "h-[var(--input-group-xs-height)] gap-[var(--input-group-xs-gap)] rounded-[var(--input-group-xs-radius)] px-[var(--input-group-xs-padding-x)] has-[>svg]:px-[var(--input-group-xs-padding-x)] [&>svg:not([class*='size-'])]:size-[var(--input-group-xs-icon-size)]",
        sm: "h-[var(--input-group-sm-height)] gap-[var(--input-group-sm-gap)] rounded-[var(--input-group-sm-radius)] px-[var(--input-group-sm-padding-x)] has-[>svg]:px-[var(--input-group-sm-padding-x)]",
        "icon-xs": "size-[var(--input-group-icon-xs-size)] rounded-[var(--input-group-icon-xs-radius)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-[var(--input-group-icon-sm-size)] p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-[var(--input-group-addon-gap)] text-[length:var(--input-group-addon-font-size)]/[var(--input-group-addon-line-height)] text-[color:var(--input-group-addon-label)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[var(--input-group-addon-icon-size)]",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn("h-auto flex-1 self-stretch rounded-none border-0 focus-visible:ring-0", className)}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 py-[var(--input-group-control-padding-y)] focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea };
