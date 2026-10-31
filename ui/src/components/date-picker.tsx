/**
 * Date picker. A button that opens a calendar, for one date or a range.
 *
 * Built from the system's own button, popover and calendar, after shadcn/ui's Date Picker (MIT).
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. The placeholder is a
 * prop, so the words come from the scheme.
 */
"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type { DateRange };

type Common = { placeholder?: string; className?: string; dateFormat?: string };

export type DatePickerProps =
  | (Common & { mode?: "single"; value?: Date; defaultValue?: Date; onChange?: (date: Date | undefined) => void })
  | (Common & { mode: "range"; value?: DateRange; defaultValue?: DateRange; onChange?: (range: DateRange | undefined) => void });

export function DatePicker(props: DatePickerProps) {
  const { placeholder = "Pick a date", className, dateFormat = "d MMM yyyy" } = props;
  const [inner, setInner] = React.useState<Date | DateRange | undefined>(props.defaultValue);
  const value = props.value ?? inner;
  const label =
    props.mode === "range"
      ? (() => {
          const r = value as DateRange | undefined;
          if (!r?.from) return placeholder;
          return r.to ? `${format(r.from, dateFormat)} – ${format(r.to, dateFormat)}` : format(r.from, dateFormat);
        })()
      : value
        ? format(value as Date, dateFormat)
        : placeholder;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          data-slot="date-picker"
          data-empty={!value}
          className={cn("justify-start text-left font-normal data-[empty=true]:text-muted-foreground", className)}
        >
          <CalendarIcon />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {props.mode === "range" ? (
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={value as DateRange | undefined}
            onSelect={(r) => {
              setInner(r);
              props.onChange?.(r);
            }}
          />
        ) : (
          <Calendar
            mode="single"
            selected={value as Date | undefined}
            onSelect={(d) => {
              setInner(d);
              (props.onChange as ((d: Date | undefined) => void) | undefined)?.(d);
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
