---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1.5
title: "Decision reference"
description: "Brand expressive: each question, its answer, and the design decisions it made."
hide_table_of_contents: true
---

# Decision reference

:::intro{robot="brand-expressive" title="Take it one answer at a time"}
This page keeps every decision behind Brand expressive in one place: 79 answers and what each one shaped. It's a reference, not a reading list. Most days you only need one answer.

**Three easy ways in**

- Take a minute with [Where it starts](#where-it-starts). It shows the few first answers the rest grow from.
- Open one section when you wonder why. For example, why Brand expressive's spacing is spacious, or why its voice is playful.
- Come in from a component page. Each one links here, to the answers that shaped it.

Everything else can wait until you need it.
:::

1. Question
2. Answer
3. Why, and what it came from
4. Design values
5. In the UI

## Where it starts

The first answers lead to the rest. Each branch is an answer that follows from the one above it.

- :label[Sells and converts]{tone="info"} What does the product do for the business?
  - :label[Customers who choose us]{tone="info"} Who uses it most?
    - :label[AA]{tone="info"} What accessibility level do we commit to?
    - :label[They see it fresh each time]{tone="info"} How do people recall the interface?
    - :label[On the move]{tone="info"} Where do people use it?
      - :label[Touch size]{tone="info"} accessibility → `size.control.default` `size.52`: 3.25rem
    - :label[Light and dark]{tone="info"} theming →
  - :label[Images and campaigns]{tone="info"} What is the main content?
    - :label[One idea at a time]{tone="info"} How much is on one screen?
      - :label[Regular]{tone="info"} typography → `type.body.font-size` `font.size.17`: 1.0625rem
      - :label[Spacious]{tone="info"} spacing → `space.gap.tight` `space.8`: 0.5rem
    - :label[Browse and explore]{tone="info"} What is the main task?
  - :label[Rarely]{tone="info"} How often do people repeat actions?
  - :label[Delight]{tone="info"} What must the interface protect?
    - :label[Fast]{tone="info"} motion → `motion.duration.feedback` `duration.fast`: 120ms
  - :label[Engagement]{tone="info"} Which outcome matters most?
    - :label[A few minutes]{tone="info"} How long is one visit?
  - :label[Looking off-brand]{tone="info"} What is a costly mistake?
  - :label[Bold]{tone="info"} What should the brand feel like?
    - :label[Loud]{tone="info"} How visible is the brand in the interface?
      - :label[Vivid]{tone="info"} color → `color.neutral.0` `color.taupe.dark.0`: #120B09
      - :label[Pronounced]{tone="info"} elevation → `elevation.card` `shadow.card-dark`: [object Object]
    - :label[A display face for brand moments, with a sans for text]{tone="info"} Which typefaces carry the product, and why?, also because **Loud, Images and campaigns**
    - :label[Pill]{tone="info"} shape → `radius.control` `radius.999`: 9999px
    - :label[Playful]{tone="info"} voice and tone →
- :label[One]{tone="info"} How many brands or products share the system?
- :label[An agency]{tone="info"} Who maintains the system?
  - :label[Every campaign]{tone="info"} How fast does it change?
    - :label[Also for emphasis and size]{tone="info"} components →
  - :label[Lowercase words in paths]{tone="info"} naming →

## Every question

All 79, by section, in the order every scheme answers them. Each answer shows why, what it came from, and every design decision it made. The menu in the sidebar opens a section; its number is how many decisions that section made.

### Reasons

:::fold{id="business" title="Business and product" note="2 answers, 11 decisions"}
#### What does the product do for the business? {#business-q1}

:label[Sells and converts]{tone="info"}

**Why**

A launch site that must win attention and sign-ups.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (8)**

*Answers it led to (8)*

- Who uses it most? → Customers who choose us
- What is the main content? → Images and campaigns
- How often do people repeat actions? → Rarely
- What must the interface protect? → Delight
- Which outcome matters most? → Engagement
- What is a costly mistake? → Looking off-brand
- What should the brand feel like? → Bold
- Voice and tone · Which kinds of copy does it need? → Labels, messages and headlines [Voice and tone →](foundations/voice)

#### How many brands or products share the system? {#business-q2}

:label[One]{tone="info"}

**Why**

One brand, loudly.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (3)**

*Answers it led to (3)*

- Shape · How are corners set? → Fixed for the product [Shape →](foundations/shape)
- Theming · What can a theme change? → Mode only [Theming →](foundations/theming)
- Theming · How are brands handled? → One brand [Theming →](foundations/theming)
:::

:::fold{id="people" title="People and work context" note="2 answers, 11 decisions"}
#### Who uses it most? {#people-q1}

:label[Customers who choose us]{tone="info"}

**Why**

New customers deciding if they care.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (4)**

*Answers it led to (4)*

- What accessibility level do we commit to? → AA
- How do people recall the interface? → They see it fresh each time
- Where do people use it? → On the move
- Theming · Which modes ship? → Light and dark [Theming →](foundations/theming)

#### What accessibility level do we commit to? {#people-q2}

:label[AA]{tone="info"}

**Why**

AA, even when loud.

**Because of**

- Who uses it most? → Customers who choose us

**What it decided (7)**

*Answers it led to (2)*

- Accessibility · How many signals carry each meaning? → Two: color and word [Accessibility →](foundations/accessibility)
- Accessibility · What contrast floor do we hold? → AA [Accessibility →](foundations/accessibility)

*Rules it sets (3)*

- For a field label or column header, use type.label. Don't use type.caption. Labels stay readable on vivid color. [Typography →](foundations/typography)
- For a link, use color.text.link, underlined. Don't use color only. Underline keeps links clear on vivid color. [Color →](foundations/color)
- For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline. Focus must show on vivid color. [Accessibility →](foundations/accessibility)

*Variants it picks (2)*

- Button's focus state. Always shows, even on vivid color. [Button →](components/button)
- Button's disabled state. Only with a visible reason next to it. [Button →](components/button)
:::

:::fold{id="content" title="Content and data" note="2 answers, 16 decisions"}
#### What is the main content? {#content-q1}

:label[Images and campaigns]{tone="info"}

**Why**

Images, campaigns and short punchy copy.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (13)**

*Answers it led to (8)*

- How much is on one screen? → One idea at a time
- What is the main task? → Browse and explore
- Which typefaces carry the product, and why? → A display face for brand moments, with a sans for text
- Spacing · Which spacing roles does it need? → Gaps and insets [Spacing →](foundations/spacing)
- Spacing · Where does spacing matter most? → Between big sections [Spacing →](foundations/spacing)
- Elevation · What separates groups on the page? → Cards [Elevation →](foundations/elevation)
- Components · Which component families does it need? → Core, plus media [Components →](foundations/components)
- Components · Where do components do the most work? → Campaign sections [Components →](foundations/components)

*Rules it sets (1)*

- For a number in a table, use type.body. Don't use a mono font. Tables are rare and never compared column by column, so mono digits add nothing. The brand font keeps the voice. [Typography →](foundations/typography)

*Variants it picks (4)*

- Badge's info tone isn't used. Campaign labels are a state or a nudge; there are no plain news labels. [Badge →](components/badge)
- Empty's default variant. A campaign image or illustration beside the playful words and a clear next step. [Empty →](components/empty)
- Input group's block-start align isn't used. Copy is short and sign-up is the one action, so fields stay one line. [Input group →](components/input-group)
- Input group's block-end align isn't used. Copy is short and sign-up is the one action, so fields stay one line. [Input group →](components/input-group)

#### How much is on one screen? {#content-q2}

:label[One idea at a time]{tone="info"}

**Why**

One big idea per section.

**Because of**

- What is the main content? → Images and campaigns

**What it decided (3)**

*Answers it led to (3)*

- Typography · How large is body text? → Regular [Typography →](foundations/typography)
- Spacing · How many densities exist? → One [Spacing →](foundations/spacing)
- Spacing · How dense is the layout? → Spacious [Spacing →](foundations/spacing)
:::

:::fold{id="tasks" title="Tasks and flows" note="2 answers, 7 decisions"}
#### What is the main task? {#tasks-q1}

:label[Browse and explore]{tone="info"}

**Why**

People browse and explore the story.

**Because of**

- What is the main content? → Images and campaigns

**What it decided (1)**

*Answers it led to (1)*

- Components · Where do components do the most work? → Campaign sections [Components →](foundations/components)

#### How often do people repeat actions? {#tasks-q2}

:label[Rarely]{tone="info"}

**Why**

One action: sign up.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (6)**

*Answers it led to (2)*

- Color · How many emphasis levels do actions need? → Three [Color →](foundations/color)
- Components · How far does the inventory reach? → Only what today's screens use [Components →](foundations/components)

*Variants it picks (4)*

- Alert's default variant isn't used. Alerts here only report a sign-up that did not go through; confirmations go in a toast. [Alert →](components/alert)
- Input group's block-start align isn't used. Copy is short and sign-up is the one action, so fields stay one line. [Input group →](components/input-group)
- Input group's block-end align isn't used. Copy is short and sign-up is the one action, so fields stay one line. [Input group →](components/input-group)
- Toggle's lg size isn't used. Large is for the one call to action per section, and a toggle is not that action. [Toggle →](components/toggle)
:::

:::fold{id="human" title="Human factors" note="2 answers, 2 decisions"}
#### What must the interface protect? {#human-q1}

:label[Delight]{tone="info"}

**Why**

Delight is the point.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (2)**

*Answers it led to (1)*

- Motion · How fast does feedback feel? → Fast [Motion →](foundations/motion)

*Variants it picks (1)*

- Empty's default variant. A campaign image or illustration beside the playful words and a clear next step. [Empty →](components/empty)

#### How do people recall the interface? {#human-q2}

:label[They see it fresh each time]{tone="info"}

**Why**

Every visit should feel fresh.

**Because of**

- Who uses it most? → Customers who choose us
:::

:::fold{id="outcomes" title="Outcomes" note="2 answers, 20 decisions"}
#### Which outcome matters most? {#outcomes-q1}

:label[Engagement]{tone="info"}

**Why**

Engagement and sign-ups.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (13)**

*Answers it led to (6)*

- How long is one visit? → A few minutes
- Color · Where does color carry meaning first? → Brand moments [Color →](foundations/color)
- Motion · Where does motion show? → Hero and launch moments [Motion →](foundations/motion)
- Iconography · Where do icons work hardest? → Buttons and calls to action [Iconography →](foundations/iconography)
- Voice and tone · Where do the words matter most? → Headlines and buttons [Voice and tone →](foundations/voice)
- Components · How does a component earn its place? → It gives the brand a moment [Components →](foundations/components)

*Rules it sets (2)*

- For the action that completes the task, use button primary, large, one per section. Don't use two primaries. One loud call to action per section. [Color →](foundations/color)
- For a success message, use celebrate, briefly. Don't use a long thank-you. A short celebration is remembered. [Voice →](foundations/voice)

*Variants it picks (5)*

- Button's primary variant. One loud call to action per section. [Button →](components/button)
- Button's large size. The one loud call to action per section. [Button →](components/button)
- Badge's warning tone. Almost gone: few left, act soon. [Badge →](components/badge)
- Toast's success tone. Celebrate, briefly: You're on the list. See you at launch. [Toast →](components/toast)
- Toggle's lg size isn't used. Large is for the one call to action per section, and a toggle is not that action. [Toggle →](components/toggle)

#### What is a costly mistake? {#outcomes-q2}

:label[Looking off-brand]{tone="info"}

**Why**

A bland page is the costly mistake.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (7)**

*Answers it led to (1)*

- Voice and tone · How many tones does it use? → One per moment [Voice and tone →](foundations/voice)

*Rules it sets (2)*

- For an error message, use color.status.danger and a short sentence. Don't use the brand magenta. Errors must not look like the brand. [Color →](foundations/color)
- For a delete or remove, use button secondary, then confirm with Button danger. Don't use button primary. Confirm before destroying data. [Color →](foundations/color)

*Variants it picks (4)*

- Button's secondary variant. The first step of a delete, before the confirm. [Button →](components/button)
- Button's danger variant. The confirm of a delete. It stays red, apart from the brand's pink. [Button →](components/button)
- Alert's destructive variant. A sign-up that did not go through: plain first, then how to recover, with a word beside the color. [Alert →](components/alert)
- Item's muted variant isn't used. A quiet fill reads as bland on a loud page; color blocks already mark each section. [Item →](components/item)
:::

:::fold{id="brand" title="Brand" note="3 answers, 32 decisions"}
#### What should the brand feel like? {#brand-q1}

:label[Bold]{tone="info"}

**Why**

Bold and confident.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (8)**

*Answers it led to (8)*

- How visible is the brand in the interface? → Loud
- Which typefaces carry the product, and why? → A display face for brand moments, with a sans for text
- Color · How is the palette defined? → Neutrals and one brand ramp [Color →](foundations/color)
- Shape · Which shape roles does it need? → Controls and containers [Shape →](foundations/shape)
- Shape · What should control corners say? → Pill [Shape →](foundations/shape)
- Motion · How is easing defined? → A spring [Motion →](foundations/motion)
- Voice and tone · How does it sound? → Playful [Voice and tone →](foundations/voice)
- Components · How does a component earn its place? → It gives the brand a moment [Components →](foundations/components)

#### How visible is the brand in the interface? {#brand-q2}

:label[Loud]{tone="info"}

**Why**

The brand is loud everywhere.

**Because of**

- What should the brand feel like? → Bold

**What it decided (17)**

*Answers it led to (15)*

- Which typefaces carry the product, and why? → A display face for brand moments, with a sans for text
- Typography · Which text roles does it need? → Core and expressive display [Typography →](foundations/typography)
- Typography · How many steps does the type scale take? → Fine steps, so pages can set their own rhythm [Typography →](foundations/typography)
- Typography · Where does type do the most work? → Headlines and hero [Typography →](foundations/typography)
- Color · Which color roles does it need? → Those and brand accents [Color →](foundations/color)
- Color · How saturated is the palette? → Vivid [Color →](foundations/color)
- Spacing · How are spacing steps defined? → Big, even steps [Spacing →](foundations/spacing)
- Shape · Where does shape show most? → Buttons and badges [Shape →](foundations/shape)
- Elevation · What rises above the page? → Cards too [Elevation →](foundations/elevation)
- Elevation · How soft are shadows? → Pronounced [Elevation →](foundations/elevation)
- Motion · What is motion for? → Feedback and expression [Motion →](foundations/motion)
- Iconography · What do icons do? → Those and decoration [Iconography →](foundations/iconography)
- Voice and tone · How does it sound? → Playful [Voice and tone →](foundations/voice)
- Components · Which component families does it need? → Core, plus media [Components →](foundations/components)
- Components · When does a component get another look? → Also for emphasis and size [Components →](foundations/components)

*Rules it sets (1)*

- For a page title, use type.display. Don't use type.title. The display role carries the brand in every hero. [Typography →](foundations/typography)

*Variants it picks (1)*

- Item's muted variant isn't used. A quiet fill reads as bland on a loud page; color blocks already mark each section. [Item →](components/item)

#### Which typefaces carry the product, and why? {#brand-q3}

:label[A display face for brand moments, with a sans for text]{tone="info"}

**Why**

Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read.

**What it weighs (11)**

*Reading*

- **Readability.** Body text sits in DM Sans, a low-contrast sans that reads easily in short copy.
- **Legibility.** DM Sans keeps simple, open shapes at small sizes; the display face never sets small text.

*Range*

- **Scalability.** Both are variable: Bricolage Grotesque has optical size, width and weight axes, and DM Sans optical size and weight.
- **Numerals.** Numbers are few and set in DM Sans, in short copy rather than tables.
- **Scripts and languages.** Latin, with accents; other scripts need faces chosen for the same voice.

*Brand*

- **Recognition.** Bricolage Grotesque's character is the brand's: people know it by its headlines.
- **Familiarity.** DM Sans for text keeps reading familiar while the display face takes the risks.
- **Personality.** Bold and confident, as the brand answer asks.

*Delivery*

- **Performance.** Two variable families, one file each.
- **Licensing.** SIL Open Font License, both: free to embed in apps and on the web.
- **Fallback and pairing.** Falls back to system-ui, as its tokens say; DM Sans is the display face's text pair.

**Because of**

- What should the brand feel like? → Bold
- How visible is the brand in the interface? → Loud
- What is the main content? → Images and campaigns

**What it decided (7)**

*Theme picks it sets (7)*

- type.display.font-family: bricolage-grotesque for display text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read. [Typography →](foundations/typography)
- type.title.font-family: bricolage-grotesque for title text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read. [Typography →](foundations/typography)
- type.heading.font-family: bricolage-grotesque for heading text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read. [Typography →](foundations/typography)
- type.body.font-family: dm-sans for body text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read. [Typography →](foundations/typography)
- type.label.font-family: dm-sans for label text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read. [Typography →](foundations/typography)
- type.caption.font-family: dm-sans for caption text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read. [Typography →](foundations/typography)
- type.data.font-family: dm-sans for data text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read. [Typography →](foundations/typography)
:::

:::fold{id="scenarios" title="Use scenarios" note="2 answers, 5 decisions"}
#### Where do people use it? {#scenarios-q1}

:label[On the move]{tone="info"}

**Why**

Visitors come from social posts on their phones.

**Because of**

- Who uses it most? → Customers who choose us

**What it decided (4)**

*Answers it led to (1)*

- Accessibility · What is the smallest target? → Touch size [Accessibility →](foundations/accessibility)

*Variants it picks (3)*

- Field's vertical orientation. The sign-up form: the label above the field. [Field →](components/field)
- Field's horizontal orientation isn't used. Phones first: there is no room beside the field. [Field →](components/field)
- Field's responsive orientation isn't used. Phones first: one stacked layout. [Field →](components/field)

#### How long is one visit? {#scenarios-q2}

:label[A few minutes]{tone="info"}

**Why**

A visit lasts a few minutes at most.

**Because of**

- Which outcome matters most? → Engagement

**What it decided (1)**

*Rules it sets (1)*

- For a first visit, use one bold line and one button. Don't use a paragraph of copy. Visitors from a social post give a few seconds. [Voice →](foundations/voice)
:::

:::fold{id="team" title="Team and delivery" note="2 answers, 10 decisions"}
#### Who maintains the system? {#team-q1}

:label[An agency]{tone="info"}

**Why**

An agency runs campaigns.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (4)**

*Answers it led to (4)*

- How fast does it change? → Every campaign
- Naming · How are names written? → Lowercase words in paths [Naming →](foundations/naming)
- Voice and tone · How is the voice defined? → Principles and examples [Voice and tone →](foundations/voice)
- Components · How far does the inventory reach? → Only what today's screens use [Components →](foundations/components)

#### How fast does it change? {#team-q2}

:label[Every campaign]{tone="info"}

**Why**

Every campaign changes the look a little.

**Because of**

- Who maintains the system? → An agency

**What it decided (6)**

*Answers it led to (5)*

- Naming · What gets a name? → Tokens and component keys [Naming →](foundations/naming)
- Naming · How many token tiers? → Three [Naming →](foundations/naming)
- Naming · How are decisions named? → By role [Naming →](foundations/naming)
- Naming · What do components read? → Component keys [Naming →](foundations/naming)
- Components · When does a component get another look? → Also for emphasis and size [Components →](foundations/components)

*Rules it sets (1)*

- When no component in the inventory fits, use a section built from the inventory with campaign tokens. Don't use a new component for one campaign. Campaigns change the look through tokens; new parts every drop are hard to keep working. [Components →](foundations/components)
:::

### Scopes

:::fold{id="typography" title="Typography" note="5 answers, 3 decisions, and the values of its tokens"}
#### Which text roles does it need? {#typography-roles}

:label[Core and expressive display]{tone="info"}

**Why**

A big expressive display role carries the brand.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided (3)**

*Answers it led to (2)*

- Typography · How are sizes and line heights defined? → A ratio, line heights in proportion [Typography →](foundations/typography)
- Iconography · How big are icons next to text? → Larger than the text [Iconography →](foundations/iconography)

*Rules it sets (1)*

- For a page title, use type.display. Don't use type.title. The display role carries the brand in every hero. [Typography →](foundations/typography)

#### How many steps does the type scale take? {#typography-count}

:label[Fine steps, so pages can set their own rhythm]{tone="info"}

**Why**

Fine steps give big moments room.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How are sizes and line heights defined? {#typography-definition}

:label[A ratio, line heights in proportion]{tone="info"}

**Why**

Ratios suit the big display sizes.

**Because of**

- Typography · Which text roles does it need? → Core and expressive display

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How large is body text? {#typography-values}

:label[Regular]{tone="info"}

**Why**

Regular body; the display does the shouting.

**Because of**

- How much is on one screen? → One idea at a time

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### Where does type do the most work? {#typography-lands}

:label[Headlines and hero]{tone="info"}

**Why**

Type does its work in headlines.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)
:::

:::fold{id="color" title="Color" note="5 answers, 96 decisions, and the values of its tokens"}
#### Which color roles does it need? {#color-roles}

:label[Those and brand accents]{tone="info"}

**Why**

Brand accents are part of the message.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### How many emphasis levels do actions need? {#color-count}

:label[Three]{tone="info"}

**Why**

Primary, secondary, ghost.

**Because of**

- How often do people repeat actions? → Rarely

**What it decided (28)**

*Rules it sets (1)*

- For an alternative or cancel, use button ghost. Don't use a second primary. The alternative must not compete. [Color →](foundations/color)

*Variants it picks (1)*

- Button's ghost variant. The alternative next to the primary, and row actions with a word. [Button →](components/button)

*Theme picks it sets (26)*

- color.action.primary in light: pink.light.600: the primary action's fill; its label reads, 4.84:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 18.0:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.600: the danger action's fill; its label reads, 5.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in light: pink.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 4.84:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in light: pink.light.100: a tag's tint; text on it reads, 15.67:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.2 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in light: blue.light.100: a tag's tint; text on it reads, 13.98:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.3 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in light: green.light.100: a tag's tint; text on it reads, 15.76:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.4 in light: amber.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in light: amber.light.100: a tag's tint; text on it reads, 15.14:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.5 in light: neutral.500: a series color: a distinct hue with no meaning, for tags and chart marks, 4.63:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in light: neutral.100: a tag's tint; text on it reads, 15.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary in dark: pink.dark.600: the primary action's fill; its label reads, 8.88:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 17.12:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.58:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in dark: pink.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.88:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in dark: pink.dark.100: a tag's tint; text on it reads, 14.07:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.2 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.54:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in dark: blue.dark.100: a tag's tint; text on it reads, 13.94:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.3 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.14:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in dark: green.dark.100: a tag's tint; text on it reads, 13.74:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.4 in dark: amber.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.06:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in dark: amber.dark.100: a tag's tint; text on it reads, 13.53:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.5 in dark: neutral.700: a series color: a distinct hue with no meaning, for tags and chart marks, 13.64:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in dark: neutral.100: a tag's tint; text on it reads, 14.14:1, above the 4.5:1 floor. [Color →](foundations/color)

#### How is the palette defined? {#color-definition}

:label[Neutrals and one brand ramp]{tone="info"}

**Why**

Warm neutrals and one vivid ramp.

**Because of**

- What should the brand feel like? → Bold

**What it decided (36)**

*Theme picks it sets (36)*

- color.neutral.0 in light: taupe.light.0: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.50 in light: taupe.light.50: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.100 in light: taupe.light.100: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.200 in light: taupe.light.200: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.300 in light: taupe.light.300: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.400 in light: taupe.light.400: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.500 in light: taupe.light.500: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.600 in light: taupe.light.600: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.700 in light: taupe.light.700: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.800 in light: taupe.light.800: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.900 in light: taupe.light.900: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.950 in light: taupe.light.950: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.surface.canvas in light: neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch. [Color →](foundations/color)
- color.surface.selected in light: pink.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in light: pink.light.600: the focus ring, so the keyboard's place is never lost, 4.84:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.neutral.0 in dark: taupe.dark.0: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.50 in dark: taupe.dark.50: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.100 in dark: taupe.dark.100: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.200 in dark: taupe.dark.200: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.300 in dark: taupe.dark.300: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.400 in dark: taupe.dark.400: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.500 in dark: taupe.dark.500: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.600 in dark: taupe.dark.600: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.700 in dark: taupe.dark.700: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.800 in dark: taupe.dark.800: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.900 in dark: taupe.dark.900: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.neutral.950 in dark: taupe.dark.950: the scheme's neutral is taupe. Warm neutrals and one vivid ramp. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.08:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.21:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch. [Color →](foundations/color)
- color.surface.selected in dark: pink.dark.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in dark: pink.dark.600: the focus ring, so the keyboard's place is never lost, 8.88:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)

#### How saturated is the palette? {#color-values}

:label[Vivid]{tone="info"}

**Why**

Vivid color is the brand.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided (6)**

*Answers it led to (2)*

- Iconography · What icon style? → Two-tone [Iconography →](foundations/iconography)
- Accessibility · Where are the floors hardest to hold? → Brand color [Accessibility →](foundations/accessibility)

*Rules it sets (1)*

- For a selected row or item, use color.surface.selected (brand tint). Don't use grey. Selection carries the brand. [Color →](foundations/color)

*Variants it picks (3)*

- Item's outline variant. Rows on a color block, with a border so each holds its edge on vivid color. [Item →](components/item)
- Toggle's default variant isn't used. Sections lead with media and color blocks, not toolbars; a toggle with no border is lost on vivid color. [Toggle →](components/toggle)
- Toggle's outline variant. A pill with a border, so the toggle reads as a control on vivid color. [Toggle →](components/toggle)

#### Where does color carry meaning first? {#color-lands}

:label[Brand moments]{tone="info"}

**Why**

Color makes the launch moment.

**Because of**

- Which outcome matters most? → Engagement

**What it decided (26)**

*Theme picks it sets (26)*

- color.status.info in light: blue.light.600: info reads as text and icons, 10.11:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info.subtle in light: blue.light.100: a quiet tint behind info; its text, 12.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in light: green.light.600: success reads as text and icons, 5.38:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in light: green.light.100: a quiet tint behind success; its text, 10.79:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in light: amber.light.600: warning reads as text and icons, 6.16:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in light: amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in light: red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in light: red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in light: pink.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 4.84:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in light: amber.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in light: neutral.500: a series color: a distinct hue with no meaning, for tags and chart marks, 4.63:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.status.info in dark: blue.dark.600: info reads as text and icons, 8.54:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info.subtle in dark: blue.dark.100: a quiet tint behind info; its text, 11.38:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 8.14:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 12.64:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 10.06:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 11.96:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 11.86:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in dark: pink.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.88:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.54:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.14:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in dark: amber.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.06:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in dark: neutral.700: a series color: a distinct hue with no meaning, for tags and chart marks, 13.64:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
:::

:::fold{id="spacing" title="Spacing" note="5 answers, 3 decisions, and the values of its tokens"}
#### Which spacing roles does it need? {#spacing-roles}

:label[Gaps and insets]{tone="info"}

**Why**

Few tables; no row role needed.

**Because of**

- What is the main content? → Images and campaigns

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How many densities exist? {#spacing-count}

:label[One]{tone="info"}

**Why**

One generous density.

**Because of**

- How much is on one screen? → One idea at a time

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How are spacing steps defined? {#spacing-definition}

:label[Big, even steps]{tone="info"}

**Why**

Big, even steps make big moments.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How dense is the layout? {#spacing-values}

:label[Spacious]{tone="info"}

**Why**

Big space makes big moments.

**Because of**

- How much is on one screen? → One idea at a time

**What it decided (3)**

*Rules it sets (2)*

- For items that belong together, use space.gap.default. Don't use space.gap.tight. Air keeps big type readable. [Spacing →](foundations/spacing)
- For a table row height, use size.row (comfortable). Don't use a compact row. Tables are rare and short, so there is no need to fit many rows. Comfortable rows keep the brand's airy rhythm. [Spacing →](foundations/spacing)

*Theme picks it sets (1)*

- radius.option: radius.20: the panel's 24px corner less its 4px padding, so an option's corner nests inside the menu's. [Shape →](foundations/shape)

#### Where does spacing matter most? {#spacing-lands}

:label[Between big sections]{tone="info"}

**Why**

Space works between big sections.

**Because of**

- What is the main content? → Images and campaigns

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)
:::

:::fold{id="shape" title="Shape" note="5 answers, 11 decisions, and the values of its tokens"}
#### Which shape roles does it need? {#shape-roles}

:label[Controls and containers]{tone="info"}

**Why**

Pills everywhere; badges share the control corner.

**Because of**

- What should the brand feel like? → Bold

**What it decided (6)**

*Answers it led to (1)*

- Shape · How many corner sizes exist? → Two [Shape →](foundations/shape)

*Rules it sets (1)*

- For the shape of a status badge, use radius.badge (pill). Don't use a rectangle. Pills match the controls. [Shape →](foundations/shape)

*Theme picks it sets (4)*

- radius.control: radius.999: Pill controls feel playful. [Shape →](foundations/shape)
- radius.badge: radius.999: Pill controls feel playful. [Shape →](foundations/shape)
- radius.option: radius.20: the panel's 24px corner less its 4px padding, so an option's corner nests inside the menu's. [Shape →](foundations/shape)
- radius.container: radius.24: Pill controls feel playful. [Shape →](foundations/shape)

#### How many corner sizes exist? {#shape-count}

:label[Two]{tone="info"}

**Why**

Pill controls and large container corners.

**Because of**

- Shape · Which shape roles does it need? → Controls and containers

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)

#### How are corners set? {#shape-definition}

:label[Fixed for the product]{tone="info"}

**Why**

One brand, one set of corners.

**Because of**

- How many brands or products share the system? → One

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)

#### What should control corners say? {#shape-values}

:label[Pill]{tone="info"}

**Why**

Pill controls feel playful.

**Because of**

- What should the brand feel like? → Bold

**What it decided (5)**

*Rules it sets (1)*

- For the corners of buttons and inputs, use radius.control (pill). Don't use sharp corners. Pills match the brand's round, playful shapes. Sharp corners would feel corporate. [Shape →](foundations/shape)

*Variants it picks (1)*

- Toggle's outline variant. A pill with a border, so the toggle reads as a control on vivid color. [Toggle →](components/toggle)

*Theme picks it sets (3)*

- radius.control: radius.999: Pill controls feel playful. [Shape →](foundations/shape)
- radius.badge: radius.999: Pill controls feel playful. [Shape →](foundations/shape)
- radius.container: radius.24: Pill controls feel playful. [Shape →](foundations/shape)

#### Where does shape show most? {#shape-lands}

:label[Buttons and badges]{tone="info"}

**Why**

Pill buttons are the signature shape.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)
:::

:::fold{id="elevation" title="Elevation" note="5 answers, 27 decisions, and the values of its tokens"}
#### What rises above the page? {#elevation-roles}

:label[Cards too]{tone="info"}

**Why**

Cards lift to feel like objects.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided (11)**

*Answers it led to (2)*

- Elevation · How many shadow levels exist? → Two [Elevation →](foundations/elevation)
- Elevation · Where does elevation show? → Cards, menus and dialogs [Elevation →](foundations/elevation)

*Rules it sets (1)*

- For a card on the page, use elevation.card (pronounced). Don't use a flat card. Cards float to feel tactile. [Elevation →](foundations/elevation)

*Theme picks it sets (8)*

- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill. [Color →](foundations/color)
- color.surface.scrim in light: black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in light: shadow.card: Cards lift to feel like objects. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.overlay: Pronounced shadows add depth. [Elevation →](foundations/elevation)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light. [Color →](foundations/color)
- color.surface.scrim in dark: black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in dark: shadow.card-dark: Cards lift to feel like objects. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.overlay-dark: Pronounced shadows add depth. [Elevation →](foundations/elevation)

#### How many shadow levels exist? {#elevation-count}

:label[Two]{tone="info"}

**Why**

One shadow for cards, one for overlays.

**Because of**

- Elevation · What rises above the page? → Cards too

**What it decided**

It sets the values of the elevation tokens: [Elevation →](foundations/elevation)

#### What separates groups on the page? {#elevation-definition}

:label[Cards]{tone="info"}

**Why**

Cards hold each offer.

**Because of**

- What is the main content? → Images and campaigns

**What it decided (10)**

*Rules it sets (1)*

- Between page sections, use space.gap.section and a color block. Don't use a thin line. Big space and color make each section a moment. [Spacing →](foundations/spacing)

*Variants it picks (1)*

- Item's default variant. Rows inside a card, which already gives the frame. [Item →](components/item)

*Theme picks it sets (8)*

- color.surface.canvas in light: neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.08:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.21:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)

