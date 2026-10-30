import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Label } from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = { title: "Components/Label", component: Label, args: { children: "Customer" } } satisfies Meta<
  typeof Label
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCheckbox: Story = {
  render: () => (
    <div>
      <Label>
        <Checkbox /> Email me when an order is late
      </Label>
      <Usage situations={["field-label"]} />
    </div>
  ),
};
