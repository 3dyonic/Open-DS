---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2.5
slug: "alert/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Alert in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the alert apart to show how design decisions become the parts you see. You don't need it to use the alert: [its own page](../alert) has everything you need to build.

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
![Alert, every part numbered](/anatomy/brand-expressive/alert/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Panel** required :label[By scheme]{tone="info"} :label[Containment]
- **2** **Icon** optional :label[By scheme]{tone="info"} :label[Meaning]
- **3** **Title** required :label[By scheme]{tone="info"} :label[Hierarchy]
- **4** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
- **5** **Destructive alert** state :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Panel" note="Parts 1" media="side"}
![Panel: 1](/anatomy/brand-expressive/alert/card-1.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Rule** For a card on the page, use elevation.card (pronounced). Don't use a flat card.

  Cards float to feel tactile.

- **Token** `color.surface.default` → `default.background` #FFFFFF · dark #1F1411 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 18.0:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.12:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `color.border.default` → `border` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `border-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `radius.surface` → `radius` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.24: Pill controls feel playful.

- **Token** `component-spacing-map.x3` → `padding-y` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-2" title="Icon" note="Parts 2" media="side"}
![Icon: 2](/anatomy/brand-expressive/alert/card-2.png)

:label[Meaning]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons hold their own next to big type.

- **Token** `size.icon` → `icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `component-spacing-map.x3` → `gap-x` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-3" title="Title" note="Parts 3" media="side"}
![Title: 3](/anatomy/brand-expressive/alert/card-3.png)

:label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Rule** For a status, use Badge pill with a word. Don't use color alone.

  A word keeps meaning on vivid backgrounds.

- **Token** `type.label.font-weight` → `title.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `color.text.primary` → `default.label` #1F1411 · dark #FFF8F3 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.0:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-4" title="Description" note="Parts 4" media="side"}
![Description: 4](/anatomy/brand-expressive/alert/card-4.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Answer** Voice and tone · Where do the words matter most? → Headlines and buttons

  Words work hardest in headlines and buttons.

- **Rule** For paragraph or help text, use type.body, short. Don't use long paragraphs.

  Short copy keeps the energy.

- **Token** `color.text.muted` → `description.label` #6B544A · dark #B5988A :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.71:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.body.font-size` → `description.font-size` 1.0625rem :label[By scheme]{tone="info"}

  - **Pick** font.size.17

- **Token** `type.body.line-height` → `description.line-height` 1.55 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_55
:::

:::panel{id="part-5" title="Destructive alert" note="Parts 5" media="side"}
![Destructive alert: 5](/anatomy/brand-expressive/alert/card-5.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Answer** What is a costly mistake? → Looking off-brand

  A bland page is the costly mistake.

- **Rule** For an error message, use color.status.danger and a short sentence. Don't use the brand magenta.

  Errors must not look like the brand.

- **Rule** For the words of an error, use Plain first, a light touch after. Don't use a joke before the fix.

  Playful copy must never hide what went wrong.

- **Token** `color.status.danger` → `destructive.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger` → `destructive.description.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.surface.default` → `destructive.background` #FFFFFF · dark #1F1411 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 18.0:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.12:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `alert`.
- **From a terminal:** `npx open-ds anatomy brand-expressive alert`
