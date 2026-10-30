import type { Metadata } from "next";
import Link from "next/link";
import { brandCopy, brandName } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${brandName}: design systems as answered questions`,
    template: `%s · ${brandName}`,
  },
  description: brandCopy.tagline,
};

const links = [
  ["Schemes", "/schemes/"],
  ["Compare", "/compare/"],
  ["Take it", "/take/"],
];

const FONTS =
  "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:wght@400;600;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;700&family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Poppins:wght@400;600;700&family=Source+Serif+4:wght@400;600&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-lg font-extrabold">
              {brandName}
            </Link>
            <nav aria-label="Primary">
              <ul className="flex flex-wrap gap-5 font-mono text-sm">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      className="inline-flex min-h-6 items-center hover:text-accent-text"
                      href={href}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="content" className="mx-auto max-w-6xl px-4 py-10">
          {children}
        </main>
        <footer className="mx-auto max-w-6xl border-t border-line px-4 py-6 font-mono text-xs text-muted">
          All answers are drafts until curated. Open source, MIT.
        </footer>
      </body>
    </html>
  );
}
