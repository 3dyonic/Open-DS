---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1.5
title: "Decision reference"
description: "Accessible first: each question, its answer, and the design decisions it made."
hide_table_of_contents: true
---

# Decision reference

:::intro{robot="accessible-first" title="Take it one answer at a time"}
This page keeps every decision behind Accessible first in one place: 79 answers and what each one shaped. It's a reference, not a reading list. Most days you only need one answer.

**Three easy ways in**

- Take a minute with [Where it starts](#where-it-starts). It shows the few first answers the rest grow from.
- Open one section when you wonder why. For example, why Accessible first's spacing is spacious, or why its voice is plain and direct.
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

- :label[Serves the public]{tone="info"} What does the product do for the business?
  - :label[Everyone, including people with disabilities]{tone="info"} Who uses it most?
    - :label[AAA]{tone="info"} What accessibility level do we commit to?
      - :label[Light and dark]{tone="info"} theming →
    - :label[One idea at a time]{tone="info"} How much is on one screen?
    - :label[Low effort to understand]{tone="info"} What must the interface protect?
      - :label[Calm and clear]{tone="info"} What should the brand feel like?
        - :label[One face drawn for legibility]{tone="info"} Which typefaces carry the product, and why?, also because **AAA, Forms and tasks**
        - :label[Balanced]{tone="info"} color → `color.neutral.0` `color.gray.dark.0`: #0A0A0A
        - :label[Slightly rounded]{tone="info"} shape → `radius.control` `radius.6`: 0.375rem
      - :label[Quiet]{tone="info"} How visible is the brand in the interface?
      - :label[Spacious]{tone="info"} spacing → `space.gap.tight` `space.12`: 0.75rem
    - :label[Anywhere, on any device]{tone="info"} Where do people use it?
    - :label[Large]{tone="info"} typography → `type.body.font-size` `font.size.19`: 1.1875rem
    - :label[Moderate]{tone="info"} motion → `motion.duration.feedback` `duration.moderate`: 200ms
    - :label[Larger than the text]{tone="info"} iconography → `size.icon` `size.20`: 1.25rem
    - :label[Large]{tone="info"} accessibility → `size.control.default` `size.52`: 3.25rem
    - :label[Plain and direct]{tone="info"} voice and tone →
    - :label[Only when the meaning changes]{tone="info"} components →
  - :label[Forms and tasks]{tone="info"} What is the main content?
    - :label[Complete a form]{tone="info"} What is the main task?
      - :label[Completion without errors]{tone="info"} Which outcome matters most?
      - :label[A task that fails]{tone="info"} What is a costly mistake?
      - :label[One sitting]{tone="info"} How long is one visit?
  - :label[Rarely]{tone="info"} How often do people repeat actions?
    - :label[They see it fresh each time]{tone="info"} How do people recall the interface?
- :label[One]{tone="info"} How many brands or products share the system?
- :label[A platform team]{tone="info"} Who maintains the system?
  - :label[Lowercase words in paths]{tone="info"} naming →
- :label[Rarely]{tone="info"} How fast does it change?

## Every question

All 79, by section, in the order every scheme answers them. Each answer shows why, what it came from, and every design decision it made. The menu in the sidebar opens a section; its number is how many decisions that section made.

### Reasons

:::fold{id="business" title="Business and product" note="2 answers, 6 decisions"}
#### What does the product do for the business? {#business-q1}

:label[Serves the public]{tone="info"}

**Why**

A public service everyone must be able to use.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (3)**

*Answers it led to (3)*

- Who uses it most? → Everyone, including people with disabilities
- What is the main content? → Forms and tasks
- How often do people repeat actions? → Rarely

#### How many brands or products share the system? {#business-q2}

:label[One]{tone="info"}

**Why**

One service, one brand.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (3)**

*Answers it led to (3)*

- Shape · How are corners set? → Fixed for the product [Shape →](foundations/shape)
- Theming · What can a theme change? → Mode only [Theming →](foundations/theming)
- Theming · How are brands handled? → One brand [Theming →](foundations/theming)
:::

:::fold{id="people" title="People and work context" note="2 answers, 43 decisions"}
#### Who uses it most? {#people-q1}

:label[Everyone, including people with disabilities]{tone="info"}

**Why**

Everyone, including people with low vision, motor and cognitive needs.

**Because of**

- What does the product do for the business? → Serves the public

**What it decided (20)**

*Answers it led to (18)*

- What accessibility level do we commit to? → AAA
- How much is on one screen? → One idea at a time
- What must the interface protect? → Low effort to understand
- Where do people use it? → Anywhere, on any device
- Typography · How large is body text? → Large [Typography →](foundations/typography)
- Spacing · Which spacing roles does it need? → Gaps, insets and row heights [Spacing →](foundations/spacing)
- Spacing · How many densities exist? → One [Spacing →](foundations/spacing)
- Motion · What is motion for? → Feedback only [Motion →](foundations/motion)
- Motion · How is easing defined? → Standard ease-out [Motion →](foundations/motion)
- Motion · How fast does feedback feel? → Moderate [Motion →](foundations/motion)
- Iconography · What icon style? → Filled [Iconography →](foundations/iconography)
- Iconography · How big are icons next to text? → Larger than the text [Iconography →](foundations/iconography)
- Accessibility · What is the smallest target? → Large [Accessibility →](foundations/accessibility)
- Voice and tone · How is the voice defined? → Rules and a word list [Voice and tone →](foundations/voice)
- Voice and tone · How does it sound? → Plain and direct [Voice and tone →](foundations/voice)
- Components · Which component families does it need? → Actions, forms, feedback, overlays, layout and navigation [Components →](foundations/components)
- Components · How does a component earn its place? → It works for everyone, with any device and assistive technology [Components →](foundations/components)
- Components · When does a component get another look? → Only when the meaning changes [Components →](foundations/components)

*Rules it sets (2)*

- For a number in a table, use type.body. Don't use a small or mono font. Every number must be readable at large size. [Typography →](foundations/typography)
- When no component in the inventory fits, use a native HTML element with a label and a hint. Don't use a custom widget that needs hover, drag or precise pointing. Native elements work with every assistive technology without extra work. [Components →](foundations/components)

#### What accessibility level do we commit to? {#people-q2}

:label[AAA]{tone="info"}

**Why**

AAA where it applies; nobody is left out.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (23)**

*Answers it led to (11)*

- Which typefaces carry the product, and why? → One face drawn for legibility
- Typography · How are sizes and line heights defined? → A ratio, line heights in proportion [Typography →](foundations/typography)
- Color · How is the palette defined? → Neutrals and one brand ramp [Color →](foundations/color)
- Elevation · What rises above the page? → Nothing [Elevation →](foundations/elevation)
- Elevation · What separates groups on the page? → Lines [Elevation →](foundations/elevation)
- Theming · Which modes ship? → Light and dark [Theming →](foundations/theming)
- Accessibility · Which states get their own visible value? → All, including loading [Accessibility →](foundations/accessibility)
- Accessibility · How many signals carry each meaning? → Three: color, icon and word [Accessibility →](foundations/accessibility)
- Accessibility · What contrast floor do we hold? → AAA for text [Accessibility →](foundations/accessibility)
- Components · How far does the inventory reach? → Only what today's screens use [Components →](foundations/components)
- Components · How does a component earn its place? → It works for everyone, with any device and assistive technology [Components →](foundations/components)

*Rules it sets (3)*

- For a field label or column header, use type.label, above the field, always visible. Don't use a placeholder as the label. Labels must stay visible while typing. [Typography →](foundations/typography)
- For a link, use color.text.link, underlined. Don't use color only. Underline works without color perception. [Color →](foundations/color)
- For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline. Focus must be seen by everyone. [Accessibility →](foundations/accessibility)

*Variants it picks (9)*

- Button's danger variant. The confirm of a delete, always with the verb and an icon, so color is never the only cue. [Button →](components/button)
- Button's focus state. Seen by everyone: the focus ring with an offset. [Button →](components/button)
- Button's disabled state isn't used. Keep it enabled and explain on press: nobody is left out, and nobody remembers the interface from last time. [Button →](components/button)
- Field's vertical orientation. Every question: the label above the field, always visible. [Field →](components/field)
- Field's horizontal orientation isn't used. Labels stay above the field, visible while typing and in the same place on any screen. [Field →](components/field)
- Input group's inline-start align. A currency sign before the amount, with the label still above the field. [Input group →](components/input-group)
- Input group's inline-end align. A unit after the value, as a word people can read, with the label still above the field. [Input group →](components/input-group)
- Input group's block-start align isn't used. The label stays above the field, outside it, always visible. [Input group →](components/input-group)
- Input group's block-end align isn't used. Hints and errors sit in the field layout, in the same place on every question. [Input group →](components/input-group)
:::

:::fold{id="content" title="Content and data" note="2 answers, 9 decisions"}
#### What is the main content? {#content-q1}

:label[Forms and tasks]{tone="info"}

**Why**

Most screens are forms and steps.

**Because of**

- What does the product do for the business? → Serves the public

**What it decided (9)**

*Answers it led to (9)*

- What is the main task? → Complete a form
- Which typefaces carry the product, and why? → One face drawn for legibility
- Typography · Where does type do the most work? → Forms and labels [Typography →](foundations/typography)
- Spacing · Where does spacing matter most? → Between fields [Spacing →](foundations/spacing)
- Shape · Where does shape show most? → Controls and cards [Shape →](foundations/shape)
- Accessibility · Where are the floors hardest to hold? → Forms [Accessibility →](foundations/accessibility)
- Voice and tone · Which kinds of copy does it need? → Labels, messages and help [Voice and tone →](foundations/voice)
- Components · Which component families does it need? → Actions, forms, feedback, overlays, layout and navigation [Components →](foundations/components)
- Components · Where do components do the most work? → Forms and steps [Components →](foundations/components)

#### How much is on one screen? {#content-q2}

:label[One idea at a time]{tone="info"}

**Why**

One question per screen lowers effort.

**Because of**

- Who uses it most? → Everyone, including people with disabilities
:::

:::fold{id="tasks" title="Tasks and flows" note="2 answers, 8 decisions"}
#### What is the main task? {#tasks-q1}

:label[Complete a form]{tone="info"}

**Why**

People must finish the form.

**Because of**

- What is the main content? → Forms and tasks

**What it decided (7)**

*Answers it led to (4)*

- Which outcome matters most? → Completion without errors
- What is a costly mistake? → A task that fails
- How long is one visit? → One sitting
- Components · Where do components do the most work? → Forms and steps [Components →](foundations/components)

*Rules it sets (1)*

- For a field label or column header, use type.label, above the field, always visible. Don't use a placeholder as the label. Labels must stay visible while typing. [Typography →](foundations/typography)

*Variants it picks (2)*

- Field's vertical orientation. Every question: the label above the field, always visible. [Field →](components/field)
- Input group's inline-start align. A currency sign before the amount, with the label still above the field. [Input group →](components/input-group)

#### How often do people repeat actions? {#tasks-q2}

:label[Rarely]{tone="info"}

**Why**

People do this once or twice a year.

**Because of**

- What does the product do for the business? → Serves the public

**What it decided (1)**

*Answers it led to (1)*

- How do people recall the interface? → They see it fresh each time
:::

:::fold{id="human" title="Human factors" note="2 answers, 23 decisions"}
#### What must the interface protect? {#human-q1}

:label[Low effort to understand]{tone="info"}

**Why**

Low effort to understand each step.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (15)**

*Answers it led to (10)*

- What should the brand feel like? → Calm and clear
- How visible is the brand in the interface? → Quiet
- Typography · Which text roles does it need? → Core: heading, body, label [Typography →](foundations/typography)
- Typography · How many steps does the type scale take? → Only the steps the screens need [Typography →](foundations/typography)
- Color · Which color roles does it need? → Surface, text, action and status [Color →](foundations/color)
- Color · How many emphasis levels do actions need? → Two [Color →](foundations/color)
- Spacing · How are spacing steps defined? → Big, even steps [Spacing →](foundations/spacing)
- Spacing · How dense is the layout? → Spacious [Spacing →](foundations/spacing)
- Shape · Which shape roles does it need? → Controls, badges and containers [Shape →](foundations/shape)
- Voice and tone · How many tones does it use? → One [Voice and tone →](foundations/voice)

*Rules it sets (3)*

- For a page title, use type.title. Don't use type.display. The same title size on every page tells people where they are. The display size changes from page to page and pushes the content down. [Typography →](foundations/typography)
- For a paragraph or help text, use type.body, short sentences. Don't use type.caption. Large text and short lines lower effort. [Typography →](foundations/typography)
- For a first visit, use say how many steps there are and how long it takes. Don't use marketing copy. Knowing the length lowers effort and anxiety. [Voice →](foundations/voice)

*Variants it picks (2)*

- Alert's default variant. Important notes that stay on the page while people answer. [Alert →](components/alert)
- Empty's default variant isn't used. The brand stays out of the way: words say what will appear and how to start. [Empty →](components/empty)

#### How do people recall the interface? {#human-q2}

:label[They see it fresh each time]{tone="info"}

**Why**

Nobody remembers the interface from last time.

**Because of**

- How often do people repeat actions? → Rarely

**What it decided (8)**

*Answers it led to (1)*

- Iconography · What do icons do? → Actions and status [Iconography →](foundations/iconography)

*Rules it sets (2)*

- For an alternative or cancel, use button secondary. Don't use a text link. Every action looks like a button people can find. [Color →](foundations/color)
- For an action on one row or item, use button secondary with a word. Don't use an icon on its own. A word says what will happen. [Iconography →](foundations/iconography)

*Variants it picks (5)*

- Button's secondary variant. Every other action, always with a word: alternatives, row actions, and the first step of a delete. [Button →](components/button)
- Button's ghost variant isn't used. Every action looks like a button people can find. [Button →](components/button)
- Button's disabled state isn't used. Keep it enabled and explain on press: nobody is left out, and nobody remembers the interface from last time. [Button →](components/button)
- Field's responsive orientation isn't used. One layout on every device, so people meet the same form every time. [Field →](components/field)
- Toggle's default variant isn't used. Every action looks like a control people can find, so the toggle keeps its border. [Toggle →](components/toggle)
:::

:::fold{id="outcomes" title="Outcomes" note="2 answers, 13 decisions"}
#### Which outcome matters most? {#outcomes-q1}

:label[Completion without errors]{tone="info"}

**Why**

Completion without errors is the measure.

**Because of**

- What is the main task? → Complete a form

**What it decided (5)**

*Answers it led to (2)*

- Color · Where does color carry meaning first? → Links and actions [Color →](foundations/color)
- Voice and tone · Where do the words matter most? → Form steps and errors [Voice and tone →](foundations/voice)

*Rules it sets (1)*

- For a success message, use confirm what happened and what comes next. Don't use a confirmation with no next step. People need to know the task is finished and what happens now. [Voice →](foundations/voice)

*Variants it picks (2)*

- Alert's default variant. Important notes that stay on the page while people answer. [Alert →](components/alert)
- Badge's success tone. A finished task, with a filled icon and a word. [Badge →](components/badge)

#### What is a costly mistake? {#outcomes-q2}

:label[A task that fails]{tone="info"}

**Why**

A failed form can cost someone a benefit.

**Because of**

- What is the main task? → Complete a form

**What it decided (8)**

*Rules it sets (3)*

- For an error message, use color.status.danger, an icon and a sentence next to the field. Don't use color alone. People must know what went wrong and where. [Color →](foundations/color)
- For a delete or remove, use button secondary, then a confirm page with Button danger. Don't use button primary. A confirm step prevents a costly error. [Color →](foundations/color)
- For a confirmation question, use say what will happen in plain words, and offer a way back. Don't use a double negative. Plain words prevent a choice people did not mean. [Voice →](foundations/voice)

*Variants it picks (5)*

- Button's secondary variant. Every other action, always with a word: alternatives, row actions, and the first step of a delete. [Button →](components/button)
- Button's danger variant. The confirm of a delete, always with the verb and an icon, so color is never the only cue. [Button →](components/button)
- Alert's destructive variant. Errors, with what went wrong, where, and exactly how to fix it, next to the field. [Alert →](components/alert)
- Badge's warning tone. A risk people can still fix before they finish, with an icon and a word. [Badge →](components/badge)
- Badge's danger tone. A failure that blocks the task, with a filled icon and a word; an alert says how to fix it. [Badge →](components/badge)
:::

:::fold{id="brand" title="Brand" note="3 answers, 13 decisions"}
#### What should the brand feel like? {#brand-q1}

:label[Calm and clear]{tone="info"}

**Why**

Calm and clear, never clever.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided (5)**

*Answers it led to (5)*

- Which typefaces carry the product, and why? → One face drawn for legibility
- Color · How saturated is the palette? → Balanced [Color →](foundations/color)
- Shape · What should control corners say? → Slightly rounded [Shape →](foundations/shape)
- Voice and tone · How does it sound? → Plain and direct [Voice and tone →](foundations/voice)
- Components · When does a component get another look? → Only when the meaning changes [Components →](foundations/components)

#### How visible is the brand in the interface? {#brand-q2}

:label[Quiet]{tone="info"}

**Why**

The brand stays out of the way.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided (1)**

*Variants it picks (1)*

- Empty's default variant isn't used. The brand stays out of the way: words say what will appear and how to start. [Empty →](components/empty)

#### Which typefaces carry the product, and why? {#brand-q3}

:label[One face drawn for legibility]{tone="info"}

**Why**

Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out.

**What it weighs (11)**

*Reading*

- **Readability.** Atkinson Hyperlegible was designed by the Braille Institute for readers with low vision.
- **Legibility.** Its letters are drawn to stay apart: I, l and 1, 0 and O, b and d don't look alike.

*Range*

- **Scalability.** Regular and bold carry the hierarchy; size does the rest, so every role stays readable.
- **Numerals.** Its digits are drawn to be told apart; figures line up when columns align to the right.
- **Scripts and languages.** Latin, with accents for many languages; other scripts need a face chosen for the same legibility.

*Brand*

- **Recognition.** Accessibility is the brand promise, and the face says it.
- **Familiarity.** A plain, open sans feels familiar and calm in forms and steps.
- **Personality.** Calm and clear, never clever, as the brand answer asks.

*Delivery*

- **Performance.** One family, two weights: the lightest load of all five schemes.
- **Licensing.** SIL Open Font License: free to embed in apps and on the web.
- **Fallback and pairing.** Falls back to Verdana, a wide, legible system face, as its token says; no second face is needed.

**Because of**

- What should the brand feel like? → Calm and clear
- What accessibility level do we commit to? → AAA
- What is the main content? → Forms and tasks

**What it decided (7)**

*Theme picks it sets (7)*

- type.display.font-family: atkinson-hyperlegible for display text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out. [Typography →](foundations/typography)
- type.title.font-family: atkinson-hyperlegible for title text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out. [Typography →](foundations/typography)
- type.heading.font-family: atkinson-hyperlegible for heading text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out. [Typography →](foundations/typography)
- type.body.font-family: atkinson-hyperlegible for body text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out. [Typography →](foundations/typography)
- type.label.font-family: atkinson-hyperlegible for label text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out. [Typography →](foundations/typography)
- type.caption.font-family: atkinson-hyperlegible for caption text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out. [Typography →](foundations/typography)
- type.data.font-family: atkinson-hyperlegible for data text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out. [Typography →](foundations/typography)
:::

:::fold{id="scenarios" title="Use scenarios" note="2 answers, 3 decisions"}
#### Where do people use it? {#scenarios-q1}

:label[Anywhere, on any device]{tone="info"}

**Why**

Public services are used on any device, with any assistive technology.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (1)**

*Variants it picks (1)*

- Field's responsive orientation isn't used. One layout on every device, so people meet the same form every time. [Field →](components/field)

#### How long is one visit? {#scenarios-q2}

:label[One sitting]{tone="info"}

**Why**

An application is finished in one sitting, or saved and resumed.

**Because of**

- What is the main task? → Complete a form

**What it decided (2)**

*Rules it sets (1)*

- For a first visit, use say how many steps there are and how long it takes. Don't use marketing copy. Knowing the length lowers effort and anxiety. [Voice →](foundations/voice)

*Variants it picks (1)*

- Badge's neutral tone. A waiting state, such as an application saved to resume later, with an icon and a word. [Badge →](components/badge)
:::

:::fold{id="team" title="Team and delivery" note="2 answers, 6 decisions"}
#### Who maintains the system? {#team-q1}

:label[A platform team]{tone="info"}

**Why**

A platform team serves many services.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (2)**

*Answers it led to (2)*

- Naming · How are decisions named? → By role [Naming →](foundations/naming)
- Naming · How are names written? → Lowercase words in paths [Naming →](foundations/naming)

#### How fast does it change? {#team-q2}

:label[Rarely]{tone="info"}

**Why**

Changes are rare and tested.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (4)**

*Answers it led to (4)*

- Naming · What gets a name? → Tokens and component keys [Naming →](foundations/naming)
- Naming · How many token tiers? → Three [Naming →](foundations/naming)
- Naming · What do components read? → Component keys [Naming →](foundations/naming)
- Components · How far does the inventory reach? → Only what today's screens use [Components →](foundations/components)
:::

### Scopes

:::fold{id="typography" title="Typography" note="5 answers, 0 decisions, and the values of its tokens"}
#### Which text roles does it need? {#typography-roles}

:label[Core: heading, body, label]{tone="info"}

**Why**

Few roles keep pages predictable.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How many steps does the type scale take? {#typography-count}

:label[Only the steps the screens need]{tone="info"}

**Why**

Only the sizes the screens need, each clearly different.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How are sizes and line heights defined? {#typography-definition}

:label[A ratio, line heights in proportion]{tone="info"}

**Why**

Line height grows with text size for zoom users.

**Because of**

- What accessibility level do we commit to? → AAA

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How large is body text? {#typography-values}

:label[Large]{tone="info"}

**Why**

Large text is readable for more people.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### Where does type do the most work? {#typography-lands}

:label[Forms and labels]{tone="info"}

**Why**

Type matters most in form labels and hints.

**Because of**

- What is the main content? → Forms and tasks

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)
:::

:::fold{id="color" title="Color" note="5 answers, 90 decisions, and the values of its tokens"}
#### Which color roles does it need? {#color-roles}

:label[Surface, text, action and status]{tone="info"}

**Why**

Few color roles, each with one clear meaning.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### How many emphasis levels do actions need? {#color-count}

:label[Two]{tone="info"}

**Why**

Primary and secondary only; fewer choices, fewer errors.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided (28)**

*Rules it sets (1)*

- For the action that completes the task, use button primary, one per page. Don't use two primaries. One clear next step. Two primaries make people stop and compare, which adds effort. [Color →](foundations/color)

*Variants it picks (1)*

- Button's primary variant. The one next step on a page. [Button →](components/button)

*Theme picks it sets (26)*

- color.action.primary in light: blue.light.600: the primary action's fill; its label reads, 7.26:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 18.42:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.700: the danger action's fill; its label reads, 8.55:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.1 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.26:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in light: blue.light.100: a tag's tint; text on it reads, 15.61:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.2 in light: teal.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.95:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in light: teal.light.100: a tag's tint; text on it reads, 15.61:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.3 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in light: green.light.100: a tag's tint; text on it reads, 16.13:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.4 in light: amber.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in light: amber.light.100: a tag's tint; text on it reads, 15.49:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.5 in light: neutral.500: a series color: a distinct hue with no meaning, for tags and chart marks, 7.0:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in light: neutral.100: a tag's tint; text on it reads, 15.74:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.primary in dark: blue.dark.600: the primary action's fill; its label reads, 8.74:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 17.2:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.76:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.1 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.74:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in dark: blue.dark.100: a tag's tint; text on it reads, 14.23:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.2 in dark: teal.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.21:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in dark: teal.dark.100: a tag's tint; text on it reads, 13.57:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.3 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.33:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in dark: green.dark.100: a tag's tint; text on it reads, 13.96:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.4 in dark: amber.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.29:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in dark: amber.dark.100: a tag's tint; text on it reads, 13.74:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.5 in dark: neutral.700: a series color: a distinct hue with no meaning, for tags and chart marks, 12.68:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in dark: neutral.100: a tag's tint; text on it reads, 14.85:1, above the 7:1 floor. [Color →](foundations/color)

#### How is the palette defined? {#color-definition}

:label[Neutrals and one brand ramp]{tone="info"}

**Why**

True neutrals and one strong blue, checked for contrast.

**Because of**

- What accessibility level do we commit to? → AAA

**What it decided (36)**

*Theme picks it sets (36)*

- color.neutral.0 in light: gray.light.0: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.50 in light: gray.light.50: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.100 in light: gray.light.100: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.200 in light: gray.light.200: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.300 in light: gray.light.300: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.400 in light: gray.light.400: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.500 in light: gray.light.500: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.600 in light: gray.light.600: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.700 in light: gray.light.700: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.800 in light: gray.light.800: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.900 in light: gray.light.900: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.950 in light: gray.light.950: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.surface.canvas in light: neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.17:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: every state, including loading, gets its own value. [Color →](foundations/color)
- color.surface.selected in light: blue.light.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in light: blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.neutral.0 in dark: gray.dark.0: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.50 in dark: gray.dark.50: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.100 in dark: gray.dark.100: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.200 in dark: gray.dark.200: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.300 in dark: gray.dark.300: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.400 in dark: gray.dark.400: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.500 in dark: gray.dark.500: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.600 in dark: gray.dark.600: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.700 in dark: gray.dark.700: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.800 in dark: gray.dark.800: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.900 in dark: gray.dark.900: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.neutral.950 in dark: gray.dark.950: the scheme's neutral is gray. True neutrals and one strong blue, checked for contrast. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.16:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: every state, including loading, gets its own value. [Color →](foundations/color)
- color.surface.selected in dark: blue.dark.100: a tint of the brand, 1.21:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in dark: blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)

#### How saturated is the palette? {#color-values}

:label[Balanced]{tone="info"}

**Why**

Strong but not loud color.

**Because of**

- What should the brand feel like? → Calm and clear

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### Where does color carry meaning first? {#color-lands}

:label[Links and actions]{tone="info"}

**Why**

Links and actions must be found by everyone.

**Because of**

- Which outcome matters most? → Completion without errors

**What it decided (26)**

*Theme picks it sets (26)*

- color.status.info in light: teal.light.600: info reads as text and icons, 7.95:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.info.subtle in light: teal.light.100: a quiet tint behind info; its text, 12.76:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.success in light: green.light.600: success marks icons and edges, 5.38:1 on surface.default, over 3:1; its text uses success-on-light, which reads at the floor. [Color →](foundations/color)
- color.status.success.subtle in light: green.light.100: a quiet tint behind success; its text, 10.79:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.warning in light: amber.light.600: warning marks icons and edges, 6.16:1 on surface.default, over 3:1; its text uses warning-on-light, which reads at the floor. [Color →](foundations/color)
- color.status.warning.subtle in light: amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.danger in light: red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in light: red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.1 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.26:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in light: teal.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.95:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in light: amber.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in light: neutral.500: a series color: a distinct hue with no meaning, for tags and chart marks, 7.0:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.status.info in dark: teal.dark.600: info reads as text and icons, 10.21:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.info.subtle in dark: teal.dark.100: a quiet tint behind info; its text, 12.32:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 8.33:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 13.1:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 10.29:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 12.37:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 12.25:1, above the 7:1 floor. [Color →](foundations/color)
- color.category.1 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.74:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in dark: teal.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.21:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.33:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in dark: amber.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.29:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in dark: neutral.700: a series color: a distinct hue with no meaning, for tags and chart marks, 12.68:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
:::

:::fold{id="spacing" title="Spacing" note="5 answers, 3 decisions, and the values of its tokens"}
#### Which spacing roles does it need? {#spacing-roles}

:label[Gaps, insets and row heights]{tone="info"}

**Why**

Large rows matter for touch and zoom.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How many densities exist? {#spacing-count}

:label[One]{tone="info"}

**Why**

One density; no compact mode to fail people.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (1)**

*Variants it picks (1)*

- Item's sm size isn't used. Large targets help people with motor needs; nothing smaller. [Item →](components/item)

#### How are spacing steps defined? {#spacing-definition}

:label[Big, even steps]{tone="info"}

**Why**

Big, even steps lower effort.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How dense is the layout? {#spacing-values}

:label[Spacious]{tone="info"}

**Why**

Space lowers effort and mis-taps.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided (2)**

*Rules it sets (1)*

- For items that belong together, use space.gap.default. Don't use space.gap.tight. Generous space lowers mis-taps. [Spacing →](foundations/spacing)

*Theme picks it sets (1)*

- radius.option: radius.4: the panel's 8px corner less its 4px padding, so an option's corner nests inside the menu's. [Shape →](foundations/shape)

#### Where does spacing matter most? {#spacing-lands}

:label[Between fields]{tone="info"}

**Why**

Space between fields prevents mis-taps.

**Because of**

- What is the main content? → Forms and tasks

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)
:::

:::fold{id="shape" title="Shape" note="5 answers, 10 decisions, and the values of its tokens"}
#### Which shape roles does it need? {#shape-roles}

:label[Controls, badges and containers]{tone="info"}

**Why**

Badges keep a clear rectangle.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided (6)**

*Answers it led to (1)*

- Shape · How many corner sizes exist? → Three [Shape →](foundations/shape)

*Rules it sets (1)*

- For the shape of a status badge, use radius.badge (rectangle). Don't use a pill. Clear shapes with a word inside. [Shape →](foundations/shape)

*Theme picks it sets (4)*

- radius.control: radius.6: Clear, slightly rounded controls. [Shape →](foundations/shape)
- radius.badge: radius.4: Clear, slightly rounded controls. [Shape →](foundations/shape)
- radius.option: radius.4: the panel's 8px corner less its 4px padding, so an option's corner nests inside the menu's. [Shape →](foundations/shape)
- radius.container: radius.8: Clear, slightly rounded controls. [Shape →](foundations/shape)

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

One brand, one set of corners.

**Because of**

- How many brands or products share the system? → One

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)

#### What should control corners say? {#shape-values}

:label[Slightly rounded]{tone="info"}

**Why**

Clear, slightly rounded controls.

**Because of**

- What should the brand feel like? → Calm and clear

**What it decided (4)**

*Rules it sets (1)*

- For the corners of buttons and inputs, use radius.control. Don't use a pill. Clear rectangles read as fields and buttons. [Shape →](foundations/shape)

*Theme picks it sets (3)*

- radius.control: radius.6: Clear, slightly rounded controls. [Shape →](foundations/shape)
- radius.badge: radius.4: Clear, slightly rounded controls. [Shape →](foundations/shape)
- radius.container: radius.8: Clear, slightly rounded controls. [Shape →](foundations/shape)

#### Where does shape show most? {#shape-lands}

:label[Controls and cards]{tone="info"}

**Why**

Corners show on controls and step cards.

**Because of**

- What is the main content? → Forms and tasks

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)
:::

:::fold{id="elevation" title="Elevation" note="5 answers, 32 decisions, and the values of its tokens"}
#### What rises above the page? {#elevation-roles}

:label[Nothing]{tone="info"}

**Why**

Flat is easier to read at high zoom.

**Because of**

- What accessibility level do we commit to? → AAA

**What it decided (12)**

*Answers it led to (3)*

- Elevation · How many shadow levels exist? → None [Elevation →](foundations/elevation)
- Elevation · How soft are shadows? → No shadows [Elevation →](foundations/elevation)
- Elevation · Where does elevation show? → Dialogs only [Elevation →](foundations/elevation)

*Rules it sets (1)*

- For a card on the page, use a strong border, no shadow. Don't use a shadow. Shadows are hard to see; borders are not. [Elevation →](foundations/elevation)

*Theme picks it sets (8)*

- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge alone, not by its fill. [Color →](foundations/color)
- color.surface.scrim in light: black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in light: shadow.none: Flat is easier to read at high zoom. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.none: No shadows; borders do the work. [Elevation →](foundations/elevation)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge alone, not by its fill, as in light. [Color →](foundations/color)
- color.surface.scrim in dark: black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in dark: shadow.none: Flat is easier to read at high zoom. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.none: No shadows; borders do the work. [Elevation →](foundations/elevation)

#### How many shadow levels exist? {#elevation-count}

:label[None]{tone="info"}

**Why**

No shadows.

**Because of**

- Elevation · What rises above the page? → Nothing

**What it decided**

It sets the values of the elevation tokens: [Elevation →](foundations/elevation)

#### What separates groups on the page? {#elevation-definition}

:label[Lines]{tone="info"}

**Why**

Strong borders separate groups at any zoom.

**Because of**

- What accessibility level do we commit to? → AAA

**What it decided (13)**

*Rules it sets (1)*

- Between page sections, use space.gap.section. Don't use a thin line. Space is easy to see; thin lines are not. [Spacing →](foundations/spacing)

*Variants it picks (4)*

- Item's default variant isn't used. A row with no border is hard to see at high zoom; borders do the work. [Item →](components/item)
- Item's outline variant. Each saved application, with a strong border that separates it at any zoom. [Item →](components/item)
- Toggle's default variant isn't used. Every action looks like a control people can find, so the toggle keeps its border. [Toggle →](components/toggle)
- Toggle's outline variant. Every toggle, with a strong border and a word, so it reads as a control at any zoom. [Toggle →](components/toggle)

*Theme picks it sets (8)*

- color.surface.canvas in light: neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge alone, not by its fill. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.17:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge alone, not by its fill, as in light. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.16:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)

