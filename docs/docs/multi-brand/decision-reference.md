---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1.5
title: "Decision reference"
description: "Multi-brand: each question, its answer, and the design decisions it made."
hide_table_of_contents: true
---

# Decision reference

:::intro{robot="multi-brand" title="Take it one answer at a time"}
This page keeps every decision behind Multi-brand in one place: 79 answers and what each one shaped. It's a reference, not a reading list. Most days you only need one answer.

**Three easy ways in**

- Take a minute with [Where it starts](#where-it-starts). It shows the few first answers the rest grow from.
- Open one section when you wonder why. For example, why Multi-brand's spacing is comfortable, or why its voice is plain and direct.
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
  - :label[Many]{tone="info"} How many brands or products share the system?
    - :label[Looking off-brand]{tone="info"} What is a costly mistake?
    - :label[Neutral and adaptable]{tone="info"} What should the brand feel like?
      - :label[Regular]{tone="info"} typography → `type.body.font-size` `font.size.16`: 1rem
      - :label[Balanced]{tone="info"} color → `color.neutral.0` `color.slate-deep.dark.0`: #020617
      - :label[Soft]{tone="info"} elevation → `elevation.card` `shadow.card-dark`: [object Object]
      - :label[Moderate]{tone="info"} motion → `motion.duration.feedback` `duration.moderate`: 200ms
      - :label[Plain and direct]{tone="info"} voice and tone →
    - :label[Present]{tone="info"} How visible is the brand in the interface?
      - :label[Also for emphasis and size]{tone="info"} components →
    - :label[Each brand brings its own face, on one shared scale]{tone="info"} Which typefaces carry the product, and why?, also because **Neutral and adaptable, Present**
    - :label[A platform team]{tone="info"} Who maintains the system?
      - :label[Lowercase words in paths]{tone="info"} naming →
    - :label[Every month]{tone="info"} How fast does it change?
    - :label[Rounded]{tone="info"} shape → `radius.control` `radius.999`: 9999px
    - :label[Match the text]{tone="info"} iconography → `size.icon` `size.16`: 1rem
    - :label[Light and dark]{tone="info"} theming →
  - :label[Customers who choose us]{tone="info"} Who uses it most?
    - :label[AA]{tone="info"} What accessibility level do we commit to?
    - :label[Sometimes]{tone="info"} How often do people repeat actions?
      - :label[They see it fresh each time]{tone="info"} How do people recall the interface?
    - :label[Low effort to understand]{tone="info"} What must the interface protect?
    - :label[Anywhere, on any device]{tone="info"} Where do people use it?
      - :label[Touch size]{tone="info"} accessibility → `size.control.default` `size.44`: 2.75rem
  - :label[Forms and tasks]{tone="info"} What is the main content?
    - :label[A moderate amount]{tone="info"} How much is on one screen?
      - :label[Comfortable]{tone="info"} spacing → `space.gap.tight` `space.8`: 0.5rem
  - :label[Complete a form]{tone="info"} What is the main task?
    - :label[Completion without errors]{tone="info"} Which outcome matters most?
    - :label[A few minutes]{tone="info"} How long is one visit?

## Every question

All 79, by section, in the order every scheme answers them. Each answer shows why, what it came from, and every design decision it made. The menu in the sidebar opens a section; its number is how many decisions that section made.

### Reasons

:::fold{id="business" title="Business and product" note="2 answers, 35 decisions"}
#### What does the product do for the business? {#business-q1}

:label[Sells and converts]{tone="info"}

**Why**

A company sells several products under several brands.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (4)**

*Answers it led to (4)*

- How many brands or products share the system? → Many
- Who uses it most? → Customers who choose us
- What is the main content? → Forms and tasks
- What is the main task? → Complete a form

#### How many brands or products share the system? {#business-q2}

:label[Many]{tone="info"}

**Why**

Three brands share one system today, more tomorrow.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (31)**

*Answers it led to (31)*

- What is a costly mistake? → Looking off-brand
- What should the brand feel like? → Neutral and adaptable
- How visible is the brand in the interface? → Present
- Which typefaces carry the product, and why? → Each brand brings its own face, on one shared scale
- Who maintains the system? → A platform team
- How fast does it change? → Every month
- Typography · Which text roles does it need? → Core: heading, body, label [Typography →](foundations/typography)
- Typography · How many steps does the type scale take? → One step per kind of text [Typography →](foundations/typography)
- Typography · How are sizes and line heights defined? → A ratio, line heights in proportion [Typography →](foundations/typography)
- Color · Which color roles does it need? → Those and brand accents [Color →](foundations/color)
- Color · How is the palette defined? → Shared neutrals, a ramp per brand [Color →](foundations/color)
- Spacing · How many densities exist? → One [Spacing →](foundations/spacing)
- Spacing · How are spacing steps defined? → Small steps, on a 4px grid [Spacing →](foundations/spacing)
- Shape · Which shape roles does it need? → Controls, badges and containers [Shape →](foundations/shape)
- Shape · How are corners set? → Set by each brand [Shape →](foundations/shape)
- Shape · What should control corners say? → Rounded [Shape →](foundations/shape)
- Motion · How is easing defined? → Standard ease-out [Motion →](foundations/motion)
- Iconography · What icon style? → Outline [Iconography →](foundations/iconography)
- Iconography · How big are icons next to text? → Match the text [Iconography →](foundations/iconography)
- Theming · What can a theme change? → Mode and brand [Theming →](foundations/theming)
- Theming · How many themes ship? → Several [Theming →](foundations/theming)
- Theming · How are brands handled? → Brands as modes [Theming →](foundations/theming)
- Theming · Which modes ship? → Light and dark [Theming →](foundations/theming)
- Accessibility · How many signals carry each meaning? → Two: color and word [Accessibility →](foundations/accessibility)
- Accessibility · Where are the floors hardest to hold? → Brand color [Accessibility →](foundations/accessibility)
- Naming · What gets a name? → Tokens and component keys [Naming →](foundations/naming)
- Naming · How are decisions named? → By role [Naming →](foundations/naming)
- Naming · What do components read? → Component keys [Naming →](foundations/naming)
- Voice and tone · Which kinds of copy does it need? → Labels, messages and headlines [Voice and tone →](foundations/voice)
- Voice and tone · How many tones does it use? → One per brand [Voice and tone →](foundations/voice)
- Voice and tone · How is the voice defined? → A shared core, brand tone on top [Voice and tone →](foundations/voice)
:::

:::fold{id="people" title="People and work context" note="2 answers, 14 decisions"}
#### Who uses it most? {#people-q1}

:label[Customers who choose us]{tone="info"}

**Why**

Customers who chose one of our brands.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (6)**

*Answers it led to (6)*

- What accessibility level do we commit to? → AA
- How often do people repeat actions? → Sometimes
- What must the interface protect? → Low effort to understand
- Where do people use it? → Anywhere, on any device
- Iconography · What do icons do? → Actions, status and navigation [Iconography →](foundations/iconography)
- Iconography · Where do icons work hardest? → Navigation [Iconography →](foundations/iconography)

#### What accessibility level do we commit to? {#people-q2}

:label[AA]{tone="info"}

**Why**

AA in every brand.

**Because of**

- Who uses it most? → Customers who choose us

**What it decided (8)**

*Answers it led to (1)*

- Accessibility · What contrast floor do we hold? → AA [Accessibility →](foundations/accessibility)

*Rules it sets (2)*

- For a field label or column header, use type.label. Don't use type.caption. Labels stay readable in every brand. [Typography →](foundations/typography)
- For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline. Focus follows the brand but always shows. [Accessibility →](foundations/accessibility)

*Variants it picks (5)*

- Button's focus state. Follows the brand, but always shows. [Button →](components/button)
- Button's disabled state. Only with a visible reason next to it. [Button →](components/button)
- Field's vertical orientation. Sign-up and checkout forms: the label above, in every brand. [Field →](components/field)
- Input group's block-start align isn't used. Sign-up and account fields stay one line; field puts the label above, outside the input. [Input group →](components/input-group)
- Input group's block-end align isn't used. Sign-up and account fields stay one line; field shows the hint and error below. [Input group →](components/input-group)
:::

:::fold{id="content" title="Content and data" note="2 answers, 14 decisions"}
#### What is the main content? {#content-q1}

:label[Forms and tasks]{tone="info"}

**Why**

Product pages, sign-up and account forms.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (13)**

*Answers it led to (5)*

- How much is on one screen? → A moderate amount
- Spacing · Which spacing roles does it need? → Gaps, insets and row heights [Spacing →](foundations/spacing)
- Elevation · What separates groups on the page? → Cards [Elevation →](foundations/elevation)
- Components · Which component families does it need? → Core, plus content and media [Components →](foundations/components)
- Components · Where do components do the most work? → Sign-up and account pages [Components →](foundations/components)

*Rules it sets (1)*

- For a number in a table, use type.body. Don't use a mono font. Prices sit in sentences and offers, not in columns to compare, so a mono font adds nothing in any brand. [Typography →](foundations/typography)

*Variants it picks (7)*

- Badge's warning tone isn't used. No plan or order state sits between running and failed; a coming renewal is news, not a warning. [Badge →](components/badge)
- Alert's default variant isn't used. Alerts here are for billing problems; news is a badge or a toast. [Alert →](components/alert)
- Input group's inline-start align. A currency sign or a search icon before the text, from the outline set every brand shares. [Input group →](components/input-group)
- Input group's inline-end align. A unit after the value, the same in every brand. [Input group →](components/input-group)
- Input group's block-start align isn't used. Sign-up and account fields stay one line; field puts the label above, outside the input. [Input group →](components/input-group)
- Input group's block-end align isn't used. Sign-up and account fields stay one line; field shows the hint and error below. [Input group →](components/input-group)
- Item's outline variant. Account settings on their own page, with a border and the corner each brand sets. [Item →](components/item)

#### How much is on one screen? {#content-q2}

:label[A moderate amount]{tone="info"}

**Why**

A moderate amount per screen.

**Because of**

- What is the main content? → Forms and tasks

**What it decided (1)**

*Answers it led to (1)*

- Spacing · How dense is the layout? → Comfortable [Spacing →](foundations/spacing)
:::

:::fold{id="tasks" title="Tasks and flows" note="2 answers, 8 decisions"}
#### What is the main task? {#tasks-q1}

:label[Complete a form]{tone="info"}

**Why**

Customers sign up and buy.

**Because of**

- What does the product do for the business? → Sells and converts

**What it decided (7)**

*Answers it led to (7)*

- Which outcome matters most? → Completion without errors
- How long is one visit? → A few minutes
- Typography · Where does type do the most work? → Forms and labels [Typography →](foundations/typography)
- Color · How many emphasis levels do actions need? → Three [Color →](foundations/color)
- Spacing · Where does spacing matter most? → Between fields [Spacing →](foundations/spacing)
- Motion · What is motion for? → Feedback and guidance [Motion →](foundations/motion)
- Components · Where do components do the most work? → Sign-up and account pages [Components →](foundations/components)

#### How often do people repeat actions? {#tasks-q2}

:label[Sometimes]{tone="info"}

**Why**

Customers return now and then.

**Because of**

- Who uses it most? → Customers who choose us

**What it decided (1)**

*Answers it led to (1)*

- How do people recall the interface? → They see it fresh each time
:::

:::fold{id="human" title="Human factors" note="2 answers, 3 decisions"}
#### What must the interface protect? {#human-q1}

:label[Low effort to understand]{tone="info"}

**Why**

Low effort, whichever brand they see.

**Because of**

- Who uses it most? → Customers who choose us

#### How do people recall the interface? {#human-q2}

:label[They see it fresh each time]{tone="info"}

**Why**

Customers see it fresh each time.

**Because of**

- How often do people repeat actions? → Sometimes

**What it decided (3)**

*Rules it sets (1)*

- For an action on one row or item, use button ghost with a word. Don't use an icon alone. A word says what will happen. [Iconography →](foundations/iconography)

*Variants it picks (2)*

- Button's ghost variant. Row actions, with a word. [Button →](components/button)
- Toggle's outline variant. A single toggle, with a border so it reads as a control in every brand. [Toggle →](components/toggle)
:::

:::fold{id="outcomes" title="Outcomes" note="2 answers, 12 decisions"}
#### Which outcome matters most? {#outcomes-q1}

:label[Completion without errors]{tone="info"}

**Why**

Finished sign-ups and orders.

**Because of**

- What is the main task? → Complete a form

**What it decided (4)**

*Rules it sets (1)*

- For the action that completes the task, use button primary, one per view. Don't use two primaries. One clear action per view. Two primaries split attention. [Color →](foundations/color)

*Variants it picks (3)*

- Button's primary variant. One clear action per view. [Button →](components/button)
- Button's large size isn't used. One clear action per view, at the normal size, in every brand. [Button →](components/button)
- Alert's default variant isn't used. Alerts here are for billing problems; news is a badge or a toast. [Alert →](components/alert)

#### What is a costly mistake? {#outcomes-q2}

:label[Looking off-brand]{tone="info"}

**Why**

A page that looks like the wrong brand loses trust.

**Because of**

- How many brands or products share the system? → Many

**What it decided (8)**

*Answers it led to (1)*

- Components · When does a component get another look? → Also for emphasis and size [Components →](foundations/components)

*Rules it sets (3)*

- For an error message, use color.status.danger and a sentence. Don't use the brand color. Status colors are shared, never branded. [Color →](foundations/color)
- For a delete or remove, use button secondary, then confirm with Button danger. Don't use button primary. Confirm before destroying data. [Color →](foundations/color)
- When no component in the inventory fits, use a component from the inventory with brand tokens. Don't use a component made for one brand. Brands change primitives, never components; one brand-only part breaks the shared library. [Components →](foundations/components)

*Variants it picks (4)*

- Button's secondary variant. The alternative that steps back, and the first step of a delete. [Button →](components/button)
- Button's danger variant. The confirm of a delete, the same red in every brand: danger never follows the brand. [Button →](components/button)
- Badge's danger tone. Card declined: the payment failed, so the plan will stop. [Badge →](components/badge)
- Alert's destructive variant. A billing problem such as a declined card: plain and specific, the same in every brand. [Alert →](components/alert)
:::

:::fold{id="brand" title="Brand" note="3 answers, 19 decisions"}
#### What should the brand feel like? {#brand-q1}

:label[Neutral and adaptable]{tone="info"}

**Why**

A neutral base each brand can color.

**Because of**

- How many brands or products share the system? → Many

**What it decided (7)**

*Answers it led to (6)*

- Which typefaces carry the product, and why? → Each brand brings its own face, on one shared scale
- Typography · How large is body text? → Regular [Typography →](foundations/typography)
- Color · How saturated is the palette? → Balanced [Color →](foundations/color)
- Elevation · How soft are shadows? → Soft [Elevation →](foundations/elevation)
- Motion · How fast does feedback feel? → Moderate [Motion →](foundations/motion)
- Voice and tone · How does it sound? → Plain and direct [Voice and tone →](foundations/voice)

*Rules it sets (1)*

- When no component in the inventory fits, use a component from the inventory with brand tokens. Don't use a component made for one brand. Brands change primitives, never components; one brand-only part breaks the shared library. [Components →](foundations/components)

#### How visible is the brand in the interface? {#brand-q2}

:label[Present]{tone="info"}

**Why**

Each brand is clearly present.

**Because of**

- How many brands or products share the system? → Many

**What it decided (5)**

*Answers it led to (5)*

- Which typefaces carry the product, and why? → Each brand brings its own face, on one shared scale
- Color · Where does color carry meaning first? → Brand moments [Color →](foundations/color)
- Shape · Where does shape show most? → Buttons and badges [Shape →](foundations/shape)
- Voice and tone · Where do the words matter most? → Headlines and buttons [Voice and tone →](foundations/voice)
- Components · When does a component get another look? → Also for emphasis and size [Components →](foundations/components)

#### Which typefaces carry the product, and why? {#brand-q3}

:label[Each brand brings its own face, on one shared scale]{tone="info"}

**Why**

Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one.

**What it weighs (11)**

*Reading*

- **Readability.** All three are screen sans faces with open shapes; the shared scale keeps body size and line height the same in every brand.
- **Legibility.** Each brand checks its face's confusable characters in its own data; the scale gives every brand the same sizes to check at.

*Range*

- **Scalability.** All three have a wide range of weights, so every role in the shared scale has a weight in every brand.
- **Numerals.** Inter has tabular figures; the brands that show tables lean on it.
- **Scripts and languages.** Latin, with accents, in all three; Poppins also covers Devanagari. Other scripts need a face per brand.

*Brand*

- **Recognition.** The face is how each brand is known on a shared system.
- **Familiarity.** Inter, Plus Jakarta Sans and Poppins are widely seen on the web, so none feels strange.
- **Personality.** A neutral base each brand can color: the face carries the brand, the scale stays neutral.

*Delivery*

- **Performance.** One family per brand: a page loads only its own brand's face.
- **Licensing.** SIL Open Font License, all three: free to embed in apps and on the web.
- **Fallback and pairing.** Each falls back to system-ui, as its tokens say; the shared scale keeps the layout steady while a face loads.

**Because of**

- How many brands or products share the system? → Many
- What should the brand feel like? → Neutral and adaptable
- How visible is the brand in the interface? → Present

**What it decided (7)**

*Theme picks it sets (7)*

- type.display.font-family: inter for display text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one. [Typography →](foundations/typography)
- type.title.font-family: inter for title text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one. [Typography →](foundations/typography)
- type.heading.font-family: inter for heading text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one. [Typography →](foundations/typography)
- type.body.font-family: inter for body text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one. [Typography →](foundations/typography)
- type.label.font-family: inter for label text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one. [Typography →](foundations/typography)
- type.caption.font-family: inter for caption text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one. [Typography →](foundations/typography)
- type.data.font-family: inter for data text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one. [Typography →](foundations/typography)
:::

:::fold{id="scenarios" title="Use scenarios" note="2 answers, 3 decisions"}
#### Where do people use it? {#scenarios-q1}

:label[Anywhere, on any device]{tone="info"}

**Why**

Customers sign up on phones and manage plans on laptops.

**Because of**

- Who uses it most? → Customers who choose us

**What it decided (3)**

*Answers it led to (1)*

- Accessibility · What is the smallest target? → Touch size [Accessibility →](foundations/accessibility)

*Variants it picks (2)*

- Field's vertical orientation. Sign-up and checkout forms: the label above, in every brand. [Field →](components/field)
- Field's responsive orientation. Account settings: stacked on phones, label beside on laptops. [Field →](components/field)

#### How long is one visit? {#scenarios-q2}

:label[A few minutes]{tone="info"}

**Why**

Most visits are a few minutes: sign up, check, change.

**Because of**

- What is the main task? → Complete a form
:::

:::fold{id="team" title="Team and delivery" note="2 answers, 8 decisions"}
#### Who maintains the system? {#team-q1}

:label[A platform team]{tone="info"}

**Why**

A platform team serves three product teams.

**Because of**

- How many brands or products share the system? → Many

**What it decided (5)**

*Answers it led to (5)*

- Naming · How are names written? → Lowercase words in paths [Naming →](foundations/naming)
- Voice and tone · How is the voice defined? → A shared core, brand tone on top [Voice and tone →](foundations/voice)
- Components · Which component families does it need? → Core, plus content and media [Components →](foundations/components)
- Components · How far does the inventory reach? → What today's screens use, plus what the next ones will likely need [Components →](foundations/components)
- Components · How does a component earn its place? → Its family is in the roles, so product teams find it ready [Components →](foundations/components)

#### How fast does it change? {#team-q2}

:label[Every month]{tone="info"}

**Why**

Brands ship every month.

**Because of**

- How many brands or products share the system? → Many

**What it decided (3)**

*Answers it led to (3)*

- Naming · How many token tiers? → Three [Naming →](foundations/naming)
- Components · How far does the inventory reach? → What today's screens use, plus what the next ones will likely need [Components →](foundations/components)
- Components · How does a component earn its place? → Its family is in the roles, so product teams find it ready [Components →](foundations/components)
:::

### Scopes

:::fold{id="typography" title="Typography" note="5 answers, 2 decisions, and the values of its tokens"}
#### Which text roles does it need? {#typography-roles}

:label[Core: heading, body, label]{tone="info"}

**Why**

One set of roles across brands.

**Because of**

- How many brands or products share the system? → Many

**What it decided (1)**

*Rules it sets (1)*

- For a page title, use type.title in the brand font. Don't use a brand-specific style. Roles stay shared; only the brand font changes. [Typography →](foundations/typography)

#### How many steps does the type scale take? {#typography-count}

:label[One step per kind of text]{tone="info"}

**Why**

One size per kind of text suits every brand font.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How are sizes and line heights defined? {#typography-definition}

:label[A ratio, line heights in proportion]{tone="info"}

**Why**

Ratios work with every brand font.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How large is body text? {#typography-values}

:label[Regular]{tone="info"}

**Why**

Regular body size suits all brands.

**Because of**

- What should the brand feel like? → Neutral and adaptable

**What it decided (1)**

*Rules it sets (1)*

- For a paragraph or help text, use type.body. Don't use type.caption. Regular body size suits every brand. [Typography →](foundations/typography)

#### Where does type do the most work? {#typography-lands}

:label[Forms and labels]{tone="info"}

**Why**

Sign-up and account forms carry most text.

**Because of**

- What is the main task? → Complete a form

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)
:::

:::fold{id="color" title="Color" note="5 answers, 90 decisions, and the values of its tokens"}
#### Which color roles does it need? {#color-roles}

:label[Those and brand accents]{tone="info"}

**Why**

Each brand brings its own accent ramp.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### How many emphasis levels do actions need? {#color-count}

:label[Three]{tone="info"}

**Why**

Primary, secondary and ghost in every brand.

**Because of**

- What is the main task? → Complete a form

**What it decided (28)**

*Rules it sets (1)*

- For an alternative or cancel, use button secondary. Don't use a second primary. The alternative steps back, so the one primary stays clear. A second primary would compete with it. [Color →](foundations/color)

*Variants it picks (1)*

- Button's secondary variant. The alternative that steps back, and the first step of a delete. [Button →](components/button)

*Theme picks it sets (26)*

- color.action.primary in light: teal.light.600: the primary action's fill; its label reads, 5.47:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 17.85:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.600: the danger action's fill; its label reads, 5.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in light: teal.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.47:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in light: teal.light.100: a tag's tint; text on it reads, 15.46:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.2 in light: purple.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.1:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in light: purple.light.100: a tag's tint; text on it reads, 15.13:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.3 in light: orange.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.18:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in light: orange.light.100: a tag's tint; text on it reads, 15.49:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.4 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in light: blue.light.100: a tag's tint; text on it reads, 13.87:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.5 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in light: green.light.100: a tag's tint; text on it reads, 15.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary in dark: teal.dark.600: the primary action's fill; its label reads, 9.9:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 17.06:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.52:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in dark: teal.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 9.9:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in dark: teal.dark.100: a tag's tint; text on it reads, 14.42:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.2 in dark: purple.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.8:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in dark: purple.dark.100: a tag's tint; text on it reads, 15.5:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.3 in dark: orange.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 9.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in dark: orange.dark.100: a tag's tint; text on it reads, 15.04:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.4 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.47:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in dark: blue.dark.100: a tag's tint; text on it reads, 15.1:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.5 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.08:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in dark: green.dark.100: a tag's tint; text on it reads, 14.95:1, above the 4.5:1 floor. [Color →](foundations/color)

#### How is the palette defined? {#color-definition}

:label[Shared neutrals, a ramp per brand]{tone="info"}

**Why**

Shared neutrals; each brand sets its own ramp.

**Because of**

- How many brands or products share the system? → Many

**What it decided (36)**

*Theme picks it sets (36)*

- color.neutral.0 in light: slate-deep.light.0: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.50 in light: slate-deep.light.50: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.100 in light: slate-deep.light.100: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.200 in light: slate-deep.light.200: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.300 in light: slate-deep.light.300: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.400 in light: slate-deep.light.400: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.500 in light: slate-deep.light.500: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.600 in light: slate-deep.light.600: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.700 in light: slate-deep.light.700: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.800 in light: slate-deep.light.800: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.900 in light: slate-deep.light.900: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.950 in light: slate-deep.light.950: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.surface.canvas in light: neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch. [Color →](foundations/color)
- color.surface.selected in light: teal.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in light: teal.light.600: the focus ring, so the keyboard's place is never lost, 5.47:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.neutral.0 in dark: slate-deep.dark.0: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.50 in dark: slate-deep.dark.50: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.100 in dark: slate-deep.dark.100: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.200 in dark: slate-deep.dark.200: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.300 in dark: slate-deep.dark.300: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.400 in dark: slate-deep.dark.400: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.500 in dark: slate-deep.dark.500: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.600 in dark: slate-deep.dark.600: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.700 in dark: slate-deep.dark.700: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.800 in dark: slate-deep.dark.800: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.900 in dark: slate-deep.dark.900: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.neutral.950 in dark: slate-deep.dark.950: the scheme's neutral is slate-deep. Shared neutrals; each brand sets its own ramp. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch. [Color →](foundations/color)
- color.surface.selected in dark: teal.dark.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in dark: teal.dark.600: the focus ring, so the keyboard's place is never lost, 9.9:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)

#### How saturated is the palette? {#color-values}

:label[Balanced]{tone="info"}

**Why**

Balanced, so any brand hue works.

**Because of**

- What should the brand feel like? → Neutral and adaptable

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### Where does color carry meaning first? {#color-lands}

:label[Brand moments]{tone="info"}

**Why**

Brand color shows on actions and headlines.

**Because of**

- How visible is the brand in the interface? → Present

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
- color.category.1 in light: teal.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.47:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in light: purple.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.1:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in light: orange.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.18:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.status.info in dark: blue.dark.600: info reads as text and icons, 8.47:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info.subtle in dark: blue.dark.100: a quiet tint behind info; its text, 12.27:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 8.08:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 13.69:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 9.97:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 12.89:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 12.74:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in dark: teal.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 9.9:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in dark: purple.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.8:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in dark: orange.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 9.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.47:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.08:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
:::

:::fold{id="spacing" title="Spacing" note="5 answers, 8 decisions, and the values of its tokens"}
#### Which spacing roles does it need? {#spacing-roles}

:label[Gaps, insets and row heights]{tone="info"}

**Why**

Account tables need a row height.

**Because of**

- What is the main content? → Forms and tasks

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How many densities exist? {#spacing-count}

:label[One]{tone="info"}

**Why**

One density across brands.

**Because of**

- How many brands or products share the system? → Many

**What it decided (6)**

*Rules it sets (1)*

- For items that belong together, use space.gap.default. Don't use brand-specific spacing. Spacing is shared across brands. [Spacing →](foundations/spacing)

*Variants it picks (5)*

- Sidebar's default size. Every account-area menu item. [Sidebar →](components/sidebar)
- Sidebar's sm size isn't used. One density across brands. [Sidebar →](components/sidebar)
- Sidebar's lg size isn't used. One density across brands. [Sidebar →](components/sidebar)
- Item's sm size isn't used. One density across brands, at touch size. [Item →](components/item)
- Toggle's lg size isn't used. One density across brands. [Toggle →](components/toggle)

#### How are spacing steps defined? {#spacing-definition}

:label[Small steps, on a 4px grid]{tone="info"}

**Why**

Every brand shares one set of steps, so they sit on a 4px grid: small enough for account forms, with big ones for product pages.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How dense is the layout? {#spacing-values}

:label[Comfortable]{tone="info"}

**Why**

Comfortable spacing in every brand.

**Because of**

- How much is on one screen? → A moderate amount

**What it decided (2)**

*Rules it sets (1)*

- For a table row height, use size.row (comfortable). Don't use a compact row. Customers browse on phones, and compact rows are hard to tap in any brand. [Spacing →](foundations/spacing)

*Theme picks it sets (1)*

- radius.option: radius.4: the panel's 8px corner less its 4px padding, so an option's corner nests inside the menu's. [Shape →](foundations/shape)

#### Where does spacing matter most? {#spacing-lands}

:label[Between fields]{tone="info"}

**Why**

Space matters most between form fields.

**Because of**

- What is the main task? → Complete a form

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)
:::

:::fold{id="shape" title="Shape" note="5 answers, 10 decisions, and the values of its tokens"}
#### Which shape roles does it need? {#shape-roles}

:label[Controls, badges and containers]{tone="info"}

**Why**

Each brand sets three corners.

**Because of**

- How many brands or products share the system? → Many

**What it decided (5)**

*Answers it led to (1)*

- Shape · How many corner sizes exist? → Three [Shape →](foundations/shape)

*Theme picks it sets (4)*

- radius.control: radius.4: Rounded by default; each brand sets its own corner. [Shape →](foundations/shape)
- radius.badge: radius.4: Rounded by default; each brand sets its own corner. [Shape →](foundations/shape)
- radius.option: radius.4: the panel's 8px corner less its 4px padding, so an option's corner nests inside the menu's. [Shape →](foundations/shape)
- radius.container: radius.8: Rounded by default; each brand sets its own corner. [Shape →](foundations/shape)

#### How many corner sizes exist? {#shape-count}

:label[Three]{tone="info"}

**Why**

Control, badge and container.

**Because of**

- Shape · Which shape roles does it need? → Controls, badges and containers

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)

#### How are corners set? {#shape-definition}

:label[Set by each brand]{tone="info"}

**Why**

Each brand sets its own corners.

**Because of**

- How many brands or products share the system? → Many

**What it decided (1)**

*Variants it picks (1)*

- Item's outline variant. Account settings on their own page, with a border and the corner each brand sets. [Item →](components/item)

#### What should control corners say? {#shape-values}

:label[Rounded]{tone="info"}

**Why**

Rounded by default; each brand sets its own corner.

**Because of**

- How many brands or products share the system? → Many

**What it decided (4)**

*Rules it sets (1)*

- For the corners of buttons and inputs, use radius.control (set by the brand). Don't use a hard-coded radius. Each brand sets its own corner through the theme. [Shape →](foundations/shape)

*Theme picks it sets (3)*

- radius.control: radius.4: Rounded by default; each brand sets its own corner. [Shape →](foundations/shape)
- radius.badge: radius.4: Rounded by default; each brand sets its own corner. [Shape →](foundations/shape)
- radius.container: radius.8: Rounded by default; each brand sets its own corner. [Shape →](foundations/shape)

#### Where does shape show most? {#shape-lands}

:label[Buttons and badges]{tone="info"}

**Why**

Corners are the most visible brand difference.

**Because of**

- How visible is the brand in the interface? → Present

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)
:::

:::fold{id="elevation" title="Elevation" note="5 answers, 27 decisions, and the values of its tokens"}
#### What rises above the page? {#elevation-roles}

:label[Cards too]{tone="info"}

**Why**

Cards lift slightly to group offers.

**Because of**

- Elevation · What separates groups on the page? → Cards

**What it decided (11)**

*Answers it led to (2)*

- Elevation · How many shadow levels exist? → Two [Elevation →](foundations/elevation)
- Elevation · Where does elevation show? → Cards, menus and dialogs [Elevation →](foundations/elevation)

*Rules it sets (1)*

- For a card on the page, use elevation.card. Don't use a border only. Cards lift slightly to group offers. [Elevation →](foundations/elevation)

*Theme picks it sets (8)*

- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill. [Color →](foundations/color)
- color.surface.scrim in light: black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in light: shadow.card: Cards lift slightly to group offers. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.overlay: Soft shadows fit every brand. [Elevation →](foundations/elevation)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light. [Color →](foundations/color)
- color.surface.scrim in dark: black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in dark: shadow.card-dark: Cards lift slightly to group offers. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.overlay-dark: Soft shadows fit every brand. [Elevation →](foundations/elevation)

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

Cards group plans and offers.

**Because of**

- What is the main content? → Forms and tasks

**What it decided (11)**

*Answers it led to (1)*

- Elevation · What rises above the page? → Cards too [Elevation →](foundations/elevation)

*Rules it sets (1)*

- Between page sections, use space.gap.section and cards. Don't use lines. Cards hold each offer together, so customers compare offers as units in every brand. Lines would split an offer apart. [Spacing →](foundations/spacing)

*Variants it picks (1)*

- Item's default variant. Settings inside a card or menu, which already gives the frame. [Item →](components/item)

*Theme picks it sets (8)*

- color.surface.canvas in light: neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)

