import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner, Button } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "spinner", situations: ["reduced-motion"] } },
  title: "Components/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
  render: () => (
    <Show component="spinner">
      {(s) => (
        <Button disabled>
          <Spinner /> {s.actions.primary}
        </Button>
      )}
    </Show>
  ),
};
