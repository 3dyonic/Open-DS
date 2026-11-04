/**
 * Accordion. Stacked sections that open one at a time.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-[color:var(--accordion-divider)] last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-[var(--accordion-trigger-gap)] rounded-[var(--accordion-trigger-radius)] py-[var(--accordion-trigger-padding-y)] text-left text-[length:var(--accordion-trigger-font-size)] [font-weight:var(--accordion-trigger-font-weight)] text-[color:var(--accordion-trigger-label)] transition-all outline-none hover:underline focus-visible:border-[color:var(--accordion-focus-ring)] disabled:pointer-events-none disabled:opacity-[var(--accordion-disabled-opacity)] [&[data-state=open]>svg]:rotate-180 focus-visible:ring-[length:var(--accordion-focus-ring-width)] focus-visible:ring-[color:var(--accordion-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--accordion-trigger-focus-ring-offset-focus)]",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none size-[var(--accordion-icon-size)] shrink-0 translate-y-0.5 text-[color:var(--accordion-icon)] transition-transform duration-[var(--accordion-icon-duration)]" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-[length:var(--accordion-content-font-size)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pt-0 pb-[var(--accordion-content-padding-bottom)]", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
