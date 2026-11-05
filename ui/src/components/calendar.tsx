/**
 * Calendar. A month grid for picking dates.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker";

import { Button, buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-[color:var(--calendar-background)] p-[var(--calendar-padding)] [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-[var(--calendar-gap)] md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-[var(--calendar-gap)]", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-[var(--calendar-gap-2)]",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-[var(--calendar-disabled-opacity-disabled)]",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-[var(--calendar-disabled-opacity-disabled)]",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-[var(--calendar-gap-3)] text-[length:var(--calendar-font-size)]/[var(--calendar-line-height)] [font-weight:var(--calendar-font-weight)]",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-[var(--calendar-radius)] border-[length:var(--calendar-dropdown-border-width)] border-[color:var(--calendar-border)] shadow-[var(--calendar-shadow)] has-focus:border-[color:var(--calendar-border-2)] has-focus:ring-[length:var(--calendar-focus)] has-focus:ring-[color:var(--calendar-focus-ring)] has-focus:ring-offset-[length:var(--calendar-focus-offset)] has-focus:ring-offset-[color:var(--calendar-focus-ring-offset)]",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 bg-[color:var(--calendar-background-2)] opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "[font-weight:var(--calendar-font-weight)] select-none",
          captionLayout === "label"
            ? "text-[length:var(--calendar-font-size)]/[var(--calendar-line-height)]"
            : "flex h-[var(--calendar-height)] items-center gap-[var(--calendar-gap-2)] rounded-[var(--calendar-radius)] pr-[var(--calendar-padding-right)] pl-[var(--calendar-padding-left)] text-[length:var(--calendar-font-size)]/[var(--calendar-line-height)] [&>svg]:size-3.5 [&>svg]:text-[color:var(--calendar-label)]",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-[var(--calendar-radius)] text-[0.8rem] [font-weight:var(--calendar-font-weight-2)] text-[color:var(--calendar-label)] select-none",
          defaultClassNames.weekday,
        ),
        week: cn("mt-[var(--calendar-week-margin-top)] flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn("text-[0.8rem] text-[color:var(--calendar-label)] select-none", defaultClassNames.week_number),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-[var(--calendar-radius)]",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-[var(--calendar-radius)]"
            : "[&:first-child[data-selected=true]_button]:rounded-l-[var(--calendar-radius)]",
          defaultClassNames.day,
        ),
        range_start: cn(
          "rounded-l-[var(--calendar-radius)] bg-[color:var(--calendar-day-range-background)]",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "rounded-r-[var(--calendar-radius)] bg-[color:var(--calendar-day-range-background)]",
          defaultClassNames.range_end,
        ),
        today: cn(
          "rounded-[var(--calendar-radius)] bg-[color:var(--calendar-day-today-background)] text-[color:var(--calendar-day-today-label)] data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn("text-[color:var(--calendar-label)]", defaultClassNames.outside),
        disabled: cn(
          "text-[color:var(--calendar-label)] data-[disabled=true]:opacity-[var(--calendar-day-disabled-opacity)]",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        // The parts name themselves (data-slot), so the Anatomy reference can point at them.
        MonthCaption: ({ calendarMonth: _month, displayIndex: _index, ...props }) => (
          <div data-slot="calendar-caption" {...props} />
        ),
        PreviousMonthButton: (props) => <button data-slot="calendar-previous" {...props} />,
        NextMonthButton: (props) => <button data-slot="calendar-next" {...props} />,
        Weekday: (props) => <th data-slot="calendar-weekday" {...props} />,
        Day: ({ day: _day, modifiers: _modifiers, ...props }) => <td data-slot="calendar-day" {...props} />,
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-[var(--calendar-icon-size)]", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-[var(--calendar-icon-size)]", className)} {...props} />;
          }

          return <ChevronDownIcon className={cn("size-[var(--calendar-icon-size)]", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">{children}</div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-[var(--calendar-gap-2)] leading-none [font-weight:var(--calendar-font-weight-2)] group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-[color:var(--calendar-border-2)] group-data-[focused=true]/day:ring-[length:var(--calendar-focus)] group-data-[focused=true]/day:ring-[color:var(--calendar-focus-ring)] group-data-[focused=true]/day:ring-offset-[length:var(--calendar-focus-offset)] group-data-[focused=true]/day:ring-offset-[color:var(--calendar-focus-ring-offset)] data-[range-end=true]:rounded-[var(--calendar-radius)] data-[range-end=true]:rounded-r-[var(--calendar-radius)] data-[range-end=true]:bg-[color:var(--calendar-day-range-ends-background)] data-[range-end=true]:text-[color:var(--calendar-day-range-ends-label)] data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[color:var(--calendar-day-range-background)] data-[range-middle=true]:text-[color:var(--calendar-day-range-label)] data-[range-start=true]:rounded-[var(--calendar-radius)] data-[range-start=true]:rounded-l-[var(--calendar-radius)] data-[range-start=true]:bg-[color:var(--calendar-day-range-ends-background)] data-[range-start=true]:text-[color:var(--calendar-day-range-ends-label)] data-[selected-single=true]:bg-[color:var(--calendar-day-selected-background)] data-[selected-single=true]:text-[color:var(--calendar-day-selected-label)] [&>span]:text-[length:var(--calendar-font-size-2)]/[var(--calendar-line-height-2)] [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
