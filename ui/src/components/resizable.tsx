/**
 * Resizable. Panels the user can resize by dragging.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import { cn } from "../lib/utils";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

function ResizablePanelGroup({ className, ...props }: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn("flex h-full w-full aria-[orientation=vertical]:flex-col", className)}
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-[var(--resizable-handle-thickness)] items-center justify-center bg-[color:var(--resizable-handle-background)] transition-colors duration-[var(--transition-duration)] ease-[var(--transition-easing)] hover:bg-[color:var(--resizable-handle-background-hover)] focus-visible:bg-[color:var(--resizable-handle-background-focus)] after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-hidden aria-[orientation=horizontal]:h-[var(--resizable-handle-thickness)] aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90 focus-visible:ring-[length:var(--resizable-handle-focus)] focus-visible:ring-[color:var(--resizable-handle-focus-ring-focus)] focus-visible:ring-offset-[length:var(--resizable-focus-offset)] focus-visible:ring-offset-[color:var(--resizable-handle-focus-ring-offset-color)]",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div
          data-slot="resizable-grip"
          className="z-10 flex h-[var(--resizable-grip-height)] w-3 items-center justify-center rounded-[var(--resizable-grip-radius)] border-[length:var(--resizable-grip-border-width)] border-[color:var(--resizable-grip-border)] bg-[color:var(--resizable-grip-background)]"
        >
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
