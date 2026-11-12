// OD-297: the grammar's motion families and the reasons for every value scripts/od-297-decisions.mjs adds
// or changes, in the reason form: "We use <value> for <role> in order to <job>. The <property> does this
// by <how>. So <what people get>, because <decision> (<answer ids>)." Each reason cites the answers it
// follows. Numbers that depend on other values (contrasts) are computed when the script writes them.

/** The motion scope's families and move types (decisions 2, 3 and 6). The motion-families check reads it. */
export const FAMILIES = {
  description:
    "Motion comes in two families, set by what motion is for (motion.roles). A productive family serves work: short, plain moves. An expressive family carries the brand: it may move longer, accelerates a layer that leaves the screen, and springs on emphasis only. Each move type has its own easing token, and each duration has a limit in its family.",
  question: "motion.roles",
  by_option: { feedback: "productive", "feedback-guidance": "productive", expression: "expressive" },
  moves: [
    { id: "enter", token: "motion.easing.enter", description: "A layer appears: a menu, a popover, a dialog, a toast." },
    { id: "exit", token: "motion.easing.exit", description: "A layer closes where it stands." },
    { id: "exit-offscreen", token: "motion.easing.exit-offscreen", description: "A layer slides off the screen: a sheet or a drawer." },
    { id: "transition", token: "motion.easing.standard", description: "A state changes in place: hover, press, toggle." },
    { id: "emphasize", token: "motion.easing.emphasize", description: "A moment that calls for attention, such as a success." },
  ],
  curves: [
    { id: "ease-out", says: "Decelerates: past half its progress at half its time, never past the target." },
    { id: "strong-out", says: "A strong ease-out: at least 80% of its progress at a third of its time, never past the target." },
    { id: "accelerate", says: "Speeds up: under half its progress at half its time, never past the target." },
    { id: "overshoot", says: "Passes its target and settles back: a spring." },
  ],
  items: [
    {
      id: "productive",
      title: "Productive",
      description: "Motion for work. Feedback ends within 150ms and panels within 300ms; an exit is a strong ease-out of about 150ms, even off the screen. No move overshoots.",
      max_ms: { "motion.duration.feedback": 150, "motion.duration.panels": 300, "motion.duration.exit": 150, "motion.duration.*": 300 },
      curves: {
        enter: ["ease-out", "strong-out"],
        exit: ["strong-out"],
        "exit-offscreen": ["strong-out"],
        transition: ["ease-out", "strong-out"],
        emphasize: ["ease-out", "strong-out"],
      },
    },
    {
      id: "expressive",
      title: "Expressive",
      description: "Motion that carries the brand. Any move may take up to 500ms. An exit eases out, and accelerates only when the layer leaves the screen. Only the emphasize move overshoots.",
      max_ms: { "motion.duration.*": 500 },
      curves: {
        enter: ["ease-out", "strong-out"],
        exit: ["ease-out", "strong-out"],
        "exit-offscreen": ["accelerate"],
        transition: ["ease-out", "strong-out"],
        emphasize: ["overshoot", "ease-out", "strong-out"],
      },
    },
  ],
};

const r = (why, because) => ({ why, because });

// Who each scheme serves, and what a panel's speed gives them.
const PEOPLE = {
  "dense-data": { who: "experts", roles: "feedback only", panels: "open a menu many times a shift and never wait for it", count: "there is one speed" },
  "content-first": { who: "readers", roles: "feedback and guidance", panels: "follow the new panel without losing their place in the text", count: "there are two speeds" },
  "accessible-first": { who: "people", roles: "feedback only", panels: "see where a panel came from and keep their place", count: "there is one speed" },
  "brand-expressive": { who: "visitors", roles: "feedback and expression", panels: "see each menu arrive as part of the brand", count: "there are three speeds" },
  "multi-brand": { who: "customers", roles: "feedback and guidance", panels: "move through sign-up the same way in every brand", count: "there are two speeds" },
};

