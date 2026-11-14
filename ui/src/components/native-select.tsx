/**
 * Native select. The browser select, styled.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads only component keys: --native-select-*. A field like the input: the field height (sm is the
 * compact height), the surface fill, the disabled roles, no card shadow. Dark mode comes from the
 * tokens, so no dark: classes.
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
      className="group/native-select relative w-fit"
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "h-[var(--native-select-height)] w-full min-w-0 appearance-none rounded-[var(--native-select-radius)] border-[length:var(--native-select-border-width)] border-[color:var(--native-select-border)] bg-[color:var(--native-select-field-background)] px-[var(--native-select-padding-x)] py-[var(--native-select-padding-y)] pr-[var(--native-select-padding-right)] text-[length:var(--native-select-font-size)]/[var(--native-select-line-height)] transition-[color,box-shadow] duration-[var(--native-select-duration)] ease-[var(--native-select-easing)] outline-none selection:bg-[color:var(--native-select-selection-background)] selection:text-[color:var(--native-select-selection-label)] placeholder:text-[color:var(--native-select-label-placeholder)] data-[size=sm]:h-[var(--native-select-sm-height)] data-[size=sm]:py-[var(--native-select-sm-padding-y)]",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[color:var(--native-select-disabled-background)] disabled:border-[color:var(--native-select-disabled-border)] disabled:text-[color:var(--native-select-disabled-text)]",
          "focus-visible:border-[color:var(--native-select-border-focus)] focus-visible:ring-[length:var(--native-select-focus)] focus-visible:ring-[color:var(--native-select-focus-ring-focus)] focus-visible:ring-offset-[length:var(--native-select-focus-offset)] focus-visible:ring-offset-[color:var(--native-select-focus-ring-offset-color)]",
          "aria-invalid:border-[color:var(--native-select-border-invalid)] aria-invalid:ring-[color:var(--native-select-focus-ring-invalid)]",
          className,
        )}
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-[var(--native-select-icon-inset)] size-[var(--native-select-icon-size)] -translate-y-1/2 text-[color:var(--native-select-icon-label)] select-none group-has-[select:disabled]/native-select:text-[color:var(--native-select-icon-disabled)]"
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
