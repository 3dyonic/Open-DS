// Small pieces of the site's own look (brand route B), separate from the scheme components.
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-wider text-muted">{children}</p>;
}

export function Chip({
  children,
  tone = "plain",
}: {
  children: React.ReactNode;
  tone?: "plain" | "accent" | "ink";
}) {
  const tones = {
    plain: "bg-tag text-ink",
    accent: "bg-accent-soft text-accent-text",
    ink: "bg-ink text-paper",
  };
  return (
    <span className={`inline-flex rounded px-2 py-0.5 font-mono text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Command({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-ink p-4 font-mono text-sm text-paper">
      <code>{children}</code>
    </pre>
  );
}
