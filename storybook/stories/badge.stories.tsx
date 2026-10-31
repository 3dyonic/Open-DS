import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@open-ds/ui";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Status", tone: "neutral" },
  argTypes: { tone: { control: "inline-radio", options: ["neutral", "success", "warning", "danger"] } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// Each status shows in the tone its meaning picks. Danger appears only where the scheme says something failed.
export const Statuses: Story = {
  render: () => (
    <Show component="badge">
      {(s) => (
        <div>
          <dl className="grid max-w-2xl grid-cols-[auto_1fr] items-center gap-x-[var(--space-gap-group)] gap-y-[var(--space-gap-default)]">
            {s.statuses.map((x) => (
              <div key={x.label} className="contents">
                <dt>
                  <Badge tone={x.meaning}>{x.label}</Badge>
                </dt>
                <dd className="text-[var(--color-text-secondary)]">
                  {x.meaning}: {x.why}
                </dd>
              </div>
            ))}
          </dl>
          <Usage situations={["status-label", "status-shape"]} />
        </div>
      )}
    </Show>
  ),
};
