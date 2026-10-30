import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = { title: "Components/Select", component: Select } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
      <Label>Status</Label>
      <Select defaultValue="late">
        <SelectTrigger aria-label="Status">
          <SelectValue placeholder="Pick a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="late">Late</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
      <Usage situations={["field-label", "smallest-target"]} />
    </div>
  ),
};
