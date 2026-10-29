# Open DS: sources applied to pack-copy.md

Written Thu Oct 29, 2026 (Asia/Jerusalem). Input: `/workspace/open-ds-research/pack-sources.md` (Researcher, OD-69). Output: `pack-copy.md` here. Backup of the earlier file: `pack-copy.pre-sources.bak`. Nothing pushed or posted.

## Counts

| Status | Rows |
|---|---|
| applied (source swapped, tag removed) | 8 |
| reworded (new wording adopted, tag removed) | 7 |
| still-limited (tag kept) | 1 |
| Total | 16 |

Still marked "Evidence is limited": **radius / radius-progression / geometric**.

## How I checked

I opened the sources again before using them. Checked directly: Tailwind border-radius, Tailwind colors, Tailwind v2 colors, Material Web shape tokens (raw SCSS), Material density blog, Material color system page, MDN hsl(), Bootstrap 5.3 color, Carbon data table guidelines, Shopify checkout UX, Shopify Help checkout style, Apple HIG (JSON feed), Leonardo README, Pico CSS variables, Primer size primitives, shadcn theming.
Not readable without JavaScript: the Material corner radius scale page. I cited the Material Web token file instead, which has the same values (0, 4, 8, 12, 16, 28, full).
Not cited, because I could not open them: Carbon button radius tokens, Polaris border tokens, and the Material 3 line about cards and dense components. Wording that depended on them was dropped.

## The 16 rows

| Row | Status | Reason |
|---|---|---|
| radius / radius-base / radius-4 | applied | 4 px is Tailwind `sm` and Material extra small. New cites: Tailwind border radius, Material Web tokens. Wording unchanged. |
| radius / radius-base / pill | applied | Tailwind `rounded-full` and Material full (9999px). Wording unchanged. |
| radius / radius-progression / none | applied | Pico CSS sets its radius with one variable (0.25rem). Pico overrides it for search fields, so I kept the wording as the option's own rule, not a claim about Pico. |
| purpose / product-type / commerce | applied | Shopify checkout UX and Shopify Help replace the Polaris voice page. They back clear cost, readable text and a brand color. The trade-off now follows Shopify's "keep the design simple". |
| color-primitives / step-count / nine | applied | Bootstrap 5.3 has `$blue-100` to `-900`. Tailwind (50 and 950) shows the ends that are lost. |
| color-primitives / step-count / ten | applied | Tailwind v2 runs 50 to 900. The wording now says "as in Tailwind v2", because current Tailwind adds 950. |
| color-primitives / step-count / custom | applied | Leonardo's README: the step count is the number of ratios you pass. The 5 to 16 limit and "the recipe stores the count" are Open DS behavior and need no outside source. |
| global / scale-direction / high-is-light | applied | Material tone runs 0 (black) to 100 (white). MDN hsl(): `L` 100% is white. The Radix cite is gone, because Radix runs 1 (light background) to 12 (dark text) and does not back it. Tailwind added for the 50-to-900 trade-off. |
| radius / radius-base / sharp | reworded | Now says "radius of 0", backed by Tailwind `rounded-none` and Material none. "Strict, technical look" and "harsh" had no source, so they are gone. Trade-off is now what you give up. |
| radius / radius-base / radius-8 | reworded | Now names Tailwind `lg` and the Material small step (both 8 px). "Still looks like a control" had no source and was cut. Trade-off no longer claims a look. |
| radius / radius-base / radius-12 | reworded | Now names Material medium, Tailwind `xl` and Primer `large` (all 12 px). "Buttons" and "toy-like" were cut, because the Material card and dense-component line could not be opened. |
| radius / radius-progression / linear | reworded | Now says "a fixed amount per step, for example 4, 8, 12, 16". The Material token file starts that way, then jumps to 28, so only Material is cited. "For each larger surface" had no source and was cut. |
| purpose / product-type / dense-data | reworded | Now "compact rows and tight space". Carbon has a 24 px row for highly dense layouts. Material says compact density suits data tables. "Small type" and "compact color steps" were cut. Trade-offs come from the Material density page (alerts hard to notice, 48 px touch targets). |
| purpose / platforms / native | reworded | Now limited to Apple platforms: the San Francisco system font and recommended text sizes (Apple HIG). "Fixed density" was cut. No Android or desktop source was fetched, so the copy does not claim it. |
| color-primitives / on-color-pairing / unrelated-names | reworded | Tailwind's own text names `bg-white` and `text-gray-950` as examples. The trade-off now says what you give up: Material (primary and on primary) and shadcn (`primary` and `primary-foreground`) name the pair. The unsourced "people can pair the wrong color" was cut. |
| radius / radius-progression / geometric | still-limited | The offered reword states shadcn's factors (0.6 to 2.6), which is a factual claim, and those factors rise by 0.2 then 0.4, so the scale is not geometric. Text and cite are unchanged. The old cite (a Tailwind colors page) still does not back it. |

## Things to know

- Design-judgement wording that no source states was left on the 8 applied rows, as the Researcher marked them backed. These are: "without looking round" (radius-4), "the change can be missed at a glance" (radius-4), "large surfaces can turn into circles" (pill), "cards and inputs look identical" (none), "the two ends are not symmetric" (ten), "a custom count is harder to share" (custom), and "it goes against the 50 to 900 habit" (high-is-light; Tailwind and Bootstrap show the habit).
- The pack JSON on `feat/OD-mvp` still has the old sources. The sources in `pack-copy.md` now differ on 15 rows, so the import PR must update the pack source fields too.
- Source names follow `Name: Title (url)`. Two cites are raw GitHub files (Material Web tokens, Leonardo README) because those were the readable versions.
- Limits checked by script on all rows: `why` up to 35 words, `when_to_choose` up to 25 words and starting "Choose this if/when", 1 to 3 trade-offs of up to 15 words, up to 3 sources. No row failed.
