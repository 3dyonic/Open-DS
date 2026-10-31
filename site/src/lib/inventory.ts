// The Components scope of one scheme, told as a cascade: the reasons, the five components answers
// and what each did to the inventory, and the components in it with their reasons.
import { scopePage } from "@/lib/scope";
import { grammar, scheme } from "@/lib/schemes";

type Item = { id: string; family: string; description: string };
type Pick = { id: string; why: string };
interface Catalogue {
  families: { id: string; description: string }[];
  roles: Record<string, string[] | string>;
  items: Item[];
}

const title = (id: string) => id.charAt(0).toUpperCase() + id.slice(1).replaceAll("-", " ");

export function componentsPage(schemeId: string) {
  const g = grammar() as unknown as {
    catalogue: Catalogue;
    scopes: {
      id: string;
      questions: { id: string; options: { id: string; label: string; description?: string }[] }[];
    }[];
  };
  const s = scheme(schemeId) as unknown as {
    name: string;
    inventory: { in: Pick[]; out: Pick[] };
    answers: { question: string; option: string }[];
  };
  const base = scopePage(schemeId, "components");
  const cat = g.catalogue;
  const option = (q: string) => s.answers.find((a) => a.question === q)!.option;
  const label = (q: string) =>
    g.scopes
      .find((x) => x.id === "components")!
      .questions.find((x) => x.id === q)!
      .options.find((o) => o.id === option(q))!.label;
  const rolesOption = option("components.roles");
  const families = (cat.roles[rolesOption] as string[]) ?? [];
  const familyOf = Object.fromEntries(cat.items.map((i) => [i.id, i.family]));
  const inIds = new Set(s.inventory.in.map((i) => i.id));
  const countOption = g.scopes
    .find((x) => x.id === "components")!
    .questions.find((q) => q.id === "components.count")!
    .options.find((o) => o.id === option("components.count"))!;

  // What each answer did to the inventory, in plain words.
  const effect: Record<string, string> = {
    "components.roles": `Admits ${families.length} families: ${families.join(", ")}.`,
    "components.count": `${countOption.description ?? countOption.label} ${s.name} carries ${inIds.size}.`,
    "components.definition": "Every component in the list above names the need it meets.",
    "components.values": `${label("components.values")} variants per component: the components above keep to them.`,
    "components.lands": `Most components above serve ${label("components.lands").toLowerCase()}.`,
  };

  const groups = cat.families
    .filter((f) => s.inventory.in.some((i) => familyOf[i.id] === f.id))
    .map((f) => ({
      id: f.id,
      title: title(f.id),
      description: f.description,
      items: s.inventory.in
        .filter((i) => familyOf[i.id] === f.id)
        .map((i) => ({ id: i.id, name: title(i.id), why: i.why })),
    }));

  const patterns = (
    (cat as unknown as { patterns?: { id: string; built_from: string[] }[] }).patterns ?? []
  )
    .map((pt) => ({
      pt,
      pick: (s.inventory as { patterns?: Pick[] }).patterns?.find((x) => x.id === pt.id),
    }))
    .filter((x) => x.pick)
    .map(({ pt, pick }) => ({
      id: pt.id,
      name: title(pt.id),
      why: pick!.why,
      parts: pt.built_from.map(title),
    }));

  return {
    scheme: base.scheme,
    patterns,
    reasons: base.reasons,
    questions: base.questions.map((q) => ({ ...q, effect: effect[q.id] ?? "" })),
    total: cat.items.length,
    count: inIds.size,
    groups,
    line: `${s.name} carries ${inIds.size} of ${cat.items.length} components: ${label("components.roles").toLowerCase()}, each admitted because ${label("components.definition").toLowerCase()}.`,
  };
}

export type ComponentsPage = ReturnType<typeof componentsPage>;
