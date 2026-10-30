import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = { title: "Components/Card", component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Order 1042</CardTitle>
          <CardDescription>Northwind warehouse · due in 3 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge tone="warning">Late</Badge>
        </CardContent>
        <CardFooter>
          <Button>Ship now</Button>
          <Button variant="ghost">View</Button>
        </CardFooter>
      </Card>
      <Usage situations={["card", "related-items", "between-sections"]} />
    </div>
  ),
};