#### How soft are shadows? {#elevation-values}

:label[Soft]{tone="info"}

**Why**

Soft shadows fit every brand.

**Because of**

- What should the brand feel like? → Neutral and adaptable

**What it decided (4)**

*Theme picks it sets (4)*

- elevation.card in light: shadow.card: Cards lift slightly to group offers. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.overlay: Soft shadows fit every brand. [Elevation →](foundations/elevation)
- elevation.card in dark: shadow.card-dark: Cards lift slightly to group offers. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.overlay-dark: Soft shadows fit every brand. [Elevation →](foundations/elevation)

#### Where does elevation show? {#elevation-lands}

:label[Cards, menus and dialogs]{tone="info"}

**Why**

Cards, menus and dialogs rise.

**Because of**

- Elevation · What rises above the page? → Cards too

**What it decided (1)**

*Rules it sets (1)*

- For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow. The shadow shows a menu or dialog floats above the page. Without it, it blends into the cards. [Elevation →](foundations/elevation)
:::

:::fold{id="motion" title="Motion" note="5 answers, 5 decisions, and the values of its tokens"}
#### What is motion for? {#motion-roles}

:label[Feedback and guidance]{tone="info"}

**Why**

Feedback and guidance through sign-up.

**Because of**

- What is the main task? → Complete a form

