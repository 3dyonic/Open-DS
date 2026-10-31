import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "progress", situations: ["reduced-motion"] } },
  title: "Components/Progress",
  component: Progress,
  args: { value: 40 },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Progress {...args} className="max-w-sm" /> };

export const Examples: Story = {
  render: () => (
    <Show component="progress">
      {(s) => (
        <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
          <p className="flex justify-between">
            <span>{s.metrics[0].label}</span>
            <span className="[font-family:var(--type-data-font-family)]">{s.metrics[0].value}</span>
          </p>
          <Progress value={50} aria-label={s.metrics[0].label} />
        </div>
      )}
    </Show>
  ),
};
