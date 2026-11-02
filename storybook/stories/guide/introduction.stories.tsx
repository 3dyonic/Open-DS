// The design system's introduction (OD-179): what it is for, who it is for, how to use it, its voice.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Introduction as Page } from "./guide";

const meta = {
  title: "Introduction",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", controls: { disable: true } },
} satisfies Meta;
export default meta;

export const Introduction: StoryObj<typeof meta> = { render: () => <Page /> };
