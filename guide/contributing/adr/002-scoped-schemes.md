---
title: "ADR-002: Scoped, modular schemes (proposal)"
description: "OD-288 spike: split each scheme and the grammar into one file per scope and per component, joined by one loader."
---

# ADR-002: Scoped, modular schemes

Status: proposed (OD-288). Nothing in this note is built yet.

## Problem

Each scheme is one JSON file of about 530 KB. The grammar is one file of about 1.4 MB. The next stages need three things that one big file blocks:

- **Distribution:** a project installs one scheme, or one scope of it, such as a new color scope.
- **Editing:** a person or an agent changes one scope and sees one small diff.
- **Ownership:** each scope has an owner, a version and its own checks.

Measured on Dense data (bytes of JSON):

| Part | Size | Share |
|---|---|---|
| `tokens.component` | 230,493 | 56% |
| `tokens.brands` | 39,785 | 10% |
| `tokens.semantic` | 15,430 | 4% |
| `tokens.primitive` | 12,242 | 3% |
| `usage` (57 rules) | 12,688 | 3% |
| `inventory` | 12,399 | 3% |
| `answers` | 11,649 | 3% |
| everything else | about 6,000 | 1% |

In the grammar, `catalogue` (410 KB) and `component_keys` (277 KB) are half of the file.

About 40 files read the scheme JSON files directly: the CLI, the docs generator, the harness, Storybook, the site, the token build and 25 one-off scripts in `scripts/`.

## Proposal

### 1. One folder per scheme, one file per scope

```
schemes/
  grammar/
    grammar.json            # id, version, layers, options, methods, reasons, order
    scopes/<scope>.json     # questions, situations, owns, lands_in
    components/<id>.json    # component keys and the catalogue entry
  dense-data/
    scheme.json             # id, name, version, status, summary, ai, scenarios, voice, themes
    scopes/<scope>.json     # this scope's answers, usage rules, semantic tokens
    primitives.json         # the primitive scales
    brands/<brand>.json     # theme picks per mode
    components/<id>.json    # component tokens and inventory entry
```

The grammar names 12 scopes: typography, color, spacing, shape, elevation, motion, iconography, theming, accessibility, naming, voice and components. A scope file holds everything that scope decides. `owns` in the grammar already says which semantic tokens belong to which scope, so the split is computed, not hand-made.

### 2. One loader joins the files

`loadScheme(id)` and `grammar()` in `cli/src/schemes.mjs` join the folder into today's object. Callers see the same shape. The same function serves the CLI, MCP, docs, Storybook, the site and the token build.

A write goes through one function, `saveScheme(id, scheme)`. It splits the object by `owns` and writes each file with `JSON.stringify(x, null, 2) + "\n"`. The grammar gets the same pair. This also ends the text edits that `grammar.json` needs today.

### 3. Each scope file carries a version

A scope file has `version` and `requires` (the grammar version it was written for). A scheme's version is the highest of its scope versions. The harness fails when a scope changes and its version does not.

### 4. Distribution

- `open-ds add <scheme>` copies the scheme folder.
- `open-ds add <scheme> --scope color` copies one scope file. The loader fills the other scopes from the installed scheme.
- The npm package ships the folders unchanged. `cli/scripts/bundle.mjs` copies folders in place of files.

## Migration

Each step is one PR to RC1, and the harness stays green after each one.

1. Add `saveScheme` and `saveGrammar`. Move every write in `scripts/` onto them. The files do not change yet.
2. Move every direct reader onto `loadScheme` and `grammar()`. A new harness check fails when a file outside `cli/src/schemes.mjs` reads `schemes/*.json`.
3. Write the numbered migration `scripts/migrate-002-split.mjs`. It splits the files, and `saveScheme` then writes folders. A test loads both layouts and compares the objects.
4. Add the scope versions and their harness check.
5. Add `--scope` to `open-ds add`.

Steps 1 and 2 are useful without the split: they remove the 40 direct readers.

## Risks

- **Two layouts for one release.** The loader reads both until step 3 lands everywhere. The compare test keeps them equal.
- **Cross-scope references.** A usage rule in spacing names `size.row`, which accessibility owns. References stay by token name, so a split does not break them. A scope installed alone can name a token that its scheme lacks; the loader reports each one.
- **More files.** About 70 files per scheme in place of 1. Git diffs get smaller; a full read gets slower. Measure the load time before and after, and keep it under 200 ms per scheme.

## Not in scope

- A new token format. The tokens stay DTCG.
- A change to the grammar's questions or to any value.

## Decision asked

Approve steps 1 and 2 now; they pay for themselves. Decide on the folder split (step 3) after step 2 shows the reader count at zero.
