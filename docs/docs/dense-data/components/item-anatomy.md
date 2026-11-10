---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 33.5
slug: "item/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Item in Dense data."
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
![Item, every part numbered](/anatomy/dense-data/item/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

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
![Row: 1](/anatomy/dense-data/item/card-1.png)

:label[Containment] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.inset.container` → `default.padding` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.gap.group` → `default.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `radius.control` → `radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.
:::

:::panel{id="part-2" title="Media" note="Parts 2" media="side"}
![Media: 2](/anatomy/dense-data/item/card-2.png)

:label[Meaning] :label[Hierarchy]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the label so they do not outweigh it.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use radius.round.

  Small corners keep dense rows straight.

- **Token** `size.control.default` → `media.icon.size` 2rem :label[By scheme]{tone="info"}

  - **Pick** size.32

- **Token** `radius.control` → `media.icon.radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `color.surface.sunken` → `media.icon.background` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `size.icon` → `media.icon.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-3" title="Title" note="Parts 3" media="side"}
![Title: 3](/anatomy/dense-data/item/card-3.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Token** `type.body.font-size` → `title.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.label.font-weight` → `title.font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500
:::

:::panel{id="part-4" title="Description" note="Parts 4" media="side"}
![Description: 4](/anatomy/dense-data/item/card-4.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Rule** For paragraph or help text, use type.body. Don't use type.label.

  Help text is a sentence read in passing. Body size reads quickly; the label style is made for short names, not sentences.

- **Token** `type.body.font-size` → `description.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `color.text.muted` → `description.label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-5" title="Actions" note="Parts 5" media="side"}
![Actions: 5](/anatomy/dense-data/item/card-5.png)

:label[Affordance] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For an action on one row or item, use Icon button, ghost, compact. Don't use button secondary in every row.

  Rows repeat dozens of times; a quiet icon keeps the table readable.

- **Token** `space.gap.default` → `actions.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6" media="side"}
![Focus ring: 6](/anatomy/dense-data/item/card-6.png)

:label[Focus]

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
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `item`.
- **From a terminal:** `npx open-ds anatomy dense-data item`
