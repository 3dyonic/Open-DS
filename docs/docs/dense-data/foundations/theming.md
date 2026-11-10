---
composite_data: "./theming.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 8
title: "Theming"
description: "Dense data: Modes and brands."
---

# Theming

Modes and brands.

Dense data has **2 modes** and **1 brand**. A mode swaps the colors; corners and type stay the same in every mode.

::mode-preview{id="default"}

### What a mode changes

::mode-changes{id="default"}

### What stays the same in every mode

::mode-constants{id="default"}



## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What can a theme change? | Mode only | One brand, so only the mode changes. |
| How many themes ship? | Two | Light and dark. |
| How are brands handled? | One brand | One product, one brand. |
| Which modes ship? | Light and dark | Light first, always; dark ships as standard for night shifts. |
| What changes when the theme changes? | Colors only | A mode switch changes colors only, so layout never moves. |

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Someone switches to dark | The dark semantic mode | A second palette in components | Only semantic colors change, so layout never moves. |