// The duration word each move kind takes, and the milliseconds behind each word, per scheme.
const SPEEDS = {
  "dense-data": { durations: { fast: 120 }, feedback: "fast", panels: "fast", exit: "fast" },
  "content-first": { durations: { moderate: 150, relaxed: 300 }, feedback: "moderate", panels: "relaxed", exit: "moderate" },
  "accessible-first": { durations: { moderate: 150 }, feedback: "moderate", panels: "moderate", exit: "moderate" },
  "brand-expressive": { durations: { fast: 120, moderate: 200, relaxed: 320 }, feedback: "fast", panels: "moderate", exit: "fast", hero: "relaxed" },
  "multi-brand": { durations: { moderate: 150, relaxed: 300 }, feedback: "moderate", panels: "relaxed", exit: "moderate" },
};

/** The primitives, the semantic durations and the easing per move for one scheme, with their reasons. */
export function motionReasons(id, family) {
  const p = PEOPLE[id];
  const sp = SPEEDS[id];
  const ms = (kind) => sp.durations[sp[kind]];
  const val = (kind) => `${ms(kind)}ms (${sp[kind]})`;
  const durationTokens = {};
  const easings = {};
  if (family === "productive") {
    durationTokens.feedback = {
      word: sp.feedback,
      description: "Hover, press and toggle feedback. At most 150ms in a productive family.",
      ...r(
        `We use ${val("feedback")} for hover, press and toggle feedback in order to confirm each action inside the productive limit of 150ms. The duration does this by ending the change before the eye leaves the control. So ${p.who} see each action land and never wait for it, because motion is for ${p.roles}, which makes the family productive (motion.roles), and feedback feels ${sp.feedback} (motion.values).`,
        ["motion.roles", "motion.values"],
      ),
    };
    durationTokens.panels = {
      word: sp.panels,
      description: "Menus, popovers, dialogs and drawers opening. At most 300ms in a productive family.",
      ...r(
        `We use ${val("panels")} for menus, popovers, dialogs and other panels in order to show where a panel comes from, inside the productive limit of 300ms. The duration does this by giving the eye just enough frames to follow the panel from its trigger. So ${p.who} ${p.panels}, because the family is productive (motion.roles) and ${p.count} (motion.count).`,
        ["motion.roles", "motion.count"],
      ),
    };
    durationTokens.exit = {
      word: sp.exit,
      description: "A layer closing. About 150ms, never more, in a productive family.",
      ...r(
        `We use ${val("exit")} for a layer that closes in order to finish the exit move within the productive 150ms. The duration does this by removing the layer in fewer frames than an open takes, as nothing in it needs reading any more. So ${p.who} get the page back at once, because productive exits stay short (motion.roles) and ${p.count} (motion.count).`,
        ["motion.roles", "motion.count"],
      ),
    };
    easings.standard = {
      curve: "standard",
      description: "The transition move: a state that changes in place, such as hover, press or toggle.",
      ...r(
        `We use the standard easing (0.2, 0, 0, 1) for state changes in place in order to do the transition move. The curve does this by reaching its target early and settling slowly, with no overshoot. So a hover, a press or a toggle lands at once and then stays still, because easing is a standard ease-out (motion.definition) and the family is productive (motion.roles).`,
        ["motion.definition", "motion.roles"],
      ),
    };
    easings.enter = {
      curve: "standard",
      description: "The enter move: a layer that appears.",
      ...r(
        `We use the standard easing for a panel that appears in order to do the enter move. The curve does this by spending most of the change in the first frames, so the layer is in place before it slows. So ${p.who} can read a menu almost as soon as it opens, because easing is a standard ease-out (motion.definition) in a productive family (motion.roles).`,
        ["motion.definition", "motion.roles"],
      ),
    };
    easings.exit = {
      curve: "strong-out",
      description: "The exit move: a layer that closes in place.",
      ...r(
        `We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move of the productive family. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next click, because productive exits take a strong ease-out (motion.roles) and easing never springs here (motion.definition).`,
        ["motion.roles", "motion.definition"],
      ),
    };
    easings["exit-offscreen"] = {
      curve: "strong-out",
      description: "The exit move of a layer that slides off the screen: a sheet or a drawer.",
      ...r(
        `We use the strong-out easing as well for a drawer or sheet that slides off the screen, in order to keep every exit of a productive family on one fast curve. The curve does this by moving fastest at the start, so the panel clears the view with no slow tail. So the content under a closing sheet comes back at once, because only an expressive family accelerates what leaves the screen (motion.roles), and easing is a plain ease-out (motion.definition).`,
        ["motion.roles", "motion.definition"],
      ),
    };
    easings.emphasize = {
      curve: "standard",
      description: "The emphasize move: a moment that calls for attention.",
      ...r(
        `We use the standard easing for a moment that calls for attention in order to give the emphasize move no overshoot. The curve does this by stopping at its target without passing it. So a new message draws the eye by its change, not by a bounce, because the family is productive (motion.roles) and easing is a standard ease-out, never a spring (motion.definition).`,
        ["motion.roles", "motion.definition"],
      ),
    };
  } else {
    durationTokens.feedback = {
      word: sp.feedback,
      description: "Hover, press and toggle feedback. At most 500ms in an expressive family.",
      ...r(
        `We use ${val("feedback")} for hover, press and toggle feedback in order to answer each tap at once, well inside the expressive limit of 500ms. The duration does this by ending the change before the finger lifts. So ${p.who} feel the brand respond, never lag, because motion carries expression (motion.roles) and feedback feels ${sp.feedback} (motion.values).`,
        ["motion.roles", "motion.values"],
      ),
    };
    durationTokens.panels = {
      word: sp.panels,
      description: "Menus, popovers, dialogs and drawers opening. At most 500ms in an expressive family.",
      ...r(
        `We use ${val("panels")} for menus, popovers, dialogs and other panels in order to show where a panel comes from, inside the expressive limit of 500ms. The duration does this by giving the eye time to follow the panel from its trigger. So ${p.who} ${p.panels}, because the family is expressive (motion.roles) and ${p.count} (motion.count).`,
        ["motion.roles", "motion.count"],
      ),
    };
    durationTokens.exit = {
      word: sp.exit,
      description: "A layer closing: shorter than its open.",
      ...r(
        `We use ${val("exit")} for a layer that closes in order to end the exit move faster than the ${ms("panels")}ms open. The duration does this by removing what people are done with in fewer frames than it took to arrive. So ${p.who} get back to the page at once, because even an expressive family keeps exits short (motion.roles) and ${p.count} (motion.count).`,
        ["motion.roles", "motion.count"],
      ),
    };
    durationTokens.hero = {
      word: sp.hero,
      description: "Hero and launch moments. At most 500ms in an expressive family.",
      ...r(
        `We use ${val("hero")} for hero and launch moments in order to give the slowest move to the moment that matters most, inside the expressive limit of 500ms. The duration does this by holding the change long enough to be seen as an event. So every visitor sees the launch, because motion shows in hero moments (motion.lands) and the family is expressive (motion.roles).`,
        ["motion.lands", "motion.roles"],
      ),
    };
    easings.standard = {
      curve: "standard",
      description: "The transition move: a state that changes in place, such as hover, press or toggle.",
      ...r(
        `We use the standard easing (0.2, 0, 0, 1) for state changes in place in order to do the transition move without the spring. The curve does this by reaching its target early and settling, with no overshoot. So buttons and toggles feel quick and steady, and the bounce stays special, because the spring is for emphasis only (motion.definition) in an expressive family (motion.roles).`,
        ["motion.definition", "motion.roles"],
      ),
    };
    easings.enter = {
      curve: "standard",
      description: "The enter move: a layer that appears.",
      ...r(
        `We use the standard easing for a panel that appears in order to do the enter move. The curve does this by spending most of the change in the first frames, so the layer is in place before it slows. So a menu is readable almost as soon as it opens, because an expressive family keeps its spring for emphasis (motion.roles) and enters on an ease-out (motion.definition).`,
        ["motion.roles", "motion.definition"],
      ),
    };
    easings.exit = {
      curve: "strong-out",
      description: "The exit move: a layer that closes in place.",
      ...r(
        `We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next tap, because an expressive exit eases out unless the layer leaves the screen (motion.roles), and easing is set per move (motion.definition).`,
        ["motion.roles", "motion.definition"],
      ),
    };
    easings["exit-offscreen"] = {
      curve: "accelerate",
      description: "The exit move of a layer that slides off the screen: a sheet or a drawer.",
      ...r(
        `We use the accelerate easing (0.4, 0, 1, 1) for a drawer or sheet that slides off the screen in order to do the exit move of a layer that leaves the view. The curve does this by starting slow and speeding up, so the panel gathers pace on its way out. So visitors read the drawer as gone, not paused at the edge, because an expressive family accelerates only what leaves the screen (motion.roles) and easing is set per move (motion.definition).`,
        ["motion.roles", "motion.definition"],
      ),
    };
    easings.emphasize = {
      curve: "spring",
      description: "The emphasize move: a moment that calls for attention. The only move that overshoots.",
      ...r(
        `We use the spring easing (0.34, 1.56, 0.64, 1) for the emphasize move only, in order to celebrate a moment such as a sign-up that worked. The curve does this by passing its target and settling back, so the eye catches the bounce. So the brand's spring is felt where it means something, not on every menu, because easing is a spring (motion.definition) and motion carries expression (motion.roles).`,
        ["motion.definition", "motion.roles"],
      ),
    };
  }
  return { durations: sp.durations, durationTokens, easings };
}

