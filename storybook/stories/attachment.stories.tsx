import type { Meta, StoryObj } from "@storybook/react-vite";
import { Attachment, Message } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "attachment", situations: [] } },
  title: "Components/Attachment",
  component: Attachment,
  args: { name: "report.pdf", type: "PDF", size: "1.2 MB", href: "#" },
} satisfies Meta<typeof Attachment>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="attachment">
      {(s) => {
        const c = s.conversation;
        if (!c) return null;
        const m = c.messages.find((x) => x.mine) ?? c.messages[0];
        return (
          <div className="max-w-xl">
            <Message author={m.author} time={m.time}>
              <p>{m.text}</p>
              <Attachment className="mt-[var(--space-gap-tight)]" href="#" {...c.attachment} />
            </Message>
          </div>
        );
      }}
    </Show>
  ),
};