#### How soft are shadows? {#elevation-values}

:label[Pronounced]{tone="info"}

**Why**

Pronounced shadows add depth.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided (6)**

*Rules it sets (2)*

- For a card on the page, use elevation.card (pronounced). Don't use a flat card. Cards float to feel tactile. [Elevation →](foundations/elevation)
- For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow. Strong depth shows a menu or dialog sits above vivid sections. Without a shadow it blends into the color blocks. [Elevation →](foundations/elevation)

*Theme picks it sets (4)*

- elevation.card in light: shadow.card: Cards lift to feel like objects. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.overlay: Pronounced shadows add depth. [Elevation →](foundations/elevation)
- elevation.card in dark: shadow.card-dark: Cards lift to feel like objects. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.overlay-dark: Pronounced shadows add depth. [Elevation →](foundations/elevation)

#### Where does elevation show? {#elevation-lands}

:label[Cards, menus and dialogs]{tone="info"}

**Why**

Cards, menus and dialogs rise.

**Because of**

- Elevation · What rises above the page? → Cards too

**What it decided**

It sets the values of the elevation tokens: [Elevation →](foundations/elevation)
:::

:::fold{id="motion" title="Motion" note="5 answers, 6 decisions, and the values of its tokens"}
#### What is motion for? {#motion-roles}

