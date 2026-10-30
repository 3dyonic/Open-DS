import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = { title: "Components/Dialog", component: Dialog } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmDelete: Story = {
  render: () => (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Delete 3 orders</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete 3 orders?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Keep them</Button>
            </DialogClose>
            <Button>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Usage situations={["destructive-action", "menu-or-dialog"]} />
    </div>
  ),
};
