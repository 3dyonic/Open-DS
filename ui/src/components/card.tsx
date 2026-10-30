/**
 * Card. Groups content inside a page. Whether it has a shadow is a scheme decision
 * (elevation.roles, elevation.definition): --card-shadow is "no shadow" in schemes that separate with lines.
 *
 * Reads only component keys: --card-*.
 */
import * as React from "react";
import { cn } from "../lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-[var(--space-gap-default)] p-[var(--card-padding)] rounded-[var(--card-radius)]",
        "bg-[var(--card-background)] text-[var(--color-text-primary)] [box-shadow:var(--card-shadow)]",
        "border-[length:var(--border-width-default)] border-[var(--card-border)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="card-header" className={cn("flex flex-col gap-[var(--space-gap-tight)]", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "[font-family:var(--type-heading-font-family)] text-[length:var(--type-heading-font-size)] [font-weight:var(--type-heading-font-weight)] leading-[var(--type-heading-line-height)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-[var(--color-text-secondary)] text-[length:var(--type-body-font-size)]", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-[var(--space-gap-default)]", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-[var(--space-gap-default)]", className)}
      {...props}
    />
  );
}
