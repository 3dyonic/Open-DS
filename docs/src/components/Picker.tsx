import React, { useEffect, useId, useRef, useState } from "react";

// A listbox picker from the scheme's own tokens: the scheme switcher's and the Token map's.
//
// No native select (Open DS decision, 2026-11-05): a native select opens the operating system's menu
// and the browser's focus ring, so the docs would stop wearing the scheme they document.

export type Option = { id: string; label: string; hint?: string; color?: string; colorDark?: string };

// A scheme's color: its light-mode primary on a light page, its dark-mode primary on a dark one.
function Dot({ light, dark }: { light: string; dark?: string }) {
  return (
    <span className="ods-picker-dot" style={{ "--dot": light, "--dot-dark": dark ?? light } as React.CSSProperties} />
  );
}

export function Picker({
  label,
  options,
  value,
  onPick,
  wide,
  disabled,
  className,
}: {
  label: string;
  options: Option[];
  value: string;
  onPick: (id: string) => void;
  wide?: boolean;
  /** The trigger shows the value and does not open. */
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  );
  const current = options.find((o) => o.id === value);

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
    trigger.current?.focus();
    if (options[i].id !== value) onPick(options[i].id);
  };
  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    }
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
      trigger.current?.focus();
    } else if (e.key === "Tab") setOpen(false);
    else return;
    e.preventDefault();
  };

  return (
    <div className={`ods-picker${className ? ` ${className}` : ""}`} ref={root}>
      <span className="ods-picker-label" id={`${id}-label`}>
        {label}
      </span>
      <button
        type="button"
        ref={trigger}
        className="ods-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onTriggerKey}
      >
        {current?.color && <Dot light={current.color} dark={current.colorDark} />}
        <span id={`${id}-value`}>{current?.label ?? `Pick a ${label.toLowerCase()}`}</span>
        <svg className="ods-picker-chev" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && !disabled && (
        <ul
          ref={list}
          className={`ods-picker-list${wide ? " ods-picker-list--wide" : ""}`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onListKey}
        >
          {options.map((o, i) => (
            <li
              key={o.id}
              id={`${id}-${i}`}
              role="option"
              aria-selected={o.id === value}
              className={`ods-picker-opt${i === active ? " is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(i)}
            >
              {o.color && <Dot light={o.color} dark={o.colorDark} />}
              <b>{o.label}</b>
              <svg className="ods-picker-check" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {o.hint && <small>{o.hint}</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
