import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = {
  title: "Components/Toast",
  component: Toast,
  args: { title: "12 orders exported.", tone: "success" },
  argTypes: { tone: { control: "inline-radio", options: ["neutral", "success", "danger"] } },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="grid gap-[var(--space-gap-default)]">
      <Toast tone="success" title="12 orders exported." />
      <Toast tone="danger" title="Order 1042 not saved." description="Quantity must be 1 or more." />
      <Toast title="Filters cleared." />
      <Usage situations={["error-message", "hover-feedback"]} />
    </div>
  ),
};
