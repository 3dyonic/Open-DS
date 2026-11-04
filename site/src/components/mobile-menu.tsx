"use client";
// The nav on small screens (OD-177): a Menu button that opens the same links in a panel under the
// header. A real button with aria-expanded; focus goes to the first link and back to the button;
// Escape, a tap outside and navigating all close it.
import Link from "next/link";
import { leavesApp } from "@/lib/places";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function MobileMenu({
  links,
  github,
  githubLabel,
}: {
  links: [string, string][];
  github: string;
  githubLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Navigating closes the menu.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const item = "block px-5 py-4 text-[20px] font-bold hover:text-accent-text";
  return (
    <>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[40px] items-center gap-2 rounded-[4px] border border-ink px-3 text-[15px] font-semibold"
      >
        <span aria-hidden className="flex w-[16px] flex-col gap-[4px]">
          {open ? (
            <>
              <span className="h-[2px] translate-y-[3px] rotate-45 bg-ink" />
              <span className="h-[2px] -translate-y-[3px] -rotate-45 bg-ink" />
            </>
          ) : (
            <>
              <span className="h-[2px] bg-ink" />
              <span className="h-[2px] bg-ink" />
              <span className="h-[2px] bg-ink" />
            </>
          )}
        </span>
        {open ? "Close" : "Menu"}
      </button>
      <div
        ref={panel}
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-y border-line bg-paper shadow-lg"
      >
        <nav aria-label="Primary">
          <ul className="flex flex-col py-2">
            {links.map(([label, href]) => (
              <li key={href}>
                {leavesApp(href) ? (
                  <a href={href} className={item} target="_blank" rel="noopener noreferrer">
                    {label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link
                    href={href}
                    className={item}
                    aria-current={pathname === href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <a href={github} target="_blank" rel="noopener noreferrer" className={item}>
                GitHub
                <span className="sr-only"> {githubLabel}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
