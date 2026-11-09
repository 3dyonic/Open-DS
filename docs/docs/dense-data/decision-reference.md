---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1.5
title: "Decision reference"
description: "Dense data: each question, its answer, and the design decisions it made."
hide_table_of_contents: true
---

# Decision reference

:::intro{robot="dense-data" title="Take it one answer at a time"}
This page keeps every decision behind Dense data in one place: 79 answers and what each one shaped. It's a reference, not a reading list. Most days you only need one answer.

**Three easy ways in**

- Take a minute with [Where it starts](#where-it-starts). It shows the few first answers the rest grow from.
- Open one section when you wonder why. For example, why Dense data's spacing is compact, or why its voice is terse.
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

- :label[Runs daily operations]{tone="info"} What does the product do for the business?
  - :label[Daily experts]{tone="info"} Who uses it most?
    - :label[AA]{tone="info"} What accessibility level do we commit to?
    - :label[A lot]{tone="info"} How much is on one screen?, also because **Numbers and records**
      - :label[Quiet]{tone="info"} How visible is the brand in the interface?
        - :label[Muted]{tone="info"} color → `color.neutral.0` `color.slate.dark.0`: #0D1117
        - :label[Only when the meaning changes]{tone="info"} components →
      - :label[Small]{tone="info"} typography → `type.body.font-size` `font.size.14`: 0.875rem
      - :label[Compact]{tone="info"} spacing → `space.gap.tight` `space.4`: 0.25rem
      - :label[Match the text]{tone="info"} iconography → `size.icon` `size.16`: 1rem
    - :label[Constantly]{tone="info"} How often do people repeat actions?
      - :label[Time on task]{tone="info"} Which outcome matters most?
        - :label[Fast]{tone="info"} motion → `motion.duration.feedback` `duration.fast`: 120ms
      - :label[All day]{tone="info"} How long is one visit?
        - :label[Light and dark]{tone="info"} theming →
    - :label[They learn it and recognize it]{tone="info"} How do people recall the interface?
    - :label[At a desk]{tone="info"} Where do people use it?
      - :label[Compact, for a pointer]{tone="info"} accessibility → `size.control.default` `size.32`: 2rem
    - :label[Terse]{tone="info"} voice and tone →
  - :label[Numbers and records]{tone="info"} What is the main content?
    - :label[Scan and compare]{tone="info"} What is the main task?
      - :label[People keep their place]{tone="info"} What must the interface protect?
      - :label[Acting on the wrong record]{tone="info"} What is a costly mistake?
    - :label[Precise]{tone="info"} What should the brand feel like?
      - :label[A neutral grotesque, with a monospace for data]{tone="info"} Which typefaces carry the product, and why?, also because **Quiet, Numbers and records**
      - :label[Slightly rounded]{tone="info"} shape → `radius.control` `radius.2`: 0.125rem
      - :label[Subtle]{tone="info"} elevation → `elevation.card` `shadow.none`: [object Object]
- :label[One]{tone="info"} How many brands or products share the system?
- :label[A small team]{tone="info"} Who maintains the system?
  - :label[Lowercase words in paths]{tone="info"} naming →
- :label[Every month]{tone="info"} How fast does it change?

## Every question

All 79, by section, in the order every scheme answers them. Each answer shows why, what it came from, and every design decision it made. The menu in the sidebar opens a section; its number is how many decisions that section made.

### Reasons

:::fold{id="business" title="Business and product" note="2 answers, 7 decisions"}
#### What does the product do for the business? {#business-q1}

:label[Runs daily operations]{tone="info"}

**Why**

The product runs daily security operations: alerts, incidents and the assets they touch.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (3)**

*Answers it led to (3)*

- Who uses it most? → Daily experts
- What is the main content? → Numbers and records
- Voice and tone · Which kinds of copy does it need? → Labels and messages [Voice and tone →](foundations/voice)

#### How many brands or products share the system? {#business-q2}

:label[One]{tone="info"}

**Why**

One internal product, one brand.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (4)**

*Answers it led to (4)*

- Color · How is the palette defined? → Neutrals and one brand ramp [Color →](foundations/color)
- Shape · How are corners set? → Fixed for the product [Shape →](foundations/shape)
- Theming · What can a theme change? → Mode only [Theming →](foundations/theming)
- Theming · How are brands handled? → One brand [Theming →](foundations/theming)
:::

:::fold{id="people" title="People and work context" note="2 answers, 15 decisions"}
#### Who uses it most? {#people-q1}

:label[Daily experts]{tone="info"}

**Why**

The same people use it all day, every day.

**Because of**

- What does the product do for the business? → Runs daily operations

**What it decided (9)**

*Answers it led to (8)*

- What accessibility level do we commit to? → AA
- How much is on one screen? → A lot
- How often do people repeat actions? → Constantly
- How do people recall the interface? → They learn it and recognize it
- Where do people use it? → At a desk
- Accessibility · Which states get their own visible value? → Hover, focus, disabled [Accessibility →](foundations/accessibility)
- Voice and tone · How many tones does it use? → One [Voice and tone →](foundations/voice)
- Voice and tone · How does it sound? → Terse [Voice and tone →](foundations/voice)

*Rules it sets (1)*

- For a first visit, use no tour. Show the data, with a tooltip where needed. Don't use a welcome tour. Daily experts skip tours; tooltips cover the first uses. [Voice →](foundations/voice)

#### What accessibility level do we commit to? {#people-q2}

:label[AA]{tone="info"}

**Why**

AA is the floor for an internal tool used by trained staff.

**Because of**

- Who uses it most? → Daily experts

**What it decided (6)**

*Answers it led to (3)*

- Typography · How are sizes and line heights defined? → A ratio, line heights in proportion [Typography →](foundations/typography)
- Accessibility · How many signals carry each meaning? → Three: color, icon and word [Accessibility →](foundations/accessibility)
- Accessibility · What contrast floor do we hold? → AA [Accessibility →](foundations/accessibility)

*Rules it sets (1)*

- For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline. Keyboard users must always see where they are. [Accessibility →](foundations/accessibility)

*Variants it picks (2)*

- Button's focus state. Always visible: the focus ring at border-width.focus. [Button →](components/button)
- Button's disabled state. Only with a visible reason next to it. [Button →](components/button)
:::

:::fold{id="content" title="Content and data" note="2 answers, 46 decisions"}
#### What is the main content? {#content-q1}

:label[Numbers and records]{tone="info"}

**Why**

Most of the screen is numbers and records.

**Because of**

- What does the product do for the business? → Runs daily operations

**What it decided (23)**

*Answers it led to (10)*

- How much is on one screen? → A lot
- What is the main task? → Scan and compare
- What should the brand feel like? → Precise
- Which typefaces carry the product, and why? → A neutral grotesque, with a monospace for data
- Typography · Which text roles does it need? → Core and data [Typography →](foundations/typography)
- Typography · Where does type do the most work? → Tables and inputs [Typography →](foundations/typography)
- Spacing · Which spacing roles does it need? → Gaps, insets and row heights [Spacing →](foundations/spacing)
- Accessibility · How many signals carry each meaning? → Three: color, icon and word [Accessibility →](foundations/accessibility)
- Components · Which component families does it need? → Core, plus data [Components →](foundations/components)
- Components · Where do components do the most work? → Tables and forms [Components →](foundations/components)

*Rules it sets (1)*

- For a status, use badge with a subtle fill, an icon and a word. Don't use a full-strength fill. Subtle fills let many statuses share one table. [Color →](foundations/color)

*Variants it picks (12)*

- Badge's neutral tone. New and False positive: not triaged yet, or a finished outcome that is not a failure. [Badge →](components/badge)
- Badge's info tone. Investigating: an analyst is on it; news, nothing to act on. [Badge →](components/badge)
- Badge's success tone. Resolved: contained and closed. [Badge →](components/badge)
- Badge's warning tone. Escalated: needs a senior analyst soon, still containable. [Badge →](components/badge)
- Badge's danger tone. Breach confirmed: a real loss. [Badge →](components/badge)
- Sidebar's default variant. Menu items with no border, quiet beside dense data. [Sidebar →](components/sidebar)
- Sidebar's outline variant isn't used. Borders on every item would compete with the data. [Sidebar →](components/sidebar)
- Empty's default variant isn't used. No pictures: an empty table needs the reason and the one action that fills it. [Empty →](components/empty)
- Item's default variant. Users and settings in a panel or menu, with no border, quiet beside the data. [Item →](components/item)
- Item's outline variant isn't used. Borders on every row would compete with the data; hairlines between sections do that work. [Item →](components/item)
- Toggle's default variant. In the table toolbar, with no border; the pressed state shows as a fill, quiet beside the data. [Toggle →](components/toggle)
- Toggle's outline variant isn't used. Borders on every toggle would compete with the data. [Toggle →](components/toggle)

#### How much is on one screen? {#content-q2}

:label[A lot]{tone="info"}

**Why**

Experts want many records on one screen.

**Because of**

- Who uses it most? → Daily experts
- What is the main content? → Numbers and records

**What it decided (23)**

*Answers it led to (10)*

- How visible is the brand in the interface? → Quiet
- Typography · How many steps does the type scale take? → Only the steps the screens need [Typography →](foundations/typography)
- Typography · How large is body text? → Small [Typography →](foundations/typography)
- Spacing · How are spacing steps defined? → Small steps, on a 4px grid [Spacing →](foundations/spacing)
- Spacing · How dense is the layout? → Compact [Spacing →](foundations/spacing)
- Shape · Where does shape show most? → Controls in dense rows [Shape →](foundations/shape)
- Iconography · What icon style? → Outline [Iconography →](foundations/iconography)
- Iconography · How big are icons next to text? → Match the text [Iconography →](foundations/iconography)
- Accessibility · Where are the floors hardest to hold? → Dense tables [Accessibility →](foundations/accessibility)
- Components · How far does the inventory reach? → What today's screens use, plus what the next ones will likely need [Components →](foundations/components)

*Rules it sets (3)*

- For a page title, use type.title. Don't use type.display. Titles stay small so the table starts higher on the screen. [Typography →](foundations/typography)
- Between page sections, use space.gap.section and a hairline. Don't use a card around every section. Lines separate without taking room from the data. [Spacing →](foundations/spacing)
- For a table row height, use size.row (compact). Don't use the comfortable row. Compact rows show more records without scrolling. [Spacing →](foundations/spacing)

*Variants it picks (10)*

- Button's default size. Actions outside tables: forms, dialogs, page actions. [Button →](components/button)
- Button's compact size. Table rows and toolbars. Compact still fits a mouse. [Button →](components/button)
- Button's large size isn't used. Controls stay small so more records fit on one screen. [Button →](components/button)
- Input group's block-start align isn't used. Inputs stay one line high in toolbars and filter bars. [Input group →](components/input-group)
- Input group's block-end align isn't used. Inputs stay one line high in toolbars and filter bars. [Input group →](components/input-group)
- Field's horizontal orientation. Settings and filter panels: switches and short controls with the label beside. [Field →](components/field)
- Sidebar's lg size isn't used. Rows stay small so the whole navigation fits the screen all shift. [Sidebar →](components/sidebar)
- Toggle's default size isn't used. Toggles sit in the table toolbar, at the smaller size like compact buttons. [Toggle →](components/toggle)
- Toggle's sm size. The table toolbar, matching compact buttons. It still fits a mouse. [Toggle →](components/toggle)
- Toggle's lg size isn't used. Controls stay small so more records fit on one screen. [Toggle →](components/toggle)
:::

:::fold{id="tasks" title="Tasks and flows" note="2 answers, 30 decisions"}
#### What is the main task? {#tasks-q1}

:label[Scan and compare]{tone="info"}

**Why**

People scan rows and compare values.

**Because of**

- What is the main content? → Numbers and records

**What it decided (14)**

*Answers it led to (9)*

- What must the interface protect? → People keep their place
- What is a costly mistake? → Acting on the wrong record
- Typography · Which text roles does it need? → Core and data [Typography →](foundations/typography)
- Typography · How are sizes and line heights defined? → A ratio, line heights in proportion [Typography →](foundations/typography)
- Spacing · How many densities exist? → Two [Spacing →](foundations/spacing)
- Spacing · Where does spacing matter most? → Rows and cells [Spacing →](foundations/spacing)
- Shape · Which shape roles does it need? → Controls, badges and containers [Shape →](foundations/shape)
- Components · Which component families does it need? → Core, plus data [Components →](foundations/components)
- Components · Where do components do the most work? → Tables and forms [Components →](foundations/components)

*Rules it sets (3)*

- For a number in a table, use type.data. Don't use type.body. Mono digits line up in columns, so values compare at a glance. [Typography →](foundations/typography)
- For a field label or column header, use type.label. Don't use type.heading. Headers repeat on every column; a heavy style would compete with the data. [Typography →](foundations/typography)
- For a selected row or item, use color.surface.selected. Don't use color.action.primary as a fill. A light tint shows selection without hiding the data. [Color →](foundations/color)

*Variants it picks (2)*

- Field's vertical orientation. Forms in dialogs and sheets: the label above. [Field →](components/field)
- Item's muted variant. The current user or setting, with a soft fill so people keep their place. [Item →](components/item)

#### How often do people repeat actions? {#tasks-q2}

:label[Constantly]{tone="info"}

**Why**

The same actions repeat many times an hour.

**Because of**

- Who uses it most? → Daily experts

**What it decided (16)**

*Answers it led to (8)*

- Which outcome matters most? → Time on task
- How long is one visit? → All day
- Color · How many emphasis levels do actions need? → Three [Color →](foundations/color)
- Iconography · What do icons do? → Actions and status [Iconography →](foundations/iconography)
- Iconography · Where do icons work hardest? → Toolbars and rows [Iconography →](foundations/iconography)
- Voice and tone · How is the voice defined? → Rules and a word list [Voice and tone →](foundations/voice)
- Components · How does a component earn its place? → A use scenario needs it [Components →](foundations/components)
- Components · When does a component get another look? → Only when the meaning changes [Components →](foundations/components)

*Rules it sets (2)*

- For an action on one row or item, use icon button, ghost, compact. Don't use button secondary in every row. Rows repeat dozens of times; a quiet icon keeps the table readable. [Iconography →](foundations/iconography)
- For a success message, use a short confirmation with the count. Don't use celebration. Confirm and get out of the way; the next task is waiting. [Voice →](foundations/voice)

*Variants it picks (6)*

- Button's ghost variant. Row actions, as compact icon buttons. Never for cancel. [Button →](components/button)
- Input group's inline-end align. The clear button after the text, for searches people repeat all day. [Input group →](components/input-group)
- Sidebar's default size. Every section of the app. [Sidebar →](components/sidebar)
- Alert's default variant isn't used. Alerts here are for problems that stay on the page; news goes in a toast or a badge. [Alert →](components/alert)
- Toast's success tone. A short confirmation with the count: 12 alerts exported. [Toast →](components/toast)
- Toggle's default variant. In the table toolbar, with no border; the pressed state shows as a fill, quiet beside the data. [Toggle →](components/toggle)
:::

:::fold{id="human" title="Human factors" note="2 answers, 9 decisions"}
#### What must the interface protect? {#human-q1}

:label[People keep their place]{tone="info"}

**Why**

Losing your place in a long table costs time and errors.

**Because of**

- What is the main task? → Scan and compare

**What it decided (4)**

*Answers it led to (3)*

- Elevation · What separates groups on the page? → Lines [Elevation →](foundations/elevation)
- Motion · What is motion for? → Feedback only [Motion →](foundations/motion)
- Theming · What changes when the theme changes? → Colors only [Theming →](foundations/theming)

*Variants it picks (1)*

- Item's muted variant. The current user or setting, with a soft fill so people keep their place. [Item →](components/item)

#### How do people recall the interface? {#human-q2}

:label[They learn it and recognize it]{tone="info"}

**Why**

Daily users learn the interface and recognize it.

**Because of**

- Who uses it most? → Daily experts

**What it decided (5)**

*Rules it sets (3)*

- For a link, use color.text.link. Don't use color.action.primary. Links and buttons look different, so people know which one navigates. [Color →](foundations/color)
- For items that belong together, use space.gap.tight. Don't use space.gap.group. Things that belong together sit close. [Spacing →](foundations/spacing)
- For an alternative or cancel, use button secondary. Don't use button ghost. A ghost button has no edge, so next to a filled primary it reads as plain text and cancel gets lost. Secondary keeps a visible border, so people find it at once. [Color →](foundations/color)

*Variants it picks (2)*

- Button's secondary variant. Alternatives and cancel next to the primary, and the first step of a delete. [Button →](components/button)
- Button's ghost variant. Row actions, as compact icon buttons. Never for cancel. [Button →](components/button)
:::

:::fold{id="outcomes" title="Outcomes" note="2 answers, 14 decisions"}
#### Which outcome matters most? {#outcomes-q1}

:label[Time on task]{tone="info"}

**Why**

Speed on repeated tasks is the measure.

**Because of**

- How often do people repeat actions? → Constantly

**What it decided (2)**

*Answers it led to (1)*

- Motion · How fast does feedback feel? → Fast [Motion →](foundations/motion)

*Rules it sets (1)*

- For a paragraph or help text, use type.body. Don't use type.label. Help text is a sentence read in passing. Body size reads quickly; the label style is made for short names, not sentences. [Typography →](foundations/typography)

#### What is a costly mistake? {#outcomes-q2}

:label[Acting on the wrong record]{tone="info"}

**Why**

Acting on the wrong row is the costly error.

**Because of**

- What is the main task? → Scan and compare

**What it decided (12)**

*Answers it led to (2)*

- Color · Where does color carry meaning first? → Status in tables [Color →](foundations/color)
- Voice and tone · Where do the words matter most? → Errors and empty states [Voice and tone →](foundations/voice)

*Rules it sets (4)*

- For an error message, use color.status.danger with an icon. Don't use color.status.warning. Red always means fix this, and the icon says it without color. [Color →](foundations/color)
- For the action that completes the task, use button primary, one per view. Don't use two primaries side by side. One primary makes the committing action obvious. [Color →](foundations/color)
- For a delete or remove, use button secondary, then confirm in a dialog with Button danger. Don't use button primary as the first step. Deleting is rare and costly; a confirm step catches mistakes. [Color →](foundations/color)
- For a confirmation question, use name the exact object and the consequence. Don't use "Are you sure?". Acting on the wrong record is the costly mistake. [Voice →](foundations/voice)

*Variants it picks (6)*

- Button's primary variant. The one commit in a view. [Button →](components/button)
- Button's secondary variant. Alternatives and cancel next to the primary, and the first step of a delete. [Button →](components/button)
- Button's danger variant. The confirm of a bulk delete. Many records go at once, so the last press must not look like the everyday primary. [Button →](components/button)
- Alert's default variant isn't used. Alerts here are for problems that stay on the page; news goes in a toast or a badge. [Alert →](components/alert)
- Alert's destructive variant. A record that was not saved or an action that failed: name the record, then the fix, with an icon. [Alert →](components/alert)
- Toast's danger tone. A background failure: name the record, then the fix. [Toast →](components/toast)
:::

:::fold{id="brand" title="Brand" note="3 answers, 16 decisions"}
#### What should the brand feel like? {#brand-q1}

:label[Precise]{tone="info"}

**Why**

The interface must feel exact and trustworthy.

**Because of**

- What is the main content? → Numbers and records

**What it decided (5)**

*Answers it led to (5)*

- Which typefaces carry the product, and why? → A neutral grotesque, with a monospace for data
- Shape · What should control corners say? → Slightly rounded [Shape →](foundations/shape)
- Elevation · How soft are shadows? → Subtle [Elevation →](foundations/elevation)
- Motion · How is easing defined? → Standard ease-out [Motion →](foundations/motion)
- Voice and tone · How does it sound? → Terse [Voice and tone →](foundations/voice)

#### How visible is the brand in the interface? {#brand-q2}

:label[Quiet]{tone="info"}

**Why**

The data is the hero; the brand steps back.

**Because of**

- How much is on one screen? → A lot

**What it decided (4)**

*Answers it led to (4)*

- Which typefaces carry the product, and why? → A neutral grotesque, with a monospace for data
- Color · Which color roles does it need? → Surface, text, action and status [Color →](foundations/color)
- Color · How saturated is the palette? → Muted [Color →](foundations/color)
- Components · When does a component get another look? → Only when the meaning changes [Components →](foundations/components)

#### Which typefaces carry the product, and why? {#brand-q3}

:label[A neutral grotesque, with a monospace for data]{tone="info"}

**Why**

IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero.

**What it weighs (11)**

*Reading*

- **Readability.** Plex Sans is a neutral grotesque with open shapes, made for screens; it reads at the small body size dense rows need.
- **Legibility.** Data, codes and IDs sit in Plex Mono, where each character holds its own fixed cell, so they read character by character.

*Range*

- **Scalability.** Plex ships a full range of weights, so every role in the type scale has its own weight without a second sans.
- **Numerals.** Digits in Plex Mono are all one width, so columns of numbers line up.
- **Scripts and languages.** Plex Sans covers Latin, Cyrillic and Greek; Hebrew, Arabic and other scripts come as sister families of IBM Plex, drawn to match.

*Brand*

- **Recognition.** One family with a matching mono gives the product an engineered, consistent voice.
- **Familiarity.** A grotesque reads as standard and trusted in operations tools.
- **Personality.** Precise, as the brand answer asks, and quiet, so the brand steps back.

*Delivery*

- **Performance.** Two families; load only the weights the scale uses.
- **Licensing.** SIL Open Font License: free to embed in apps and on the web.
- **Fallback and pairing.** Falls back to system-ui and ui-monospace, as its tokens say; Plex Mono is its own pair.

**Because of**

- What should the brand feel like? → Precise
- How visible is the brand in the interface? → Quiet
- What is the main content? → Numbers and records

**What it decided (7)**

*Theme picks it sets (7)*

- type.display.font-family: ibm-plex-sans for display text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero. [Typography →](foundations/typography)
- type.title.font-family: ibm-plex-sans for title text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero. [Typography →](foundations/typography)
- type.heading.font-family: ibm-plex-sans for heading text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero. [Typography →](foundations/typography)
- type.body.font-family: ibm-plex-sans for body text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero. [Typography →](foundations/typography)
- type.label.font-family: ibm-plex-sans for label text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero. [Typography →](foundations/typography)
- type.caption.font-family: ibm-plex-sans for caption text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero. [Typography →](foundations/typography)
- type.data.font-family: ibm-plex-mono for data text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero. [Typography →](foundations/typography)
:::

:::fold{id="scenarios" title="Use scenarios" note="2 answers, 4 decisions"}
#### Where do people use it? {#scenarios-q1}

:label[At a desk]{tone="info"}

**Why**

Experts work at a desk with a mouse and keyboard.

**Because of**

- Who uses it most? → Daily experts

**What it decided (3)**

*Answers it led to (2)*

- Accessibility · What is the smallest target? → Compact, for a pointer [Accessibility →](foundations/accessibility)
- Components · How does a component earn its place? → A use scenario needs it [Components →](foundations/components)

*Variants it picks (1)*

- Field's responsive orientation isn't used. A desk with a mouse and keyboard: there is no narrow screen to adapt to. [Field →](components/field)

#### How long is one visit? {#scenarios-q2}

:label[All day]{tone="info"}

**Why**

The tool stays open for the whole shift.

**Because of**

- How often do people repeat actions? → Constantly

**What it decided (1)**

*Answers it led to (1)*

- Theming · Which modes ship? → Light and dark [Theming →](foundations/theming)
:::

:::fold{id="team" title="Team and delivery" note="2 answers, 8 decisions"}
#### Who maintains the system? {#team-q1}

:label[A small team]{tone="info"}

**Why**

A small team keeps the system right.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (5)**

*Answers it led to (4)*

- Naming · How are decisions named? → By role [Naming →](foundations/naming)
- Naming · How are names written? → Lowercase words in paths [Naming →](foundations/naming)
- Voice and tone · How is the voice defined? → Rules and a word list [Voice and tone →](foundations/voice)
- Components · How far does the inventory reach? → What today's screens use, plus what the next ones will likely need [Components →](foundations/components)

*Rules it sets (1)*

- When no component in the inventory fits, use a component from the inventory, composed (for example a popover with a command list). Don't use a one-off component built for one screen. A small team keeps fewer parts right, and experts expect the same parts everywhere. [Components →](foundations/components)

#### How fast does it change? {#team-q2}

:label[Every month]{tone="info"}

**Why**

Features ship every month; the system must keep up.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (3)**

*Answers it led to (3)*

- Naming · What gets a name? → Tokens and component keys [Naming →](foundations/naming)
- Naming · How many token tiers? → Three [Naming →](foundations/naming)
- Naming · What do components read? → Component keys [Naming →](foundations/naming)
:::

### Scopes

:::fold{id="typography" title="Typography" note="5 answers, 2 decisions, and the values of its tokens"}
#### Which text roles does it need? {#typography-roles}

:label[Core and data]{tone="info"}

**Why**

A data role keeps numbers in aligned columns.

**Because of**

- What is the main content? → Numbers and records
- What is the main task? → Scan and compare

**What it decided (1)**

*Rules it sets (1)*

- For a number in a table, use type.data. Don't use type.body. Mono digits line up in columns, so values compare at a glance. [Typography →](foundations/typography)

#### How many steps does the type scale take? {#typography-count}

:label[Only the steps the screens need]{tone="info"}

**Why**

A screen full of records stays calm with only the sizes it needs.

**Because of**

- How much is on one screen? → A lot

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How are sizes and line heights defined? {#typography-definition}

:label[A ratio, line heights in proportion]{tone="info"}

**Why**

Line height is a ratio of each text's own size, so it follows the text. Two steps: tight for headings and labels, open for body, data and captions.

**Because of**

- What is the main task? → Scan and compare
- What accessibility level do we commit to? → AA

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How large is body text? {#typography-values}

:label[Small]{tone="info"}

**Why**

Small body text fits more rows on the screen.

**Because of**

- How much is on one screen? → A lot

**What it decided (1)**

*Answers it led to (1)*

- Iconography · How many icon sizes exist? → One [Iconography →](foundations/iconography)

#### Where does type do the most work? {#typography-lands}

:label[Tables and inputs]{tone="info"}

**Why**

Most text sits in table cells and inputs.

**Because of**

- What is the main content? → Numbers and records

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)
:::

:::fold{id="color" title="Color" note="5 answers, 90 decisions, and the values of its tokens"}
#### Which color roles does it need? {#color-roles}

:label[Surface, text, action and status]{tone="info"}

**Why**

Surface, text, action and status cover an operations tool.

**Because of**

- How visible is the brand in the interface? → Quiet

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### How many emphasis levels do actions need? {#color-count}

:label[Three]{tone="info"}

**Why**

One primary per view; the rest step back.

**Because of**

- How often do people repeat actions? → Constantly

**What it decided (28)**

*Rules it sets (1)*

- For the action that completes the task, use button primary, one per view. Don't use two primaries side by side. One primary makes the committing action obvious. [Color →](foundations/color)

*Variants it picks (1)*

- Button's primary variant. The one commit in a view. [Button →](components/button)

*Theme picks it sets (26)*

- color.action.primary in light: violet.light.600: the primary action's fill; its label reads, 6.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 17.28:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.600: the danger action's fill; its label reads, 5.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in light: violet.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.97:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in light: violet.light.100: a tag's tint; text on it reads, 14.71:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.2 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in light: blue.light.100: a tag's tint; text on it reads, 13.42:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.3 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in light: green.light.100: a tag's tint; text on it reads, 15.13:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.4 in light: amber.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in light: amber.light.100: a tag's tint; text on it reads, 14.53:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.5 in light: neutral.500: a series color: a distinct hue with no meaning, for tags and chart marks, 4.66:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in light: neutral.100: a tag's tint; text on it reads, 15.25:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary in dark: violet.dark.600: the primary action's fill; its label reads, 7.62:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 16.26:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.28:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in dark: violet.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.62:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in dark: violet.dark.100: a tag's tint; text on it reads, 13.5:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.2 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.2:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in dark: blue.dark.100: a tag's tint; text on it reads, 13.11:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.3 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.82:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in dark: green.dark.100: a tag's tint; text on it reads, 12.96:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.4 in dark: amber.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 9.66:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in dark: amber.dark.100: a tag's tint; text on it reads, 12.69:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.5 in dark: neutral.700: a series color: a distinct hue with no meaning, for tags and chart marks, 13.28:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in dark: neutral.100: a tag's tint; text on it reads, 13.05:1, above the 4.5:1 floor. [Color →](foundations/color)

#### How is the palette defined? {#color-definition}

:label[Neutrals and one brand ramp]{tone="info"}

**Why**

One product, one brand ramp on cool neutrals.

**Because of**

- How many brands or products share the system? → One

**What it decided (36)**

*Theme picks it sets (36)*

- color.neutral.0 in light: slate.light.0: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.50 in light: slate.light.50: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.100 in light: slate.light.100: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.200 in light: slate.light.200: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.300 in light: slate.light.300: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.400 in light: slate.light.400: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.500 in light: slate.light.500: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.600 in light: slate.light.600: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.700 in light: slate.light.700: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.800 in light: slate.light.800: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.900 in light: slate.light.900: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.950 in light: slate.light.950: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.surface.canvas in light: neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.100, the highlight's step: pressed reuses hover; experts do not need more. [Color →](foundations/color)
- color.surface.selected in light: violet.light.100: a tint of the brand, 1.17:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in light: violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.neutral.0 in dark: slate.dark.0: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.50 in dark: slate.dark.50: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.100 in dark: slate.dark.100: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.200 in dark: slate.dark.200: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.300 in dark: slate.dark.300: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.400 in dark: slate.dark.400: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.500 in dark: slate.dark.500: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.600 in dark: slate.dark.600: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.700 in dark: slate.dark.700: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.800 in dark: slate.dark.800: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.900 in dark: slate.dark.900: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.neutral.950 in dark: slate.dark.950: the scheme's neutral is slate. One product, one brand ramp on cool neutrals. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.100, the highlight's step: pressed reuses hover; experts do not need more. [Color →](foundations/color)
- color.surface.selected in dark: violet.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in dark: violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)

#### How saturated is the palette? {#color-values}

:label[Muted]{tone="info"}

**Why**

Muted color keeps attention on the data.

**Because of**

- How visible is the brand in the interface? → Quiet

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### Where does color carry meaning first? {#color-lands}

:label[Status in tables]{tone="info"}

**Why**

Color earns its place by marking late and failed records.

**Because of**

- What is a costly mistake? → Acting on the wrong record

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
- color.category.1 in light: violet.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.97:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in light: amber.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in light: neutral.500: a series color: a distinct hue with no meaning, for tags and chart marks, 4.66:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.status.info in dark: blue.dark.600: info reads as text and icons, 8.2:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info.subtle in dark: blue.dark.100: a quiet tint behind info; its text, 10.82:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 7.82:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 12.05:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 9.66:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 11.34:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.28:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 11.33:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in dark: violet.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.62:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.2:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.82:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in dark: amber.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 9.66:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in dark: neutral.700: a series color: a distinct hue with no meaning, for tags and chart marks, 13.28:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
:::

:::fold{id="spacing" title="Spacing" note="5 answers, 6 decisions, and the values of its tokens"}
#### Which spacing roles does it need? {#spacing-roles}

:label[Gaps, insets and row heights]{tone="info"}

**Why**

Row height is a decision of its own in a table product.

**Because of**

- What is the main content? → Numbers and records

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How many densities exist? {#spacing-count}

:label[Two]{tone="info"}

**Why**

A second, denser size serves tables and toolbars.

**Because of**

- What is the main task? → Scan and compare

**What it decided (5)**

*Rules it sets (1)*

- For a table row height, use size.row (compact). Don't use the comfortable row. Compact rows show more records without scrolling. [Spacing →](foundations/spacing)

*Variants it picks (4)*

- Field's horizontal orientation. Settings and filter panels: switches and short controls with the label beside. [Field →](components/field)
- Sidebar's sm size. Long secondary lists, at the denser size. [Sidebar →](components/sidebar)
- Item's default size. Settings and user lists outside the table, at the standard row. [Item →](components/item)
- Item's sm size. Long lists in a side panel, at the denser size. It still fits a mouse. [Item →](components/item)

#### How are spacing steps defined? {#spacing-definition}

:label[Small steps, on a 4px grid]{tone="info"}

**Why**

Steps on a 4px grid give the small gaps dense screens need.

**Because of**

- How much is on one screen? → A lot

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How dense is the layout? {#spacing-values}

:label[Compact]{tone="info"}

**Why**

Compact spacing shows more records.

**Because of**

- How much is on one screen? → A lot

**What it decided (1)**

*Theme picks it sets (1)*

- radius.option: radius.0: square, because the panel's 4px corner is used up by its 4px padding. [Shape →](foundations/shape)

#### Where does spacing matter most? {#spacing-lands}

:label[Rows and cells]{tone="info"}

**Why**

Space is spent inside rows and cells.

**Because of**

- What is the main task? → Scan and compare

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)
:::

:::fold{id="shape" title="Shape" note="5 answers, 10 decisions, and the values of its tokens"}
#### Which shape roles does it need? {#shape-roles}

:label[Controls, badges and containers]{tone="info"}

**Why**

Badges sit in columns and need their own corner.

**Because of**

- What is the main task? → Scan and compare

**What it decided (6)**

*Answers it led to (1)*

- Shape · How many corner sizes exist? → Three [Shape →](foundations/shape)

*Rules it sets (1)*

- For the shape of a status badge, use radius.badge (rectangle). Don't use a pill. Rectangles line up in a column. [Shape →](foundations/shape)

*Theme picks it sets (4)*

- radius.control: radius.2: Small corners keep dense rows straight. [Shape →](foundations/shape)
- radius.badge: radius.0: Small corners keep dense rows straight. [Shape →](foundations/shape)
- radius.option: radius.0: square, because the panel's 4px corner is used up by its 4px padding. [Shape →](foundations/shape)
- radius.container: radius.4: Small corners keep dense rows straight. [Shape →](foundations/shape)

#### How many corner sizes exist? {#shape-count}

:label[Three]{tone="info"}

**Why**

Control, badge and container corners differ.

**Because of**

- Shape · Which shape roles does it need? → Controls, badges and containers

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)

#### How are corners set? {#shape-definition}

:label[Fixed for the product]{tone="info"}

**Why**

One brand, one fixed set of corners.

**Because of**

- How many brands or products share the system? → One

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)

