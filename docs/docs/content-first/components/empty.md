---
composite_data: "./empty.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 26
title: "Empty"
description: "Empty in Content first."
---

# Empty

What a region shows when it loaded and has nothing: why, and what to do next.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="empty/live"}

## When to use it

**In Content first:** An empty reading list, as an invitation to save an article. Not while article text is loading.

- **Use it when:** An empty list, a search with no results, or a first visit with no items yet.
- **Not when:** Still loading (skeleton or spinner), or a load that failed (alert).

Instead:

- [Skeleton](./skeleton.md): Still loading.
- [Alert](./alert.md): Something went wrong.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="empty/variant/default"}

**What it is for**

The picture shown as it is: an image or illustration.

- ✓ A larger empty area where a picture helps.
- ✕ A small region where the picture would push the words away.

**In Content first**

Attention belongs to the text: the invitation is in words, not a picture.

**Because**

- [What must the interface protect? **Attention on the content**](#why-human-q1) · `human.q1`
- [How visible is the brand in the interface? **Present**](#why-brand-q2) · `brand.q2`
:::

:::panel{title="icon" note="variant" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="empty/variant/icon"}

**What it is for**

The picture as an icon in a small tile.

- ✓ A compact empty state next to data.
- ✕ A first visit that needs more warmth than an icon.

**In Content first**

A quiet outline icon in a small tile, above a warm invitation to save an article.

**Because**

- [What icon style? **Outline**](#why-iconography-definition) · `iconography.definition`
- [How does it sound? **Conversational**](#why-voice-values) · `voice.values`
:::

::card-grid{id="anatomy-link/empty"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="An empty state"}
**Use** An invitation, not a dead end

**Not** "No items"

An empty list is a chance to show what the product offers. Example: “Nothing saved yet. Tap Save on any article to read it later.”
:::
::::

## Why it works this way

Empty looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Empty, and what would move if it changed.

::reason-chain{id="empty/human.q1"}

::reason-chain{id="empty/brand.q2"}

::reason-chain{id="empty/iconography.definition"}

::reason-chain{id="empty/voice.values"}

## Words

- Write to one person: "you", not "users".
- Short sentences with room to breathe.
- Explain why before asking for anything.
- Use: Read, Save for later, You, Next issue. Avoid: Click here, Submit, Users, Content.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Browse guides

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add empty
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Empty reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Empty's tokens to change Empty alone.

::token-table{component="empty"}
