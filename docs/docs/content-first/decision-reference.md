---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1.5
title: "Decision reference"
description: "Content first: each question, its answer, and the design decisions it made."
hide_table_of_contents: true
---

# Decision reference

:::intro{robot="content-first" title="Take it one answer at a time"}
This page keeps every decision behind Content first in one place: 79 answers and what each one shaped. It's a reference, not a reading list. Most days you only need one answer.

**Three easy ways in**

- Take a minute with [Where it starts](#where-it-starts). It shows the few first answers the rest grow from.
- Open one section when you wonder why. For example, why Content first's spacing is spacious, or why its voice is conversational.
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

- :label[Informs and publishes]{tone="info"} What does the product do for the business?
  - :label[Occasional visitors]{tone="info"} Who uses it most?
    - :label[AA]{tone="info"} What accessibility level do we commit to?
    - :label[They see it fresh each time]{tone="info"} How do people recall the interface?
    - :label[Anywhere, on any device]{tone="info"} Where do people use it?
      - :label[Light and dark]{tone="info"} theming →
      - :label[Touch size]{tone="info"} accessibility → `size.control.default` `size.48`: 3rem
    - :label[Conversational]{tone="info"} voice and tone →
  - :label[Long-form text]{tone="info"} What is the main content?
    - :label[One idea at a time]{tone="info"} How much is on one screen?
    - :label[Read start to end]{tone="info"} What is the main task?
      - :label[Rarely]{tone="info"} How often do people repeat actions?
      - :label[Attention on the content]{tone="info"} What must the interface protect?
        - :label[Match the text]{tone="info"} iconography → `size.icon` `size.16`: 1rem
      - :label[Reading comfort]{tone="info"} Which outcome matters most?
        - :label[Large]{tone="info"} typography → `type.body.font-size` `font.size.18`: 1.125rem
        - :label[Spacious]{tone="info"} spacing → `space.gap.tight` `space.8`: 0.5rem
      - :label[Losing your place]{tone="info"} What is a costly mistake?
    - :label[One sitting]{tone="info"} How long is one visit?
  - :label[Warm]{tone="info"} What should the brand feel like?
    - :label[Present]{tone="info"} How visible is the brand in the interface?
      - :label[Only when the meaning changes]{tone="info"} components →
    - :label[A reading serif, with a sans for the interface]{tone="info"} Which typefaces carry the product, and why?, also because **Present, Long-form text**
    - :label[Balanced]{tone="info"} color → `color.neutral.0` `color.stone.dark.0`: #14110D
    - :label[Rounded]{tone="info"} shape → `radius.control` `radius.8`: 0.5rem
    - :label[Soft]{tone="info"} elevation → `elevation.card` `shadow.none`: [object Object]
    - :label[Moderate]{tone="info"} motion → `motion.duration.feedback` `duration.moderate`: 200ms
- :label[One]{tone="info"} How many brands or products share the system?
- :label[A small team]{tone="info"} Who maintains the system?
  - :label[Lowercase words in paths]{tone="info"} naming →
- :label[Rarely]{tone="info"} How fast does it change?

## Every question

All 79, by section, in the order every scheme answers them. Each answer shows why, what it came from, and every design decision it made. The menu in the sidebar opens a section; its number is how many decisions that section made.

### Reasons

:::fold{id="business" title="Business and product" note="2 answers, 6 decisions"}
#### What does the product do for the business? {#business-q1}

:label[Informs and publishes]{tone="info"}

**Why**

The product publishes articles and guides.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (3)**

*Answers it led to (3)*

- Who uses it most? → Occasional visitors
- What is the main content? → Long-form text
- What should the brand feel like? → Warm

#### How many brands or products share the system? {#business-q2}

:label[One]{tone="info"}

**Why**

One publication, one brand.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (3)**

*Answers it led to (3)*

- Shape · How are corners set? → Fixed for the product [Shape →](foundations/shape)
- Theming · What can a theme change? → Mode only [Theming →](foundations/theming)
- Theming · How are brands handled? → One brand [Theming →](foundations/theming)
:::

:::fold{id="people" title="People and work context" note="2 answers, 17 decisions"}
#### Who uses it most? {#people-q1}

:label[Occasional visitors]{tone="info"}

**Why**

Most readers arrive from search and visit now and then.

**Because of**

- What does the product do for the business? → Informs and publishes

**What it decided (9)**

*Answers it led to (7)*

- What accessibility level do we commit to? → AA
- How do people recall the interface? → They see it fresh each time
- Where do people use it? → Anywhere, on any device
- Motion · What is motion for? → Feedback and guidance [Motion →](foundations/motion)
- Iconography · What do icons do? → Actions, status and navigation [Iconography →](foundations/iconography)
- Iconography · Where do icons work hardest? → Navigation [Iconography →](foundations/iconography)
- Voice and tone · How does it sound? → Conversational [Voice and tone →](foundations/voice)

*Rules it sets (2)*

- For an empty state, use an invitation, not a dead end. Don't use "No items". An empty list is a chance to show what the product offers. [Voice →](foundations/voice)
- For a first visit, use one sentence on what is here and why it is worth reading. Don't use a sign-up wall. Occasional readers decide in seconds whether to stay. [Voice →](foundations/voice)

#### What accessibility level do we commit to? {#people-q2}

:label[AA]{tone="info"}

**Why**

AA is the commitment for a public site.

**Because of**

- Who uses it most? → Occasional visitors

**What it decided (8)**

*Answers it led to (3)*

- Typography · How are sizes and line heights defined? → A ratio, line heights in proportion [Typography →](foundations/typography)
- Accessibility · How many signals carry each meaning? → Two: color and word [Accessibility →](foundations/accessibility)
- Accessibility · What contrast floor do we hold? → AA [Accessibility →](foundations/accessibility)

*Rules it sets (2)*

- For a field label or column header, use type.label. Don't use type.caption. Caption is too faint for a label people must read. [Typography →](foundations/typography)
- For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline. Keyboard users must always see where they are. [Accessibility →](foundations/accessibility)

*Variants it picks (3)*

- Button's focus state. Always visible. [Button →](components/button)
- Button's disabled state isn't used. Keep it enabled and explain on press: visitors see the interface fresh each time. [Button →](components/button)
- Field's vertical orientation. Newsletter and search forms: the label above. [Field →](components/field)
:::

:::fold{id="content" title="Content and data" note="2 answers, 18 decisions"}
#### What is the main content? {#content-q1}

:label[Long-form text]{tone="info"}

**Why**

The content is long-form text.

**Because of**

- What does the product do for the business? → Informs and publishes

**What it decided (17)**

*Answers it led to (16)*

- How much is on one screen? → One idea at a time
- What is the main task? → Read start to end
- Which typefaces carry the product, and why? → A reading serif, with a sans for the interface
- How long is one visit? → One sitting
- Typography · Which text roles does it need? → Core and editorial display [Typography →](foundations/typography)
- Typography · How many steps does the type scale take? → Fine steps, so pages can set their own rhythm [Typography →](foundations/typography)
- Typography · Where does type do the most work? → Articles and long text [Typography →](foundations/typography)
- Spacing · Which spacing roles does it need? → Gaps and insets [Spacing →](foundations/spacing)
- Spacing · Where does spacing matter most? → Between paragraphs [Spacing →](foundations/spacing)
- Shape · Where does shape show most? → Controls and cards [Shape →](foundations/shape)
- Accessibility · Where are the floors hardest to hold? → Long text [Accessibility →](foundations/accessibility)
- Voice and tone · Which kinds of copy does it need? → Labels, messages and articles [Voice and tone →](foundations/voice)
- Voice and tone · How is the voice defined? → Principles and examples [Voice and tone →](foundations/voice)
- Voice and tone · Where do the words matter most? → Articles and guides [Voice and tone →](foundations/voice)
- Components · Which component families does it need? → Core, plus content and media [Components →](foundations/components)
- Components · Where do components do the most work? → Articles [Components →](foundations/components)

*Variants it picks (1)*

- Alert's default variant. A note or a warning inside an article. [Alert →](components/alert)

#### How much is on one screen? {#content-q2}

:label[One idea at a time]{tone="info"}

**Why**

One idea per screen keeps reading calm.

**Because of**

- What is the main content? → Long-form text

**What it decided (1)**

*Answers it led to (1)*

- Spacing · How many densities exist? → One [Spacing →](foundations/spacing)
:::

:::fold{id="tasks" title="Tasks and flows" note="2 answers, 20 decisions"}
#### What is the main task? {#tasks-q1}

:label[Read start to end]{tone="info"}

**Why**

People read from start to end.

**Because of**

- What is the main content? → Long-form text

**What it decided (12)**

*Answers it led to (8)*

- How often do people repeat actions? → Rarely
- What must the interface protect? → Attention on the content
- Which outcome matters most? → Reading comfort
- What is a costly mistake? → Losing your place
- Typography · How are sizes and line heights defined? → A ratio, line heights in proportion [Typography →](foundations/typography)
- Color · Where does color carry meaning first? → Links and actions [Color →](foundations/color)
- Components · Which component families does it need? → Core, plus content and media [Components →](foundations/components)
- Components · How does a component earn its place? → A use scenario needs it [Components →](foundations/components)

*Rules it sets (3)*

- For a number in a table, use type.body. Don't use a mono font. Tables are rare and read row by row, so digits never need to line up in columns. A mono font would break the reading voice. [Typography →](foundations/typography)
- For a table row height, use size.row (comfortable). Don't use a compact row. Rows are read, not scanned. [Spacing →](foundations/spacing)
- When no component in the inventory fits, use plain text, a link or a heading. Don't use a new component for one article. Readers come for the words; extra parts pull the eye away from them. [Components →](foundations/components)

*Variants it picks (1)*

- Item's sm size isn't used. Many readers are on phones, and rows are read, not scanned. [Item →](components/item)

#### How often do people repeat actions? {#tasks-q2}

:label[Rarely]{tone="info"}

**Why**

Actions are rare: subscribe, share, save.

**Because of**

- What is the main task? → Read start to end

**What it decided (8)**

*Answers it led to (2)*

- Color · How many emphasis levels do actions need? → Three [Color →](foundations/color)
- Components · How far does the inventory reach? → Only what today's screens use [Components →](foundations/components)

*Rules it sets (1)*

- For the action that completes the task, use button primary, one per section. Don't use two primaries side by side. One clear action per section. Two primaries make the reader choose before they have read. [Color →](foundations/color)

*Variants it picks (5)*

- Button's primary variant. One clear action per section. [Button →](components/button)
- Button's large size isn't used. Attention belongs to the text: one clear action per section, at the normal size. [Button →](components/button)
- Field's horizontal orientation isn't used. Forms are rare and short; stacking keeps the reading column. [Field →](components/field)
- Input group's block-start align isn't used. Search is one line, and forms are rare and short. [Input group →](components/input-group)
- Input group's block-end align isn't used. Search is one line, and forms are rare and short. [Input group →](components/input-group)
:::

:::fold{id="human" title="Human factors" note="2 answers, 18 decisions"}
#### What must the interface protect? {#human-q1}

:label[Attention on the content]{tone="info"}

**Why**

Attention belongs to the text.

**Because of**

- What is the main task? → Read start to end

**What it decided (9)**

*Answers it led to (5)*

- Color · Which color roles does it need? → Surface, text, action and status [Color →](foundations/color)
- Elevation · What rises above the page? → Only what floats [Elevation →](foundations/elevation)
- Iconography · What icon style? → Outline [Iconography →](foundations/iconography)
- Iconography · How big are icons next to text? → Match the text [Iconography →](foundations/iconography)
- Voice and tone · How many tones does it use? → One per moment [Voice and tone →](foundations/voice)

*Variants it picks (4)*

- Button's large size isn't used. Attention belongs to the text: one clear action per section, at the normal size. [Button →](components/button)
- Field's horizontal orientation isn't used. Forms are rare and short; stacking keeps the reading column. [Field →](components/field)
- Empty's default variant isn't used. Attention belongs to the text: the invitation is in words, not a picture. [Empty →](components/empty)
- Item's muted variant isn't used. Every row in the reading list weighs the same; attention belongs to the text. [Item →](components/item)

#### How do people recall the interface? {#human-q2}

:label[They see it fresh each time]{tone="info"}

**Why**

Visitors see the interface fresh each time.

**Because of**

- Who uses it most? → Occasional visitors

**What it decided (9)**

*Rules it sets (4)*

- For a selected row or item, use color.surface.selected. Don't use bold text only. A tint shows the choice clearly on warm paper. [Color →](foundations/color)
- For a link, use color.text.link, underlined. Don't use color without underline. Readers expect links to be underlined inside text. [Color →](foundations/color)
- For an icon with no label, use not used: always add a word. Don't use an icon button. Occasional visitors do not know icons. [Iconography →](foundations/iconography)
- For an action on one row or item, use button ghost with a word. Don't use an icon on its own. Occasional visitors need the word. [Iconography →](foundations/iconography)

*Variants it picks (5)*

- Button's ghost variant. Alternatives as a text link, and row actions with a word. [Button →](components/button)
- Button's icon size isn't used. Occasional visitors do not know icons: always add a word. [Button →](components/button)
- Button's disabled state isn't used. Keep it enabled and explain on press: visitors see the interface fresh each time. [Button →](components/button)
- Input group's inline-start align. The search icon before the text, with the visible label above the field. [Input group →](components/input-group)
- Input group's inline-end align. The clear button after the text, with a word: occasional visitors do not know icons. [Input group →](components/input-group)
:::

:::fold{id="outcomes" title="Outcomes" note="2 answers, 10 decisions"}
#### Which outcome matters most? {#outcomes-q1}

:label[Reading comfort]{tone="info"}

**Why**

Comfortable reading is the measure.

**Because of**

- What is the main task? → Read start to end

**What it decided (7)**

*Answers it led to (5)*

- Typography · How large is body text? → Large [Typography →](foundations/typography)
- Spacing · How are spacing steps defined? → Big, even steps [Spacing →](foundations/spacing)
- Spacing · How dense is the layout? → Spacious [Spacing →](foundations/spacing)
- Elevation · What separates groups on the page? → Space [Elevation →](foundations/elevation)
- Components · When does a component get another look? → Only when the meaning changes [Components →](foundations/components)

*Rules it sets (2)*

- For a paragraph or help text, use type.body, at most 65 characters a line. Don't use type.caption. A large size and short lines make long text easy on the eyes. [Typography →](foundations/typography)
- When no component in the inventory fits, use plain text, a link or a heading. Don't use a new component for one article. Readers come for the words; extra parts pull the eye away from them. [Components →](foundations/components)

#### What is a costly mistake? {#outcomes-q2}

:label[Losing your place]{tone="info"}

**Why**

Losing your place in an article breaks the read.

**Because of**

- What is the main task? → Read start to end

**What it decided (3)**

*Rules it sets (1)*

- For a delete or remove, use button secondary with the full verb, then confirm with Button danger. Don't use button primary. Naming the verb and confirming prevents a mistake. [Color →](foundations/color)

*Variants it picks (2)*

- Button's secondary variant. The first step of a delete, with the full verb, before the confirm. [Button →](components/button)
- Button's danger variant. The confirm of a delete, with the full verb. Deleting a draft is rare and final. [Button →](components/button)
:::

:::fold{id="brand" title="Brand" note="3 answers, 22 decisions"}
#### What should the brand feel like? {#brand-q1}

:label[Warm]{tone="info"}

**Why**

Warm and considered, like a good magazine.

**Because of**

- What does the product do for the business? → Informs and publishes

**What it decided (12)**

*Answers it led to (10)*

- How visible is the brand in the interface? → Present
- Which typefaces carry the product, and why? → A reading serif, with a sans for the interface
- Color · How is the palette defined? → Neutrals and one brand ramp [Color →](foundations/color)
- Color · How saturated is the palette? → Balanced [Color →](foundations/color)
- Shape · Which shape roles does it need? → Controls, badges and containers [Shape →](foundations/shape)
- Shape · What should control corners say? → Rounded [Shape →](foundations/shape)
- Elevation · How soft are shadows? → Soft [Elevation →](foundations/elevation)
- Motion · How is easing defined? → Standard ease-out [Motion →](foundations/motion)
- Motion · How fast does feedback feel? → Moderate [Motion →](foundations/motion)
- Voice and tone · How does it sound? → Conversational [Voice and tone →](foundations/voice)

*Rules it sets (1)*

- For an alternative or cancel, use button ghost as a text link. Don't use a second boxed button. A link feels lighter and does not compete. [Color →](foundations/color)

*Variants it picks (1)*

- Button's ghost variant. Alternatives as a text link, and row actions with a word. [Button →](components/button)

#### How visible is the brand in the interface? {#brand-q2}

:label[Present]{tone="info"}

**Why**

The brand shows in type, not in color.

**Because of**

- What should the brand feel like? → Warm

**What it decided (3)**

*Answers it led to (2)*

- Which typefaces carry the product, and why? → A reading serif, with a sans for the interface
- Components · When does a component get another look? → Only when the meaning changes [Components →](foundations/components)

*Variants it picks (1)*

- Empty's default variant isn't used. Attention belongs to the text: the invitation is in words, not a picture. [Empty →](components/empty)

#### Which typefaces carry the product, and why? {#brand-q3}

:label[A reading serif, with a sans for the interface]{tone="info"}

**Why**

Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface.

**What it weighs (11)**

*Reading*

- **Readability.** Source Serif 4 is a reading serif made for long text; its optical sizes keep body text open and even.
- **Legibility.** Labels and captions sit in Inter, a sans with a tall x-height that stays clear at small sizes.

*Range*

- **Scalability.** Source Serif 4's optical sizes adjust the design from caption to display, so one family spans the scale.
- **Numerals.** Data is rare here; numbers sit in the reading serif, set in running text rather than tables.
- **Scripts and languages.** Both cover Latin, Cyrillic and Greek; Hebrew and Arabic need another face, chosen to match.

*Brand*

- **Recognition.** The brand shows in type, not in color, so the serif is the brand.
- **Familiarity.** Serif text reads like a book or an article, which long-form readers know.
- **Personality.** Warm and considered, as the brand answer asks.

*Delivery*

- **Performance.** Two variable families, one file each.
- **Licensing.** SIL Open Font License, both: free to embed in apps and on the web.
- **Fallback and pairing.** Falls back to Georgia and system-ui, as its tokens say; Inter is the serif's interface pair.

**Because of**

- What should the brand feel like? → Warm
- How visible is the brand in the interface? → Present
- What is the main content? → Long-form text

**What it decided (7)**

*Theme picks it sets (7)*

- type.display.font-family: source-serif-4 for display text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface. [Typography →](foundations/typography)
- type.title.font-family: source-serif-4 for title text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface. [Typography →](foundations/typography)
- type.heading.font-family: source-serif-4 for heading text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface. [Typography →](foundations/typography)
- type.body.font-family: source-serif-4 for body text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface. [Typography →](foundations/typography)
- type.label.font-family: inter for label text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface. [Typography →](foundations/typography)
- type.caption.font-family: inter for caption text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface. [Typography →](foundations/typography)
- type.data.font-family: source-serif-4 for data text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface. [Typography →](foundations/typography)
:::

:::fold{id="scenarios" title="Use scenarios" note="2 answers, 5 decisions"}
#### Where do people use it? {#scenarios-q1}

:label[Anywhere, on any device]{tone="info"}

**Why**

Readers arrive on phones and laptops alike.

**Because of**

- Who uses it most? → Occasional visitors

**What it decided (3)**

*Answers it led to (2)*

- Theming · Which modes ship? → Light and dark [Theming →](foundations/theming)
- Accessibility · What is the smallest target? → Touch size [Accessibility →](foundations/accessibility)

*Variants it picks (1)*

- Field's responsive orientation isn't used. One stacked layout reads the same on phones and laptops. [Field →](components/field)

#### How long is one visit? {#scenarios-q2}

:label[One sitting]{tone="info"}

**Why**

A guide is read in one sitting.

**Because of**

- What is the main content? → Long-form text

**What it decided (2)**

*Answers it led to (1)*

- Components · How does a component earn its place? → A use scenario needs it [Components →](foundations/components)

*Rules it sets (1)*

- For a first visit, use one sentence on what is here and why it is worth reading. Don't use a sign-up wall. Occasional readers decide in seconds whether to stay. [Voice →](foundations/voice)
:::

:::fold{id="team" title="Team and delivery" note="2 answers, 7 decisions"}
#### Who maintains the system? {#team-q1}

:label[A small team]{tone="info"}

**Why**

A small editorial team.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (4)**

*Answers it led to (4)*

- Naming · How are decisions named? → By role [Naming →](foundations/naming)
- Naming · How are names written? → Lowercase words in paths [Naming →](foundations/naming)
- Voice and tone · How is the voice defined? → Principles and examples [Voice and tone →](foundations/voice)
- Components · How far does the inventory reach? → Only what today's screens use [Components →](foundations/components)

#### How fast does it change? {#team-q2}

:label[Rarely]{tone="info"}

**Why**

The design changes rarely.

**Because of**

Nothing before it. It's one of the first answers.

**What it decided (3)**

*Answers it led to (3)*

- Naming · What gets a name? → Tokens and component keys [Naming →](foundations/naming)
- Naming · How many token tiers? → Three [Naming →](foundations/naming)
- Naming · What do components read? → Component keys [Naming →](foundations/naming)
:::

### Scopes

:::fold{id="typography" title="Typography" note="5 answers, 1 decision, and the values of its tokens"}
#### Which text roles does it need? {#typography-roles}

:label[Core and editorial display]{tone="info"}

**Why**

A lead and a display role open articles.

**Because of**

- What is the main content? → Long-form text

**What it decided (1)**

*Rules it sets (1)*

- For a page title, use type.title. Don't use type.display (landing only). Display is kept for the landing moment; article titles stay calm. [Typography →](foundations/typography)

#### How many steps does the type scale take? {#typography-count}

:label[Fine steps, so pages can set their own rhythm]{tone="info"}

**Why**

Long pages need a clear hierarchy of headings, with fine steps between them.

**Because of**

- What is the main content? → Long-form text

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How are sizes and line heights defined? {#typography-definition}

:label[A ratio, line heights in proportion]{tone="info"}

**Why**

Line height is a ratio, so it grows with the text.

**Because of**

- What is the main task? → Read start to end
- What accessibility level do we commit to? → AA

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### How large is body text? {#typography-values}

:label[Large]{tone="info"}

**Why**

Large body text is easy on the eyes.

**Because of**

- Which outcome matters most? → Reading comfort

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)

#### Where does type do the most work? {#typography-lands}

:label[Articles and long text]{tone="info"}

**Why**

Type does its work in articles.

**Because of**

- What is the main content? → Long-form text

**What it decided**

It sets the values of the typography tokens: [Typography →](foundations/typography)
:::

:::fold{id="color" title="Color" note="5 answers, 88 decisions, and the values of its tokens"}
#### Which color roles does it need? {#color-roles}

:label[Surface, text, action and status]{tone="info"}

**Why**

Reading needs few color roles.

**Because of**

- What must the interface protect? → Attention on the content

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### How many emphasis levels do actions need? {#color-count}

:label[Three]{tone="info"}

**Why**

Primary, secondary and a text link.

**Because of**

- How often do people repeat actions? → Rarely

**What it decided (26)**

*Theme picks it sets (26)*

- color.action.primary in light: navy.light.600: the primary action's fill; its label reads, 11.5:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 17.12:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.600: the danger action's fill; its label reads, 5.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in light: navy.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 11.5:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in light: navy.light.100: a tag's tint; text on it reads, 13.98:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.2 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in light: blue.light.100: a tag's tint; text on it reads, 13.3:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.3 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in light: green.light.100: a tag's tint; text on it reads, 14.99:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.4 in light: amber.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in light: amber.light.100: a tag's tint; text on it reads, 14.4:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.5 in light: neutral.500: a series color: a distinct hue with no meaning, for tags and chart marks, 4.86:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in light: neutral.100: a tag's tint; text on it reads, 15.33:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary in dark: navy.dark.600: the primary action's fill; its label reads, 6.86:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 16.84:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.21:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in dark: navy.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.86:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.1.subtle in dark: navy.dark.100: a tag's tint; text on it reads, 14.05:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.2 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.12:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2.subtle in dark: blue.dark.100: a tag's tint; text on it reads, 13.68:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.3 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.74:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3.subtle in dark: green.dark.100: a tag's tint; text on it reads, 13.52:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.4 in dark: amber.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 9.57:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4.subtle in dark: amber.dark.100: a tag's tint; text on it reads, 13.21:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.5 in dark: neutral.700: a series color: a distinct hue with no meaning, for tags and chart marks, 12.68:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5.subtle in dark: neutral.100: a tag's tint; text on it reads, 14.03:1, above the 4.5:1 floor. [Color →](foundations/color)

#### How is the palette defined? {#color-definition}

:label[Neutrals and one brand ramp]{tone="info"}

**Why**

Warm paper neutrals and one ink ramp.

**Because of**

- What should the brand feel like? → Warm

**What it decided (36)**

*Theme picks it sets (36)*

- color.neutral.0 in light: stone.light.0: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.50 in light: stone.light.50: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.100 in light: stone.light.100: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.200 in light: stone.light.200: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.300 in light: stone.light.300: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.400 in light: stone.light.400: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.500 in light: stone.light.500: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.600 in light: stone.light.600: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.700 in light: stone.light.700: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.800 in light: stone.light.800: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.900 in light: stone.light.900: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.950 in light: stone.light.950: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.surface.canvas in light: neutral.50, under content: 1.02:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.12:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed gets its own value for touch. [Color →](foundations/color)
- color.surface.selected in light: navy.light.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in light: navy.light.600: the focus ring, so the keyboard's place is never lost, 11.5:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.neutral.0 in dark: stone.dark.0: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.50 in dark: stone.dark.50: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.100 in dark: stone.dark.100: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.200 in dark: stone.dark.200: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.300 in dark: stone.dark.300: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.400 in dark: stone.dark.400: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.500 in dark: stone.dark.500: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.600 in dark: stone.dark.600: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.700 in dark: stone.dark.700: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.800 in dark: stone.dark.800: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.900 in dark: stone.dark.900: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.neutral.950 in dark: stone.dark.950: the scheme's neutral is stone. Warm paper neutrals and one ink ramp. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.2:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed gets its own value for touch. [Color →](foundations/color)
- color.surface.selected in dark: navy.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.border.focus in dark: navy.dark.600: the focus ring, so the keyboard's place is never lost, 6.86:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)

#### How saturated is the palette? {#color-values}

:label[Balanced]{tone="info"}

**Why**

A calm, balanced palette.

**Because of**

- What should the brand feel like? → Warm

**What it decided**

It sets the values of the color tokens: [Color →](foundations/color)

#### Where does color carry meaning first? {#color-lands}

:label[Links and actions]{tone="info"}

**Why**

Color marks links inside the text.

**Because of**

- What is the main task? → Read start to end

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
- color.category.1 in light: navy.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 11.5:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in light: blue.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 10.11:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in light: green.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 5.38:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in light: amber.light.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in light: neutral.500: a series color: a distinct hue with no meaning, for tags and chart marks, 4.86:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.status.info in dark: blue.dark.600: info reads as text and icons, 8.12:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info.subtle in dark: blue.dark.100: a quiet tint behind info; its text, 10.8:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 7.74:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 12.03:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 9.57:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 11.29:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 11.21:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.category.1 in dark: navy.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 6.86:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.2 in dark: blue.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 8.12:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.3 in dark: green.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 7.74:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.4 in dark: amber.dark.600: a series color: a distinct hue with no meaning, for tags and chart marks, 9.57:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.category.5 in dark: neutral.700: a series color: a distinct hue with no meaning, for tags and chart marks, 12.68:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
:::

:::fold{id="spacing" title="Spacing" note="5 answers, 3 decisions, and the values of its tokens"}
#### Which spacing roles does it need? {#spacing-roles}

:label[Gaps and insets]{tone="info"}

**Why**

No dense tables, so no row role.

**Because of**

- What is the main content? → Long-form text

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How many densities exist? {#spacing-count}

:label[One]{tone="info"}

**Why**

One calm density.

**Because of**

- How much is on one screen? → One idea at a time

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How are spacing steps defined? {#spacing-definition}

:label[Big, even steps]{tone="info"}

**Why**

Big, even steps suit long reading.

**Because of**

- Which outcome matters most? → Reading comfort

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)

#### How dense is the layout? {#spacing-values}

:label[Spacious]{tone="info"}

**Why**

Room around the text helps reading.

**Because of**

- Which outcome matters most? → Reading comfort

**What it decided (3)**

*Rules it sets (1)*

- For items that belong together, use space.gap.default. Don't use space.gap.tight. Text needs air even inside a group. [Spacing →](foundations/spacing)

*Variants it picks (1)*

- Item's default variant. Rows in the reading list, separated by space, not lines. [Item →](components/item)

*Theme picks it sets (1)*

- radius.option: radius.8: the panel's 12px corner less its 4px padding, so an option's corner nests inside the menu's. [Shape →](foundations/shape)

#### Where does spacing matter most? {#spacing-lands}

:label[Between paragraphs]{tone="info"}

**Why**

Space is spent between paragraphs and sections.

**Because of**

- What is the main content? → Long-form text

**What it decided**

It sets the values of the spacing tokens: [Spacing →](foundations/spacing)
:::

:::fold{id="shape" title="Shape" note="5 answers, 10 decisions, and the values of its tokens"}
#### Which shape roles does it need? {#shape-roles}

:label[Controls, badges and containers]{tone="info"}

**Why**

Pill badges differ from controls.

**Because of**

- What should the brand feel like? → Warm

**What it decided (6)**

*Answers it led to (1)*

- Shape · How many corner sizes exist? → Three [Shape →](foundations/shape)

*Rules it sets (1)*

- For the shape of a status badge, use radius.badge (pill). Don't use a rectangle. Pills sit softly next to text. [Shape →](foundations/shape)

*Theme picks it sets (4)*

- radius.control: radius.8: Rounded corners feel friendly. [Shape →](foundations/shape)
- radius.badge: radius.999: Rounded corners feel friendly. [Shape →](foundations/shape)
- radius.option: radius.8: the panel's 12px corner less its 4px padding, so an option's corner nests inside the menu's. [Shape →](foundations/shape)
- radius.container: radius.12: Rounded corners feel friendly. [Shape →](foundations/shape)

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

:label[Rounded]{tone="info"}

**Why**

Rounded corners feel friendly.

**Because of**

- What should the brand feel like? → Warm

**What it decided (4)**

*Rules it sets (1)*

- For the corners of buttons and inputs, use radius.control (rounded). Don't use sharp corners. Rounded corners match the warm reading tone. Sharp corners feel technical next to long text. [Shape →](foundations/shape)

*Theme picks it sets (3)*

- radius.control: radius.8: Rounded corners feel friendly. [Shape →](foundations/shape)
- radius.badge: radius.999: Rounded corners feel friendly. [Shape →](foundations/shape)
- radius.container: radius.12: Rounded corners feel friendly. [Shape →](foundations/shape)

#### Where does shape show most? {#shape-lands}

:label[Controls and cards]{tone="info"}

**Why**

Corners show on buttons and article cards.

**Because of**

- What is the main content? → Long-form text

**What it decided**

It sets the values of the shape tokens: [Shape →](foundations/shape)
:::

:::fold{id="elevation" title="Elevation" note="5 answers, 27 decisions, and the values of its tokens"}
#### What rises above the page? {#elevation-roles}

:label[Only what floats]{tone="info"}

**Why**

Only menus and dialogs float.

**Because of**

- What must the interface protect? → Attention on the content

**What it decided (11)**

*Answers it led to (2)*

- Elevation · How many shadow levels exist? → One [Elevation →](foundations/elevation)
- Elevation · Where does elevation show? → Menus and dialogs [Elevation →](foundations/elevation)

*Rules it sets (1)*

- For a card on the page, use a border, no shadow. Don't use a strong shadow. Cards stay flat on the page; shadows are for floating things. [Elevation →](foundations/elevation)

*Theme picks it sets (8)*

- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill. [Color →](foundations/color)
- color.surface.scrim in light: black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in light: shadow.none: Only menus and dialogs float. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.overlay: Soft shadows suit warm paper. [Elevation →](foundations/elevation)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light. [Color →](foundations/color)
- color.surface.scrim in dark: black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on. [Color →](foundations/color)
- elevation.card in dark: shadow.none: Only menus and dialogs float. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.overlay-dark: Soft shadows suit warm paper. [Elevation →](foundations/elevation)

#### How many shadow levels exist? {#elevation-count}

:label[One]{tone="info"}

**Why**

One shadow for floating things.

**Because of**

- Elevation · What rises above the page? → Only what floats

**What it decided**

It sets the values of the elevation tokens: [Elevation →](foundations/elevation)

#### What separates groups on the page? {#elevation-definition}

:label[Space]{tone="info"}

**Why**

Space separates groups; lines would interrupt reading.

**Because of**

- Which outcome matters most? → Reading comfort

**What it decided (11)**

*Rules it sets (1)*

- Between page sections, use space.gap.section, no line. Don't use a divider line. Space alone separates sections; lines add noise. [Spacing →](foundations/spacing)

*Variants it picks (2)*

- Item's default variant. Rows in the reading list, separated by space, not lines. [Item →](components/item)
- Item's outline variant isn't used. Borders would interrupt reading; space separates the rows. [Item →](components/item)

*Theme picks it sets (8)*

- color.surface.canvas in light: neutral.50, under content: 1.02:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in light: neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill. [Color →](foundations/color)
- color.surface.sunken in light: neutral.100, a step below content (1.12:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.surface.canvas in dark: neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward. [Color →](foundations/color)
- color.surface.raised in dark: neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light. [Color →](foundations/color)
- color.surface.sunken in dark: neutral.100, a step below content (1.2:1 on surface.default), so table headers and wells read as recessed. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)

#### How soft are shadows? {#elevation-values}

:label[Soft]{tone="info"}

**Why**

Soft shadows suit warm paper.

**Because of**

- What should the brand feel like? → Warm

**What it decided (4)**

*Theme picks it sets (4)*

- elevation.card in light: shadow.none: Only menus and dialogs float. [Elevation →](foundations/elevation)
- elevation.overlay in light: shadow.overlay: Soft shadows suit warm paper. [Elevation →](foundations/elevation)
- elevation.card in dark: shadow.none: Only menus and dialogs float. [Elevation →](foundations/elevation)
- elevation.overlay in dark: shadow.overlay-dark: Soft shadows suit warm paper. [Elevation →](foundations/elevation)

#### Where does elevation show? {#elevation-lands}

:label[Menus and dialogs]{tone="info"}

**Why**

Menus and dialogs are the only layers.

**Because of**

- Elevation · What rises above the page? → Only what floats

**What it decided (1)**

*Rules it sets (1)*

- For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow. The dimmed page focuses the reader on the dialog. [Elevation →](foundations/elevation)
:::

:::fold{id="motion" title="Motion" note="5 answers, 5 decisions, and the values of its tokens"}
#### What is motion for? {#motion-roles}

:label[Feedback and guidance]{tone="info"}

**Why**

Motion confirms actions and guides between pages.

**Because of**

- Who uses it most? → Occasional visitors

**What it decided (3)**

*Answers it led to (2)*

- Motion · How many speeds exist? → Two [Motion →](foundations/motion)
- Motion · Where does motion show? → State changes and panels [Motion →](foundations/motion)

*Rules it sets (1)*

- When someone asks for less motion, use no motion. Don't use reduced motion. A shorter motion still moves. When people ask for less motion, nothing moves. [Motion →](foundations/motion)

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

A standard ease-out is calm.

**Because of**

- What should the brand feel like? → Warm

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)

#### How fast does feedback feel? {#motion-values}

:label[Moderate]{tone="info"}

**Why**

Moderate speed feels calm.

**Because of**

- What should the brand feel like? → Warm

**What it decided (2)**

*Rules it sets (1)*

- For hover and press feedback, use motion.duration.feedback (moderate). Don't use a fast flash. Moderate speed feels calm in a slow reading flow. A fast flash feels jumpy. [Motion →](foundations/motion)

*Variants it picks (1)*

- Button's hover state. Moderate feedback that feels calm. [Button →](components/button)

#### Where does motion show? {#motion-lands}

:label[State changes and panels]{tone="info"}

**Why**

State changes and opening panels move.

**Because of**

- Motion · What is motion for? → Feedback and guidance

**What it decided**

It sets the values of the motion tokens: [Motion →](foundations/motion)
:::

:::fold{id="iconography" title="Iconography" note="5 answers, 5 decisions, and the values of its tokens"}
#### What do icons do? {#iconography-roles}

:label[Actions, status and navigation]{tone="info"}

**Why**

Occasional readers need icons for save, share and navigation.

**Because of**

- Who uses it most? → Occasional visitors

**What it decided (3)**

*Rules it sets (1)*

- For an icon with no label, use not used: always add a word. Don't use an icon button. Occasional visitors do not know icons. [Iconography →](foundations/iconography)

*Variants it picks (2)*

- Button's icon size isn't used. Occasional visitors do not know icons: always add a word. [Button →](components/button)
- Input group's inline-start align. The search icon before the text, with the visible label above the field. [Input group →](components/input-group)

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

Outline icons stay quiet beside text.

**Because of**

- What must the interface protect? → Attention on the content

**What it decided (1)**

*Variants it picks (1)*

- Empty's icon variant. A quiet outline icon in a small tile, above a warm invitation to save an article. [Empty →](components/empty)

#### How big are icons next to text? {#iconography-values}

:label[Match the text]{tone="info"}

**Why**

Icons match the text size.

**Because of**

- What must the interface protect? → Attention on the content

**What it decided (1)**

*Answers it led to (1)*

- Iconography · How many icon sizes exist? → One [Iconography →](foundations/iconography)

#### Where do icons work hardest? {#iconography-lands}

:label[Navigation]{tone="info"}

**Why**

Icons help most in navigation.

**Because of**

- Who uses it most? → Occasional visitors

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

One publication, one brand.

**Because of**

- How many brands or products share the system? → One

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)

