import React from "react";
import MDXComponents from "@theme-original/MDXComponents";
import useBrokenLinks from "@docusaurus/useBrokenLinks";

// The pages link to sections by id: a "Because" chip opens the answer card below it (#why-...).
// Docusaurus only registers headings as link targets, so it reported those links as broken though
// they work. A section with an id registers it, so the build checks these links like any other.
function Section(props: React.ComponentProps<"section">) {
  const links = useBrokenLinks();
  if (props.id) links.collectAnchor(props.id);
  return <section {...props} />;
}

export default { ...MDXComponents, section: Section };
