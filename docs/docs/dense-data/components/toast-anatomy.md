---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 59.5
slug: "toast/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Toast in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the toast apart to show how design decisions become the parts you see. You don't need it to use the toast: [its own page](../toast) has everything you need to build.

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

![Toast, every part numbered](/anatomy/dense-data/toast/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Toast** required :label[Containment]
  - **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment]
  - **2** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
  - **3** **Title** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **4** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
  - **5** **Tone edge** optional :label[By scheme]{tone="info"} :label[Meaning]
  - **Action** optional · shown by Button :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Surface and shadow" note="Parts 1, 2"}
![Surface and shadow: 1, 2](/anatomy/dense-data/toast/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float; cards use lines.

- **Answer** Elevation · How soft are shadows? → Subtle

  Subtle shadows keep the grid crisp.

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Badges sit in columns and need their own corner.

- **Token** `color.surface.raised` → `background` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.surface` → `radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Small corners keep dense rows straight.

- **Token** `color.border.default` → `neutral.border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `elevation.overlay` → `shadow` 0px 8px 24px, #0D111729 · dark 0px 8px 24px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Subtle shadows keep the grid crisp.
  - **Dark** shadow.overlay-dark: Subtle shadows keep the grid crisp.
:::

:::panel{id="part-3" title="Title" note="Parts 3"}
![Title: 3](/anatomy/dense-data/toast/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Voice and tone · How is the voice defined? → Rules and a word list

  A word list keeps labels identical across screens.

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Rule** For a success message, use A short confirmation with the count. Don't use celebration.

  Confirm and get out of the way; the next task is waiting.

- **Token** `type.label.font-weight` → `title.font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500

- **Token** `type.body.font-size` → `title.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `color.text.primary` → `label` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-4" title="Description" note="Parts 4"}
![Description: 4](/anatomy/dense-data/toast/card-3.png)

:label[Readability]

- **Answer** Voice and tone · How is the voice defined? → Rules and a word list

  A word list keeps labels identical across screens.

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Rule** For the words of an error, use Name the record, then the fix. Flat and specific.. Don't use "Oops" or a vague apology.

  Experts act on the message; the record and the fix are all they need.

- **Token** `color.text.secondary` → `description.label` #3D4655 · dark #C4CBD6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.52:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.58:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `description.font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12

- **Token** `space.gap.tight` → `content.gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4
:::

:::panel{id="part-5" title="Tone edge" note="Parts 5"}
![Tone edge: 5](/anatomy/dense-data/toast/card-4.png)

:label[Meaning]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Many statuses share one table; color alone is not enough.

- **Answer** Color · Where does color carry meaning first? → Status in tables

  Color earns its place by marking late and failed records.

- **Rule** For a status, use Badge with a subtle fill, an icon and a word. Don't use a full-strength fill.

  Subtle fills let many statuses share one table.

- **Token** `color.status.success` → `success.edge` #1F7A3A · dark #5CC283

  Confirmation that something worked. It sits outside the urgency order.

  - **Pick** green.light.600: success reads as text and icons, 5.38:1 on surface.default, above the 4.5:1 floor.
  - **Dark** green.dark.600: success reads as text and icons, 7.82:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** category.3. Changing this pick moves only what reads color.status.success.

- **Token** `color.status.danger` → `danger.edge` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.28:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `toast`.
- **From a terminal:** `npx open-ds anatomy dense-data toast`
