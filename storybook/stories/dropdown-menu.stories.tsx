import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@open-ds/ui";
import { MoreHorizontal } from "lucide-react";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "dropdown-menu", situations: ["row-action", "menu-or-dialog"] } },
  title: "Components/Dropdown menu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { modal: true },
  render: (args) => (
    <Show component="dropdown-menu">
      {(s) => (
        <DropdownMenu {...args}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">{s.menu!.trigger}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {s.menu!.items.map((item) => (
              <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Show>
  ),
};

// The destructive action sits last, in the danger tone, because choosing it loses something.
export const Examples: Story = {
  render: () => (
    <Show component="dropdown-menu">
      {(s) => (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={s.menu!.trigger}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {s.menu!.items.map((item) => (
                <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem tone="danger">{s.menu!.destructive}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Show>
  ),
};
