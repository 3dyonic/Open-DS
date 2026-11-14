/**
 * Breadcrumb. The path to the current page.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { Slot } from "radix-ui";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-[var(--breadcrumb-list-gap)] text-[length:var(--breadcrumb-list-font-size)]/[var(--breadcrumb-list-line-height)] break-words text-[color:var(--breadcrumb-list-label)] sm:gap-[var(--breadcrumb-list-wide-gap)]",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-[var(--breadcrumb-item-gap)]", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "transition-colors duration-[var(--breadcrumb-link-duration)] ease-[var(--breadcrumb-link-easing)] hover:text-[color:var(--breadcrumb-link-label-hover)]",
        "outline-none focus-visible:ring-[length:var(--breadcrumb-link-focus-width)] focus-visible:ring-[color:var(--breadcrumb-link-focus-ring-focus)] focus-visible:ring-offset-[length:var(--breadcrumb-link-focus-offset)] focus-visible:ring-offset-[color:var(--breadcrumb-link-focus-ring-offset-color)]",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "[font-weight:var(--breadcrumb-page-font-weight)] text-[color:var(--breadcrumb-page-label)]",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-[var(--breadcrumb-separator-icon-size)]", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-[var(--breadcrumb-ellipsis-icon-size)]" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
