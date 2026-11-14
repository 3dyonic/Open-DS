// The design system's introduction: what it is for, who it is for, how to use it, its voice.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Introduction as Page } from "./guide";

const meta = {
  title: "Introduction",
  tags: ["!autodocs"],
  // A page to read, not a component to try: no controls, actions or interactions panel.
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
    interactions: { disable: true },
  },
} satisfies Meta;
export default meta;

export const Introduction: StoryObj<typeof meta> = { render: () => <Page /> };
