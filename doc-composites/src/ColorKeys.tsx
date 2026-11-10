/**
 * ColorKeys: the key colors of a scheme as a band, each block in its own color with its name and
 * token. The blocks are drawings of values. The data follows doc-composites/schemas/color-keys.schema.json;
 * the page holds one line: ::color-keys{id="default"}
 */
import * as React from "react";

export type ColorKeysData = { keys: { name: string; token: string; value: string }[] };

export default function ColorKeys({ data }: { data: ColorKeysData }) {
  return (
    <div
      data-composite="color-keys"
      className="grid grid-cols-2 overflow-hidden rounded-[var(--radius-container)] sm:grid-cols-3 lg:grid-cols-6"
    >
      {data.keys.map((k) => (
        <div
          key={k.token}
          className="flex min-h-28 flex-col justify-end p-[var(--space-gap-default)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-on-action)]"
          style={{ background: k.value }}
        >
          <b>{k.name}</b>
          <span className="[font-family:var(--type-data-font-family)]">{k.token}</span>
        </div>
      ))}
    </div>
  );
}