**What it decided (3)**

*Answers it led to (2)*

- Motion · How many speeds exist? → Two [Motion →](foundations/motion)
- Motion · Where does motion show? → State changes and panels [Motion →](foundations/motion)

*Rules it sets (1)*

- When someone asks for less motion, use reduced motion. Don't use full motion. Motion is reduced, not removed: a fade keeps the change visible, and nothing slides. [Motion →](foundations/motion)

#### How many speeds exist? {#motion-count}

:label[Two]{tone="info"}

**Why**

One speed for feedback, one for panels.

**Because of**

- Motion · What is motion for? → Feedback and guidance

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How is easing defined? {#motion-definition}

:label[Standard ease-out]{tone="info"}

**Why**

A standard ease-out across brands.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How fast does feedback feel? {#motion-values}

:label[Moderate]{tone="info"}

**Why**

Moderate speed across brands.

**Because of**

- What should the brand feel like? → Neutral and adaptable

**What it decided (2)**

*Rules it sets (1)*

- For hover and press feedback, use motion.duration.feedback (moderate). Don't use brand-specific motion. Motion is shared, so one component library behaves the same in every brand. [Motion →](foundations/motion)

*Variants it picks (1)*

- Button's hover state. Moderate feedback, shared across brands. [Button →](components/button)

#### Where does motion show? {#motion-lands}

:label[State changes and panels]{tone="info"}

**Why**

State changes and panels move.

**Because of**

- Motion · What is motion for? → Feedback and guidance

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)
:::

:::fold{id="iconography" title="Iconography" note="5 answers, 5 decisions, and the values of its tokens"}
#### What do icons do? {#iconography-roles}

:label[Actions, status and navigation]{tone="info"}

**Why**

Icons for actions, status and navigation.

**Because of**

- Who uses it most? → Customers who choose us

**What it decided (2)**

*Rules it sets (1)*

- For an icon with no label, use not used: always add a word; a popover explains a fee. Don't use an icon button with a hover hint. On touch screens hover hints never show; a word says what will happen. [Iconography →](foundations/iconography)

*Variants it picks (1)*

- Button's icon size isn't used. Customers use any device and hover hints never show on touch, so every button has a word. [Button →](components/button)

#### How many icon sizes exist? {#iconography-count}

:label[One]{tone="info"}

**Why**

One size next to text.

**Because of**

- Iconography · How big are icons next to text? → Match the text

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)

