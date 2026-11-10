---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7.5
slug: "badge/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Badge in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the badge apart to show how design decisions become the parts you see. You don't need it to use the badge: [its own page](../badge) has everything you need to build.

**Three easy ways in**

- Start with the drawing. Each number is one part, and the legend beside it names it.
- Want to know why a part looks the way it does? Its card follows the decision from the answer about the product, through the rule and the token, to what you see.
- Or start from a job, like Focus or Emphasis, and find every part that does it in the legend.

Come back whenever a part makes you wonder why.
:::

## Design roles

Each part does a job for the person. These are the jobs, as questions the part answers.

- **Containment** What holds this?
- **Layering** What sits on top?
- **Hierarchy** What do you read first?
- **Readability** Can you read it?
- **Emphasis** Where does the eye go?
- **Meaning** What state is it in?
- **Affordance** Can you act on it?
- **Feedback** Did it respond?
- **Focus** Where is the keyboard?
- **Grouping** What belongs together?
- **Reach** Can you hit it?

## The parts

:::panel{media="wide"}
![Badge, every part numbered](/anatomy/multi-brand/badge/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Fill** required :label[By scheme]{tone="info"} :label[Containment] :label[Meaning]
- **2** **Label** required :label[By scheme]{tone="info"} :label[Readability] :label[Meaning]
- **3** **Tone** optional :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
- **Icon** optional · not in this example :label[By scheme]{tone="info"} :label[Meaning]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Fill" note="Parts 1" media="side"}
![Fill: 1](/anatomy/multi-brand/badge/card-1.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For shape of a status badge, use radius.badge (set by the brand). Don't use a hard-coded shape.

  The brand sets the badge shape.

- **Token** `radius.badge` → `radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.

- **Token** `space.gap.tight` → `padding-x` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8

- **Token** `component-spacing-map.hairline` → `padding-y` 0.125rem

  - **Pick** space.2

- **Token** `color.surface.sunken` → `neutral.background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.
:::

:::panel{id="part-2" title="Label" note="Parts 2" media="side"}
![Label: 2](/anatomy/multi-brand/badge/card-2.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Rule** For a status, use Badge with a word. Don't use a brand color as status.

  Brand hues vary, so meaning needs a word.

- **Token** `type.caption.font-size` → `font-size` 0.8125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.13

- **Token** `type.label.font-weight` → `font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `type.caption.font-family` → `font-family` Inter, system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** inter for caption text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one.

- **Token** `color.text.secondary` → `neutral.label` #334155 · dark #CBD5E1 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 10.35:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 12.02:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-3" title="Tone" note="Parts 3" media="side"}
![Tone: 3](/anatomy/multi-brand/badge/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Rule** For a status, use Badge with a word. Don't use a brand color as status.

  Brand hues vary, so meaning needs a word.

- **Token** `color.status.info.subtle` → `info.background` #D3E4FF · dark #0D2244 :label[By scheme]{tone="info"}

  The fill behind info status.

  - **Pick** blue.light.100: a quiet tint behind info; its text, 12.97:1, above the 4.5:1 floor.
  - **Dark** blue.dark.100: a quiet tint behind info; its text, 12.27:1, above the 4.5:1 floor.
  - **Shares the step with** category.4.subtle. Changing this pick moves only what reads color.status.info.subtle.

- **Token** `color.status.success.subtle` → `success.background` #DBF7DF · dark #012A14 :label[By scheme]{tone="info"}

  The fill behind success status.

  - **Pick** green.light.100: a quiet tint behind success; its text, 10.79:1, above the 4.5:1 floor.
  - **Dark** green.dark.100: a quiet tint behind success; its text, 13.69:1, above the 4.5:1 floor.
  - **Shares the step with** category.5.subtle. Changing this pick moves only what reads color.status.success.subtle.

- **Token** `color.status.warning.subtle` → `warning.background` #FEE8CF · dark #332201 :label[By scheme]{tone="info"}

  The fill behind warning status.

  - **Pick** amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 4.5:1 floor.
  - **Dark** amber.dark.100: a quiet tint behind warning; its text, 12.89:1, above the 4.5:1 floor.

- **Token** `color.status.danger.subtle` → `danger.background` #FFDBD8 · dark #410C11 :label[By scheme]{tone="info"}

  The fill behind danger status.

  - **Pick** red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor.
  - **Dark** red.dark.100: a quiet tint behind danger; its text, 12.74:1, above the 4.5:1 floor.

- **Token** `color.text.warning-on-light` → `warning.label` #462A02

  The label on a light warning fill, such as its tint in light mode: a fixed color from the light scale (800).

  - **Pick** amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `badge`.
- **From a terminal:** `npx open-ds anatomy multi-brand badge`
