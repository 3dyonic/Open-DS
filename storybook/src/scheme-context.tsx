import { createContext, useContext } from "react";

/** The toolbar choices: every scheme, and every brand of multi-brand. */
export const THEMES = [
  { value: "dense-data", title: "Dense data" },
  { value: "content-first", title: "Content first" },
  { value: "accessible-first", title: "Accessible first" },
  { value: "multi-brand--aster", title: "Multi-brand · Aster" },
  { value: "multi-brand--birch", title: "Multi-brand · Birch" },
  { value: "multi-brand--coral", title: "Multi-brand · Coral" },
  { value: "brand-expressive", title: "Brand expressive" },
];

export interface SchemeChoice {
  scheme: string;
  brand?: string;
  mode: "light" | "dark";
}

export const SchemeContext = createContext<SchemeChoice>({ scheme: "dense-data", mode: "light" });
export const useScheme = () => useContext(SchemeContext);
