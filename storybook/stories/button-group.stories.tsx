import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@open-ds/ui";
import { ChevronDown } from "lucide-react";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "button-group", situations: [] } },
  title: "Components/Button group",
  component: ButtonGroup,
  args: { "aria-label": "Actions", orientation: "horizontal" },
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Previous</Button>
      <Button variant="secondary">Next</Button>
    </ButtonGroup>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="button-group">
      {(s) => (
        <div className="flex flex-col gap-[var(--space-gap-group)]">
          <ButtonGroup aria-label={s.screen}>
            <Button variant="secondary">{s.actions.secondary}</Button>
            <Button variant="secondary">{s.actions.primary}</Button>
          </ButtonGroup>
          {/* A split action: the main action and its options, apart by a separator. */}
          <ButtonGroup aria-label={s.actions.primary}>
            <Button>{s.actions.primary}</Button>
            <ButtonGroupSeparator />
            <Button size="icon" aria-label={s.menu?.trigger ?? "More actions"}>
              <ChevronDown />
            </Button>
          </ButtonGroup>
          {/* A text part names what the buttons beside it act on. */}
          <ButtonGroup aria-label={s.screen}>
            <ButtonGroupText>{s.screen}</ButtonGroupText>
            <Button variant="secondary">{s.actions.secondary}</Button>
          </ButtonGroup>
          {s.menu && (
            <ButtonGroup aria-label={s.menu.trigger} orientation="vertical">
              {s.menu.items.map((i) => (
                <Button key={i} variant="secondary">
                  {i}
                </Button>
              ))}
            </ButtonGroup>
          )}
        </div>
      )}
    </Show>
  ),
};
