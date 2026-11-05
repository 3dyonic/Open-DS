/**
 * Dialog. Interrupts to ask for a decision, such as confirming a delete. The scrim dims the
 * page where the scheme answers the menu-or-dialog situation with a dimmed page.
 *
 * Reads only component keys: --dialog-*. The panel floats, so it takes the container corner, the
 * overlay elevation and an edge of its own, like every floating panel.
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
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-50 bg-[var(--dialog-overlay-background)]"
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] sm:max-w-lg -translate-x-1/2 -translate-y-1/2",
          "gap-[var(--dialog-content-gap)] p-[var(--dialog-content-padding)] rounded-[var(--dialog-content-radius)]",
          "bg-[var(--dialog-content-background)] text-[var(--dialog-content-label)] [box-shadow:var(--dialog-content-shadow)]",
          "border-[length:var(--dialog-content-border-width)] border-[var(--dialog-content-border)]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className="absolute right-3 top-3 rounded-[var(--dialog-close-radius)] p-[var(--dialog-close-padding)] text-[var(--dialog-close-label)] hover:bg-[var(--dialog-close-background-hover)] outline-hidden ring-offset-[color:var(--dialog-close-focus-ring-offset-color)] focus-visible:ring-[length:var(--dialog-close-focus-ring-width)] focus-visible:ring-[color:var(--dialog-close-focus-ring-color)] focus-visible:ring-offset-[length:var(--dialog-close-focus-offset)]"
        >
          <X className="size-[var(--dialog-close-icon-size)]" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-[var(--dialog-header-gap)]", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex justify-end gap-[var(--dialog-footer-gap)]", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "[font-family:var(--dialog-title-font-family)] text-[length:var(--dialog-title-font-size)]/[var(--dialog-title-line-height)] [font-weight:var(--dialog-title-font-weight)]",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-[var(--dialog-description-label)] text-[length:var(--dialog-description-font-size)]/[var(--dialog-description-line-height)]",
        className,
      )}
      {...props}
    />
  );
}
