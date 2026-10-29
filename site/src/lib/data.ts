import brand from "../../../brand.json";
import accessibility from "../../../packs/accessibility.json";
import colorPrimitives from "../../../packs/color-primitives.json";
import delivery from "../../../packs/delivery.json";
import globalPack from "../../../packs/global.json";
import purpose from "../../../packs/purpose.json";
import radius from "../../../packs/radius.json";
import spacing from "../../../packs/spacing.json";
import theming from "../../../packs/theming.json";
import typography from "../../../packs/typography.json";
import manifest from "../../../boilerplates/3dyonic/manifest.json";
import recipe from "../../../recipes/3dyonic.json";

export type Pack = {
  id: string;
  title: string;
  summary: string;
  scope: string;
  order: number;
  questions: Question[];
};

export type Question = {
  id: string;
  prompt: string;
  summary: string;
  required?: boolean;
  ref?: string;
  options?: Option[];
  overrides?: Option[];
  affects?: string[];
  feeds_into?: string[];
  why_care?: string;
};

export type Effect = { question: string; option?: string; reason: string };

export type Option = {
  id: string;
  label: string;
  summary: string;
  why: string;
  when_to_choose: string;
  trade_offs: string[];
  sources: { name: string; title: string; url: string }[];
  evidence_limited?: boolean;
  formula?: string;
  parameters?: { id: string; type: string; required: boolean; summary: string; pattern?: string }[];
  recommends?: Effect[];
  discourages?: Effect[];
  requires?: Effect[];
  fragment?: string;
};

export const brandName = brand.name;
export const brandCopy = brand;

export const packs: Record<string, Pack> = {
  purpose: purpose as Pack,
  global: globalPack as Pack,
  "color-primitives": colorPrimitives as Pack,
  accessibility: accessibility as Pack,
  typography: typography as Pack,
  spacing: spacing as Pack,
  radius: radius as Pack,
  theming: theming as Pack,
  delivery: delivery as Pack,
};

export const packList = Object.values(packs).sort((a, b) => a.order - b.order);
export const showcase = { recipe, manifest };

export function packById(id: string) {
  return packs[id];
}
