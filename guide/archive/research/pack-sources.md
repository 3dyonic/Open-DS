---
title: "Open DS: sources for the 16 \"Evidence is limited\" rows"
description: "Contributor note from the first preview: Open DS: sources for the 16 \"Evidence is limited\" rows."
---

# Open DS: sources for the 16 "Evidence is limited" rows

Written: Thu Oct 29, 2026 (Asia/Jerusalem). Research only. `pack-copy.md` and `packs/` were not edited.

## Read this first

- `/workspace/open-ds/pack-copy.md` was **not on the box** (the box was reset). I took each claim from the `why` text of the matching option in `packs/*.json` on branch `feat/OD-mvp` (commit 6731de2). Pack-copy.md may word a claim a little differently. The row ids below are `pack file / question / option`.
- Every source below was fetched this session (curl, WebFetch, or the raw GitHub file). Pages that only came back as a search-engine summary, or that failed to fetch, are listed under "Not fetched" and are **not** used as evidence.
- Pack text is ASD-STE100 style, so suggested rewording is short and plain.
- Verdict rules:
  - **backed**: a fetched source states the thing the claim says (a value, a scale, or a rule). Wording about how it "looks" or "feels" is design judgement. Where a row has such a part, it is flagged in the notes.
  - **reword**: part of the claim is sourced, part is not. A reworded claim that the evidence supports is given.
  - **no source**: nothing fetched backs the claim as written. A reworded claim is given.
- The source the pack cites today is wrong or off-topic for all 16 rows (`m3.material.io/styles/color/roles`, `tailwindcss.com/docs/colors`, the Polaris voice-and-tone page, the Radix palette-composition page, the Leonardo home page). Replacement sources are given for each row.

## Verdict counts

| Verdict | Rows |
| --- | --- |
| backed | 8 |
| reword | 7 |
| no source | 1 |
| **Total** | **16** |

backed: radius-4, pill, none, commerce, nine, ten, custom, high-is-light.
reword: sharp, radius-8, radius-12, linear, dense-data, native, unrelated-names.
no source: geometric.

(Unrelated-names: the claim itself is shown by the Tailwind page, but the trade-off has no source. I put it in "reword" because the trade-off text needs to change.)

## Radius (8 rows)

Source set used for all radius rows (all fetched):

- Tailwind border-radius: https://tailwindcss.com/docs/border-radius. Scale: xs 2px, sm 4px, md 6px, lg 8px, xl 12px, 2xl 16px, 3xl 24px, 4xl 32px, none 0, full `calc(infinity * 1px)`.
- Material 3 shape, corner radius scale: https://m3.material.io/styles/shape/corner-radius-scale. "None 0dp, Extra small 4dp, Small 8dp, Medium 12dp, Large 16dp, Large increased 20dp, Extra large 28dp, Extra large increased 32dp, Extra extra large 48dp, Full".
- Material Web tokens (same values, as code): https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss. `corner-none 0px`, `extra-small 4px`, `small 8px`, `medium 12px`, `large 16px`, `extra-large 28px`, `full 9999px`.
- Carbon, button radius tokens (React Storybook): https://react.carbondesignsystem.com/?path=%2Fdocs%2Fcomponents-button--overview. `$border-radius-00 0`, `-02 0.125rem`, `-04 0.25rem`, `-08 0.5rem`, `-16 1rem`, `-24 1.5rem`, `-max 999999px`. "Buttons in v12 default to `$border-radius-max` (fully rounded)."
- Polaris tokens, source file: https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/border.ts. Scale names `0, 050, 100, 150, 200, 300, 400, 500, 750` and `full: 9999px`. The px values (0, 2, 4, 6, 8, 12, 16, 20, 30) come from the Polaris migration table at https://github.com/Shopify/polaris-react/issues/10301 (fetched through search result text; the .ts file maps each name to `size[...]`, and I did not open `size.ts`). Treat the Polaris px values as "good, but one hop removed".
- Primer, size primitives: https://primer.style/foundations/primitives/size. borderRadius small 3px, medium 6px (default), large 12px, full 9999px.
- Pico CSS variables: https://picocss.com/docs/css-variables. `--pico-border-radius: 0.25rem;` (one variable). Exception in the same file: `[type=search], [role=search] { --pico-border-radius: 5rem; }`.
- shadcn/ui theming: https://ui.shadcn.com/docs/theming. `--radius-sm: calc(var(--radius) * 0.6)`, `md 0.8`, `lg 1`, `xl 1.4`, `2xl 1.8`, `3xl 2.2`, `4xl 2.6`. "Changing `--radius` updates the entire radius scale."

