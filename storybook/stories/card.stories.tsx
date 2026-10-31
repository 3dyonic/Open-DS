import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@open-ds/ui";
import { Show, toneOf } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "card", situations: ["card", "related-items", "between-sections"] } },
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Show component="card">
      {(s) => (
        <Card {...args} className="max-w-md">
          <CardHeader>
            <CardTitle>{s.card!.title}</CardTitle>
            <CardDescription>{s.card!.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </Show>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="card">
      {(s) => (
        <div className="max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>{s.card!.title}</CardTitle>
              <CardDescription>{s.card!.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge tone={toneOf(s, s.card!.status)}>{s.card!.status}</Badge>
            </CardContent>
            <CardFooter>
              <Button>{s.card!.primary}</Button>
              <Button variant="ghost">{s.card!.secondary}</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Show>
  ),
};