:label[Feedback and expression]{tone="info"}

**Why**

Motion carries personality.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided (4)**

*Answers it led to (1)*

- Motion · How many speeds exist? → Three [Motion →](foundations/motion)

*Rules it sets (2)*

- For hover and press feedback, use motion.duration.feedback (fast). Don't use an instant change. Fast feedback, on the brand's spring. An instant change drops the brand's motion. [Motion →](foundations/motion)
- When someone asks for less motion, use reduced motion. Don't use full motion. Motion is part of the brand, so it shrinks to a fade instead of vanishing. Full motion is never forced on people who asked for less. [Motion →](foundations/motion)

*Variants it picks (1)*

- Button's hover state. Relaxed, springy feedback: motion is part of the brand. [Button →](components/button)

#### How many speeds exist? {#motion-count}

:label[Three]{tone="info"}

**Why**

Fast feedback, moderate panels, relaxed hero.

**Because of**

- Motion · What is motion for? → Feedback and expression

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How is easing defined? {#motion-definition}

:label[A spring]{tone="info"}

**Why**

A spring that overshoots feels alive.

**Because of**

- What should the brand feel like? → Bold

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How fast does feedback feel? {#motion-values}

:label[Fast]{tone="info"}

**Why**

Feedback stays fast; the personality shows in panels and hero moments, which move slower on a spring.

**Because of**

- What must the interface protect? → Delight

**What it decided (2)**

*Rules it sets (1)*

- For hover and press feedback, use motion.duration.feedback (fast). Don't use an instant change. Fast feedback, on the brand's spring. An instant change drops the brand's motion. [Motion →](foundations/motion)

*Variants it picks (1)*

- Button's hover state. Relaxed, springy feedback: motion is part of the brand. [Button →](components/button)

#### Where does motion show? {#motion-lands}

:label[Hero and launch moments]{tone="info"}

**Why**

Motion shows in hero and launch moments.

**Because of**

- Which outcome matters most? → Engagement

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)
:::

:::fold{id="iconography" title="Iconography" note="5 answers, 8 decisions, and the values of its tokens"}
#### What do icons do? {#iconography-roles}

:label[Those and decoration]{tone="info"}

**Why**

Icons also decorate campaign pages.

**Because of**

- How visible is the brand in the interface? → Loud

**What it decided (7)**

*Answers it led to (1)*

- Iconography · How many icon sizes exist? → Two [Iconography →](foundations/iconography)

*Rules it sets (2)*

- For an icon with no label, use not used: always add a word. Don't use an icon button with a hover hint. On phones, hover hints never show; a word says what will happen. [Iconography →](foundations/iconography)
- For an action on one row or item, use button ghost with a word. Don't use an icon alone. Visitors come rarely, so they never learn an icon. A word says what will happen. [Iconography →](foundations/iconography)

*Variants it picks (4)*

- Button's ghost variant. The alternative next to the primary, and row actions with a word. [Button →](components/button)
- Button's icon size isn't used. Phones first: hover hints never show, so every button has a word. [Button →](components/button)
- Empty's icon variant. A two-tone icon in a tile, for a small region where a picture would push the words away. [Empty →](components/empty)
- Input group's inline-start align. The search icon before the text. [Input group →](components/input-group)

#### How many icon sizes exist? {#iconography-count}

:label[Two]{tone="info"}

**Why**

One size next to text, one for decoration.

**Because of**

- Iconography · What do icons do? → Those and decoration

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)

