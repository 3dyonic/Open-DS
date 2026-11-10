---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 46.5
slug: "resizable/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Resizable in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the resizable panels apart to show how design decisions become the parts you see. You don't need it to use the resizable panels: [its own page](../resizable) has everything you need to build.

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
![Resizable, every part numbered](/anatomy/brand-expressive/resizable/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Panel** required :label[Containment]
- **Handle** required :label[Grouping] :label[Affordance]
  - **1** **Line** required :label[By scheme]{tone="info"} :label[Grouping] :label[Affordance]
  - **2** **Grip** optional :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **3** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Line" note="Parts 1" media="side"}
![Line: 1](/anatomy/brand-expressive/resizable/card-1.png)

:label[Grouping] :label[Affordance]

- **Answer** Elevation · What separates groups on the page? → Cards

  Cards hold each offer.

- **Rule** For between page sections, use space.gap.section and a color block. Don't use a thin line.

  Big space and color make each section a moment.

- **Token** `border-width.default` → `handle.thickness` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `color.border.default` → `handle.background` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-2" title="Grip" note="Parts 2" media="side"}
![Grip: 2](/anatomy/brand-expressive/resizable/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Rule** For corners of buttons and inputs, use radius.control (pill). Don't use sharp corners.

  Pills match the brand's round, playful shapes. Sharp corners would feel corporate.

- **Token** `size.icon` → `grip.height` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `radius.control` → `grip.radius` calc(infinity * 1px) :label[By scheme]{tone="info"}

  - **Pick** radius.pill: Pill controls feel playful.

- **Token** `color.border.default` → `grip.background` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.border.default` → `grip.border` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `grip.border-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-3" title="Focus ring" note="Parts 3" media="side"}
![Focus ring: 3](/anatomy/brand-expressive/resizable/card-3.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA, checked on every vivid color.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Focus must show on vivid color.

- **Token** `border-width.focus` → `handle.focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `color.border.focus` → `handle.focus-ring-focus` #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** pink.light.600: the focus ring, so the keyboard's place is never lost, 4.84:1 on surface.default, above the 3:1 floor.
  - **Dark** pink.dark.600: the focus ring, so the keyboard's place is never lost, 8.88:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `handle.focus-ring-offset-focus` #FFF8F3 · dark #120B09 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.08:1 from surface.default, so cards and panels stand forward.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `resizable`.
- **From a terminal:** `npx open-ds anatomy brand-expressive resizable`