/** The hit-area reason: 24px for a pointer, 44px for touch. */
export function hitAreaReason(id, hit) {
  const p = PEOPLE[id];
  if (hit === 24)
    return r(
      `We use a 24px hit area for controls drawn smaller, such as a 16px checkbox, in order to make a hit target at the WCAG 2.5.8 floor. The hit area does this by growing past the drawn box through a pseudo-element, while the control keeps its drawn size and rows in a group stand far enough apart that no two targets overlap. So ${p.who} hit a checkbox in a dense row with a mouse on the first try, because the smallest target is compact, for a pointer (accessibility.values), and the layout is compact (spacing.values).`,
      ["accessibility.values", "spacing.values"],
    );
  const kind = { "content-first": "touch", "accessible-first": "large", "brand-expressive": "touch", "multi-brand": "touch" }[id];
  return r(
    `We use a 44px hit area for controls drawn smaller, such as a checkbox, a radio or a switch, in order to make a hit target a fingertip can find: the WCAG 2.5.5 size. The hit area does this by growing past the drawn box through a pseudo-element, and rows in a group stand at least 44px apart, so no two targets overlap. So ${p.who} tap the right control on a phone, because targets are sized for ${kind === "large" ? "large, easy hits" : "touch"} (accessibility.values) and the layout leaves room for it (spacing.values).`,
    ["accessibility.values", "spacing.values"],
  );
}

