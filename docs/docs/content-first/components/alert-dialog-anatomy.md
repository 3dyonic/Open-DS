---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3.5
slug: "alert-dialog/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Alert dialog in Content first."
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
![Alert dialog, every part numbered](/anatomy/content-first/alert-dialog/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

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
![Panel and scrim: 1, 2](/anatomy/content-first/alert-dialog/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows suit warm paper.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  The dimmed page focuses the reader on the dialog.

- **Token** `color.surface.scrim` → `overlay.background` #0000008C · dark #000000B3

  The see-through layer behind a modal.

  - **Pick** black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.
  - **Dark** black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.

- **Token** `color.surface.raised` → `content.background` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `elevation.overlay` → `content.shadow` 0px 12px 32px, #1F1B1629 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows suit warm paper.
  - **Dark** shadow.overlay-dark: Soft shadows suit warm paper.

- **Token** `radius.surface` → `content.radius` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** radius.12: Rounded corners feel friendly.

- **Token** `color.border.default` → `content.border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-2" title="Room inside the panel" note="Parts 2" media="side"}
![Room inside the panel: 2](/anatomy/content-first/alert-dialog/card-2.png)

:label[Containment] :label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Text needs air even inside a group.

- **Token** `space.inset.container` → `content.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `space.gap.group` → `content.gap` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

:::panel{id="part-4" title="Media" note="Parts 4" media="side"}
![Media: 4](/anatomy/content-first/alert-dialog/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text size.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Rule** For delete or remove, use Button secondary with the full verb, then confirm with Button danger. Don't use button primary.

  Naming the verb and confirming prevents a mistake.

- **Token** `color.surface.sunken` → `media.background` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.12:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.2:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `radius.control` → `media.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded corners feel friendly.

- **Token** `size.control.default` → `media.size` 3rem :label[By scheme]{tone="info"}

  - **Pick** size.48

- **Token** `component-spacing-map.x2` → `media.margin-bottom` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-3-5-6" title="The question" note="Parts 3, 5, 6" media="side"}
![The question: 3, 5, 6](/anatomy/content-first/alert-dialog/card-4.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Answer** How much is on one screen? → One idea at a time

  One idea per screen keeps reading calm.

- **Rule** For a confirmation question, use Gentle and clear about what changes. Don't use guilt or pressure.

  Readers come back when leaving felt respectful.

- **Rule** For paragraph or help text, use type.body, at most 65 characters a line. Don't use type.caption.

  A large size and short lines make long text easy on the eyes.

- **Token** `type.heading.font-family` → `title.font-family` "Source Serif 4", Georgia, serif :label[By scheme]{tone="info"}

  - **Pick** source-serif-4 for heading text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface.

- **Token** `type.heading.font-size` → `title.font-size` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.28

- **Token** `type.heading.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `type.body.font-size` → `description.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `color.text.secondary` → `description.label` #4A4339 · dark #CFC6B6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.75:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.11:1 on surface.default, above the 4.5:1 floor.

- **Token** `component-spacing-map.x2` → `header.gap` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-7" title="Footer" note="Parts 7" media="side"}
![Footer: 7](/anatomy/content-first/alert-dialog/card-5.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For the action that completes the task, use Button primary, one per section. Don't use two primaries side by side.

  One clear action per section. Two primaries make the reader choose before they have read.

- **Rule** For an alternative or cancel, use Button ghost as a text link. Don't use a second boxed button.

  A link feels lighter and does not compete.

- **Rule** For delete or remove, use Button secondary with the full verb, then confirm with Button danger. Don't use button primary.

  Naming the verb and confirming prevents a mistake.

- **Token** `space.gap.default` → `footer.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `alert-dialog`.
- **From a terminal:** `npx open-ds anatomy content-first alert-dialog`
