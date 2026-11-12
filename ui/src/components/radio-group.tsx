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
      className={cn(
        "grid gap-[max(var(--radio-group-gap),calc(var(--radio-group-item-hit-area)-var(--radio-group-item-icon-size)))]",
        className,
      )}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "relative after:absolute after:top-1/2 after:left-1/2 after:h-[max(100%,var(--radio-group-item-hit-area))] after:w-[max(100%,var(--radio-group-item-hit-area))] after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] aspect-square size-[var(--radio-group-item-icon-size)] shrink-0 rounded-[var(--radio-group-item-radius)] border-[length:var(--radio-group-item-border-width)] border-[color:var(--radio-group-item-border)] text-[color:var(--radio-group-item-label)] shadow-[var(--radio-group-item-shadow)] transition-[color,box-shadow] outline-none focus-visible:border-[color:var(--radio-group-item-border-focus)] disabled:cursor-not-allowed disabled:bg-[color:var(--radio-group-item-disabled-background)] disabled:border-[color:var(--radio-group-item-disabled-border)] aria-invalid:border-[color:var(--radio-group-item-border-invalid)] aria-invalid:ring-[color:var(--radio-group-item-focus-ring-invalid)] focus-visible:ring-[length:var(--radio-group-item-focus)] focus-visible:ring-[color:var(--radio-group-item-focus-ring-focus)] focus-visible:ring-offset-[length:var(--radio-group-item-focus-offset)] focus-visible:ring-offset-[color:var(--radio-group-item-focus-ring-offset-focus)]",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center data-[disabled]:[&_svg]:fill-[color:var(--radio-group-item-disabled-indicator)]"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-[color:var(--radio-group-icon)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
