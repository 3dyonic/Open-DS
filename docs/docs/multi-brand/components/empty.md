---
composite_data: "./empty.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 26
title: "Empty"
description: "Empty in Multi-brand."
---

# Empty

What a region shows when it loaded and has nothing: why, and what to do next.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="empty/live"}

## When to use it

**In Multi-brand:** No orders yet.

- **Use it when:** An empty list, a search with no results, or a first visit with no items yet.
- **Not when:** Still loading (skeleton or spinner), or a load that failed (alert).

Instead:

- [Skeleton](./skeleton.md): Still loading.
- [Alert](./alert.md): Something went wrong.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Multi-brand" tone="neutral"}
::preview{id="empty/variant/default"}

**What it is for**

The picture shown as it is: an image or illustration.

- ✓ A larger empty area where a picture helps.
- ✕ A small region where the picture would push the words away.

**In Multi-brand**

Shared structure in every brand: no brand pictures in empty states.

**Because**

- [How is the voice defined? **A shared core, brand tone on top**](#why-voice-definition) · `voice.definition`
- [How are brands handled? **Brands as modes**](#why-theming-definition) · `theming.definition`
:::

:::panel{title="icon" note="variant" label="Used in Multi-brand" tone="success"}
::preview{id="empty/variant/icon"}

**What it is for**

The picture as an icon in a small tile.

- ✓ A compact empty state next to data.
- ✕ A first visit that needs more warmth than an icon.

**In Multi-brand**

An icon in a small tile, from the one outline set every brand shares.

**Because**

- [What icon style and stroke? **Outline**](#why-iconography-definition) · `iconography.definition`
:::

::card-grid{id="anatomy-link/empty"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="An empty state"}
**Use** Shared structure, brand words

**Not** A different structure per brand

The structure is the shared core; words carry the brand. Example: “No orders yet. Your first order will appear here.”
:::
::::

## Why it works this way

Empty looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Empty, and what would move if it changed.

::reason-chain{id="empty/voice.definition"}

::reason-chain{id="empty/theming.definition"}

::reason-chain{id="empty/iconography.definition"}

## Words

- Shared structure: object, state, next step.
- Brand tone lives in headlines and marketing copy, not in errors.
- Errors and confirmations read the same in every brand.
- Use: Get started, Plan, Order. Avoid: Brand-specific words in errors, Jargon.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Get started

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add empty
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Empty reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Empty's tokens to change Empty alone.

::token-table{component="empty"}
