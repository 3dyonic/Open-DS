import type { Metadata, Viewport } from "next";
import { SiteFooter, SiteNav } from "@/components/chrome";
import { ConsentBanner } from "@/components/consent";
import { THEME_SCRIPT } from "@/lib/theme";
import { brandName, brandTagline, openGraphBase, siteUrl } from "@/lib/brand";
import "./globals.css";

const TITLE = `${brandName}: design systems as answered questions`;

// Absolute links (Open Graph, canonical, sitemap) use brand.json's url, or SITE_URL at build time.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: TITLE, template: `%s · ${brandName}` },
  description: brandTagline,
  applicationName: brandName,
  keywords: [
    "design system",
    "design tokens",
    "Style Dictionary",
    "shadcn",
    "Storybook",
    "Docusaurus",
    "AI agents",
  ],
  openGraph: { ...openGraphBase, title: TITLE, description: brandTagline },
  twitter: { card: "summary_large_image", title: TITLE, description: brandTagline },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2e9" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1914" },
  ],
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;700&family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Poppins:wght@400;600;700&family=Source+Serif+4:wght@400;600&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The theme script sets data-theme on <html> before React loads, so React must not flag it.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteNav />
        <main id="content">{children}</main>
        <SiteFooter />
        <ConsentBanner />
      </body>
    </html>
  );
}