#### What icon style? {#iconography-definition}

:label[Two-tone]{tone="info"}

**Why**

Two-tone icons carry the brand color.

**Because of**

- Color · How saturated is the palette? → Vivid

**What it decided (1)**

*Variants it picks (1)*

- Empty's icon variant. A two-tone icon in a tile, for a small region where a picture would push the words away. [Empty →](components/empty)

#### How big are icons next to text? {#iconography-values}

:label[Larger than the text]{tone="info"}

**Why**

Larger icons hold their own next to big type.

**Because of**

- Typography · Which text roles does it need? → Core and expressive display

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)

#### Where do icons work hardest? {#iconography-lands}

:label[Buttons and calls to action]{tone="info"}

**Why**

Icons sit in calls to action.

**Because of**

- Which outcome matters most? → Engagement

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)
:::

:::fold{id="theming" title="Theming" note="5 answers, 3 decisions, and the values of its tokens"}
#### What can a theme change? {#theming-roles}

:label[Mode only]{tone="info"}

**Why**

One brand, so only the mode changes.

**Because of**

- How many brands or products share the system? → One

**What it decided (1)**

*Answers it led to (1)*

- Theming · What changes when the theme changes? → Colors only [Theming →](foundations/theming)

#### How many themes ship? {#theming-count}

