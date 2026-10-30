/**
 * Dialog. Interrupts to ask for a decision, such as confirming a delete. The scrim dims the
 * page where the scheme answers the menu-or-dialog situation with a dimmed page.
 *
 * Reads only component keys: --overlay-*.
 */
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="dialog-overlay" className="fixed inset-0 z-50 bg-[var(--overlay-scrim)]" />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] sm:max-w-lg -translate-x-1/2 -translate-y-1/2",
          "gap-[var(--space-gap-group)] p-[var(--space-inset-container)] rounded-[var(--overlay-radius)]",
          "bg-[var(--overlay-background)] text-[var(--color-text-primary)] [box-shadow:var(--overlay-shadow)]",
          "border-[length:var(--border-width-default)] border-[var(--color-border-default)]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-3 top-3 rounded-[var(--radius-badge)] p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)]">
          <X className="size-[var(--size-icon)]" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-[var(--space-gap-tight)]", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-[var(--space-gap-default)]", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "[font-family:var(--type-heading-font-family)] text-[length:var(--type-heading-font-size)] [font-weight:var(--type-heading-font-weight)]",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-[var(--color-text-secondary)] text-[length:var(--type-body-font-size)]", className)}
      {...props}
    />
  );
}
