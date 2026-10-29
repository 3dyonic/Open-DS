import type { Metadata } from "next";
import Link from "next/link";
import { brandCopy, brandName } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `Home · ${brandName}`,
    template: `%s · ${brandName}`,
  },
  description: brandCopy.tagline,
};

const links = [
  ["Catalog", "/catalog/"],
  ["Build", "/build/"],
  ["Recipes", "/recipes/"],
  ["Docs", "/docs/"],
  ["Case study", "/case-study/"],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-lg font-semibold">
              {brandName}
            </Link>
            <nav aria-label="Primary">
              <ul className="flex flex-wrap gap-4 text-sm">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link className="inline-flex min-h-6 items-center" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="content" className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