#### What icon style? {#iconography-definition}

:label[Outline]{tone="info"}

**Why**

One outline set for every brand.

**Because of**

- How many brands or products share the system? → Many

**What it decided (2)**

*Variants it picks (2)*

- Empty's icon variant. An icon in a small tile, from the one outline set every brand shares. [Empty →](components/empty)
- Input group's inline-start align. A currency sign or a search icon before the text, from the outline set every brand shares. [Input group →](components/input-group)

#### How big are icons next to text? {#iconography-values}

:label[Match the text]{tone="info"}

**Why**

Icons match the text.

**Because of**

- How many brands or products share the system? → Many

**What it decided (1)**

*Answers it led to (1)*

- Iconography · How many icon sizes exist? → One [Iconography →](foundations/iconography)

#### Where do icons work hardest? {#iconography-lands}

:label[Navigation]{tone="info"}

**Why**

Icons help most in navigation.

**Because of**

- Who uses it most? → Customers who choose us

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)
:::

:::fold{id="theming" title="Theming" note="5 answers, 15 decisions, and the values of its tokens"}
#### What can a theme change? {#theming-roles}

:label[Mode and brand]{tone="info"}

**Why**

Brand and mode both change.

**Because of**

- How many brands or products share the system? → Many

**What it decided (1)**

