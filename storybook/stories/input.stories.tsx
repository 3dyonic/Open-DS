import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Label } from "@open-ds/ui";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Input", component: Input } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  render: () => (
    <Show component="input">
      {(s) => (
        <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
          <Label htmlFor="field">{s.field.label}</Label>
          <p className="text-[var(--color-text-secondary)]">{s.field.hint}</p>
          <Input id="field" placeholder={s.field.placeholder || undefined} />
          <Label htmlFor="field-bad">{s.field.label}</Label>
          <Input id="field-bad" aria-invalid aria-describedby="field-error" defaultValue={s.field.invalid} />
          <p id="field-error" className="text-[var(--color-status-danger)]">
            {s.field.error}
          </p>
          <Usage situations={["field-label", "error-message", "keyboard-focus"]} />
        </div>
      )}
    </Show>
  ),
};
