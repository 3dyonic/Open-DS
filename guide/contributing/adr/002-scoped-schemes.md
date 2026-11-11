---
title: "ADR-002: Scheme layers, a build step, and distribution (proposal)"
description: "OD-288: split a scheme by owner (source, overlay, output), join it at build time, and ship one package for every channel."
---

# ADR-002: Scheme layers, a build step, and distribution

Status: decided (OD-288). Nothing in this note is built yet.

## Problem

A scheme is one JSON file of about 530 KB, and the grammar is one file of about 1.4 MB. The next stages need three things that this layout blocks:

- **User edits that survive upgrades.** `open-ds create` copies the whole `scheme.json` into a project. A user's edit then mixes with Open DS values, so a new release cannot tell an edit from an old value.
- **Distribution.** A person answers the questions, gets a scheme, downloads it and generates a project from it. The site, the MCP and the CLI must give the same result.
- **Small changes.** A change to one scope must be one small diff, with its own version and checks.

## What the data shows

Measured on RC1, 2026-11-11.

| Fact | Measure |
|---|---|
| Component tokens are copies of the grammar's defaults | 1,385 of 1,414 equal `component_keys.default` in every scheme; 7 or 8 differ; 22 have no default |
| Component tokens are most of a scheme | 230 KB of 410 KB of JSON in Dense data (56%) |
| Semantics and primitives are partly shared | Content first shares 101 of 133 semantics with Dense data; Accessible first shares 92 |
| Some values are already generated from inputs | Color scales (from key colors, `scales-generated`) and the component spacing map (`spacing-map-generated`) |
| A changed answer moves no value | `planChange` returns a list of what to review: rules, variants and the scope's tokens. Open DS records decisions; it does not compute values from answers. |
| A project records its source | `open-ds.json` holds the scheme id and version. Old source versions are not kept anywhere a project can reach. |
| Load time is not a cost | Dense data in one file: 3.4 ms. The same data in 68 files: 2.1 ms. The grammar: 11.6 ms. |
| Scheme checks run only in this repo | `open-ds check` checks a project's UI code. Contrast, grid and citation checks live in `harness/checks.mjs`. |

## Decision

### 1. Three layers, by owner

| Layer | Owner | Holds | Edited by hand |
|---|---|---|---|
| **Source** | Open DS | The grammar and the five ready-made schemes, each scope versioned | Only by Open DS |
| **Overlay** | The user | Changed answers, then changed picks, rules and tokens, each with a why and a because | Yes, and nowhere else |
| **Output** | The build | The resolved scheme, tokens, components, Storybook, docs and agent files | No: rebuild it |

A scheme is its source plus an overlay. With an empty overlay, it is the source scheme itself. Open DS never writes into an overlay. A user never writes into a source.

### 2. A source stores only what a person decided

- A component key stores a value only where it differs from the grammar's default. That is about 8 per scheme, not 1,414. The 22 keys with no default get one in the grammar.
- Color scales store their key colors and adjustments, not the steps.
- The component spacing map stores its rule, not its steps.

The build generates the rest. This removes more than half of each scheme file, and it removes the copies that can drift.

### 3. One build step joins and checks

`open-ds build` (and the same function in this repo):

1. reads the source at the versions in the lockfile, plus the overlay;
2. generates the derived values: component defaults, scales and the spacing map;
3. checks the result:
   - every token name resolves;
   - every pick and override cites an answer the scheme gives;
   - contrast pairs pass;
   - spacing is on the grid;
4. writes `build/scheme.json`, the resolved scheme, with a content hash.

Every reader reads only the built file: the CLI, MCP, docs, Storybook, site and token build. A built file older than its sources fails with "Out of date … Run: open-ds build", like the docs checks today.

The scheme checks move from `harness/checks.mjs` into `cli/src`. The harness and the package call the same functions, so a user's project runs the same checks as this repo.

### 4. The overlay