#### Which modes ship? {#theming-values}

:label[Light and dark]{tone="info"}

**Why**

Light and dark ship as standard; dark helps night reading.

**Because of**

- Where do people use it? → Anywhere, on any device

**What it decided (2)**

*Answers it led to (1)*

- Theming · How many themes ship? → Two [Theming →](foundations/theming)

*Rules it sets (1)*

- When someone switches to dark, use the dark semantic mode. Don't use inverting images. Only semantic colors change; the reading layout stays. [Theming →](foundations/theming)

#### What changes when the theme changes? {#theming-lands}

:label[Colors only]{tone="info"}

**Why**

Only colors change.

**Because of**

- Theming · What can a theme change? → Mode only

**What it decided**

It sets the values of the theming tokens: [Theming →](foundations/theming)
:::

:::fold{id="accessibility" title="Accessibility" note="5 answers, 104 decisions, and the values of its tokens"}
#### Which states get their own visible value? {#accessibility-roles}

:label[Those and pressed]{tone="info"}

**Why**

Pressed gets its own value for touch.

**Because of**

- Accessibility · What is the smallest target? → Touch size

**What it decided (16)**

*Theme picks it sets (16)*

- color.surface.highlight in light: neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it. [Color →](foundations/color)
- color.surface.pressed in light: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed gets its own value for touch. [Color →](foundations/color)
- color.action.primary.hover in light: navy.light.700: one step from the primary action (navy.light.600), so the pointer shows; its label still reads 14.62:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.33:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.700: one step from the danger action (red.light.600), so the pointer shows; its label still reads 8.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.disabled.text in light: neutral.500: 4.86:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in light: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in light: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.surface.highlight in dark: neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards. [Color →](foundations/color)
- color.surface.pressed in dark: neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed gets its own value for touch. [Color →](foundations/color)
- color.action.primary.hover in dark: navy.dark.700: one step from the primary action (navy.dark.600), so the pointer shows; its label still reads 8.96:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 14.03:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.22:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.disabled.text in dark: neutral.500: 10.11:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum. [Color →](foundations/color)
- color.disabled.surface in dark: neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)
- color.disabled.border in dark: neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action. [Color →](foundations/color)

