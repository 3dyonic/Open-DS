import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Switch } from "@open-ds/ui";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Switch", component: Switch } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <Show component="switch">
      {(s) => (
        <div className="grid gap-[var(--space-gap-default)]">
          {s.switches!.map((label, i) => (
            <Label key={label}>
              <Switch defaultChecked={i === 0} /> {label}
            </Label>
          ))}
          <Usage situations={["hover-feedback", "reduced-motion", "dark-mode"]} />
        </div>
      )}
    </Show>
  ),
};