#### What should control corners say? {#shape-values}

:label[Slightly rounded]{tone="info"}

**Why**

Small corners keep dense rows straight.

**Because of**

- What should the brand feel like? → Precise

**What it decided (4)**

*Rules it sets (1)*

- For the corners of buttons and inputs, use radius.control. Don't use radius.round. Small corners keep dense rows straight. [Shape →](foundations/shape)

*Theme picks it sets (3)*

- radius.control: radius.2: Small corners keep dense rows straight. [Shape →](foundations/shape)
- radius.badge: radius.0: Small corners keep dense rows straight. [Shape →](foundations/shape)
- radius.container: radius.4: Small corners keep dense rows straight. [Shape →](foundations/shape)

#### Where does shape show most? {#shape-lands}

:label[Controls in dense rows]{tone="info"}

**Why**

Corners show most on controls in dense rows.

**Because of**

- How much is on one screen? → A lot

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)
:::

:::fold{id="elevation" title="Elevation" note="5 answers, 27 decisions, and the values of its tokens"}
#### What rises above the page? {#elevation-roles}

:label[Only what floats]{tone="info"}

**Why**

Only menus and dialogs float; cards use lines.

**Because of**

- Elevation · What separates groups on the page? → Lines

**What it decided (11)**

*Answers it led to (2)*

