---
composite_data: "./decision-reference.json"
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

::steps{id="flow"}

## Where it starts

The first answers lead to the rest. Each branch is an answer that follows from the one above it.

::decision-tree{id="start"}

## Every question

All 79, by section, in the order every scheme answers them. Each answer shows why, what it came from, and every design decision it made. The menu in the sidebar opens a section; its number is how many decisions that section made.

::::group{title="Reasons"}
:::fold{id="business" title="Business and product" note="2 answers, 7 decisions"}
#### What does the product do for the business? {#business-q1}

::decision-answer{id="business-q1"}

#### How many brands or products share the system? {#business-q2}

::decision-answer{id="business-q2"}
:::

:::fold{id="people" title="People and work context" note="2 answers, 15 decisions"}
#### Who uses it most? {#people-q1}

::decision-answer{id="people-q1"}

#### What accessibility level do we commit to? {#people-q2}

::decision-answer{id="people-q2"}
:::

:::fold{id="content" title="Content and data" note="2 answers, 46 decisions"}
#### What is the main content? {#content-q1}

::decision-answer{id="content-q1"}

#### How much is on one screen? {#content-q2}

::decision-answer{id="content-q2"}
:::

:::fold{id="tasks" title="Tasks and flows" note="2 answers, 30 decisions"}
#### What is the main task? {#tasks-q1}

::decision-answer{id="tasks-q1"}

#### How often do people repeat actions? {#tasks-q2}

::decision-answer{id="tasks-q2"}
:::

:::fold{id="human" title="Human factors" note="2 answers, 9 decisions"}
#### What must the interface protect? {#human-q1}

::decision-answer{id="human-q1"}

#### How do people recall the interface? {#human-q2}

::decision-answer{id="human-q2"}
:::

:::fold{id="outcomes" title="Outcomes" note="2 answers, 14 decisions"}
#### Which outcome matters most? {#outcomes-q1}

::decision-answer{id="outcomes-q1"}

#### What is a costly mistake? {#outcomes-q2}

::decision-answer{id="outcomes-q2"}
:::

:::fold{id="brand" title="Brand" note="3 answers, 16 decisions"}
#### What should the brand feel like? {#brand-q1}

::decision-answer{id="brand-q1"}

#### How visible is the brand in the interface? {#brand-q2}

::decision-answer{id="brand-q2"}

#### Which typefaces carry the product, and why? {#brand-q3}

::decision-answer{id="brand-q3"}
:::

:::fold{id="scenarios" title="Use scenarios" note="2 answers, 4 decisions"}
#### Where do people use it? {#scenarios-q1}

::decision-answer{id="scenarios-q1"}

#### How long is one visit? {#scenarios-q2}

::decision-answer{id="scenarios-q2"}
:::

:::fold{id="team" title="Team and delivery" note="2 answers, 8 decisions"}
#### Who maintains the system? {#team-q1}

::decision-answer{id="team-q1"}

#### How fast does it change? {#team-q2}

::decision-answer{id="team-q2"}
:::
::::

::::group{title="Scopes"}
:::fold{id="typography" title="Typography" note="5 answers, 2 decisions, and the values of its tokens"}
#### Which text roles does it need? {#typography-roles}

::decision-answer{id="typography-roles"}

#### How many steps does the type scale take? {#typography-count}

::decision-answer{id="typography-count"}

#### How are sizes and line heights defined? {#typography-definition}

::decision-answer{id="typography-definition"}

#### How large is body text? {#typography-values}

::decision-answer{id="typography-values"}

#### Where does type do the most work? {#typography-lands}

::decision-answer{id="typography-lands"}
:::

:::fold{id="color" title="Color" note="5 answers, 90 decisions, and the values of its tokens"}
#### Which color roles does it need? {#color-roles}

::decision-answer{id="color-roles"}

#### How many emphasis levels do actions need? {#color-count}

::decision-answer{id="color-count"}

#### How is the palette defined? {#color-definition}

::decision-answer{id="color-definition"}

#### How saturated is the palette? {#color-values}

::decision-answer{id="color-values"}

#### Where does color carry meaning first? {#color-lands}

::decision-answer{id="color-lands"}
:::

:::fold{id="spacing" title="Spacing" note="5 answers, 6 decisions, and the values of its tokens"}
#### Which spacing roles does it need? {#spacing-roles}

::decision-answer{id="spacing-roles"}

#### How many densities exist? {#spacing-count}

::decision-answer{id="spacing-count"}

#### How are spacing steps defined? {#spacing-definition}

::decision-answer{id="spacing-definition"}

#### How dense is the layout? {#spacing-values}

::decision-answer{id="spacing-values"}

#### Where does spacing matter most? {#spacing-lands}

::decision-answer{id="spacing-lands"}
:::

:::fold{id="shape" title="Shape" note="5 answers, 12 decisions, and the values of its tokens"}
#### Which shape roles does it need? {#shape-roles}

