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
          "gap-[var(--dialog-content-gap)] p-[var(--dialog-content-padding)] rounded-[var(--overlay-radius)]",
          "bg-[var(--overlay-background)] text-[var(--dialog-content-label)] [box-shadow:var(--overlay-shadow)]",
          "border-[length:var(--dialog-border-width)] border-[var(--dialog-border)]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-3 top-3 rounded-[var(--dialog-radius)] p-[var(--dialog-padding)] text-[var(--dialog-label)] hover:bg-[var(--dialog-sunken)]">
          <X className="size-[var(--dialog-size)]" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-[var(--dialog-gap)]", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-[var(--dialog-gap-2)]", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "[font-family:var(--dialog-font-family)] text-[length:var(--dialog-font-size)] [font-weight:var(--dialog-font-weight)]",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-[var(--dialog-label)] text-[length:var(--dialog-font-size-2)]", className)}
      {...props}
    />
  );
}
