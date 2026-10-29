# Open DS pack copy (v1, draft)

**Source:** packs/ on branch `feat/OD-mvp` of 3dyonic/Open-DS, commit `6731de2` (PR #1). Format: section 7 of `reasoning-voice.md`.
**Status:** copy for review. Nothing here is pushed to the repo. Ids and sources come from the packs and are not changed. Sources are from the pack data, except on 15 rows where the Researcher's sources replaced the pack's source (see "Source fit notes"). The pack JSON needs the same source change.
**Rows:** 89 option rows in 9 packs, and 16 effect reason rows. Counts per pack: purpose 24, global 8, color-primitives 24, accessibility 2, typography 13, spacing 4, radius 8, theming 2, delivery 4.

**Notes for the build**
- Key = `pack` + `scheme_id` + `option_id`. The `color-primitives` / `scale-direction` / `low-is-light` row is the override of the global scheme `global:scale-direction`. The other three `css-unit` questions (typography, spacing, radius) only reference `global:css-unit` and have no options, so they have no rows.
- `sources` are written as `Name: Title (url)`, separated by `; `, in the same wording as the pack data.
- `trade_offs` ends with "Evidence is limited" on 1 row (radius / radius-progression / geometric), where no source backs the claim (see "Source fit notes"). Remove that line when a source is added. The other 15 rows were checked against the Researcher's sources in `pack-sources.md` (OD-69) and the tag was removed.
- Effect reasons have no "Because you chose" start. The tooltip pattern adds it. They end with a full stop, so the build should not add a second one.
- The pack's own `why`, `when_to_choose` and `trade_offs` were the starting point. Wording here follows the reasoning voice guide. Meaning is kept. Added: a second cost on a few rows (for example the OKLCH-only color options), taken from the pack's own `depends_on` data or the cited source, and "Evidence is limited" on the one row where it still applies.

## Pack: purpose

*Purpose. Who this design system serves. Answer this scope first.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| purpose | product-type | dense-data | Dense data | Tables, tools and other screens that carry a lot of information. You get compact rows and tight space. | Choose this if people scan many rows and stay in the product for long stretches. | Alerts and messages can be harder to notice and read; Touch targets must still be at least 48 px | Carbon: Data table guidelines (https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines); Material: Using Material density on the web (https://m3.material.io/blog/material-density-web) |
| purpose | product-type | content | Content | Pages people come to read. You get comfortable type, clear contrast and room around the text. | Choose this if people come to read pages, not to run a tool. | Dense screens can feel sparse | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| purpose | product-type | commerce | Commerce | A shop or other purchase flow. You get clear actions, readable prices and a brand color people can recognize. | Choose this if people compare products and then buy. | A lot of color can distract from the task | Shopify: Checkout UX guidelines (https://shopify.dev/docs/apps/build/checkout/ux-for-checkout); Shopify Help: Customizing the style of your checkout (https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-style) |
| purpose | product-type | calm | Calm | A low-pressure product. You get fewer accents, more space and a quiet voice. | Choose this if the product should feel slow and low pressure. | Urgent tasks can look understated | Nielsen Norman Group: Tone of voice (https://www.nngroup.com/articles/tone-of-voice-dimensions/) |
| purpose | product-type | consumer | Consumer | A product used in short sessions by a broad audience that did not come looking for a tool. | Choose this if the audience is broad and sessions are short. | Expert users may want more density | Nielsen Norman Group: Tone of voice (https://www.nngroup.com/articles/tone-of-voice-dimensions/) |
| purpose | users-and-context | public | Public visitors | People arrive without training and decide fast. The first screen has to make sense on its own. | Choose this if most people are not signed in. | You explain more on every page | GOV.UK: Style guide (https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style) |
| purpose | users-and-context | operators | Operators | People who use the product often and learn its patterns. You can lean on that familiarity. | Choose this if trained people use it most days. | New visitors get less explanation | Carbon: Content overview (https://carbondesignsystem.com/guidelines/content/overview/) |
| purpose | users-and-context | mixed | Mixed | Some people visit once and others work in the product every day. One system serves both. | Choose this if visitors and operators share one system. | One density will not fit both groups well | Nielsen Norman Group: Tone of voice (https://www.nngroup.com/articles/tone-of-voice-dimensions/) |
| purpose | accessibility-target | wcag-22-aa | WCAG 2.2 AA | WCAG 2.2 level AA is a common target for text and interface parts. You get clear targets, such as 4.5:1 contrast for body text. | Choose this if you need to meet AA and AAA is not required yet. | Some large text can still be hard to read; Very light brand colors may not pass | W3C WAI: WCAG 2.2 contrast minimum (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| purpose | accessibility-target | wcag-22-aaa | WCAG 2.2 AAA | Level AAA asks for stronger contrast than AA, such as 7:1 for body text. You get a stricter target. | Choose this if your audience needs the stricter contrast target. | Brand colors get harder to keep | W3C WAI: WCAG 2.2 contrast enhanced (https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html) |
| purpose | platforms | web | Web | A website or web app. With rem units, type follows the reader's own font settings. | Choose this if the system ships in a browser first. | Native apps need a later pass | CSS Values: rem units (https://www.w3.org/TR/css-values-4/#rem) |
| purpose | platforms | native | Native | iOS, Android or desktop apps. On Apple platforms, screens use the San Francisco system font and the recommended text sizes. | Choose this if there is no website in this version. | Web visitors are out of scope | Apple: Typography (https://developer.apple.com/design/human-interface-guidelines/typography) |
| purpose | platforms | web-and-native | Web and native | One system serves a website and native apps. You share tokens in DTCG format and keep the structure steady. | Choose this if both surfaces ship from the same decisions. | You keep two sets of components | DTCG: Design Tokens format (https://www.designtokens.org/tr/drafts/format/) |
| purpose | team | solo-starting | Solo, starting | One person is starting the system. Fewer choices are easier to keep true. | Choose this if one person maintains the system. | Later teams may need more written rules | GOV.UK: Style guide (https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style) |
| purpose | team | small-team | Small practiced team | A few people edit the system and can review a short list of decisions together. | Choose this if a few people edit the system each week. | A larger program will outgrow the short list | Carbon: Content overview (https://carbondesignsystem.com/guidelines/content/overview/) |
| purpose | team | large-team | Large established team | Many people ship from the system. Named owners and locked choices help files stay in step. | Choose this if many people ship UI from this system. | A change takes longer to agree | shadcn/ui: components.json (https://ui.shadcn.com/docs/components-json) |
| purpose | brand-variance | single-brand | Single brand | One brand and one theme. Components can still keep structure apart from values. | Choose this if you will not ship a second brand soon. | A second brand later means a new theme pass | Material: Color tokens (https://m3.material.io/styles/color/the-color-system/tokens) |
| purpose | brand-variance | multi-brand | Multi-brand | Two or more brands share components, and only the theme values change. | Choose this if two brands must use the same components. | Components cannot hold color values themselves | Material: Color roles (https://m3.material.io/styles/color/roles) |
| purpose | density | compact | Compact | Compact density fits more on a screen. It suits tools and tables. | Choose this if people need many controls in view. | Long reading gets tiring | Material: Spacing (https://m3.material.io/foundations/layout/understanding-layout/spacing) |
| purpose | density | comfortable | Comfortable | Comfortable density leaves room to read and room for a clear focus state. | Choose this if pages are read more than they are scanned. | Tables show fewer rows | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| purpose | density | spacious | Spacious | Spacious density uses large gaps and a quiet page. It suits calm or marketing pages. | Choose this if the page should feel open and quiet. | Tools need more scrolling | Material: Spacing (https://m3.material.io/foundations/layout/understanding-layout/spacing) |
| purpose | voice | plain | Plain | Clear words and little personality. Say the action and stop. | Choose this if clarity matters more than personality. | The brand can sound flat | GOV.UK: Style guide (https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style) |
| purpose | voice | warm | Warm | Human and direct, without slang. It does not joke about the task. | Choose this if you want a human tone without slang. | Serious errors can sound too soft | Nielsen Norman Group: Tone of voice (https://www.nngroup.com/articles/tone-of-voice-dimensions/) |
| purpose | voice | precise | Precise | Exact names and clear next steps, with no filler. | Choose this if experts need exact labels. | New people may find it cold | Carbon: Content overview (https://carbondesignsystem.com/guidelines/content/overview/) |

## Pack: global

*Global. Answers reused across scopes. A scoped pack references these instead of copying them.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| global | contrast-metric | wcag22 | WCAG 2.2 contrast | WCAG 2.2 contrast is the ratio of relative luminance between two colors. It matches a target that names WCAG 2.2. | Choose this if your target is WCAG 2.2 AA or AAA. | The ratio is not a full reading test | W3C WAI: WCAG 2.2 contrast minimum (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| global | contrast-metric | apca | APCA | APCA is a different contrast model. It judges lightness with its own formula. | Choose this if your team has agreed to use APCA instead of WCAG. | A WCAG target and APCA numbers can disagree | APCA: APCA contrast (https://apcacontrast.com/) |
| global | scale-direction | low-is-light | 50 to 1000 | Step names run from 50 to 1000, and a low number is a light color, like the names in Tailwind. | Choose this if your team already says 50 for the lightest step. | The numbers are not lightness percents | Tailwind: Customizing colors (https://tailwindcss.com/docs/colors) |
| global | scale-direction | high-is-light | 100 to 0 | Step names run from 100 down to 0, and a high number is a light color, like a lightness percent. | Choose this if 100 should mean the lightest step. | It goes against the common 50 to 900 habit | Material: Color system (https://m3.material.io/styles/color/system/how-the-system-works); MDN: hsl() (https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl); Tailwind: Colors (https://tailwindcss.com/docs/colors) |
| global | css-unit | rem | rem | Rem follows the reader's font size, so zoom and settings keep the layout in step. | Choose this if the product is on the web. | Matching a pixel-exact mock takes more work | CSS Values: rem units (https://www.w3.org/TR/css-values-4/#rem) |
| global | css-unit | px | px | Pixels are fixed. They match a fixed layout and do not follow the reader's font size. | Choose this if you need exact pixels on a native screen. | Browser zoom can feel uneven | Material: Spacing (https://m3.material.io/foundations/layout/understanding-layout/spacing) |
| global | structure-theme-separation | separate | Separate | Components hold anatomy and states. Theme files hold color, type, radius and motion. | Choose this if a new theme must not change the components. | You keep two layers in the repo | DTCG: Design Tokens format (https://www.designtokens.org/tr/drafts/format/) |
| global | structure-theme-separation | combined | Combined | Theme values live in the component files, so one folder holds the whole look. | Choose this if you have one brand and want fewer files. | A second brand means editing components | Material: Color roles (https://m3.material.io/styles/color/roles) |

## Pack: color-primitives

*Color primitives. Decisions for a color ramp. The schemes are described. Nothing here calculates a color.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| color-primitives | color-space | oklch | OKLCH | OKLCH separates lightness from chroma and hue, so you can plan steps by lightness alone. | Choose this if your tools can read oklch() values. | Older tools may not read oklch(); Some colors fall outside the screen's range and need a fallback | CSS Color: CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/) |
| color-primitives | color-space | hsl | HSL | HSL is widely known, and its three parts have familiar names: hue, saturation and lightness. | Choose this if your team already works in HSL. | Equal HSL steps do not look equal in lightness | CSS Color: CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/) |
| color-primitives | color-space | lab | Lab | CIELAB is a color space from color science, with a lightness axis and two color axes. | Choose this if you already measure color in Lab. | Hue is less direct than in OKLCH | CSS Color: CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/) |
| color-primitives | color-space | srgb | sRGB | sRGB is the standard screen color space behind hex values. It is the usual delivery space. | Choose this if you only need hex values and simple mixes. | Ramps can look uneven | CSS Color: CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/) |
| color-primitives | step-distance | deltae2000 | Equal deltaE2000 | Steps are spaced so the perceived difference between neighbors is equal, measured with CIEDE2000. | Choose this if you measure steps with CIEDE2000. | The math is harder to explain; Needs OKLCH or Lab as the color space | CSS Color: CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/) |
| color-primitives | step-distance | lightness-delta | Equal lightness | Each step changes lightness by the same amount in the chosen color space. | Choose this if you want a plain, even ramp. | Perceived gaps can still vary | Leonardo: Color theory (https://leonardocolor.io/) |
| color-primitives | step-distance | contrast-step | Contrast steps | Each step targets a contrast gap against the lightest color. | Choose this if contrast between steps matters more than even hue spacing. | The ramp can look less even | Radix: Palette composition (https://www.radix-ui.com/colors/docs/palette-composition) |
| color-primitives | scale-direction | low-is-light | 50 to 1000 | Color steps in this pack use the 50 to 1000 names, and a low number stays a light color. | Choose this if the color steps should match Tailwind-style names. | You give up a 100 to 0 lightness name | Tailwind: Customizing colors (https://tailwindcss.com/docs/colors) |
| color-primitives | step-count | nine | 9 steps | Nine steps give you a plain 100 to 900 scale. | Choose this if you do not need a 50 or a 950 step. | You lose the very light and very dark ends | Bootstrap: Color (https://getbootstrap.com/docs/5.3/customize/color/); Tailwind: Colors (https://tailwindcss.com/docs/colors) |
| color-primitives | step-count | ten | 10 steps | Ten steps add a lighter 50 in front of 100 through 900, as in Tailwind v2. | Choose this if you want a 50 and no 950. | The two ends are not symmetric | Tailwind v2: Customizing colors (https://v2.tailwindcss.com/docs/customizing-colors) |
| color-primitives | step-count | eleven | 11 steps | Eleven steps run from 50 through 950, as in the Tailwind color scale. | Choose this if people expect both a 50 and a 950. | You have more tokens to name | Tailwind: Customizing colors (https://tailwindcss.com/docs/colors) |
| color-primitives | step-count | twelve | 12 steps | Twelve steps match scales built on twelve slots, such as 1 to 12. | Choose this if your references use twelve colors. | Names differ from a 50 to 950 scale | Radix: Palette composition (https://www.radix-ui.com/colors/docs/palette-composition) |
| color-primitives | step-count | custom | Custom count | You set the number of steps, from 5 to 16, and the recipe stores the count. | Choose this if 9, 10, 11 or 12 steps do not fit. | A custom count is harder to share | Leonardo: Contrast colors README (https://raw.githubusercontent.com/adobe/leonardo/main/packages/contrast-colors/README.md) |
| color-primitives | lightness-curve | linear | Linear | Lightness changes by an even amount from the light end to the dark end. | Choose this if you want the plainest path. | The middle can look uneven | Leonardo: Color theory (https://leonardocolor.io/) |
| color-primitives | lightness-curve | ease | Ease | An ease curve changes lightness more slowly near the light and dark ends. | Choose this if the ends should move more slowly. | Steps in the middle sit farther apart | Leonardo: Color theory (https://leonardocolor.io/) |
| color-primitives | lightness-curve | perceptual | Perceptual | A perceptual curve puts more steps in the middle of the ramp, where most UI surfaces sit. | Choose this if most of your UI sits in the middle of the ramp. | The ends move faster | Radix: Palette composition (https://www.radix-ui.com/colors/docs/palette-composition) |
| color-primitives | chroma-hue-shift | none | No shift | Chroma and hue stay at the seed. Only lightness changes. | Choose this if the seed color should not drift. | Dark steps can look dull or neon | CSS Color: CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/) |
| color-primitives | chroma-hue-shift | chroma-taper | Chroma taper | Chroma is lower at the light and dark ends and fuller in the middle. | Choose this if the ends should look softer. | The middle can look more saturated than the brand | Leonardo: Color theory (https://leonardocolor.io/) |
| color-primitives | chroma-hue-shift | hue-warm | Warm hue shift | Darker steps shift a little toward warm hues. | Choose this if the brand should stay warm as it darkens. | A cool brand can look muddy; Needs OKLCH as the color space | Radix: Palette composition (https://www.radix-ui.com/colors/docs/palette-composition) |
| color-primitives | chroma-hue-shift | hue-cool | Cool hue shift | Darker steps shift a little toward cool hues. | Choose this if the brand should cool as it darkens. | A warm brand can look grey; Needs OKLCH as the color space | Radix: Palette composition (https://www.radix-ui.com/colors/docs/palette-composition) |
| color-primitives | seed-input | hex | Hex seed | A hex seed is one six-digit value. The recipe records it and does not calculate a ramp. | Choose this if you have one brand hex. | Hex hides lightness and chroma | CSS Color: CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/) |
| color-primitives | seed-input | oklch-parts | OKLCH parts | You record lightness, chroma and hue as numbers. The recipe does not convert them. | Choose this if your seed is already in OKLCH. | Many people cannot read the numbers; Needs OKLCH as the color space | CSS Color: CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/) |
| color-primitives | on-color-pairing | surface-pair | surface and on-surface | One rule names a surface and the color on it: surface and on-surface. | Choose this if text and its background must stay paired. | You use one naming scheme only | Material: Color roles (https://m3.material.io/styles/color/roles) |
| color-primitives | on-color-pairing | unrelated-names | Unrelated names | Background and text use names that do not show the pair, such as `bg-white` and `text-gray-950` in Tailwind. | Choose this if your files already use unrelated color names. | You give up names that show the pair, as in Material's primary and on primary | Tailwind: Colors (https://tailwindcss.com/docs/colors); Material: Color system (https://m3.material.io/styles/color/system/how-the-system-works); shadcn/ui: Theming (https://ui.shadcn.com/docs/theming) |

## Pack: accessibility

*Accessibility. How contrast is promised. This pack does not measure contrast.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| accessibility | contrast-check | guaranteed-by-scale | Guaranteed by the scale | The scale itself promises contrast, so you do not run a separate check later. | Choose this if every step must meet contrast by construction. | Brand freedom gets smaller | Radix: Palette composition (https://www.radix-ui.com/colors/docs/palette-composition) |
| accessibility | contrast-check | checked-afterwards | Checked afterwards | You pick the scale first, and a person checks contrast once the values exist. | Choose this if contrast is a review step, not a scale rule. | A good-looking scale can fail the review | W3C WAI: WCAG 2.2 contrast minimum (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |

## Pack: typography

*Typography. Starter decisions for type. Schemes are described, not computed.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| typography | font-family | system-sans | System sans | A system sans font loads fast and matches the device. | Choose this if you do not ship a custom font yet. | The look changes by platform | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | font-family | system-serif | System serif | A system serif can make long text feel like a document. | Choose this if long reading is the main job. | UI controls can look dated | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | font-family | system-mono | System mono | A mono font suits code and data that must line up. | Choose this if the product is mostly code or figures. | Long prose is harder to read | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | type-scale-ratio | major-second | 1.125 major second | A 1.125 ratio keeps heading steps close to body text. | Choose this if headings should stay quiet. | Hierarchy can be hard to see | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | type-scale-ratio | minor-third | 1.2 minor third | A 1.2 ratio gives headings a clear step without a big jump. | Choose this if headings should be clear but not large. | Small screens may feel loud | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | type-scale-ratio | major-third | 1.25 major third | A 1.25 ratio gives clear heading steps that stay moderate. | Choose this if you want clear heading steps. | Small screens may need fewer steps | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | type-scale-ratio | perfect-fourth | 1.333 perfect fourth | A 1.333 ratio makes display type much larger than body text. | Choose this if you need a strong display size. | You may not need every step | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | base-font-size | size-14 | 14 | A 14 px body size suits dense tools and tight labels. | Choose this if the product is a dense tool. | Long reading is harder | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | base-font-size | size-16 | 16 | 16 px is the usual browser default for body text. | Choose this if body text should match the browser default. | Dense tools often want smaller text | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | base-font-size | size-18 | 18 | An 18 px body size gives text more presence. | Choose this if readers need a larger body size. | Fewer words fit on a line | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | line-height | tight | 1.3 tight | A 1.3 line height keeps labels compact. | Choose this if most text is short labels. | Paragraphs feel cramped | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | line-height | normal | 1.5 normal | A 1.5 line height gives body text room without looking loose. | Choose this if body copy is the main content. | Tight UI labels can look tall | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |
| typography | line-height | loose | 1.7 loose | A 1.7 line height gives long passages more air. | Choose this if people read long passages. | Short labels look sparse | GOV.UK: Typography (https://design-system.service.gov.uk/styles/typography/) |

## Pack: spacing

*Spacing. Starter decisions for space.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| spacing | spacing-base | base-4 | 4 | A 4 px base builds a fine grid, and most steps are multiples of 4. | Choose this if you want a fine grid. | The scale has more steps to name | Material: Spacing (https://m3.material.io/foundations/layout/understanding-layout/spacing) |
| spacing | spacing-base | base-8 | 8 | An 8 px base keeps the scale short and coarse. | Choose this if you want fewer space tokens. | Fine adjustments are harder | Material: Spacing (https://m3.material.io/foundations/layout/understanding-layout/spacing) |
| spacing | spacing-scale | linear | Linear | Linear space adds the same base amount each step. | Choose this if gaps should be predictable. | Large gaps grow slowly | Material: Spacing (https://m3.material.io/foundations/layout/understanding-layout/spacing) |
| spacing | spacing-scale | geometric | Geometric | Geometric space multiplies the base each step, so large gaps grow fast. | Choose this if page gaps should jump in size. | Middle steps can feel missing | Material: Spacing (https://m3.material.io/foundations/layout/understanding-layout/spacing) |

## Pack: radius

*Radius. Starter decisions for corner radius.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| radius | radius-base | sharp | 0 | Square corners use a radius of 0. You get hard edges on every control and surface. | Choose this if the brand should feel sharp. | You give up rounded corners on controls and cards | Tailwind: Border radius (https://tailwindcss.com/docs/border-radius); Material Web: Shape tokens (https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss) |
| radius | radius-base | radius-4 | 4 | A 4 px radius softens a corner without looking round. | Choose this if you want only a slight softening. | The change can be missed at a glance | Tailwind: Border radius (https://tailwindcss.com/docs/border-radius); Material Web: Shape tokens (https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss) |
| radius | radius-base | radius-8 | 8 | An 8 px radius is the `lg` step in Tailwind and the small step in Material. | Choose this if you want a radius that Tailwind and Material both offer. | It does not match a brand with square corners | Tailwind: Border radius (https://tailwindcss.com/docs/border-radius); Material Web: Shape tokens (https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss) |
| radius | radius-base | radius-12 | 12 | A 12 px radius is the medium step in Material and the `xl` step in Tailwind. Primer calls it `large`. | Choose this if you want clearly rounded corners on cards and controls. | It does not match a brand with square or slightly rounded corners | Material Web: Shape tokens (https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss); Tailwind: Border radius (https://tailwindcss.com/docs/border-radius); Primer: Size primitives (https://primer.style/foundations/primitives/size) |
| radius | radius-base | pill | Pill | A pill radius rounds short controls fully. | Choose this if buttons should look like pills. | Large surfaces can turn into circles | Tailwind: Border radius (https://tailwindcss.com/docs/border-radius); Material Web: Shape tokens (https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss) |
| radius | radius-progression | none | One radius | One radius keeps every corner the same. | Choose this if you do not want a radius scale. | Cards and inputs look identical | Pico CSS: CSS variables (https://picocss.com/docs/css-variables) |
| radius | radius-progression | linear | Linear | Linear radius adds a fixed amount per step, for example 4, 8, 12, 16. The Material scale starts this way. | Choose this if the steps should be even. | Large steps grow no faster than small ones | Material Web: Shape tokens (https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-shape.scss) |
| radius | radius-progression | geometric | Geometric | Each radius step multiplies the base, so large corners grow quickly. | Choose this if cards should be much rounder than inputs. | The steps are harder to remember; Evidence is limited | Tailwind: Customizing colors (https://tailwindcss.com/docs/colors) |

## Pack: theming

*Theming. What a theme is. Modifiers such as light and dark are data, not generated colors.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| theming | theme-shape | sets-and-modifiers | Token sets plus modifiers | A theme is a set of token sets plus modifiers, such as light and dark. | Choose this if light and dark are modifiers on one theme. | You maintain more than one set | Material: Color tokens (https://m3.material.io/styles/color/the-color-system/tokens) |
| theming | theme-shape | single-set | Single token set | One token set is the whole theme, with no light or dark modifier. | Choose this if you ship a single appearance. | Dark mode later means a new theme | DTCG: Design Tokens format (https://www.designtokens.org/tr/drafts/format/) |

## Pack: delivery

*Delivery. What you share, and what is locked after init.*

| pack | scheme_id | option_id | option_label | why | when_to_choose | trade_offs | sources |
|---|---|---|---|---|---|---|---|
| delivery | shareable-item | full-boilerplate | Full boilerplate | The shareable item is the full system: tokens, CSS and components. | Choose this if a team should start from a full boilerplate. | The package is heavier than tokens alone | shadcn/ui: Registry item (https://ui.shadcn.com/docs/registry/registry-item-json) |
| delivery | shareable-item | tokens-only | Tokens only | The shareable item is the token file only, and components stay in the app. | Choose this if each app owns its components. | Teams rebuild the same components | DTCG: Design Tokens format (https://www.designtokens.org/tr/drafts/format/) |
| delivery | locked-at-init | lock-core | Lock tiers, pairing, and CSS variables | Token tiers, the on-color pair and CSS variable names are locked after init. | Choose this if those choices must not drift after setup. | A later rename is a breaking change | shadcn/ui: components.json (https://ui.shadcn.com/docs/components-json) |
| delivery | locked-at-init | lock-nothing | Lock nothing | Nothing is locked, so any choice can change after init. | Choose this if you are still exploring the system. | Installed files can drift apart | shadcn/ui: components.json (https://ui.shadcn.com/docs/components-json) |

## Effect reasons (Purpose effects)

One row per effect in `purpose.json`. `reason` is one line, up to 280 characters, and up to 20 words. Tooltip: `Because you chose [purpose answer]: [reason]`.

| pack | scheme_id | option_id | option_label | effect | target_pack | target_scheme_id | target_option_id | reason | chars |
|---|---|---|---|---|---|---|---|---|---|
| purpose | product-type | dense-data | Dense data | recommends | purpose | density | compact | A dense product keeps more data in view when space is compact. | 62 |
| purpose | product-type | dense-data | Dense data | recommends | spacing | spacing-base | base-4 | A fine 4 px base keeps dense screens aligned. | 45 |
| purpose | product-type | content | Content | recommends | purpose | density | comfortable | Pages people read need room around the text. | 44 |
| purpose | product-type | content | Content | recommends | typography | line-height | normal | Body copy gets room to breathe with a 1.5 line height. | 54 |
| purpose | product-type | calm | Calm | discourages | purpose | density | compact | Compact density leaves less room, which works against a calm, low-pressure page. | 80 |
| purpose | accessibility-target | wcag-22-aa | WCAG 2.2 AA | recommends | global | contrast-metric | wcag22 | A target that names WCAG 2.2 pairs with the WCAG contrast metric. | 65 |
| purpose | accessibility-target | wcag-22-aa | WCAG 2.2 AA | recommends | accessibility | contrast-check | checked-afterwards | Level AA can be reviewed once the color values are written. | 59 |
| purpose | accessibility-target | wcag-22-aaa | WCAG 2.2 AAA | recommends | global | contrast-metric | wcag22 | The stricter target still uses the WCAG contrast metric. | 56 |
| purpose | accessibility-target | wcag-22-aaa | WCAG 2.2 AAA | recommends | accessibility | contrast-check | guaranteed-by-scale | Level AAA is easier to keep when the scale itself promises contrast. | 68 |
| purpose | platforms | web | Web | recommends | global | css-unit | rem | On the web, rem lets type follow the reader's own font size. | 60 |
| purpose | team | large-team | Large established team | recommends | delivery | locked-at-init | lock-core | When many people ship from one system, locking core names after setup keeps files in step. | 90 |
| purpose | brand-variance | multi-brand | Multi-brand | requires | global | structure-theme-separation | separate | Two brands can share components only when theme values stay outside the components. | 83 |
| purpose | density | compact | Compact | recommends | spacing | spacing-base | base-4 | A fine 4 px grid fits the tighter spacing of compact screens. | 61 |
| purpose | density | comfortable | Comfortable | recommends | typography | line-height | normal | Comfortable reading goes with a 1.5 line height for body text. | 62 |
| purpose | density | spacious | Spacious | recommends | spacing | spacing-base | base-8 | Large gaps grow from a larger 8 px base. | 40 |
| purpose | voice | warm | Warm | recommends | color-primitives | chroma-hue-shift | hue-warm | A warm voice pairs with darker color steps that shift a little warmer. | 70 |

## Source fit notes (for the Researcher and Architect)

Status of the 16 rows that first carried "Evidence is limited". Sources come from `pack-sources.md` (OD-69). Full detail per row is in `sources-applied.md`.

| pack | scheme_id | option_id | status | note |
|---|---|---|---|---|
| purpose | product-type | dense-data | reworded | Now says compact rows and tight space. Carbon data table and Material density pages back it. "Small type" and "compact color steps" were removed. |
| purpose | product-type | commerce | applied | Shopify checkout pages replace the Polaris voice page. The trade-off now follows Shopify's "keep the design simple". |
| purpose | platforms | native | reworded | Now limited to Apple platforms (Apple HIG). "Fixed density" was removed. No Android source was fetched. |
| global | scale-direction | high-is-light | applied | Material tone (0 black to 100 white) and MDN hsl() replace the Radix page, which uses 1 to 12. |
| color-primitives | step-count | nine | applied | Bootstrap 5.3 shows nine steps (100 to 900). Tailwind shows the ends that are lost. |
| color-primitives | step-count | ten | applied | Tailwind v2 shows ten steps (50 to 900). "As in Tailwind v2" was added. |
| color-primitives | step-count | custom | applied | Leonardo's README shows the step count is the number of contrast ratios you pass. |
| color-primitives | on-color-pairing | unrelated-names | reworded | Tailwind's `bg-white` and `text-gray-950` shown as the example. Trade-off now names what you give up (Material and shadcn name the pair). |
| radius | radius-base | sharp | reworded | Now states radius 0 only. "Strict, technical look" and "harsh" had no source. |
| radius | radius-base | radius-4 | applied | 4 px is Tailwind `sm` and Material extra small. |
| radius | radius-base | radius-8 | reworded | Now names the Tailwind `lg` and Material small steps. "Still looks like a control" was removed. |
| radius | radius-base | radius-12 | reworded | Now names the Material medium, Tailwind `xl` and Primer `large` steps. "Buttons" was removed. |
| radius | radius-base | pill | applied | Tailwind `rounded-full` and Material full (9999px). |
| radius | radius-progression | none | applied | Pico CSS sets its radius with one variable. |
| radius | radius-progression | linear | reworded | Now says a fixed amount per step. The Material scale starts 4, 8, 12, 16, then jumps to 28. "For each larger surface" was removed. |
| radius | radius-progression | geometric | still-limited | No fetched system multiplies by one constant per step. shadcn's factors rise by 0.2 then 0.4, so they are not geometric. Text and cite unchanged. |
