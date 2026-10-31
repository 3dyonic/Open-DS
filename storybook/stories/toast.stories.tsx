import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "@open-ds/ui";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = {
  title: "Components/Toast",
  component: Toast,
  args: { title: "Saved.", tone: "neutral" },
  argTypes: { tone: { control: "inline-radio", options: ["neutral", "success", "danger"] } },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// Success confirms, danger reports a failure the reader must fix, neutral informs.
export const Messages: Story = {
  render: () => (
    <Show component="toast">
      {(s) => (
        <div className="grid gap-[var(--space-gap-default)]">
          <Toast tone="success" title={s.messages!.success} />
          <Toast tone="danger" title={s.messages!.error.title} description={s.messages!.error.description} />
          <Toast title={s.messages!.neutral} />
          <Usage situations={["error-message", "hover-feedback"]} />
        </div>
      )}
    </Show>
  ),
};
