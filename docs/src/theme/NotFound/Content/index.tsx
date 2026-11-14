import React from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import { Robot } from "../../../components/Robot";

// Page not found: Slumber, the sleeping robot from the Open DS site, as on the site's 404.
export default function NotFoundContent({ className }: { className?: string }) {
  return (
    <main className={`container margin-vert--xl ${className ?? ""}`}>
      <div className="ods-notfound">
        <Robot id="slumber" className="ods-notfound-robot" />
        <Heading as="h1">Nothing here</Heading>
        <p>This page went to sleep. Pick a scheme from the top bar, or go back to every scheme.</p>
        <Link className="button button--primary" to="/">
          Every scheme
        </Link>
      </div>
    </main>
  );
}
