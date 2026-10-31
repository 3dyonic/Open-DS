import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "combobox", situations: ["field-label", "error-message"] } },
  title: "Components/Combobox",
  component: Combobox,
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Show component="combobox">
      {(s) => (
        <Combobox items={s.table?.rows.map((r) => r.cells[0]) ?? s.metrics.map((m) => m.label)}>
          <ComboboxInput placeholder={s.field.label} />
          <ComboboxContent>
            <ComboboxEmpty>No match.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
    </Show>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="combobox">
      {(s) => (
        <div className="max-w-sm">
          <Combobox items={s.table?.rows.map((r) => r.cells[0]) ?? s.metrics.map((m) => m.label)}>
            <ComboboxInput placeholder={s.table?.columns[0].label ?? s.field.label} />
            <ComboboxContent>
              <ComboboxEmpty>No match.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      )}
    </Show>
  ),
};
