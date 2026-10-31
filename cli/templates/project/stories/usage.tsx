// Shows this design system's when-to-use rules for the situations a component serves.
import scheme from "../scheme.json";
import situations from "../.open-ds/situations.json";

const TITLES: Record<string, string> = Object.fromEntries(
  situations.map((s) => [s.id, s.title]),
);

export function Usage({ situations: ids }: { situations: string[] }) {
  const rules = scheme.usage.filter((u) => ids.includes(u.situation));
  if (!rules.length) return null;
  return (
    <section className="mt-[var(--space-gap-section)] max-w-3xl border-t-[length:var(--border-width-default)] border-[var(--color-border-default)] pt-[var(--space-gap-group)]">
      <h2 className="mb-[var(--space-gap-default)] [font-family:var(--type-heading-font-family)] text-[length:var(--type-heading-font-size)] [font-weight:var(--type-heading-font-weight)]">
        When to use
      </h2>
      <dl className="grid gap-[var(--space-gap-group)]">
        {rules.map((r) => (
          <div key={r.situation}>
            <dt className="[font-weight:var(--type-label-font-weight)]">
              {TITLES[r.situation]}
            </dt>
            <dd className="text-[var(--color-text-secondary)]">
              Use {r.use}. Avoid: {r.not}. {r.why}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
