/**
 * Input group. An input with addons such as icons or buttons.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
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
        "group/input-group relative flex w-full items-center rounded-[var(--input-group-radius)] border border-[color:var(--input-group-border)] shadow-[var(--input-group-shadow)] transition-[color,box-shadow] outline-none",
        "h-9 min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-[var(--input-group-padding-bottom)]",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-[var(--input-group-padding-top)]",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-[color:var(--input-group-border-2)] has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-[color:var(--input-group-focus-ring)]/50",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:border-[color:var(--input-group-border-invalid)] has-[[data-slot][aria-invalid=true]]:ring-[color:var(--input-group-focus-ring-invalid)]/20",

        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-[var(--input-group-gap)] py-1.5 text-[length:var(--input-group-font-size)] [font-weight:var(--input-group-font-weight)] text-[color:var(--input-group-label)] select-none group-data-[disabled=true]/input-group:opacity-[var(--input-group-disabled-opacity-disabled)] [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-[var(--input-group-icon-size)]",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-[var(--input-group-inline-start-padding-left)] has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-[var(--input-group-inline-end-padding-right)] has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start px-[var(--input-group-block-start-padding-x)] pt-[var(--input-group-block-start-padding-top)] group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-[var(--input-group-block-start-padding-bottom)]",
        "block-end":
          "order-last w-full justify-start px-[var(--input-group-block-end-padding-x)] pb-[var(--input-group-block-end-padding-bottom)] group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-[var(--input-group-block-end-padding-top)]",
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
  "flex items-center gap-[var(--input-group-gap)] text-[length:var(--input-group-font-size)] shadow-none",
  {
    variants: {
      size: {
        xs: "h-[var(--input-group-xs-height)] gap-[var(--input-group-xs-gap)] rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-[var(--input-group-sm-height)] gap-1.5 rounded-[var(--input-group-sm-radius)] px-2.5 has-[>svg]:px-2.5",
        "icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
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
        "flex items-center gap-[var(--input-group-gap)] text-[length:var(--input-group-font-size)] text-[color:var(--input-group-label)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[var(--input-group-icon-size)]",
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
      className={cn("flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0", className)}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-[var(--input-group-control-padding-y)] shadow-none focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea };
