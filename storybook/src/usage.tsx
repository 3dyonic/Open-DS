// Shows the active scheme's when-to-use rules for the situations a component serves.
import grammar from "../../schemes/grammar.json";
import { useScheme } from "./scheme-context";
import { SCHEMES } from "./schemes";

const TITLES = Object.fromEntries(grammar.situations.map((s) => [s.id, s.title]));

export function Usage({ situations }: { situations: string[] }) {
  const { scheme } = useScheme();
  const s = SCHEMES[scheme] ?? SCHEMES["dense-data"];
  const rules = s.usage.filter((u) => situations.includes(u.situation));
  if (!rules.length) return null;
  return (
    <section className="mt-[var(--space-gap-section)] max-w-3xl border-t-[length:var(--border-width-default)] border-[var(--color-border-default)] pt-[var(--space-gap-group)]">
      <h2 className="mb-[var(--space-gap-default)] [font-family:var(--type-heading-font-family)] text-[length:var(--type-heading-font-size)] [font-weight:var(--type-heading-font-weight)]">
        When to use · {s.name}
      </h2>
      <dl className="grid gap-[var(--space-gap-group)]">
        {rules.map((r) => (
          <div key={r.situation}>
            <dt className="[font-weight:var(--type-label-font-weight)]">{TITLES[r.situation]}</dt>
            <dd className="text-[var(--color-text-secondary)]">
              Use {r.use}. Avoid: {r.not}. {r.why}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
