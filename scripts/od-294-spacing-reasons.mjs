// OD-294: writes the reason of every space token, control height and row. Each reason names its use
// case or mechanism (a multiple of the base, a step on the control scale, or inheritance), the job of
// its property from the grammar's spacing jobs, and how the property does that job.
// Run once after node scripts/spacing-use-cases.mjs.
import { controlHeights, spaceValues } from "../cli/src/spacing-use-cases.mjs";
import { grammar, loadScheme, saveScheme } from "../cli/src/schemes.mjs";
import { matches } from "../cli/src/trace.mjs";

// token: [role, mechanism, what people get, the decision in words, the answers it cites]
const REASONS = {
  "dense-data": {
    "space.gap.tight": [
      "the tight gap between the parts of one item, such as an icon and its word",
      "one base step (1 × 4px), the smallest gap on the 4px grid",
      "each item in a dense row reads as one unit",
      "steps are small, on a 4px grid (spacing.definition), and the layout is compact (spacing.values)",
      ["spacing.definition", "spacing.values"],
    ],
    "space.gap.default": [
      "the default gap between the items of one group",
      "two base steps (2 × 4px), twice the tight gap",
      "analysts tell one record from the next while a list stays close",
      "the layout is compact (spacing.values) and experts want a lot on one screen (content.q2)",
      ["spacing.values", "content.q2"],
    ],
    "space.gap.group": [
      "the group gap between groups in a layout",
      "four base steps (4 × 4px), four tight gaps",
      "a new group starts without pushing records off the screen",
      "the layout is compact (spacing.values) and people must keep their place (human.q1)",
      ["spacing.values", "human.q1"],
    ],
    "space.gap.section": [
      "the section gap between page sections",
      "six base steps (6 × 4px), half again the group gap",
      "sections part with a hairline and little space, and the data keeps the room",
      "the layout is compact (spacing.values) and experts want a lot on one screen (content.q2)",
      ["spacing.values", "content.q2"],
    ],
    "space.inset.control-x": [
      "the inline padding inside controls",
      "three base steps (3 × 4px), the same as a table cell",
      "buttons stay short and a toolbar holds every action an expert repeats",
      "actions repeat constantly (tasks.q2) and the layout is compact (spacing.values)",
      ["tasks.q2", "spacing.values"],
    ],
    "space.inset.cell-x": [
      "the inline padding inside table cells",
      "three base steps (3 × 4px), the same as a control",
      "more columns fit, and values in two columns still stay apart",
      "people scan and compare rows (tasks.q1) and the layout is compact (spacing.values)",
      ["tasks.q1", "spacing.values"],
    ],
    "space.inset.container": [
      "the padding inside cards and dialogs",
      "four base steps (4 × 4px), the same as the group gap",
      "content starts close to the edge of its box",
      "experts want a lot on one screen (content.q2) and the layout is compact (spacing.values)",
      ["content.q2", "spacing.values"],
    ],
    "size.control.default": [
      "buttons and inputs",
      "the pointer target size, step 0 of the control scale, a 32px hit area above the 24px WCAG 2.5.8 floor",
      "every control fits a mouse and toolbars stay short",
      "the smallest target is compact, for a pointer (accessibility.values), and experts work at a desk (scenarios.q1)",
      ["accessibility.values", "scenarios.q1"],
    ],
    "size.control.compact": [
      "compact controls, such as a clear button inside a field",
      "one 8px step below the 32px default on the control scale, a 24px hit area that is exactly the WCAG 2.5.8 floor at AA, with no margin",
      "a small button fits inside a field, and the field keeps its row height",
      "the smallest target is compact, for a pointer (accessibility.values), and experts use a mouse at a desk (scenarios.q1)",
      ["accessibility.values", "scenarios.q1"],
    ],
    "size.control.large": [
      "large controls",
      "the default's step on the control scale and the default's 32px hit area, as the scheme has no hero action",
      "toolbar buttons stay in line, and color and place mark the main action",
      "actions take three emphasis levels with one primary per view (color.count), and the smallest target is compact (accessibility.values)",
      ["color.count", "accessibility.values"],
    ],
    "size.row": [
      "one table row",
      "a row one 32px default control tall and no more, as rows are a decision of their own here and a row holds controls",
      "more records fit, and a control in a row fills its height",
      "row heights are a spacing role (spacing.roles) and the layout is compact (spacing.values)",
      ["spacing.roles", "spacing.values"],
    ],
  },
  "content-first": {
    "space.gap.tight": [
      "the tight gap between the parts of one item, such as an icon and its word",
      "one base step (1 × 8px), the smallest of the big even steps",
      "occasional readers see one item, not two",
      "steps are big and even (spacing.definition) and visitors see the interface fresh each time (human.q2)",
      ["spacing.definition", "human.q2"],
    ],
    "space.gap.default": [
      "the default gap between the items of one group",
      "two base steps (2 × 8px), twice the tight gap",
      "each item in a list reads on its own",
      "the layout is spacious (spacing.values) and reading comfort is the measure (outcomes.q1)",
      ["spacing.values", "outcomes.q1"],
    ],
    "space.gap.group": [
      "the group gap between groups in a layout",
      "four base steps (4 × 8px), twice the default gap",
      "the reader gets a place to pause between groups",
      "the layout is spacious (spacing.values) and people read from start to end (tasks.q1)",
      ["spacing.values", "tasks.q1"],
    ],
    "space.gap.section": [
      "the section gap between page sections",
      "eight base steps (8 × 8px), twice the group gap",
      "space alone separates sections, with no line to add noise",
      "the layout is spacious (spacing.values) and space is spent between paragraphs and sections (spacing.lands)",
      ["spacing.values", "spacing.lands"],
    ],
    "space.inset.control-x": [
      "the inline padding inside controls",
      "two and a half base steps (2.5 × 8px), wider than a table cell",
      "each rare action has room and a button feels as calm as the text",
      "actions are rare (tasks.q2) and the brand is warm (brand.q1)",
      ["tasks.q2", "brand.q1"],
    ],
    "space.inset.cell-x": [
      "the inline padding inside table cells",
      "two base steps (2 × 8px), the same as the default gap",
      "cells get room like text does, and each row reads one by one",
      "people read from start to end (tasks.q1) and the layout is spacious (spacing.values)",
      ["tasks.q1", "spacing.values"],
    ],
    "space.inset.container": [
      "the padding inside cards and dialogs",
      "three base steps (3 × 8px), half again the default gap",
      "each card is framed like a page in a magazine",
      "the brand is warm (brand.q1) and reading comfort is the measure (outcomes.q1)",
      ["brand.q1", "outcomes.q1"],
    ],
    "size.control.default": [
      "buttons and inputs",
      "the touch target size, step 0 of the control scale, a 48px hit area",
      "readers on phones get a full touch target on every control",
      "the smallest target is touch size (accessibility.values) and readers arrive on any device (scenarios.q1)",
      ["accessibility.values", "scenarios.q1"],
    ],
    "size.control.compact": [
      "compact controls, such as a clear or show button inside a field",
      "one 8px step below the 48px default on the control scale; the 40px box relies on the padding of the field around it for a touch-size hit area",
      "a small button fits inside the field around it",
      "the content is long-form text (content.q1) and the smallest target is touch size (accessibility.values)",
      ["content.q1", "accessibility.values"],
    ],
    "size.control.large": [
      "large controls",
      "the default's step on the control scale and the default's 48px hit area, as the scheme has no hero action",
      "a main action never shouts over the text, and color marks it",
      "actions are rare (tasks.q2) and attention belongs on the content (human.q1)",
      ["tasks.q2", "human.q1"],
    ],
    "size.row": [
      "one table row",
      "by inheritance, as the scheme has no row role and a row holds controls, so size.row takes size.control.default, one 48px control tall",
      "a control fits in its row, and each row reads one by one",
      "spacing has gaps and insets only (spacing.roles) and the smallest target is touch size (accessibility.values)",
      ["spacing.roles", "accessibility.values"],
    ],
  },
  "accessible-first": {
    "space.gap.tight": [
      "the tight gap between the parts of one item",
      "one and a half base steps (1.5 × 8px), the smallest gap",
      "parts read as one item and stay apart at high zoom",
      "steps are big and even (spacing.definition) and everyone uses it, including people with disabilities (people.q1)",
      ["spacing.definition", "people.q1"],
    ],
    "space.gap.default": [
      "the default gap between the items of one group, such as fields",
      "two base steps (2 × 8px), 4px more than the tight gap",
      "people with tremor tap the field they mean",
      "the layout is spacious (spacing.values) and space between fields matters most (spacing.lands)",
      ["spacing.values", "spacing.lands"],
    ],
    "space.gap.group": [
      "the group gap between groups of questions",
      "four base steps (4 × 8px), twice the default gap",
      "people see where one group of questions ends and the next begins",
      "the layout is spacious (spacing.values) and each step must take low effort to understand (human.q1)",
      ["spacing.values", "human.q1"],
    ],
    "space.gap.section": [
      "the section gap between page sections",
      "six base steps (6 × 8px), half again the group gap",
      "sections part by space, which is easy to see, and not by thin lines",
      "the layout is spacious (spacing.values) and steps are big and even (spacing.definition)",
      ["spacing.values", "spacing.definition"],
    ],
    "space.inset.control-x": [
      "the inline padding inside controls",
      "three base steps (3 × 8px), the same as a card's padding",
      "each button is a bigger target that is easy to hit",
      "everyone uses it, including people with motor needs (people.q1), and the smallest target is large (accessibility.values)",
      ["people.q1", "accessibility.values"],
    ],
    "space.inset.cell-x": [
      "the inline padding inside table cells",
      "two base steps (2 × 8px), the same as the default gap",
      "values in two columns stay apart at high zoom",
      "everyone uses it, including people with low vision (people.q1), and the layout is spacious (spacing.values)",
      ["people.q1", "spacing.values"],
    ],
    "space.inset.container": [
      "the padding inside cards and dialogs",
      "three base steps (3 × 8px), half again the default gap",
      "content stays clear of the strong border at any zoom",
      "everyone uses it (people.q1) and each step must take low effort to understand (human.q1)",
      ["people.q1", "human.q1"],
    ],
    "size.control.default": [
      "buttons and inputs",
      "the large target size, step 0 of the control scale, a 52px hit area above the 44px of WCAG 2.5.5",
      "people with tremor and low vision get a large control",
      "the smallest target is large (accessibility.values) and everyone uses it, including people with motor needs (people.q1)",
      ["accessibility.values", "people.q1"],
    ],
    "size.control.compact": [
      "compact controls, such as a button inside a field",
      "one 4px step below the 52px default on the control scale, a short step so the 48px hit area still meets the large target size",
      "a button fits inside a field and is still large",
      "the smallest target is large (accessibility.values) and everyone uses it (people.q1)",
      ["accessibility.values", "people.q1"],
    ],
    "size.control.large": [
      "large controls",
      "the default's step on the control scale and the default's 52px hit area, as every control is already large and the scheme has no hero action",
      "every button has one height and pages stay predictable",
      "each step must take low effort to understand (human.q1) and the smallest target is large (accessibility.values)",
      ["human.q1", "accessibility.values"],
    ],
    "size.row": [
      "one table row",
      "a row one 52px default control tall plus 4px, one step up the control scale, as rows are a decision of their own here",
      "rows are easy to read and tap, a little taller than the control they hold",
      "row heights are a spacing role, for touch and zoom (spacing.roles), and the smallest target is large (accessibility.values)",
      ["spacing.roles", "accessibility.values"],
    ],
  },
  "brand-expressive": {
    "space.gap.tight": [
      "the tight gap between the parts of one item, such as an icon and its word",
      "one base step (1 × 8px), the smallest of the big even steps",
      "a call to action reads as one bold unit",
      "steps are big and even (spacing.definition) and the content is images and campaigns (content.q1)",
      ["spacing.definition", "content.q1"],
    ],
    "space.gap.default": [
      "the default gap between the items of one group",
      "two base steps (2 × 8px), twice the tight gap",
      "air between items keeps big type readable",
      "the layout is spacious (spacing.values) and delight is the point (human.q1)",
      ["spacing.values", "human.q1"],
    ],
    "space.gap.group": [
      "the group gap between groups inside a section",
      "five base steps (5 × 8px), two and a half default gaps",
      "each group has its own moment inside a section",
      "the layout is spacious (spacing.values) and each section holds one big idea (content.q2)",
      ["spacing.values", "content.q2"],
    ],
    "space.gap.section": [
      "the section gap between big sections",
      "eight base steps (8 × 8px), four default gaps",
      "each section, with its color block, is a moment of its own",
      "space works between big sections (spacing.lands) and the layout is spacious (spacing.values)",
      ["spacing.lands", "spacing.values"],
    ],
    "space.inset.control-x": [
      "the inline padding inside controls",
      "three and a half base steps (3.5 × 8px), wider than a table cell",
      "pill buttons look bold and are easy to hit with a thumb",
      "the brand is bold (brand.q1) and visitors are on the move (scenarios.q1)",
      ["brand.q1", "scenarios.q1"],
    ],
    "space.inset.cell-x": [
      "the inline padding inside table cells",
      "two base steps (2 × 8px), the same as the default gap",
      "the rare table keeps the page's airy rhythm",
      "the content is images and campaigns, with few tables (content.q1), and the layout is spacious (spacing.values)",
      ["content.q1", "spacing.values"],
    ],
    "space.inset.container": [
      "the padding inside cards and dialogs",
      "four base steps (4 × 8px), twice the default gap",
      "each card holds its moment",
      "delight is the point (human.q1) and the brand is bold (brand.q1)",
      ["human.q1", "brand.q1"],
    ],
    "size.control.default": [
      "buttons and inputs",
      "the touch target size, step 0 of the control scale, a 52px hit area",
      "every control fits a thumb",
      "the smallest target is touch size (accessibility.values) and visitors arrive on their phones (scenarios.q1)",
      ["accessibility.values", "scenarios.q1"],
    ],
    "size.control.compact": [
      "compact controls, such as a button inside a pill field",
      "one 8px step below the 52px default on the control scale, a 44px hit area that still fits a thumb",
      "a button sits inside the pill field and still fits a thumb",
      "visitors are on the move (scenarios.q1) and the smallest target is touch size (accessibility.values)",
      ["scenarios.q1", "accessibility.values"],
    ],
    "size.control.large": [
      "the one loud call to action",
      "one 8px step above the 52px default on the control scale, a 60px hit area, as sign-up is the scheme's hero action",
      "the sign-up button wins the eye and the thumb",
      "there is one action, sign up (tasks.q2), and visitors are on the move (scenarios.q1)",
      ["tasks.q2", "scenarios.q1"],
    ],
    "size.row": [
      "one table row",
      "by inheritance, as the scheme has no row role and a row holds controls, so size.row takes size.control.default, one 52px control tall",
      "the rare table keeps the brand's airy rhythm",
      "spacing has gaps and insets only (spacing.roles) and the smallest target is touch size (accessibility.values)",
      ["spacing.roles", "accessibility.values"],
    ],
  },
  "multi-brand": {
    "space.gap.tight": [
      "the tight gap between the parts of one item",
      "two base steps (2 × 4px) on the shared grid",
      "the shared parts look the same in every brand",
      "the brands share one set of steps on a 4px grid (spacing.definition) and three brands share one system (business.q2)",
      ["spacing.definition", "business.q2"],
    ],
    "space.gap.default": [
      "the default gap between the fields of one form group",
      "three base steps (3 × 4px), one step wider than the tight gap",
      "customers on phones tap the right field",
      "the layout is comfortable (spacing.values) and customers sign up on phones (scenarios.q1)",
      ["spacing.values", "scenarios.q1"],
    ],
    "space.gap.group": [
      "the group gap between groups in a form",
      "six base steps (6 × 4px), twice the default gap",
      "sign-up forms keep the same shape in every brand",
      "three brands share one system (business.q2) and the layout is comfortable (spacing.values)",
      ["business.q2", "spacing.values"],
    ],
    "space.gap.section": [
      "the section gap between page sections",
      "twelve base steps (12 × 4px), twice the group gap",
      "each offer card stands apart on a product page",
      "the layout is comfortable (spacing.values) and the 4px grid holds big steps for product pages (spacing.definition)",
      ["spacing.values", "spacing.definition"],
    ],
    "space.inset.control-x": [
      "the inline padding inside controls",
      "four base steps (4 × 4px), the same as a table cell",
      "buttons are the same size in every brand",
      "three brands share one system (business.q2) and steps sit on a 4px grid (spacing.definition)",
      ["business.q2", "spacing.definition"],
    ],
    "space.inset.cell-x": [
      "the inline padding inside table cells",
      "four base steps (4 × 4px), the same as a control",
      "account tables keep room between columns on a phone",
      "customers sign up on phones (scenarios.q1) and the layout is comfortable (spacing.values)",
      ["scenarios.q1", "spacing.values"],
    ],
    "space.inset.container": [
      "the padding inside cards and dialogs",
      "six base steps (6 × 4px), the same as the group gap",
      "cards hold offers the same way in every brand",
      "three brands share one system (business.q2) and the layout is comfortable (spacing.values)",
      ["business.q2", "spacing.values"],
    ],
    "size.control.default": [
      "buttons and inputs",
      "the touch target size, step 0 of the control scale, a 44px hit area",
      "every control fits a thumb in every brand",
      "the smallest target is touch size (accessibility.values) and customers sign up on phones (scenarios.q1)",
      ["accessibility.values", "scenarios.q1"],
    ],
    "size.control.compact": [
      "compact controls, such as a show-password button inside a field",
      "one 8px step below the 44px default on the control scale; the 36px box relies on the padding of the field around it for a touch-size hit area",
      "the button fits inside the field in every brand",
      "three brands share one system (business.q2) and the smallest target is touch size (accessibility.values)",
      ["business.q2", "accessibility.values"],
    ],
    "size.control.large": [
      "large controls",
      "the default's step on the control scale and the default's 44px hit area, as the scheme has no hero action",
      "every brand's forms keep one height, and brand color marks the main action",
      "three brands share one system (business.q2) and the smallest target is touch size (accessibility.values)",
      ["business.q2", "accessibility.values"],
    ],
    "size.row": [
      "one table row",
      "a row one 44px default control tall plus 4px, as rows are a decision of their own here",
      "rows stay easy to tap on a phone, a little taller than the control they hold",
      "account tables need a row height (spacing.roles) and the layout is comfortable (spacing.values)",
      ["spacing.roles", "spacing.values"],
    ],
  },
};