:label[Two]{tone="info"}

**Why**

Light and dark.

**Because of**

- Theming · Which modes ship? → Light and dark

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)

#### How are brands handled? {#theming-definition}

:label[One brand]{tone="info"}

**Why**

One brand per campaign.

**Because of**

- How many brands or products share the system? → One

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)

#### Which modes ship? {#theming-values}

:label[Light and dark]{tone="info"}

**Why**

Light and dark ship as standard.

**Because of**

- Who uses it most? → Customers who choose us

**What it decided (2)**

*Answers it led to (1)*

- Theming · How many themes ship? → Two [Theming →](foundations/theming)

*Rules it sets (1)*

- When someone switches to dark, use the dark semantic mode. Don't use a separate campaign palette. Dark ships as standard; campaigns change values, not structure. [Theming →](foundations/theming)

#### What changes when the theme changes? {#theming-lands}

:label[Colors only]{tone="info"}

**Why**

Only colors change.

**Because of**

- Theming · What can a theme change? → Mode only

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)
:::

:::fold{id="accessibility" title="Accessibility" note="5 answers, 108 decisions, and the values of its tokens"}
#### Which states get their own visible value? {#accessibility-roles}

:label[Those and pressed]{tone="info"}

**Why**

Pressed for touch.

**Because of**

