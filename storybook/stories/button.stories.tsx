import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@open-ds/ui";
import { Download, MoreHorizontal, Plus } from "lucide-react";
import { Usage } from "../src/usage";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Save order", variant: "primary", size: "default" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost"] },
    size: { control: "inline-radio", options: ["default", "compact", "icon"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div>
      <div className="flex flex-wrap items-center gap-[var(--space-gap-default)]">
        <Button>
          <Plus /> New order
        </Button>
        <Button variant="secondary">
          <Download /> Export
        </Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="secondary" size="compact">
          Filter
        </Button>
        <Button variant="ghost" size="icon" aria-label="More actions">
          <MoreHorizontal />
        </Button>
        <Button disabled>Disabled</Button>
      </div>
      <Usage situations={["commit-action", "alternative-action", "destructive-action", "row-action"]} />
    </div>
  ),
};