#### How soft are shadows? {#elevation-values}

:label[No shadows]{tone="info"}

**Why**

No shadows; borders do the work.

**Because of**

- Elevation · What rises above the page? → Nothing

**What it decided (6)**

*Variants it picks (2)*

- Item's default variant isn't used. A row with no border is hard to see at high zoom; borders do the work. [Item →](components/item)
- Item's outline variant. Each saved application, with a strong border that separates it at any zoom. [Item →](components/item)

*Theme picks it sets (4)*

- elevation.card in light: shadow.none: Flat is easier to read at high zoom. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.none: No shadows; borders do the work. [Elevation →](foundations/elevation)
- elevation.card in dark: shadow.none: Flat is easier to read at high zoom. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.none: No shadows; borders do the work. [Elevation →](foundations/elevation)

#### Where does elevation show? {#elevation-lands}

:label[Dialogs only]{tone="info"}

**Why**

Only dialogs separate, with a dimmed page and a border.

**Because of**

- Elevation · What rises above the page? → Nothing

**What it decided (1)**

*Rules it sets (1)*

- For a menu or dialog, use a strong border and a dimmed page. Don't use a shadow only. The dimmed page makes the dialog obvious. [Elevation →](foundations/elevation)
:::

:::fold{id="motion" title="Motion" note="5 answers, 5 decisions, and the values of its tokens"}
#### What is motion for? {#motion-roles}

