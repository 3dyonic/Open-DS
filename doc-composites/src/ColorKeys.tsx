/**
 * ColorKeys: the key colors of a scheme as a band, each block in its own color with its name and
 * token, each a block of the Swatch base form. The data follows doc-composites/schemas/color-keys.schema.json;
 * the page holds one line: ::color-keys{id="default"}
 */
import * as React from "react";
import Swatch from "./base/Swatch";

export type ColorKeysData = { keys: { name: string; token: string; value: string }[] };

export default function ColorKeys({ data }: { data: ColorKeysData }) {
  return (
    <div
      data-composite="color-keys"
      className="grid grid-cols-2 overflow-hidden rounded-[var(--radius-container)] sm:grid-cols-3 lg:grid-cols-6"
    >
      {data.keys.map((k) => (
        <Swatch key={k.token} color={k.value} size="block">
          <span className="flex flex-col text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-on-action)]">
            <b>{k.name}</b>
            <span className="[font-family:var(--type-data-font-family)]">{k.token}</span>
          </span>
        </Swatch>
      ))}
    </div>
  );
}
