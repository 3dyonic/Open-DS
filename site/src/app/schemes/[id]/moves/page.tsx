// What moves, built from the Figma frame S08 What moves (128:1261).
import type { Metadata } from "next";
import Link from "next/link";
import { MovesView } from "@/components/moves-view";
import { answerBook, bestStart } from "@/lib/answers";
import { scheme, schemeIds } from "@/lib/schemes";

export function generateStaticParams() {
  return schemeIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `What moves · ${scheme(id).name}`,
    description: "Change one answer and see every answer, component and key that follows from it.",
  };
}

export default async function MovesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = scheme(id);
  const book = answerBook();
  const start = bestStart(book, id);
  return (
    <div className="flex flex-col gap-10 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex gap-[10px] font-mono text-[12px] font-medium uppercase tracking-[0.48px]"
        >
          <Link href="/schemes/" className="text-muted">
            Schemes
          </Link>
          <span className="text-muted">/</span>
          <Link href={`/schemes/${id}/`} className="text-accent-text">
            {s.name}
          </Link>
          <span className="text-accent-text">/ What moves</span>
        </nav>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
          Change one answer. See what moves.
        </h1>
        <p className="max-w-[880px] text-[19px] leading-[1.45] text-[#3e3a31]">
          A design system that knows why it is the way it is can tell you what to change when the
          why changes. Pick an answer and a new option.
        </p>
      </header>
      <MovesView book={book} schemeId={id} start={start} />
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/schemes/${id}/`}
          className="flex items-center gap-[10px] rounded-[4px] bg-ink px-5 py-[14px] text-[17px] font-semibold text-paper"
        >
          <span aria-hidden className="size-[8px] bg-accent" />
          Back to {s.name}
        </Link>
        <Link
          href="/compare/"
          className="rounded-[4px] border border-ink px-5 py-[14px] text-[17px] font-semibold"
        >
          Compare the schemes
        </Link>
      </div>
    </div>
  );
}
