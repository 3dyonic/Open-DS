"use client";
// A simple menu picker. No native select (Open DS decision, 2026-11-05): a native select opens the
// operating system's menu and the browser's focus ring, outside the site's own look. Same behavior
// as the docs picker: a button that opens a listbox. Enter, Space or the arrows open it; the arrows,
// Home and End move; Enter picks; Escape closes and returns focus. With a name, it submits in a form.
import { useEffect, useId, useRef, useState } from "react";

export type PickerOption = { id: string; label: string };

export function Picker({
  value,
  options,
  onChange,
  label,
  labelledBy,
  id,
  name,
  placeholder = "Choose",
  className = "",
  full = false,
  ...aria
}: {
  value: string;
  options: PickerOption[];
  onChange: (id: string) => void;
  /** The accessible name, when no visible label points at the button. */
  label?: string;
  labelledBy?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  /** Fill the width of its container, like a form field. */
  full?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const uid = useId();
  const current = options.find((o) => o.id === value);
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  );

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const away = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  const show = () => {
    setActive(index);
    setOpen(true);
  };
  const pick = (i: number) => {
    setOpen(false);
    button.current?.focus();
    if (options[i].id !== value) onChange(options[i].id);
  };
  const onListKey = (e: React.KeyboardEvent) => {
    const n = options.length;
    if (e.key === "ArrowDown") setActive((a) => (a + 1) % n);
    else if (e.key === "ArrowUp") setActive((a) => (a + n - 1) % n);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(n - 1);
    else if (e.key === "Enter" || e.key === " ") pick(active);
    else if (e.key === "Escape") {
      setOpen(false);
      button.current?.focus();
    } else if (e.key === "Tab") setOpen(false);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className={`relative ${full ? "flex w-full" : "inline-flex max-w-full"}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        ref={button}
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy ? `${labelledBy} ${uid}-v` : undefined}
        {...aria}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(e) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
            e.preventDefault();
            show();
          }
        }}
        className={`inline-flex max-w-full cursor-pointer items-center gap-2 text-left ${className}`}
      >
        <span id={`${uid}-v`} className="truncate">
          {current?.label ?? placeholder}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="ml-auto size-4 shrink-0 fill-none stroke-current stroke-2 opacity-70"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          ref={list}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-labelledby={labelledBy}
          aria-activedescendant={`${uid}-${active}`}
          onKeyDown={onListKey}
          className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-[320px] w-max min-w-full max-w-[min(480px,calc(100vw-2rem))] overflow-auto rounded-[4px] border border-line bg-paper p-1 text-[15px] font-normal text-ink shadow-[0_8px_24px_rgb(0_0_0/0.18)]"
        >
          {options.map((o, i) => {
            const selected = o.id === value;
            return (
              <li
                key={o.id}
                id={`${uid}-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(i)}
                // Selected: a tint of the text's own color and an accent edge, so the text stays the
                // page's ink on any surface and selection is never color alone.
                className={`flex cursor-pointer items-center gap-3 rounded-[3px] px-3 py-2 ${
                  i === active ? "bg-[color-mix(in_srgb,var(--color-ink)_7%,transparent)]" : ""
                } ${
                  selected
                    ? "bg-[color-mix(in_srgb,var(--color-ink)_10%,transparent)] font-semibold shadow-[inset_2px_0_0_var(--color-accent)]"
                    : ""
                }`}
              >
                <span>{o.label}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className={`ml-auto size-4 shrink-0 fill-none stroke-current stroke-[2.5] ${selected ? "" : "invisible"}`}
                >
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
