import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

// A scheme's robot: a member of the Open DS robot family, painted in Google Stitch in the
// family style, doing its scheme's job. Two editions, cut out to transparent WebP in static/robots/:
// a daytime one (<id>.webp) and a nocturnal one (<id>-dark.webp). The site theme picks the edition.
export const ROBOT_ALT: Record<string, string> = {
  "dense-data": "A tin robot with a jeweller's loupe scans a long printout at a desk of tiny glowing screens.",
  "content-first": "A tin robot reads a thick navy book in an armchair under a lamp, with a cup of tea.",
  "accessible-first": "A big tin robot with large blue buttons kneels to help a small robot up a wooden ramp.",
  "brand-expressive": "A tin robot leaps with a brass megaphone through pink confetti and streamers.",
  "multi-brand": "A tin robot with a paintbrush beside three identical small robots painted teal, violet and orange.",
  slumber: "Slumber, a tin robot, sits curled up asleep with its wind-up key run down.",
};

export function Robot({ id, className = "" }: { id: string; className?: string }) {
  const day = useBaseUrl(`/robots/${id}.webp`);
  const night = useBaseUrl(`/robots/${id}-dark.webp`);
  const alt = ROBOT_ALT[id] ?? "";
  return (
    <span className={`ods-robot ${className}`}>
      <img className="ods-robot-day" src={day} alt={alt} loading="lazy" decoding="async" />
      <img className="ods-robot-night" src={night} alt={alt} loading="lazy" decoding="async" />
    </span>
  );
}