- Accessibility · What is the smallest target? → Touch size

**What it decided (16)**

*Theme picks it sets (16)*

- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch. [Color →](foundations/color)
- color.action.primary.hover in light: pink.light.700: one step from the primary action (pink.light.600), so the pointer shows; its label still reads 7.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.700: one step from the danger action (red.light.600), so the pointer shows; its label still reads 8.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.disabled.text in light: neutral.500: 4.63:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in light: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in light: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch. [Color →](foundations/color)
- color.action.primary.hover in dark: pink.dark.700: one step from the primary action (pink.dark.600), so the pointer shows; its label still reads 10.82:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 14.14:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.69:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.disabled.text in dark: neutral.500: 10.96:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in dark: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in dark: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)

#### How many signals carry each meaning? {#accessibility-count}

:label[Two: color and word]{tone="info"}

**Why**

Color and word.

**Because of**

- What accessibility level do we commit to? → AA

**What it decided (24)**

*Rules it sets (2)*

- For an error message, use color.status.danger and a short sentence. Don't use the brand magenta. Errors must not look like the brand. [Color →](foundations/color)
- For a status, use badge pill with a word. Don't use color alone. A word keeps meaning on vivid backgrounds. [Color →](foundations/color)

*Variants it picks (4)*

- Badge's neutral tone. New: a label, not a state to fix. [Badge →](components/badge)
- Badge's success tone. On the list: you joined and your place is saved. [Badge →](components/badge)
- Badge's warning tone. Almost gone: few left, act soon. [Badge →](components/badge)
- Alert's destructive variant. A sign-up that did not go through: plain first, then how to recover, with a word beside the color. [Alert →](components/alert)

