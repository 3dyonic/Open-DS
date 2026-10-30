import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Label } from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = { title: "Components/Checkbox", component: Checkbox } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="grid gap-[var(--space-gap-default)]">
      <Label>
        <Checkbox defaultChecked /> Paid
      </Label>
      <Label>
        <Checkbox /> Late
      </Label>
      <Label>
        <Checkbox disabled /> Archived
      </Label>
      <Usage situations={["smallest-target", "keyboard-focus"]} />
    </div>
  ),
};
