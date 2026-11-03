import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "item", situations: [] } },
  title: "Components/Item",
  component: Item,
  args: { variant: "outline", size: "default" },
} satisfies Meta<typeof Item>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Item {...args}>
      <ItemContent>
        <ItemTitle>Title</ItemTitle>
        <ItemDescription>A short description.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="secondary">Open</Button>
      </ItemActions>
    </Item>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="item">
      {(s) => (
        <ItemGroup className="max-w-xl gap-[var(--space-gap-default)]">
          {s.card && (
            <Item variant="outline" role="listitem">
              <ItemContent>
                <ItemTitle>{s.card.title}</ItemTitle>
                <ItemDescription>{s.card.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="secondary">{s.card.secondary}</Button>
                <Button>{s.card.primary}</Button>
              </ItemActions>
            </Item>
          )}
          {s.metrics.slice(0, 2).map((m) => (
            <Item key={m.label} variant="outline" size="sm" role="listitem">
              <ItemContent>
                <ItemTitle>{m.label}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <span className="font-medium">{m.value}</span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )}
    </Show>
  ),
};
