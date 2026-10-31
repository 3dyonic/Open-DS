import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "accordion", situations: [] } },
  title: "Components/Accordion",
  component: Accordion,
  args: { type: "single", collapsible: true },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Show component="accordion">
      {(s) => (
        <Accordion {...args} className="max-w-lg">
          {s.metrics.map((m) => (
            <AccordionItem key={m.label} value={m.label}>
              <AccordionTrigger>{m.label}</AccordionTrigger>
              <AccordionContent>{m.value}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Show>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="accordion">
      {(s) => (
        <Accordion type="single" collapsible defaultValue={s.metrics[0].label} className="max-w-lg">
          {s.metrics.map((m) => (
            <AccordionItem key={m.label} value={m.label}>
              <AccordionTrigger>{m.label}</AccordionTrigger>
              <AccordionContent>{m.value}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Show>
  ),
};
