import React from "react";
import MDXComponents from "@theme-original/MDXComponents";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import useBaseUrl from "@docusaurus/useBaseUrl";
import AnatomyDrawing from "@open-ds/doc-composites/AnatomyDrawing";
import BrandSet from "@open-ds/doc-composites/BrandSet";
import CardGrid from "@open-ds/doc-composites/CardGrid";
import Hero from "@open-ds/doc-composites/Hero";
import Intro from "@open-ds/doc-composites/Intro";
import ColorScale from "@open-ds/doc-composites/ColorScale";
import Fold from "@open-ds/doc-composites/Fold";
import Grid from "@open-ds/doc-composites/Grid";
import Label from "@open-ds/doc-composites/Label";
import ModePreview from "@open-ds/doc-composites/ModePreview";
import PairsChart from "@open-ds/doc-composites/PairsChart";
import Panel from "@open-ds/doc-composites/Panel";
import Preview from "@open-ds/doc-composites/Preview";
import ReasonChain from "@open-ds/doc-composites/ReasonChain";
import SampleScreen from "@open-ds/doc-composites/SampleScreen";
import Sample from "@open-ds/doc-composites/Sample";
import Specimen from "@open-ds/doc-composites/Specimen";
import SurfaceStack from "@open-ds/doc-composites/SurfaceStack";
import TokenTable from "@open-ds/doc-composites/TokenTable";
import TokenSwatches from "@open-ds/doc-composites/TokenSwatches";
import TypeRoles from "@open-ds/doc-composites/TypeRoles";
import Steps from "@open-ds/doc-composites/Steps";
import DecisionTree from "@open-ds/doc-composites/DecisionTree";
import DecisionAnswer from "@open-ds/doc-composites/DecisionAnswer";
import Group from "@open-ds/doc-composites/Group";
import PrimitiveTable from "@open-ds/doc-composites/PrimitiveTable";

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

// A panel with an id is a link target (#part-...): it registers its anchor too.
function LinkedPanel(props: React.ComponentProps<typeof Panel> & { id?: string }) {
  const links = useBrokenLinks();
  if (props.id) links.collectAnchor(props.id);
  return <Panel {...props} />;
}

// A fold is a link target too (#people): the sidebar menu opens it.
function LinkedFold(props: React.ComponentProps<typeof Fold>) {
  useBrokenLinks().collectAnchor(props.id);
  return <Fold {...props} />;
}

// The home page's hero names its robot too.
function RobotHero({ robot, ...props }: Omit<React.ComponentProps<typeof Hero>, "robot"> & { robot?: string }) {
  const day = useBaseUrl(`/robots/${robot}.webp`);
  const night = useBaseUrl(`/robots/${robot}-dark.webp`);
  return <Hero {...props} robot={robot ? { day, night } : undefined} />;
}

// A color scale opens on the docs' own theme, light or dark.
// It reads the theme once the page is in the browser, then opens on it.
function useDocsMode() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  React.useEffect(() => setMode(document.documentElement.dataset.theme === "dark" ? "dark" : "light"), []);
  return mode;
}
function ThemedColorScale(props: React.ComponentProps<typeof ColorScale>) {
  const mode = useDocsMode();
  return <ColorScale key={mode} {...props} mode={mode} />;
}
// So does the pairs chart.
function ThemedPairsChart(props: React.ComponentProps<typeof PairsChart>) {
  const mode = useDocsMode();
  return <PairsChart key={mode} {...props} mode={mode} />;
}

// The composites the pages' directives name (src/remark/composites.mjs).
export default {
  ...MDXComponents,
  section: Section,
  AnatomyDrawing,
  BrandSet,
  CardGrid,
  ModePreview,
  PairsChart: ThemedPairsChart,
  Sample,
  SampleScreen,
  ColorScale: ThemedColorScale,
  Fold: LinkedFold,
  Grid,
  Panel: LinkedPanel,
  Hero: RobotHero,
  Intro: RobotIntro,
  Label,
  Preview,
  ReasonChain: LinkedReasonChain,
  Specimen,
  SurfaceStack,
  TokenTable,
  TokenSwatches,
  TypeRoles,
  Steps,
  DecisionTree,
  DecisionAnswer,
  Group,
  PrimitiveTable,
};
