---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6.5
slug: "avatar/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Avatar in Accessible first."
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

![Avatar, every part numbered](/anatomy/accessible-first/avatar/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
![Avatar and initials: 1, 2](/anatomy/accessible-first/avatar/card-1.png)

:label[Meaning] :label[Readability]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Token** `size.control.default` → `size` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `radius.round` → `radius` 9999px

  - **Pick** radius.full

- **Token** `color.surface.sunken` → `fallback.background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.17:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.16:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.muted` → `fallback.label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `type.body.font-size` → `fallback.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19
:::

:::panel{id="part-3-4" title="Status badge" note="Parts 3, 4"}
![Status badge: 3, 4](/anatomy/accessible-first/avatar/card-2.png)

:label[Meaning] :label[Layering]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Answer** Elevation · What separates groups on the page? → Lines

  Strong borders separate groups at any zoom.

- **Token** `color.action.primary` → `badge.background` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** blue.light.600: the primary action's fill; its label reads, 7.26:1, above the 7:1 floor.
  - **Dark** blue.dark.600: the primary action's fill; its label reads, 8.74:1, above the 7:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `radius.round` → `badge.radius` 9999px

  - **Pick** radius.full

- **Token** `color.surface.canvas` → `badge.ring` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.

- **Token** `border-width.default` → `badge.ring-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-5-6" title="Group" note="Parts 5, 6"}
![Group: 5, 6](/anatomy/accessible-first/avatar/card-3.png)

:label[Grouping] :label[Layering]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Answer** Elevation · What separates groups on the page? → Lines

  Strong borders separate groups at any zoom.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `component-spacing-map.x2` → `group.overlap` 0.5rem

  - **Pick** space.8

- **Token** `color.surface.canvas` → `group.ring` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.

- **Token** `border-width.default` → `group.ring-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `avatar`.
- **From a terminal:** `npx open-ds anatomy accessible-first avatar`
