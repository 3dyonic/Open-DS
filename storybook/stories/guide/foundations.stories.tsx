// The foundations (OD-180): the three token layers, then color, type, spacing, shape and motion, each
// with the scheme's answer and its reason, and values read live from the tokens.
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FoundationsColor,
  FoundationsMotion,
  FoundationsOverview,
  FoundationsShape,
  FoundationsSpacing,
  FoundationsTypography,
} from "./guide";

const meta = {
  title: "Foundations",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { render: () => <FoundationsOverview /> };
export const Color: Story = { render: () => <FoundationsColor /> };
export const Typography: Story = { render: () => <FoundationsTypography /> };
export const Spacing: Story = { name: "Spacing and density", render: () => <FoundationsSpacing /> };
export const Shape: Story = { name: "Shape and elevation", render: () => <FoundationsShape /> };
export const Motion: Story = { render: () => <FoundationsMotion /> };
