// /llms.txt: the repository's llms.txt, for agents and LLMs, served as plain text.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-static";

export function GET() {
  const text = readFileSync(join(process.cwd(), "..", "llms.txt"), "utf8");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