#### How many signals carry each meaning? {#accessibility-count}

:label[Two: color and word]{tone="info"}

**Why**

Status is rare; color and a word are enough.

**Because of**

- What accessibility level do we commit to? → AA

**What it decided (26)**

*Rules it sets (2)*

- For an error message, use color.status.danger and a plain sentence. Don't use color alone. The sentence says what to fix; color only draws the eye. [Color →](foundations/color)
- For a status, use badge pill with a word. Don't use an icon alone. Status is rare, so readers never learn an icon for it. A word is clear the first time. [Color →](foundations/color)

*Variants it picks (6)*

- Alert's destructive variant. A failed save or sign-up: calm, take the blame, offer the way forward. [Alert →](components/alert)
- Badge's neutral tone. Saved: waiting for you; nothing is wrong. [Badge →](components/badge)
- Badge's info tone isn't used. Topics and reading states need no news tone; status is rare. [Badge →](components/badge)
- Badge's success tone. Finished: you read it to the end. [Badge →](components/badge)
- Badge's warning tone. Out of date: the facts may have changed since it was written. [Badge →](components/badge)
- Badge's danger tone isn't used. Nothing in an article fails; errors are calm sentences, not labels. [Badge →](components/badge)

*Theme picks it sets (18)*

- color.text.info-on-light: blue.light.800: info text on its own tint, 12.97:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: blue.light.100: info text on its own tint, 10.8:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 12.03:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 11.29:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 11.21:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.selected in light: navy.light.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in light: blue.light.100: a quiet tint behind info; its text, 12.97:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in light: green.light.100: a quiet tint behind success; its text, 10.79:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in light: amber.light.100: a quiet tint behind warning; its text, 11.09:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in light: red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.selected in dark: navy.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone. [Color →](foundations/color)
- color.status.info.subtle in dark: blue.dark.100: a quiet tint behind info; its text, 10.8:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success.subtle in dark: green.dark.100: a quiet tint behind success; its text, 12.03:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning.subtle in dark: amber.dark.100: a quiet tint behind warning; its text, 11.29:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger.subtle in dark: red.dark.100: a quiet tint behind danger; its text, 11.21:1, above the 4.5:1 floor. [Color →](foundations/color)

