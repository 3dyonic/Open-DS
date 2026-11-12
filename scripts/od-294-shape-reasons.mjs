// OD-294: the reasons for every radius, border-width and elevation value, in the reason form: "We use
// <value> for <role> in order to <job>. The <property> does this by <how>. So <what people get>,
// because <decision> (<answer ids>)." Written by hand from each scheme's answers; scripts/od-294-shape.mjs
// writes them. Picks are keyed <brand>/<mode>/<group>.<leaf>; the script adds the "<step>: " prefix.
// The measured shade contrasts are in the shape-elevation-relations check (cli/src/shape-elevation.mjs).

const CONTROL = ["shape.values", "brand.q1", "content.q2"];
const SURFACE = ["shape.roles", "shape.count", "brand.q1"];
const OPTION = ["shape.roles", "shape.count", "brand.q1", "spacing.values"];
const ELEMENT = ["shape.values", "brand.q1", "content.q2"];
const LINE = ["elevation.definition", "accessibility.definition"];
const FOCUS = ["accessibility.roles", "elevation.definition", "accessibility.definition"];
const GAP = ["accessibility.roles"];
const LIFT = ["elevation.roles", "elevation.values"];
const DARK = ["elevation.roles", "elevation.values", "theming.values"];

const r = (why, because) => ({ why, because });

// The same pick in each mode: a corner does not change with the mode.
const modes = (brand, group, light, dark = light) => ({ [`${brand}/light/${group}`]: light, [`${brand}/dark/${group}`]: dark });