// The dark steps of each scheme (decision 5). Raised is a step lighter than content and sunken a step
// darker. The hover band steps darker as well: raised took the lighter step, and the step above it
// fails muted text (4.5:1) in four schemes. Accessible first's two darkest gray steps are 1.07:1 apart,
// under the 1.08:1 floor for a well, so its content moves one step up to leave room below it.
const DARK = {
  "dense-data": { raised: 100, sunken: 0, highlight: 0, pressed: 0, ring: 200 },
  "content-first": { raised: 100, sunken: 0, highlight: 0, pressed: 200, ring: 200 },
  "accessible-first": { default: 100, raised: 200, sunken: 50, highlight: 50, pressed: 0, line: 300, ring: 300 },
  "brand-expressive": { raised: 100, sunken: 0, highlight: 0, pressed: 200, ring: 200 },
  "multi-brand": { raised: 100, sunken: 0, highlight: 0, pressed: 200, ring: 200 },
};

/**
 * The dark-depth picks for one scheme and mode (decision 5): each path, its value, the answers it
 * follows and, given the facts (ratio, v, step) once the values are written, its reason.
 */
export function darkReasons(id, mode, cardsRise, facts = null) {
  const p = PEOPLE[id];
  const d = DARK[id];
  const why = (f) => (facts ? f(facts) : null);
  const n2 = (x) => x.toFixed(2).replace(/0$/, "");
  const ref = (n) => `{color.neutral.${n}}`;
  const picks = {};
  if (mode === "light") {
    picks["color.border.raised"] = {
      value: "{color.neutral.200}",
      because: ["elevation.definition", "accessibility.definition"],
      why: why(
        ({ ratio, step, v }) =>
          `${step("color.border.raised")}: We use the default line's step for the edge of menus, dialogs and other raised layers, in order to give separation between a layer and what lies under it. The ring does this by a 1px line, ${n2(ratio("color.border.raised", "color.surface.raised"))}:1 on surface.raised, ${/00$/i.test(v("elevation.overlay")?.color ?? "00") ? "the layer's only edge, as nothing here casts a shadow" : "beside the light shadow that does most of the lift"}. So ${p.who} see where a menu ends on any page, because raised layers keep an edge (elevation.definition) and a decorative line has no contrast floor (accessibility.definition).`,
      ),
    };
    return { picks };
  }
  if (d.default !== undefined)
    picks["color.surface.default"] = {
      value: ref(d.default),
      because: ["theming.values", "accessibility.definition", "elevation.definition"],
      why: why(
        ({ ratio, step }) =>
          `${step("color.surface.default")}: We use the step above the page for content in dark in order to leave a darker step free for wells, as the gray's two darkest steps are too close to tell apart. The fill does this by moving content one step up: sunken reads ${n2(ratio("color.surface.sunken", "color.surface.default"))}:1 below it and raised ${n2(ratio("color.surface.raised", "color.surface.default"))}:1 above it. So ${p.who} tell wells and menus from content, and body text still reads ${n2(ratio("color.text.primary", "color.surface.default"))}:1, because dark ships as standard (theming.values), text keeps the AAA floor (accessibility.definition) and depth reads from tone and lines (elevation.definition).`,
      ),
    };
  if (d.line !== undefined)
    picks["color.border.default"] = {
      value: ref(d.line),
      because: ["elevation.definition", "theming.values"],
      why: why(
        ({ ratio, step }) =>
          `${step("color.border.default")}: We use the step above the raised surface for dividers and card borders in dark in order to give separation on every surface a line meets, menus included. The line does this by staying lighter than each surface, lowest ${n2(Math.min(...["color.surface.canvas", "color.surface.default", "color.surface.raised"].map((x) => ratio("color.border.default", x))))}:1, on surface.raised. So rows and cards stay apart on content and in menus, because lines separate groups (elevation.definition) and dark ships as standard (theming.values).`,
      ),
    };
  picks["color.surface.raised"] = {
    value: ref(d.raised),
    because: ["theming.values", "elevation.roles", "elevation.definition"],
    why: why(
      ({ ratio, step }) =>
        `${step("color.surface.raised")}: We use one step lighter than content for menus, dialogs${cardsRise ? " and raised cards" : ""} in dark, in order to show height by tone, ${n2(ratio("color.surface.raised", "color.surface.default"))}:1 on surface.default. The lighter fill does this by the dark-mode depth rule: the higher a layer sits, the lighter its surface. So ${p.who} see a menu above the page even where its shadow barely shows, because dark ships as standard (theming.values) and the roles answer names the layers that rise (elevation.roles).`,
    ),
  };
  picks["color.surface.sunken"] = {
    value: ref(d.sunken),
    because: ["theming.values", "elevation.definition"],
    why: why(
      ({ ratio, step }) =>
        `${step("color.surface.sunken")}: We use one step darker than content for table headers and wells in dark, in order to show depth by tone, ${n2(ratio("color.surface.sunken", "color.surface.default"))}:1 on surface.default. The darker fill does this by the depth rule turned downward: what sits lower is darker. So a well reads as recessed and never as a raised card, because dark ships as standard (theming.values) and depth reads from tone and lines (elevation.definition).`,
    ),
  };
  picks["color.surface.highlight"] = {
    value: ref(d.highlight),
    because: ["accessibility.roles", "color.definition", "theming.values"],
    why: why(
      ({ ratio, step }) =>
        `${step("color.surface.highlight")}: We use a step darker than content for the item under the pointer or the keyboard in dark, in order to mark it as a band on both surfaces it meets: ${n2(ratio("color.surface.highlight", "color.surface.default"))}:1 on surface.default and ${n2(ratio("color.surface.highlight", "color.surface.raised"))}:1 on surface.raised. The fill does this by stepping darker, as raised layers took the lighter step; muted text still reads ${n2(ratio("color.text.muted", "color.surface.highlight"))}:1 on it. So the hovered row or menu item shows on cards and menus alike, because hover and focus have their own look (accessibility.roles) and the neutral ramp sets the steps (color.definition).`,
    ),
  };
  const pressedWhy = {
    "dense-data": ({ step }) =>
      `${step("color.surface.pressed")}: We use the highlight's step for a pressed item in dark in order to keep press and hover one state. The fill does this by staying where the hover put it. So experts get one plain signal and nothing more to learn, because the states are hover, focus and disabled, with no pressed look of its own (accessibility.roles), and the neutral ramp sets the steps (color.definition).`,
    "accessible-first": ({ ratio, step }) =>
      `${step("color.surface.pressed")}: We use the darkest step for a pressed item in dark in order to show a press as a change of its own, one step past the hover band. The fill does this by stepping further from the surfaces, ${n2(ratio("color.surface.pressed", "color.surface.highlight"))}:1 from the highlight. So a press reads under the finger, because every state, loading included, gets its own value (accessibility.roles) and the neutral ramp sets the steps (color.definition).`,
  }[id];
  picks["color.surface.pressed"] = {
    value: ref(d.pressed),
    because: ["accessibility.roles", "color.definition"],
    why: why(
      pressedWhy ??
        (({ ratio, step }) =>
          `${step("color.surface.pressed")}: We use the step above the raised surface for a pressed item in dark in order to show a press as a change of its own. The fill does this by stepping lighter while the hover band steps darker, ${n2(ratio("color.surface.pressed", "color.surface.highlight"))}:1 from the highlight, so press and hover never match. So a tap reads under the finger, because pressed has its own look for touch (accessibility.roles) and the neutral ramp sets the steps (color.definition).`),
    ),
  };
  picks["color.border.raised"] = {
    value: ref(d.ring),
    because: ["theming.values", "elevation.definition", "accessibility.definition"],
    why: why(
      ({ ratio, step, v }) =>
        `${step("color.border.raised")}: We use the step above the raised surface for a 1px ring around raised layers in dark, in order to give separation where a shadow barely shows. The ring does this by a solid, lighter line, ${n2(ratio("color.border.raised", "color.surface.raised"))}:1 on surface.raised (${v("color.border.raised")}, no alpha), so its contrast can be checked. So ${p.who} see a dark menu's edge on any page, because dark ships as standard (theming.values), raised layers keep an edge (elevation.definition) and a decorative line has no contrast floor (accessibility.definition).`,
    ),
  };
  if (cardsRise)
    picks["elevation.card"] = {
      type: "shadow",
      value: "{shadow.none}",
      because: ["theming.values", "elevation.roles"],
      why: why(
        () =>
          `shadow.none: We use no shadow for cards in dark in order to keep shadows on floating layers only: menus, popovers, dialogs, toasts and tooltips. The missing shade does this by leaving the card's height to tone: the lighter raised surface and its 1px light ring. So cards still read as lifted on a dark page, without a shade that cannot be seen, because dark ships as standard (theming.values) and cards rise by shadow in light (elevation.roles).`,
      ),
    };
  return { picks };
}

