import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bubble, Marker, MessageScroller } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "message-scroller", situations: [] } },
  title: "Components/Message scroller",
  component: MessageScroller,
  args: { "aria-label": "Conversation" },
} satisfies Meta<typeof MessageScroller>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <MessageScroller {...args} className="max-h-40 max-w-md">
      {["First", "Second", "Third", "Fourth", "Newest"].map((t) => (
        <Bubble key={t} author="Author">
          {t} message.
        </Bubble>
      ))}
    </MessageScroller>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="message-scroller">
      {(s) =>
        s.conversation && (
          <MessageScroller
            aria-label={s.conversation.title}
            className="max-h-64 max-w-xl border-[length:var(--border-width-default)] border-[color:var(--color-border-default)] p-[var(--space-inset-container)]"
          >
            <Marker>{s.conversation.marker}</Marker>
            {s.conversation.messages.map((m) => (
              <Bubble key={m.time + m.author} from={m.mine ? "me" : "them"} author={m.author} time={m.time}>
                {m.text}
              </Bubble>
            ))}
          </MessageScroller>
        )
      }
    </Show>
  ),
};
