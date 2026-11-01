// The terms for the hosted service during the Beta (OD-173), in plain words. The code is MIT; these
// terms are about keys and the hosted MCP server.
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { brandName } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for Open DS keys and the hosted MCP server during the Beta.",
};

const UPDATED = "2026-11-01";

const TERMS: [string, string][] = [
  [
    "It is a Beta",
    "The hosted service is new and changes often. It can be slow, change or stop, and we give no warranty or promise that it is always available. It is free during the Beta.",
  ],
  [
    "Invitations are limited",
    "We approve key requests by hand and in limited numbers. We can say no without giving a reason.",
  ],
  [
    "Your key is yours",
    "Keep your key private and do not share it. It identifies you to the hosted MCP server. If it leaks, ask us for a fresh one and we revoke the old one.",
  ],
  [
    "Fair use",
    "Do not use the service to harm it or others, to overload it, or to get around a revoked key. We can limit or revoke a key that breaks these terms.",
  ],
  [
    "The code is open",
    "The Open DS code, schemes, tokens and components are MIT licensed. What you build with them is yours. These terms cover only keys and the hosted server.",
  ],
  ["Privacy", "What we keep and why is in the privacy policy."],
  [
    "Changes",
    "If we change these terms, we change this page first and update the date at the top.",
  ],
];

export default function TermsPage() {
  return (
    <article className="flex max-w-[820px] flex-col gap-10 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <Eyebrow>Terms</Eyebrow>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
          Terms for the Beta
        </h1>
        <p className="text-[19px] leading-[1.45] text-body">
          For {brandName} keys and the hosted MCP server at open-ds.dev.
        </p>
        <p className="font-mono text-[13px] text-muted">Updated {UPDATED}</p>
      </header>
      <ol className="flex flex-col gap-6">
        {TERMS.map(([title, text], i) => (
          <li key={title} className="flex gap-4">
            <span className="font-mono text-[15px] text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-[20px] font-extrabold">{title}</h2>
              <p className="text-[17px] leading-[1.55] text-body">
                {title === "Privacy" ? (
                  <>
                    What we keep and why is in the{" "}
                    <Link href="/privacy/" className="font-semibold text-accent-text underline">
                      privacy policy
                    </Link>
                    .
                  </>
                ) : (
                  text
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
