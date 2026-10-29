import type { Option, Pack, Question } from "@/lib/data";
import { packs } from "@/lib/data";

export function materialize(raw: Question): Question {
  if (!raw.ref) return raw;
  const gid = raw.ref.split(":")[1];
  const base = packs.global.questions.find((item) => item.id === gid);
  if (!base) return raw;
  const options = new Map((base.options || []).map((item) => [item.id, item]));
  const order = (base.options || []).map((item) => item.id);
  for (const override of raw.overrides || []) {
    if (!order.includes(override.id)) order.push(override.id);
    options.set(override.id, override);
  }
  return {
    ...base,
    id: raw.id,
    prompt: raw.prompt || base.prompt,
    summary: raw.summary || base.summary,
    ref: raw.ref,
    options: order.map((id) => options.get(id) as Option),
  };
}

export function questionsIn(pack: Pack): Question[] {
  return pack.questions.map((question) => (question.ref ? materialize(question) : question));
}