#### What contrast floor do we hold? {#accessibility-definition}

:label[AA]{tone="info"}

**Why**

AA contrast, with large text helping further.

**Because of**

- What accessibility level do we commit to? → AA

**What it decided (56)**

*Theme picks it sets (56)*

- color.text.on-light: stone.light.900: the text for every light fill, 17.12:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-dark: stone.light.0: the text for every dark fill, 11.5:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-light: blue.light.800: info text on its own tint, 12.97:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.info-on-dark: blue.light.100: info text on its own tint, 10.8:1 on status.info.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-light: green.light.800: success text on its own tint, 10.79:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.success-on-dark: green.light.100: success text on its own tint, 12.03:1 on status.success.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-light: amber.light.800: warning text on its own tint, 11.09:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.warning-on-dark: amber.light.100: warning text on its own tint, 11.29:1 on status.warning.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-light: red.light.800: danger text on its own tint, 9.9:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.danger-on-dark: red.light.100: danger text on its own tint, 11.21:1 on status.danger.subtle, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.default in light: neutral.0: the base for content; body text reads 17.12:1 on it, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.inverse in light: neutral.900: the reverse of content for short messages; its text reads, 17.12:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.primary in light: neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.secondary in light: neutral.700: supporting text, 9.75:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.muted in light: neutral.600: the quietest text that still reads, 6.9:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.inverse in light: text.on-dark: the text its fill's tone picks, 17.12:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-action in light: text.on-dark: the text its fill's tone picks, 11.5:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.link in light: navy.light.700: a link, set apart by its hue, 14.62:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-danger in light: text.on-dark: the text its fill's tone picks, 5.63:1 on action.danger, above the 4.5:1 floor. [Color →](foundations/color)
- color.border.default in light: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in light: neutral.500: the edge of a control people must find, 4.86:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in light: navy.light.600: the focus ring, so the keyboard's place is never lost, 11.5:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in light: navy.light.600: the edge beside a selected fill, so selection is never color alone, 11.5:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in light: navy.light.600: the primary action's fill; its label reads, 11.5:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary.hover in light: navy.light.700: one step from the primary action (navy.light.600), so the pointer shows; its label still reads 14.62:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in light: neutral.0: the secondary action's fill; its label reads, 17.12:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in light: neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.33:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in light: red.light.600: the danger action's fill; its label reads, 5.63:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in light: red.light.700: one step from the danger action (red.light.600), so the pointer shows; its label still reads 8.55:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info in light: blue.light.600: info reads as text and icons, 10.11:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in light: green.light.600: success reads as text and icons, 5.38:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in light: amber.light.600: warning reads as text and icons, 6.16:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in light: red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.default in dark: neutral.50: the base for content; body text reads 16.84:1 on it, above the 4.5:1 floor. [Color →](foundations/color)
- color.surface.inverse in dark: neutral.900: the reverse of content for short messages; its text reads, 16.84:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.primary in dark: neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.secondary in dark: neutral.500: supporting text, 10.11:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.muted in dark: neutral.400: the quietest text that still reads, 6.16:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.inverse in dark: text.on-light: the text its fill's tone picks, 16.84:1 on surface.inverse, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-action in dark: text.on-light: the text its fill's tone picks, 6.86:1 on action.primary, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.link in dark: navy.dark.700: a link, set apart by its hue, 8.96:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.text.on-danger in dark: text.on-light: the text its fill's tone picks, 7.21:1 on action.danger, above the 4.5:1 floor. [Color →](foundations/color)
- color.border.default in dark: neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum. [Color →](foundations/color)
- color.border.strong in dark: neutral.400: the edge of a control people must find, 6.16:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.focus in dark: navy.dark.600: the focus ring, so the keyboard's place is never lost, 6.86:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.border.selected in dark: navy.dark.600: the edge beside a selected fill, so selection is never color alone, 6.86:1 on surface.default, above the 3:1 floor. [Color →](foundations/color)
- color.action.primary in dark: navy.dark.600: the primary action's fill; its label reads, 6.86:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.primary.hover in dark: navy.dark.700: one step from the primary action (navy.dark.600), so the pointer shows; its label still reads 8.96:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary in dark: neutral.50: the secondary action's fill; its label reads, 16.84:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.secondary.hover in dark: neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 14.03:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger in dark: red.dark.600: the danger action's fill; its label reads, 7.21:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.action.danger.hover in dark: red.dark.700: one step from the danger action (red.dark.600), so the pointer shows; its label still reads 9.22:1, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.info in dark: blue.dark.600: info reads as text and icons, 8.12:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.success in dark: green.dark.600: success reads as text and icons, 7.74:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.warning in dark: amber.dark.600: warning reads as text and icons, 9.57:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)
- color.status.danger in dark: red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor. [Color →](foundations/color)

