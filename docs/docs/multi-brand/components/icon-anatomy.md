---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 30.5
slug: "icon/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Icon in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the icon apart to show how design decisions become the parts you see. You don't need it to use the icon: [its own page](../icon) has everything you need to build.

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

Drawn in Figma by the Open DS anatomy plugin; the image is not exported yet.

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Glyph** required :label[By scheme]{tone="info"} :label[Meaning]
- **2** **Contained shape** optional :label[By scheme]{tone="info"} :label[Containment]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Size" note="Parts 1"}
Drawn in Figma by the Open DS anatomy plugin; the image is not exported yet.

:label[Meaning]

- **Answer** Iconography · How many icon sizes exist? → One

  One size next to text.

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text.

- **Token** `size.icon` → `size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-1" title="Stroke" note="Parts 1"}
Drawn in Figma by the Open DS anatomy plugin; the image is not exported yet.

:label[Readability]

- **Answer** Iconography · What icon style and stroke? → Outline

  One outline set for every brand, at a 1.5px stroke.
:::

:::panel{id="part-2" title="Contained shape" note="Parts 2"}
Drawn in Figma by the Open DS anatomy plugin; the image is not exported yet.

:label[Containment]

- **Answer** Iconography · What icon style and stroke? → Outline

  One outline set for every brand, at a 1.5px stroke.

- **Token** `radius.control` → `contained.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.

- **Token** `color.surface.selected` → `contained.tint.background` #DEF3F0 · dark #012C28 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** teal.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** teal.dark.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `icon`.
- **From a terminal:** `npx open-ds anatomy multi-brand icon`