const jobs = grammar().scopes.find((s) => s.id === "spacing").jobs;
const jobOf = (name) =>
  jobs.find((j) => j.tokens.some((p) => matches(p, name)));

for (const [id, reasons] of Object.entries(REASONS)) {
  const s = loadScheme(id);
  const semantic = s.tokens.semantic;
  const px = {
    ...Object.fromEntries(
      Object.entries(spaceValues(semantic.space.$extensions["open-ds"])).map(
        ([k, v]) => [`space.${k}`, v],
      ),
    ),
    ...Object.fromEntries(
      Object.entries(controlHeights(semantic.size.$extensions["open-ds"])).map(
        ([k, v]) => [`size.${k}`, v],
      ),
    ),
  };
  for (const [
    name,
    [role, mechanism, get, decision, because],
  ] of Object.entries(reasons)) {
    const token = name.split(".").reduce((n, k) => n?.[k], semantic);
    if (!token) throw new Error(`${id}: no ${name}. Check the token name.`);
    const job = jobOf(name);
    if (!job)
      throw new Error(
        `${id}: ${name} has no spacing job in the grammar. Add one to the spacing scope's jobs.`,
      );
    const why = `We use ${px[name]}px for ${role}${role.includes(", such as") ? "," : ""} in order to ${job.job}: ${mechanism}. ${job.property} does this by ${job.how}. So ${get}, because ${decision}.`;
    token.$extensions = { ...token.$extensions, "open-ds": { why, because } };
  }
  saveScheme(s);
}
console.log("Wrote the OD-294 spacing reasons.");