:label[Feedback only]{tone="info"}

**Why**

Motion only confirms an action.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (3)**

*Answers it led to (2)*

- Motion · How many speeds exist? → One [Motion →](foundations/motion)
- Motion · Where does motion show? → State changes only [Motion →](foundations/motion)

*Rules it sets (1)*

- When someone asks for less motion, use no motion. Don't use reduced motion. A shorter motion still moves. When people ask for less motion, nothing moves. [Motion →](foundations/motion)

#### How many speeds exist? {#motion-count}

:label[One]{tone="info"}

**Why**

One speed.

**Because of**

- Motion · What is motion for? → Feedback only

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How is easing defined? {#motion-definition}

:label[Standard ease-out]{tone="info"}

**Why**

A standard ease-out is easy to follow.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How fast does feedback feel? {#motion-values}

:label[Moderate]{tone="info"}

**Why**

Moderate speed is easy to follow.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (2)**

*Rules it sets (1)*

- For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker. Moderate speed is easy to follow. [Motion →](foundations/motion)

*Variants it picks (1)*

- Button's hover state. Moderate feedback that is easy to follow. [Button →](components/button)

#### Where does motion show? {#motion-lands}

:label[State changes only]{tone="info"}

**Why**

Only state changes move.

**Because of**

- Motion · What is motion for? → Feedback only

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)
:::

:::fold{id="iconography" title="Iconography" note="5 answers, 6 decisions, and the values of its tokens"}
#### What do icons do? {#iconography-roles}

:label[Actions and status]{tone="info"}

**Why**

Icons support words; they never replace them.

**Because of**

- How do people recall the interface? → They see it fresh each time

**What it decided (4)**

*Rules it sets (1)*

- For an icon with no label, use not used: always add a word. Don't use an icon button. Icons alone are guesswork. [Iconography →](foundations/iconography)

*Variants it picks (3)*

- Button's icon size isn't used. Icons alone are guesswork: always add a word. [Button →](components/button)
- Input group's inline-end align. A unit after the value, as a word people can read, with the label still above the field. [Input group →](components/input-group)
- Toggle's outline variant. Every toggle, with a strong border and a word, so it reads as a control at any zoom. [Toggle →](components/toggle)

#### How many icon sizes exist? {#iconography-count}

:label[One]{tone="info"}

**Why**

One size, larger than the text.

**Because of**

- Iconography · How big are icons next to text? → Larger than the text

**What it decided**

It sets the values of the iconography tokens: [Iconography →](foundations/iconography)

#### What icon style? {#iconography-definition}

:label[Filled]{tone="info"}

**Why**

Filled icons stay visible at low vision.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (1)**

*Variants it picks (1)*

- Empty's icon variant. A filled icon in a tile, beside words that say what will appear here and how to start. [Empty →](components/empty)

#### How big are icons next to text? {#iconography-values}

:label[Larger than the text]{tone="info"}

**Why**

Larger icons are easier to see.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (1)**

*Answers it led to (1)*

- Iconography · How many icon sizes exist? → One [Iconography →](foundations/iconography)

#### Where do icons work hardest? {#iconography-lands}

:label[Status and messages]{tone="info"}

**Why**

Icons work hardest beside status words and errors.

**Because of**

- Accessibility · How many signals carry each meaning? → Three: color, icon and word

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

One service, one brand.

**Because of**

- How many brands or products share the system? → One

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)

