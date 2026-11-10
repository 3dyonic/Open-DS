---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3.5
slug: "alert-dialog/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Alert dialog in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the alert dialog apart to show how design decisions become the parts you see. You don't need it to use the alert dialog: [its own page](../alert-dialog) has everything you need to build.

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
![Alert dialog, every part numbered](/anatomy/multi-brand/alert-dialog/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Scrim** required :label[Layering]
- **2** **Panel** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
- **3** **Header** required :label[By scheme]{tone="info"} :label[Grouping] :label[Hierarchy]
  - **4** **Media** optional :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
  - **5** **Title** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **6** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
- **7** **Footer** required :label[By scheme]{tone="info"} :label[Grouping]
  - **Cancel** required · shown by Button :label[Affordance]
  - **Action** required · shown by Button :label[Affordance] :label[Emphasis] :label[Meaning]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Panel and scrim" note="Parts 1, 2" media="side"}
![Panel and scrim: 1, 2](/anatomy/multi-brand/alert-dialog/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Cards too

  Cards lift slightly to group offers.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows fit every brand.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  The shadow shows a menu or dialog floats above the page. Without it, it blends into the cards.

- **Token** `color.surface.scrim` → `overlay.background` #0000008C · dark #000000B3

  The see-through layer behind a modal.

  - **Pick** black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.
  - **Dark** black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.

- **Token** `color.surface.raised` → `content.background` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `elevation.overlay` → `content.shadow` 0px 12px 32px, #0F172A29 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows fit every brand.
  - **Dark** shadow.overlay-dark: Soft shadows fit every brand.

- **Token** `radius.surface` → `content.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded by default; each brand sets its own corner.

- **Token** `color.border.default` → `content.border` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-2" title="Room inside the panel" note="Parts 2" media="side"}
![Room inside the panel: 2](/anatomy/multi-brand/alert-dialog/card-2.png)

:label[Containment] :label[Grouping]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `space.inset.container` → `content.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `space.gap.group` → `content.gap` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-4" title="Media" note="Parts 4" media="side"}
![Media: 4](/anatomy/multi-brand/alert-dialog/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Rule** For delete or remove, use Button secondary, then confirm with Button danger. Don't use button primary.

  Confirm before destroying data.

- **Token** `color.surface.sunken` → `media.background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `radius.control` → `media.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.

- **Token** `size.control.default` → `media.size` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `component-spacing-map.x2` → `media.margin-bottom` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-3-5-6" title="The question" note="Parts 3, 5, 6" media="side"}
![The question: 3, 5, 6](/anatomy/multi-brand/alert-dialog/card-4.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Answer** How much is on one screen? → A moderate amount

  A moderate amount per screen.

- **Rule** For a confirmation question, use Shared across brands: plain and specific. Don't use brand tone when something is lost.

  Loss is never the moment for personality.

- **Rule** For paragraph or help text, use type.body. Don't use type.caption.

  Regular body size suits every brand.

- **Token** `type.heading.font-family` → `title.font-family` Inter, system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** inter for heading text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one.

- **Token** `type.heading.font-size` → `title.font-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** font.size.20

- **Token** `type.heading.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `type.body.font-size` → `description.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `color.text.secondary` → `description.label` #334155 · dark #CBD5E1 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 10.35:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 12.02:1 on surface.default, above the 4.5:1 floor.

- **Token** `component-spacing-map.x2` → `header.gap` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-7" title="Footer" note="Parts 7" media="side"}
![Footer: 7](/anatomy/multi-brand/alert-dialog/card-5.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For the action that completes the task, use Button primary, one per view. Don't use two primaries.

  One clear action per view. Two primaries split attention.

- **Rule** For an alternative or cancel, use Button secondary. Don't use a second primary.

  The alternative steps back, so the one primary stays clear. A second primary would compete with it.

- **Rule** For delete or remove, use Button secondary, then confirm with Button danger. Don't use button primary.

  Confirm before destroying data.

- **Token** `space.gap.default` → `footer.gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `alert-dialog`.
- **From a terminal:** `npx open-ds anatomy multi-brand alert-dialog`