*Theme picks it sets (18)*

- color.text.info-on-light: blue.light.800: info text on its own tint, 12.97:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: blue.light.100: info text on its own tint, 11.38:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 12.64:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 11.96:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 11.86:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.selected in light: pink.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in light: blue.light.100: a quiet tint behind info; its text, 12.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in light: green.light.100: a quiet tint behind success; its text, 10.79:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in light: amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in light: red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.selected in dark: pink.dark.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in dark: blue.dark.100: a quiet tint behind info; its text, 11.38:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 12.64:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 11.96:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 11.86:1, above the 4.5:1 floor. [Color →](foundations/color)

#### What contrast floor do we hold? {#accessibility-definition}

:label[AA]{tone="info"}

**Why**

AA, checked on every vivid color.

**Because of**

- What accessibility level do we commit to? → AA

**What it decided (56)**

*Theme picks it sets (56)*

- color.text.on-light: taupe.light.900: the text for every light fill, 18.0:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-dark: taupe.light.0: the text for every dark fill, 4.84:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-light: blue.light.800: info text on its own tint, 12.97:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: blue.light.100: info text on its own tint, 11.38:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 12.64:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 11.96:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 11.86:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.default in light: neutral.0: the base for content; body text reads 18.0:1 on it, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.inverse in light: neutral.900: the reverse of content for short messages; its text reads, 18.0:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.primary in light: neutral.900: the strongest text step, 18.0:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.secondary in light: neutral.700: supporting text, 10.67:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.muted in light: neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.inverse in light: text.on-dark: the text its fill's tone picks, 18.0:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-action in light: text.on-dark: the text its fill's tone picks, 4.84:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.link in light: pink.light.700: a link, set apart by its hue, 7.55:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-danger in light: text.on-dark: the text its fill's tone picks, 5.63:1 on action.danger, above the 4.5:1 floor. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in light: neutral.500: the edge of a control people must find, 4.63:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in light: pink.light.600: the focus ring, so the keyboard's place is never lost, 4.84:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in light: pink.light.600: the edge beside a selected fill, so selection is never color alone, 4.84:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in light: pink.light.600: the primary action's fill; its label reads, 4.84:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary.hover in light: pink.light.700: one step from the primary action (pink.light.600), so the pointer shows; its label still reads 7.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 18.0:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.600: the danger action's fill; its label reads, 5.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.700: one step from the danger action (red.light.600), so the pointer shows; its label still reads 8.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info in light: blue.light.600: info reads as text and icons, 10.11:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in light: green.light.600: success reads as text and icons, 5.38:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in light: amber.light.600: warning reads as text and icons, 6.16:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in light: red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.default in dark: neutral.50: the base for content; body text reads 17.12:1 on it, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.inverse in dark: neutral.900: the reverse of content for short messages; its text reads, 17.12:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.primary in dark: neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.secondary in dark: neutral.500: supporting text, 10.96:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.muted in dark: neutral.400: the quietest text that still reads, 6.71:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.inverse in dark: text.on-light: the text its fill's tone picks, 17.12:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-action in dark: text.on-light: the text its fill's tone picks, 8.88:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.link in dark: pink.dark.700: a link, set apart by its hue, 10.82:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-danger in dark: text.on-light: the text its fill's tone picks, 7.58:1 on action.danger, above the 4.5:1 floor. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in dark: neutral.400: the edge of a control people must find, 6.71:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in dark: pink.dark.600: the focus ring, so the keyboard's place is never lost, 8.88:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in dark: pink.dark.600: the edge beside a selected fill, so selection is never color alone, 8.88:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in dark: pink.dark.600: the primary action's fill; its label reads, 8.88:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary.hover in dark: pink.dark.700: one step from the primary action (pink.dark.600), so the pointer shows; its label still reads 10.82:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 17.12:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 14.14:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.58:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.69:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info in dark: blue.dark.600: info reads as text and icons, 8.54:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 8.14:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 10.06:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)

#### What is the smallest target? {#accessibility-values}

:label[Touch size]{tone="info"}

**Why**

Visitors come from social posts on phones.

**Because of**

- Where do people use it? → On the move

**What it decided (12)**

*Answers it led to (1)*

- Accessibility · Which states get their own visible value? → Those and pressed [Accessibility →](foundations/accessibility)

*Rules it sets (2)*

- For an icon with no label, use not used: always add a word. Don't use an icon button with a hover hint. On phones, hover hints never show; a word says what will happen. [Iconography →](foundations/iconography)
- For the smallest clickable thing, use size.control.default (touch). Don't use a compact control. Most visitors arrive on phones, and a compact control is too small for a thumb. [Accessibility →](foundations/accessibility)

*Variants it picks (9)*

- Button's default size. Every button, at touch size: phones first. [Button →](components/button)
- Button's compact size isn't used. Phones first: no compact controls. [Button →](components/button)
- Button's icon size isn't used. Phones first: hover hints never show, so every button has a word. [Button →](components/button)
- Field's horizontal orientation isn't used. Phones first: there is no room beside the field. [Field →](components/field)
- Input group's inline-end align. The unit after the value, or the clear button with a word: hover hints never show on phones. [Input group →](components/input-group)
- Item's default size. Every row, at touch size: phones first. [Item →](components/item)
- Item's sm size isn't used. Phones first: no compact rows. [Item →](components/item)
- Toggle's default size. Every toggle, at touch size: phones first. [Toggle →](components/toggle)
- Toggle's sm size isn't used. Phones first: no compact controls. [Toggle →](components/toggle)