#### Which modes ship? {#theming-values}

:label[Light and dark]{tone="info"}

**Why**

Light and dark ship as standard; both hold AAA text.

**Because of**

- What accessibility level do we commit to? → AAA

**What it decided (2)**

*Answers it led to (1)*

- Theming · How many themes ship? → Two [Theming →](foundations/theming)

*Rules it sets (1)*

- When someone switches to dark, use the dark semantic mode, or high contrast. Don't use one mode only. People pick the mode they can read. [Theming →](foundations/theming)

#### What changes when the theme changes? {#theming-lands}

:label[Colors only]{tone="info"}

**Why**

Only colors change.

**Because of**

- Theming · What can a theme change? → Mode only

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)
:::

:::fold{id="accessibility" title="Accessibility" note="5 answers, 111 decisions, and the values of its tokens"}
#### Which states get their own visible value? {#accessibility-roles}

:label[All, including loading]{tone="info"}

**Why**

Every state, including loading, gets its own value.

**Because of**

- What accessibility level do we commit to? → AAA

**What it decided (16)**

*Theme picks it sets (16)*

- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: every state, including loading, gets its own value. [Color →](foundations/color)
- color.action.primary.hover in light: blue.light.700: one step from the primary action (blue.light.600), so the pointer shows; its label still reads 10.5:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.74:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.800: one step from the danger action (red.light.700), so the pointer shows; its label still reads 12.7:1, above the 7:1 floor. [Color →](foundations/color)
- color.disabled.text in light: neutral.500: 7.0:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in light: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in light: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: every state, including loading, gets its own value. [Color →](foundations/color)
- color.action.primary.hover in dark: blue.dark.700: one step from the primary action (blue.dark.600), so the pointer shows; its label still reads 10.8:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 14.85:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.92:1, above the 7:1 floor. [Color →](foundations/color)
- color.disabled.text in dark: neutral.500: 6.07:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in dark: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in dark: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)

