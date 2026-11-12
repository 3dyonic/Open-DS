/**
 * Measured: a sentence with contrast ratios in it. A base form: the anatomy steps and the decision
 * answers extend it. The data keeps each ratio as a number, between the words around it; the form
 * writes it the way people read a ratio, 7.26:1.
 */
import * as React from "react";

export type MeasuredText = (string | { ratio: number })[];

export const measuredText = (parts: MeasuredText) =>
  parts.map((p) => (typeof p === "string" ? p : `${p.ratio}:1`)).join("");

export default function Measured({ parts }: { parts: MeasuredText }) {
  return <>{measuredText(parts)}</>;
}
