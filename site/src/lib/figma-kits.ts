// The Figma kit of each scheme (OD-149), from figma/kits.json. A scheme without a kit shows no link.
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Kits = { kits: Record<string, string> };

export function figmaKit(id: string): string | null {
  const file = join(process.cwd(), "..", "figma", "kits.json");
  try {
    return (JSON.parse(readFileSync(file, "utf8")) as Kits).kits[id] ?? null;
  } catch {
    return null;
  }
}
