import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/chrome";
import { brandCopy, brandName } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${brandName}: design systems as answered questions`,
    template: `%s · ${brandName}`,
  },
  description: brandCopy.tagline,
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;700&family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Poppins:wght@400;600;700&family=Source+Serif+4:wght@400;600&display=swap";

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
        <SiteNav />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
