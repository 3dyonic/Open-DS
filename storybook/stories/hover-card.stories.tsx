import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, HoverCard, HoverCardContent, HoverCardTrigger } from "@open-ds/ui";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "hover-card", situations: [] } },
  title: "Components/Hover card",
  component: HoverCard,
  args: { openDelay: 200 },
} satisfies Meta<typeof HoverCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger href="#" className="underline underline-offset-4">
        Hover or focus me
      </HoverCardTrigger>
      <HoverCardContent>A preview of what the link opens.</HoverCardContent>
    </HoverCard>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="hover-card">
      {(s) =>
        s.card && (
          // Open by default here, so the example shows the card; it opens on hover and focus.
          <HoverCard defaultOpen>
            <HoverCardTrigger href="#" className="underline underline-offset-4">
              {s.card.title}
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-col gap-[var(--space-gap-tight)]">
              <b>{s.card.title}</b>
              <span>{s.card.description}</span>
              <Badge className="self-start" tone={toneOf(s, s.card.status)}>
                {s.card.status}
              </Badge>
            </HoverCardContent>
          </HoverCard>
        )
      }
    </Show>
  ),
};
