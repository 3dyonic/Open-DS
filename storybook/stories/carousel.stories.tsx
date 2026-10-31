import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  Card,
  CardContent,
} from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "carousel", situations: [] } },
  title: "Components/Carousel",
  component: Carousel,
} satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Show component="carousel">
      {(s) => (
        <Carousel {...args} className="mx-12 max-w-sm">
          <CarouselContent>
            {s.metrics.map((m) => (
              <CarouselItem key={m.label}>{m.label}</CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </Show>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="carousel">
      {(s) => (
        <Carousel className="mx-12 max-w-sm">
          <CarouselContent>
            {s.metrics.map((m) => (
              <CarouselItem key={m.label}>
                <Card>
                  <CardContent className="flex flex-col gap-[var(--space-gap-tight)] p-[var(--card-padding)]">
                    <span className="text-[var(--color-text-secondary)]">{m.label}</span>
                    <span className="[font-family:var(--type-display-font-family)] text-[length:var(--type-display-font-size)]">
                      {m.value}
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </Show>
  ),
};
