// One scope of one scheme: the five method questions, its tokens and its usage rules.
import type { Metadata } from "next";
import { ComponentsScopeView } from "@/components/components-scope";
import { ScopeView } from "@/components/scope-view";
import { componentsPage } from "@/lib/inventory";
import { scopePage } from "@/lib/scope";
import { grammar, schemeIds, scheme } from "@/lib/schemes";

export function generateStaticParams() {
  const scopes = grammar().scopes.map((s) => s.id);
  return schemeIds().flatMap((id) => scopes.map((scope) => ({ id, scope })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; scope: string }>;
}): Promise<Metadata> {
  const { id, scope } = await params;
  const title = grammar().scopes.find((s) => s.id === scope)!.title;
  return {
    title: `${title} · ${scheme(id).name}`,
    description: `${scheme(id).name}'s answers to the five ${title.toLowerCase()} questions, with reasons, tokens and usage rules.`,
  };
}

export default async function ScopePageRoute({
  params,
}: {
  params: Promise<{ id: string; scope: string }>;
}) {
  const { id, scope } = await params;
  // Components is told as an inventory with its cascade; the other scopes share one template.
  if (scope === "components") return <ComponentsScopeView p={componentsPage(id)} />;
  return <ScopeView p={scopePage(id, scope)} />;
}
