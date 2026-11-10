---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 24.5
slug: "drawer/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Drawer in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the drawer apart to show how design decisions become the parts you see. You don't need it to use the drawer: [its own page](../drawer) has everything you need to build.

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
![Drawer, every part numbered](/anatomy/brand-expressive/drawer/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Trigger** required · shown by Button :label[Affordance]
- **1** **Scrim** required :label[Layering]
- **2** **Panel** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
- **3** **Handle** optional :label[By scheme]{tone="info"} :label[Affordance]
- **4** **Header** required :label[By scheme]{tone="info"} :label[Grouping] :label[Hierarchy]
  - **5** **Title** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **6** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
- **7** **Footer** optional :label[By scheme]{tone="info"} :label[Grouping] :label[Reach]
  - **Actions** optional · shown by Button :label[Affordance] :label[Emphasis]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Panel and scrim" note="Parts 1, 2" media="side"}
![Panel and scrim: 1, 2](/anatomy/brand-expressive/drawer/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Cards too

  Cards lift to feel like objects.

- **Answer** Elevation · How soft are shadows? → Pronounced

  Pronounced shadows add depth.

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  Strong depth shows a menu or dialog sits above vivid sections. Without a shadow it blends into the color blocks.

- **Token** `color.surface.scrim` → `overlay.background` #0000008C · dark #000000B3

  The see-through layer behind a modal.

  - **Pick** black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.
  - **Dark** black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.

- **Token** `color.surface.canvas` → `content.background` #FFF8F3 · dark #120B09 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.08:1 from surface.default, so cards and panels stand forward.

- **Token** `elevation.overlay` → `content.shadow` 0px 24px 48px, #1F141133 · dark 0px 24px 48px, #00000099 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Pronounced shadows add depth.
  - **Dark** shadow.overlay-dark: Pronounced shadows add depth.

- **Token** `radius.surface` → `content.radius` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.24: Pill controls feel playful.

- **Token** `color.border.default` → `content.border` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-3" title="Handle" note="Parts 3" media="side"}
![Handle: 3](/anatomy/brand-expressive/drawer/card-2.png)

:label[Affordance]

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Token** `color.surface.sunken` → `handle.background` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.21:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `radius.pill` → `handle.radius` calc(infinity * 1px)

  - **Pick** radius.pill

- **Token** `space.inset.container` → `handle.margin-top` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

:::panel{id="part-4-5-6" title="Title and description" note="Parts 4, 5, 6" media="side"}
![Title and description: 4, 5, 6](/anatomy/brand-expressive/drawer/card-3.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Answer** Typography · How large is body text? → Regular

  Regular body; the display does the shouting.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Rule** For paragraph or help text, use type.body, short. Don't use long paragraphs.

  Short copy keeps the energy.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Air keeps big type readable.

- **Token** `type.heading.font-family` → `title.font-family` "Bricolage Grotesque", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** bricolage-grotesque for heading text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read.

- **Token** `type.heading.font-size` → `title.font-size` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.28

- **Token** `type.heading.font-weight` → `title.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `type.body.font-size` → `description.font-size` 1.0625rem :label[By scheme]{tone="info"}

  - **Pick** font.size.17

- **Token** `color.text.secondary` → `description.label` #4D3A33 · dark #E2C4B3 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 10.67:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.96:1 on surface.default, above the 4.5:1 floor.

- **Token** `component-spacing-map.hairline` → `header.gap` 0.125rem

  - **Pick** space.2

- **Token** `space.inset.container` → `header.padding` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

:::panel{id="part-7" title="Footer" note="Parts 7" media="side"}
![Footer: 7](/anatomy/brand-expressive/drawer/card-4.png)

:label[Grouping] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For the action that completes the task, use Button primary, large, one per section. Don't use two primaries.

  One loud call to action per section.

- **Rule** For an alternative or cancel, use Button ghost. Don't use a second primary.

  The alternative must not compete.

- **Token** `space.gap.default` → `footer.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.inset.container` → `footer.padding` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `drawer`.
- **From a terminal:** `npx open-ds anatomy brand-expressive drawer`