- Elevation · How many shadow levels exist? → One [Elevation →](foundations/elevation)
- Elevation · Where does elevation show? → Menus and dialogs [Elevation →](foundations/elevation)

*Rules it sets (1)*

- For a card on the page, use a hairline border, no shadow. Don't use a shadow. On a busy grid, lines separate. Shadows blur the edges. [Elevation →](foundations/elevation)

*Theme picks it sets (8)*

- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill. [Color →](foundations/color)
- color.surface.scrim in light: black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in light: shadow.none: Only menus and dialogs float; cards use lines. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.overlay: Subtle shadows keep the grid crisp. [Elevation →](foundations/elevation)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light. [Color →](foundations/color)
- color.surface.scrim in dark: black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in dark: shadow.none: Only menus and dialogs float; cards use lines. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.overlay-dark: Subtle shadows keep the grid crisp. [Elevation →](foundations/elevation)

#### How many shadow levels exist? {#elevation-count}

:label[One]{tone="info"}

**Why**

One shadow for everything that floats.

**Because of**

- Elevation · What rises above the page? → Only what floats

**What it decided**

It sets the values of the elevation tokens: [Elevation →](foundations/elevation)

#### What separates groups on the page? {#elevation-definition}

:label[Lines]{tone="info"}

**Why**

