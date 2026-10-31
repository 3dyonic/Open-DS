import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "collapsible", situations: [] } },
  title: "Components/Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost">Show more</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>More detail.</CollapsibleContent>
    </Collapsible>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="collapsible">
      {(s) => (
        <Collapsible defaultOpen className="max-w-md">
          <CollapsibleTrigger asChild>
            <Button variant="ghost">{s.card?.title ?? s.screen}</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-[var(--space-inset-control-x)] text-[var(--color-text-secondary)]">
            {s.card?.description ?? s.field.hint}
          </CollapsibleContent>
        </Collapsible>
      )}
    </Show>
  ),
};