#### What is the smallest target? {#accessibility-values}

:label[Touch size]{tone="info"}

**Why**

Readers are often on phones.

**Because of**

- Where do people use it? → Anywhere, on any device

**What it decided (6)**

*Answers it led to (1)*

- Accessibility · Which states get their own visible value? → Those and pressed [Accessibility →](foundations/accessibility)

*Rules it sets (1)*

- For the smallest clickable thing, use size.control.default (touch). Don't use a compact control. Many readers are on phones. [Accessibility →](foundations/accessibility)

*Variants it picks (4)*

- Button's default size. Every button, at touch size: many readers are on phones. [Button →](components/button)
- Button's compact size isn't used. Many readers are on phones: no compact controls. [Button →](components/button)
- Item's default size. Every row, at touch size: many readers are on phones. [Item →](components/item)
- Item's sm size isn't used. Many readers are on phones, and rows are read, not scanned. [Item →](components/item)

#### Where are the floors hardest to hold? {#accessibility-lands}

:label[Long text]{tone="info"}

**Why**

Long text needs steady contrast and line length.

**Because of**

- What is the main content? → Long-form text

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

- Who maintains the system? → A small team

**What it decided**

It sets the values of the naming tokens: [Naming →](foundations/naming)

#### How are names written? {#naming-values}