Thin lines guide the eye along rows.

**Because of**

- What must the interface protect? → People keep their place

**What it decided (11)**

*Answers it led to (1)*

- Elevation · What rises above the page? → Only what floats [Elevation →](foundations/elevation)

*Rules it sets (1)*

- Between page sections, use space.gap.section and a hairline. Don't use a card around every section. Lines separate without taking room from the data. [Spacing →](foundations/spacing)

*Variants it picks (1)*

- Item's outline variant isn't used. Borders on every row would compete with the data; hairlines between sections do that work. [Item →](components/item)

*Theme picks it sets (8)*

- color.surface.canvas in light: neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)

#### How soft are shadows? {#elevation-values}

:label[Subtle]{tone="info"}

**Why**

Subtle shadows keep the grid crisp.

**Because of**

- What should the brand feel like? → Precise

**What it decided (4)**

*Theme picks it sets (4)*

- elevation.card in light: shadow.none: Only menus and dialogs float; cards use lines. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.overlay: Subtle shadows keep the grid crisp. [Elevation →](foundations/elevation)
- elevation.card in dark: shadow.none: Only menus and dialogs float; cards use lines. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.overlay-dark: Subtle shadows keep the grid crisp. [Elevation →](foundations/elevation)

#### Where does elevation show? {#elevation-lands}

