import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "command", situations: ["menu-or-dialog", "keyboard-focus"] } },
  title: "Components/Command",
  component: Command,
} satisfies Meta<typeof Command>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Command
      {...args}
      className="max-w-md rounded-[var(--radius-container)] border border-[var(--color-border-default)]"
    >
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandEmpty>No match.</CommandEmpty>
      </CommandList>
    </Command>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="command">
      {(s) => (
        <Command className="max-w-md rounded-[var(--radius-container)] border border-[var(--color-border-default)]">
          <CommandInput placeholder={s.icon_action ?? s.field.label} />
          <CommandList>
            <CommandEmpty>No match.</CommandEmpty>
            <CommandGroup heading={s.screen}>
              <CommandItem>
                {s.actions.primary}
                <CommandShortcut>Enter</CommandShortcut>
              </CommandItem>
              <CommandItem>{s.actions.secondary}</CommandItem>
            </CommandGroup>
            <CommandGroup heading={s.table?.caption ?? s.metrics[0].label}>
              {(s.table?.rows.map((r) => r.cells[0]) ?? s.metrics.map((m) => m.label)).map((x) => (
                <CommandItem key={x}>{x}</CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </Show>
  ),
};
