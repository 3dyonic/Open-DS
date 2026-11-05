/**
 * Avatar. A small image or initials for a person.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Avatar as AvatarPrimitive } from "radix-ui";

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-[var(--avatar-size)] shrink-0 overflow-hidden rounded-[var(--avatar-radius)] select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full", className)} {...props} />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-[var(--avatar-fallback-radius)] bg-[color:var(--avatar-fallback-background)] text-[length:var(--avatar-fallback-font-size)]/[var(--avatar-fallback-line-height)] text-[color:var(--avatar-fallback-label)] group-data-[size=sm]/avatar:text-[length:var(--avatar-fallback-sm-font-size)]/[var(--avatar-fallback-sm-line-height)]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-[var(--avatar-badge-radius)] bg-[color:var(--avatar-badge-background)] text-[color:var(--avatar-badge-label)] ring-[length:var(--avatar-badge-ring-width)] ring-[color:var(--avatar-badge-ring)] select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex space-x-[calc(var(--avatar-group-overlap)*-1)] *:data-[slot=avatar]:ring-[length:var(--avatar-group-ring-width)] *:data-[slot=avatar]:ring-[color:var(--avatar-group-ring)]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-[var(--avatar-group-count-size)] shrink-0 items-center justify-center rounded-[var(--avatar-group-count-radius)] bg-[color:var(--avatar-group-count-background)] text-[length:var(--avatar-group-count-font-size)]/[var(--avatar-group-count-line-height)] text-[color:var(--avatar-group-count-label)] ring-[length:var(--avatar-group-count-ring-width)] ring-[color:var(--avatar-group-count-ring)] group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-[var(--avatar-group-count-icon-size)] group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount };
