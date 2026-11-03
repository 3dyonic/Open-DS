import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bubble } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "bubble", situations: [] } },
  title: "Components/Bubble",
  component: Bubble,
  args: { from: "them", author: "Author", time: "09:00", children: "A message." },
} satisfies Meta<typeof Bubble>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="bubble">
      {(s) =>
        s.conversation && (
          <div className="flex max-w-xl flex-col gap-[var(--space-gap-default)]">
            {s.conversation.messages.map((m) => (
              <Bubble key={m.time + m.author} from={m.mine ? "me" : "them"} author={m.author} time={m.time}>
                {m.text}
              </Bubble>
            ))}
          </div>
        )
      }
    </Show>
  ),
};
