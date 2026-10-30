import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@open-ds/ui";
import { Usage } from "../src/usage";

const meta = { title: "Components/Tabs", component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="late">Late</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
        <TabsContent value="open">12 open orders.</TabsContent>
        <TabsContent value="late">3 late orders.</TabsContent>
        <TabsContent value="done">240 done this month.</TabsContent>
      </Tabs>
      <Usage situations={["keyboard-focus"]} />
    </div>
  ),
};
