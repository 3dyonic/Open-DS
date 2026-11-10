---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 13.5
slug: "card/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Card in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the card apart to show how design decisions become the parts you see. You don't need it to use the card: [its own page](../card) has everything you need to build.

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
![Card, every part numbered](/anatomy/accessible-first/card/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Card** required :label[Containment] :label[Grouping]
  - **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Grouping]
  - **2** **Border** required :label[By scheme]{tone="info"} :label[Containment]
  - **3** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Header** optional :label[Hierarchy]
  - **4** **Title** optional :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **5** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
- **6** **Content** optional :label[By scheme]{tone="info"} :label[Grouping]
- **Status** optional · shown by Badge :label[Meaning]
- **7** **Footer** optional :label[By scheme]{tone="info"} :label[Grouping] :label[Affordance]
- **Actions** optional · shown by Button :label[Affordance]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3" title="Surface, border and shadow" note="Parts 1, 2, 3" media="side"}
![Surface, border and shadow: 1, 2, 3](/anatomy/accessible-first/card/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Nothing

  Flat is easier to read at high zoom.

- **Answer** Elevation · What separates groups on the page? → Lines

  Strong borders separate groups at any zoom.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Rule** For a card on the page, use A strong border, no shadow. Don't use a shadow.

  Shadows are hard to see; borders are not.

- **Token** `color.surface.default` → `background` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 18.42:1 on it, above the 7:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.2:1 on it, above the 7:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `radius.surface` → `radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Clear, slightly rounded controls.

- **Token** `space.inset.container` → `padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `color.border.default` → `border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `border-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `elevation.card` → `shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: Flat is easier to read at high zoom.
  - **Shares the step with** elevation.overlay. Changing this pick moves only what reads elevation.card.
:::

:::panel{id="part-4-5" title="Header" note="Parts 4, 5" media="side"}
![Header: 4, 5](/anatomy/accessible-first/card/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Token** `type.heading.font-family` → `title.font-family` "Atkinson Hyperlegible", Verdana, sans-serif :label[By scheme]{tone="info"}

  - **Pick** atkinson-hyperlegible for heading text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out.

- **Token** `type.heading.font-size` → `title.font-size` 1.375rem :label[By scheme]{tone="info"}

  - **Pick** font.size.22

- **Token** `type.heading.font-weight` → `title.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `space.gap.tight` → `header.gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `color.text.secondary` → `description.label` #333333 · dark #D6D6D6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 12.63:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.700: supporting text, 12.68:1 on surface.default, above the 7:1 floor.

- **Token** `type.body.font-size` → `description.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19
:::

:::panel{id="part-6-7" title="Content and footer" note="Parts 6, 7" media="side"}
![Content and footer: 6, 7](/anatomy/accessible-first/card/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `space.gap.default` → `gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.gap.default` → `content.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.gap.default` → `footer.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `card`.
- **From a terminal:** `npx open-ds anatomy accessible-first card`
