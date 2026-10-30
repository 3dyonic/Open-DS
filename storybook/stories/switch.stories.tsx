import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Switch } from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = { title: "Components/Switch", component: Switch } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="grid gap-[var(--space-gap-default)]">
      <Label>
        <Switch defaultChecked aria-label="Dark mode" /> Dark mode
      </Label>
      <Label>
        <Switch aria-label="Compact rows" /> Compact rows
      </Label>
      <Usage situations={["hover-feedback", "reduced-motion", "dark-mode"]} />
    </div>
  ),
};
