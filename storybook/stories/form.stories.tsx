import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Button,
} from "@open-ds/ui";
import { useForm } from "react-hook-form";
import type { Samples } from "../src/samples";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "form", situations: ["field-label", "error-message"] } },
  title: "Components/Form",
  component: FormItem,
} satisfies Meta<typeof FormItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: () => <Show component="form">{(s) => <FormExample s={s} />}</Show> };

export const Examples: Story = {
  render: () => <Show component="form">{(s) => <FormExample s={s} />}</Show>,
};

// A form wired to react-hook-form: the field shows the scheme's error when the value is empty.
function FormExample({ s }: { s: Samples }) {
  const form = useForm<{ value: string }>({ defaultValues: { value: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="grid max-w-sm gap-[var(--space-gap-group)]">
        <FormField
          control={form.control}
          name="value"
          rules={{ required: s.field.error }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{s.field.label}</FormLabel>
              <FormControl>
                <Input placeholder={s.field.placeholder || undefined} {...field} />
              </FormControl>
              <FormDescription>{s.field.hint}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{s.actions.primary}</Button>
      </form>
    </Form>
  );
}
