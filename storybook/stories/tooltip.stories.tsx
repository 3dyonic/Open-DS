import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@open-ds/ui";
import { Filter } from "lucide-react";
import { Usage } from "../src/usage";

const meta = { title: "Components/Tooltip", component: Tooltip } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OnAnIconButton: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" aria-label="Filter">
            <Filter />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Filter</TooltipContent>
      </Tooltip>
      <Usage situations={["icon-alone"]} />
    </TooltipProvider>
  ),
};
