import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Check, FileText, ListFilter, MoreHorizontal, Search, Sparkles } from "lucide-react";
import { Button, Icon } from "@open-ds/ui";
import { Show } from "../src/samples";

const ICONS = { Bell, Check, FileText, ListFilter, MoreHorizontal, Search, Sparkles };

const meta = {
  parameters: { openDs: { component: "icon", situations: ["icon-alone", "row-action"] } },
  title: "Components/Icon",
  component: Icon,
  args: { icon: Bell, size: "default", variant: "plain" },
  argTypes: {
    icon: { control: "select", options: Object.keys(ICONS), mapping: ICONS },
    size: { control: "inline-radio", options: ["default", "large"] },
    variant: { control: "inline-radio", options: ["plain", "contained-tint", "contained-solid"] },
    label: { control: "text" },
  },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// An icon beside its word, an icon button with a label, and the looks the scheme uses.
export const Examples: Story = {
  render: () => (
    <Show component="icon">
      {(s) => (
        <div className="flex flex-col gap-[var(--space-gap-group)]">
          <div className="flex flex-wrap items-center gap-[var(--space-gap-default)]">
            <Button variant="outline">
              <Icon icon={ListFilter} /> Filter
            </Button>
            <Button variant="outline">
              <Icon icon={FileText} /> Export
            </Button>
            <Button variant="ghost" aria-label="More actions">
              <Icon icon={MoreHorizontal} />
            </Button>
          </div>
          <ul className="m-0 flex list-none flex-col gap-[var(--space-gap-tight)] p-0">
            {s.statuses.slice(0, 2).map((x, i) => (
              <li key={x.label} className="flex items-center gap-[var(--space-gap-tight)]">
                <Icon icon={i ? Check : Search} /> {x.label}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-[var(--space-gap-default)]">
            <Icon icon={Sparkles} variant="contained-tint" />
            <Icon icon={Sparkles} variant="contained-solid" />
            <Icon icon={Sparkles} size="large" />
          </div>
        </div>
      )}
    </Show>
  ),
};