:label[Menus and dialogs]{tone="info"}

**Why**

Menus and dialogs are the only layers.

**Because of**

- Elevation · What rises above the page? → Only what floats

**What it decided (1)**

*Rules it sets (1)*

- For a menu or dialog, use elevation.overlay and a dimmed page for dialogs. Don't use a border only. Floating things need a shadow so they read as on top. [Elevation →](foundations/elevation)
:::

:::fold{id="motion" title="Motion" note="5 answers, 5 decisions, and the values of its tokens"}
#### What is motion for? {#motion-roles}

:label[Feedback only]{tone="info"}

**Why**

Motion confirms an action; nothing else moves.

**Because of**

- What must the interface protect? → People keep their place

**What it decided (3)**

*Answers it led to (2)*

- Motion · How many speeds exist? → One [Motion →](foundations/motion)
- Motion · Where does motion show? → State changes only [Motion →](foundations/motion)

*Rules it sets (1)*

- When someone asks for less motion, use no motion. Don't use a shorter version of the motion. A shorter motion still moves. When people ask for less motion, nothing moves. [Motion →](foundations/motion)

#### How many speeds exist? {#motion-count}

:label[One]{tone="info"}

**Why**

One speed is enough for feedback.

**Because of**

- Motion · What is motion for? → Feedback only

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How is easing defined? {#motion-definition}

:label[Standard ease-out]{tone="info"}

**Why**

A standard ease-out never draws attention.

**Because of**

- What should the brand feel like? → Precise

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How fast does feedback feel? {#motion-values}

:label[Fast]{tone="info"}

**Why**

Fast feedback keeps up with experts.

**Because of**

- Which outcome matters most? → Time on task

**What it decided (2)**

*Rules it sets (1)*

- For hover and press feedback, use motion.duration.feedback (fast). Don't use no transition. Fast feedback confirms the pointer without slowing experts. [Motion →](foundations/motion)

*Variants it picks (1)*

- Button's hover state. Fast feedback that confirms the pointer. [Button →](components/button)

#### Where does motion show? {#motion-lands}

:label[State changes only]{tone="info"}

**Why**

Only state changes move.

**Because of**

- Motion · What is motion for? → Feedback only

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)
:::

:::fold{id="iconography" title="Iconography" note="5 answers, 5 decisions, and the values of its tokens"}
#### What do icons do? {#iconography-roles}

:label[Actions and status]{tone="info"}

**Why**

Icons mark row actions and status.

**Because of**

- How often do people repeat actions? → Constantly

**What it decided (4)**

*Rules it sets (1)*

- For an icon with no label, use icon button with a tooltip. Don't use a bare icon. Experts learn icons; the tooltip covers the first uses. [Iconography →](foundations/iconography)

*Variants it picks (3)*

- Button's icon size. Known row and toolbar actions, always with a tooltip. [Button →](components/button)
- Input group's inline-start align. The search icon before the text. [Input group →](components/input-group)
- Empty's icon variant. An outline icon in a small tile beside the reason and the action. [Empty →](components/empty)

#### How many icon sizes exist? {#iconography-count}

:label[One]{tone="info"}

**Why**

One size, matched to the small text.

**Because of**

- Typography · How large is body text? → Small

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)

