import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@open-ds/ui";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Select", component: Select } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Show component="select">
      {(s) => (
        <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
          <Label htmlFor="choice">{s.select!.label}</Label>
          <Select defaultValue={s.select!.value}>
            <SelectTrigger id="choice">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {s.select!.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Usage situations={["field-label", "smallest-target"]} />
        </div>
      )}
    </Show>
  ),
};
