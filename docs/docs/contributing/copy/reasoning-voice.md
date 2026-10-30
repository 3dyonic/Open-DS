---
title: "Open DS: reasoning voice guide (v1, draft)"
description: "Contributor note from the first preview: Open DS: reasoning voice guide (v1, draft)."
---

# Open DS: reasoning voice guide (v1, draft)

Written by the Content Writer for Yonatan Lev Ari, 2026-10-29. Nothing here is published or approved.

**Why this guide exists.** Open DS is not a generator. It does not decide for anyone. It shows the reasons behind each choice, asks the person for their own reason, and carries both into the boilerplate. This guide sets the voice for three places:

1. **Option texts** in the packs: `why`, `when_to_choose`, `trade_offs`, `sources` (fields from OD-60).
2. **The "why?" question** the builder asks after each pick, and how it answers back.
3. **The boilerplate docs:** `README.md` for people and `AGENTS.md` for AI tools.

**Settled by the Architect (2026-10-29):**
1. Tokens, components and layout are made by people or the build. Only the decision sections of `README.md` and `AGENTS.md` are generated from the recipe and manifest.
2. A stored reason is 280 characters at most.
3. The validator errors when an `AGENTS.md` rule's decision id is not in the README or the manifest (tracked in OD-37).

**Voice in one line:** a careful colleague who explains, shows the source, says what a choice costs, and then lets you decide.