| Row id | Claim (pack `why`) | Source URL(s) | What the source says | Verdict | Suggested wording / note |
| --- | --- | --- | --- | --- | --- |
| radius/radius-base/sharp | Square corners keep a strict, technical look. | Carbon button page (above); M3 corner scale (above) | Carbon sets `$border-radius-00` (0) for card, header, data table toolbar, pagination, modal footer and more. M3 lists "None 0dp" as the first step. Neither source says 0 "looks strict" or "technical". | reword | "Square corners use a radius of 0. Carbon uses 0 on cards, headers, and data table toolbars." Trade-off "Controls can feel harsh" has no source. Keep it as the pack's own view or cut it. |
| radius/radius-base/radius-4 | A small radius softens a corner without looking round. | Tailwind border-radius; M3 corner scale; Carbon button page; Polaris border.ts; Pico variables | 4px is the "sm" step in Tailwind, "Extra small 4dp" in Material 3, `$border-radius-04` (0.25rem) in Carbon, `border-radius-100` in Polaris, and Pico's one default (0.25rem). | backed | The value is solid: it is the small step in five systems. "Without looking round" is design judgement. "The change is easy to miss" has no source. |
| radius/radius-base/radius-8 | Eight pixels is a soft corner that still looks like a control. | Tailwind (lg 8px); M3 (Small 8dp); Carbon (`-08` 0.5rem); Polaris (`200`) | 8 is a step in all four. M3 maps buttons to **Full** by default, not to 8. No source says 8 "looks like a control". | reword | "Eight pixels is the Small step in Material 3 and the `lg` step in Tailwind." Cut "still looks like a control". The trade-off "A sharp brand will look too round" has no source. |
| radius/radius-base/radius-12 | A large radius makes cards and buttons look soft. | M3 corner scale; Tailwind (xl 12px); Primer (large 12px); Polaris (`300`) | M3: "Medium 12dp"; the same page says a customized medium style applies to "cards and small FABs". M3 maps buttons to Full by default. M3 also says "Be careful not to apply large or full corners to information-dense components, such as cards". | reword | "Twelve pixels is the Medium step in Material 3, used for cards. Primer calls 12px `large`." Drop "buttons". The M3 caution backs the trade-off: "Large corners on dense cards can look toy-like." |
| radius/radius-base/pill | A pill radius makes short controls fully round. | Tailwind (`rounded-full`); Primer (full 9999px); Polaris (`full: 9999px`); M3 (Full); Carbon (`-max 999999px`; default buttons fully rounded in v12) | Every system has a "full" step. Carbon v12 and M3 use it for buttons. | backed | No change needed. Trade-off "Large cards become circles" is basic CSS behavior; M3 gives the related caution about full corners on dense components. |
| radius/radius-progression/none | One radius keeps every corner the same. | Pico variables | One variable, `--pico-border-radius: 0.25rem`, sets the radius across Pico. | backed | Pico shows a one-radius system exists. Note that Pico overrides search fields to 5rem, so "every corner" is a strict form. Trade-off "Cards and inputs look identical" has no source. |
| radius/radius-progression/linear | Linear radius adds a fixed amount for each larger surface. | M3 corner scale; Polaris border.ts + migration table; M3 page also says "M2: Three-level shape scale based on the size of the component container" | M3 steps go 4, 8, 12, 16 dp (plus 4 each step), then 20, 28, 32, 48. Polaris steps go 4, 8, 12, 16, 20 px (`100` to `500`), then 30. Neither scale is linear across its full range. M3 states its scale is tied to "roundedness", not surface size. | reword | "A linear radius scale adds a fixed amount per step, for example 4, 8, 12, 16. Material 3 and Polaris both start this way." Cut "for each larger surface". The trade-off "Large surfaces may not look round enough" has no source. |
| radius/radius-progression/geometric | Each radius step multiplies the base, so large corners grow quickly. | shadcn theming; Carbon button page; Tailwind radius | shadcn builds sm to 4xl as base x 0.6, 0.8, 1, 1.4, 1.8, 2.2, 2.6. The factors rise by 0.2 and then 0.4, so the scale is linear in the factor, not geometric. Carbon doubles at first (2, 4, 8, 16) and then adds 8 (24). Tailwind goes 2, 4, 6, 8, 12, 16, 24, 32. I found no fetched system that multiplies by one constant per step. | no source | "Each step is the base radius times a factor. shadcn sets sm to 4xl as 0.6 to 2.6 times `--radius`." If you need doubling, use Carbon 2, 4, 8, 16 as the example and say it stops doubling at 24. Trade-off "The steps are harder to remember" has no source. |

