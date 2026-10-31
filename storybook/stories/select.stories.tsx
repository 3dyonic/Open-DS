import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@open-ds/ui";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "select", situations: ["field-label", "smallest-target"] } },
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { disabled: false },
  render: (args) => (
    <Show component="select">
      {(s) => (
        <Select {...args} defaultValue={s.select!.value}>
          <SelectTrigger aria-label={s.select!.label} className="max-w-sm">
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
      )}
    </Show>
  ),
};

export const Examples: Story = {
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
        </div>
      )}
    </Show>
  ),
};
