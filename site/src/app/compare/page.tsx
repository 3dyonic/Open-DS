// Compare, built from the Figma frame S07 Compare (128:900).
import type { Metadata } from "next";
import Link from "next/link";
import { CompareView } from "@/components/compare-view";
import { answerBook } from "@/lib/answers";

export const metadata: Metadata = {
  title: "Compare schemes",
  description:
    "Two schemes answer the same grammar. Every question where they differ, and why each answered the way it did.",
};

export default function ComparePage() {
  return (
    <div className="flex flex-col gap-8 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex gap-[10px] font-mono text-[12px] font-medium uppercase tracking-[0.48px]"
        >
          <Link href="/schemes/" className="text-muted">
            Schemes
          </Link>
          <span className="text-muted">/</span>
          <span className="text-accent-text">Compare</span>
        </nav>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
          Same questions. Different answers.
        </h1>
        <p className="max-w-[900px] text-[19px] leading-[1.45] text-[#3e3a31]">
          Two schemes answer the same grammar. Here is every question where they differ, and why
          each one answered the way it did. The tokens follow, so they are not shown.
        </p>
      </header>
      <CompareView book={answerBook()} />
    </div>
  );
}
