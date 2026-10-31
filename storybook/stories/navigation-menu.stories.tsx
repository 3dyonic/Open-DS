import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "navigation-menu", situations: ["link", "keyboard-focus"] } },
  title: "Components/Navigation menu",
  component: NavigationMenu,
} satisfies Meta<typeof NavigationMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Link</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="navigation-menu">
      {(s) => (
        <NavigationMenu>
          <NavigationMenuList>
            {(s.tabs?.map((t) => t.label) ?? s.metrics.map((m) => m.label)).map((x) => (
              <NavigationMenuItem key={x}>
                <NavigationMenuLink href="#">{x}</NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </Show>
  ),
};
