// Motion: reduced-motion CSS keeps no transform, translate, scale or rotate, and every
// duration stays within its family's cap.
import { RELATION_LIST } from "../relations.mjs";
import { relationMeasure } from "./invariants.mjs";
import { countBy, measureOf } from "./measure.mjs";

export const FAMILY = "motion";

export function measure(snapshot) {
  const moving = snapshot.ui?.reducedMotion ?? [];
  return [
    measureOf({
      id: "motion.reduced-motion-transforms",
      family: FAMILY,
      title: "Transforms that still move under prefers-reduced-motion: reduce",
      direction: "down",
      value: snapshot.ui ? moving.length : null,
      parts: countBy(moving, (m) => m.file),
      details: moving.map((m) => `${m.file}:${m.line} ${m.text}`),
    }),
    relationMeasure(snapshot, RELATION_LIST.find((r) => r.id === "duration-caps")),
  ];
}