*Answers it led to (1)*

- Theming · What changes when the theme changes? → Colors, type and shape [Theming →](foundations/theming)

#### How many themes ship? {#theming-count}

:label[Several]{tone="info"}

**Why**

Three brands in light and dark: six themes.

**Because of**

- How many brands or products share the system? → Many
- Theming · Which modes ship? → Light and dark

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)

#### How are brands handled? {#theming-definition}

:label[Brands as modes]{tone="info"}

**Why**

Brands are theme modes over shared semantics.

**Because of**

- How many brands or products share the system? → Many

**What it decided (12)**

*Rules it sets (7)*

- For a page title, use type.title in the brand font. Don't use a brand-specific style. Roles stay shared; only the brand font changes. [Typography →](foundations/typography)
- For a selected row or item, use color.surface.selected (from the brand). Don't use a fixed blue. Selection follows the brand color. [Color →](foundations/color)
- For a link, use color.text.link (from the brand). Don't use a fixed blue. Links take the brand's color, so they look native in each brand. A fixed blue would clash with some brands. [Color →](foundations/color)
- For the corners of buttons and inputs, use radius.control (set by the brand). Don't use a hard-coded radius. Each brand sets its own corner through the theme. [Shape →](foundations/shape)
- For the shape of a status badge, use radius.badge (set by the brand). Don't use a hard-coded shape. The brand sets the badge shape. [Shape →](foundations/shape)
- When someone switches to dark, use the dark mode of the active brand. Don't use one dark theme for all brands. Every brand ships light and dark. [Theming →](foundations/theming)
- For a value with no token, use the closest semantic token, then ask for a new one. Don't use a raw value or a brand primitive in the component. A raw value shows the same in every brand, so it breaks the theme. [Naming →](foundations/naming)

