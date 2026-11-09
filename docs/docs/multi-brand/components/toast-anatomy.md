---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 59.5
slug: "toast/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Toast in Multi-brand."
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

![Toast, every part numbered](/anatomy/multi-brand/toast/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

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
![Surface and shadow: 1, 2](/anatomy/multi-brand/toast/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Cards too

  Cards lift slightly to group offers.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows fit every brand.

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Each brand sets three corners.

- **Token** `color.surface.raised` → `background` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.container` → `radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded by default; each brand sets its own corner.

- **Token** `color.border.default` → `neutral.border` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `elevation.overlay` → `shadow` 0px 12px 32px, #0F172A29 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows fit every brand.
  - **Dark** shadow.overlay-dark: Soft shadows fit every brand.
:::

:::panel{id="part-3" title="Title" note="Parts 3"}
![Title: 3](/anatomy/multi-brand/toast/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Voice and tone · How is the voice defined? → A shared core, brand tone on top

  Errors and confirmations are shared; brand tone sits on top.

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Rule** For a success message, use Brand tone allowed: Aster calm, Birch friendly, Coral upbeat. Don't use the same flat line in every brand.

  Success is a safe moment for brand tone.

- **Token** `type.label.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `type.body.font-size` → `title.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `color.text.primary` → `label` #0F172A · dark #F8FAFC :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.85:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.06:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-4" title="Description" note="Parts 4"}
![Description: 4](/anatomy/multi-brand/toast/card-3.png)

:label[Readability]

- **Answer** Voice and tone · How is the voice defined? → A shared core, brand tone on top

  Errors and confirmations are shared; brand tone sits on top.

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Rule** For the words of an error, use Shared across brands: plain and specific. Don't use brand tone in errors.

  Errors read the same in every brand, so support can help anyone.

- **Token** `color.text.secondary` → `description.label` #334155 · dark #CBD5E1 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 10.35:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 12.02:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `description.font-size` 0.8125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.13

- **Token** `space.gap.tight` → `content.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

:::panel{id="part-5" title="Tone edge" note="Parts 5"}
![Tone edge: 5](/anatomy/multi-brand/toast/card-4.png)

:label[Meaning]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Answer** Color · Where does color carry meaning first? → Brand moments

  Brand color shows on actions and headlines.

- **Rule** For a status, use Badge with a word. Don't use a brand color as status.

  Brand hues vary, so meaning needs a word.

- **Token** `color.status.success` → `success.edge` #1F7A3A · dark #5CC283

  Confirmation that something worked. It sits outside the urgency order.

  - **Pick** green.light.600: success reads as text and icons, 5.38:1 on surface.default, above the 4.5:1 floor.
  - **Dark** green.dark.600: success reads as text and icons, 8.08:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** category.5. Changing this pick moves only what reads color.status.success.

- **Token** `color.status.danger` → `danger.edge` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `toast`.
- **From a terminal:** `npx open-ds anatomy multi-brand toast`