## Dense data, native, commerce (3 rows)

| Row id | Claim (pack `why`) | Source URL(s) | What the source says | Verdict | Suggested wording / note |
| --- | --- | --- | --- | --- | --- |
| purpose/product-type/dense-data | A dense tool needs tight space, small type, and compact color steps. | Carbon data table: https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines; Material density blog: https://m3.material.io/blog/material-density-web | Carbon: row heights xs 24px, sm 32px, md 40px (default), lg 48px, xl 64px. xs is "for highly dense layouts where maximizing information within limited space is a priority". Material: "Compact density can be great in data-rich applications ... data tables or long forms may benefit from an increase in density." Material also says each density step cuts component height by 4px, touch targets stay at least 48px, and denser components need larger margins and gutters. | reword | "A dense tool needs compact rows and tight spacing. Carbon has 24px rows for dense layouts; Material has a compact density for data tables." "Small type" and "compact color steps" have no source. Cut them or mark them as the pack's own choice. Trade-off "Long reading becomes harder" has no source; the closest line is Material's "High density spacing can also make alerts and messages difficult to notice and read". |
| purpose/platforms/native | Native screens use platform type and a fixed density. | Apple HIG typography (data from developer.apple.com tutorials JSON): https://developer.apple.com/design/human-interface-guidelines/typography | "Apple provides two typeface families ... San Francisco (SF) is a sans serif typeface family that includes SF Pro, SF Compact ... SF Mono". Also: "Follow the recommended default and minimum text sizes for each platform." No fetched page says native apps use a "fixed density". Material's density page says density is adjustable. | reword | "Native screens use the platform system font (San Francisco on Apple platforms) and the platform's default text sizes." Cut "fixed density". I did not fetch an Android typography source, so the Android part is open. |
| purpose/product-type/commerce | A shop needs clear actions, readable prices, and a brand color that stays known. | Shopify checkout UX: https://shopify.dev/docs/apps/build/checkout/ux-for-checkout; Shopify Help, checkout style: https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-style | Shopify dev: "Make it clear if an item costs money. Customers could miss this information if it's hidden among other content." Shopify Help: "Choose a color that matches your brand" (header); "make sure that you can clearly read the text against the backgrounds" (buttons and accents); "it's best to keep the design simple ... you don't want to distract them or make the information hard to read. Choose colors with high contrast". | backed | The pack's Polaris voice-and-tone source does not back this; replace it with the two Shopify pages. The trade-off "A loud brand color can tire a long read" is close to Shopify Help's "keep the design simple" but is not a direct source. |

## Step count (3 rows)

| Row id | Claim (pack `why`) | Source URL(s) | What the source says | Verdict | Suggested wording / note |
| --- | --- | --- | --- | --- | --- |
| color-primitives/step-count/nine | Nine steps match a simple 100 to 900 scale. | Bootstrap 5.3 color: https://getbootstrap.com/docs/5.3/customize/color/ | Each hue has `$blue-100, -200, ... -900` (nine named steps). | backed | Replace the Material roles source. The trade-off "You lose the very light and very dark ends" is shown by Tailwind below (50 and 950 exist). |
| color-primitives/step-count/ten | Ten steps add a lighter 50 in front of 100 to 900. | Tailwind v2 colors (served at): https://tailwindcss.com/docs/customizing-colors | Each color runs 50, 100, 200 ... 900 (ten steps). Example: Red 50 `#FEF2F2` ... 900 `#7F1D1D`. Current Tailwind (https://tailwindcss.com/docs/colors) uses 50 to 950 (eleven steps). | backed | The fetched page shows the v2 palette, so say "Tailwind v2". Current Tailwind adds a 950. Trade-off "The ends are not symmetric" is true of 50 against 900, but no source states it. |
| color-primitives/step-count/custom | You set the number of steps. The recipe stores the count. | Leonardo contrast-colors README: https://raw.githubusercontent.com/adobe/leonardo/main/packages/contrast-colors/README.md | `ratios` is "List of target contrast ratios"; with an array, swatches are named `blue100`, `blue200`... one per ratio, so the step count is the number of ratios you pass (examples with 2 and 4). | backed | Backs "you set the number". "The recipe stores the count" and the 5 to 16 limit are Open DS behavior, so no outside source applies. "A custom count is harder to share" has no source. |