:label[Lowercase words in paths]{tone="info"}

**Why**

Lowercase paths read the same everywhere.

**Because of**

- Who maintains the system? → A small team

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

- For a value with no token, use the closest semantic token, then ask for a new one. Don't use a raw value in the component. Raw values break dark mode and the next redesign. [Naming →](foundations/naming)
:::

:::fold{id="voice" title="Voice and tone" note="5 answers, 13 decisions, and the values of its tokens"}
#### Which kinds of copy does it need? {#voice-roles}

:label[Labels, messages and articles]{tone="info"}

**Why**

Articles are the product; the UI copy must match them.

**Because of**

- What is the main content? → Long-form text

**What it decided**

It sets the values of the voice and tone tokens: [Voice and tone →](foundations/voice)

#### How many tones does it use? {#voice-count}

:label[One per moment]{tone="info"}

**Why**

Warm by default, calmer for errors.

**Because of**

- What must the interface protect? → Attention on the content

**What it decided (4)**

*Rules it sets (1)*

- For the words of an error, use calm and helpful. Take the blame, offer the way forward. Don't use blaming the reader. A calm error keeps the reader's trust. [Voice →](foundations/voice)

*Variants it picks (3)*

- Alert's destructive variant. A failed save or sign-up: calm, take the blame, offer the way forward. [Alert →](components/alert)
- Toast's danger tone. Calm and helpful: take the blame, offer the way forward. [Toast →](components/toast)
- Badge's danger tone isn't used. Nothing in an article fails; errors are calm sentences, not labels. [Badge →](components/badge)

