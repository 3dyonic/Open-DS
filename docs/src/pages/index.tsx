import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { useScheme } from "../components/scheme";

// The landing page: the five schemes. Each card opens that scheme's docs; the switcher then moves
// between them on any page.
export default function Home() {
  const { schemes } = useScheme();
  return (
    <Layout title="Every scheme" description="Every Open DS scheme, each documented as the design system it builds.">
      <main className="ods-home">
        <h1>Every design system is a set of answers.</h1>
        <p className="ods-home-lede">
          Each scheme answers the same questions, with a reason for every answer. Pick one to read its docs, then switch
          schemes from the top bar on any page to see the same page answered differently.
        </p>
        <div className="ods-home-grid">
          {schemes.map((s) => (
            <Link key={s.id} className="ods-home-card" to={`/${s.id}/`} data-scheme-card={s.id}>
              <span className="ods-home-name">{s.name}</span>
              <span className="ods-home-summary">{s.summary}</span>
              <span className="ods-home-meta">
                v{s.version}
                {s.brands.length > 1 ? ` · ${s.brands.length} brands` : ""}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
