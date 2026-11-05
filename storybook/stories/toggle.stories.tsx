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
    <Show component="toggle">
      {(s) => (
        <div className="flex flex-wrap items-center gap-[var(--space-gap-default)]">
          {/* Filter toggles: one off, one on, so the on state (its fill and edge) shows. */}
          <Toggle>{s.statuses[0].label}</Toggle>
          <Toggle defaultPressed>{s.statuses[1].label}</Toggle>
        </div>
      )}
    </Show>
  ),
};
