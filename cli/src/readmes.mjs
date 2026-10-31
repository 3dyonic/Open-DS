// The README in each tokens/src folder of a created project: what the folder holds, its rules and a
// real example from the scheme. Written for the team and for agents.
import { flatTokens, themeName } from "./tokens.mjs";

const block = (o) => "```json\n" + JSON.stringify(o, null, 2) + "\n```";

/** Folder (relative to tokens/src, with a trailing slash, or "" for the root) → README text. */
export function tokenReadmes(scheme) {
  const t = scheme.tokens;
  const brand = Object.keys(t.brands)[0];
  const name = themeName(scheme.id, brand);
  const theme = t.brands[brand].theme;
  const hue = Object.keys(t.primitive.color).find((k) => !k.startsWith("$"));
  const steps = Object.keys(t.primitive.color[hue].light ?? {});
  const pick = theme.light.color.action.primary;
  const semantic = t.semantic.color.action.primary;
  const [componentPath] =
    flatTokens(t.component).find(
      ([, v]) => v.$value === "{color.action.primary.@}",
    ) ?? [];

  return {
    "": `# Token source

The DTCG token source of this design system. Edit a file here, then run \`npm run tokens\`.

| Folder | What it holds | Ships as CSS variables |
| --- | --- | --- |
| \`primitive/\` | The raw options: steps only. | No |
| \`theme/\` | Each brand's decisions, per mode. | No |
| \`semantic/\` | The plain keys components and products read. | Yes |
| \`component/\` | One key per part of a component. | Yes |

How a value travels: a component key reads a semantic key, the semantic key reads the brand's theme, and the theme picks a primitive. Only semantic and component keys become CSS variables. The build resolves primitives and themes to values.

## The base, @

A concept with variants has a base, \`@\`, beside them: \`color.action.primary.@\` and \`color.action.primary.hover\`. A reference names it: \`{color.action.primary.@}\`. The build drops the \`@\` from the name, so it becomes \`--color-action-primary\`.
`,
    "primitive/": `# Primitives

The raw options every brand picks from: colour, space, size, radius, border width, font, shadow, duration, easing and opacity. One file per group. Colour has one folder per hue.

## Rules

- Steps only. A primitive has no meaning and no base (\`@\`): each theme decides its own base.
- Values live here and nowhere else.
- Components and products never read a primitive. They do not ship as CSS variables.
`,
    "primitive/color/": `# Colour primitives

One file per hue. Each hue has a light ramp and a dark ramp: the same steps, tuned for light and for dark backgrounds.

\`color.<hue>.light.<step>\` and \`color.<hue>.dark.<step>\`, for example \`color.${hue}.light.${steps[Math.floor(steps.length / 2)] ?? steps[0]}\`.

## Rules

- Steps only, no base. A theme picks a step for each of its concepts.
- A light theme picks from light ramps and a dark theme from dark ramps.
`,
    "theme/": `# Themes

One file per brand: the decision layer. It holds a \`base\` part (mode-free picks such as fonts and corners), a \`light\` part and a \`dark\` part. Each part has the same paths as the semantic keys it serves, and each token picks a primitive.

## Rules

- Each mode decides its own base (\`@\`) for every concept with variants.
- Light and dark have the same keys.
- Themes are build-time only. Semantics resolve through them, and they never ship as CSS variables.

## Example, ${name} light

${block({ [name]: { theme: { light: { color: { action: { primary: pick } } } } } })}
`,
    "semantic/": `# Semantic keys

The stable names components and products read. One file per group. A key that depends on the brand or mode points at the theme, on its own path. The build points it at the active brand and mode.

## Rules

- Never a raw value. A semantic key points at the theme or at another key.
- The name says what it is for, not what it looks like.
- These ship as CSS variables: \`color.action.primary.@\` is \`--color-action-primary\`.

## Example

${block({ color: { action: { primary: semantic } } })}
`,
    "component/": `# Component keys

One file per component. Each key is one part of a component, and it reads a semantic key.

## Rules

- A component reads only its own keys. A key reads a semantic, never a primitive or the theme.
- These ship as CSS variables: the path with dots as dashes and the \`@\` dropped${
      componentPath
        ? `, so \`${componentPath}\` is \`--${componentPath
            .split(".")
            .filter((p) => p !== "@")
            .join("-")}\``
        : ""
    }.
`,
  };
}
