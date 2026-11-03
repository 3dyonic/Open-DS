import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "menubar", situations: [] } },
  title: "Components/Menubar",
  component: Menubar,
} satisfies Meta<typeof Menubar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Open</MenubarItem>
          <MenubarItem>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="menubar">
      {(s) =>
        s.menu && (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>{s.actions.primary}</MenubarTrigger>
              <MenubarContent>
                {s.menu.items.map((i) => (
                  <MenubarItem key={i}>{i}</MenubarItem>
                ))}
                <MenubarSeparator />
                <MenubarItem variant="destructive">{s.menu.destructive}</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            {s.tabs && (
              <MenubarMenu>
                <MenubarTrigger>{s.actions.secondary}</MenubarTrigger>
                <MenubarContent>
                  <MenubarRadioGroup value={s.tabs[0].label}>
                    {s.tabs.map((t) => (
                      <MenubarRadioItem key={t.label} value={t.label}>
                        {t.label}
                      </MenubarRadioItem>
                    ))}
                  </MenubarRadioGroup>
                </MenubarContent>
              </MenubarMenu>
            )}
          </Menubar>
        )
      }
    </Show>
  ),
};
