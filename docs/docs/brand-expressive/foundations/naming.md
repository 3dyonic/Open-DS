---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 10
title: "Naming"
description: "Brand expressive: How tokens and keys are named."
---

# Naming

How tokens and keys are named.

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What gets a name? | Tokens and component keys | Components get their own keys. |
| How many token tiers? | Three | Primitives, semantics and component keys. |
| How are decisions named? | By role | Role names survive each campaign. |
| How are names written? | Lowercase words in paths | Lowercase paths read the same everywhere. |
| What do components read? | Component keys | Campaigns change primitives, never components. |

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A value with no token | The closest semantic token, then ask for a new one | A raw value in the component | The next campaign changes primitives; raw values would stay behind. |
