import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Slider } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "slider", situations: ["field-label", "smallest-target"] } },
  title: "Components/Slider",
  component: Slider,
  args: { defaultValue: [40], max: 100, step: 1 },
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Slider {...args} className="max-w-sm" />,
};

// A range over the scheme's own number column, when it has one.
export const Examples: Story = {
  render: () => (
    <Show component="slider">
      {(s) => {
        const col = s.table?.columns.findIndex((c) => c.numeric) ?? -1;
        const values =
          s.table && col > 0
            ? s.table.rows.map((r) => Number.parseFloat(r.cells[col].replace(/[^0-9.]/g, "")) || 0)
            : s.metrics.map((m) => Number.parseFloat(m.value.replace(/[^0-9.]/g, "")) || 0);
        const max = Math.ceil(Math.max(...values, 1));
        const label = s.table && col > 0 ? s.table.columns[col].label : s.metrics[0].label;
        return (
          <div className="grid max-w-sm gap-[var(--space-gap-default)]">
            <Label>{label}</Label>
            <Slider
              defaultValue={[Math.round(max * 0.1), Math.round(max * 0.6)]}
              max={max}
              step={1}
              aria-label={label}
            />
          </div>
        );
      }}
    </Show>
  ),
};
