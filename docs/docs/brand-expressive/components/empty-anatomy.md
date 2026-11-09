---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 26.5
slug: "empty/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Empty in Brand expressive."
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

![Empty, every part numbered](/anatomy/brand-expressive/empty/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

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
![Frame: 1](/anatomy/brand-expressive/empty/card-1.png)

:label[Containment]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Token** `component-spacing-map.x6` → `padding` 3rem :label[By scheme]{tone="info"}

  - **Pick** space.48

- **Token** `component-spacing-map.x12` → `padding-2` 4rem :label[By scheme]{tone="info"}

  - **Pick** space.64

- **Token** `space.gap.section` → `gap` 4rem :label[By scheme]{tone="info"}

  - **Pick** space.64
:::

:::panel{id="part-2" title="Icon" note="Parts 2"}
![Icon: 2](/anatomy/brand-expressive/empty/card-2.png)

:label[Meaning]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons hold their own next to big type.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Token** `color.surface.sunken` → `icon.background` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.21:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.primary` → `icon.label` #1F1411 · dark #FFF8F3 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.0:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `component-spacing-map.x2` → `icon.margin-bottom` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-3-4" title="Title and why it is empty" note="Parts 3, 4"}
![Title and why it is empty: 3, 4](/anatomy/brand-expressive/empty/card-3.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Answer** Voice and tone · Where do the words matter most? → Headlines and buttons

  Words work hardest in headlines and buttons.

- **Rule** For an empty state, use Playful, with a clear next step. Don't use a dead end.

  Playful words still need a way forward.

- **Token** `type.heading.font-size` → `title.font-size` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.28

- **Token** `type.label.font-weight` → `title.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `color.text.muted` → `description.label` #6B544A · dark #B5988A :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.71:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-5" title="Action area" note="Parts 5"}
![Action area: 5](/anatomy/brand-expressive/empty/card-4.png)

:label[Affordance]

- **Answer** What is the main task? → Browse and explore

  People browse and explore the story.

- **Token** `space.gap.group` → `content.gap` 2.5rem :label[By scheme]{tone="info"}

  - **Pick** space.40
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `empty`.
- **From a terminal:** `npx open-ds anatomy brand-expressive empty`
