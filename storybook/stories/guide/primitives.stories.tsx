// The Primitives section (OD-184, OD-195): every raw value, by kind, and what points to it. Its own
// section next to Foundations, the same as the docs.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Primitives } from "./guide";

const meta = {
  title: "Primitives",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Color: Story = { render: () => <Primitives kind="color" /> };
export const SpaceAndSize: Story = { name: "Space and size", render: () => <Primitives kind="space-and-size" /> };
export const Shape: Story = { render: () => <Primitives kind="shape" /> };
export const Type: Story = { render: () => <Primitives kind="type" /> };
export const Motion: Story = { render: () => <Primitives kind="motion" /> };
export const Effects: Story = { render: () => <Primitives kind="effects" /> };
