import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertTitle, AlertDescription } from "@open-ds/ui";
import { AlertTriangle } from "lucide-react";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "alert", situations: ["error-message", "status-label"] } },
  title: "Components/Alert",
  component: Alert,
  args: { variant: "default" },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <AlertTriangle />
      <AlertTitle>Alert</AlertTitle>
      <AlertDescription>Stays on the page until the cause is fixed.</AlertDescription>
    </Alert>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="alert">
      {(s) => (
        <div className="grid max-w-lg gap-[var(--space-gap-default)]">
          {/* Warning and danger statuses, each in the tone its meaning picks. */}
          {s.statuses
            .filter((x) => x.meaning === "warning" || x.meaning === "danger")
            .map((x) => (
              <Alert key={x.label} variant={x.meaning === "danger" ? "destructive" : "default"}>
                <AlertTriangle />
                <AlertTitle>{x.label}</AlertTitle>
                <AlertDescription>{x.why}</AlertDescription>
              </Alert>
            ))}
        </div>
      )}
    </Show>
  ),
};
