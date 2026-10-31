import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "popover", situations: ["menu-or-dialog"] } },
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open</Button>
      </PopoverTrigger>
      <PopoverContent>Details.</PopoverContent>
    </Popover>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="popover">
      {(s) => (
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button variant="secondary">{s.card?.title ?? s.actions.secondary}</Button>
          </PopoverTrigger>
          <PopoverContent>{s.card?.description ?? s.field.hint}</PopoverContent>
        </Popover>
      )}
    </Show>
  ),
};
