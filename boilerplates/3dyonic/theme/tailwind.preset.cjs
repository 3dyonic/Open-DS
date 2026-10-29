/** Tailwind preset. Values point at the theme CSS variables. */
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: "var(--color-surface)",
        "on-surface": "var(--color-on-surface)",
        accent: "var(--color-accent)",
        "on-accent": "var(--color-on-accent)",
        border: "var(--color-border)",
        focus: "var(--color-focus)",
      },
      borderRadius: {
        control: "var(--radius-control)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      transitionDuration: {
        quick: "var(--motion-quick)",
      },
    },
  },
};