#### What icon style? {#iconography-definition}

:label[Outline]{tone="info"}

**Why**

Outline icons stay light next to dense text.

**Because of**

- How much is on one screen? → A lot

**What it decided (1)**

*Variants it picks (1)*

- Empty's icon variant. An outline icon in a small tile beside the reason and the action. [Empty →](components/empty)

#### How big are icons next to text? {#iconography-values}

:label[Match the text]{tone="info"}

**Why**

Icons match the label so they do not outweigh it.

**Because of**

- How much is on one screen? → A lot

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)

#### Where do icons work hardest? {#iconography-lands}

:label[Toolbars and rows]{tone="info"}

**Why**

Icons work hardest in toolbars and row actions.

**Because of**

- How often do people repeat actions? → Constantly

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)
:::

:::fold{id="theming" title="Theming" note="5 answers, 2 decisions, and the values of its tokens"}
#### What can a theme change? {#theming-roles}

:label[Mode only]{tone="info"}

**Why**

One brand, so only the mode changes.

**Because of**

- How many brands or products share the system? → One

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)

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

One product, one brand.

**Because of**

- How many brands or products share the system? → One

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)

#### Which modes ship? {#theming-values}

:label[Light and dark]{tone="info"}

**Why**

Light first, always; dark ships as standard for night shifts.

