import type { Metadata, Viewport } from "next";
import { SiteFooter, SiteNav } from "@/components/chrome";
import { brandName, brandTagline, siteUrl } from "@/lib/brand";
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brandName,
    title: TITLE,
    description: brandTagline,
    url: "/",
    locale: "en",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: brandTagline },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#16140f" };

const FONTS =
  "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;700&family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Poppins:wght@400;600;700&family=Source+Serif+4:wght@400;600&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
      </body>
    </html>
  );
}
