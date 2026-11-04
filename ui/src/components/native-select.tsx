/**
 * Native select. The browser select, styled.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronDownIcon } from "lucide-react";

function NativeSelect({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" }) {
  return (
    <div
      className="group/native-select relative w-fit has-[select:disabled]:opacity-[var(--native-select-disabled-opacity)]"
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "h-9 w-full min-w-0 appearance-none rounded-[var(--native-select-radius)] border border-[color:var(--native-select-border)] bg-transparent px-[var(--native-select-padding-x)] py-2 pr-9 text-[length:var(--native-select-font-size)]/[var(--native-select-line-height)] shadow-[var(--native-select-shadow)] transition-[color,box-shadow] outline-none selection:bg-[color:var(--native-select-background)] selection:text-[color:var(--native-select-label)] placeholder:text-[color:var(--native-select-label-placeholder)] disabled:pointer-events-none disabled:cursor-not-allowed data-[size=sm]:h-[var(--native-select-height)] data-[size=sm]:py-1",
          "focus-visible:border-[color:var(--native-select-border-focus)] focus-visible:ring-[length:var(--native-select-focus)] focus-visible:ring-[color:var(--native-select-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--native-select-focus-ring-offset-focus)]",
          "aria-invalid:border-[color:var(--native-select-border-invalid)] aria-invalid:ring-[color:var(--native-select-focus-ring-invalid)]/20",
          className,
        )}
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-3.5 size-[var(--native-select-icon-size)] -translate-y-1/2 text-[color:var(--native-select-label-2)] opacity-[var(--native-select-disabled-opacity)] select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return (
    <option data-slot="native-select-option" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} />
  );
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