**Because of**

- How long is one visit? → All day

**What it decided (2)**

*Answers it led to (1)*

- Theming · How many themes ship? → Two [Theming →](foundations/theming)

*Rules it sets (1)*

- When someone switches to dark, use the dark semantic mode. Don't use a second palette in components. Only semantic colors change, so layout never moves. [Theming →](foundations/theming)

#### What changes when the theme changes? {#theming-lands}

:label[Colors only]{tone="info"}

**Why**

A mode switch changes colors only, so layout never moves.

**Because of**

- What must the interface protect? → People keep their place

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)
:::

:::fold{id="accessibility" title="Accessibility" note="5 answers, 103 decisions, and the values of its tokens"}
#### Which states get their own visible value? {#accessibility-roles}

:label[Hover, focus, disabled]{tone="info"}

**Why**

Pressed reuses hover; experts do not need more.

**Because of**

- Who uses it most? → Daily experts

**What it decided (16)**

*Theme picks it sets (16)*

- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.100, the highlight's step: pressed reuses hover; experts do not need more. [Color →](foundations/color)
- color.action.primary.hover in light: violet.light.700: one step from the primary action (violet.light.600), so the pointer shows; its label still reads 10.19:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.25:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.700: one step from the danger action (red.light.600), so the pointer shows; its label still reads 8.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.disabled.text in light: neutral.500: 4.66:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in light: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in light: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.100, the highlight's step: pressed reuses hover; experts do not need more. [Color →](foundations/color)
- color.action.primary.hover in dark: violet.dark.700: one step from the primary action (violet.dark.600), so the pointer shows; its label still reads 9.62:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 13.05:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.3:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.disabled.text in dark: neutral.500: 10.58:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in dark: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in dark: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)

#### How many signals carry each meaning? {#accessibility-count}

:label[Three: color, icon and word]{tone="info"}

**Why**

Many statuses share one table; color alone is not enough.

**Because of**

- What accessibility level do we commit to? → AA
- What is the main content? → Numbers and records

**What it decided (26)**

*Rules it sets (2)*

- For an error message, use color.status.danger with an icon. Don't use color.status.warning. Red always means fix this, and the icon says it without color. [Color →](foundations/color)
- For a status, use badge with a subtle fill, an icon and a word. Don't use a full-strength fill. Subtle fills let many statuses share one table. [Color →](foundations/color)

*Variants it picks (6)*

- Badge's neutral tone. New and False positive: not triaged yet, or a finished outcome that is not a failure. [Badge →](components/badge)
- Badge's info tone. Investigating: an analyst is on it; news, nothing to act on. [Badge →](components/badge)
- Badge's success tone. Resolved: contained and closed. [Badge →](components/badge)
- Badge's warning tone. Escalated: needs a senior analyst soon, still containable. [Badge →](components/badge)
- Badge's danger tone. Breach confirmed: a real loss. [Badge →](components/badge)
- Alert's destructive variant. A record that was not saved or an action that failed: name the record, then the fix, with an icon. [Alert →](components/alert)

*Theme picks it sets (18)*

- color.text.info-on-light: blue.light.800: info text on its own tint, 12.97:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: blue.light.100: info text on its own tint, 10.82:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 12.05:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 11.34:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 11.33:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.selected in light: violet.light.100: a tint of the brand, 1.17:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in light: blue.light.100: a quiet tint behind info; its text, 12.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in light: green.light.100: a quiet tint behind success; its text, 10.79:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in light: amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in light: red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.selected in dark: violet.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in dark: blue.dark.100: a quiet tint behind info; its text, 10.82:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 12.05:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 11.34:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 11.33:1, above the 4.5:1 floor. [Color →](foundations/color)

#### What contrast floor do we hold? {#accessibility-definition}

:label[AA]{tone="info"}

**Why**

AA contrast for every text.

**Because of**

- What accessibility level do we commit to? → AA

**What it decided (56)**

*Theme picks it sets (56)*

- color.text.on-light: slate.light.900: the text for every light fill, 17.28:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-dark: slate.light.0: the text for every dark fill, 6.97:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-light: blue.light.800: info text on its own tint, 12.97:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: blue.light.100: info text on its own tint, 10.82:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 12.05:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 11.34:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 11.33:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.default in light: neutral.0: the base for content; body text reads 17.28:1 on it, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.inverse in light: neutral.900: the reverse of content for short messages; its text reads, 17.28:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.primary in light: neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.secondary in light: neutral.700: supporting text, 9.52:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.muted in light: neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.inverse in light: text.on-dark: the text its fill's tone picks, 17.28:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-action in light: text.on-dark: the text its fill's tone picks, 6.97:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.link in light: violet.light.700: a link, set apart by its hue, 10.19:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-danger in light: text.on-dark: the text its fill's tone picks, 5.63:1 on action.danger, above the 4.5:1 floor. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in light: neutral.500: the edge of a control people must find, 4.66:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in light: violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in light: violet.light.600: the edge beside a selected fill, so selection is never color alone, 6.97:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in light: violet.light.600: the primary action's fill; its label reads, 6.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary.hover in light: violet.light.700: one step from the primary action (violet.light.600), so the pointer shows; its label still reads 10.19:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 17.28:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.25:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.600: the danger action's fill; its label reads, 5.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.700: one step from the danger action (red.light.600), so the pointer shows; its label still reads 8.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info in light: blue.light.600: info reads as text and icons, 10.11:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in light: green.light.600: success reads as text and icons, 5.38:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in light: amber.light.600: warning reads as text and icons, 6.16:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in light: red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.default in dark: neutral.50: the base for content; body text reads 16.26:1 on it, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.inverse in dark: neutral.900: the reverse of content for short messages; its text reads, 16.26:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.primary in dark: neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.secondary in dark: neutral.500: supporting text, 10.58:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.muted in dark: neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.inverse in dark: text.on-light: the text its fill's tone picks, 16.26:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-action in dark: text.on-light: the text its fill's tone picks, 7.62:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.link in dark: violet.dark.700: a link, set apart by its hue, 9.62:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-danger in dark: text.on-light: the text its fill's tone picks, 7.28:1 on action.danger, above the 4.5:1 floor. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in dark: neutral.400: the edge of a control people must find, 6.47:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in dark: violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in dark: violet.dark.600: the edge beside a selected fill, so selection is never color alone, 7.62:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in dark: violet.dark.600: the primary action's fill; its label reads, 7.62:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary.hover in dark: violet.dark.700: one step from the primary action (violet.dark.600), so the pointer shows; its label still reads 9.62:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 16.26:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 13.05:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.28:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.3:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info in dark: blue.dark.600: info reads as text and icons, 8.2:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 7.82:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 9.66:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.28:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)

