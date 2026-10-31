import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldLabel, FieldDescription, FieldError, Input } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "field", situations: ["field-label", "error-message"] } },
  title: "Components/Field",
  component: Field,
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Field {...args} className="max-w-sm">
      <FieldLabel htmlFor="f-play">Label</FieldLabel>
      <Input id="f-play" />
      <FieldDescription>A hint.</FieldDescription>
    </Field>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="field">
      {(s) => (
        <div className="grid max-w-sm gap-[var(--space-gap-group)]">
          <Field>
            <FieldLabel htmlFor="f-ok">{s.field.label}</FieldLabel>
            <Input id="f-ok" placeholder={s.field.placeholder || undefined} />
            <FieldDescription>{s.field.hint}</FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="f-bad">{s.field.label}</FieldLabel>
            <Input id="f-bad" aria-invalid defaultValue={s.field.invalid} />
            <FieldError>{s.field.error}</FieldError>
          </Field>
        </div>
      )}
    </Show>
  ),
};
