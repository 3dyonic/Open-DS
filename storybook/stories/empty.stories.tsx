import type { Meta, StoryObj } from "@storybook/react-vite";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, Button } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "empty", situations: ["empty-words"] } },
  title: "Components/Empty",
  component: Empty,
} satisfies Meta<typeof Empty>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyTitle>Nothing here yet</EmptyTitle>
      </EmptyHeader>
    </Empty>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="empty">
      {(s) => (
        <Empty className="max-w-lg border border-dashed border-[var(--color-border-strong)]">
          <EmptyHeader>
            <EmptyTitle>{s.messages?.neutral ?? s.screen}</EmptyTitle>
            <EmptyDescription>{s.field.hint}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>{s.actions.primary}</Button>
          </EmptyContent>
        </Empty>
      )}
    </Show>
  ),
};