#### What is the smallest target? {#accessibility-values}

:label[Compact, for a pointer]{tone="info"}

**Why**

Mouse and keyboard; compact targets are enough.

**Because of**

- Where do people use it? → At a desk

**What it decided (5)**

*Rules it sets (1)*

- For the smallest clickable thing, use size.control.compact. Don't use anything smaller. Compact still fits a mouse. Touch is not this product's input. [Accessibility →](foundations/accessibility)

*Variants it picks (4)*

- Button's default size. Actions outside tables: forms, dialogs, page actions. [Button →](components/button)
- Button's compact size. Table rows and toolbars. Compact still fits a mouse. [Button →](components/button)
- Item's sm size. Long lists in a side panel, at the denser size. It still fits a mouse. [Item →](components/item)
- Toggle's sm size. The table toolbar, matching compact buttons. It still fits a mouse. [Toggle →](components/toggle)

#### Where are the floors hardest to hold? {#accessibility-lands}

:label[Dense tables]{tone="info"}

**Why**

Small text and thin lines in tables need the most care.

**Because of**

- How much is on one screen? → A lot

**What it decided**

It sets the values of the accessibility tokens: [Accessibility →](foundations/accessibility)
:::

:::fold{id="naming" title="Naming" note="5 answers, 1 decision, and the values of its tokens"}
#### What gets a name? {#naming-roles}

:label[Tokens and component keys]{tone="info"}

**Why**

Components get their own keys.

**Because of**

- How fast does it change? → Every month

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

Role names survive a redesign.

**Because of**

- Who maintains the system? → A small team

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How are names written? {#naming-values}

:label[Lowercase words in paths]{tone="info"}

**Why**

Lowercase paths read the same in CSS, JSON and Figma.

**Because of**

- Who maintains the system? → A small team

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### What do components read? {#naming-lands}

:label[Component keys]{tone="info"}

**Why**

A component API keeps changes local.

**Because of**

- How fast does it change? → Every month

**What it decided (1)**

*Rules it sets (1)*

- For a value with no token, use the closest semantic token, then ask for a new one. Don't use a raw value in the component. Raw values break dark mode and the next redesign. [Naming →](foundations/naming)
:::

:::fold{id="voice" title="Voice and tone" note="5 answers, 13 decisions, and the values of its tokens"}
#### Which kinds of copy does it need? {#voice-roles}

:label[Labels and messages]{tone="info"}

**Why**

Labels and messages are all the copy an operations tool needs.

**Because of**

- What does the product do for the business? → Runs daily operations

**What it decided**

It sets the values of the voice and tone tokens: [Voice and tone →](foundations/voice)

#### How many tones does it use? {#voice-count}

:label[One]{tone="info"}

**Why**

One flat tone everywhere; experts want no surprises.

**Because of**

- Who uses it most? → Daily experts

**What it decided (1)**

*Rules it sets (1)*

- For a first visit, use no tour. Show the data, with a tooltip where needed. Don't use a welcome tour. Daily experts skip tours; tooltips cover the first uses. [Voice →](foundations/voice)

#### How is the voice defined? {#voice-definition}

:label[Rules and a word list]{tone="info"}

**Why**

A word list keeps labels identical across screens.

**Because of**

- Who maintains the system? → A small team
- How often do people repeat actions? → Constantly

**What it decided (1)**

*Rules it sets (1)*

- For a button label, use one verb from the word list. Don't use a sentence or "Please". Labels repeat on every screen; one verb reads fastest. [Voice →](foundations/voice)

#### How does it sound? {#voice-values}

:label[Terse]{tone="info"}

**Why**

Experts want short labels and short messages.

**Because of**

- Who uses it most? → Daily experts
- What should the brand feel like? → Precise

**What it decided (7)**

*Rules it sets (3)*

- For a button label, use one verb from the word list. Don't use a sentence or "Please". Labels repeat on every screen; one verb reads fastest. [Voice →](foundations/voice)
- For the words of an error, use name the record, then the fix. Flat and specific. Don't use "Oops" or a vague apology. Experts act on the message; the record and the fix are all they need. [Voice →](foundations/voice)
- For a success message, use a short confirmation with the count. Don't use celebration. Confirm and get out of the way; the next task is waiting. [Voice →](foundations/voice)

*Variants it picks (4)*

- Alert's destructive variant. A record that was not saved or an action that failed: name the record, then the fix, with an icon. [Alert →](components/alert)
- Toast's neutral tone. A plain confirmation: Filters cleared. [Toast →](components/toast)
- Toast's success tone. A short confirmation with the count: 12 alerts exported. [Toast →](components/toast)
- Toast's danger tone. A background failure: name the record, then the fix. [Toast →](components/toast)

#### Where do the words matter most? {#voice-lands}

:label[Errors and empty states]{tone="info"}

**Why**

Errors and empty tables are where words decide the next action.

**Because of**

- What is a costly mistake? → Acting on the wrong record

**What it decided (4)**

*Rules it sets (2)*

- For the words of an error, use name the record, then the fix. Flat and specific. Don't use "Oops" or a vague apology. Experts act on the message; the record and the fix are all they need. [Voice →](foundations/voice)
- For an empty state, use why it is empty and the one action that fills it. Don't use a blank table. An empty table with no words looks like an error. [Voice →](foundations/voice)

*Variants it picks (2)*

- Toast's danger tone. A background failure: name the record, then the fix. [Toast →](components/toast)
- Empty's default variant isn't used. No pictures: an empty table needs the reason and the one action that fills it. [Empty →](components/empty)
:::

:::fold{id="components" title="Components" note="5 answers, 1 decision, and the values of its tokens"}
#### Which component families does it need? {#components-roles}

:label[Core, plus data]{tone="info"}

**Why**

Records need tables, filters and fast ways to move between them.

**Because of**

- What is the main content? → Numbers and records
- What is the main task? → Scan and compare

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How far does the inventory reach? {#components-count}

:label[What today's screens use, plus what the next ones will likely need]{tone="info"}

**Why**

A full operations tool with the parts its next screens will need, still few enough for a small team to keep right.

**Because of**

- How much is on one screen? → A lot
- Who maintains the system? → A small team

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How does a component earn its place? {#components-definition}

:label[A use scenario needs it]{tone="info"}

**Why**

A component joins only when a daily task needs it.

**Because of**

- Where do people use it? → At a desk
- How often do people repeat actions? → Constantly

**What it decided (1)**

*Rules it sets (1)*

- When no component in the inventory fits, use a component from the inventory, composed (for example a popover with a command list). Don't use a one-off component built for one screen. A small team keeps fewer parts right, and experts expect the same parts everywhere. [Components →](foundations/components)

#### When does a component get another look? {#components-values}

:label[Only when the meaning changes]{tone="info"}

**Why**

Repeated screens stay identical when a component changes only with its meaning.

**Because of**

- How visible is the brand in the interface? → Quiet
- How often do people repeat actions? → Constantly

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### Where do components do the most work? {#components-lands}

:label[Tables and forms]{tone="info"}

**Why**

Most work happens in tables and the forms that edit them.

**Because of**

- What is the main content? → Numbers and records
- What is the main task? → Scan and compare

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)
:::