#### How many signals carry each meaning? {#accessibility-count}

:label[Three: color, icon and word]{tone="info"}

**Why**

Never color alone.

**Because of**

- What accessibility level do we commit to? → AAA

**What it decided (28)**

*Answers it led to (1)*

- Iconography · Where do icons work hardest? → Status and messages [Iconography →](foundations/iconography)

*Rules it sets (3)*

- For a selected row or item, use color.surface.selected and a check icon. Don't use color alone. Selection never relies on color alone. [Color →](foundations/color)
- For an error message, use color.status.danger, an icon and a sentence next to the field. Don't use color alone. People must know what went wrong and where. [Color →](foundations/color)
- For a status, use badge with an icon and a word. Don't use color alone. Status must survive no color and a screen reader. [Color →](foundations/color)

*Variants it picks (6)*

- Alert's destructive variant. Errors, with what went wrong, where, and exactly how to fix it, next to the field. [Alert →](components/alert)
- Badge's neutral tone. A waiting state, such as an application saved to resume later, with an icon and a word. [Badge →](components/badge)
- Badge's success tone. A finished task, with a filled icon and a word. [Badge →](components/badge)
- Badge's warning tone. A risk people can still fix before they finish, with an icon and a word. [Badge →](components/badge)
- Badge's danger tone. A failure that blocks the task, with a filled icon and a word; an alert says how to fix it. [Badge →](components/badge)
- Item's muted variant isn't used. A fill alone marks a row by color; status goes in a badge with an icon and a word. [Item →](components/item)

