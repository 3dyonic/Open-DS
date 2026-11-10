---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 11.5
slug: "button-group/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Button group in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the button group apart to show how design decisions become the parts you see. You don't need it to use the button group: [its own page](../button-group) has everything you need to build.

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
![Button group, every part numbered](/anatomy/multi-brand/button-group/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Group** required :label[By scheme]{tone="info"} :label[Grouping]
- **Buttons** required · shown by Button :label[Affordance]
- **2** **Separator** optional :label[By scheme]{tone="info"} :label[Grouping]
- **3** **Text** optional :label[By scheme]{tone="info"} :label[Readability] :label[Containment]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Group" note="Parts 1" media="side"}
![Group: 1](/anatomy/multi-brand/button-group/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `space.gap.default` → `gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12
:::

:::panel{id="part-2" title="Separator" note="Parts 2" media="side"}
![Separator: 2](/anatomy/multi-brand/button-group/card-2.png)

:label[Grouping]

- **Answer** Elevation · What separates groups on the page? → Cards

  Cards group plans and offers.

- **Token** `color.border.strong` → `separator.background` #64748B · dark #96A3B5 :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.76:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.97:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** disabled.text. Changing this pick moves only what reads color.border.strong.
:::

:::panel{id="part-3" title="Text" note="Parts 3" media="side"}
![Text: 3](/anatomy/multi-brand/button-group/card-3.png)

:label[Readability] :label[Containment]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Rule** For corners of buttons and inputs, use radius.control (set by the brand). Don't use a hard-coded radius.

  Each brand sets its own corner through the theme.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Labels stay readable in every brand.

- **Token** `color.surface.sunken` → `text.background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.border.default` → `text.border` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `radius.control` → `text.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.

- **Token** `component-spacing-map.x4` → `text.padding-x` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `type.body.font-size` → `text.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `button-group`.
- **From a terminal:** `npx open-ds anatomy multi-brand button-group`