#### How is the voice defined? {#voice-definition}

:label[Principles and examples]{tone="info"}

**Why**

Editors work from principles and examples, not word lists.

**Because of**

- Who maintains the system? → A small team
- What is the main content? → Long-form text

**What it decided**

It sets the values of the voice and tone tokens: [Voice and tone →](foundations/voice)

#### How does it sound? {#voice-values}

:label[Conversational]{tone="info"}

**Why**

Talk to one reader, like a good editor.

**Because of**

- Who uses it most? → Occasional visitors
- What should the brand feel like? → Warm

**What it decided (9)**

*Rules it sets (5)*

- For a button label, use a warm verb a reader would say. Don't use "Submit" or "Click here". Buttons are part of the reading voice. [Voice →](foundations/voice)
- For the words of an error, use calm and helpful. Take the blame, offer the way forward. Don't use blaming the reader. A calm error keeps the reader's trust. [Voice →](foundations/voice)
- For a success message, use warm and brief, with what happens next. Don't use a bare "Done". A warm close invites the reader back. [Voice →](foundations/voice)
- For an empty state, use an invitation, not a dead end. Don't use "No items". An empty list is a chance to show what the product offers. [Voice →](foundations/voice)
- For a confirmation question, use gentle and clear about what changes. Don't use guilt or pressure. Readers come back when leaving felt respectful. [Voice →](foundations/voice)

