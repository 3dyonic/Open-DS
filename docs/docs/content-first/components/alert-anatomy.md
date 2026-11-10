---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2.5
slug: "alert/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Alert in Content first."
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

![Alert, every part numbered](/anatomy/content-first/alert/stage.png)

*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Panel** required :label[By scheme]{tone="info"} :label[Containment]
- **2** **Icon** optional :label[By scheme]{tone="info"} :label[Meaning]
- **3** **Title** required :label[By scheme]{tone="info"} :label[Hierarchy]
- **4** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
- **5** **Destructive alert** state :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Panel" note="Parts 1"}
![Panel: 1](/anatomy/content-first/alert/card-1.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Rule** For a card on the page, use A border, no shadow. Don't use a strong shadow.

  Cards stay flat on the page; shadows are for floating things.

- **Token** `color.surface.default` → `default.background` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.12:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 16.84:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `color.border.default` → `border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1

- **Token** `radius.surface` → `radius` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** radius.12: Rounded corners feel friendly.

- **Token** `component-spacing-map.x3` → `padding-y` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20
:::

:::panel{id="part-2" title="Icon" note="Parts 2"}
![Icon: 2](/anatomy/content-first/alert/card-2.png)

:label[Meaning]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text size.

- **Token** `size.icon` → `icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `component-spacing-map.x3` → `gap-x` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20
:::

:::panel{id="part-3" title="Title" note="Parts 3"}
![Title: 3](/anatomy/content-first/alert/card-3.png)

:label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Rule** For a status, use Badge pill with a word. Don't use an icon alone.

  Status is rare, so readers never learn an icon for it. A word is clear the first time.

- **Token** `type.label.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `color.text.primary` → `default.label` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-4" title="Description" note="Parts 4"}
![Description: 4](/anatomy/content-first/alert/card-4.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Answer** Voice and tone · Where do the words matter most? → Articles and guides

  Most words are in articles and guides.

- **Rule** For paragraph or help text, use type.body, at most 65 characters a line. Don't use type.caption.

  A large size and short lines make long text easy on the eyes.

- **Token** `color.text.muted` → `description.label` #61594D · dark #A39A8B :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.9:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.16:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.body.font-size` → `description.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `type.body.line-height` → `description.line-height` 1.65 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_65
:::

:::panel{id="part-5" title="Destructive alert" note="Parts 5"}
![Destructive alert: 5](/anatomy/content-first/alert/card-5.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Answer** What is a costly mistake? → Losing your place

  Losing your place in an article breaks the read.

- **Rule** For an error message, use color.status.danger and a plain sentence. Don't use color alone.

  The sentence says what to fix; color only draws the eye.

- **Rule** For the words of an error, use Calm and helpful. Take the blame, offer the way forward.. Don't use blaming the reader.

  A calm error keeps the reader's trust.

- **Token** `color.status.danger` → `destructive.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger` → `destructive.description.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.surface.default` → `destructive.background` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.12:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 16.84:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `alert`.
- **From a terminal:** `npx open-ds anatomy content-first alert`
