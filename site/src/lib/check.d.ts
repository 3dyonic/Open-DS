export type Finding = {
  id: string;
  severity: string;
  message: string;
  question?: string;
  scheme?: string;
  option?: string;
  targetQuestion?: string;
  targetOption?: string;
  reason?: string;
  because?: string;
};

export type CheckResult = {
  ok: boolean;
  findings: Finding[];
  fingerprint?: string;
};

export function canonicalRecipe(recipe: object): string;
export function shareCode(recipe: object): string;
export function checkRecipe(recipe: object, packs: object): Promise<CheckResult>;
export function missingQuestionReport(findings: Finding[]): { summary: string; lines: string[] };
export function fingerprintRecipe(recipe: object): Promise<string>;
