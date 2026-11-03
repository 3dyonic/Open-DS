import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Toaster, toast } from "@open-ds/ui";
import { useEffect } from "react";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "sonner", situations: ["success-words"] } },
  title: "Components/Sonner",
  component: Toaster,
  args: { position: "bottom-right" },
} satisfies Meta<typeof Toaster>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <>
      <Button onClick={() => toast("Saved.")}>Show a toast</Button>
      <Toaster {...args} />
    </>
  ),
};

function Stack({ texts }: { texts: string[] }) {
  // Shows the stack once, so the example has toasts to look at; the button adds more.
  useEffect(() => {
    texts.forEach((t, i) => setTimeout(() => toast(t), i * 150));
  }, [texts]);
  return null;
}

export const Examples: Story = {
  render: () => (
    <Show component="sonner">
      {(s) =>
        s.messages && (
          <div className="min-h-48">
            <Button onClick={() => toast(s.messages!.success)}>{s.actions.primary}</Button>
            <Stack texts={[s.messages.success, s.messages.neutral]} />
            <Toaster position="bottom-left" expand />
          </div>
        )
      }
    </Show>
  ),
};
