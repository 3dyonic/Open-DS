import type { Meta, StoryObj } from "@storybook/react-vite";
import { Marker, Message } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "marker", situations: [] } },
  title: "Components/Marker",
  component: Marker,
  args: { children: "Today" },
} satisfies Meta<typeof Marker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="marker">
      {(s) =>
        s.conversation && (
          <div className="flex max-w-xl flex-col gap-[var(--space-gap-group)]">
            <Marker>{s.conversation.marker}</Marker>
            {s.conversation.messages.slice(0, 2).map((m) => (
              <Message key={m.time + m.author} author={m.author} time={m.time}>
                {m.text}
              </Message>
            ))}
          </div>
        )
      }
    </Show>
  ),
};
