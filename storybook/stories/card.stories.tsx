import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@open-ds/ui";
import { Usage } from "../src/usage";
import { Show, toneOf } from "../src/samples";

const meta = { title: "Components/Card", component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
          <Usage situations={["card", "related-items", "between-sections"]} />
        </div>
      )}
    </Show>
  ),
};
