import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@open-ds/ui";
import { Download, MoreHorizontal } from "lucide-react";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Continue", variant: "primary", size: "default" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost"] },
    size: { control: "inline-radio", options: ["default", "compact", "icon"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Show component="button">
      {(s) => (
        <div>
          <div className="flex flex-wrap items-center gap-[var(--space-gap-default)]">
            <Button>{s.actions.primary}</Button>
            <Button variant="secondary">
              <Download /> {s.actions.secondary}
            </Button>
            {s.confirm && <Button variant="ghost">{s.confirm.cancel}</Button>}
            <Button variant="ghost" size="icon" aria-label={s.menu?.trigger ?? "More actions"}>
              <MoreHorizontal />
            </Button>
            <Button disabled>{s.actions.primary}</Button>
          </div>
          <Usage situations={["commit-action", "alternative-action", "destructive-action", "row-action"]} />
        </div>
      )}
    </Show>
  ),
};
