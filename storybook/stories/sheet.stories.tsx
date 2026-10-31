import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Button } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "sheet", situations: ["menu-or-dialog"] } },
  title: "Components/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="secondary">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="sheet">
      {(s) => (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">{s.card?.title ?? s.actions.secondary}</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{s.card?.title ?? s.screen}</SheetTitle>
              <SheetDescription>{s.card?.description ?? s.field.hint}</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </Show>
  ),
};
