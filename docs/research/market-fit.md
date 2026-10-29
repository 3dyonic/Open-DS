# Open DS: market fit and positioning (lean brief)

Author: Grok Bot (research). Date: 2026-10-29 (Asia/Jerusalem). For: Content Writer (naming, tone, copy), Product Owner, Architect.
Jira: OD-42 (analogues), OD-43 (users), OD-44 (value proposition). Orchestra project: `open-ds`.

## 0. What this is based on (and what it is not)

- Repo https://github.com/3dyonic/Open-DS held only a README title ("# Open-DS", commit 6c10a78) when I read it on 2026-10-29. There are no docs to cite yet. I used the Orchestra `open-ds` project records (scope, ADR-001 draft, decisions) and the Jira OD tickets as the description of the product.
- No user interviews were done. Segments below are hypotheses from the product shape and public sources. No numbers about demand, adoption or market size are used, because none were measured.
- Competitor facts come from the pages linked in section 3, read on 2026-10-29. A "none found" statement means a short search found none. It is not proof.

## 1. The product in plain words

Open DS is a dictionary of design system decisions. Each decision (color space, scale length, contrast target, radius ramp and so on) is a "scheme" with several cited answers. Some answers are global (same everywhere). Some are scoped (one answer for one scope, such as color or type). A person or an AI agent picks one answer per scheme. The picks form a recipe. The recipe builds W3C DTCG tokens and runs checks on them. It ships as packs (content), an MCP server (agent tools: list_schemes, get_questions, check_picks, build_tokens) and a website picker. Open source. First recipe: the 3dyonic design system, shown on 3dyonic.com as an AI-driven DS. Sister project: Open UX (https://github.com/3dyonic/open-ux, MIT), the same model for UX guidelines.

The MVP covers: Color primitives (full) plus starter type, space and radius packs. Anything beyond that is not in the MVP and must not be claimed.

## 2. Who it is for

Primary for the MVP (my pick, hypothesis): **the design system lead or design-engineer who is setting or resetting foundations and has to defend each choice.** Reason: they feel the pain of undocumented decisions most, they can judge citations and checks, and the 3dyonic showcase is exactly this job done by a DS expert. The AI-agent builder is the second segment and the best channel, because agents cannot see the decision dictionary anywhere else.

| Segment | Job (When..., I want..., so I can...) | What they do today | Pain Open DS removes |
|---|---|---|---|
| DS leads | When I start or rebase a system's foundations, I want each decision shown with options and sources, so I can pick and defend it. | Copy a known palette or preset, read blog posts, argue in Figma and meetings, write the "why" in docs after the fact (or never). | Decisions are made by habit and lose their reason. No single place pairs a decision with its options, sources and a check. |
| Front-end teams | When I need tokens that pass accessibility checks, I want a recipe I can build and re-run, so I can ship without a design review for every value. | Start from a UI kit or shadcn theme, hand-edit CSS variables, check contrast one pair at a time. | Tokens drift from intent. Checks are separate from the choice. Changing one decision means redoing the others by hand. |
| Agencies | When I start a client system, I want a repeatable starting recipe with a record of the picks, so I can show the client why and reuse the method. | Rebuild a base kit per client; keep decisions in decks. | Every project re-decides the same things. The rationale is hard to hand over. (Needs more packs than the MVP has. Treat as later.) |
| AI-agent builders | When my agent must create or change a design system, I want rules and a checker it can call, so I can stop it from inventing values. | Prompt with a style description; the agent guesses colors and scales. Or read existing tokens through an MCP. | Agents have no source for "which option and why" and no check before output. Existing MCPs read tokens that already exist (section 3). |

## 3. Alternatives: what each does, the gap

All URLs read 2026-10-29.

| Tool | What it does | Gap Open DS fills | Source |
|---|---|---|---|
| Radix Colors (MIT) | Fixed 12-step color scales, each step with a named use (app background, borders, solid fill, text). Text steps are designed for APCA contrast targets (Lc 60 and Lc 90) on a step 2 background. | Gives one answer, not the options or why. It does not cover type, space or radius. Not a recipe or a build. | https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale ; license: https://github.com/radix-ui/colors |
| Material color utilities and HCT (Apache-2.0) | Color science library. HCT (hue, chroma, tone) makes contrast a tone difference. Builds tonal palettes and schemes from a source color. Used by Material Theme Builder. | One built-in answer (HCT, Material roles). It shows no alternatives and no citations per decision. Output is not DTCG by default. Reuse idea: HCT as one cited option for the color-space scheme. | https://m3.material.io/blog/science-of-color-design ; https://github.com/material-foundation/material-color-utilities |
| Leonardo (Adobe, Apache-2.0) | Generates color scales and themes from target contrast ratios. Choice of color spaces. Dark mode, color-blind-safe sets. Outputs CSS custom properties and W3C-spec design tokens. | A good generator for color, with knobs but no decision dictionary, no cited reasons, no type/space/radius, no agent surface found on the site. Reuse idea: contrast-ratio-driven generation as an option. | https://leonardocolor.io/ ; https://github.com/adobe/leonardo |
| Style Dictionary (Apache-2.0) | Build system. Exports DTCG tokens to CSS, iOS, Android and more. | Transforms tokens you already decided. It does not help you decide or check the decision. Open DS output feeds it. | https://styledictionary.com/ ; https://github.com/style-dictionary/style-dictionary |
| Tokens Studio | Figma plugin to manage and sync tokens. Free; some features need a Pro licence. Plugin repo is MIT. Lists DTCG among adopters. A third-party MCP (Blyawon/tokensStudioMCP) reads applied tokens from Figma; Tokens Studio posts on LinkedIn about its own MCP, but I did not find it in its docs. | Manages tokens, does not supply the decisions behind them. Open DS output can be imported. | https://docs.tokens.studio/ ; https://docs.tokens.studio/get-started/install-figma-plugin ; https://github.com/Blyawon/tokensStudioMCP ; https://github.com/tokens-studio/figma-plugin |
| W3C DTCG format | The token file standard. First stable version 2025.10 (Final Community Group Report, 28 Oct 2025). It says it is "not a W3C Standard". | Not a competitor: it is the output format. It defines how to store a token, not which values to choose. Say "DTCG format", never "W3C standard". | https://www.designtokens.org/ ; https://www.designtokens.org/tr/2025.10/format/ |
| shadcn/ui (MIT) | Copy-in components and themes via CSS variables, in OKLCH. shadcn/create previews colors, radius, fonts and icons and builds a preset. Has an MCP server to browse and install components from registries. | Fastest start for a front-end team, but it ships a preset, not a reasoned decision with sources and checks. Its MCP installs components; it does not return decisions or token checks. Open DS sits before it: its output can set the CSS variables. This is the main substitute to beat on speed. | https://ui.shadcn.com/docs/theming ; https://ui.shadcn.com/docs/mcp ; https://github.com/shadcn-ui/ui |
| Other design-system MCPs (not on the brief, but they are the agent alternative) | Supernova, zeroheight, Storybook and Swatchbook let agents read tokens, docs, components; Supernova can also write. zeroheight has a `suggest-tokens` lint tool. Prism (third party, MIT) generates palettes and exports DTCG. | They serve what a team has already decided. None found that serves a cited choice per decision with a check on the picks. | https://www.supernova.io/mcp ; https://help.zeroheight.com/hc/en-us/articles/51478956166939-zeroheight-MCP-tools-reference ; https://storybook.js.org/docs/ai/mcp/overview ; https://unpunnyfuns.github.io/swatchbook/reference/mcp/ ; https://github.com/lnksoul1/prism-ui-design-mcp |

**The gap, one paragraph.** Existing tools give you a finished answer (Radix, HCT, shadcn), a generator with knobs (Leonardo, Prism), or a way to move and serve tokens you already chose (Style Dictionary, Tokens Studio, DTCG, the design-system MCPs). Open DS works on the step before: the decision itself. It lists the options, cites the source for each, records the pick, and checks the result. It then builds standard tokens, so the user keeps Style Dictionary, Tokens Studio and Figma. That is a scheme dictionary and a recipe, not another token generator.

## 4. What makes it different (and how strong each point is)

1. **Cited dictionary of decisions, global and scoped answers.** Strong. No alternative found that treats the decision as the unit. Weak spot: only as good as the citations (see OD-48 license policy).
2. **Picks become a recipe that builds tokens with checks.** Medium. Recipes are shareable and repeatable (frozen pack hashes, same picks give same bytes, per ADR-001 draft). Checks must be real and few, or they become a claim we cannot back.
3. **Open source.** Table stakes in this space (most alternatives above are MIT or Apache-2.0). Do not lead with it.
4. **MCP for AI agents.** Strong only in the form "decisions and checks", not "tokens for agents". Reading tokens by MCP is already common (Supernova, zeroheight, Swatchbook). The MCP "gives rules and a checker; the agent chooses" (Orchestra decision f8a26ad3).
5. **Showcased on 3dyonic.com as an AI-driven DS.** Proof by use: one real recipe, built and checked, with the decisions visible. Weak as a market claim until a second user exists. Say "built this way" not "trusted by".

## 5. Risks, and what would prove the positioning wrong

| Risk | Why it matters | What to do |
|---|---|---|
| The MVP shows color first, the most crowded corner (Radix, Leonardo, HCT). | A visitor may compare ramp quality and say "just another palette tool". | Lead the demo with citations, the pick record and findings, not the ramp. |
| shadcn and presets win on speed. | A front-end team that wants a theme in a minute will not answer questions. | Offer a fast default recipe; show the "why" as optional depth. |
| Agent MCPs for tokens are well served. | If we sound like "tokens for agents", we are late. | Position as the decision and check layer. Keep the 4-tool story. |
| Few checks, thin packs. | Only color is full. Claiming a full system will be caught. | State scope on the page: "Color full, starter type, space, radius". |
| DTCG output compatibility. | The 2025.10 spec uses a color object (`colorSpace`, `components`). Older tools may not read it. | Test the output in Style Dictionary and Tokens Studio before saying "works with". |
| Citation quality and licence. | A cited dictionary with a wrong or copied source loses trust at once. | Follow OD-48. Cite URLs, quote little, show the date read. |
| Name is generic ("Open DS"). | Hard to search; may clash with other projects. Not checked. | Content Writer to check name collisions with naming. |
| Opinion creep. | Calling picks "best practice" invites dispute. | Word as "options with sources", and let each check show its source. |

**What would falsify the positioning** (decide thresholds before testing; keep it small, for example a handful of people per segment):
- Given a blank brief, DS leads and front-end people skip the questions and only want the exported tokens. Then decisions are not the product, tokens are.
- Agents call `build_tokens` but not `get_questions` or `check_picks`, or users override picks without reading the source. Then the dictionary and checks are not valued.
- The first reaction is "this is Radix or shadcn with extra steps". Then the difference is not visible in the demo.
- A strong existing MCP (Supernova, zeroheight, Storybook) adds cited choices and picks checks. Then the gap closes.
- The DTCG output fails in Style Dictionary or Tokens Studio. Then "keep your tools" is false.

## 6. Value proposition

**One line (use this):**
> Open DS turns design system decisions into cited choices: pick your answers, get tokens that pass their checks, by hand or through your AI agent.

**Backups (short):**
1. Choose your design system's foundations from cited options, and build checked tokens.
2. A cited dictionary of design system decisions that people and AI agents can pick from.

**Why this, why now (3 lines, for OD-44):**
- Teams still choose colors, scales and radii by habit, and the reason is lost.
- The token format is now stable (DTCG 2025.10), so decisions can become portable tokens.
- AI agents now build UI and need rules and a checker, not only a token list.

**Three proof points the MVP can show:** (1) a live color ramp that changes when a pick changes; (2) check findings with a cited source; (3) the 3dyonic recipe, built from picks and diffable against the real tokens.

**Claims we must not make:** a complete or "full" design system; coverage of all 14 categories; "W3C standard"; "accessible by default" (say "checked against the listed rules"); user, adoption or time-saved numbers; "works with Figma, Style Dictionary, Tokens Studio" before tested; "trusted by"; "best practice".

## 7. Hand-off to Content Writer

- Plain words: "decision", "options", "source", "pick", "recipe", "check". Avoid "revolutionary", "next-gen", "supercharge".
- Tone: like Open UX, short, cited, no vibes. Every claim has something on screen that shows it.
- Name and tone are yours. Keep the line "cited dictionary of design system decisions" findable in the page text.
- For the 3dyonic case study (OD-49): the story is "one recipe, built from cited picks, checked, then shown".