```json
{
  "source": { "scheme": "dense-data", "version": "0.4.0" },
  "answers": [{ "question": "shape.values", "option": "round", "why": "Our users are new to the tool." }],
  "picks": [{ "brand": "default", "mode": "base", "token": "theme.radius.control", "value": "{radius.8}", "because": ["shape.values"], "why": "Rounder controls read as friendly." }],
  "usage": [{ "situation": "card", "use": "space.inset.container", "because": ["layout.q2"], "why": "…" }],
  "tokens": [{ "path": "component.button.radius", "value": "{radius.pill}", "because": ["shape.values"], "why": "…" }],
  "reviewed": ["usage:hover-feedback"]
}
```

- Paths name a brand and a mode, so Multi-brand works the same way.
- Every entry cites an answer. An entry with no because is rejected, as in a source.
- A JSON Schema validates the file where it enters the build.

### 5. A changed answer opens a review

A changed answer moves no value by itself. The build runs `planChange` for each changed answer and lists every rule, variant and token that cites it. Each item stays open until the user does one of two things:
- edits it in the overlay;
- confirms it, which adds it to `reviewed`.

The build reports the open count. `open-ds build --strict` fails while any item is open. An agent closes the list with the user.

### 6. The lockfile

`open-ds.lock` holds the grammar version, the source scheme version, each scope's version and hash, and the built file's hash. A download checks these hashes.

### 7. Upgrades

`open-ds upgrade` moves the source to a new version, one scope at a time. It compares three things: the old source, the new source and the overlay.

- A source change that the overlay does not touch applies quietly.
- An overlay entry on a value the source also changed is a conflict. The tool shows both and asks.
- A source rename (such as `radius.container` to `radius.surface`) ships as a numbered migration. The migration also rewrites overlays, and the old name stays as a deprecated alias for one minor release.
- A new grammar question takes the source's answer. It goes on the review list as "new question".

Each released source version is kept in the npm package history, so an upgrade can always read the old source.

**Projects created before this change.** `open-ds upgrade` reads the scheme id and version from `open-ds.json`. It fetches that source version, compares it with the project's `scheme.json` and writes the differences as an overlay. Every difference gets a "why: carried over from scheme.json" until the user writes a real one. Those entries go on the review list.

### 8. The journey, end to end

1. **Answer the questions** on the site, through the MCP or with the CLI. The result is a source (the closest of the five, by the number of matching answers) plus an overlay of the answers that differ.
2. **Get the scheme.** The build joins and checks it, and the review list says what the changed answers touch.
3. **Download it.** The package is one folder: the manifest, the overlay, the lockfile and the built file. The site offers it as a zip; the CLI gets sources from npm (section 11).
4. **Generate.** `open-ds create` builds the project from the folder. Generated files carry a header, and the drift check flags a hand edit.
5. **Edit.** The user changes the overlay, then rebuilds.
6. **Upgrade.** `open-ds upgrade`, as in section 7.

Exports such as DTCG tokens, CSS, the Figma kit and the docs are output. They come from the built file.

### 9. Identity: a renamed scheme is a new scheme

A scheme with an empty overlay is its source: same id, same name. An overlay may set its own `id` and `name`. Then it is a new scheme that the user owns:

- It keeps `source` (scheme and version) as a link, not a copy.
- Upgrades from the source are opt in: `open-ds upgrade` lists what changed in the source, and the user takes all of it, part of it or none.
- With no `id` in the overlay, the scheme stays the source's, and upgrades follow the source by default.

This is the ownership hook. A team that renames owns a scheme of its own, and it still gets the source's fixes when it wants them. Later, the same hook can let a team with an existing design system describe it as a scheme (see Later).

### 10. Folder split of a source