/** Dense data keeps 12px text (decision 7): the reasons say why, with the x-height of its face. */
export function typeReasons(id) {
  if (id !== "dense-data") return {};
  return {
    "type.label.font-size": r(
      "We use 12px for column headers and field labels in order to keep labels at the smallest legible step: experts scan many records at a short reading distance. The size does this by keeping IBM Plex Sans's x-height at 6.2px (0.516 of the em); at 11px it would drop to 5.7px. So a header repeats on every column without competing with the data, and still reads, because people scan and compare records (tasks.q1) and the type scale is small (typography.values).",
      ["tasks.q1", "typography.values"],
    ),
    "type.caption.font-size": r(
      "We use 12px for timestamps and hints in order to let secondary text step back without going under the smallest legible size, the same floor as labels. The caption size does this by holding the lowercase letters of IBM Plex Sans at a 6.2px x-height, open enough to tell a 6 from a b at a glance. So experts read a timestamp across many rows while the values stay the hero, because the brand is quiet (brand.q2) and the content is numbers (content.q1).",
      ["brand.q2", "content.q1"],
    ),
  };
}

// The usage rules that named opacity for disabled, a border width for the focus ring, the spring on
// every move, or a reduced motion that removed fades too.
const DISABLED_USE = "color.disabled.*, never opacity";
const REDUCED_USE = "Fades only; nothing moves";
export const USAGE = {
  "dense-data": {
    "reduced-motion": { use: REDUCED_USE, why: "Movement stops when people ask for less motion. A short fade still confirms a change without moving anything." },
    "unavailable-control": { use: DISABLED_USE, why: "Muted colors keep a disabled control in its place and its label readable. Experts keep their bearings and see the action will come back." },
    "keyboard-focus": { use: "button/focus-ring at focus.ring.width" },
    "focus-gap": { use: "focus.ring.offset" },
  },
  "content-first": {
    "reduced-motion": { use: REDUCED_USE, why: "Nothing slides or zooms for people who asked for less motion. A short fade keeps the change visible to the reader." },
    "unavailable-control": { use: DISABLED_USE, why: "Muted colors keep the control in place and its label readable. Hiding it would move the page and lose the reader's place." },
    "keyboard-focus": { use: "button/focus-ring at focus.ring.width" },
    "focus-gap": { use: "focus.ring.offset" },
  },
  "accessible-first": {
    "reduced-motion": { use: REDUCED_USE, why: "Movement can make some people dizzy, so it stops. A short fade or a color change still shows that something changed." },
    "unavailable-control": { use: DISABLED_USE, why: "Muted colors keep the label readable, where a fade would drop its contrast. A hint says what is missing and the next step." },
    "keyboard-focus": { use: "button/focus-ring at focus.ring.width, with an offset" },
    "focus-gap": { use: "focus.ring.offset" },
  },
  "brand-expressive": {
    "reduced-motion": { use: REDUCED_USE },
    "unavailable-control": { use: DISABLED_USE, why: "Muted colors keep the layout and the label readable. The vivid color returns when the visitor can sign up." },
    "keyboard-focus": { use: "button/focus-ring at focus.ring.width" },
    "focus-gap": { use: "focus.ring.offset" },
    "hover-feedback": { why: "Fast feedback on an ease-out. The brand's spring waits for the moments that deserve it." },
    "panel-opens": { why: "Panels open on an ease-out at a moderate speed, so menus feel quick and the brand shows in its big moments." },
    "any-transition": { use: "motion.easing.standard", why: "An ease-out keeps every menu and button quick. The overshoot is kept for emphasis, where it feels alive and playful." },
    card: { use: "elevation.card (pronounced); none in dark", why: "Cards float to feel tactile. In dark a shade cannot be seen, so a lighter surface and a light ring lift them." },
  },
  "multi-brand": {
    "reduced-motion": { use: REDUCED_USE },
    "unavailable-control": { use: DISABLED_USE, why: "One set of muted colors works under every brand, and the label stays readable where a fade would lose it." },
    "keyboard-focus": { use: "button/focus-ring (from the brand) at focus.ring.width" },
    "focus-gap": { use: "focus.ring.offset" },
    card: { use: "elevation.card; none in dark", why: "Cards lift slightly to group offers. In dark, tone and a ring do the lift, the same in every brand." },
  },
};
