---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 60.5
slug: "toast/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Toast in Content first."
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

![Toast, every part numbered](/anatomy/content-first/toast/stage.png)

*Content first, light, drawn in Figma from the scheme's tokens.*

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
![Surface and shadow: 1, 2](/anatomy/content-first/toast/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows suit warm paper.

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Pill badges differ from controls.

- **Token** `color.surface.raised` → `background` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.container` → `radius` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** radius.12: Rounded corners feel friendly.

- **Token** `color.border.default` → `neutral.border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `elevation.overlay` → `shadow` 0px 12px 32px, #1F1B1629 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows suit warm paper.
  - **Dark** shadow.overlay-dark: Soft shadows suit warm paper.
:::

:::panel{id="part-3" title="Title" note="Parts 3"}
![Title: 3](/anatomy/content-first/toast/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Voice and tone · How is the voice defined? → Principles and examples

  Editors work from principles and examples, not word lists.

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Rule** For a success message, use Warm and brief, with what happens next. Don't use a bare "Done".

  A warm close invites the reader back.

- **Token** `type.label.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `type.body.font-size` → `title.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `color.text.primary` → `label` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-4" title="Description" note="Parts 4"}
![Description: 4](/anatomy/content-first/toast/card-3.png)

:label[Readability]

- **Answer** Voice and tone · How is the voice defined? → Principles and examples

  Editors work from principles and examples, not word lists.

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Rule** For the words of an error, use Calm and helpful. Take the blame, offer the way forward.. Don't use blaming the reader.

  A calm error keeps the reader's trust.

- **Token** `color.text.secondary` → `description.label` #4A4339 · dark #CFC6B6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.75:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.11:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `description.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `space.gap.tight` → `content.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

:::panel{id="part-5" title="Tone edge" note="Parts 5"}
![Tone edge: 5](/anatomy/content-first/toast/card-4.png)

:label[Meaning]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Status is rare; color and a word are enough.

- **Answer** Color · Where does color carry meaning first? → Links and actions

  Color marks links inside the text.

- **Rule** For a status, use Badge pill with a word. Don't use an icon alone.

  Status is rare, so readers never learn an icon for it. A word is clear the first time.

- **Token** `color.status.success` → `success.edge` #1F7A3A · dark #5CC283

  Confirmation that something worked. It sits outside the urgency order.

  - **Pick** green.light.600: success reads as text and icons, 5.38:1 on surface.default, above the 4.5:1 floor.
  - **Dark** green.dark.600: success reads as text and icons, 7.74:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** category.3. Changing this pick moves only what reads color.status.success.

- **Token** `color.status.danger` → `danger.edge` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `toast`.
- **From a terminal:** `npx open-ds anatomy content-first toast`