*Variants it picks (4)*

- Toast's neutral tone. A calm note: You're all caught up. [Toast →](components/toast)
- Toast's success tone. Warm and brief, with what happens next. [Toast →](components/toast)
- Toast's danger tone. Calm and helpful: take the blame, offer the way forward. [Toast →](components/toast)
- Empty's icon variant. A quiet outline icon in a small tile, above a warm invitation to save an article. [Empty →](components/empty)

#### Where do the words matter most? {#voice-lands}

:label[Articles and guides]{tone="info"}

**Why**

Most words are in articles and guides.

**Because of**

- What is the main content? → Long-form text

**What it decided**

It sets the values of the voice and tone tokens: [Voice and tone →](foundations/voice)
:::

:::fold{id="components" title="Components" note="5 answers, 0 decisions, and the values of its tokens"}
#### Which component families does it need? {#components-roles}

:label[Core, plus content and media]{tone="info"}

**Why**

Readers need sections, navigation and little else.

**Because of**

- What is the main content? → Long-form text
- What is the main task? → Read start to end

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How far does the inventory reach? {#components-count}

:label[Only what today's screens use]{tone="info"}

**Why**

Actions are rare, so the components today's pages use cover them.

**Because of**

- How often do people repeat actions? → Rarely
- Who maintains the system? → A small team

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### How does a component earn its place? {#components-definition}

:label[A use scenario needs it]{tone="info"}

**Why**

A component joins only when reading needs it.

**Because of**

- How long is one visit? → One sitting
- What is the main task? → Read start to end

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### When does a component get another look? {#components-values}

:label[Only when the meaning changes]{tone="info"}

**Why**

Pages stay calm when a component changes only with its meaning.

**Because of**

- How visible is the brand in the interface? → Present
- Which outcome matters most? → Reading comfort

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)

#### Where do components do the most work? {#components-lands}

:label[Articles]{tone="info"}

**Why**

Components sit inside and around articles.

**Because of**

- What is the main content? → Long-form text

**What it decided**

It sets the values of the components tokens: [Components →](foundations/components)
:::
