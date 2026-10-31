import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "aspect-ratio", situations: [] } },
  title: "Components/Aspect ratio",
  component: AspectRatio,
  args: { ratio: 16 / 9 },
} satisfies Meta<typeof AspectRatio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-md">
      <AspectRatio {...args} className="rounded-[var(--radius-container)] bg-[var(--color-surface-sunken)]" />
    </div>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="aspect-ratio">
      {(s) => (
        <div className="max-w-md">
          <AspectRatio
            ratio={16 / 9}
            className="flex items-end rounded-[var(--radius-container)] bg-[var(--color-surface-sunken)] p-[var(--space-inset-container)]"
          >
            <span className="[font-weight:var(--type-heading-font-weight)]">{s.screen}</span>
          </AspectRatio>
        </div>
      )}
    </Show>
  ),
};
