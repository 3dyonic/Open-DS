import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "sidebar", situations: ["link", "keyboard-focus"] } },
  title: "Components/Sidebar",
  component: SidebarProvider,
} satisfies Meta<typeof SidebarProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <SidebarProvider className="min-h-0">
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Group</SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="sidebar">
      {(s) => (
        <SidebarProvider className="min-h-0">
          <Sidebar
            collapsible="none"
            className="rounded-[var(--radius-container)] border border-[var(--color-border-default)]"
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>{s.screen}</SidebarGroupLabel>
                <SidebarMenu>
                  {(s.tabs?.map((t) => t.label) ?? s.metrics.map((m) => m.label)).map((x, i) => (
                    <SidebarMenuItem key={x}>
                      <SidebarMenuButton isActive={i === 0}>{x}</SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      )}
    </Show>
  ),
};
