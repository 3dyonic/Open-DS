---
composite_data: "./empty.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 26
title: "Empty"
description: "Empty in Brand expressive."
---

# Empty

What a region shows when it loaded and has nothing: why, and what to do next.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="empty/live"}

## When to use it

**In Brand expressive:** A region that loaded with nothing, in playful words with a clear next step. Not while images load; skeleton does that.

- **Use it when:** An empty list, a search with no results, or a first visit with no items yet.
- **Not when:** Still loading (skeleton or spinner), or a load that failed (alert).

Instead:

- [Skeleton](./skeleton.md): Still loading.
- [Alert](./alert.md): Something went wrong.

## Variants

What each variant is for in any design system, then what Brand expressive decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="empty/variant/default"}

**What it is for**

The picture shown as it is: an image or illustration.

- ✓ A larger empty area where a picture helps.
- ✕ A small region where the picture would push the words away.

**In Brand expressive**

A campaign image or illustration beside the playful words and a clear next step.

**Because**

- [What is the main content? **Images and campaigns**](#why-content-q1) · `content.q1`
- [What must the interface protect? **Delight**](#why-human-q1) · `human.q1`
:::

:::panel{title="icon" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="empty/variant/icon"}

**What it is for**

The picture as an icon in a small tile.

- ✓ A compact empty state next to data.
- ✕ A first visit that needs more warmth than an icon.

**In Brand expressive**

A two-tone icon in a tile, for a small region where a picture would push the words away.

**Because**

- [What icon style and stroke? **Contained**](#why-iconography-definition) · `iconography.definition`
- [What do icons do? **Those and decoration**](#why-iconography-roles) · `iconography.roles`
:::

::card-grid{id="anatomy-link/empty"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="An empty state"}
**Use** Playful, with a clear next step

**Not** A dead end

Playful words still need a way forward. Example: “Nothing here yet. Go find something you love.”
:::
::::

## Why it works this way

Empty looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Empty, and what would move if it changed.

::reason-chain{id="empty/content.q1"}

::reason-chain{id="empty/human.q1"}

::reason-chain{id="empty/iconography.definition"}

::reason-chain{id="empty/iconography.roles"}

## Words

- Headlines are short and bold. Three to six words.
- Verbs that move: Join, Try, Go.
- Playful in headlines, plain in errors.
- Use: Join, Drop, Go, Love. Avoid: Synergy, Leverage, Kindly.

The labels components use, from the voice tokens:

- `content.action.commit`: Go
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Explore the drop

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add empty
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Empty reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Empty's tokens to change Empty alone.

::token-table{component="empty"}
