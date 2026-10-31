import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Label } from "@open-ds/ui";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "label", situations: ["field-label"] } },
  title: "Components/Label",
  component: Label,
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { children: "Label" } };

export const Examples: Story = {
  render: () => (
    <Show component="label">
      {(s) => (
        <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
          <Label htmlFor="labelled">{s.field.label}</Label>
          <Input id="labelled" placeholder={s.field.placeholder || undefined} />
        </div>
      )}
    </Show>
  ),
};
