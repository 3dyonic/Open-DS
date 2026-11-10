---
composite_data: "./native-select.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 41
title: "Native select"
description: "Native select in Dense data."
sidebar_class_name: "ods-left-out"
---

# Native select

The browser's own select, styled.

:label[Left out of Dense data]{tone="warning"} Native select is best on phones, and Dense data runs at a desk. Its select already picks one value. A small team keeps fewer parts right. Use instead: [Select](./select), [Radio group](./radio-group)

## See it live

::preview{robot="slumber" id="native-select/live"}

## When to use it

- **Use it when:** A plain closed list, especially on phones, where the system picker is best.
- **Not when:** Options that need icons or rich content (select), or a short list better shown at once (radio group).

Instead:

- [Select](./select.md): A custom menu with richer options.
- [Radio group](./radio-group.md): A short list shown at once.

::card-grid{id="anatomy-link/native-select"}

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
npx open-ds add native-select
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Native select reads 30 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Native select's tokens to change Native select alone.

::token-table{component="native-select"}
