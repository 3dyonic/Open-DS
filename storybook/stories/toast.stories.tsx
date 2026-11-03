import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Toast, Toaster, toast } from "@open-ds/ui";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "toast", situations: ["error-message", "hover-feedback"] } },
  title: "Components/Toast",
  component: Toast,
  args: { title: "Saved.", tone: "neutral" },
  argTypes: { tone: { control: "inline-radio", options: ["neutral", "success", "danger"] } },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// Success confirms, danger reports a failure the reader must fix, neutral informs. The button shows
// one live, the way an app calls toast().
export const Examples: Story = {
  render: () => (
    <Show component="toast">
      {(s) => (
        <div className="grid gap-[var(--space-gap-default)]">
          <Button className="justify-self-start" variant="secondary" onClick={() => toast.success(s.messages!.success)}>
            {s.actions.primary}
          </Button>
          <Toaster position="bottom-right" />
          <Toast tone="success" title={s.messages!.success} />
          <Toast tone="danger" title={s.messages!.error.title} description={s.messages!.error.description} />
          <Toast title={s.messages!.neutral} />
        </div>
      )}
    </Show>
  ),
};
