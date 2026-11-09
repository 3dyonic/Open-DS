---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 34.5
slug: "kbd/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Kbd in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the keyboard key apart to show how design decisions become the parts you see. You don't need it to use the keyboard key: [its own page](../kbd) has everything you need to build.

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

![Kbd, every part numbered](/anatomy/multi-brand/kbd/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Shortcut** optional :label[By scheme]{tone="info"} :label[Grouping]
- **2** **Key** required :label[By scheme]{tone="info"} :label[Meaning] :label[Readability]
- **3** **Key on an inverse fill** optional :label[By scheme]{tone="info"} :label[Readability]
- **Tooltip around the key** optional · shown by Tooltip :label[Layering]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Shortcut" note="Parts 1"}
![Shortcut: 1](/anatomy/multi-brand/kbd/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Token** `space.gap.tight` → `group.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

:::panel{id="part-2" title="Key" note="Parts 2"}
![Key: 2](/anatomy/multi-brand/kbd/card-2.png)

:label[Meaning] :label[Readability]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Token** `color.surface.sunken` → `background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.muted` → `label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `radius.badge` → `radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.

- **Token** `type.caption.font-size` → `font-size` 0.8125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.13
:::

:::panel{id="part-3" title="Key on an inverse fill" note="Parts 3"}
![Key on an inverse fill: 3](/anatomy/multi-brand/kbd/card-3.png)

:label[Readability]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Token** `color.surface.inverse` → `inverse.background` #0F172A · dark #F8FAFC :label[By scheme]{tone="info"}

  A reversed fill for small, short-lived messages.

  - **Pick** neutral.900: the reverse of content for short messages; its text reads, 17.85:1 on surface.inverse, above the 4.5:1 floor.
  - **Dark** neutral.900: the reverse of content for short messages; its text reads, 17.06:1 on surface.inverse, above the 4.5:1 floor.
  - **Shares the step with** text.primary. Changing this pick moves only what reads color.surface.inverse.

- **Token** `color.text.inverse` → `inverse.label` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  Text on an inverse fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 17.85:1 on surface.inverse, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 17.06:1 on surface.inverse, above the 4.5:1 floor.
  - **Shares the step with** text.on-action, text.on-danger. Changing this pick moves only what reads color.text.inverse.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `kbd`.
- **From a terminal:** `npx open-ds anatomy multi-brand kbd`
