/**
 * Slider. A value or a range picked by dragging along a track.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Slider as SliderPrimitive } from "radix-ui";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-[var(--slider-disabled-opacity-disabled)] data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-[var(--slider-track-radius)] bg-[color:var(--slider-track-background)] data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-[color:var(--slider-range-background)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block size-[var(--slider-thumb-icon-size)] shrink-0 rounded-[var(--slider-thumb-radius)] border-[length:var(--slider-thumb-border-width)] border-[color:var(--slider-thumb-border)] bg-[color:var(--slider-thumb-background)] shadow-[var(--slider-thumb-shadow)] transition-[color,box-shadow] focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-[var(--slider-thumb-disabled-opacity-disabled)] focus-visible:ring-[length:var(--slider-thumb-focus)] focus-visible:ring-[color:var(--slider-thumb-focus-ring-focus)] focus-visible:ring-offset-[length:var(--slider-thumb-focus-offset)] focus-visible:ring-offset-[color:var(--slider-thumb-focus-ring-offset-focus)]"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
