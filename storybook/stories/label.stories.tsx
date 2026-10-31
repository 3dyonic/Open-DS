import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Label } from "@open-ds/ui";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Label", component: Label } satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithField: Story = {
  render: () => (
    <Show component="label">
      {(s) => (
        <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
          <Label htmlFor="labelled">{s.field.label}</Label>
          <Input id="labelled" placeholder={s.field.placeholder || undefined} />
          <Usage situations={["field-label"]} />
        </div>
      )}
    </Show>
  ),
};
