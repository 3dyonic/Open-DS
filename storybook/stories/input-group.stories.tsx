import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@open-ds/ui";
import { Search } from "lucide-react";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "input-group", situations: ["field-label", "error-message"] } },
  title: "Components/Input group",
  component: InputGroup,
} satisfies Meta<typeof InputGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <InputGroup {...args} className="max-w-sm">
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search" />
    </InputGroup>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="input-group">
      {(s) => (
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput aria-label={s.field.label} placeholder={s.field.placeholder || s.field.label} />
          <InputGroupAddon align="inline-end">
            <InputGroupText>{s.table?.rows.length ?? s.metrics.length}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      )}
    </Show>
  ),
};
