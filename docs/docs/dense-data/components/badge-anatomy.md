---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7.5
slug: "badge/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Badge in Dense data."
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
![Badge, every part numbered](/anatomy/dense-data/badge/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

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
![Fill: 1](/anatomy/dense-data/badge/card-1.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For shape of a status badge, use radius.badge (rectangle). Don't use a pill.

  Rectangles line up in a column.

- **Token** `radius.badge` → `radius` 0rem :label[By scheme]{tone="info"}

  - **Pick** radius.0: Small corners keep dense rows straight.

- **Token** `space.gap.tight` → `padding-x` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4

- **Token** `component-spacing-map.hairline` → `padding-y` 0.125rem

  - **Pick** space.2

- **Token** `color.surface.sunken` → `neutral.background` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.
:::

:::panel{id="part-2" title="Label" note="Parts 2" media="side"}
![Label: 2](/anatomy/dense-data/badge/card-2.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Rule** For a status, use Badge with a subtle fill, an icon and a word. Don't use a full-strength fill.

  Subtle fills let many statuses share one table.

- **Token** `type.caption.font-size` → `font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12

- **Token** `type.label.font-weight` → `font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500

- **Token** `type.caption.font-family` → `font-family` "IBM Plex Sans", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** ibm-plex-sans for caption text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero.

- **Token** `color.text.secondary` → `neutral.label` #3D4655 · dark #C4CBD6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.52:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.58:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-3" title="Tone" note="Parts 3" media="side"}
![Tone: 3](/anatomy/dense-data/badge/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Many statuses share one table; color alone is not enough.

- **Rule** For a status, use Badge with a subtle fill, an icon and a word. Don't use a full-strength fill.

  Subtle fills let many statuses share one table.

- **Token** `color.status.info.subtle` → `info.background` #D3E4FF · dark #162C4F :label[By scheme]{tone="info"}

  The fill behind info status.

  - **Pick** blue.light.100: a quiet tint behind info; its text, 12.97:1, above the 4.5:1 floor.
  - **Dark** blue.dark.100: a quiet tint behind info; its text, 10.82:1, above the 4.5:1 floor.
  - **Shares the step with** category.2.subtle. Changing this pick moves only what reads color.status.info.subtle.

- **Token** `color.status.success.subtle` → `success.background` #DBF7DF · dark #01351A :label[By scheme]{tone="info"}

  The fill behind success status.

  - **Pick** green.light.100: a quiet tint behind success; its text, 10.79:1, above the 4.5:1 floor.
  - **Dark** green.dark.100: a quiet tint behind success; its text, 12.05:1, above the 4.5:1 floor.
  - **Shares the step with** category.3.subtle. Changing this pick moves only what reads color.status.success.subtle.

- **Token** `color.status.warning.subtle` → `warning.background` #FEE8CF · dark #3F2B02 :label[By scheme]{tone="info"}

  The fill behind warning status.

  - **Pick** amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 4.5:1 floor.
  - **Dark** amber.dark.100: a quiet tint behind warning; its text, 11.34:1, above the 4.5:1 floor.
  - **Shares the step with** category.4.subtle. Changing this pick moves only what reads color.status.warning.subtle.

- **Token** `color.status.danger.subtle` → `danger.background` #FFDBD8 · dark #4C171A :label[By scheme]{tone="info"}

  The fill behind danger status.

  - **Pick** red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor.
  - **Dark** red.dark.100: a quiet tint behind danger; its text, 11.33:1, above the 4.5:1 floor.

- **Token** `color.text.warning-on-light` → `warning.label` #462A02

  The label on a light warning fill, such as its tint in light mode: a fixed color from the light scale (800).

  - **Pick** amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `badge`.
- **From a terminal:** `npx open-ds anatomy dense-data badge`
