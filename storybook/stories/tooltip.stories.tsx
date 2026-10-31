import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@open-ds/ui";
import { Filter } from "lucide-react";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "tooltip", situations: ["icon-alone"] } },
  title: "Components/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { defaultOpen: true, delayDuration: 300 },
  render: (args) => (
    <Show component="tooltip">
      {(s) => (
        <TooltipProvider>
          <Tooltip {...args}>
            <TooltipTrigger asChild>
              <Button variant="secondary">{s.icon_action}</Button>
            </TooltipTrigger>
            <TooltipContent>{s.icon_action}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Show>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="tooltip">
      {(s) => (
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" aria-label={s.icon_action}>
                <Filter />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{s.icon_action}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Show>
  ),
};
