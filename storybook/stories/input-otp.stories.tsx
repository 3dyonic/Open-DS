import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@open-ds/ui";
import { Show } from "../src/samples";

const meta = {
  parameters: { openDs: { component: "input-otp", situations: ["field-label", "error-message"] } },
  title: "Components/Input otp",
  component: InputOTPGroup,
} satisfies Meta<typeof InputOTPGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const Examples: Story = {
  render: () => (
    <Show component="input-otp">
      {(s) => (
        <div className="flex flex-col gap-[var(--space-gap-default)]">
          <p className="text-[var(--color-text-secondary)]">{s.field.hint}</p>
          <InputOTP maxLength={6} aria-label={s.field.label}>
            <InputOTPGroup>
              {[0, 1, 2].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              {[3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}
    </Show>
  ),
};
