/**
 * Item. A row with media, a title, a description and actions, for lists of things such as people,
 * files or settings. Not for records people compare cell by cell (a table).
 *
 * From shadcn/ui (new-york-v4, MIT). Reads the shadcn variables, which theme.css maps onto the
 * scheme's semantic tokens, and the radius and text scale that shadcn.css maps onto the scheme's
 * tokens. Dark mode comes from the tokens, so no dark: classes.
 */
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";
import { Separator } from "./separator";

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div role="list" data-slot="item-group" className={cn("group/item-group flex flex-col", className)} {...props} />
  );
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="item-separator" orientation="horizontal" className={cn("my-0", className)} {...props} />;
}

const itemVariants = cva(
  "group/item flex flex-wrap items-center rounded-[var(--item-radius)] border border-transparent text-[length:var(--item-font-size)] outline-none transition-colors duration-[var(--item-duration)] focus-visible:border-[color:var(--item-border-focus)] [a]:transition-colors [a]:hover:bg-[color:var(--item-background-hover)]/50 focus-visible:ring-[length:var(--item-focus)] focus-visible:ring-[color:var(--item-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--item-focus-ring-offset-focus)]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-[color:var(--item-outline-border)]",
        muted: "bg-[color:var(--item-muted-background)]/50",
      },
      size: {
        default: "gap-[var(--item-default-gap)] p-[var(--item-default-padding)]",
        sm: "gap-2.5 px-[var(--item-sm-padding-x)] py-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  );
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-[var(--item-gap)] group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-[var(--item-icon-size)] rounded-[var(--item-icon-radius)] border bg-[color:var(--item-icon-background)] [&_svg:not([class*='size-'])]:size-[var(--item-icon-icon-size)]",
        image: "size-10 overflow-hidden rounded-[var(--item-image-radius)] [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-[var(--item-content-gap)] [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit items-center gap-[var(--item-title-gap)] text-[length:var(--item-title-font-size)] leading-snug [font-weight:var(--item-title-font-weight)]",
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-[length:var(--item-description-font-size)] leading-normal [font-weight:var(--item-description-font-weight)] text-balance text-[color:var(--item-description-label)] [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-[color:var(--item-description-label-2)]",
        className,
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-[var(--item-actions-gap)]", className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between gap-[var(--item-header-gap)]", className)}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn("flex basis-full items-center justify-between gap-[var(--item-footer-gap)]", className)}
      {...props}
    />
  );
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};
