# Open DS: brand and copy (v4, scope change)

Prepared by the Content Writer for Yonatan Lev Ari. **The tagline is a proposal. Yonatan picks.** Section 9 holds the reasoning voice guide (also saved alone as `reasoning-voice.md`). MVP due Fri 2026-10-30 morning. Nothing here is published. Status: **draft for Yonatan's yes**.

**What changed in v4 (scope change, Yonatan, 2026-10-29 19:09 and 19:12):** Open DS does not calculate colors or tokens. It captures design system decisions and calculation schemes, each with cited options, checks a recipe for completeness and conflicts, and every recipe leads to a boilerplate. All "get tokens", "checked tokens", token-output claims and the live color ramp are removed from the hero, demo, illustrations, visuals brief and components list.

Builds on: the Researcher's brief (`/workspace/open-ds/market-fit.md`), the Orchestra memos (brand memo a36a0580, value proposition fb8bde3e, scope change f962fbb8, boilerplate 89a37a38, claims 7ffb1c26) and the earlier v3 of this file (kept at `brand-and-copy.v3.md`).

Sources: Jira OD, Orchestra project `open-ds`, open-ux.dev, 3dyonic.com/work, flashdsm.com (read once, for the brief only), Yonatan's copy rules.

**Facts the copy relies on (from the Orchestra memos):**
- A scheme is one decision with cited answers. Answers are options, some global (shared across scopes) and some scoped. Some schemes are *calculation schemes*: they record a method (for example how a color scale steps). Open DS stores the method as data, with its source. It does not run it.
- The checker tests a recipe for **completeness** (nothing missing) and **conflicts** (picks that don't fit together).
- Each recipe leads to a boilerplate. **People or the build make the tokens, components and layout.** Only the decision sections of README.md and AGENTS.md are generated from the recipe and manifest (Architect, 2026-10-29). No code does color or token math. **The MVP has one boilerplate: the 3dyonic recipe.** Do not write that every recipe has one today.
- The boilerplate holds tokens.css, a Tailwind preset, base components, README.md and AGENTS.md. **README.md is for people:** what the design system serves, each decision with its rationale in the team's words, and how to use it. **AGENTS.md is for AI tools:** the same decisions as short do and don't rules, plus the recipe fingerprint. Both get their decision sections from the same recipe and manifest, so they never disagree. A stored reason is 280 characters at most. The validator errors when an AGENTS.md rule's decision id is not in the README or the manifest (OD-37). *(Architect, 2026-10-29.)*
- The site lets a person browse scopes, pick options, and copy or share the recipe.
- The MCP server gives agents decisions and checks: list scopes, get the decisions, get an option, check a recipe.
- The MCP install line `uvx open-ds-mcp` is a placeholder, TBD pending the final name.

---

## 1. Brand brief

### Name usage
- **Open DS** is the name, in all prose, titles, headings and the logo. Capital O, D, S, one space. "DS" is short for design system.
- **`open-ds`** is only for machine places: package, MCP server id, CLI, URL path, file names. Always in code style in text. (The repo today is `3dyonic/Open-DS`.)
- Never "OpenDS", "Open-DS" in prose, "OPEN DS" or "ODS". The spaced "Open DS" also keeps it apart from other projects called "OpenDS" (see section 7).
- First mention on any page: "Open DS, a cited dictionary of design system decisions." After that, "Open DS".
- Say "design system" in full the first time. "DS" appears only inside the name.
- Family: Open DS sits next to Open UX. Write "Open UX" and "Open DS" the same way. Domain: see section 7 **[DECISION: Yonatan]**.

### Value proposition
> Open DS turns design system decisions into cited choices: pick your answers, get a checked recipe and a boilerplate to start from, by hand or through your AI agent.
*(Orchestra memo fb8bde3e, adopted. Wording for the page is in the hero.)*

**Pitch line:** **Choose your design system decisions on purpose, with sources, and start from a full DS that follows them.**

**What it is** *(Product Owner's value proposition, lightly edited; also the README "what it is" paragraph):*
> Open DS turns design-system decisions into a reasoned recipe. You answer the decision questions, starting with Purpose, and pick from cited answers. Every pick records its reason. The recipe then leads to a full DS boilerplate (tokens, CSS and components) that follows it, and `check` verifies the recipe. Open DS doesn't calculate colors or tokens; it captures the decisions and the calculation schemes.

### One-line description
Open DS is a cited dictionary of design system decisions: choose your answers, check that the recipe holds together, and start from a design system boilerplate (tokens, CSS and components) that follows it.

### Tagline
- **Pick: "Choose your design system on purpose."** Plain, active, playful, and it says the new idea: every choice is yours and has a reason. It does not mention any other tool or compare.
- Alternate A: "Design system decisions, cited and checked." *(The earlier pick. It still fits: "checked" now means the recipe is checked for gaps and conflicts, so keep it as the descriptor under the logo or the meta line.)*
- Alternate B: "Every design system choice has a source."

### Personality (3 to 4 traits)
| Trait | Do | Don't |
|---|---|---|
| **Clear** | Name the decision, give the options, show the source. "Pick how your colors step." | Use words a new designer would need to look up. |
| **Playful** | Small words, a light touch, an invitation to try. "Pick an answer and see what the check says." | Jokes that cost clarity, emoji walls, mascots. |
| **Careful** | Say what it does today. Show the source and the check on screen. | Promise more than the picker can show. Say "complete", "best", "best practice" or "the standard". |
| **Open** | Welcome fixes, new answers, new scopes. Credit every source. | Sound like a pitch or a gate. Hide where an answer came from. |

### Audience
1. **Primary: the design system lead or design engineer** who is setting or resetting foundations and has to defend each choice. They can judge a source and a check.
2. **Second, and the best channel: people who build with AI agents**, who want their agent to get decisions and checks instead of inventing values.
3. **Later: front-end teams and agencies** who want a repeatable starting point (needs more boilerplates than the MVP has, so no copy for them yet).

---

## 2. Tone of voice

### Rules
1. **Plain words.** Write for someone who has never heard of tokens. If a short word works, use it.
2. **Every claim has something on screen that shows it.** If the picker, a check or the boilerplate can't show it, don't write it.
3. **Lead with sources, checks and the boilerplate.** No color ramp, no generated output.
4. **Say what it does for the reader.** "Pick an answer, see the source, check the recipe", not "Open DS provides a scheme resolution engine".
5. **Playful and low-ego.** Light, curious, inviting. A toy box with good tools, not a trophy shelf.
6. **Active voice, short sentences.** One idea per sentence. The product is the subject: "Open DS lists the decisions."
7. **No "I" everywhere.** "We" only on contribute pages.
8. **No vanity numbers.** No counts of schemes, questions, packs, tools or files. A number only if it proves real use.
9. **Name problems with care.** Describe a gap kindly, only as far as we know. Never blame people or tools.
10. **Say "AI agents", not tool or vendor names.** Name a tool only when the reader needs it to do something (for example the MCP install line, shown as TBD until the name is final).
11. **For agents, say "decisions and checks"**, not "tokens for agents" and not "MCP for design tokens".
12. **The product is the story,** not who or what built it.
13. **No hype, no urgency.** No "revolutionary", "next-gen", "supercharge", "game-changing", "finally".
14. **Never name or compare other products in public copy.** The comparison lives only in section 8 of this brief.

### Claims we must not make
- That Open DS builds, calculates or generates tokens or colors. It records decisions and methods, and checks the recipe.
- That Open DS generates a boilerplate from a recipe. People or the build make the tokens, components and layout. Only the decision sections of README.md and AGENTS.md come from the recipe and manifest. In public copy say "built from your recipe", never "AI-generated".
- That every recipe has a boilerplate today. The MVP has one: the 3dyonic recipe.
- A complete or "full" design system, or coverage of all categories. State scope: "Color is full. Type, spacing and radius are starter sets." *(The internal phrase "full DS boilerplate" means tokens, CSS and components. In public copy, list the files and say the MVP has one. The pitch line may say "a full DS", as set on 2026-10-29.)*
- "Accessible by default". Say "checked against the rules listed on each check".
- "Works with Figma, Style Dictionary, Tokens Studio" or any other tool, until tested.
- "Trusted by", user, adoption or time-saved numbers. "Best practice". Say "options with sources".
- Any line that says AI tools skip basics, ignore design systems, or guess.
- Any line that says other tools decide for you, or that they are closed or worse. (Section 8 holds the comparison for the team only.)

### Examples
| Instead of | Write |
|---|---|
| "Get checked tokens in seconds." | "Pick your answers. Open DS checks the recipe for gaps and conflicts." |
| "Open DS calculates your color scale." | "Open DS keeps the method for a color scale, with its source." |
| "AI tools ignore design system basics." *(never)* | "AI agents can read the same decisions you do, and check a recipe before they build." |
| "Unlike generators, we show our sources." *(never)* | "Every option shows where it comes from." |
| "Tokens for your agents." | "Decisions and checks for your agents." |
| "Generates a full design system." | "Each recipe leads to a boilerplate to start from." |
| "Accessible by default." | "Checked against the rules listed on each check." |

### Word list
**Use:** decision, option, answer, source, cite, pick, choose, on purpose, recipe, check, gap, conflict, boilerplate, start from, scope, pack, try, see, share.
**Avoid:** leverage, seamless, robust, powerful, revolutionary, cutting-edge, supercharge, unlock, empower, ecosystem, paradigm, orchestrate (Orchestra's word), best-in-class, 10x, blazing, effortless, "AI-powered", "agentic", "generate", "generator", "build tokens", "checked tokens", "ramp", "schema", "W3C standard", "best practice", "accessible by default", "full system".
**Keep findable in page text:** "cited dictionary of design system decisions".

### Glossary in plain words
| Word | Plain meaning (use this line on the site) |
|---|---|
| **Scope** | One area of a design system, like color, type or spacing. |
| **Scheme** | One design decision, with its cited answers. Open DS is a dictionary of schemes. On the site, say "decision" and use "scheme" only on the pack and contribute pages. Some schemes record a method, like how a color scale steps. Open DS keeps the method and its source. It doesn't run it. |
| **Question** | The decision of a scheme, in plain words: "How should your colors step from light to dark?" |
| **Answer** | One option you can pick for a scheme, with its source. Some answers are shared across scopes (global). Others belong to one scope. |
| **Recipe** | The answers you picked, saved so you can share it or come back to it. |
| **Check** | A test on your recipe: is anything missing (a gap), and do any picks work against each other (a conflict)? It reports what it finds, with a source. It does not choose for you. |
| **Boilerplate** | A set of starter files written to follow one recipe: tokens.css, a Tailwind preset, base components, a README.md for people and an AGENTS.md for AI tools. People or the build make the tokens, components and layout. The decision parts of the two docs come from the same recipe, so they never disagree. The first boilerplate comes from the 3dyonic recipe. |
| **Token** | A named design value, like `color-blue-500`, shared by design and code. It lives in the boilerplate files. Open DS doesn't calculate tokens. |
| **Pack** | A folder of schemes (decisions and cited options) for one scope. Each release of a pack stays the same. |
| **MCP** | The plug AI agents use to talk to Open DS. Explain once; use the word only in the agents section. |

---

## 3. Website copy

### Meta
- **Title (under 60 characters):** Open DS: cited design system decisions
- **Description (under 160 characters):** A cited dictionary of design system decisions. Choose your answers, check the recipe for gaps and conflicts, and start from a boilerplate that follows it.
- **Share image text:** "Open DS. Choose your design system on purpose."

### Hero
- **Headline:** Choose your design system on purpose.
- **Subhead:** Open DS is a cited dictionary of design system decisions. Pick your answers, see the source for each, and start from a boilerplate that follows them, by hand or through your AI agent.
- **Primary CTA:** Start picking *(to the picker)*
- **Secondary CTA:** Use it with your AI agent *(to the agents section)*
- **Text link under the CTAs:** See the 3dyonic boilerplate *(to the showcase; the first and only boilerplate in the MVP)*
- **What the hero shows:** one decision with its options and their sources, a recipe check showing a gap and a conflict, and the file tree of a boilerplate. No color ramp.

### What Open DS is (short block under the hero; keeps the phrase findable)
**Title:** A cited dictionary of design system decisions
**Body:** Every design system answers the same questions: how colors are chosen, how type grows, how space adds up, how round corners get. Open DS lists those decisions, gives a few options for each, and shows where each option comes from. Your picks make a recipe. Open DS checks the recipe for gaps and conflicts, and each recipe leads to a boilerplate to start from.
**Small line:** Open DS keeps the decisions and the methods behind them. It doesn't calculate colors or tokens.

### How it works (3 steps)
**Title:** How it works
1. **Pick a scope.** Start with color. Type, spacing and radius have starter sets.
2. **Choose your answers.** Each decision shows its options and the source of each. Some answers are shared across scopes. Your picks make a recipe you can copy or share as a link.
3. **Check, then start.** Open DS checks the recipe for gaps and conflicts. Then start from a boilerplate that follows it.

### Scopes
**Title:** Scopes
**Intro:** A scope is one area of a design system. Each has its own decisions.
- **Color:** The decisions behind a palette: how colors are described and how a scale steps from light to dark. *Full set.*
- **Type:** How text sizes grow from one step to the next. *Starter set.*
- **Spacing:** How space steps from small to large. *Starter set.*
- **Radius:** How round corners get. *Starter set.*
- **More on the way.** Want one sooner? Open an issue.
**Footnote:** Some answers are global: they are shared across scopes, like your base unit. Others are scoped to one scope.

### Boilerplate
**Title:** Start from a boilerplate
**Body:** Each recipe leads to a boilerplate: starter files written to follow its decisions. They hold tokens.css, a Tailwind preset, base components, a README.md for people and an AGENTS.md for AI tools. The README says what the design system serves and why each decision was made. The AGENTS.md turns the same decisions into short rules, so your AI agent follows them too. The decision parts of both are built from your recipe, so they never disagree. The first boilerplate comes from the 3dyonic recipe. More recipes follow.
**Small line:** People or the build make the files. The decision parts of the README and AGENTS.md are built from your recipe.
**Link:** See the 3dyonic boilerplate

### For AI agents (MCP)
**Title:** For AI agents
**Line:** Decisions and checks for your agent.
**Body:** Open DS has an MCP server, a plug for AI agents. Your agent can list the scopes, read the decisions and their cited options, and check a recipe for gaps and conflicts. Open DS gives the sources and the checks. The agent makes the call.
**Small print:** Open DS runs no model and never picks for the agent.
**CTA:** Add Open DS to your agent *(install steps)*
**Code block (placeholder, never shown as fact):**
```
uvx open-ds-mcp
```
**Label under the block:** "Install line: TBD. The package name is pending the final product name."

### Packs
**Title:** Packs
**Body:** A pack holds the decisions and cited options for one scope, as plain files in git. Each release of a pack stays the same, so the same picks give the same result for a given pack release. The website and the MCP server both read packs and add nothing of their own.
**Link:** Browse the packs

### Open source
**Title:** Open source
**Body:** Open DS is open source and open to fixes. Add an option, correct a source, or start a new scope. An option needs a reason and a source, so the dictionary stays something you can check.
**CTAs:** See how to contribute · Read the code
**License line:** "Licensed under [LICENSE]." **[DECISION: Yonatan; OD-48; the repo holds an MIT placeholder]**

### Footer line
Open DS · Made by Yonatan Lev Ari · Next to Open UX · Open source

---

## 4. README intro

**What it is (paragraph):**
Open DS turns design-system decisions into a reasoned recipe. You answer the decision questions, starting with Purpose, and pick from cited answers. Every pick records its reason. The recipe then leads to a full DS boilerplate (tokens, CSS and components) that follows it, and `check` verifies the recipe. Open DS doesn't calculate colors or tokens; it captures the decisions and the calculation schemes. Use it in the browser, or let your AI agent read the decisions and run the checks through MCP.

**3-line quick explainer:**
1. **Choose:** every decision lists its options, each with a source.
2. **Check:** Open DS looks for gaps and conflicts in your recipe.
3. **Start:** each recipe leads to a boilerplate (tokens.css, a Tailwind preset, base components, a README for people, AGENTS.md for AI tools). The first one follows the 3dyonic recipe.

**MCP quick start (placeholder, TBD pending the final name):** `uvx open-ds-mcp`

*(Install, usage and contribute sections belong to the Architect. Keep the same plain words. Don't add "works with" lines until tested. Don't write that Open DS builds or calculates tokens.)*

---

## 5. Case study outline: "AI-driven DS" on 3dyonic.com

Story: **one recipe, written with sources, checked, and a boilerplate that follows it.** Matches the site's case format (problem told with care, the idea, how it works, what's next) and OD-49 (5 sections or fewer). Preview URL only; the live site waits for Yonatan's yes. Say "built this way", never "trusted by". How AI fits: an agent reads the decisions and checks the recipe through MCP; Open DS does not choose and does not calculate.

**Work-index card recap (same style as the other three):**
"Design system decisions can lose their reason along the way. Open DS keeps each one as a cited choice, so people and AI agents can choose on purpose, check the recipe, and start from a boilerplate that follows it."
**Card title:** AI-driven DS. **Link text:** Read the case. (No year, role or tag label lines. No counts.)

| # | Section | One-line intent | Needs |
|---|---|---|---|
| 1 | **The problem** | Say with care that design system choices are often made by habit and the reason gets lost, and that AI agents have no list of decisions to work from. *(Hypothesis from the Researcher's brief; no numbers.)* | One calm visual: a choice with its reason missing, then present. |
| 2 | **The idea** | Make the decision the unit: a few options, a source for each, and a check on the recipe. People or agents choose; Open DS keeps the sources and checks the picks. | The dictionary page for one scope. |
| 3 | **How it works** | Show the loop: browse a scope, pick options, read the sources, read the check findings (gaps and conflicts). Explain AI plainly: the agent lists scopes, reads decisions and checks the recipe through MCP. | The picker embed (OD-39) with a check finding. A two-line agent exchange. |
| 4 | **The recipe and its boilerplate: 3dyonic's own system** | Write the 3dyonic design system as the first recipe, then show the boilerplate that follows it and how each file traces back to a decision and its source. | The recipe page and the boilerplate file tree. The README's list of decisions with their reasons and sources, and the AGENTS.md rules (OD-40, OD-56). No numbers unless they are real results. |
| 5 | **What's next** | The path in plain words: more scopes, more cited options, more boilerplates, open to contributions. No dates, no promises beyond the MVP. | Links to the repo and the picker. |

The case is about the idea and what it does for people, not about what built it.

---

## 6. Visuals brief for the Product Designer

Figma folder: https://www.figma.com/files/folder/680290428 (OD-50 foundations, OD-51 picker flow, OD-52 showcase page).

### Changes from v3 (what to drop and what to add)
- **Drop:** the live color ramp everywhere (hero, picker, showcase), the "ramp swatch row with step labels" component, the "ramp moves in under 200 ms" rule, the ramp-of-swatches illustration, and the stepped-squares logo idea.
- **Add to the hero:** a recipe check card that shows one **gap** and one **conflict** with their sources, and a **boilerplate file tree** (tokens.css, Tailwind preset, components, README.md, AGENTS.md).
- **Add components:** source line (citation chip), recipe summary list, check finding item with gap and conflict states, boilerplate file-tree item.
- **Keep:** cobalt accent, Plex type, paper / ink / line, 6px radius, accessibility rules, mood.
- **Do not show** any generated output, token values being calculated, color scales moving, or "export" buttons. Open DS records decisions and checks; it does not calculate.

**Mood:** calm, careful, a little playful. A well-made workbench with paper, ink and one bold color. Like a good reference book that lets you make a plan. Not a SaaS gradient, not a tech glow. Room to breathe, clear steps.

**Lead with sources, checks and the boilerplate.** The first thing a visitor sees should be a decision with visible sources and a check finding.

**Relation to Open UX (family resemblance, not twins):**
- Same bones: IBM Plex Sans for text, IBM Plex Mono for code and file names, paper / ink / line neutrals, 6px radius, thin lines instead of shadows, the rounded-square app icon.
- Different accent so the two are told apart at a glance. Open UX uses orange `#FF4B00` with tint `#FFECE0`. Open DS gets a **cobalt blue** echoing the 3dyonic palette (navy, cobalt, mustard, coral, mint). Suggested start `#2B4BF2` (contrast 6.2:1 on white). Take the exact cobalt from the 3dyonic DS Figma file (https://www.figma.com/design/Xisxr9C0uN1rYAGGlNGpdW) and check AA before locking it. Orange stays for "Open UX" mentions.
- A pale cobalt tint for highlights (about `#E8ECFF`; verify contrast with ink text).

**Logo direction:**
- **Wordmark:** "Open DS" in Plex Sans semibold, same weight and size as the Open UX wordmark, so the two sit side by side.
- **Icon:** the same rounded square as Open UX, in cobalt. Inside, a **recipe checklist**: three short rows, each a small square at the left and a line to the right. The first two squares are filled (picked), the third is an empty outline (still open). It reads as "choices made on purpose, one still to make". Open UX's icon is three bars plus one tinted square at the bottom right; this one puts the squares at the left of each row so the two stay distinct.
- One-color version legible at 16 px (favicon). No gradient, no 3D, no robot or sparkle.

**Color and type (starting values):**
- Paper, ink and line neutrals from the Open UX tokens; accent cobalt; accent tint pale cobalt.
- Check findings: mustard for a gap, coral for a conflict, mint for "no findings". Never rely on color alone: always an icon and text.
- Type: Plex Sans 16 px body, line height 1.5; headings Plex Sans semibold; Plex Mono for file names, code and source references. Sentence case.
- Radius 6px on cards, buttons, chips. Focus ring in accent, 2px, always visible. Touch targets 44 px or more at 375 px.

**Key illustrations (two or three; flat, one accent, thin lines):**
1. **A decision card with options, each with a small source line.** One option selected. The signature graphic for "cited choices".
2. **A recipe checklist with findings:** rows of decisions, one gap (mustard) and one conflict (coral), each with a plain sentence and a source line.
3. **A boilerplate file tree:** a folder with tokens.css, a Tailwind preset, a components folder, README.md and AGENTS.md. Mono file names, thin lines.
4. Optional: a plug between a card and a speech bubble with a cursor for the MCP section. No faces, no robots.

**What the hero should show:**
- Left: headline, subhead, two buttons, and the text link "See the 3dyonic boilerplate".
- Right, a three-part stack that reads top to bottom: (1) **one decision card** ("How should your colors step?") with two or three options, each with its source line, one selected; (2) a **recipe check** under it with one gap and one conflict, each with a source line; (3) a small **file tree** of the boilerplate. No color ramp, no swatches.
- Works at 375 px (text first, then the stack) and 1280 px, keyboard usable. Real UI, not a fake screenshot. No stock photos, no abstract blobs.
- Show nothing the MVP can't do. The check is for completeness and conflicts only.

**Components to design (OD-50):** decision (scheme) card, option radio or segmented control, source line (citation chip), recipe summary list, check finding item (gap and conflict states, with source), boilerplate file-tree item, copy-recipe button, share-link button. Each with default, hover, focus and disabled states.

---

## 7. Name check: "Open DS"

Checked on 2026-10-29 (Asia/Jerusalem) from public pages, GitHub and npm APIs, and registry RDAP. Not a legal trademark search.

### What exists
| Finding | Why it matters | Link |
|---|---|---|
| **"OpenDS" / "Open Design System" by `open-design-systems` (GitHub org, Brazil, created 2024-07).** "An open standard to seamlessly creation of design systems across platforms", with Android and iOS plugins that read design system tokens, a theme generator, an "OpenDS" logo and the contact `oss@opends.studio`. Small (about 8 stars on the main repo). | **Closest collision.** Same field (design systems, tokens) and the same short name. A search for "OpenDS design system" shows them first. | https://github.com/open-design-systems · https://github.com/open-design-systems/OpenDSAndroid |
| **opends.dev: "OpenDS - UI Components Owner's Manual".** A UI component library site (components, tokens, MIT), domain registered 2025-12-17. | A second live "OpenDS" design system on the most natural domain. | https://opends.dev |
| **OpenDS, the Sun/Oracle LDAP directory server** (launched 2005; successor OpenDJ is still released, 5.2.0 on 2026-10-21). Old site opends.org. | Not our field, but it owns the exact search term "OpenDS" in general search. | https://www.oracle.com/technical-resources/articles/opends.html · https://github.com/OpenIdentityPlatform/OpenDJ |
| Other "openDS" projects: DiSSCo openDS (digital specimens), OpenDS4All (LF AI & Data), OpenDSA, OpenDSS. | Different fields; they add noise to search. | https://github.com/DiSSCo/openDS · https://github.com/odpi/OpenDS4All |
| GitHub organizations `open-ds` (4 public repos) and `opends` (1 repo, last push 2015) exist. | `github.com/open-ds` is not ours. The project stays at `3dyonic/Open-DS`. | https://github.com/open-ds · https://github.com/opends |

### Packages and domains (RDAP and registry APIs; confirm at a registrar before relying on this)
- **npm:** `open-ds`, `opends`, `@open-ds/core` and `@opends/core` returned 404 (not published). The `@open-ds` scope needs checking in npm itself.
- **Taken:** opends.dev, opends.org, opends.com, opends.io, open-ds.com (Framer placeholder), open-ds.io.
- **Appear unregistered:** **open-ds.dev**, open-ds.org, open-ds.app, opends.app. (RDAP returned "not found"; a registrar search will confirm.)
- Registering a domain is Yonatan's call. Nothing was bought.

### Assessment and recommendation
- **Risk: medium for search and confusion, low for legal risk of a spaced, hyphenated name used for a free open-source tool.** The name is generic, and two other design-system projects already use "OpenDS". Anyone who searches "OpenDS" may land on them.
- **Recommendation:** keep **Open DS** for tomorrow's MVP preview (nothing is public yet), always written with the space and always paired with the descriptor "cited dictionary of design system decisions". Use `open-ds.dev` (appears free) and never `opends.*`. **Before the public launch, decide again:** if Yonatan wants to stand clear of the existing "OpenDS" projects, rename before publishing the npm package and the domain. A rename costs most after launch.
- **Fallback names (same "Open X" family, checked only for npm and basic GitHub name use):**
  1. **Open Decisions**: says the unit of the product. npm `open-decisions` and `opendecisions` are free. GitHub users with those names exist, so use an org like `open-decisions-dev` or keep `3dyonic/`.
  2. **Open Foundations**: fits color, type, space and radius as "foundations". npm `open-foundations` is free.
  3. **Open Scheme**: matches the "scheme" word. npm `open-scheme` is free, but "scheme" also names a programming language, so it is the weakest.
  Run a fuller check (domains, trademark search) before choosing any fallback.

---

## 8. Neighbor note: FlashDSM (for the team only, never in public copy)

Source: the Researcher's `/workspace/open-ds/flashdsm-neighbor.md` and `decision-matrix.md` (fetched 2026-10-29). Public pages and site code only; no account, nothing generated. Re-check before quoting anything outside the team.

**What it is:** a hosted AI generator. You give it a prompt, a URL, a Figma file, a screenshot, GitHub or Storybook. It picks the values (color scales, type pair, spacing, radius, motion) and writes 8 to 14 components. You edit the result. Exports: CSS, Tailwind, Tokens Studio JSON, SCSS, Figma variables, Cursor rules, GitHub pull request. It serves agents through kit.md and an MCP server (`get_kit`, `check_violations`, `propose_token`). Free first system, then paid seats (Pro, Team, Studio). No public source found for the web app, so "closed" is consistent but **unverified**. Never say it in public.

**Where we overlap (so these are not our difference):**
- Speed. They promise a system fast; so do we.
- MCP and agent access. They already ship it, with a lint for hardcoded values.
- Files a team can use (tokens, CSS, a Tailwind setup, components).
- They publish explanatory pages, so "we explain" alone is not new.

**Where our angle differs: the open "why" layer.** Say it by showing it, never by comparing.
- **Choice, not generation.** Open DS lists each decision with its options. The person picks. No model picks values for them.
- **Cited options.** Every option shows its source. They give a one-line usage text per token and argue for practices in articles. They don't list the options, the option not chosen, or a source for a value.
- **Open.** Packs are plain files in git. Anyone can read and fix an answer.
- **Reasons that travel.** The team's own reason for each pick goes into the README, and a matching rule into AGENTS.md. The validator errors when a rule has no decision behind it.
- **We don't calculate.** Open DS records decisions and methods; people or the build make each boilerplate's tokens, components and layout, and the decision parts of its README and AGENTS.md come from the same recipe.

**Fit:** complementary on the decision layer, competing on the outcome. A person can decide first with Open DS and then take the result into any editor or generator. Do not promise an integration. Whether they import a DTCG file is unverified.

**Public copy rules for this neighbor:** never name it, never say "unlike", never call anything "closed", "black box", "guessing" or "AI decides for you". Do not lead with speed or MCP. Lead with sources, the reasons and the check. If someone asks in a call or in the README FAQ, say: "Open DS is for people who want to choose each decision and keep its source."

**Risks to watch (team only):**
- Their pages are polished and fast, and the start is free. Our MVP has one boilerplate and a starter set of scopes. Do not claim more. Starting must be at least as easy.
- They could add option lists and citations. Our lasting edge is openness, citations and the team's own reasons.
- Their home-page quotes are unattributed. Don't copy that framing, and don't use them as proof.
- Their tier lists differ between pages. Don't quote prices in public.

---

## 9. Reasoning voice (guide)

Standalone copy: `/workspace/open-ds/reasoning-voice.md`. Keep the two in step.

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

### 9.1 Option texts

Every option has four parts. Together they answer: why would I choose this, when does it fit, what does it cost, and who says so.

| Field | Answers | Voice | Length limit |
|---|---|---|---|
| `why` | What is this option, and what does it give you? | Plain statement of the benefit. Second person where it helps ("you get…"). | 1 or 2 sentences. Up to 35 words in all. |
| `when_to_choose` | In which situation does it fit? | Starts with "Choose this if you…" or "Choose this when…". Names a real situation. | 1 sentence. Up to 25 words. |
| `trade_offs` | What does it cost or leave out? | Honest and specific. At least one real cost per option. Items split by semicolons. | 1 to 3 items. Up to 15 words each. |
| `sources` | Who says so? | Real sources only. Title and link. At least one. | 1 to 3 sources. |

#### Rules
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
11. **One line per cell, no pipe characters.** The build reads these as table cells (see the file format in section 9.7).
12. **Say what we don't know.** If the evidence is thin, write "Evidence is limited" in `trade_offs`, and keep the source.

#### Do and don't
| Don't | Do |
|---|---|
| "OKLCH is the modern, best way to build color." | "OKLCH is a color space where equal steps in lightness look about equal to the eye. You get scales that feel even." |
| "Choose this for any serious product." | "Choose this if your palette has to look even across hues and you can use CSS Color 4 values." |
| Trade-offs: "None." | "Some older tools can't read `oklch()` yet; Some colors you pick are outside the screen's range and need a fallback." |
| "Easily the fastest option." | "You write fewer rules, because one value feeds every step." |
| "Experts agree HSL is outdated." | "HSL lightness doesn't match what the eye sees, so equal steps can look uneven. It is simple and well known." |
| Source: "common knowledge" | Source: "CSS Color Module Level 4, W3C Candidate Recommendation (w3.org/TR/css-color-4/)" |

#### Example: one option from the color pack (illustrative)
*Scheme: which color space the swatches are built in. Option: OKLCH.*
- **why:** OKLCH is a color space built so equal lightness steps look about equal to the eye. You get scales that feel even from hue to hue.
- **when_to_choose:** Choose this if you want even-looking scales and your tools can read `oklch()` values.
- **trade_offs:** Some older tools can't read `oklch()`; Some colors you pick fall outside the screen's range and need a fallback.
- **sources:** CSS Color Module Level 4 (w3.org/TR/css-color-4/); Björn Ottosson, "A perceptual color space for image processing" (bottosson.github.io/posts/oklab/)

#### Example: one option from the purpose pack (illustrative)
*Question: which accessibility level must the product meet? Option: WCAG 2.2 level AA.*
- **why:** Level AA is a common target that many accessibility rules refer to. You get clear targets, such as 4.5:1 contrast for body text.
- **when_to_choose:** Choose this if you ship to the public, or you want a target that many teams and rules share.
- **trade_offs:** Contrast targets limit very light brand colors; Level AA doesn't cover every need, so user testing still matters.
- **sources:** Web Content Accessibility Guidelines (WCAG) 2.2 (w3.org/TR/WCAG22/)

*(Both examples keep each field under its limit. Facts and links must be checked against the pack before shipping.)*

---

### 9.2 Asking "why?" for each pick

After each pick, the builder asks one short question. The answer is the team's own reason. It goes into the README in the team's words.

#### Principles
1. **Ask once, ask lightly.** One question per pick. The answer is optional. Skipping is fine.
2. **Ask about the person, not the option.** "What made this fit for you?" and not "Why did you choose this?" (which sounds like a test).
3. **Show, don't judge.** The builder never says a pick is wrong, risky or unusual. It may show the option's cost, as information, once.
4. **Keep the person's words.** Store and reflect back what they wrote. Trim only for length, never rewrite, never fix their grammar, never add a reason they didn't give.
5. **Never write the reason for them.** Not the builder, not an AI agent. An agent may offer a clearly labeled draft ("Draft, edit me"), and the draft is only stored once the person accepts it.
6. **Same voice for people and agents.** An agent asks the same question in the same words and waits for the person's answer.

#### Prompt wording
- **Main prompt (up to 12 words):** "You picked {option_label}. What made it fit for you?"
- **Placeholder in the box (one example, plain):** "For example: our users read long text on small screens."
- **If the pick is the default:** "This is the starting point. Want to say why it fits?"
- **If the pick was recommended by an earlier answer:** "Your earlier pick pointed here. Does it fit you? A line on why helps."
- **Skip button:** "Skip for now". **Confirm button:** "Save my reason".
- **After skipping:** "No reason yet. You can add one later." The README then says "Reason not written yet." It never fills the gap.

#### Reflect the answer back
Reflect in one or two lines. Start with the pick, then the person's words, then what happens next. The person's words stay in quotes or in a clearly separate line.

> **Got it: OKLCH, because "our palette has to feel even across hues."**
> This goes in your README, in your words.

If the person's words show a trade-off they may want to know about, show it once. The tone is "worth knowing", never "warning":

> **Worth knowing:** some older tools can't read `oklch()` yet. You can keep this pick. The README will list it as a trade-off you accept.

If two picks pull in different directions, name it kindly and show both sources:

> **Two picks pull in different directions.** "Compact density" and "large base unit" don't fit together easily (see the density source). You can change either, or keep both and say why.

#### Do and don't
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

#### Limits
- Prompt: up to 12 words. Reflect: up to 2 lines. Placeholder: up to 15 words.
- Stored reason: **280 characters at most** (Architect, 2026-10-29). Write the prompt and placeholder so a short answer fits.
- Findings (gap or conflict) follow the same kindness rules: say what is missing or what pulls apart, show the source, offer the next step. Never "error: you chose wrong".

---

### 9.3 Boilerplate README.md (for people)

The README states what the design system serves and why, then lists every decision with the team's reason. Its decision sections (what the design system serves, and the decisions) are generated from the recipe and manifest, the same source as `AGENTS.md`, so the two never disagree. The other sections, such as how to use it and the file list, are written by people or the build. (Architect, 2026-10-29.) OD-56 asks for the section "What this design system serves" first, and for a rationale on every decision.

#### Voice
- Speaks to the reader as "you". Speaks for the team as "we" only inside the team's own reasons, in their words.
- Plain words, short sentences, no hype. Source for each decision. The trade-off the team accepted is stated.
- **No rationale is ever invented.** If the team wrote none, the line says "Reason not written yet."
- States the recipe fingerprint and pack release, so a reader can check the README against the recipe.
- No claims such as "complete", "accessible by default", "best practice". Say what the team picked and what they checked.

#### Template
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

#### Example: 3dyonic recipe (illustrative)
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

#### Do and don't
| Don't | Do |
|---|---|
| "A complete, accessible-by-default design system." | "A starting kit that follows WCAG 2.2 level AA. Run your own checks too." |
| Filling a missing reason: "We chose it for scalability." | "Reason not written yet." |
| Rewriting the team's reason in marketing words. | Quote it, trimmed only for length. |
| Listing a decision without its source. | "Source: CSS Color Module Level 4, w3.org/TR/css-color-4/" |
| Hiding the cost. | "What it costs: some older tools can't read `oklch()`." |
| Long paragraphs per decision. | Five short lines, same order every time. |

---

### 9.4 Boilerplate AGENTS.md (for AI tools)

`AGENTS.md` carries the same decisions as short rules, plus the recipe fingerprint. Its decision sections are generated from the same recipe and manifest as the README, so each rule traces to a decision the README explains. (Architect, 2026-10-29.)

#### Rule voice
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

#### Template
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

#### Example: 3dyonic recipe (illustrative)
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

#### Do and don't
| Don't | Do |
|---|---|
| "You should try to use design tokens where appropriate." | "Use CSS variables from `tokens.css` for every color." |
| A paragraph on why OKLCH is better. | "Define colors as `oklch()` values, with a fallback." (The why is in README.md.) |
| "Always make it accessible." | "Keep body text at 4.5:1 contrast or more." |
| A rule with no decision behind it. | "Use the base unit for all spacing. [{scheme_id}]" |
| "Feel free to adjust the palette." | "Do not add a color the recipe doesn't list." |
| Rule text that differs from the README. | Same decision, same words for names and values. |

#### Keeping README.md and AGENTS.md in step
- Both come from the same recipe and the same pack release. The fingerprint is printed in both.
- Every AGENTS.md rule names a decision that the README lists. **The validator errors when an AGENTS.md rule's decision id is not in the README or the manifest.** (Architect, 2026-10-29; tracked in OD-37.) So write each rule with its id. A rule with no id breaks the check.
- If the recipe changes, both files change together.

---

### 9.5 Where the voice shows up (summary)
| Place | Voice | Who writes it |
|---|---|---|
| Option text in a pack | Explains why, when, cost, source. Second person. Plain. | Content Writer and Researcher, from sources. |
| The "why?" prompt | One light question. Keeps the person's words. Never judges. | Content Writer (prompt), the person (answer). |
| Finding text (gap, conflict) | Says what is missing or what pulls apart. Shows the source. Offers a next step. | Content Writer (templates), validator (data). |
| README.md | "You" for the reader, "we" inside the team's words. Every decision has a source and a cost. | Decision sections generated from the recipe and manifest. Other sections by people or the build. The reasons are the team's, up to 280 characters each. |
| AGENTS.md | Imperative rules. No stories. Traced to decisions. | Decision sections generated from the recipe and manifest. |

---

### 9.6 Words
**Use:** why, fit, pick, choose, cost, trade-off, source, "worth knowing", "reason not written yet", "starting point".
**Avoid:** best, right way, wrong, mistake, risky, unusual, obviously, simply, just, easy, powerful, modern, future-proof, "best practice", "industry standard", "accessible by default", "complete", "AI-powered", "generate".

---

### 9.7 Pack copy file format (proposed, for `pack-copy.md`)

**Status:** the packs are being built on branch `feat/OD-mvp` and are not on `master` yet, so no `pack-copy.md` rows exist. Rows wait for the real ids. This is the format the table will use once the pack's real scheme ids and option ids exist.

- **One table per pack**, under a heading `## Pack: {pack_id}`. The Markdown header row is exactly:
  `| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |`
- **One row per option.** Key = `pack` + `scheme_id` + `option_id`. The key must be unique and must match the pack data exactly. A row with an unknown key is a build error. An option with no row is a build warning.
- **No pipe characters inside cells.** Use a comma, a semicolon or the word "or". No line breaks inside a cell. No HTML.
- **`trade_offs`:** items separated by `; ` (semicolon and space). **`sources`:** items separated by `; `. Each source is `Title (url)`, with a real URL, and the same wording as in the pack data when it has one.
- **Limits** are in section 9.1. A lint step can check them: `why` up to 35 words; `when_to_choose` up to 25 words and starting with "Choose this if" or "Choose this when"; `trade_offs` 1 to 3 items of up to 15 words; `sources` 1 to 3 items.
- **Encoding:** UTF-8. Straight quotes. Code in backticks is allowed (no pipes inside).
- **Never invent ids or sources.** The Content Writer fills `why`, `when_to_choose`, `trade_offs` only for options that exist in the pack, and cites only sources already in the pack data or verified references.

---

### 9.8 Purpose effect badges

**Context.** Purpose is the first step of every recipe, and it is Scoped. **Global decisions are asked once, right after Purpose, and carried into every scope.** On the later questions, an option can show an effect that comes from the person's Purpose answers. The effect is a hint with a reason. It never decides for the person.

#### Labels
| Effect (in the pack) | Label the person sees | Meaning |
|---|---|---|
| `recommends` | **Fits your purpose** | Your Purpose answer points toward this option. |
| `discourages` | **Worth a second look** | Your Purpose answer pulls the other way. You can still pick it. |
| `requires` | **Your purpose needs this** | A rule from your Purpose answer needs this option. |

#### Tooltip
Pattern: **Because you chose [purpose answer]: [one-line reason].**
- Name the Purpose answer the person picked, in its plain label.
- The reason is one line, at most 280 characters (the same limit as a stored reason), and ideally one short sentence of up to 20 words.
- The reason states what happens or what the rule says. It cites the purpose answer, and the option's own source covers the facts. No hype, no pressure, no "you should".
- If two Purpose answers apply, show one tooltip line for each, each in the same pattern.
- For agents, the MCP result carries the same label and tooltip text, so people and agents read the same words.

#### Rules
1. **Never say "discouraged" or "not recommended" to people.** Say "Worth a second look". Do not use "avoid", "bad", "wrong", "risky" or "unsafe" either. Those words stay out of the badge, the tooltip and the findings.
2. **Options never win by tone.** A badge is a hint with a reason. It does not rank. Do not reorder options by badge. Do not make one option larger, bolder or warmer. An option with no badge is not worse; it has no effect from this purpose.
3. **Same shape for all three badges.** They differ by their words and a small icon, not by an alarm color. Never rely on color alone.
4. **Always give the reason.** A badge with no tooltip is not allowed. If the pack has no reason for an effect, the badge does not show.
5. **The badge blocks nothing. A missing required option does.** "Fits your purpose" and "Worth a second look" never block a pick, and the "Your purpose needs this" badge itself blocks nothing. If the person leaves out an option that their Purpose answer requires, `check` reports an `error` and the recipe can't finish. The step shows this as a blocking state with a way to fix it (see "Blocking state" below). The blocking copy stays kind and plain: it says what is missing and how to add it, and it never blames.
6. **Say it once.** Show the badge in the option list and in the recipe summary. Don't repeat it in a banner.
7. **Internal words stay internal.** `recommends`, `discourages` and `requires` are pack words. People see only the labels.

#### Blocking state: a required option is missing
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

#### Importable mapping (for the build)
Format: one Markdown table, header row exactly as below, one row per effect, no pipe characters inside cells. `[purpose answer]` and `[one-line reason]` are placeholders the build fills in.

| effect | label | tooltip_pattern |
|---|---|---|
| recommends | Fits your purpose | Because you chose [purpose answer]: [one-line reason]. |
| discourages | Worth a second look | Because you chose [purpose answer]: [one-line reason]. |
| requires | Your purpose needs this | Because you chose [purpose answer]: [one-line reason]. |

#### Examples (illustrative; effects follow the examples in OD-60)
| Purpose answer | Option | Badge | Tooltip |
|---|---|---|---|
| WCAG 2.2 level AA | Text contrast of 4.5:1 or more | Your purpose needs this | Because you chose WCAG 2.2 level AA: body text needs a contrast of 4.5:1 or more. |
| Compact density | A large base spacing unit | Worth a second look | Because you chose compact density: a large base unit leaves less room on each screen. |
| White-label for many brands | A separate theme layer | Fits your purpose | Because you chose white-label for many brands: a separate theme layer lets each brand change its own look. |

#### Do and don't
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

#### Microcopy for global decisions
- Heading before the global questions: "A few choices apply to every scope. We ask them once."
- After answering: "Saved. Every scope uses this."
- On a scope page, next to a global answer: "From your global choices." with a link to change it.

#### Effect fields in the build
Each effect in a pack carries a `reason` field next to its target scheme id and option id. The reason is one line, up to 280 characters. The Architect has added it to the build. A badge shows only when its effect has a reason (rule 4).

---

## Open questions
1. **[DECISION: Yonatan, in the morning]** The tagline stays a proposal. Tagline pick ("Choose your design system on purpose." or the earlier "Design system decisions, cited and checked."), the name (keep Open DS or fallback), and the domain (`open-ds.dev`?).
2. **[DECISION: Yonatan]** License line (the repo holds an MIT placeholder, OD-48) and any "free" wording.
3. **Before launch:** the MCP install line `uvx open-ds-mcp` stays marked TBD until the name is final. Keep the "per pack release" qualifier wherever "same picks, same result" appears.
4. **Before launch:** collect the citation source for every option shown in the hero and the check findings.
