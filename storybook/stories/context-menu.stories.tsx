import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "context-menu", situations: ["row-action", "menu-or-dialog"] } },
  title: "Components/Context menu",
  component: ContextMenu,
} satisfies Meta<typeof ContextMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="flex h-24 max-w-sm items-center justify-center rounded-[var(--radius-container)] border border-dashed border-[var(--color-border-strong)]">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Item</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="context-menu">
      {(s) => (
        <ContextMenu>
          <ContextMenuTrigger className="flex h-24 max-w-sm items-center justify-center rounded-[var(--radius-container)] border border-dashed border-[var(--color-border-strong)]">
            {s.table?.rows[0].cells.join(" · ") ?? s.screen}
          </ContextMenuTrigger>
          <ContextMenuContent>
            {(s.menu?.items ?? [s.actions.primary, s.actions.secondary]).map((x) => (
              <ContextMenuItem key={x}>{x}</ContextMenuItem>
            ))}
            {s.menu && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">{s.menu.destructive}</ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
      )}
    </Show>
  ),
};