A source splits by scope: `scheme.json` (identity and global answers), `scopes/<scope>.json` (that scope's answers, rules and semantics), `brands/<brand>.json` and `components.json` (only the values that differ). The grammar splits the same way. Users never see this layout, because they read the built file and write the overlay.

### 11. Distribution

- **npm first.** The CLI gets sources from npm. npm keeps every released version, which upgrades need.
- **The zip comes later, but the format is set now.** The package folder in section 8 is the zip's content. `open-ds create --from <folder or zip>` reads it. The site's questions and its Download button come later.
- **No registry by URL.** A CDN registry costs hosting and care, and nothing needs it yet.

## Gaps found in the second pass, and how the plan closes them

| Gap | How it is closed |
|---|---|
| A source copies 1,385 grammar defaults per scheme | Section 2: store only the differences; the build generates the rest |
| A changed answer moves no value, so an overlay of answers alone changes nothing | Section 5: a review list from `planChange`, closed by an edit or a confirm |
| A source rename breaks an overlay's paths | Section 7: migrations rewrite overlays; aliases stay one minor release |
| A new grammar question has no answer in an old overlay | Section 7: it takes the source's answer and goes on the review list |
| An upgrade needs the old source, which is not kept | Section 7: each released source stays in the npm package history; the lockfile names it |
| Existing projects hold a full `scheme.json` copy | Section 7: `upgrade` extracts an overlay from it |
| Scheme checks run only in this repo | Section 3: the checks move to `cli/src`; the build runs them in every project |
| Multi-brand picks differ per brand and mode | Section 4: overlay paths name the brand and the mode |
| A custom scheme from answers alone has no values | Section 8: start from the closest source; the review list covers what differs |
| A renamed scheme loses its link to the source | Section 9: the overlay keeps `source` as a link; upgrades from it are opt in |
| A downloaded package may be changed or truncated | Section 6: the lockfile's hashes are checked on download |
| A stale built file misleads every reader | Section 3: an out-of-date check, and `create`, `docs` and the tests build first |

## Risks

| Risk | Handling |
|---|---|
| An upgrade loses user edits | Edits live only in the overlay; upgrades compare three ways and ask on a conflict |
| An edit breaks a rule (contrast, grid) | The build runs the same checks as this repo and names the fix |
| A rule names a token another scope owns | References stay by name; the build lists each name that does not resolve |
| Mixed versions across scopes | The lockfile pins them; a scope installs only for its grammar version |
| A renamed scheme drifts far from its source | Upgrades are opt in and per scope, so the team takes only what it wants |
| Two layouts during the move | The loader reads both; a test loads each layout and compares the objects |
| The review list grows long and users ignore it | It is grouped by answer, an agent works through it with the user, and `--strict` blocks a release |

## Order of work

Each step is one PR to RC1. The harness stays green after each step. Steps 1 to 3 change nothing a user sees.

1. One load and save path. A harness check fails on any direct read of `schemes/*.json`. 40 files move to it.
2. Component defaults at build time. A source stores only the differences. Defaults are added for the 22 keys. Measure the size change.
3. The build step and the built file, with the scheme checks moved into `cli/src` and the out-of-date check.
4. The overlay format, its schema, the review list and the lockfile. `create` writes these in place of a copied `scheme.json`.
5. `open-ds upgrade`: the three-way compare, migrations on overlays, and the import from old projects.
6. The source folder split by scope.
7. Packaging: the npm package, and `create --from` reading the package folder or a zip. Installing one scope alone (`--scope`) comes after a real user needs it.

## Not in scope

- A new token format. The tokens stay DTCG.
- Computing values from answers. Open DS records decisions; a person or an agent sets each value, and the review list keeps them honest.
- Upgrades of component code the user copied into a project. The user owns that code, as with shadcn; `upgrade` shows the diff only.

## Later

- **Existing design systems as schemes.** A team describes its own design system as a scheme: its answers, then its values. The rename hook (section 9) is the start. This needs its own plan.
- **The site's questions and its zip download.** The architecture supports both now.

## Decided (Yonatan, 2026-11-11)

1. User edits live only in the overlay.
2. The scheme is joined at build time, and every reader reads only the built file.
3. A source stores only what a person decided; the build generates defaults, scales and the spacing map.
4. Component code copied into a project belongs to the user; upgrades show a diff only.
5. npm first. The zip format is set now and built later. No registry by URL.
6. "Scheme" is the one name, with or without an overlay. A renamed overlay makes a new scheme that keeps a link to its source for opt-in upgrades.