export const REASONS = {
  "dense-data": {
    picks: {
      "default/base/radius.control": r(
        "We use a 2px corner for buttons and inputs in order to mark their role as controls and keep density. A small radius does this by softening the edge just enough to read as an object, while it keeps straight lines that align in rows. So a dense toolbar reads as one line of actions, because the product is dense (content.q2) and precise (brand.q1), with slightly rounded controls (shape.values).",
        CONTROL,
      ),
      "default/base/radius.badge": r(
        "We use a square corner for badges in order to give status a role of its own, apart from the 2px controls. A zero radius does this by keeping the badge a plain rectangle with no curve. So status badges line up down a table column, because badges get their own corner (shape.roles) and people scan and compare rows (tasks.q1).",
        ["shape.roles", "shape.values", "tasks.q1"],
      ),
      "default/base/radius.option": r(
        "We use a square corner for menu options in order to keep nesting by the relation: the 4px surface corner minus the panel's 4px padding. The inner radius does this by following the outer curve at the padding's distance, and here no curve is left. So an option's edge runs parallel to its menu's edge, because surfaces take 4px (shape.roles, brand.q1) and the layout is compact (spacing.values).",
        OPTION,
      ),
      "default/base/radius.element": r(
        "We use the 2px control corner for boxes that grow in order to keep their role, as objects of one family, by inheritance from the control corner. The same radius does this by giving a list row or a text area the curve of the controls beside it. So rows and fields read as one family, because the control corner is small, not a pill (shape.values), and the product is dense (content.q2).",
        ELEMENT,
      ),
      "default/base/radius.surface": r(
        "We use a 4px corner for cards, menus and dialogs in order to make touching panels read as separate objects, in a precise tone by brand convention. A small radius does this by breaking the outline at each corner, just softer than the 2px controls. So panels read apart yet still tile neatly, because containers get their own corner (shape.roles, shape.count) and the brand is precise (brand.q1).",
        SURFACE,
      ),
      ...modes(
        "default",
        "elevation.card",
        r(
          "We use no shadow for cards in order to keep them at the page's height: on the scale only floating layers rise. The missing shade does this by leaving the card flat, framed by its line. So the page reads as one flat grid, because only menus and dialogs float (elevation.roles) and shadows are subtle (elevation.values).",
          LIFT,
        ),
      ),
      "default/light/elevation.overlay": r(
        "We use step 2 of the shadow scale for menus and dialogs in order to show their height as floating layers. The cast shade does this by an 8px offset and a 24px blur at 16% under the panel's edge. So a menu reads as above the grid without a heavy edge, because only what floats rises (elevation.roles) and shadows are subtle (elevation.values).",
        LIFT,
      ),
      "default/dark/elevation.overlay": r(
        "We use the light shadow's shape for menus and dialogs in dark in order to show the same floating height by the dark-shade relation. The cast shade does this by the same 8px offset and 24px blur, at 50% black instead of 16%. So a menu still lifts off the dark page, though its shade reads weaker on dark than in light, because only what floats rises (elevation.roles) and dark ships as standard (theming.values).",
        DARK,
      ),
    },
    own: {
      "border-width.default": r(
        "We use a 1px default line for dividers and card borders in order to give separation between rows. A thin stroke does this by breaking the surface with the least weight a line can have; as a divider it decorates, so it has no contrast floor. So rows and cards stay apart without taking room from the data, because lines separate groups (elevation.definition) and AA is the floor (accessibility.definition).",
        LINE,
      ),
      "border-width.focus": r(
        "We use a 2px focus ring in order to show focus, one step heavier than the 1px default line by the focus relation. A heavier stroke does this by standing out from every border around it. So keyboard users always see which row has focus, because focus has its own look (accessibility.roles) and lines are thin (elevation.definition).",
        FOCUS,
      ),
      "border-width.focus-offset": r(
        "We use a fixed 2px focus offset in order to keep focus visible by contrast, not for style. The gap does this by showing the page color between ring and control, so one of the two colors keeps enough contrast against any fill (W3C technique C40). So keyboard users see the ring on any fill, even a selected row, because focus has its own look (accessibility.roles).",
        GAP,
      ),
    },
  },

  "content-first": {
    picks: {
      "default/base/radius.control": r(
        "We use an 8px corner for buttons and inputs in order to mark their role as controls in a warm tone, by brand convention. A rounded radius does this by curving the edge enough to feel soft, while the sides stay straight. So controls feel friendly next to long text and never compete with it, because the brand is warm (brand.q1), corners are rounded (shape.values) and each screen holds one idea (content.q2).",
        CONTROL,
      ),
      "default/base/radius.badge": r(
        "We use a pill corner for badges in order to give status a role of its own, apart from the 8px controls. A full radius does this by rounding both ends into a capsule. So a status sits softly in the text and never reads as a button, because badges get their own corner (shape.roles) and the brand is warm (brand.q1).",
        ["shape.roles", "shape.values", "brand.q1"],
      ),
      "default/base/radius.option": r(
        "We use an 8px corner for menu options in order to keep nesting by the relation: the 12px surface corner minus the panel's 4px padding. The inner radius does this by following the outer curve at the padding's distance. So an option's curve runs parallel to its menu's curve, because surfaces take 12px (shape.roles, brand.q1) and the panel's padding is 4px (spacing.values).",
        OPTION,
      ),
      "default/base/radius.element": r(
        "We use the 8px control corner for boxes that grow in order to keep their role, as objects of one family, by inheritance from the control corner. The same radius does this by giving a list item or a text area the curve of the controls beside it. So fields and rows read as one family, because the control corner is rounded, not a pill (shape.values), and the brand is warm (brand.q1).",
        ELEMENT,
      ),
      "default/base/radius.surface": r(
        "We use a 12px corner for article cards, menus and dialogs in order to make each card read as a separate object, in a warm tone by brand convention. A larger radius does this by breaking the outline with a curve wider than the 8px controls inside it. So a card reads as one calm object on the page, because containers get their own corner (shape.roles, shape.count) and the brand is warm (brand.q1).",
        SURFACE,
      ),
      ...modes(
        "default",
        "elevation.card",
        r(
          "We use no shadow for cards in order to keep them at the page's height: on the scale only floating layers rise. The missing shade does this by leaving the card flat, set apart by space. So reading flows down the page without boxes that lift, because only menus and dialogs float (elevation.roles) and shadows are soft (elevation.values).",
          LIFT,
        ),
      ),
      "default/light/elevation.overlay": r(
        "We use step 2 of the shadow scale for menus and dialogs in order to show their height as floating layers. The cast shade does this by a 12px offset and a 32px blur in a 16% warm brown. So a menu lifts off warm paper without a hard edge, because only what floats rises (elevation.roles) and shadows are soft (elevation.values).",
        LIFT,
      ),
      "default/dark/elevation.overlay": r(
        "We use the light shadow's shape for menus and dialogs in dark in order to show the same floating height by the dark-shade relation. The cast shade does this by the same 12px offset and 32px blur, at 50% black instead of 16% brown. So a menu still lifts off the dark page, though its shade reads weaker on dark than in light, because only what floats rises (elevation.roles) and dark ships for night reading (theming.values).",
        DARK,
      ),
    },
    own: {
      "border-width.default": r(
        "We use a 1px default line for card and panel borders in order to give grouping where space alone does not, not separation: space separates groups here. A thin stroke does this by drawing a shared region with the least weight that still reads. So the lines stay quiet beside long text, because space separates groups (elevation.definition) and AA is the floor (accessibility.definition).",
        LINE,
      ),
      "border-width.focus": r(
        "We use a 2px focus ring in order to show focus, one step heavier than the 1px default line by the focus relation. A heavier stroke does this by standing out from the thin edges around it. So readers who use a keyboard always see where they are, because focus has its own look (accessibility.roles) and lines are thin (elevation.definition).",
        FOCUS,
      ),
      "border-width.focus-offset": r(
        "We use a fixed 2px focus offset in order to keep focus visible by contrast, not for style. The gap does this by showing the page color between ring and control, so one of the two colors keeps enough contrast against any fill (W3C technique C40). So readers see the ring on any fill, even a filled button, because focus has its own look (accessibility.roles).",
        GAP,
      ),
    },
  },

  "accessible-first": {
    picks: {
      "default/base/radius.control": r(
        "We use a 6px corner for buttons and inputs in order to mark their role as controls in a calm, clear tone, by brand convention. A slight radius does this by softening the edge while the box keeps a clear rectangle. So every field and button reads plainly as something to use, because the brand is calm and clear (brand.q1) and corners are slightly rounded (shape.values).",
        CONTROL,
      ),
      "default/base/radius.badge": r(
        "We use a 4px corner for badges and checkboxes in order to give marks a role of their own, apart from the 6px controls. The smallest radius does this by keeping a clear rectangle around a word or a check. So a status never looks like a pill button, because badges get their own corner (shape.roles) and the brand is clear (brand.q1).",
        ["shape.roles", "shape.values", "brand.q1"],
      ),
      "default/base/radius.option": r(
        "We use a 4px corner for menu options in order to keep nesting by the relation: the 8px surface corner minus the panel's 4px padding. The inner radius does this by following the outer curve at the padding's distance. So an option's curve runs parallel to its menu's curve, because surfaces take 8px (shape.roles, brand.q1) and the panel's padding is 4px (spacing.values).",
        OPTION,
      ),
      "default/base/radius.element": r(
        "We use the 6px control corner for boxes that grow in order to keep their role, as objects of one family, by inheritance from the control corner. The same radius does this by giving a text area or a list row the curve of the fields beside it. So people see one family of boxes on a form, because the control corner is slight, not a pill (shape.values), and the brand is clear (brand.q1).",
        ELEMENT,
      ),
      "default/base/radius.surface": r(
        "We use an 8px corner for cards, menus and dialogs in order to make each card read as a separate object, in a calm tone by brand convention. The largest radius does this by breaking the outline with a curve wider than the 6px controls inside it. So a step card reads as one object that holds its fields, because containers get their own corner (shape.roles, shape.count) and the brand is calm and clear (brand.q1).",
        SURFACE,
      ),
      ...modes(
        "default",
        "elevation.card",
        r(
          "We use no shadow for cards in order to keep them at the page's height: the scale gives no layer a step here. The missing shade does this by leaving the card flat, framed by a strong line. So the page stays easy to read at high zoom, because nothing rises (elevation.roles) and there are no shadows (elevation.values).",
          LIFT,
        ),
      ),
      ...modes(
        "default",
        "elevation.overlay",
        r(
          "We use no shadow for menus and dialogs in order to show their height without a cast shade: the scale gives no layer a step here. The missing shade does this by leaving the layer to its border and the dimmed page behind it. So a dialog stands out at any zoom with no blur to read through, because nothing rises (elevation.roles) and there are no shadows (elevation.values).",
          LIFT,
        ),
      ),
    },
    own: {
      "border-width.default": r(
        "We use a 2px default line for borders and dividers in order to give separation and grouping that hold at any zoom. A heavier stroke does this by keeping the edge visible where a 1px line fades. So people with low vision still find each group, because strong lines separate groups (elevation.definition) and text holds AAA (accessibility.definition).",
        LINE,
      ),
      "border-width.focus": r(
        "We use a 3px focus ring in order to show focus, one step heavier than the 2px default line by the focus relation. A heavier stroke does this by standing out even from the strong borders around it. So everyone sees where the keyboard is, because every state has its own look (accessibility.roles) and lines are strong (elevation.definition).",
        FOCUS,
      ),
      "border-width.focus-offset": r(
        "We use a fixed 2px focus offset in order to keep focus visible by contrast, not for style. The gap does this by showing the page color between ring and control, so one of the two colors keeps enough contrast against any fill (W3C technique C40). So people see the ring on any fill and at any zoom, because every state has its own look (accessibility.roles).",
        GAP,
      ),
    },
  },

  "brand-expressive": {
    picks: {
      "default/base/radius.control": r(
        "We use a pill corner for buttons and inputs in order to mark their role as controls in a playful tone, by brand convention. A full radius does this by rounding both ends into a capsule, the brand's signature shape. So every action feels bold and friendly, because the brand is bold (brand.q1), controls are pills (shape.values) and each section holds one big idea (content.q2).",
        CONTROL,
      ),
      "default/base/radius.badge": r(
        "We use the pill control corner for badges in order to keep one role family by the badge relation: badges share the control's corner. The same full radius does this by giving a status the capsule of the buttons beside it. So a status pill matches the buttons and the page keeps one shape, because badges get no corner of their own (shape.roles) and controls are pills (shape.values).",
        ["shape.roles", "shape.values", "brand.q1"],
      ),
      "default/base/radius.option": r(
        "We use a 20px corner for menu options in order to keep nesting by the relation: the 24px surface corner minus the panel's 4px padding. The inner radius does this by following the outer curve at the padding's distance. So an option's curve runs parallel to its menu's curve, because surfaces take 24px (shape.roles, brand.q1) and the panel's padding is 4px (spacing.values).",
        OPTION,
      ),
      "default/base/radius.element": r(
        "We use the 12px box corner for boxes that grow in order to keep them box-shaped objects by the relation: a pill control gives way to the box corner. A moderate radius does this by curving the corners while the sides stay straight as the box grows. So a text area or a list item stays a box, not an oval, because controls are pills (shape.values) and the brand is bold (brand.q1).",
        ELEMENT,
      ),
      "default/base/radius.surface": r(
        "We use a 24px corner for cards, menus and dialogs in order to make each offer read as a separate object, in a bold tone by brand convention. A large radius does this by breaking the outline with a wide curve while the sides stay straight. So each offer reads as one friendly object, because containers get their own corner (shape.count) and the brand is bold (brand.q1).",
        SURFACE,
      ),
      "default/light/elevation.card": r(
        "We use step 1 of the shadow scale for cards in order to show their height as objects above the page. The cast shade does this by a 12px offset and a 32px blur at 14%. So each offer feels like an object you can pick up, because cards rise too (elevation.roles) and shadows are pronounced (elevation.values).",
        LIFT,
      ),
      "default/dark/elevation.card": r(
        "We use the light card shadow's shape in dark in order to show the same card height by the dark-shade relation. The cast shade does this by the same 12px offset and 32px blur, at 50% black instead of 14%. So each offer still reads as an object, though its shade reads weaker on dark than in light, because cards rise too (elevation.roles) and dark ships as standard (theming.values).",
        DARK,
      ),
      "default/light/elevation.overlay": r(
        "We use step 2 of the shadow scale for menus and dialogs in order to show floating height, one step above the cards. The cast shade does this by a 24px offset and a 48px blur at 20%, larger than the card's. So a menu sits clearly above vivid sections and cards, because cards and overlays rise (elevation.roles) and shadows are pronounced (elevation.values).",
        LIFT,
      ),
      "default/dark/elevation.overlay": r(
        "We use the light overlay shadow's shape in dark in order to show the same floating height by the dark-shade relation. The cast shade does this by the same 24px offset and 48px blur, at 60% black instead of 20%. So a menu still sits above dark sections, though its shade reads weaker on dark than in light, because cards and overlays rise (elevation.roles) and dark ships as standard (theming.values).",
        DARK,
      ),
    },
    own: {
      "border-width.default": r(
        "We use a 2px default line for card borders in order to give grouping in a bold tone. A heavier stroke does this by drawing a shared region with the weight of the bold type beside it. So each card holds its offer next to vivid color, because cards separate groups (elevation.definition), AA holds on every color (accessibility.definition) and the brand is bold (brand.q1).",
        [...LINE, "brand.q1"],
      ),
      "border-width.focus": r(
        "We use a 3px focus ring in order to show focus, one step heavier than the 2px default line by the focus relation. A heavier stroke does this by standing out even from the bold edges around it. So keyboard users see focus on vivid color, because focus has its own look (accessibility.roles) and AA holds on every color (accessibility.definition).",
        FOCUS,
      ),
      "border-width.focus-offset": r(
        "We use a fixed 2px focus offset in order to keep focus visible by contrast, not for style. The gap does this by showing the page color between ring and control, so one of the two colors keeps enough contrast against any fill (W3C technique C40). So visitors see the ring on any brand color, because focus has its own look (accessibility.roles).",
        GAP,
      ),
    },
  },

  "multi-brand": {
    picks: {
      "aster/base/radius.control": r(
        "We use a 4px corner for Aster's buttons and inputs in order to mark their role as controls in a calm, precise tone, by brand convention. A small radius does this by softening the edge just enough while the sides stay straight. So Aster feels exact and steady, the least round of the three brands, because each brand sets its corners (shape.values) on a neutral base (brand.q1).",
        CONTROL,
      ),
      "aster/base/radius.badge": r(
        "We use the 4px control corner for Aster's badges in order to keep one role family by the badge relation: here badges share the control's corner. The same small radius does this by giving a plan status the box shape of the buttons. So a status reads as a small square tag, because each brand sets its three corners (shape.roles) and Aster's are small (shape.values).",
        ["shape.roles", "shape.values", "brand.q1"],
      ),
      "aster/base/radius.option": r(
        "We use a 4px corner for Aster's menu options in order to keep nesting by the relation: the 8px surface corner minus the panel's 4px padding. The inner radius does this by following the outer curve at the padding's distance. So an option's curve runs parallel to its menu's curve, because Aster's surfaces take 8px (shape.roles, brand.q1) and the panel's padding is 4px (spacing.values).",
        OPTION,
      ),
      "aster/base/radius.element": r(
        "We use the 4px control corner for Aster's growing boxes in order to keep their role, as objects of one family, by inheritance from the control corner. The same radius does this by giving a list item or a text area the curve of the controls beside it. So fields and rows read as one family, because Aster's control corner is small, not a pill (shape.values).",
        ELEMENT,
      ),
      "aster/base/radius.surface": r(
        "We use an 8px corner for Aster's cards and dialogs in order to make each card read as a separate object, in a calm tone by brand convention. A modest radius does this by breaking the outline with a curve twice the 4px control corner. So a plan card reads as one object without feeling soft, because containers get their own corner (shape.roles, shape.count) and each brand colors a neutral base (brand.q1).",
        SURFACE,
      ),
      "birch/base/radius.control": r(
        "We use a 12px corner for Birch's buttons and inputs in order to mark their role as controls in a friendly tone, by brand convention. A rounded radius does this by curving the edge clearly while the box keeps straight sides. So Birch feels softer than Aster yet still precise enough to fill a form, because each brand sets its corners (shape.values) on a neutral base (brand.q1).",
        CONTROL,
      ),
      "birch/base/radius.badge": r(
        "We use a pill corner for Birch's badges in order to give status a role of its own, apart from the 12px controls. A full radius does this by rounding both ends into a capsule. So a status and a button never look alike, because each brand sets three corners (shape.roles) and Birch rounds its badges (shape.values).",
        ["shape.roles", "shape.values", "brand.q1"],
      ),
      "birch/base/radius.option": r(
        "We use a 12px corner for Birch's menu options in order to keep nesting by the relation: the 16px surface corner minus the panel's 4px padding. The inner radius does this by following the outer curve at the padding's distance. So an option's curve runs parallel to its menu's curve, because Birch's surfaces take 16px (shape.roles, brand.q1) and the panel's padding is 4px (spacing.values).",
        OPTION,
      ),
      "birch/base/radius.element": r(
        "We use the 12px control corner for Birch's growing boxes in order to keep their role, as objects of one family, by inheritance from the control corner. The same radius does this by giving a list item or a text area the curve of the controls beside it. So fields and rows read as one family, because Birch's control corner is rounded, not a pill (shape.values).",
        ELEMENT,
      ),
      "birch/base/radius.surface": r(
        "We use a 16px corner for Birch's cards and dialogs in order to make each card read as a separate object, in a friendly tone by brand convention. A larger radius does this by breaking the outline with a curve wider than the 12px controls. So a plan card reads as one soft object, because containers get their own corner (shape.roles, shape.count) and each brand colors a neutral base (brand.q1).",
        SURFACE,
      ),
      "coral/base/radius.control": r(
        "We use a pill corner for Coral's buttons and inputs in order to mark their role as controls in a playful tone, by brand convention. A full radius does this by rounding both ends into a capsule. So Coral feels upbeat, the roundest of the three brands, because each brand sets its corners (shape.values) on a neutral base (brand.q1).",
        CONTROL,
      ),
      "coral/base/radius.badge": r(
        "We use the pill control corner for Coral's badges in order to keep one role family by the badge relation: here badges share the control's corner. The same full radius does this by giving a status the capsule of the buttons. So the shape matches the buttons and the word in each badge marks it as a status, because each brand sets its corners (shape.roles, shape.values).",
        ["shape.roles", "shape.values", "brand.q1", "accessibility.count"],
      ),
      "coral/base/radius.option": r(
        "We use a 16px corner for Coral's menu options in order to keep nesting by the relation: the 20px surface corner minus the panel's 4px padding. The inner radius does this by following the outer curve at the padding's distance. So an option's curve runs parallel to its menu's curve, because Coral's surfaces take 20px (shape.roles, brand.q1) and the panel's padding is 4px (spacing.values).",
        OPTION,
      ),
      "coral/base/radius.element": r(
        "We use the 12px box corner for Coral's growing boxes in order to keep them box-shaped objects by the relation: a pill control gives way to the box corner. A moderate radius does this by curving the corners while the sides stay straight as the box grows. So a text area stays a box, not an oval, because Coral's controls are pills (shape.values).",
        ELEMENT,
      ),
      "coral/base/radius.surface": r(
        "We use a 20px corner for Coral's cards and dialogs in order to make each card read as a separate object, in a playful tone by brand convention. A large radius does this by breaking the outline with a wide curve while the sides stay straight. So a plan card reads as one round, friendly object, the roundest of the three brands, because containers get their own corner (shape.roles, shape.count) on a neutral base (brand.q1).",
        SURFACE,
      ),
      ...Object.fromEntries(
        ["aster", "birch", "coral"].flatMap((brand) =>
          Object.entries({
            [`${brand}/light/elevation.card`]: r(
              "We use step 1 of the shadow scale for cards in order to show their height just above the page. The cast shade does this by a 2px offset and an 8px blur at 8%. So plan cards group each offer and lift only slightly, because cards rise too (elevation.roles) and shadows are soft (elevation.values).",
              LIFT,
            ),
            [`${brand}/dark/elevation.card`]: r(
              "We use the light card shadow's shape in dark in order to show the same card height by the dark-shade relation. The cast shade does this by the same 2px offset and 8px blur, at 40% black instead of 8%. So cards keep their lift in shape, though its shade reads weaker on dark than in light, because cards rise too (elevation.roles) and dark ships for every brand (theming.values).",
              DARK,
            ),
            [`${brand}/light/elevation.overlay`]: r(
              "We use step 2 of the shadow scale for menus and dialogs in order to show floating height, one step above the cards. The cast shade does this by a 12px offset and a 32px blur at 16%, four times the card's blur. So a menu floats clear above the cards in every brand, because cards and overlays rise (elevation.roles) and shadows are soft (elevation.values).",
              LIFT,
            ),
            [`${brand}/dark/elevation.overlay`]: r(
              "We use the light overlay shadow's shape in dark in order to show the same floating height by the dark-shade relation. The cast shade does this by the same 12px offset and 32px blur, at 50% black instead of 16%. So a menu still floats above the cards, though its shade reads weaker on dark than in light, because cards and overlays rise (elevation.roles) and dark ships for every brand (theming.values).",
              DARK,
            ),
          }),
        ),
      ),
    },
    own: {
      "border-width.default": r(
        "We use a 1px default line for card borders in every brand in order to give grouping to plans and offers. A thin stroke does this by drawing a shared region with the least weight that still reads, the same in each brand. So color carries each brand, not line weight, because cards separate groups (elevation.definition) and AA holds in every brand (accessibility.definition).",
        LINE,
      ),
      "border-width.focus": r(
        "We use a 2px focus ring in every brand in order to show focus, one step heavier than the 1px default line by the focus relation. A heavier stroke does this by standing out from the thin edges around it. So keyboard users see focus on any brand color, because focus has its own look (accessibility.roles) and AA holds in every brand (accessibility.definition).",
        FOCUS,
      ),
      "border-width.focus-offset": r(
        "We use a fixed 2px focus offset in every brand in order to keep focus visible by contrast, not for style. The gap does this by showing the page color between ring and control, so one of the two colors keeps enough contrast against any fill (W3C technique C40). So the ring reads in light and dark in every brand, because focus has its own look (accessibility.roles).",
        GAP,
      ),
    },
  },
};
