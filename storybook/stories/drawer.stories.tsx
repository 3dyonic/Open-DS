import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Button,
} from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "drawer", situations: ["menu-or-dialog"] } },
  title: "Components/Drawer",
  component: Drawer,
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="secondary">Open</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="drawer">
      {(s) => (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">{s.actions.secondary}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{s.screen}</DrawerTitle>
              <DrawerDescription>{s.card?.description ?? s.field.hint}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>{s.actions.primary}</Button>
              <DrawerClose asChild>
                <Button variant="ghost">{s.confirm?.cancel ?? "Close"}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </Show>
  ),
};
