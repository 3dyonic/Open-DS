import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker, Label } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "date-picker", situations: ["field-label", "keyboard-focus"] } },
  title: "Components/Date picker",
  component: DatePicker,
  args: { mode: "single", placeholder: "Pick a date" },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="date-picker">
      {(s) => (
        <div className="grid max-w-sm gap-[var(--space-gap-tight)]">
          <Label>{s.table?.caption ?? s.screen}</Label>
          <DatePicker mode="range" defaultValue={{ from: new Date(2026, 9, 5), to: new Date(2026, 9, 11) }} />
        </div>
      )}
    </Show>
  ),
};
