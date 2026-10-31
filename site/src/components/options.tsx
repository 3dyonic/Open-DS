// Every option of a question, with the scheme's choice marked and highlighted (OD-151).
// "list" shows each option on its own row with its description; "inline" is a short row of pills.
import { Check } from "lucide-react";
import type { Option } from "@/lib/schemes";

export function Options({
  options,
  chosen,
  pickedBy,
  variant = "list",
  label,
}: {
  options: Option[];
  /** The option this scheme picked. Leave it out to show the options alone. */
  chosen?: string;
  /** Scheme names by option id, shown under each option. */
  pickedBy?: Record<string, string[]>;
  variant?: "list" | "inline";
  /** Read by screen readers before the options. */
  label?: string;
}) {
  if (variant === "inline")
    return (
      <ul aria-label={label} className="flex flex-wrap gap-[6px]">
        {options.map((o) => {
          const on = o.id === chosen;
          return (
            <li
              key={o.id}
              aria-current={on ? "true" : undefined}
              className={
                on
                  ? "flex items-center gap-[5px] rounded-[4px] border border-ink bg-ink px-[9px] py-[4px] text-[15px] font-extrabold leading-[1.3] text-paper"
                  : "rounded-[4px] border border-line px-[9px] py-[4px] text-[14px] leading-[1.3] text-muted"
              }
            >
              {on && (
                <Check aria-hidden className="size-[13px] shrink-0 text-accent" strokeWidth={3} />
              )}
              {o.label}
            </li>
          );
        })}
      </ul>
    );
  return (
    <ul aria-label={label} className="flex flex-col gap-[6px]">
      {options.map((o) => {
        const on = o.id === chosen;
        const by = pickedBy?.[o.id] ?? [];
        return (
          <li
            key={o.id}
            aria-current={on ? "true" : undefined}
            className={
              on
                ? "flex gap-[10px] rounded-[6px] border-2 border-accent bg-accent-soft px-[14px] py-[12px]"
                : "flex gap-[10px] rounded-[6px] border border-line bg-white/60 px-[13px] py-[8px]"
            }
          >
            <span
              aria-hidden
              className={`mt-[3px] flex size-[16px] shrink-0 items-center justify-center rounded-full border ${on ? "border-accent bg-accent text-paper" : "border-line"}`}
            >
              {on && <Check className="size-[11px]" strokeWidth={3} />}
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span
                className={
                  on
                    ? "text-[18px] font-extrabold leading-[1.3] text-ink"
                    : "text-[14px] leading-[1.35] text-body"
                }
              >
                {o.label}
                {on && <span className="sr-only"> (chosen)</span>}
              </span>
              {o.description && (
                <span
                  className={`leading-[1.4] ${on ? "text-[14px] text-body" : "text-[12px] text-muted"}`}
                >
                  {o.description}
                </span>
              )}
              {pickedBy && (
                <span className="text-[12px] leading-[1.4] text-muted">
                  {by.length ? `Picked by ${by.join(", ")}` : "No scheme picks this yet"}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
