---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 39.5
slug: "message-scroller/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Message scroller in Dense data."
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

:::panel{media="wide"}
![Message scroller, every part numbered](/anatomy/dense-data/message-scroller/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Message scroller** required :label[Containment]
  - **1** **Scroll region** required :label[By scheme]{tone="info"} :label[Containment] :label[Reach]
  - **2** **Space between messages** required :label[By scheme]{tone="info"} :label[Grouping]
  - **3** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
  - **Message** required · shown by Bubble :label[Readability]
  - **Day marker** optional · shown by Marker :label[Grouping]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Scroll region" note="Parts 1" media="side"}
![Scroll region: 1](/anatomy/dense-data/message-scroller/card-1.png)

:label[Containment] :label[Reach]

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Badges sit in columns and need their own corner.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Token** `radius.surface` → `radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Small corners keep dense rows straight.
:::

:::panel{id="part-2" title="Space between messages" note="Parts 2" media="side"}
![Space between messages: 2](/anatomy/dense-data/message-scroller/card-2.png)

:label[Grouping]

- **Answer** Spacing · Which spacing roles does it need? → Gaps, insets and row heights

  Row height is a decision of its own in a table product.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.gap.group` → `gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-3" title="Focus ring" note="Parts 3" media="side"}
![Focus ring: 3](/anatomy/dense-data/message-scroller/card-3.png)

:label[Focus]

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `border-width.focus` → `focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `color.border.focus` → `focus-ring-focus` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset-focus` #F7F8FA · dark #0D1117 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `message-scroller`.
- **From a terminal:** `npx open-ds anatomy dense-data message-scroller`
