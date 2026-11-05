import React, { useEffect, useId, useRef, useState } from "react";
import { useHistory } from "@docusaurus/router";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { useScheme } from "../../components/scheme";

// Swaps the scheme and keeps the page: /dense-data/components/button becomes
// /content-first/components/button. Every scheme has the same pages (the harness checks it), so the
// switch never lands on a missing one. Multi-brand also picks a brand.
//
// No native select (Open DS decision, 2026-11-05): a native select opens the operating system's menu
// and the browser's focus ring, so the docs would stop wearing the scheme they document. This is a
// listbox built from the scheme's own tokens.
type Option = { id: string; label: string; hint?: string; color?: string; colorDark?: string };

// A scheme's color: its light-mode primary on a light page, its dark-mode primary on a dark one.
function Dot({ light, dark }: { light: string; dark?: string }) {
  return (
    <span
      className="ods-picker-dot"
      style={{ "--dot": light, "--dot-dark": dark ?? light } as React.CSSProperties}
    />
  );
}

function Picker({
  label,
  options,
  value,
  onPick,
  wide,
}: {
  label: string;
  options: Option[];
  value: string;
  onPick: (id: string) => void;
  wide?: boolean;
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
    <div className="ods-picker" ref={root}>
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
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onTriggerKey}
      >
        {current?.color && <Dot light={current.color} dark={current.colorDark} />}
        <span id={`${id}-value`}>{current?.label ?? `Pick a ${label.toLowerCase()}`}</span>
        <svg className="ods-picker-chev" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
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

export default function SchemeSwitcher({ mobile }: { mobile?: boolean }) {
  const { schemes, current, rest } = useScheme();
  const history = useHistory();
  const { withBaseUrl } = useBaseUrlUtils();
  const [brand, setBrand] = useState("aster");
  useEffect(() => {
    try {
      setBrand(localStorage.getItem("open-ds-brand") ?? "aster");
    } catch {
      /* private window: keep the first brand */
    }
  }, []);
  const pickBrand = (b: string) => {
    setBrand(b);
    document.documentElement.setAttribute("data-brand", b);
    try {
      localStorage.setItem("open-ds-brand", b);
    } catch {
      /* not kept; the page still switches */
    }
  };
  const brands = current?.brands.length && current.brands.length > 1 ? current.brands : [];
  return (
    <div className={`ods-switcher${mobile ? " ods-switcher--mobile" : ""}`}>
      <Picker
        label="Scheme"
        value={current?.id ?? ""}
        options={schemes.map((s) => ({ id: s.id, label: s.name }))}
        onPick={(id) => history.push(withBaseUrl(`/${id}/${rest}`))}
      />
      {brands.length > 0 && (
        <Picker
          label="Brand"
          value={brand}
          options={brands.map((b) => ({ id: b, label: b[0].toUpperCase() + b.slice(1) }))}
          onPick={pickBrand}
        />
      )}
    </div>
  );
}
