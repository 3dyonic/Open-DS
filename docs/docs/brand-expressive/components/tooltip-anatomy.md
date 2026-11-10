---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 62.5
slug: "tooltip/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Tooltip in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the tooltip apart to show how design decisions become the parts you see. You don't need it to use the tooltip: [its own page](../tooltip) has everything you need to build.

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
![Tooltip, every part numbered](/anatomy/brand-expressive/tooltip/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Trigger** required · shown by Button :label[Affordance]
- **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
- **2** **Hint** required :label[By scheme]{tone="info"} :label[Readability] :label[Meaning]
- **3** **Offset** required :label[By scheme]{tone="info"} :label[Grouping]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Surface" note="Parts 1" media="side"}
![Surface: 1](/anatomy/brand-expressive/tooltip/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For shape of a status badge, use radius.badge (pill). Don't use a rectangle.

  Pills match the controls.

- **Token** `color.surface.inverse` → `content.background` #1F1411 · dark #FFF8F3 :label[By scheme]{tone="info"}

  A reversed fill for small, short-lived messages.

  - **Pick** neutral.900: the reverse of content for short messages; its text reads, 18.0:1 on surface.inverse, above the 4.5:1 floor.
  - **Dark** neutral.900: the reverse of content for short messages; its text reads, 17.12:1 on surface.inverse, above the 4.5:1 floor.
  - **Shares the step with** text.primary. Changing this pick moves only what reads color.surface.inverse.

- **Token** `radius.badge` → `content.radius` calc(infinity * 1px) :label[By scheme]{tone="info"}

  - **Pick** radius.pill: Pill controls feel playful.

- **Token** `component-spacing-map.x2` → `content.padding-x` 0.5rem

  - **Pick** space.8

- **Token** `component-spacing-map.x1` → `content.padding-y` 0.25rem

  - **Pick** space.4
:::

:::panel{id="part-2" title="Hint" note="Parts 2" media="side"}
![Hint: 2](/anatomy/brand-expressive/tooltip/card-2.png)

:label[Readability] :label[Meaning]

- **Answer** Typography · How large is body text? → Regular

  Regular body; the display does the shouting.

- **Answer** Iconography · What do icons do? → Those and decoration

  Icons also decorate campaign pages.

- **Rule** For an icon with no label, use Not used: always add a word. Don't use an icon button with a hover hint.

  On phones, hover hints never show; a word says what will happen.

- **Token** `color.text.inverse` → `content.label` #FFFFFF · dark #1F1411 :label[By scheme]{tone="info"}

  Text on an inverse fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 18.0:1 on surface.inverse, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 17.12:1 on surface.inverse, above the 4.5:1 floor.
  - **Shares the step with** text.on-action, text.on-danger. Changing this pick moves only what reads color.text.inverse.

- **Token** `type.caption.font-size` → `content.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.caption.font-family` → `content.font-family` "DM Sans", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** dm-sans for caption text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read.
:::

:::panel{id="part-3" title="Offset" note="Parts 3" media="side"}
![Offset: 3](/anatomy/brand-expressive/tooltip/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Air keeps big type readable.

- **Token** `space.gap.tight` → `overlay.offset` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `tooltip`.
- **From a terminal:** `npx open-ds anatomy brand-expressive tooltip`
