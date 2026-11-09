import React from "react";
import MDXComponents from "@theme-original/MDXComponents";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import useBaseUrl from "@docusaurus/useBaseUrl";
import CardGrid from "@open-ds/doc-composites/CardGrid";
import Intro from "@open-ds/doc-composites/Intro";
import Label from "@open-ds/doc-composites/Label";
import Preview from "@open-ds/doc-composites/Preview";
import ReasonChain from "@open-ds/doc-composites/ReasonChain";
import TokenTable from "@open-ds/doc-composites/TokenTable";

// The pages link to sections by id: a "Because" chip opens the answer card below it (#why-...).
// Docusaurus only registers headings as link targets, so it reported those links as broken though
// they work. A section with an id registers it, so the build checks these links like any other.
function Section(props: React.ComponentProps<"section">) {
  const links = useBrokenLinks();
  if (props.id) links.collectAnchor(props.id);
  return <section {...props} />;
}

// A reason chain is a link target too (#why-...): it registers its anchor the same way.
function LinkedReasonChain(props: React.ComponentProps<typeof ReasonChain>) {
  useBrokenLinks().collectAnchor(props.data.anchor);
  return <ReasonChain {...props} />;
}

// An intro names its robot; the docs serve the robot's day and night pictures.
function RobotIntro({ robot, ...props }: Omit<React.ComponentProps<typeof Intro>, "robot"> & { robot?: string }) {
  const day = useBaseUrl(`/robots/${robot}.webp`);
  const night = useBaseUrl(`/robots/${robot}-dark.webp`);
  return <Intro {...props} robot={robot ? { day, night } : undefined} />;
}

// The composites the pages' directives name (src/remark/composites.mjs).
export default {
  ...MDXComponents,
  section: Section,
  CardGrid,
  Intro: RobotIntro,
  Label,
  Preview,
  ReasonChain: LinkedReasonChain,
  TokenTable,
};
