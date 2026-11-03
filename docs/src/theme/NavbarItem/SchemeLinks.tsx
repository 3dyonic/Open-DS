import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useScheme } from "../../components/scheme";

// The sections of the scheme you are on. On the landing page they open the first scheme.
const SECTIONS = [
  ["Primitives", "primitives/"],
  ["Foundations", "foundations/"],
  ["Components", "components/inventory"],
  ["Voice", "voice"],
  ["Themes", "themes"],
  ["For agents", "agents"],
];

export default function SchemeLinks({ mobile }: { mobile?: boolean }) {
  const { schemes, current } = useScheme();
  const id = (current ?? schemes[0]).id;
  const llms = useBaseUrl(`/${id}/llms.txt`);
  const cls = mobile ? "menu__link" : "navbar__item navbar__link";
  const items = [
    ...SECTIONS.map(([label, path]) => (
      <Link key={label} className={cls} to={`/${id}/${path}`}>
        {label}
      </Link>
    )),
    <a key="llms" className={cls} href={llms}>
      llms.txt
    </a>,
  ];
  return mobile ? (
    <>
      {items.map((it, i) => (
        <li key={i} className="menu__list-item">
          {it}
        </li>
      ))}
    </>
  ) : (
    <>{items}</>
  );
}
