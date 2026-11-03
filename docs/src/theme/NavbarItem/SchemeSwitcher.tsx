import React, { useEffect, useState } from "react";
import { useHistory } from "@docusaurus/router";
import { useScheme } from "../../components/scheme";

// Swaps the scheme and keeps the page: /dense-data/components/button becomes
// /content-first/components/button. Every scheme has the same pages (the harness checks it), so the
// switch never lands on a missing one. Multi-brand also picks a brand.
export default function SchemeSwitcher({ mobile }: { mobile?: boolean }) {
  const { schemes, current, rest } = useScheme();
  const history = useHistory();
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
      <label>
        <span>Scheme</span>
        <select
          aria-label="Scheme"
          value={current?.id ?? ""}
          onChange={(e) => history.push(`/${e.target.value}/${rest}`)}
        >
          {!current && (
            <option value="" disabled>
              Pick a scheme
            </option>
          )}
          {schemes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      {brands.length > 0 && (
        <label>
          <span>Brand</span>
          <select aria-label="Brand" value={brand} onChange={(e) => pickBrand(e.target.value)}>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b[0].toUpperCase() + b.slice(1)}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
