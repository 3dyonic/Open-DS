import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback, Message } from "@open-ds/ui";
import { Show } from "../src/samples";

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const meta = {
  parameters: { openDs: { component: "message", situations: [] } },
  title: "Components/Message",
  component: Message,
  args: { author: "Author", time: "09:00", children: "A message." },
} satisfies Meta<typeof Message>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="message">
      {(s) =>
        s.conversation && (
          <div className="flex max-w-xl flex-col gap-[var(--space-gap-group)]">
            {s.conversation.messages.map((m) => (
              <Message
                key={m.time + m.author}
                author={m.author}
                time={m.time}
                avatar={
                  <Avatar>
                    <AvatarFallback>{initials(m.author)}</AvatarFallback>
                  </Avatar>
                }
              >
                {m.text}
              </Message>
            ))}
          </div>
        )
      }
    </Show>
  ),
};
