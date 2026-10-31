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
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Dropdown menu", component: DropdownMenu } satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

// The destructive action sits last, in the danger tone, because choosing it loses something.
export const Actions: Story = {
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
          <Usage situations={["row-action", "menu-or-dialog"]} />
        </div>
      )}
    </Show>
  ),
};