*Theme picks it sets (18)*

- color.text.info-on-light: teal.light.800: info text on its own tint, 12.76:1 on status.info.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: teal.light.100: info text on its own tint, 12.32:1 on status.info.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 13.1:1 on status.success.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 12.37:1 on status.warning.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 12.25:1 on status.danger.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.surface.selected in light: blue.light.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in light: teal.light.100: a quiet tint behind info; its text, 12.76:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.success.subtle in light: green.light.100: a quiet tint behind success; its text, 10.79:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in light: amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in light: red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 7:1 floor. [Color →](foundations/color)
- color.surface.selected in dark: blue.dark.100: a tint of the brand, 1.21:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in dark: teal.dark.100: a quiet tint behind info; its text, 12.32:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 13.1:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 12.37:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 12.25:1, above the 7:1 floor. [Color →](foundations/color)

#### What contrast floor do we hold? {#accessibility-definition}

:label[AAA for text]{tone="info"}

**Why**

AAA contrast for text.

**Because of**

- What accessibility level do we commit to? → AAA

**What it decided (57)**

*Rules it sets (1)*

- For a value with no token, use the closest semantic token, then ask for a new one. Don't use a raw value in the component. A raw value skips the contrast checks every token passed. [Naming →](foundations/naming)

*Theme picks it sets (56)*

