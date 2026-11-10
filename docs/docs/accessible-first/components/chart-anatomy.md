---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 15.5
slug: "chart/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Chart in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the chart apart to show how design decisions become the parts you see. You don't need it to use the chart: [its own page](../chart) has everything you need to build.

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
![Chart, every part numbered](/anatomy/accessible-first/chart/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Chart** required :label[Containment] :label[Readability]
  - **1** **Chart area** required :label[By scheme]{tone="info"} :label[Containment]
  - **2** **Bars** required · colors from the chart's config :label[Meaning] :label[Emphasis]
  - **3** **Axis labels** optional :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **4** **Grid lines** optional :label[By scheme]{tone="info"} :label[Grouping]
  - **5** **Cursor** state :label[By scheme]{tone="info"} :label[Feedback]
- **6** **Tooltip** state :label[By scheme]{tone="info"} :label[Layering] :label[Feedback] :label[Readability]
- **7** **Legend** optional :label[By scheme]{tone="info"} :label[Grouping] :label[Meaning]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-4" title="Chart area and grid" note="Parts 1, 4" media="side"}
![Chart area and grid: 1, 4](/anatomy/accessible-first/chart/card-1.png)

:label[Containment] :label[Grouping]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Rule** For someone switches to dark, use The dark semantic mode, or high contrast. Don't use one mode only.

  People pick the mode they can read.

- **Token** `color.border.default` → `grid.line` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-2" title="Bars" note="Parts 2" media="side"}
![Bars: 2](/anatomy/accessible-first/chart/card-2.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.
:::

:::panel{id="part-3" title="Axis labels" note="Parts 3" media="side"}
![Axis labels: 3](/anatomy/accessible-first/chart/card-3.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Token** `color.text.muted` → `axis.label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `type.caption.font-size` → `font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16
:::

:::panel{id="part-5" title="Cursor" note="Parts 5" media="side"}
![Cursor: 5](/anatomy/accessible-first/chart/card-4.png)

:label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker.

  Moderate speed is easy to follow.

- **Token** `color.surface.highlight` → `cursor.fill` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.

- **Token** `color.border.default` → `cursor.line` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-6" title="Tooltip" note="Parts 6" media="side"}
![Tooltip: 6](/anatomy/accessible-first/chart/card-5.png)

:label[Layering] :label[Feedback]

- **Answer** Elevation · What rises above the page? → Nothing

  Flat is easier to read at high zoom.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For a menu or dialog, use A strong border and a dimmed page. Don't use a shadow only.

  The dimmed page makes the dialog obvious.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker.

  Moderate speed is easy to follow.

- **Token** `color.surface.canvas` → `tooltip.background` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.

- **Token** `color.border.default` → `tooltip.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `elevation.overlay` → `tooltip.shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: No shadows; borders do the work.
  - **Shares the step with** elevation.card. Changing this pick moves only what reads elevation.overlay.

- **Token** `component-spacing-map.x3` → `tooltip.padding-x` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20
:::

:::panel{id="part-6" title="Tooltip values" note="Parts 6" media="side"}
![Tooltip values: 6](/anatomy/accessible-first/chart/card-6.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Rule** For a number in a table, use type.body. Don't use a small or mono font.

  Every number must be readable at large size.

- **Token** `color.text.muted` → `label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `color.text.primary` → `label-2` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.label.font-weight` → `font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-7" title="Legend" note="Parts 7" media="side"}
![Legend: 7](/anatomy/accessible-first/chart/card-7.png)

:label[Grouping] :label[Meaning]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `space.gap.group` → `legend.gap` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `chart`.
- **From a terminal:** `npx open-ds anatomy accessible-first chart`
