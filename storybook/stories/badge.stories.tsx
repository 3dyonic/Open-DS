import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@open-ds/ui";
import { AlertTriangle, Check, X } from "lucide-react";
import { Usage } from "../src/usage";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Paid", tone: "success" },
  argTypes: { tone: { control: "inline-radio", options: ["neutral", "success", "warning", "danger"] } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div>
      <div className="flex flex-wrap gap-[var(--space-gap-default)]">
        <Badge tone="neutral">Draft</Badge>
        <Badge tone="success">
          <Check /> Paid
        </Badge>
        <Badge tone="warning">
          <AlertTriangle /> Late
        </Badge>
        <Badge tone="danger">
          <X /> Failed
        </Badge>
      </div>
      <Usage situations={["status-label", "status-shape"]} />
    </div>
  ),
};