## Scale direction and names (2 rows)

| Row id | Claim (pack `why`) | Source URL(s) | What the source says | Verdict | Suggested wording / note |
| --- | --- | --- | --- | --- | --- |
| global/scale-direction/high-is-light | A high number means a light color, like a percent of lightness from 100 to 0. | Material 3 color system: https://m3.material.io/styles/color/system/how-the-system-works; MDN hsl(): https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl | M3: "Tonal values range from 0 (black) to 100 (white). The smaller the tonal value, the darker the color." Tones are 0 to 100 "in increments of 10, as well as 95, 98, and 99". Example: `primary40` for the primary role, `primary100` for on-primary. MDN: for `L`, "100% is white, 0% is black". | backed | **Replace the Radix source.** Radix (https://www.radix-ui.com/colors/docs/palette-composition) runs step 1 = app background to step 12 = high-contrast text, so a high number is the dark text step in light mode. It does not back the claim. The trade-off "It fights the 50 to 900 habit" is backed by Tailwind and Bootstrap, where 50 or 100 is the lightest. |
| color-primitives/on-color-pairing/unrelated-names | Background and text use names that do not show the pair. | Tailwind colors: https://tailwindcss.com/docs/colors; M3 color system (above); shadcn/ui theming: https://ui.shadcn.com/docs/theming | Tailwind example markup pairs unrelated names, for example `text-gray-950` and `dark:text-white` on `bg-white` and `dark:bg-gray-800`. M3 names the pair: "primary" and "on primary". shadcn: "`primary` pairs with `primary-foreground`." | reword | The claim fits Tailwind. The trade-off "People can pair the wrong text color" has no direct source; the nearest line is Android's "avoid pairing colors with similar tones" (https://developer.android.com/design/ui/mobile/guides/styles/color), and it is about contrast, not names. Suggested: "Background and text use names that do not show the pair, like `bg-white` and `text-gray-950` in Tailwind. Material (`primary` / `on primary`) and shadcn (`primary` / `primary-foreground`) name the pair." |

## Not fetched, so not used as evidence

- Polaris palettes and roles, https://polaris-react.shopify.com/design/colors/palettes-and-roles: only a search summary ("Brand is used to pull additional focus on main actions"); direct fetch returned 500.
- Polaris formatting localized currency, https://polaris.shopify.com/foundations/formatting-localized-currency: the old page now redirects to a generic "Polaris references" page. Search summary only. This could back "readable prices" if Yonatan opens it by hand.
- Material 2 pages (density, palette, color) and the Apple HIG web page return only a JavaScript shell. I used the HIG JSON feed instead.
- Open Props radii file: path 404; the Open Props home page lists `--radius-round`, `--radius-drawn-*`, `--radius-blob-*` but I did not use it for a verdict.
- Utopia: the fetched pages show type and space steps but no text that sets a custom count, so Utopia is not cited.
- (none further)

## Replacement source map (for the Content Writer)

| Row | Remove | Use |
| --- | --- | --- |
| all radius rows | Material color roles, Tailwind colors | M3 corner scale, Tailwind border-radius, Carbon button radius, Polaris border.ts, Primer size, Pico, shadcn (as per row) |
| dense-data | Material color roles | Carbon data table guidelines (www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines); Material density blog |
| native | Material color roles | Apple HIG typography |
| commerce | Polaris voice-and-tone | shopify.dev checkout UX; Shopify Help checkout style |
| nine / ten | Material color roles | Bootstrap 5.3 color; Tailwind v2 colors |
| custom | Leonardo home page | Leonardo contrast-colors README |
| high-is-light | Radix palette composition | M3 how-the-system-works; MDN hsl() |
| unrelated-names | (keep Tailwind) | add M3 and shadcn as the contrast |
