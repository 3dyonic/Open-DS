---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6.5
slug: "avatar/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Avatar in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the avatar apart to show how design decisions become the parts you see. You don't need it to use the avatar: [its own page](../avatar) has everything you need to build.

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

![Avatar, every part numbered](/anatomy/multi-brand/avatar/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Avatar** required :label[By scheme]{tone="info"} :label[Meaning] :label[Containment]
- **Image** optional · not in this example :label[Meaning]
- **2** **Initials** optional :label[By scheme]{tone="info"} :label[Readability] :label[Meaning]
- **Status badge** optional :label[Meaning]
  - **3** **Badge** optional :label[By scheme]{tone="info"} :label[Meaning]
  - **4** **Badge ring** optional :label[By scheme]{tone="info"} :label[Layering]
- **Group** optional :label[Grouping]
  - **5** **Overlap** optional :label[Grouping]
  - **6** **Group ring** optional :label[By scheme]{tone="info"} :label[Layering]
  - **Count** optional · not in this example :label[By scheme]{tone="info"} :label[Meaning]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Avatar and initials" note="Parts 1, 2"}
![Avatar and initials: 1, 2](/anatomy/multi-brand/avatar/card-1.png)

:label[Meaning] :label[Readability]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Token** `size.control.default` → `size` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `radius.round` → `radius` 50%

  - **Pick** radius.round

- **Token** `color.surface.sunken` → `fallback.background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.muted` → `fallback.label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.body.font-size` → `fallback.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16
:::

:::panel{id="part-3-4" title="Status badge" note="Parts 3, 4"}
![Status badge: 3, 4](/anatomy/multi-brand/avatar/card-2.png)

:label[Meaning] :label[Layering]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Answer** Elevation · What separates groups on the page? → Cards

  Cards group plans and offers.

- **Token** `color.action.primary` → `badge.background` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** teal.light.600: the primary action's fill; its label reads, 5.47:1, above the 4.5:1 floor.
  - **Dark** teal.dark.600: the primary action's fill; its label reads, 9.9:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `radius.round` → `badge.radius` 50%

  - **Pick** radius.round

- **Token** `color.surface.canvas` → `badge.ring` #F8FAFC · dark #020617 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward.

- **Token** `border-width.default` → `badge.ring-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-5-6" title="Group" note="Parts 5, 6"}
![Group: 5, 6](/anatomy/multi-brand/avatar/card-3.png)

:label[Grouping] :label[Layering]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Answer** Elevation · What separates groups on the page? → Cards

  Cards group plans and offers.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `component-spacing-map.x2` → `group.overlap` 0.5rem

  - **Pick** space.8

- **Token** `color.surface.canvas` → `group.ring` #F8FAFC · dark #020617 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward.

- **Token** `border-width.default` → `group.ring-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `avatar`.
- **From a terminal:** `npx open-ds anatomy multi-brand avatar`
