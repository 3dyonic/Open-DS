// OD-294: the type sizes now come from each scheme's ratio. This writes the reasons whose numbers
// moved, and says how each size relates to body and to its siblings. Run once after
// node scripts/type-scale.mjs.
import { loadScheme, saveScheme } from "../cli/src/schemes.mjs";

// [role, key]: why, or [why, because] when the answers it cites change too.
const REASONS = {
  "dense-data": {
    "display.font-size": "24px is three ratio steps above the 14px body (14 × 1.2^3), the top of the scale, kept for the one key number on a dashboard. Everything below it stays small.",
    "title.font-size": "20px is two ratio steps above body and one under the 24px display, so page titles stay small and the table starts higher on the screen.",
    "heading.font-size": "17px sits one ratio step above the 14px body (14 × 1.2). Panel and card headings name a block without taking rows from the data.",
    "body.font-size": "14px is the small body size and step 0 of the scale: every other role is a 1.2 ratio step from it, and more rows fit on the screen.",
    "label.font-size": "12px sits one ratio step under body (14 ÷ 1.2), on the caption's step. Column headers repeat on every column, so a large style would compete with the data.",
    "caption.font-size": "12px, one ratio step under body and the same step as label, lets timestamps and hints step back, so the values stay the hero.",
    "data.font-size": [
      "14px shares step 0 with body, so Plex Mono values read at the body size. The scale has no step between the 12px labels and 14px.",
      ["typography.roles", "typography.count", "brand.q3"],
    ],
    "data.line-height": "1.45, the open step for data, gives 14px cells a 20.3px line. The eye keeps its row while it scans a long table.",
    "heading.font-weight": "600 separates a 17px heading from the 14px body by weight, because the two sit only one ratio step apart.",
  },
  "content-first": {
    "display.font-size": "45px is eight fine steps above the 18px body (18 × 1.12^8), two steps over the 36px title, kept for the landing moment and the lead that opens an article.",
    "title.font-size": "36px is six fine steps above body and two under the 45px display, so article titles stay large but calm.",
    "heading.font-size": "28px is four fine steps above the 18px body and two under the 36px title, so readers find their place in a long guide.",
    "body.font-size": "18px is the large reading size and step 0 of the scale: every other role is a 1.12 ratio step from it, so long articles stay easy on the eyes.",
    "label.font-size": "16px sets Inter labels one step under the 18px body (18 ÷ 1.12), still large enough for a field label people must read.",
    "caption.font-size": "14px is two steps under the 18px body and one under the 16px label, for Inter captions that sit quietly under the text.",
    "data.font-size": "18px shares step 0 with body, because numbers sit in running text rather than table columns, so data reads at the reading size.",
    "display.line-height": "1.15 sets 45px display text on about 52px lines, so a two-line opener reads as one tight block.",
    "label.line-height": [
      "1.15, the tight ratio of the headings, gives a 16px label about 18px lines, because a label names a field on one line and never runs as a paragraph.",
      ["typography.definition", "brand.q3"],
    ],
    "caption.line-height": [
      "1.65, the open ratio of body, sets a 14px caption on about 23px lines, because a caption under a figure or a quote wraps like body text.",
      ["typography.definition", "content.q1"],
    ],
  },
  "accessible-first": {
    "display.font-size": "Display is 35px, three ratio steps above the 19px body (19 × 1.22^3), kept off page titles: it changes from page to page and pushes the content down.",
    "title.font-size": "Title is 28px, two ratio steps above body and one clear step under display, the same on every page, so people always know where they are.",
    "heading.font-size": "Heading is 23px, one ratio step above the 19px body and one under the 28px title, so a section inside a form step stands out.",
    "body.font-size": "Body is 19px, step 0 of the scale and one ratio step above the 16px caption, because large text is readable for more people.",
    "label.font-size": "Label shares step 0 with body at 19px, because form labels and hints are where type matters most; weight, not size, sets it apart.",
    "caption.font-size": "Caption is one ratio step under body (19 ÷ 1.22), 16px, exactly 1rem: even secondary text never drops below the reader's own default size.",
    "data.font-size": "Data shares step 0 with body at 19px, not a small or mono size, because every number must be readable at large size.",
    "display.line-height": "Display lines are 1.25 times its 35px size, about 44px; as a ratio, the line height grows with the text when people zoom.",
    "heading.line-height": "Heading lines are 1.25 times its 23px size, about 29px: the smallest role on the tight ratio, while text from 19px down takes 1.6.",
    "label.line-height": "Label lines are 1.6 times its 19px size, 30.4px, so a label that wraps above its field keeps the open spacing of body.",
    "display.font-weight": "Display is bold, 700, one of the two weights the scheme loads; bold and the 35px size together mark the top of the page.",
    "heading.font-weight": "Heading is bold, 700: at 23px it sits only one ratio step above body, so weight, not size alone, sets it apart.",
    "label.font-weight": "Label is bold, 700: at 19px it shares the body size, so bold marks it as the field's always visible label.",
  },
  "brand-expressive": {
    "display.font-size": "Display sets 56px, eleven fine steps above the 17px body (17 × 1.114^11), the top of the scale, because every hero opens with one big idea in the brand's loudest voice.",
    "title.font-size": "Title sets 40px, eight steps above body and three under display, so the sign-up form's title stays big and keeps the form in view on a phone.",
    "heading.font-size": "Heading sets 29px, five steps above body and three under the 40px title, the smallest headline step, so it carries the display face into cards and dialogs.",
    "body.font-size": "Body sets 17px in DM Sans, step 0 of the scale, so short punchy copy reads easily on the phones visitors arrive on.",
    "label.font-size": "Label sets 15px, one step under body and one over the 14px caption, so field labels stay readable on vivid color.",
    "caption.font-size": "Caption sets 14px, two steps under the 17px body, the smallest step, so fine print stays small and headlines keep the attention that wins sign-ups.",
    "data.font-size": "Data shares step 0 with body at 17px, because tables are rare and short, so cells read like the rest of the page.",
  },
  "multi-brand": {
    "display.font-size": "32px is three ratio steps above the 16px body (16 × 1.26^3), the top of the shared scale, for the product-page headline where each brand speaks loudest.",
    "title.font-size": "25px titles each sign-up and account page: two ratio steps above body and one under the 32px headline, because forms carry most text here.",
    "heading.font-size": "20px heads the sections inside a page: one ratio step above the 16px body and one under the 25px title.",
    "body.font-size": "16px is the regular body size and step 0 of the shared scale; every brand face sets product and form text at it.",
    "label.font-size": "13px names every field, one ratio step under the 16px text inside it (16 ÷ 1.26), so the label and the entry stay apart.",
    "caption.font-size": "13px, the smallest size, holds fees, dates and hints on the label's step, one ratio step under the 16px body.",
    "data.font-size": "16px shares step 0 with body: plan and order tables hold prices in sentences and offers, not columns of figures to compare.",
    "title.line-height": "1.2 keeps a 25px page title tight above its form, so a title that wraps still reads as one title.",
    "label.line-height": "1.2 keeps a 13px field label one tight line, directly above its input in sign-up and checkout forms.",
    "heading.font-weight": "600 matches the page title, so size alone ranks a 20px section heading under the 25px title in every brand.",
    "label.font-weight": "600 keeps a 13px field label readable in every brand face and sets it apart from the 400 caption on the same step.",
  },
};

for (const [id, reasons] of Object.entries(REASONS)) {
  const s = loadScheme(id);
  for (const [path, reason] of Object.entries(reasons)) {
    const [role, key] = path.split(".");
    const token = s.tokens.semantic.type[role]?.[key];
    if (!token) throw new Error(`${id}: no type.${path}. Check the role and key names.`);
    const [why, because] = Array.isArray(reason) ? reason : [reason, null];
    const ext = token.$extensions["open-ds"];
    ext.why = why;
    if (because) ext.because = because;
  }
  saveScheme(s);
}
console.log("Wrote the OD-294 type reasons.");
