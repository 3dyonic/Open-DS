---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3.5
slug: "alert-dialog/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Alert dialog in Dense data."
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

![Alert dialog, every part numbered](/anatomy/dense-data/alert-dialog/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

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

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Panel and scrim" note="Parts 1, 2"}
![Panel and scrim: 1, 2](/anatomy/dense-data/alert-dialog/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float; cards use lines.

- **Answer** Elevation · How soft are shadows? → Subtle

  Subtle shadows keep the grid crisp.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page for dialogs. Don't use a border only.

  Floating things need a shadow so they read as on top.

- **Token** `color.surface.scrim` → `overlay.background` #0000008C · dark #000000B3

  The see-through layer behind a modal.

  - **Pick** black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.
  - **Dark** black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.

- **Token** `color.surface.raised` → `content.background` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `elevation.overlay` → `content.shadow` 0px 8px 24px, #0D111729 · dark 0px 8px 24px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Subtle shadows keep the grid crisp.
  - **Dark** shadow.overlay-dark: Subtle shadows keep the grid crisp.

- **Token** `radius.surface` → `content.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Small corners keep dense rows straight.

- **Token** `color.border.default` → `content.border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-2" title="Room inside the panel" note="Parts 2"}
![Room inside the panel: 2](/anatomy/dense-data/alert-dialog/card-2.png)

:label[Containment] :label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.inset.container` → `content.padding` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.gap.group` → `content.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-4" title="Media" note="Parts 4"}
![Media: 4](/anatomy/dense-data/alert-dialog/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the label so they do not outweigh it.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Rule** For delete or remove, use Button secondary, then confirm in a dialog with Button danger. Don't use button primary as the first step.

  Deleting is rare and costly; a confirm step catches mistakes.

- **Token** `color.surface.sunken` → `media.background` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `radius.control` → `media.radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `size.control.default` → `media.size` 2rem :label[By scheme]{tone="info"}

  - **Pick** size.32

- **Token** `component-spacing-map.x2` → `media.margin-bottom` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-3-5-6" title="The question" note="Parts 3, 5, 6"}
![The question: 3, 5, 6](/anatomy/dense-data/alert-dialog/card-4.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** How much is on one screen? → A lot

  Experts want many records on one screen.

- **Rule** For a confirmation question, use Name the exact object and the consequence. Don't use "Are you sure?".

  Acting on the wrong record is the costly mistake.

- **Rule** For paragraph or help text, use type.body. Don't use type.label.

  Help text is a sentence read in passing. Body size reads quickly; the label style is made for short names, not sentences.

- **Token** `type.heading.font-family` → `title.font-family` "IBM Plex Sans", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** ibm-plex-sans for heading text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero.

- **Token** `type.heading.font-size` → `title.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.heading.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `type.body.font-size` → `description.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `color.text.secondary` → `description.label` #3D4655 · dark #C4CBD6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.52:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.58:1 on surface.default, above the 4.5:1 floor.

- **Token** `component-spacing-map.x2` → `header.gap` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-7" title="Footer" note="Parts 7"}
![Footer: 7](/anatomy/dense-data/alert-dialog/card-5.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For the action that completes the task, use Button primary, one per view. Don't use two primaries side by side.

  One primary makes the committing action obvious.

- **Rule** For an alternative or cancel, use Button secondary. Don't use button ghost.

  A ghost button has no edge, so next to a filled primary it reads as plain text and cancel gets lost. Secondary keeps a visible border, so people find it at once.

- **Rule** For delete or remove, use Button secondary, then confirm in a dialog with Button danger. Don't use button primary as the first step.

  Deleting is rare and costly; a confirm step catches mistakes.

- **Token** `space.gap.default` → `footer.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `alert-dialog`.
- **From a terminal:** `npx open-ds anatomy dense-data alert-dialog`
