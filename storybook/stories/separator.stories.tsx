import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator, Button } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "separator", situations: ["between-sections"] } },
  title: "Components/Separator",
  component: Separator,
  args: { orientation: "horizontal" },
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Separator {...args} className="max-w-sm" /> };

export const Examples: Story = {
  render: () => (
    <Show component="separator">
      {(s) => (
        <div className="flex h-8 items-center gap-[var(--space-gap-default)]">
          <Button variant="ghost">{s.actions.primary}</Button>
          <Separator orientation="vertical" />
          <Button variant="ghost">{s.actions.secondary}</Button>
        </div>
      )}
    </Show>
  ),
};