- color.text.on-light: gray.light.900: the text for every light fill, 18.42:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.on-dark: gray.light.0: the text for every dark fill, 7.26:1 on action.primary, above the 7:1 floor. [Color →](foundations/color)
- color.text.info-on-light: teal.light.800: info text on its own tint, 12.76:1 on status.info.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: teal.light.100: info text on its own tint, 12.32:1 on status.info.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 13.1:1 on status.success.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 12.37:1 on status.warning.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 12.25:1 on status.danger.subtle, above the 7:1 floor. [Color →](foundations/color)
- color.surface.default in light: neutral.0: the base for content; body text reads 18.42:1 on it, above the 7:1 floor. [Color →](foundations/color)
- color.surface.inverse in light: neutral.900: the reverse of content for short messages; its text reads, 18.42:1 on surface.inverse, above the 7:1 floor. [Color →](foundations/color)
- color.text.primary in light: neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.secondary in light: neutral.700: supporting text, 12.63:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.muted in light: neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.inverse in light: text.on-dark: the text its fill's tone picks, 18.42:1 on surface.inverse, above the 7:1 floor. [Color →](foundations/color)
- color.text.on-action in light: text.on-dark: the text its fill's tone picks, 7.26:1 on action.primary, above the 7:1 floor. [Color →](foundations/color)
- color.text.link in light: blue.light.700: a link, set apart by its hue, 10.5:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.on-danger in light: text.on-dark: the text its fill's tone picks, 8.55:1 on action.danger, above the 7:1 floor. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in light: neutral.500: the edge of a control people must find, 7.0:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in light: blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in light: blue.light.600: the edge beside a selected fill, so selection is never color alone, 7.26:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in light: blue.light.600: the primary action's fill; its label reads, 7.26:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.primary.hover in light: blue.light.700: one step from the primary action (blue.light.600), so the pointer shows; its label still reads 10.5:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 18.42:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.74:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.700: the danger action's fill; its label reads, 8.55:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.800: one step from the danger action (red.light.700), so the pointer shows; its label still reads 12.7:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.info in light: teal.light.600: info reads as text and icons, 7.95:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.success in light: green.light.600: success marks icons and edges, 5.38:1 on surface.default, over 3:1; its text uses success-on-light, which reads at the floor. [Color →](foundations/color)
- color.status.warning in light: amber.light.600: warning marks icons and edges, 6.16:1 on surface.default, over 3:1; its text uses warning-on-light, which reads at the floor. [Color →](foundations/color)
- color.status.danger in light: red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.surface.default in dark: neutral.50: the base for content; body text reads 17.2:1 on it, above the 7:1 floor. [Color →](foundations/color)
- color.surface.inverse in dark: neutral.900: the reverse of content for short messages; its text reads, 17.2:1 on surface.inverse, above the 7:1 floor. [Color →](foundations/color)
- color.text.primary in dark: neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.secondary in dark: neutral.700: supporting text, 12.68:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.muted in dark: neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.inverse in dark: text.on-light: the text its fill's tone picks, 17.2:1 on surface.inverse, above the 7:1 floor. [Color →](foundations/color)
- color.text.on-action in dark: text.on-light: the text its fill's tone picks, 8.74:1 on action.primary, above the 7:1 floor. [Color →](foundations/color)
- color.text.link in dark: blue.dark.700: a link, set apart by its hue, 10.8:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.text.on-danger in dark: text.on-light: the text its fill's tone picks, 7.76:1 on action.danger, above the 7:1 floor. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in dark: neutral.500: the edge of a control people must find, 6.07:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in dark: blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in dark: blue.dark.600: the edge beside a selected fill, so selection is never color alone, 8.74:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in dark: blue.dark.600: the primary action's fill; its label reads, 8.74:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.primary.hover in dark: blue.dark.700: one step from the primary action (blue.dark.600), so the pointer shows; its label still reads 10.8:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 17.2:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 14.85:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.76:1, above the 7:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.92:1, above the 7:1 floor. [Color →](foundations/color)
- color.status.info in dark: teal.dark.600: info reads as text and icons, 10.21:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 8.33:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 10.29:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor. [Color →](foundations/color)

#### What is the smallest target? {#accessibility-values}

:label[Large]{tone="info"}

**Why**

Large targets for tremor and touch.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (10)**

*Rules it sets (2)*

- For a table row height, use size.row (large). Don't use a compact row. Large rows are easy to read and tap. [Spacing →](foundations/spacing)
- For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size. Large targets help people with motor needs. [Accessibility →](foundations/accessibility)

*Variants it picks (8)*

