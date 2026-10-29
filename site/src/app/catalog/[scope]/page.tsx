import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { packById, packList } from "@/lib/data";

export function generateStaticParams() {
  return packList.map((pack) => ({ scope: pack.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scope: string }>;
}): Promise<Metadata> {
  const { scope } = await params;
  const pack = packById(scope);
  return { title: pack?.title ?? "Catalog" };
}

export default async function ScopePage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  const pack = packById(scope);
  if (!pack) notFound();
  return (
    <div className="grid gap-6">
      <p className="text-sm">
        <Link href="/catalog/">Catalog</Link>
      </p>
      <h1 className="text-3xl font-semibold">{pack.title}</h1>
      <p>{pack.summary}</p>
      <ul className="grid gap-3">
        {pack.questions.map((question) => (
          <li key={question.id} className="rounded-control border border-line p-4">
            <h2 className="font-semibold">
              <Link href={`/catalog/${pack.id}/${question.id}/`}>{question.prompt}</Link>
            </h2>
            <p className="mt-1 text-sm text-muted">{question.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
