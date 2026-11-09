---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 26.5
slug: "empty/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Empty in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the empty state apart to show how design decisions become the parts you see. You don't need it to use the empty state: [its own page](../empty) has everything you need to build.

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

![Empty, every part numbered](/anatomy/content-first/empty/stage.png)

*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Frame** required :label[By scheme]{tone="info"} :label[Containment]
- **Header** required :label[Hierarchy] :label[Grouping]
  - **2** **Icon** optional :label[By scheme]{tone="info"} :label[Meaning]
  - **3** **Title** required :label[By scheme]{tone="info"} :label[Hierarchy]
  - **4** **Why it is empty** optional :label[By scheme]{tone="info"} :label[Readability]
- **5** **Action area** optional :label[By scheme]{tone="info"} :label[Affordance]
- **The one action that fills it** optional · shown by Button :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Frame" note="Parts 1"}
![Frame: 1](/anatomy/content-first/empty/card-1.png)

:label[Containment]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Token** `component-spacing-map.x6` → `padding` 2.25rem :label[By scheme]{tone="info"}

  - **Pick** space.36

- **Token** `component-spacing-map.x12` → `padding-2` 4rem :label[By scheme]{tone="info"}

  - **Pick** space.64

- **Token** `space.gap.section` → `gap` 4rem :label[By scheme]{tone="info"}

  - **Pick** space.64
:::

:::panel{id="part-2" title="Icon" note="Parts 2"}
![Icon: 2](/anatomy/content-first/empty/card-2.png)

:label[Meaning]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text size.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Token** `color.surface.sunken` → `icon.background` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.12:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.2:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.primary` → `icon.label` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `component-spacing-map.x2` → `icon.margin-bottom` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-3-4" title="Title and why it is empty" note="Parts 3, 4"}
![Title and why it is empty: 3, 4](/anatomy/content-first/empty/card-3.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Answer** Voice and tone · Where do the words matter most? → Articles and guides

  Most words are in articles and guides.

- **Rule** For an empty state, use An invitation, not a dead end. Don't use "No items".

  An empty list is a chance to show what the product offers.

- **Token** `type.heading.font-size` → `title.font-size` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.28

- **Token** `type.label.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `color.text.muted` → `description.label` #61594D · dark #A39A8B :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.9:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.16:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-5" title="Action area" note="Parts 5"}
![Action area: 5](/anatomy/content-first/empty/card-4.png)

:label[Affordance]

- **Answer** What is the main task? → Read start to end

  People read from start to end.

- **Token** `space.gap.group` → `content.gap` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `empty`.
- **From a terminal:** `npx open-ds anatomy content-first empty`