*Variants it picks (5)*

- Sidebar's default variant. Account-area menu items, the same in every brand. [Sidebar →](components/sidebar)
- Sidebar's outline variant isn't used. Brands change color and corners, not the structure of the menu. [Sidebar →](components/sidebar)
- Empty's default variant isn't used. Shared structure in every brand: no brand pictures in empty states. [Empty →](components/empty)
- Item's muted variant. The current setting, with a soft fill from the brand. [Item →](components/item)
- Toggle's outline variant. A single toggle, with a border so it reads as a control in every brand. [Toggle →](components/toggle)

#### Which modes ship? {#theming-values}

:label[Light and dark]{tone="info"}

**Why**

Light and dark ship for every brand.

**Because of**

- How many brands or products share the system? → Many

**What it decided (2)**

*Answers it led to (1)*

- Theming · How many themes ship? → Several [Theming →](foundations/theming)

*Rules it sets (1)*

- When someone switches to dark, use the dark mode of the active brand. Don't use one dark theme for all brands. Every brand ships light and dark. [Theming →](foundations/theming)

#### What changes when the theme changes? {#theming-lands}

:label[Colors, type and shape]{tone="info"}

**Why**

A brand switch changes colors, fonts and corners.

**Because of**

- Theming · What can a theme change? → Mode and brand

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)
:::

