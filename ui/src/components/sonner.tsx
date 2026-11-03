/**
 * Sonner. Stacked toasts, for many short confirmations that may arrive close together. Not for a
 * message people must read or act on (an alert or a dialog). Call toast("12 alerts exported.")
 * anywhere; render <Toaster /> once.
 *
 * From shadcn/ui (new-york-v4, MIT), on the Sonner library. Reads the shadcn variables, which
 * theme.css maps onto the scheme's semantic tokens, and the radius that shadcn.css maps onto the
 * scheme's tokens. Toasts are announced politely and never take focus.
 */
"use client";

import * as React from "react";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster, toast };
