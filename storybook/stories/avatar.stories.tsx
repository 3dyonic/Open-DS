import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "avatar", situations: [] } },
  title: "Components/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="avatar">
      {(s) => (
        <div className="flex gap-[var(--space-gap-default)]">
          {s.metrics.slice(0, 3).map((m) => (
            <Avatar key={m.label} title={m.label}>
              <AvatarFallback>
                {m.label
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}
    </Show>
  ),
};
