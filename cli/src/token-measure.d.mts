// Types for token-measure.mjs, for the docs' Token map page that imports it (OD-274).
export interface MeasureLine {
  text: string;
  /** The guideline the line checks, for a tooltip or small text. */
  rule?: string;
  /** Whether the value reaches the level the line names. */
  met?: boolean;
}
export const PX_PER_REM: number;
export const BACKGROUNDS: string[];
export function parseHex(value: string | null | undefined): { r: number; g: number; b: number; a: number } | null;
export function contrastRatio(foreground: string, background: string): number | null;
export function ratioText(ratio: number): string;
export function toPx(value: string | null | undefined): number | null;
export function measure(
  token: { id: string; value: string | null; type?: string | null },
  context?: { backgrounds?: { id: string; value: string | null }[] },
): MeasureLine[];
