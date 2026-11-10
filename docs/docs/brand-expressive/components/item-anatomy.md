---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 33.5
slug: "item/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Item in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the item apart to show how design decisions become the parts you see. You don't need it to use the item: [its own page](../item) has everything you need to build.

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
![Item, every part numbered](/anatomy/brand-expressive/item/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Item** required :label[Containment] :label[Grouping]
  - **1** **Row** required :label[By scheme]{tone="info"} :label[Containment] :label[Reach]
  - **2** **Media** optional :label[By scheme]{tone="info"} :label[Meaning] :label[Hierarchy]
  - **3** **Title** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **4** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
  - **5** **Actions** optional :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **Action buttons** optional · shown by Button :label[Affordance]
  - **6** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Row" note="Parts 1" media="side"}
![Row: 1](/anatomy/brand-expressive/item/card-1.png)

:label[Containment] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Air keeps big type readable.

- **Token** `space.inset.container` → `default.padding` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32

- **Token** `space.gap.group` → `default.gap` 2.5rem :label[By scheme]{tone="info"}

  - **Pick** space.40

- **Token** `radius.control` → `radius` calc(infinity * 1px) :label[By scheme]{tone="info"}

  - **Pick** radius.pill: Pill controls feel playful.
:::

:::panel{id="part-2" title="Media" note="Parts 2" media="side"}
![Media: 2](/anatomy/brand-expressive/item/card-2.png)

:label[Meaning] :label[Hierarchy]

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons hold their own next to big type.

- **Rule** For corners of buttons and inputs, use radius.control (pill). Don't use sharp corners.

  Pills match the brand's round, playful shapes. Sharp corners would feel corporate.

- **Token** `size.control.default` → `media.icon.size` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `radius.control` → `media.icon.radius` calc(infinity * 1px) :label[By scheme]{tone="info"}

  - **Pick** radius.pill: Pill controls feel playful.

- **Token** `color.surface.sunken` → `media.icon.background` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.21:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `size.icon` → `media.icon.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20
:::

:::panel{id="part-3" title="Title" note="Parts 3" media="side"}
![Title: 3](/anatomy/brand-expressive/item/card-3.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Token** `type.body.font-size` → `title.font-size` 1.0625rem :label[By scheme]{tone="info"}

  - **Pick** font.size.17

- **Token** `type.label.font-weight` → `title.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-4" title="Description" note="Parts 4" media="side"}
![Description: 4](/anatomy/brand-expressive/item/card-4.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Rule** For paragraph or help text, use type.body, short. Don't use long paragraphs.

  Short copy keeps the energy.

- **Token** `type.body.font-size` → `description.font-size` 1.0625rem :label[By scheme]{tone="info"}

  - **Pick** font.size.17

- **Token** `color.text.muted` → `description.label` #6B544A · dark #B5988A :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.71:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-5" title="Actions" note="Parts 5" media="side"}
![Actions: 5](/anatomy/brand-expressive/item/card-5.png)

:label[Affordance] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For an action on one row or item, use Button ghost with a word. Don't use an icon alone.

  Visitors come rarely, so they never learn an icon. A word says what will happen.

- **Token** `space.gap.default` → `actions.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6" media="side"}
![Focus ring: 6](/anatomy/brand-expressive/item/card-6.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA, checked on every vivid color.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Focus must show on vivid color.

- **Token** `border-width.focus` → `focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `color.border.focus` → `focus-ring-focus` #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** pink.light.600: the focus ring, so the keyboard's place is never lost, 4.84:1 on surface.default, above the 3:1 floor.
  - **Dark** pink.dark.600: the focus ring, so the keyboard's place is never lost, 8.88:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `item`.
- **From a terminal:** `npx open-ds anatomy brand-expressive item`
