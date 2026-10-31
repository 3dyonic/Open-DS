import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "resizable", situations: [] } },
  title: "Components/Resizable",
  component: ResizablePanelGroup,
} satisfies Meta<typeof ResizablePanelGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <ResizablePanelGroup
      {...args}
      className="max-w-lg rounded-[var(--radius-container)] border border-[var(--color-border-default)]"
    >
      <ResizablePanel defaultSize={50}>
        <div className="p-[var(--space-inset-container)]">One</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="p-[var(--space-inset-container)]">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="resizable">
      {(s) => (
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-40 max-w-2xl rounded-[var(--radius-container)] border border-[var(--color-border-default)]"
        >
          <ResizablePanel defaultSize={60}>
            <div className="p-[var(--space-inset-container)] [font-weight:var(--type-heading-font-weight)]">
              {s.screen}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <div className="p-[var(--space-inset-container)] text-[var(--color-text-secondary)]">
              {s.card?.description ?? s.field.hint}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </Show>
  ),
};
