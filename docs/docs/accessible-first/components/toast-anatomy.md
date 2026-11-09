---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 59.5
slug: "toast/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Toast in Accessible first."
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

![Toast, every part numbered](/anatomy/accessible-first/toast/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
![Surface and shadow: 1, 2](/anatomy/accessible-first/toast/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Nothing

  Flat is easier to read at high zoom.

- **Answer** Elevation · How soft are shadows? → No shadows

  No shadows; borders do the work.

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Badges keep a clear rectangle.

- **Token** `color.surface.raised` → `background` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge alone, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge alone, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.container` → `radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Clear, slightly rounded controls.

- **Token** `color.border.default` → `neutral.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `elevation.overlay` → `shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: No shadows; borders do the work.
  - **Shares the step with** elevation.card. Changing this pick moves only what reads elevation.overlay.
:::

:::panel{id="part-3" title="Title" note="Parts 3"}
![Title: 3](/anatomy/accessible-first/toast/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Voice and tone · How is the voice defined? → Rules and a word list

  A word list of common words, with terms to avoid.

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Rule** For a success message, use Confirm what happened and what comes next. Don't use a confirmation with no next step.

  People need to know the task is finished and what happens now.

- **Token** `type.label.font-weight` → `title.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `type.body.font-size` → `title.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `color.text.primary` → `label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-4" title="Description" note="Parts 4"}
![Description: 4](/anatomy/accessible-first/toast/card-3.png)

:label[Readability]

- **Answer** Voice and tone · How is the voice defined? → Rules and a word list

  A word list of common words, with terms to avoid.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Rule** For the words of an error, use Say what is wrong, where, and exactly how to fix it. Don't use "Invalid input".

  People must be able to fix the error without help.

- **Token** `color.text.secondary` → `description.label` #333333 · dark #D6D6D6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 12.63:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.700: supporting text, 12.68:1 on surface.default, above the 7:1 floor.

- **Token** `type.caption.font-size` → `description.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `space.gap.tight` → `content.gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12
:::

:::panel{id="part-5" title="Tone edge" note="Parts 5"}
![Tone edge: 5](/anatomy/accessible-first/toast/card-4.png)

:label[Meaning]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Answer** Color · Where does color carry meaning first? → Links and actions

  Links and actions must be found by everyone.

- **Rule** For a status, use Badge with an icon and a word. Don't use color alone.

  Status must survive no color and a screen reader.

- **Token** `color.status.success` → `success.edge` #1F7A3A · dark #5CC283

  Confirmation that something worked. It sits outside the urgency order.

  - **Pick** green.light.600: success marks icons and edges, 5.38:1 on surface.default, over 3:1; its text uses success-on-light, which reads at the floor.
  - **Dark** green.dark.600: success reads as text and icons, 8.33:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** category.3. Changing this pick moves only what reads color.status.success.

- **Token** `color.status.danger` → `danger.edge` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `toast`.
- **From a terminal:** `npx open-ds anatomy accessible-first toast`
