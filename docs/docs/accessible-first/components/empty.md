---
composite_data: "./empty.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 26
title: "Empty"
description: "Empty in Accessible first."
---

# Empty

What a region shows when it loaded and has nothing: why, and what to do next.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="empty/live"}

## When to use it

**In Accessible first:** An empty list, saying what will appear and how to start. Not while loading, and never a blank page.

- **Use it when:** An empty list, a search with no results, or a first visit with no items yet.
- **Not when:** Still loading (skeleton or spinner), or a load that failed (alert).

Instead:

- [Skeleton](./skeleton.md): Still loading.
- [Alert](./alert.md): Something went wrong.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Accessible first" tone="neutral"}
::preview{robot="slumber" id="empty/variant/default"}

**What it is for**

The picture shown as it is: an image or illustration.

- ✓ A larger empty area where a picture helps.
- ✕ A small region where the picture would push the words away.

**In Accessible first**

The brand stays out of the way: words say what will appear and how to start.

**Because**

- [How visible is the brand in the interface? **Quiet**](#why-brand-q2) · `brand.q2`
- [What must the interface protect? **Low effort to understand**](#why-human-q1) · `human.q1`
:::

:::panel{title="icon" note="variant" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="empty/variant/icon"}

**What it is for**

The picture as an icon in a small tile.

- ✓ A compact empty state next to data.
- ✕ A first visit that needs more warmth than an icon.

**In Accessible first**

A filled icon in a tile, beside words that say what will appear here and how to start.

**Because**

- [What icon style and stroke? **Bold stroke**](#why-iconography-definition) · `iconography.definition`
- [How does it sound? **Plain and direct**](#why-voice-values) · `voice.values`
:::

::card-grid{id="anatomy-link/empty"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="An empty state"}
**Use** Explain what will appear here and how to start

**Not** A blank page

A blank page leaves people unsure if something failed. Example: “You have no saved applications. Start a new one below.”
:::
::::

## Why it works this way

Empty looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Empty, and what would move if it changed.

::reason-chain{id="empty/brand.q2"}

::reason-chain{id="empty/human.q1"}

::reason-chain{id="empty/iconography.definition"}

::reason-chain{id="empty/voice.values"}

## Words

- Use common words. Explain any term you must use.
- One idea per sentence. Put the action first.
- Never blame the person.
- Use: Continue, Change, Start, You. Avoid: Invalid, Utilise, Submit, Error code.

The labels components use, from the voice tokens:

- `content.action.commit`: Continue
- `content.action.cancel`: Go back
- `content.action.destroy`: Delete
- `content.action.retry`: Try again
- `content.action.empty-action`: Start a new application

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add empty
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Empty reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Empty's tokens to change Empty alone.

::token-table{component="empty"}
