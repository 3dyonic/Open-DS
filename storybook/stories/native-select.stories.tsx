import type { Meta, StoryObj } from "@storybook/react-vite";
import { NativeSelect, NativeSelectOption, Label } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "native-select", situations: ["field-label", "error-message"] } },
  title: "Components/Native select",
  component: NativeSelect,
} satisfies Meta<typeof NativeSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <NativeSelect {...args} aria-label="Choice">
      <NativeSelectOption value="a">A</NativeSelectOption>
      <NativeSelectOption value="b">B</NativeSelectOption>
    </NativeSelect>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="native-select">
      {(s) => (
        <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
          <Label htmlFor="native">{s.select?.label ?? s.field.label}</Label>
          <NativeSelect id="native" defaultValue={s.select?.value}>
            {(s.select?.options ?? s.checkbox ?? s.statuses.map((x) => x.label)).map((o) => (
              <NativeSelectOption key={o} value={o}>
                {o}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      )}
    </Show>
  ),
};