- Button's default size. Every button. Large targets help people with motor needs. [Button →](components/button)
- Button's compact size isn't used. Large targets help people with motor needs; nothing smaller. [Button →](components/button)
- Button's large size isn't used. The default size is already large for motor needs; a bigger one adds nothing. [Button →](components/button)
- Item's default size. Every row. Large targets help people with motor needs. [Item →](components/item)
- Item's sm size isn't used. Large targets help people with motor needs; nothing smaller. [Item →](components/item)
- Toggle's default size. Every toggle. Large targets help people with motor needs. [Toggle →](components/toggle)
- Toggle's sm size isn't used. Large targets help people with motor needs; nothing smaller. [Toggle →](components/toggle)
- Toggle's lg size isn't used. The default size is already large for motor needs; a bigger one adds nothing. [Toggle →](components/toggle)

#### Where are the floors hardest to hold? {#accessibility-lands}

:label[Forms]{tone="info"}

**Why**

Forms are where people are blocked.

**Because of**

- What is the main content? → Forms and tasks

**What it decided**

It sets the values of the accessibility tokens: [Accessibility →](foundations/accessibility)
:::

:::fold{id="naming" title="Naming" note="5 answers, 1 decision, and the values of its tokens"}
#### What gets a name? {#naming-roles}

:label[Tokens and component keys]{tone="info"}

**Why**

Components get their own keys.

**Because of**

- How fast does it change? → Rarely

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How many token tiers? {#naming-count}

:label[Three]{tone="info"}

**Why**

Primitives, semantics and component keys.

**Because of**

- How fast does it change? → Rarely

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How are decisions named? {#naming-definition}

:label[By role]{tone="info"}

**Why**

Role names survive a redesign.

**Because of**

- Who maintains the system? → A platform team

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

A component API keeps changes local.

**Because of**

- How fast does it change? → Rarely

**What it decided (1)**

*Rules it sets (1)*

- For a value with no token, use the closest semantic token, then ask for a new one. Don't use a raw value in the component. A raw value skips the contrast checks every token passed. [Naming →](foundations/naming)
:::

:::fold{id="voice" title="Voice and tone" note="5 answers, 10 decisions, and the values of its tokens"}
#### Which kinds of copy does it need? {#voice-roles}

:label[Labels, messages and help]{tone="info"}

**Why**

Hints and help text carry people through each step.

**Because of**

- What is the main content? → Forms and tasks

**What it decided (1)**

*Variants it picks (1)*

- Input group's block-end align isn't used. Hints and errors sit in the field layout, in the same place on every question. [Input group →](components/input-group)

#### How many tones does it use? {#voice-count}

:label[One]{tone="info"}

**Why**

One plain tone everywhere; no surprises.

**Because of**

- What must the interface protect? → Low effort to understand

**What it decided**

It sets the values of the voice and tone tokens: [Voice and tone →](foundations/voice)

#### How is the voice defined? {#voice-definition}

:label[Rules and a word list]{tone="info"}

**Why**

A word list of common words, with terms to avoid.

**Because of**

- Who uses it most? → Everyone, including people with disabilities

**What it decided (1)**

*Rules it sets (1)*

- For a button label, use a common verb that says what happens next. Don't use "Submit" or "Proceed". Common words are understood by the most people. [Voice →](foundations/voice)

#### How does it sound? {#voice-values}

:label[Plain and direct]{tone="info"}

**Why**

Every sentence is easy to read on the first try.

**Because of**

- Who uses it most? → Everyone, including people with disabilities
- What should the brand feel like? → Calm and clear

**What it decided (7)**

*Rules it sets (5)*

- For a button label, use a common verb that says what happens next. Don't use "Submit" or "Proceed". Common words are understood by the most people. [Voice →](foundations/voice)
- For the words of an error, use say what is wrong, where, and exactly how to fix it. Don't use "Invalid input". People must be able to fix the error without help. [Voice →](foundations/voice)
- For a success message, use confirm what happened and what comes next. Don't use a confirmation with no next step. People need to know the task is finished and what happens now. [Voice →](foundations/voice)
- For an empty state, use explain what will appear here and how to start. Don't use a blank page. A blank page leaves people unsure if something failed. [Voice →](foundations/voice)
- For a confirmation question, use say what will happen in plain words, and offer a way back. Don't use a double negative. Plain words prevent a choice people did not mean. [Voice →](foundations/voice)

*Variants it picks (2)*

- Alert's destructive variant. Errors, with what went wrong, where, and exactly how to fix it, next to the field. [Alert →](components/alert)
- Empty's icon variant. A filled icon in a tile, beside words that say what will appear here and how to start. [Empty →](components/empty)

#### Where do the words matter most? {#voice-lands}

:label[Form steps and errors]{tone="info"}

**Why**

Words decide whether a form gets finished.

**Because of**

- Which outcome matters most? → Completion without errors

**What it decided (1)**

*Rules it sets (1)*

- For the words of an error, use say what is wrong, where, and exactly how to fix it. Don't use "Invalid input". People must be able to fix the error without help. [Voice →](foundations/voice)
:::

:::fold{id="components" title="Components" note="5 answers, 2 decisions, and the values of its tokens"}
#### Which component families does it need? {#components-roles}

:label[Actions, forms, feedback, overlays, layout and navigation]{tone="info"}

**Why**

Forms, steps and feedback are all a public service needs.

**Because of**

- What is the main content? → Forms and tasks
- Who uses it most? → Everyone, including people with disabilities

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How far does the inventory reach? {#components-count}

:label[Only what today's screens use]{tone="info"}

**Why**

Only the parts in use, each tested with assistive technology.

**Because of**

- What accessibility level do we commit to? → AAA
- How fast does it change? → Rarely

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How does a component earn its place? {#components-definition}

:label[It works for everyone, with any device and assistive technology]{tone="info"}

**Why**

A component joins only when it works with any device and assistive technology.

**Because of**

- Who uses it most? → Everyone, including people with disabilities
- What accessibility level do we commit to? → AAA

**What it decided (1)**

*Rules it sets (1)*

- When no component in the inventory fits, use a native HTML element with a label and a hint. Don't use a custom widget that needs hover, drag or precise pointing. Native elements work with every assistive technology without extra work. [Components →](foundations/components)

#### When does a component get another look? {#components-values}

:label[Only when the meaning changes]{tone="info"}

**Why**

One clear way to do each thing.

**Because of**

- Who uses it most? → Everyone, including people with disabilities
- What should the brand feel like? → Calm and clear

**What it decided (1)**

*Variants it picks (1)*

- Badge's info tone isn't used. Neutral covers news with nothing to do: one clear way to do each thing. [Badge →](components/badge)

#### Where do components do the most work? {#components-lands}

:label[Forms and steps]{tone="info"}

**Why**

Components do their work in forms and steps.

**Because of**

- What is the main content? → Forms and tasks
- What is the main task? → Complete a form

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)
:::
