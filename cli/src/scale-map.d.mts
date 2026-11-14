// Types for scale-map.mjs, for the Storybook guide that imports it.
export type Lane = "fill" | "edge" | "text";
export const LANES: readonly { id: Lane; title: string }[];
export function laneOf(token: string): Lane;
export function follow(
  tokens: any,
  brandKey: string,
  mode: string,
  path: string,
): { prim: string; via: string | null } | null;
export interface Landing {
  token: string;
  path: string;
  via: string | null;
}
export function scaleMap(
  tokens: any,
  brandKey: string,
  mode: string,
): Record<string, Landing[]>;
export interface ScaleStep {
  step: string;
  primitive: string;
  value: string | null;
  tokens: { token: string; lane: Lane; via: string | null }[];
}
export function scales(
  scheme: any,
  options?: {
    brand?: string;
    mode?: "light" | "dark";
    hue?: string;
    hints?: any[];
  },
): {
  scheme: string;
  brand: string;
  mode: "light" | "dark";
  neutral: any;
  lanes: readonly { id: Lane; title: string }[];
  hints: any[];
  hues: {
    hue: string;
    used: number;
    steps: ScaleStep[];
    fixed: (ScaleStep["tokens"][number] & {
      primitive: string;
      value: string | null;
    })[];
  }[];
};
