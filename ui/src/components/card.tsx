/**
 * Card. Groups content inside a page. Whether it has a shadow is a scheme decision
 * (elevation.roles, elevation.definition): --card-shadow is "no shadow-[var(--card-shadow)]" in schemes that separate with lines.
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
        "flex flex-col gap-[var(--card-gap)] p-[var(--card-padding)] rounded-[var(--card-radius)]",
        "bg-[var(--card-background)] text-[var(--card-label)] [box-shadow:var(--card-shadow)]",
        "border-[length:var(--card-border-width)] border-[var(--card-border)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="card-header" className={cn("flex flex-col gap-[var(--card-header-gap)]", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "[font-family:var(--card-title-font-family)] text-[length:var(--card-title-font-size)] [font-weight:var(--card-title-font-weight)] leading-[var(--card-title-line-height)]",
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
      className={cn("text-[var(--card-description-label)] text-[length:var(--card-description-font-size)]", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="card-content" className={cn("flex flex-col gap-[var(--card-content-gap)]", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-[var(--card-footer-gap)]", className)}
      {...props}
    />
  );
}
