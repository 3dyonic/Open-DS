import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "calendar", situations: ["keyboard-focus"] } },
  title: "Components/Calendar",
  component: Calendar,
  args: { mode: "single" },
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="calendar">
      {(s) => (
        <div className="flex flex-col gap-[var(--space-gap-default)]">
          <p className="text-[var(--color-text-secondary)]">{s.field.label}</p>
          <Calendar
            mode="single"
            className="rounded-[var(--radius-container)] border border-[var(--color-border-default)]"
          />
        </div>
      )}
    </Show>
  ),
};
