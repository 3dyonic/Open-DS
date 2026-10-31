import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "toggle", situations: [] } },
  title: "Components/Toggle",
  component: Toggle,
  args: { children: "Toggle" },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="toggle">{(s) => <Toggle aria-label={s.actions.secondary}>{s.actions.secondary}</Toggle>}</Show>
  ),
};
