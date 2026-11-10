---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 40.5
slug: "message-scroller/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Message scroller in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the message scroller apart to show how design decisions become the parts you see. You don't need it to use the message scroller: [its own page](../message-scroller) has everything you need to build.

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

![Message scroller, every part numbered](/anatomy/multi-brand/message-scroller/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Message scroller** required :label[Containment]
  - **1** **Scroll region** required :label[By scheme]{tone="info"} :label[Containment] :label[Reach]
  - **2** **Space between messages** required :label[By scheme]{tone="info"} :label[Grouping]
  - **3** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
  - **Message** required · shown by Bubble :label[Readability]
  - **Day marker** optional · shown by Marker :label[Grouping]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Scroll region" note="Parts 1"}
![Scroll region: 1](/anatomy/multi-brand/message-scroller/card-1.png)

:label[Containment] :label[Reach]

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Each brand sets three corners.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Token** `radius.container` → `radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded by default; each brand sets its own corner.
:::

:::panel{id="part-2" title="Space between messages" note="Parts 2"}
![Space between messages: 2](/anatomy/multi-brand/message-scroller/card-2.png)

:label[Grouping]

- **Answer** Spacing · Which spacing roles does it need? → Gaps, insets and row heights

  Account tables need a row height.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `space.gap.group` → `gap` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-3" title="Focus ring" note="Parts 3"}
![Focus ring: 3](/anatomy/multi-brand/message-scroller/card-3.png)

:label[Focus]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA in every brand and mode.

- **Rule** For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline.

  Focus follows the brand but always shows.

- **Token** `border-width.focus` → `focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `color.border.focus` → `focus-ring-focus` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** teal.light.600: the focus ring, so the keyboard's place is never lost, 5.47:1 on surface.default, above the 3:1 floor.
  - **Dark** teal.dark.600: the focus ring, so the keyboard's place is never lost, 9.9:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset-focus` #F8FAFC · dark #020617 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `message-scroller`.
- **From a terminal:** `npx open-ds anatomy multi-brand message-scroller`
