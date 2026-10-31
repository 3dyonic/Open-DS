import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd, KbdGroup } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "kbd", situations: ["keyboard-focus"] } },
  title: "Components/Kbd",
  component: Kbd,
  args: { children: "K" },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="kbd">
      {(s) => (
        <p className="flex items-center gap-[var(--space-gap-default)]">
          {s.icon_action ?? s.actions.primary}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </p>
      )}
    </Show>
  ),
};