Rules that apply everywhere (from Yonatan's copy rules and the brand guide): plain words, small words, playful and low-ego, no hype, no vanity numbers, no jargon without a plain line, no tool or vendor names that add nothing, active voice, never judgmental. Scheme and option text follows ASD-STE100 style, as OD-36 and OD-60 ask: short sentences, one idea each, plain words.

**Status of examples:** examples below show the voice. They are not final pack content. Check every fact and source against the real pack before it ships.

---

## 1. Option texts

Every option has four parts. Together they answer: why would I choose this, when does it fit, what does it cost, and who says so.

| Field | Answers | Voice | Length limit |
|---|---|---|---|
| `why` | What is this option, and what does it give you? | Plain statement of the benefit. Second person where it helps ("you get…"). | 1 or 2 sentences. Up to 35 words in all. |
| `when_to_choose` | In which situation does it fit? | Starts with "Choose this if you…" or "Choose this when…". Names a real situation. | 1 sentence. Up to 25 words. |
| `trade_offs` | What does it cost or leave out? | Honest and specific. At least one real cost per option. Items split by semicolons. | 1 to 3 items. Up to 15 words each. |
| `sources` | Who says so? | Real sources only. Title and link. At least one. | 1 to 3 sources. |

### Rules
1. **Second person.** "You get…", "If you ship in dark mode…". Never "the user" or "one".
2. **Why first, then when, then cost.** Write in that order, every time.
3. **Every option has a cost.** If you can't name a real trade-off, you don't know the option well enough yet. Ask the Researcher. Never write "none".
4. **No winners by tone.** Every option gets the same warmth and length. The default is marked by the pack as a starting point, and the text says so plainly. It is not praised.
5. **Cite, don't claim.** A claim that can be wrong has a source. A plain description of what the option is (for example "OKLCH is a color space") may rest on the definition source.
6. **No hype and no absolutes.** No "best", "perfect", "always", "never", "simply", "just", "easy", "powerful", "modern", "future-proof", "industry standard", "best practice".
7. **No numbers that sound like proof.** A number only when it is part of the option itself (4.5:1, 12 steps) or a fact from a cited source.
8. **Plain words.** One short word beats a long one. If a term is needed, say it once and explain it in the same sentence.
9. **No other products named** unless the option is that thing, or the source is named in `sources`.
10. **Name a problem with care.** Say what happens, not who is at fault. "Colors can look uneven" and not "bad scales".
11. **One line per cell, no pipe characters.** The build reads these as table cells (see the file format in section 7).
12. **Say what we don't know.** If the evidence is thin, write "Evidence is limited" in `trade_offs`, and keep the source.

### Do and don't
| Don't | Do |
|---|---|
| "OKLCH is the modern, best way to build color." | "OKLCH is a color space where equal steps in lightness look about equal to the eye. You get scales that feel even." |
| "Choose this for any serious product." | "Choose this if your palette has to look even across hues and you can use CSS Color 4 values." |
| Trade-offs: "None." | "Some older tools can't read `oklch()` yet; Some colors you pick are outside the screen's range and need a fallback." |
| "Easily the fastest option." | "You write fewer rules, because one value feeds every step." |
| "Experts agree HSL is outdated." | "HSL lightness doesn't match what the eye sees, so equal steps can look uneven. It is simple and well known." |
| Source: "common knowledge" | Source: "CSS Color Module Level 4, W3C Candidate Recommendation (w3.org/TR/css-color-4/)" |

### Example: one option from the color pack (illustrative)
*Scheme: which color space the swatches are built in. Option: OKLCH.*
- **why:** OKLCH is a color space built so equal lightness steps look about equal to the eye. You get scales that feel even from hue to hue.
- **when_to_choose:** Choose this if you want even-looking scales and your tools can read `oklch()` values.
- **trade_offs:** Some older tools can't read `oklch()`; Some colors you pick fall outside the screen's range and need a fallback.
- **sources:** CSS Color Module Level 4 (w3.org/TR/css-color-4/); Björn Ottosson, "A perceptual color space for image processing" (bottosson.github.io/posts/oklab/)

### Example: one option from the purpose pack (illustrative)
*Question: which accessibility level must the product meet? Option: WCAG 2.2 level AA.*
- **why:** Level AA is a common target that many accessibility rules refer to. You get clear targets, such as 4.5:1 contrast for body text.
- **when_to_choose:** Choose this if you ship to the public, or you want a target that many teams and rules share.
- **trade_offs:** Contrast targets limit very light brand colors; Level AA doesn't cover every need, so user testing still matters.
- **sources:** Web Content Accessibility Guidelines (WCAG) 2.2 (w3.org/TR/WCAG22/)

*(Both examples keep each field under its limit. Facts and links must be checked against the pack before shipping.)*

---

## 2. Asking "why?" for each pick

After each pick, the builder asks one short question. The answer is the team's own reason. It goes into the README in the team's words.

### Principles
1. **Ask once, ask lightly.** One question per pick. The answer is optional. Skipping is fine.
2. **Ask about the person, not the option.** "What made this fit for you?" and not "Why did you choose this?" (which sounds like a test).
3. **Show, don't judge.** The builder never says a pick is wrong, risky or unusual. It may show the option's cost, as information, once.
4. **Keep the person's words.** Store and reflect back what they wrote. Trim only for length, never rewrite, never fix their grammar, never add a reason they didn't give.
5. **Never write the reason for them.** Not the builder, not an AI agent. An agent may offer a clearly labeled draft ("Draft, edit me"), and the draft is only stored once the person accepts it.
6. **Same voice for people and agents.** An agent asks the same question in the same words and waits for the person's answer.

### Prompt wording
- **Main prompt (up to 12 words):** "You picked {option_label}. What made it fit for you?"
- **Placeholder in the box (one example, plain):** "For example: our users read long text on small screens."
- **If the pick is the default:** "This is the starting point. Want to say why it fits?"
- **If the pick was recommended by an earlier answer:** "Your earlier pick pointed here. Does it fit you? A line on why helps."
- **Skip button:** "Skip for now". **Confirm button:** "Save my reason".
- **After skipping:** "No reason yet. You can add one later." The README then says "Reason not written yet." It never fills the gap.

### Reflect the answer back
Reflect in one or two lines. Start with the pick, then the person's words, then what happens next. The person's words stay in quotes or in a clearly separate line.

> **Got it: OKLCH, because "our palette has to feel even across hues."**
> This goes in your README, in your words.

If the person's words show a trade-off they may want to know about, show it once. The tone is "worth knowing", never "warning":

> **Worth knowing:** some older tools can't read `oklch()` yet. You can keep this pick. The README will list it as a trade-off you accept.

If two picks pull in different directions, name it kindly and show both sources:

> **Two picks pull in different directions.** "Compact density" and "large base unit" don't fit together easily (see the density source). You can change either, or keep both and say why.

### Do and don't
| Don't | Do |
|---|---|
| "Why did you choose this?" | "You picked 12 steps. What made it fit for you?" |
| "Are you sure? This is unusual." | "Worth knowing: 12 steps means more tokens to name. You can keep this pick." |
| "Great choice!" | "Got it: 12 steps, because \"we need small shifts for charts.\"" |
| Rewriting: "Because it improves accessibility and scalability." | Keeping: "because \"people read long text on small screens.\"" |
| Filling an empty answer with a guess | "No reason yet. You can add one later." |
| "You must give a reason." | "Skip for now. You can add one later." |
| "Your answer conflicts with best practice." | "These two picks pull in different directions. Here are the sources." |
| Agent writes: "Reason: follows WCAG." | Agent asks the person, waits, then stores their words |

### Limits
- Prompt: up to 12 words. Reflect: up to 2 lines. Placeholder: up to 15 words.
- Stored reason: **280 characters at most** (Architect, 2026-10-29). Write the prompt and placeholder so a short answer fits.
- Findings (gap or conflict) follow the same kindness rules: say what is missing or what pulls apart, show the source, offer the next step. Never "error: you chose wrong".

---

## 3. Boilerplate README.md (for people)

The README states what the design system serves and why, then lists every decision with the team's reason. Its decision sections (what the design system serves, and the decisions) are generated from the recipe and manifest, the same source as `AGENTS.md`, so the two never disagree. The other sections, such as how to use it and the file list, are written by people or the build. (Architect, 2026-10-29.) OD-56 asks for the section "What this design system serves" first, and for a rationale on every decision.

### Voice
- Speaks to the reader as "you". Speaks for the team as "we" only inside the team's own reasons, in their words.
- Plain words, short sentences, no hype. Source for each decision. The trade-off the team accepted is stated.
- **No rationale is ever invented.** If the team wrote none, the line says "Reason not written yet."
- States the recipe fingerprint and pack release, so a reader can check the README against the recipe.
- No claims such as "complete", "accessible by default", "best practice". Say what the team picked and what they checked.

### Template
```
# {Design system name}

{One plain sentence: what this is and who it is for.}

## What this design system serves
{Purpose picks, one block each. In this order: product type, users and context,
accessibility target, platforms, team size, brand variance, density, voice.}

- **{Question in plain words}:** {option label}
  - Why: {the team's words}
  - Source: {title and link}

## How to use it
1. {Install and build steps, plain and numbered. (Node and pnpm, per OD-56.)}
2. {Where the tokens, preset and components live.}
3. {Where AGENTS.md lives and what it is for.}

## Decisions
For each scope (color, type, space, radius), one block per decision:

### {Decision in plain words}
- **We picked:** {option label}
- **Why we picked it:** {the team's words, or "Reason not written yet."}
- **What it costs:** {the trade-off the team accepts}
- **Source:** {title and link}
- **Id:** `{scheme_id}` / `{option_id}`

## Findings the team accepted
{Gaps or conflicts the check reported, and the team's reason for keeping the pick.
If none: "The check found no gaps or conflicts."}

## Files
{List the files. One line each.}

## About this recipe
Recipe fingerprint: {fingerprint}. Pack release: {pack release id}.
Made with Open DS. {link} The decisions above come from the recipe, so this README
and AGENTS.md agree.
```

### Example: 3dyonic recipe (illustrative)
*The wording and picks below show the voice only. Replace each "why" with the team's real words. Ids and the fingerprint are placeholders until the pack exists.*

```
# 3dyonic design system

A starting kit for 3dyonic's own site and projects.

## What this design system serves
- **What does it serve?** Marketing site and portfolio
  - Why: "Visitors judge our work here first, so it has to feel calm and clear."
  - Source: Open DS purpose pack, {link}
- **How does it feel?** Friendly
  - Why: "We want people to feel welcome, not sold to."
- **Which accessibility level must it meet?** WCAG 2.2 level AA
  - Why: "We ship to the public, and the site already follows light and dark settings."
  - Source: Web Content Accessibility Guidelines 2.2, w3.org/TR/WCAG22/
- **How much can the look change?** Light and dark only
  - Why: "One brand, two modes."

## How to use it
1. Install with pnpm, then build. (Exact commands come from the boilerplate.)
2. Colors, type, space and radius live in `tokens.css`. The Tailwind preset reads them.
3. AI tools read `AGENTS.md` before they change anything.

## Decisions

### Which color space are the swatches built in?
- **We picked:** OKLCH
- **Why we picked it:** "Our palette has to feel even across hues."
- **What it costs:** Some older tools can't read `oklch()`. We add fallbacks.
- **Source:** CSS Color Module Level 4, w3.org/TR/css-color-4/
- **Id:** `{scheme_id}` / `{option_id}`

### How much space is one step?
- **We picked:** a 4 px base unit
- **Why we picked it:** Reason not written yet.
- **What it costs:** {from the pack}
- **Id:** `{scheme_id}` / `{option_id}`

## Findings the team accepted
The check found no gaps or conflicts.

## About this recipe
Recipe fingerprint: {fingerprint}. Pack release: {pack release id}.
```

### Do and don't
| Don't | Do |
|---|---|
| "A complete, accessible-by-default design system." | "A starting kit that follows WCAG 2.2 level AA. Run your own checks too." |
| Filling a missing reason: "We chose it for scalability." | "Reason not written yet." |
| Rewriting the team's reason in marketing words. | Quote it, trimmed only for length. |
| Listing a decision without its source. | "Source: CSS Color Module Level 4, w3.org/TR/css-color-4/" |
| Hiding the cost. | "What it costs: some older tools can't read `oklch()`." |
| Long paragraphs per decision. | Five short lines, same order every time. |

---

## 4. Boilerplate AGENTS.md (for AI tools)

`AGENTS.md` carries the same decisions as short rules, plus the recipe fingerprint. Its decision sections are generated from the same recipe and manifest as the README, so each rule traces to a decision the README explains. (Architect, 2026-10-29.)

### Rule voice
1. **Imperative.** Start with a verb: "Use", "Keep", "Add", "Do not".
2. **One rule per line.** Up to 15 words. One idea.
3. **Concrete.** Name the file, variable or class: `tokens.css`, `--color-*`. No "appropriate" or "good".
4. **Do and don't, in two lists.** The don't list holds only things the recipe forbids or discourages.
5. **No hedging.** No "try", "consider", "should", "ideally". If it isn't a rule, leave it out.
6. **No reasoning paragraphs.** The why lives in README.md. Add a pointer, not a story.
7. **Trace every rule.** End the line with the decision it comes from, as `[scheme_id]`. A rule with no decision is not allowed.
8. **Nothing the README doesn't say.** AGENTS.md may be shorter. It may never add rules.
9. **Stop and ask.** If a task needs breaking a rule, the agent stops and asks the person. It does not edit the rules.
10. **No hype, no tool or vendor names** that add nothing.

### Template
```
# AGENTS.md: {Design system name}

Recipe fingerprint: {fingerprint}
Pack release: {pack release id}
Read README.md for the reasons behind each rule.

## Do
- {Imperative rule.} [{scheme_id}]
- {Imperative rule.} [{scheme_id}]

## Do not
- {Do not ... rule.} [{scheme_id}]

## If a rule blocks the task
Stop. Ask the person. Do not change this file or tokens.css to make a task pass.

## Files
{List of files an agent may read or edit, and which it may not.}
```

### Example: 3dyonic recipe (illustrative)
*Rules show the voice. Each must match a decision in the real recipe. Ids are placeholders.*
```
# AGENTS.md: 3dyonic design system

Recipe fingerprint: {fingerprint}
Pack release: {pack release id}
Read README.md for the reasons behind each rule.

## Do
- Use CSS variables from `tokens.css` for every color. [{scheme_id}]
- Define colors as `oklch()` values, with a fallback. [{scheme_id}]
- Keep body text at 4.5:1 contrast or more. [{scheme_id}]
- Follow the light and dark settings of the visitor's device. [{scheme_id}]
- Use the base unit for all spacing. [{scheme_id}]
- Take corner radius from the radius variables. [{scheme_id}]

## Do not
- Do not write raw hex colors in components. [{scheme_id}]
- Do not add a new color, step or radius that the recipe doesn't list. [{scheme_id}]
- Do not add a theme switch that needs JavaScript. [{scheme_id}]

## If a rule blocks the task
Stop. Ask the person. Do not change this file or tokens.css to make a task pass.
```

### Do and don't
| Don't | Do |
|---|---|
| "You should try to use design tokens where appropriate." | "Use CSS variables from `tokens.css` for every color." |
| A paragraph on why OKLCH is better. | "Define colors as `oklch()` values, with a fallback." (The why is in README.md.) |
| "Always make it accessible." | "Keep body text at 4.5:1 contrast or more." |
| A rule with no decision behind it. | "Use the base unit for all spacing. [{scheme_id}]" |
| "Feel free to adjust the palette." | "Do not add a color the recipe doesn't list." |
| Rule text that differs from the README. | Same decision, same words for names and values. |

### Keeping README.md and AGENTS.md in step
- Both come from the same recipe and the same pack release. The fingerprint is printed in both.
- Every AGENTS.md rule names a decision that the README lists. **The validator errors when an AGENTS.md rule's decision id is not in the README or the manifest.** (Architect, 2026-10-29; tracked in OD-37.) So write each rule with its id. A rule with no id breaks the check.
- If the recipe changes, both files change together.

---

## 5. Where the voice shows up (summary)
| Place | Voice | Who writes it |
|---|---|---|
| Option text in a pack | Explains why, when, cost, source. Second person. Plain. | Content Writer and Researcher, from sources. |
| The "why?" prompt | One light question. Keeps the person's words. Never judges. | Content Writer (prompt), the person (answer). |
| Finding text (gap, conflict) | Says what is missing or what pulls apart. Shows the source. Offers a next step. | Content Writer (templates), validator (data). |
| README.md | "You" for the reader, "we" inside the team's words. Every decision has a source and a cost. | Decision sections generated from the recipe and manifest. Other sections by people or the build. The reasons are the team's, up to 280 characters each. |
| AGENTS.md | Imperative rules. No stories. Traced to decisions. | Decision sections generated from the recipe and manifest. |

---

## 6. Words
**Use:** why, fit, pick, choose, cost, trade-off, source, "worth knowing", "reason not written yet", "starting point".
**Avoid:** best, right way, wrong, mistake, risky, unusual, obviously, simply, just, easy, powerful, modern, future-proof, "best practice", "industry standard", "accessible by default", "complete", "AI-powered", "generate".

---

## 7. Pack copy file format (proposed, for `pack-copy.md`)

**Status:** the packs are being built on branch `feat/OD-mvp` and are not on `master` yet, so no `pack-copy.md` rows exist. Rows wait for the real ids. This is the format the table will use once the pack's real scheme ids and option ids exist.

- **One table per pack**, under a heading `## Pack: {pack_id}`. The Markdown header row is exactly:
  `| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |`
- **One row per option.** Key = `pack` + `scheme_id` + `option_id`. The key must be unique and must match the pack data exactly. A row with an unknown key is a build error. An option with no row is a build warning.
- **No pipe characters inside cells.** Use a comma, a semicolon or the word "or". No line breaks inside a cell. No HTML.
- **`trade_offs`:** items separated by `; ` (semicolon and space). **`sources`:** items separated by `; `. Each source is `Title (url)`, with a real URL, and the same wording as in the pack data when it has one.
- **Limits** are in section 1. A lint step can check them: `why` up to 35 words; `when_to_choose` up to 25 words and starting with "Choose this if" or "Choose this when"; `trade_offs` 1 to 3 items of up to 15 words; `sources` 1 to 3 items.
- **Encoding:** UTF-8. Straight quotes. Code in backticks is allowed (no pipes inside).
- **Never invent ids or sources.** The Content Writer fills `why`, `when_to_choose`, `trade_offs` only for options that exist in the pack, and cites only sources already in the pack data or verified references.

---

## 8. Purpose effect badges

**Context.** Purpose is the first step of every recipe, and it is Scoped. **Global decisions are asked once, right after Purpose, and carried into every scope.** On the later questions, an option can show an effect that comes from the person's Purpose answers. The effect is a hint with a reason. It never decides for the person.

### Labels
| Effect (in the pack) | Label the person sees | Meaning |
|---|---|---|
| `recommends` | **Fits your purpose** | Your Purpose answer points toward this option. |
| `discourages` | **Worth a second look** | Your Purpose answer pulls the other way. You can still pick it. |
| `requires` | **Your purpose needs this** | A rule from your Purpose answer needs this option. |

### Tooltip
Pattern: **Because you chose [purpose answer]: [one-line reason].**
- Name the Purpose answer the person picked, in its plain label.
- The reason is one line, at most 280 characters (the same limit as a stored reason), and ideally one short sentence of up to 20 words.
- The reason states what happens or what the rule says. It cites the purpose answer, and the option's own source covers the facts. No hype, no pressure, no "you should".
- If two Purpose answers apply, show one tooltip line for each, each in the same pattern.
- For agents, the MCP result carries the same label and tooltip text, so people and agents read the same words.

### Rules
1. **Never say "discouraged" or "not recommended" to people.** Say "Worth a second look". Do not use "avoid", "bad", "wrong", "risky" or "unsafe" either. Those words stay out of the badge, the tooltip and the findings.
2. **Options never win by tone.** A badge is a hint with a reason. It does not rank. Do not reorder options by badge. Do not make one option larger, bolder or warmer. An option with no badge is not worse; it has no effect from this purpose.
3. **Same shape for all three badges.** They differ by their words and a small icon, not by an alarm color. Never rely on color alone.
4. **Always give the reason.** A badge with no tooltip is not allowed. If the pack has no reason for an effect, the badge does not show.
5. **The badge blocks nothing. A missing required option does.** "Fits your purpose" and "Worth a second look" never block a pick, and the "Your purpose needs this" badge itself blocks nothing. If the person leaves out an option that their Purpose answer requires, `check` reports an `error` and the recipe can't finish. The step shows this as a blocking state with a way to fix it (see "Blocking state" below). The blocking copy stays kind and plain: it says what is missing and how to add it, and it never blames.
6. **Say it once.** Show the badge in the option list and in the recipe summary. Don't repeat it in a banner.
7. **Internal words stay internal.** `recommends`, `discourages` and `requires` are pack words. People see only the labels.

### Blocking state: a required option is missing
**When it applies.** A pick leaves out an option that a Purpose answer requires (`requires` effect). `check` reports an `error` and the recipe can't finish. The badge stays a badge. The step shows the unmet requirement as a blocking state, with a way to fix it.

**Copy.** Kind, plain, and specific. Say which Purpose answer needs which option, and what to do next. In the step, do not say "error", "invalid", "wrong" or "failed". People see "needs". Only the CLI and MCP `check` output uses the `error:` prefix, because that is its severity.

- **Message:** `[Purpose answer] needs [option]. Add it to finish your recipe.`
- **Reason line (below the message):** `Because you chose [Purpose answer]: [one-line reason].` (the same tooltip text, so people and agents read the same words)
- **Fix action (primary button):** `Add [option]`
- **Second action (link):** `Change my purpose answer`
- **Summary at the recipe level:** `One choice needs a change before you can finish.` or `[n] choices need a change before you can finish.`
- **Finish control:** stays visible, shows as unavailable, with the hint `Finish is available once every required option is in.`
- **`check` output (CLI and MCP, for people and agents):** `error: [Purpose answer] needs [option] ([scheme]). Add it to finish your recipe. Source: [source title] ([url]).`

**Rules**
1. The blocking state is separate from the badge. The three badges keep one shape and equal weight. Only the blocking state may stand out, because the recipe can't finish until it is fixed.
2. Meaning never rests on color alone. Use an icon and the words.
3. The fix action does the fix: `Add [option]` selects the required option. It must not open a long explanation first.
4. Say it where the person is working: at the step, and in the recipe summary. Not in a banner on every page.
5. Always give the reason line. A block with no reason isn't allowed.
6. No pressure words: no "must", "required by law", "fix this now", "you forgot".

**Importable mapping (blocking copy).** Header row exactly as below, one row per key, no pipe characters inside cells. Placeholders in square brackets are filled in by the build.

| key | text |
|---|---|
| blocking_message | [Purpose answer] needs [option]. Add it to finish your recipe. |
| blocking_reason | Because you chose [Purpose answer]: [one-line reason]. |
| fix_action_label | Add [option] |
| fix_action_secondary_label | Change my purpose answer |
| summary_one | One choice needs a change before you can finish. |
| summary_many | [n] choices need a change before you can finish. |
| finish_unavailable_hint | Finish is available once every required option is in. |
| check_error | [Purpose answer] needs [option] ([scheme]). Add it to finish your recipe. Source: [source title] ([url]). |

**Example (from the packs).** Purpose answer "Multi-brand" requires "Separate" in "Do you keep structure and theme apart?".
- Message: Multi-brand needs Separate. Add it to finish your recipe.
- Reason line: Because you chose Multi-brand: Two brands can share components only when theme values stay outside the components.
- Fix action: Add Separate

### Importable mapping (for the build)
Format: one Markdown table, header row exactly as below, one row per effect, no pipe characters inside cells. `[purpose answer]` and `[one-line reason]` are placeholders the build fills in.

| effect | label | tooltip_pattern |
|---|---|---|
| recommends | Fits your purpose | Because you chose [purpose answer]: [one-line reason]. |
| discourages | Worth a second look | Because you chose [purpose answer]: [one-line reason]. |
| requires | Your purpose needs this | Because you chose [purpose answer]: [one-line reason]. |

### Examples (illustrative; effects follow the examples in OD-60)
| Purpose answer | Option | Badge | Tooltip |
|---|---|---|---|
| WCAG 2.2 level AA | Text contrast of 4.5:1 or more | Your purpose needs this | Because you chose WCAG 2.2 level AA: body text needs a contrast of 4.5:1 or more. |
| Compact density | A large base spacing unit | Worth a second look | Because you chose compact density: a large base unit leaves less room on each screen. |
| White-label for many brands | A separate theme layer | Fits your purpose | Because you chose white-label for many brands: a separate theme layer lets each brand change its own look. |

### Do and don't
| Don't | Do |
|---|---|
| "Not recommended for your project." | "Worth a second look" |
| "Discouraged by your purpose." | "Because you chose compact density: a large base unit leaves less room on each screen." |
| A red warning badge on one option and a green star on another. | Three badges of one shape. Words and a small icon carry the meaning. |
| A badge with no reason. | A badge only when the pack gives a reason. |
| Moving "Fits your purpose" options to the top. | Keep the pack's order. |
| "You must pick this." | "Your purpose needs this" on the badge, with the reason in the tooltip. |
| "Error: required option missing." | "Multi-brand needs Separate. Add it to finish your recipe." |
| A badge that stops the person from picking another option. | A badge that only informs. The blocking state appears only when a required option is left out. |
| "Because you chose X, you should do Y." | "Because you chose X: Y needs Z." |

### Microcopy for global decisions
- Heading before the global questions: "A few choices apply to every scope. We ask them once."
- After answering: "Saved. Every scope uses this."
- On a scope page, next to a global answer: "From your global choices." with a link to change it.

### Effect fields in the build
Each effect in a pack carries a `reason` field next to its target scheme id and option id. The reason is one line, up to 280 characters. The Architect has added it to the build. A badge shows only when its effect has a reason (rule 4).