::decision-answer{id="shape-roles"}

#### How many corner sizes exist? {#shape-count}

::decision-answer{id="shape-count"}

#### How are corners set? {#shape-definition}

::decision-answer{id="shape-definition"}

#### What should control corners say? {#shape-values}

::decision-answer{id="shape-values"}

#### Where does shape show most? {#shape-lands}

::decision-answer{id="shape-lands"}
:::

:::fold{id="elevation" title="Elevation" note="5 answers, 27 decisions, and the values of its tokens"}
#### What rises above the page? {#elevation-roles}

::decision-answer{id="elevation-roles"}

#### How many shadow levels exist? {#elevation-count}

::decision-answer{id="elevation-count"}

#### What separates groups on the page? {#elevation-definition}

::decision-answer{id="elevation-definition"}

#### How soft are shadows? {#elevation-values}

::decision-answer{id="elevation-values"}

#### Where does elevation show? {#elevation-lands}

::decision-answer{id="elevation-lands"}
:::

:::fold{id="motion" title="Motion" note="5 answers, 5 decisions, and the values of its tokens"}
#### What is motion for? {#motion-roles}

::decision-answer{id="motion-roles"}

#### How many speeds exist? {#motion-count}

::decision-answer{id="motion-count"}

#### How is easing defined? {#motion-definition}

::decision-answer{id="motion-definition"}

#### How fast does feedback feel? {#motion-values}

::decision-answer{id="motion-values"}

#### Where does motion show? {#motion-lands}

::decision-answer{id="motion-lands"}
:::

:::fold{id="iconography" title="Iconography" note="5 answers, 11 decisions, and the values of its tokens"}
#### What do icons do? {#iconography-roles}

::decision-answer{id="iconography-roles"}

#### How many icon sizes exist? {#iconography-count}

::decision-answer{id="iconography-count"}

#### What icon style and stroke? {#iconography-definition}

::decision-answer{id="iconography-definition"}

#### How big are icons next to text? {#iconography-values}

::decision-answer{id="iconography-values"}

#### Where do icons work hardest? {#iconography-lands}

::decision-answer{id="iconography-lands"}
:::

:::fold{id="theming" title="Theming" note="5 answers, 2 decisions, and the values of its tokens"}
#### What can a theme change? {#theming-roles}

::decision-answer{id="theming-roles"}

#### How many themes ship? {#theming-count}

::decision-answer{id="theming-count"}

#### How are brands handled? {#theming-definition}

::decision-answer{id="theming-definition"}

#### Which modes ship? {#theming-values}

::decision-answer{id="theming-values"}

#### What changes when the theme changes? {#theming-lands}

::decision-answer{id="theming-lands"}
:::

:::fold{id="accessibility" title="Accessibility" note="5 answers, 103 decisions, and the values of its tokens"}
#### Which states get their own visible value? {#accessibility-roles}

::decision-answer{id="accessibility-roles"}

#### How many signals carry each meaning? {#accessibility-count}

::decision-answer{id="accessibility-count"}

#### What contrast floor do we hold? {#accessibility-definition}

::decision-answer{id="accessibility-definition"}

#### What is the smallest target? {#accessibility-values}

::decision-answer{id="accessibility-values"}

#### Where are the floors hardest to hold? {#accessibility-lands}

::decision-answer{id="accessibility-lands"}
:::

:::fold{id="naming" title="Naming" note="5 answers, 1 decision, and the values of its tokens"}
#### What gets a name? {#naming-roles}

::decision-answer{id="naming-roles"}

#### How many token tiers? {#naming-count}

::decision-answer{id="naming-count"}

#### How are decisions named? {#naming-definition}

::decision-answer{id="naming-definition"}

#### How are names written? {#naming-values}

::decision-answer{id="naming-values"}

#### What do components read? {#naming-lands}

::decision-answer{id="naming-lands"}
:::

:::fold{id="voice" title="Voice and tone" note="5 answers, 13 decisions, and the values of its tokens"}
#### Which kinds of copy does it need? {#voice-roles}

::decision-answer{id="voice-roles"}

#### How many tones does it use? {#voice-count}

::decision-answer{id="voice-count"}

#### How is the voice defined? {#voice-definition}

::decision-answer{id="voice-definition"}

#### How does it sound? {#voice-values}

::decision-answer{id="voice-values"}

#### Where do the words matter most? {#voice-lands}

::decision-answer{id="voice-lands"}
:::

:::fold{id="components" title="Components" note="5 answers, 1 decision, and the values of its tokens"}
#### Which component families does it need? {#components-roles}

::decision-answer{id="components-roles"}

#### How far does the inventory reach? {#components-count}

::decision-answer{id="components-count"}

#### How does a component earn its place? {#components-definition}

::decision-answer{id="components-definition"}

#### When does a component get another look? {#components-values}

::decision-answer{id="components-values"}

#### Where do components do the most work? {#components-lands}

::decision-answer{id="components-lands"}
:::
::::
