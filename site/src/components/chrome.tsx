// The site's nav, footer and mark, from the Figma Home frame (115:900).
import Link from "next/link";
import { brandName } from "@/lib/data";

// The mark is a 6 by 5 pixel grid; one cell is lit.
const MARK = ["110111", "101010", "1l1011", "101001", "110111"];

export function Mark() {
  return (
    <span aria-hidden className="relative block h-[25.333px] w-[36px]">
      {MARK.flatMap((row, r) =>
        [...row].map((c, i) =>
          c === "0" ? null : (
            <span
              key={`${r}-${i}`}
              className={`absolute size-[4px] ${c === "l" ? "bg-accent" : "bg-ink"}`}
              style={{ left: `${(i * 16) / 3}px`, top: `${(r * 16) / 3}px` }}
            />
          ),
        ),
      )}
    </span>
  );
}

export const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ?? "https://github.com/3dyonic/Open-DS/tree/RC1/docs/docs";

const LINKS: [string, string][] = [
  ["Schemes", "/schemes/"],
  ["How it works", "/#how-it-works"],
  ["Questions", "/questions/"],
  ["Docs", DOCS_URL],
];

export function SiteNav() {
  return (
    <header className="flex min-h-[156px] flex-wrap items-center gap-x-8 gap-y-4 px-5 py-7 lg:px-20">
      <Link href="/" className="flex items-center gap-3" aria-label={`${brandName} home`}>
        <Mark />
        <span className="text-[22px] font-extrabold">{brandName}</span>
        <span aria-hidden className="size-[6px] bg-accent" />
      </Link>
      <nav aria-label="Primary" className="ml-auto">
        <ul className="flex flex-wrap items-center gap-8 text-[16px] font-semibold">
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <Link className="hover:text-accent-text" href={href}>
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contribute/"
              className="inline-block rounded-[4px] border border-ink px-[14px] py-[8px] text-[15px] hover:bg-ink hover:text-paper"
            >
              Contribute
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex min-h-[164px] flex-wrap items-start justify-between gap-4 px-5 pt-8 font-mono text-[13px] text-muted lg:px-20">
      <p>{brandName} · MIT</p>
      <p>A 3dyonic project · Case study</p>
    </footer>
  );
}

/** Section eyebrow: mono, uppercase, accent text. */
export function Eyebrow({
  children,
  tone = "text",
}: {
  children: React.ReactNode;
  tone?: "text" | "accent";
}) {
  return (
    <p
      className={`font-mono text-[12px] font-medium uppercase tracking-[0.48px] ${tone === "accent" ? "text-accent" : "text-accent-text"}`}
    >
      {children}
    </p>
  );
}

/** Small mono label used on cards and in the matrix. */
export function Label({ children, size = 11 }: { children: React.ReactNode; size?: 10 | 11 }) {
  return (
    <p
      className={`font-mono font-medium uppercase text-muted ${size === 10 ? "text-[10px] tracking-[0.4px]" : "text-[11px] tracking-[0.44px]"}`}
    >
      {children}
    </p>
  );
}
