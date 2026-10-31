import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Label } from "@open-ds/ui";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Checkbox", component: Checkbox } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <Show component="checkbox">
      {(s) => (
        <div className="grid gap-[var(--space-gap-default)]">
          {s.checkbox!.map((label, i) => (
            <Label key={label}>
              <Checkbox defaultChecked={i === 0} disabled={i === 2} /> {label}
            </Label>
          ))}
          <Usage situations={["smallest-target", "keyboard-focus"]} />
        </div>
      )}
    </Show>
  ),
};
