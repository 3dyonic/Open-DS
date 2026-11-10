---
composite_data: "./empty.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 26
title: "Empty"
description: "Empty in Dense data."
---

# Empty

What a region shows when it loaded and has nothing: why, and what to do next.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="empty/live"}

## When to use it

**In Dense data:** An empty table says what to do next.

- **Use it when:** An empty list, a search with no results, or a first visit with no items yet.
- **Not when:** Still loading (skeleton or spinner), or a load that failed (alert).

Instead:

- [Skeleton](./skeleton.md): Still loading.
- [Alert](./alert.md): Something went wrong.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Dense data" tone="neutral"}
::preview{robot="slumber" id="empty/variant/default"}

**What it is for**

The picture shown as it is: an image or illustration.

- ✓ A larger empty area where a picture helps.
- ✕ A small region where the picture would push the words away.

**In Dense data**

No pictures: an empty table needs the reason and the one action that fills it.

**Because**

- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
- [Where do the words matter most? **Errors and empty states**](#why-voice-lands) · `voice.lands`
:::

:::panel{title="icon" note="variant" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="empty/variant/icon"}

**What it is for**

The picture as an icon in a small tile.

- ✓ A compact empty state next to data.
- ✕ A first visit that needs more warmth than an icon.

**In Dense data**

An outline icon in a small tile beside the reason and the action.

**Because**

- [What do icons do? **Actions and status**](#why-iconography-roles) · `iconography.roles`
- [What icon style? **Outline**](#why-iconography-definition) · `iconography.definition`
:::

::card-grid{id="anatomy-link/empty"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="An empty state"}
**Use** Why it is empty and the one action that fills it

**Not** A blank table

An empty table with no words looks like an error. Example: “No escalated alerts. Change the date range to see older ones.”
:::
::::

## Why it works this way

Empty looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Empty, and what would move if it changed.

::reason-chain{id="empty/content.q1"}

::reason-chain{id="empty/voice.lands"}

::reason-chain{id="empty/iconography.roles"}

::reason-chain{id="empty/iconography.definition"}

## Words

- Lead with the object, then the state: "Alert 2041 contained."
- Use numbers, not words for numbers.
- One verb per button. No "please", no exclamation marks.
- Use: Investigate, Filter, Assign, Escalated, Resolved. Avoid: Oops, Awesome, Please, Simply.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Delete
- `content.action.retry`: Retry
- `content.action.empty-action`: Change filters

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add empty
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Empty reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Empty's tokens to change Empty alone.

::token-table{component="empty"}
