// The site's nav, footer and mark, from the Figma Home frame (115:900).
import Link from "next/link";
import { brandName } from "@/lib/brand";
import { ThemeSwitch } from "@/components/theme-switch";

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

// The source repository.
const GITHUB = "https://github.com/3dyonic/Open-DS";

function GitHubIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-[20px]" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

const LINKS: [string, string][] = [
  ["Schemes", "/schemes/"],
  ["Questions", "/questions/"],
  ["Install", "/install/"],
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
            <a
              href={GITHUB}
              aria-label={`${brandName} on GitHub`}
              title="GitHub"
              rel="noopener"
              className="flex size-[40px] items-center justify-center hover:text-accent-text"
            >
              <GitHubIcon />
            </a>
          </li>
          <li>
            <ThemeSwitch />
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
      <ul className="flex flex-wrap items-center gap-6">
        {[
          ["Get a key", "/key/"],
          ["Privacy", "/privacy/"],
          ["Terms", "/terms/"],
          ["Health", "/health/"],
          ["Contribute", "/contribute/"],
        ].map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
        <li>
          <a href="https://3dyonic.com" className="hover:text-ink" rel="noopener">
            A 3dyonic project
          </a>
        </li>
      </ul>
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

/** Swatches for legends. Each matches what it explains on the page. */
export const Swatch = {
  // A reason card that matters most: dark border, orange square.
  reasonTop: (
    <span className="flex size-[18px] items-center justify-center rounded-[3px] border border-ink bg-white">
      <span className="size-[8px] bg-accent" />
    </span>
  ),
  // Any other reason card: light border, grey square.
  reasonOther: (
    <span className="flex size-[18px] items-center justify-center rounded-[3px] border border-line bg-white">
      <span className="size-[8px] bg-tag" />
    </span>
  ),
  // An answer cell only this scheme gives.
  answerOwn: <span className="block size-[18px] rounded-[3px] border border-accent bg-accent" />,
  // An answer cell other schemes share.
  answerShared: <span className="block size-[18px] rounded-[3px] border border-line bg-paper" />,
  // A count cell: this scheme, or room other schemes use.
  countOn: <span className="block size-[18px] bg-accent" />,
  countOff: <span className="block size-[18px] bg-tag" />,
};

export { Legend } from "./legend";
