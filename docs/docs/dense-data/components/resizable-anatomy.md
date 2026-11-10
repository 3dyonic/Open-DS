---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 46.5
slug: "resizable/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Resizable in Dense data."
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
![Resizable, every part numbered](/anatomy/dense-data/resizable/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

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
![Line: 1](/anatomy/dense-data/resizable/card-1.png)

:label[Grouping] :label[Affordance]

- **Answer** Elevation · What separates groups on the page? → Lines

  Thin lines guide the eye along rows.

- **Rule** For between page sections, use space.gap.section and a hairline. Don't use a card around every section.

  Lines separate without taking room from the data.

- **Token** `border-width.default` → `handle.thickness` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1

- **Token** `color.border.default` → `handle.background` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-2" title="Grip" note="Parts 2" media="side"}
![Grip: 2](/anatomy/dense-data/resizable/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use radius.round.

  Small corners keep dense rows straight.

- **Token** `size.icon` → `grip.height` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `radius.control` → `grip.radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `color.border.default` → `grip.background` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.border.default` → `grip.border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `grip.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-3" title="Focus ring" note="Parts 3" media="side"}
![Focus ring: 3](/anatomy/dense-data/resizable/card-3.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `border-width.focus` → `handle.focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `color.border.focus` → `handle.focus-ring-focus` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `handle.focus-ring-offset-focus` #F7F8FA · dark #0D1117 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `resizable`.
- **From a terminal:** `npx open-ds anatomy dense-data resizable`
