// The primitives (option tokens) of one scheme, in one place.
import type { Metadata } from "next";
import { PrimitivesView } from "@/components/primitives-view";
import { primitivesPage } from "@/lib/primitives";
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
    title: `Primitives · ${scheme(id).name}`,
    description: `Every primitive (option token) of ${scheme(id).name}, its value and the decision tokens that use it.`,
  };
}

export default async function PrimitivesRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PrimitivesView p={primitivesPage(id)} />;
}
