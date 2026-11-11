import React, { useEffect, useState } from "react";
import { useHistory } from "@docusaurus/router";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { useScheme } from "../../components/scheme";
import { Picker } from "../../components/Picker";

// Swaps the scheme and keeps the page: /dense-data/components/button becomes
// /content-first/components/button. Every scheme has the same pages (the harness checks it), so the
// switch never lands on a missing one. Multi-brand also picks a brand.
// The pickers are listboxes from the scheme's own tokens, never a native select (Picker).
export default function SchemeSwitcher({ mobile }: { mobile?: boolean }) {
  const { schemes, current, rest } = useScheme();
  const history = useHistory();
  const { withBaseUrl } = useBaseUrlUtils();
  const [brand, setBrand] = useState("aster");
  useEffect(() => {
    try {
      setBrand(localStorage.getItem("open-ds-brand") ?? "aster");
    } catch {
      /* private window: keep the first brand */
    }
  }, []);
  const pickBrand = (b: string) => {
    setBrand(b);
    document.documentElement.setAttribute("data-brand", b);
    try {
      localStorage.setItem("open-ds-brand", b);
    } catch {
      /* not kept; the page still switches */
    }
  };
  const brands = current?.brands.length && current.brands.length > 1 ? current.brands : [];
  return (
    <div className={`ods-switcher${mobile ? " ods-switcher--mobile" : ""}`}>
      <Picker
        label="Scheme"
        value={current?.id ?? ""}
        options={schemes.map((s) => ({ id: s.id, label: s.name }))}
        onPick={(id) => history.push(withBaseUrl(`/${id}/${rest}`))}
      />
      {brands.length > 0 && (
        <Picker
          label="Brand"
          value={brand}
          options={brands.map((b) => ({ id: b, label: b[0].toUpperCase() + b.slice(1) }))}
          onPick={pickBrand}
        />
      )}
    </div>
  );
}
