import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@open-ds/ui";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "tabs", situations: ["keyboard-focus"] } },
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <Show component="tabs">
      {(s) => (
        <Tabs {...args} defaultValue={s.tabs![0].label}>
          <TabsList>
            {s.tabs!.map((t) => (
              <TabsTrigger key={t.label} value={t.label}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
    </Show>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="tabs">
      {(s) => (
        <div>
          <Tabs defaultValue={s.tabs![0].label}>
            <TabsList>
              {s.tabs!.map((t) => (
                <TabsTrigger key={t.label} value={t.label}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {s.tabs!.map((t) => (
              <TabsContent key={t.label} value={t.label}>
                {t.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </Show>
  ),
};
