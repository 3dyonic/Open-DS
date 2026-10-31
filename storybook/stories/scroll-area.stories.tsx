import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "scroll-area", situations: [] } },
  title: "Components/Scroll area",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-32 max-w-xs rounded-[var(--radius-container)] border border-[var(--color-border-default)]"
    >
      <div className="p-[var(--space-inset-container)]">{"Line. ".repeat(60)}</div>
    </ScrollArea>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="scroll-area">
      {(s) => (
        <ScrollArea className="h-40 max-w-sm rounded-[var(--radius-container)] border border-[var(--color-border-default)]">
          <ul className="p-[var(--space-inset-container)]">
            {[...Array(s.table && s.table.rows.length > 12 ? 1 : 4)].flatMap((_, i) =>
              (s.table?.rows.map((r) => r.cells.join(" · ")) ?? s.metrics.map((m) => `${m.label} · ${m.value}`)).map(
                (x) => (
                  <li
                    key={`${i}-${x}`}
                    className="border-b border-[var(--color-border-default)] py-[var(--space-gap-tight)]"
                  >
                    {x}
                  </li>
                ),
              ),
            )}
          </ul>
        </ScrollArea>
      )}
    </Show>
  ),
};
