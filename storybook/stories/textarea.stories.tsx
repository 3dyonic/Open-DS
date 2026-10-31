import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea, Label } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "textarea", situations: ["field-label", "error-message"] } },
  title: "Components/Textarea",
  component: Textarea,
  args: { placeholder: "Type here" },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="textarea">
      {(s) => (
        <div className="grid max-w-md gap-[var(--space-gap-tight)]">
          <Label htmlFor="ta">{s.field.label}</Label>
          <Textarea id="ta" />
          <p className="text-[var(--color-text-secondary)]">{s.field.hint}</p>
        </div>
      )}
    </Show>
  ),
};
