import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem, Label } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "radio-group", situations: ["field-label", "error-message"] } },
  title: "Components/Radio group",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="a">
      <Label>
        <RadioGroupItem value="a" /> A
      </Label>
      <Label>
        <RadioGroupItem value="b" /> B
      </Label>
    </RadioGroup>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="radio-group">
      {(s) => (
        <fieldset className="grid gap-[var(--space-gap-default)]">
          <legend className="mb-[var(--space-gap-default)] [font-weight:var(--type-label-font-weight)]">
            {s.select?.label ?? s.field.label}
          </legend>
          <RadioGroup defaultValue={s.select?.value ?? (s.checkbox ?? s.statuses.map((x) => x.label))[0]}>
            {(s.select?.options ?? s.checkbox ?? s.statuses.map((x) => x.label)).map((o) => (
              <Label key={o}>
                <RadioGroupItem value={o} /> {o}
              </Label>
            ))}
          </RadioGroup>
        </fieldset>
      )}
    </Show>
  ),
};
