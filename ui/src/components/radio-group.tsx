/**
 * Radio group. One choice from a short list.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-[var(--radio-group-gap)]", className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-[var(--radio-group-item-icon-size)] shrink-0 rounded-[var(--radio-group-item-radius)] border border-[color:var(--radio-group-item-border)] text-[color:var(--radio-group-item-label)] shadow-[var(--radio-group-item-shadow)] transition-[color,box-shadow] outline-none focus-visible:border-[color:var(--radio-group-item-border-focus)] disabled:cursor-not-allowed disabled:opacity-[var(--radio-group-item-disabled-opacity-disabled)] aria-invalid:border-[color:var(--radio-group-item-border-invalid)] aria-invalid:ring-[color:var(--radio-group-item-focus-ring-invalid)]/20 focus-visible:ring-[length:var(--radio-group-item-focus)] focus-visible:ring-[color:var(--radio-group-item-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--radio-group-item-focus-ring-offset-focus)]",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-[color:var(--radio-group-icon)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
