import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Label } from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = { title: "Components/Input", component: Input, args: { placeholder: "name@example.com" } } satisfies Meta<
  typeof Input
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" {...args} />
      <Label htmlFor="bad">Quantity</Label>
      <Input id="bad" aria-invalid defaultValue="0" />
      <Usage situations={["field-label", "error-message", "keyboard-focus"]} />
    </div>
  ),
};
