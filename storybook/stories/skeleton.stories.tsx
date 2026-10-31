import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "skeleton", situations: ["reduced-motion"] } },
  title: "Components/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Skeleton {...args} className="h-4 w-48" /> };

export const Examples: Story = {
  render: () => (
    <Show component="skeleton">
      {(s) => (
        <div className="grid max-w-md gap-[var(--space-gap-default)]" aria-label={`${s.screen}: loading`}>
          {(s.table?.rows ?? s.metrics).map((_, i) => (
            <Skeleton key={i} className="h-[var(--size-row,1rem)] w-full" />
          ))}
        </div>
      )}
    </Show>
  ),
};