:::fold{id="accessibility" title="Accessibility" note="5 answers, 109 decisions, and the values of its tokens"}
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
- color.action.primary.hover in light: teal.light.700: one step from the primary action (teal.light.600), so the pointer shows; its label still reads 8.34:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 16.3:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.700: one step from the danger action (red.light.600), so the pointer shows; its label still reads 8.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.disabled.text in light: neutral.500: 4.76:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in light: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in light: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch. [Color →](foundations/color)
- color.action.primary.hover in dark: teal.dark.700: one step from the primary action (teal.dark.600), so the pointer shows; its label still reads 11.65:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 13.98:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.61:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.disabled.text in dark: neutral.500: 12.02:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in dark: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in dark: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)

#### How many signals carry each meaning? {#accessibility-count}

:label[Two: color and word]{tone="info"}

**Why**

Brand colors vary, so meaning needs a word.

**Because of**

- How many brands or products share the system? → Many

**What it decided (26)**

*Rules it sets (2)*

- For an error message, use color.status.danger and a sentence. Don't use the brand color. Status colors are shared, never branded. [Color →](foundations/color)
- For a status, use badge with a word. Don't use a brand color as status. Brand hues vary, so meaning needs a word. [Color →](foundations/color)

*Variants it picks (6)*

- Badge's neutral tone. Trial: the plan works and billing has not started. [Badge →](components/badge)
- Badge's info tone. Renews in 3 days: a payment is coming; nothing has gone wrong. [Badge →](components/badge)
- Badge's success tone. Active: the plan is paid and running. [Badge →](components/badge)
- Badge's warning tone isn't used. No plan or order state sits between running and failed; a coming renewal is news, not a warning. [Badge →](components/badge)
- Badge's danger tone. Card declined: the payment failed, so the plan will stop. [Badge →](components/badge)
- Alert's destructive variant. A billing problem such as a declined card: plain and specific, the same in every brand. [Alert →](components/alert)

*Theme picks it sets (18)*

- color.text.info-on-light: blue.light.800: info text on its own tint, 12.97:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: blue.light.100: info text on its own tint, 12.27:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 13.69:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 12.89:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 12.74:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.selected in light: teal.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in light: blue.light.100: a quiet tint behind info; its text, 12.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in light: green.light.100: a quiet tint behind success; its text, 10.79:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in light: amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in light: red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.selected in dark: teal.dark.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in dark: blue.dark.100: a quiet tint behind info; its text, 12.27:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 13.69:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 12.89:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 12.74:1, above the 4.5:1 floor. [Color →](foundations/color)

#### What contrast floor do we hold? {#accessibility-definition}

:label[AA]{tone="info"}

**Why**

AA in every brand and mode.

**Because of**

- What accessibility level do we commit to? → AA

**What it decided (56)**

*Theme picks it sets (56)*

- color.text.on-light: slate-deep.light.900: the text for every light fill, 17.85:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-dark: slate-deep.light.0: the text for every dark fill, 5.47:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-light: blue.light.800: info text on its own tint, 12.97:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: blue.light.100: info text on its own tint, 12.27:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 13.69:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 12.89:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 12.74:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.default in light: neutral.0: the base for content; body text reads 17.85:1 on it, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.inverse in light: neutral.900: the reverse of content for short messages; its text reads, 17.85:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.primary in light: neutral.900: the strongest text step, 17.85:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.secondary in light: neutral.700: supporting text, 10.35:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.muted in light: neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.inverse in light: text.on-dark: the text its fill's tone picks, 17.85:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-action in light: text.on-dark: the text its fill's tone picks, 5.47:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.link in light: teal.light.700: a link, set apart by its hue, 8.34:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-danger in light: text.on-dark: the text its fill's tone picks, 5.63:1 on action.danger, above the 4.5:1 floor. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in light: neutral.500: the edge of a control people must find, 4.76:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in light: teal.light.600: the focus ring, so the keyboard's place is never lost, 5.47:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in light: teal.light.600: the edge beside a selected fill, so selection is never color alone, 5.47:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in light: teal.light.600: the primary action's fill; its label reads, 5.47:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary.hover in light: teal.light.700: one step from the primary action (teal.light.600), so the pointer shows; its label still reads 8.34:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 17.85:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 16.3:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.600: the danger action's fill; its label reads, 5.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.700: one step from the danger action (red.light.600), so the pointer shows; its label still reads 8.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info in light: blue.light.600: info reads as text and icons, 10.11:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in light: green.light.600: success reads as text and icons, 5.38:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in light: amber.light.600: warning reads as text and icons, 6.16:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in light: red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.default in dark: neutral.50: the base for content; body text reads 17.06:1 on it, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.inverse in dark: neutral.900: the reverse of content for short messages; its text reads, 17.06:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.primary in dark: neutral.900: the strongest text step, 17.06:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.secondary in dark: neutral.500: supporting text, 12.02:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.muted in dark: neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.inverse in dark: text.on-light: the text its fill's tone picks, 17.06:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-action in dark: text.on-light: the text its fill's tone picks, 9.9:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.link in dark: teal.dark.700: a link, set apart by its hue, 11.65:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-danger in dark: text.on-light: the text its fill's tone picks, 7.52:1 on action.danger, above the 4.5:1 floor. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in dark: neutral.400: the edge of a control people must find, 6.97:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in dark: teal.dark.600: the focus ring, so the keyboard's place is never lost, 9.9:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in dark: teal.dark.600: the edge beside a selected fill, so selection is never color alone, 9.9:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in dark: teal.dark.600: the primary action's fill; its label reads, 9.9:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary.hover in dark: teal.dark.700: one step from the primary action (teal.dark.600), so the pointer shows; its label still reads 11.65:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 17.06:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 13.98:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.52:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.61:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info in dark: blue.dark.600: info reads as text and icons, 8.47:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 8.08:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 9.97:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)

#### What is the smallest target? {#accessibility-values}

:label[Touch size]{tone="info"}

**Why**

Customers sign up on phones.

**Because of**

- Where do people use it? → Anywhere, on any device

**What it decided (11)**

*Answers it led to (1)*

- Accessibility · Which states get their own visible value? → Those and pressed [Accessibility →](foundations/accessibility)

*Rules it sets (2)*

- For an icon with no label, use not used: always add a word; a popover explains a fee. Don't use an icon button with a hover hint. On touch screens hover hints never show; a word says what will happen. [Iconography →](foundations/iconography)
- For the smallest clickable thing, use size.control.default (touch). Don't use a compact control. Customers are often on phones. [Accessibility →](foundations/accessibility)

*Variants it picks (8)*

- Button's default size. Every button, at touch size: customers are often on phones. [Button →](components/button)
- Button's compact size isn't used. Customers are often on phones: no compact controls. [Button →](components/button)
- Button's icon size isn't used. Customers use any device and hover hints never show on touch, so every button has a word. [Button →](components/button)
- Field's horizontal orientation isn't used. Customers sign up on phones: labels stay above. [Field →](components/field)
- Item's default size. Every row, at touch size: customers are often on phones. [Item →](components/item)
- Item's sm size isn't used. One density across brands, at touch size. [Item →](components/item)
- Toggle's default size. Every toggle, at touch size: customers are often on phones. [Toggle →](components/toggle)
- Toggle's sm size isn't used. Customers are often on phones: no compact controls. [Toggle →](components/toggle)

