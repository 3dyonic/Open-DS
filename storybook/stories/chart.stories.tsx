import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@open-ds/ui";
import { Bar, BarChart, XAxis } from "recharts";
import type { Samples } from "../src/samples";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "chart", situations: ["number-in-table"] } },
  title: "Components/Chart",
  component: ChartContainer,
  args: { config: { value: { label: "Value", color: "var(--chart-1)" } }, children: <></> },
} satisfies Meta<typeof ChartContainer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ChartContainer {...args} className="h-48 max-w-lg">
      <BarChart
        data={[
          { name: "A", value: 3 },
          { name: "B", value: 5 },
          { name: "C", value: 2 },
        ]}
      >
        <XAxis dataKey="name" />
        <Bar dataKey="value" fill="var(--color-value)" />
      </BarChart>
    </ChartContainer>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="chart">
      {(s) => (
        <ChartContainer config={{ value: { label: valueLabel(s), color: "var(--chart-1)" } }} className="h-56 max-w-lg">
          <BarChart data={chartRows(s)}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={2} />
          </BarChart>
        </ChartContainer>
      )}
    </Show>
  ),
};

// Rows of the scheme's own figures: the table's number column when it has one, otherwise its figures.
function chartRows(s: Samples) {
  const t = s.table;
  const col = t ? t.columns.findIndex((c) => c.numeric) : -1;
  const toNumber = (v: string) => Number.parseFloat(v.replace(/[^0-9.]/g, "")) || 0;
  return t && col >= 0
    ? t.rows.slice(0, 8).map((r) => ({ name: r.cells[0], value: toNumber(r.cells[col]) }))
    : s.metrics.map((m) => ({ name: m.label, value: toNumber(m.value) }));
}
function valueLabel(s: Samples) {
  const col = s.table?.columns.find((c) => c.numeric);
  return col?.label ?? s.screen;
}
