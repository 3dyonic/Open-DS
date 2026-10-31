import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "alert-dialog", situations: ["destructive-action", "confirm-words"] } },
  title: "Components/Alert dialog",
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Show component="alert-dialog">
      {(s) => (
        <AlertDialog {...args}>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">{s.confirm?.trigger ?? s.actions.secondary}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{s.confirm?.title ?? s.actions.secondary}</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Show>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="alert-dialog">
      {(s) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">{s.confirm?.trigger ?? s.actions.secondary}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{s.confirm?.title ?? s.actions.secondary}</AlertDialogTitle>
              <AlertDialogDescription>{s.confirm?.body ?? ""}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{s.confirm?.cancel ?? "Cancel"}</AlertDialogCancel>
              <AlertDialogAction>{s.confirm?.confirm ?? s.actions.primary}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Show>
  ),
};