#### Where are the floors hardest to hold? {#accessibility-lands}

:label[Brand color]{tone="info"}

**Why**

Brand colors must pass in every mode.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the accessibility tokens: [Accessibility →](foundations/accessibility)
:::

:::fold{id="naming" title="Naming" note="5 answers, 2 decisions, and the values of its tokens"}
#### What gets a name? {#naming-roles}

:label[Tokens and component keys]{tone="info"}

**Why**

Components get their own keys, shared by every brand.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How many token tiers? {#naming-count}

:label[Three]{tone="info"}

**Why**

Primitives, semantics and component keys.

**Because of**

- How fast does it change? → Every month

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How are decisions named? {#naming-definition}

:label[By role]{tone="info"}

**Why**

Role names stay the same in every brand.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How are names written? {#naming-values}

:label[Lowercase words in paths]{tone="info"}

**Why**

Lowercase paths read the same everywhere.

**Because of**

- Who maintains the system? → A platform team

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### What do components read? {#naming-lands}

:label[Component keys]{tone="info"}

**Why**

Components never change; brand primitives do.

**Because of**

- How many brands or products share the system? → Many

**What it decided (2)**

*Rules it sets (1)*

- For a value with no token, use the closest semantic token, then ask for a new one. Don't use a raw value or a brand primitive in the component. A raw value shows the same in every brand, so it breaks the theme. [Naming →](foundations/naming)

*Variants it picks (1)*

- Input group's inline-end align. A unit after the value, the same in every brand. [Input group →](components/input-group)
:::

:::fold{id="voice" title="Voice and tone" note="5 answers, 13 decisions, and the values of its tokens"}
#### Which kinds of copy does it need? {#voice-roles}

:label[Labels, messages and headlines]{tone="info"}

**Why**

Each brand has headlines on top of shared UI copy.

**Because of**

- How many brands or products share the system? → Many

**What it decided**

It sets the values of the voice and tone tokens: [Voice and tone →](foundations/voice)

#### How many tones does it use? {#voice-count}

:label[One per brand]{tone="info"}

**Why**

A shared core, with a tone per brand.

**Because of**

- How many brands or products share the system? → Many

**What it decided (2)**

*Rules it sets (1)*

- For a success message, use brand tone allowed: Aster calm, Birch friendly, Coral upbeat. Don't use the same flat line in every brand. Success is a safe moment for brand tone. [Voice →](foundations/voice)

*Variants it picks (1)*

- Toast's success tone. Brand tone allowed: Aster calm, Birch friendly, Coral upbeat. [Toast →](components/toast)

#### How is the voice defined? {#voice-definition}

:label[A shared core, brand tone on top]{tone="info"}

**Why**

Errors and confirmations are shared; brand tone sits on top.

**Because of**

- How many brands or products share the system? → Many
- Who maintains the system? → A platform team

**What it decided (8)**

*Rules it sets (4)*

- For a button label, use a shared verb; the brand may choose the headline verb. Don't use brand slang on account actions. Shared labels keep the account area the same in every brand. [Voice →](foundations/voice)
- For the words of an error, use shared across brands: plain and specific. Don't use brand tone in errors. Errors read the same in every brand, so support can help anyone. [Voice →](foundations/voice)
- For an empty state, use shared structure, brand words. Don't use a different structure per brand. The structure is the shared core; words carry the brand. [Voice →](foundations/voice)
- For a confirmation question, use shared across brands: plain and specific. Don't use brand tone when something is lost. Loss is never the moment for personality. [Voice →](foundations/voice)

*Variants it picks (4)*

- Alert's destructive variant. A billing problem such as a declined card: plain and specific, the same in every brand. [Alert →](components/alert)
- Toast's neutral tone. A shared line with brand words. [Toast →](components/toast)
- Toast's danger tone. Shared across brands: plain and specific. [Toast →](components/toast)
- Empty's default variant isn't used. Shared structure in every brand: no brand pictures in empty states. [Empty →](components/empty)

#### How does it sound? {#voice-values}

:label[Plain and direct]{tone="info"}

**Why**

The shared core is plain and direct.

**Because of**

- What should the brand feel like? → Neutral and adaptable

**What it decided (2)**

*Rules it sets (1)*

- For the words of an error, use shared across brands: plain and specific. Don't use brand tone in errors. Errors read the same in every brand, so support can help anyone. [Voice →](foundations/voice)

*Variants it picks (1)*

- Toast's danger tone. Shared across brands: plain and specific. [Toast →](components/toast)

#### Where do the words matter most? {#voice-lands}

:label[Headlines and buttons]{tone="info"}

**Why**

Brand tone shows in headlines and buttons.

**Because of**

- How visible is the brand in the interface? → Present

**What it decided (1)**

*Rules it sets (1)*

- For a first visit, use brand tone in the first headline only. Don't use brand tone in every line. One headline carries the brand; the rest stays shared. [Voice →](foundations/voice)
:::

:::fold{id="components" title="Components" note="5 answers, 1 decision, and the values of its tokens"}
#### Which component families does it need? {#components-roles}

:label[Core, plus content and media]{tone="info"}

**Why**

Product teams build sign-up and account forms, plus product pages with questions and faces.

**Because of**

- What is the main content? → Forms and tasks
- Who maintains the system? → A platform team

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How far does the inventory reach? {#components-count}

:label[What today's screens use, plus what the next ones will likely need]{tone="info"}

**Why**

Three product teams find their next parts ready, kept by one platform team.

**Because of**

- Who maintains the system? → A platform team
- How fast does it change? → Every month

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How does a component earn its place? {#components-definition}

:label[Its family is in the roles, so product teams find it ready]{tone="info"}

**Why**

Product teams find a whole family ready instead of asking one by one.

**Because of**

- Who maintains the system? → A platform team
- How fast does it change? → Every month

**What it decided (1)**

*Variants it picks (1)*

- Toggle's default variant isn't used. Toggles that sit together, like monthly or yearly prices, use toggle-group. [Toggle →](components/toggle)

#### When does a component get another look? {#components-values}

:label[Also for emphasis and size]{tone="info"}

**Why**

Variants for emphasis and size let each brand feel present without new components.

**Because of**

- How visible is the brand in the interface? → Present
- What is a costly mistake? → Looking off-brand

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### Where do components do the most work? {#components-lands}

:label[Sign-up and account pages]{tone="info"}

**Why**

Most components sit in sign-up and account pages.

**Because of**

- What is the main content? → Forms and tasks
- What is the main task? → Complete a form

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)
:::