#### Where are the floors hardest to hold? {#accessibility-lands}

:label[Brand color]{tone="info"}

**Why**

Vivid brand color is the hardest to keep readable.

**Because of**

- Color · How saturated is the palette? → Vivid

**What it decided**

It sets the values of the accessibility tokens: [Accessibility →](foundations/accessibility)
:::

:::fold{id="naming" title="Naming" note="5 answers, 1 decision, and the values of its tokens"}
#### What gets a name? {#naming-roles}

:label[Tokens and component keys]{tone="info"}

**Why**

Components get their own keys.

**Because of**

- How fast does it change? → Every campaign

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How many token tiers? {#naming-count}

:label[Three]{tone="info"}

**Why**

Primitives, semantics and component keys.

**Because of**

- How fast does it change? → Every campaign

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How are decisions named? {#naming-definition}

:label[By role]{tone="info"}

**Why**

Role names survive each campaign.

**Because of**

- How fast does it change? → Every campaign

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How are names written? {#naming-values}

:label[Lowercase words in paths]{tone="info"}

**Why**

Lowercase paths read the same everywhere.

**Because of**

- Who maintains the system? → An agency

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### What do components read? {#naming-lands}

:label[Component keys]{tone="info"}

**Why**

Campaigns change primitives, never components.

**Because of**

- How fast does it change? → Every campaign

**What it decided (1)**

*Rules it sets (1)*

- For a value with no token, use the closest semantic token, then ask for a new one. Don't use a raw value in the component. The next campaign changes primitives; raw values would stay behind. [Naming →](foundations/naming)
:::

:::fold{id="voice" title="Voice and tone" note="5 answers, 14 decisions, and the values of its tokens"}
#### Which kinds of copy does it need? {#voice-roles}

:label[Labels, messages and headlines]{tone="info"}

**Why**

Headlines carry the campaign.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided**

It sets the values of the voice and tone tokens: [Voice and tone →](foundations/voice)

#### How many tones does it use? {#voice-count}

:label[One per moment]{tone="info"}

**Why**

Playful in headlines, plain in errors.

**Because of**

- What is a costly mistake? → Looking off-brand

**What it decided (7)**

*Rules it sets (2)*

- For the words of an error, use plain first, a light touch after. Don't use a joke before the fix. Playful copy must never hide what went wrong. [Voice →](foundations/voice)
- For a confirmation question, use Plain. No jokes when something is lost. Don't use playful copy. Loss is never the moment for a joke. [Voice →](foundations/voice)

*Variants it picks (5)*

- Badge's danger tone isn't used. Nothing on a launch page is labeled as failed; errors are plain sentences. [Badge →](components/badge)
- Toast's neutral tone. A light note that something changed. [Toast →](components/toast)
- Toast's danger tone. Plain first, a light touch after: That didn't go through. [Toast →](components/toast)
- Alert's default variant isn't used. Alerts here only report a sign-up that did not go through; confirmations go in a toast. [Alert →](components/alert)
- Alert's destructive variant. A sign-up that did not go through: plain first, then how to recover, with a word beside the color. [Alert →](components/alert)

#### How is the voice defined? {#voice-definition}

:label[Principles and examples]{tone="info"}

**Why**

Principles and examples guide each campaign's writers.

**Because of**

- Who maintains the system? → An agency

**What it decided**

It sets the values of the voice and tone tokens: [Voice and tone →](foundations/voice)

#### How does it sound? {#voice-values}

:label[Playful]{tone="info"}

**Why**

Big words, few of them.

**Because of**

- What should the brand feel like? → Bold
- How visible is the brand in the interface? → Loud

**What it decided (6)**

*Rules it sets (5)*

- For a paragraph or help text, use type.body, short. Don't use long paragraphs. Short copy keeps the energy. [Typography →](foundations/typography)
- For a button label, use a short verb that moves: Join, Try, Go. Don't use "Learn more". Big moments need verbs with energy. [Voice →](foundations/voice)
- For a success message, use celebrate, briefly. Don't use a long thank-you. A short celebration is remembered. [Voice →](foundations/voice)
- For an empty state, use playful, with a clear next step. Don't use a dead end. Playful words still need a way forward. [Voice →](foundations/voice)
- For a first visit, use one bold line and one button. Don't use a paragraph of copy. Visitors from a social post give a few seconds. [Voice →](foundations/voice)

*Variants it picks (1)*

- Toast's success tone. Celebrate, briefly: You're on the list. See you at launch. [Toast →](components/toast)

#### Where do the words matter most? {#voice-lands}

:label[Headlines and buttons]{tone="info"}

**Why**

Words work hardest in headlines and buttons.

**Because of**

- Which outcome matters most? → Engagement

**What it decided (1)**

*Rules it sets (1)*

- For a button label, use a short verb that moves: Join, Try, Go. Don't use "Learn more". Big moments need verbs with energy. [Voice →](foundations/voice)
:::

:::fold{id="components" title="Components" note="5 answers, 2 decisions, and the values of its tokens"}
#### Which component families does it need? {#components-roles}

:label[Core, plus media]{tone="info"}

**Why**

Campaigns lead with media and big sections.

**Because of**

- What is the main content? → Images and campaigns
- How visible is the brand in the interface? → Loud

**What it decided (1)**

*Variants it picks (1)*

- Toggle's default variant isn't used. Sections lead with media and color blocks, not toolbars; a toggle with no border is lost on vivid color. [Toggle →](components/toggle)

#### How far does the inventory reach? {#components-count}

:label[Only what today's screens use]{tone="info"}

**Why**

One action and a story need only the parts in use; an agency keeps them fresh.

**Because of**

- How often do people repeat actions? → Rarely
- Who maintains the system? → An agency

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How does a component earn its place? {#components-definition}

:label[It gives the brand a moment]{tone="info"}

**Why**

A component joins when it gives the campaign a moment.

**Because of**

- What should the brand feel like? → Bold
- Which outcome matters most? → Engagement

**What it decided (1)**

*Rules it sets (1)*

- When no component in the inventory fits, use a section built from the inventory with campaign tokens. Don't use a new component for one campaign. Campaigns change the look through tokens; new parts every drop are hard to keep working. [Components →](foundations/components)

#### When does a component get another look? {#components-values}

:label[Also for emphasis and size]{tone="info"}

**Why**

Variants for emphasis and size let each campaign look a little different.

**Because of**

- How fast does it change? → Every campaign
- How visible is the brand in the interface? → Loud

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### Where do components do the most work? {#components-lands}

:label[Campaign sections]{tone="info"}

**Why**

Components sit inside big campaign sections.

**Because of**

- What is the main content? → Images and campaigns
- What is the main task? → Browse and explore

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)
:::
