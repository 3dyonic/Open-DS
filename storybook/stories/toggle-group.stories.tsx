import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup, ToggleGroupItem } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "toggle-group", situations: [] } },
  title: "Components/Toggle group",
  component: ToggleGroup,
  args: { type: "single" },
} satisfies Meta<typeof ToggleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="a">
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="toggle-group">
      {(s) => (
        <ToggleGroup
          type="single"
          variant="outline"
          defaultValue={(s.tabs?.map((t) => t.label) ?? s.statuses.map((x) => x.label))[0]}
        >
          {(s.tabs?.map((t) => t.label) ?? s.statuses.map((x) => x.label)).map((x) => (
            <ToggleGroupItem key={x} value={x}>
              {x}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    </Show>
  ),
};
