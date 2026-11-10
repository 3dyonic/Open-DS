import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, FileText, ListFilter, MoreHorizontal, Search, Sparkles } from "lucide-react";
import { Button, Icon } from "@open-ds/ui";
import { Show, useVariants } from "../src/samples";

const ICONS = { Bell, FileText, ListFilter, MoreHorizontal, Search, Sparkles };

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

// An icon beside its word, an icon button with a label, and only the looks this scheme uses: each
// variant the scheme decides as used, other than the defaults, read from its inventory.
function Looks() {
  const looks = [
    ...useVariants("icon", "variant").filter((v) => v !== "plain").map((v) => ({ variant: v })),
    ...useVariants("icon", "size").filter((v) => v !== "default").map((v) => ({ size: v })),
  ] as { variant?: "contained-tint" | "contained-solid"; size?: "large" }[];
  return looks.length ? (
    <div className="flex items-center gap-[var(--space-gap-default)]">
      {looks.map((look) => (
        <Icon key={JSON.stringify(look)} icon={Sparkles} {...look} />
      ))}
    </div>
  ) : null;
}

export const Examples: Story = {
  render: () => (
    <Show component="icon">
      {(s) => (
        <div className="flex flex-col gap-[var(--space-gap-group)]">
          <div className="flex flex-wrap items-center gap-[var(--space-gap-default)]">
            <Button variant="secondary">
              <Icon icon={ListFilter} /> Filter
            </Button>
            <Button variant="secondary">
              <Icon icon={FileText} /> Export
            </Button>
            <Button variant="secondary" aria-label="More actions">
              <Icon icon={MoreHorizontal} />
            </Button>
          </div>
          <p className="flex items-center gap-[var(--space-gap-tight)]">
            <Icon icon={Search} /> {s.statuses[0]?.label}
          </p>
          <Looks />
        </div>
      )}
    </Show>
  ),
};
