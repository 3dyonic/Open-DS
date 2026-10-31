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
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Dialog", component: Dialog } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmDestructive: Story = {
  render: () => (
    <Show component="dialog">
      {(s) => (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">{s.confirm!.trigger}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{s.confirm!.title}</DialogTitle>
                <DialogDescription>{s.confirm!.body}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">{s.confirm!.cancel}</Button>
                </DialogClose>
                <Button>{s.confirm!.confirm}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Usage situations={["destructive-action", "menu-or-dialog"]} />
        </div>
      )}
    </Show>
  ),
};
