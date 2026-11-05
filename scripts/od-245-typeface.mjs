// OD-245: the typeface is a decision. brand.q3 asks which typefaces carry the product and why, and
// lists what a typeface decision must consider. Every scheme answers it, and its answer says how its
// faces meet each consideration, so the font picks have a reason to quote. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);

const CONSIDERS = [
  { id: "readability", group: "Reading", label: "Readability", ask: "Does long text read easily at body size: open shapes, a comfortable x-height, even spacing?" },
  { id: "legibility", group: "Reading", label: "Legibility", ask: "Can people tell confusable characters apart, such as I, l and 1, or 0 and O, in data, codes and IDs?" },
  { id: "scalability", group: "Range", label: "Scalability", ask: "Does it hold from the smallest caption to display, with a weight or an optical size for every role in the scale?" },
  { id: "numerals", group: "Range", label: "Numerals", ask: "Do numbers read clearly and line up in tables?" },
  { id: "scripts", group: "Range", label: "Scripts and languages", ask: "Does it cover every language the product ships, and what fills the gaps?" },
  { id: "recognition", group: "Brand", label: "Recognition", ask: "Do people know the product by its type?" },
  { id: "familiarity", group: "Brand", label: "Familiarity", ask: "Does it feel known and trusted to its audience, not strange?" },
  { id: "personality", group: "Brand", label: "Personality", ask: "Does it sound like the voice the brand answers ask for?" },
  { id: "performance", group: "Delivery", label: "Performance", ask: "How many families and files load, and is that in proportion?" },
  { id: "licensing", group: "Delivery", label: "Licensing", ask: "Is it free to embed in apps and on the web, or what does it cost?" },
  { id: "fallback", group: "Delivery", label: "Fallback and pairing", ask: "What shows before it loads or where it can't, and which face pairs with it?" },
];

const OPTIONS = [
  { id: "grotesque-mono", label: "A neutral grotesque, with a monospace for data", description: "For products where numbers and records are the content." },
  { id: "serif-sans", label: "A reading serif, with a sans for the interface", description: "For long-form reading; the interface steps back." },
  { id: "hyperlegible", label: "One face drawn for legibility", description: "For products where nobody may be left out." },
  { id: "display-text", label: "A display face for brand moments, with a sans for text", description: "For brands that lead with type." },
  { id: "per-brand", label: "Each brand brings its own face, on one shared scale", description: "For several brands on one system." },
];

const ANSWERS = {
  "dense-data": {
    option: "grotesque-mono",
    why: "IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero.",
    because: ["brand.q1", "brand.q2", "content.q1"],
    considers: {
      readability: "Plex Sans is a neutral grotesque with open shapes, made for screens; it reads at the small body size dense rows need.",
      legibility: "Data, codes and IDs sit in Plex Mono, where each character holds its own fixed cell, so they read character by character.",
      scalability: "Plex ships a full range of weights, so every role in the type scale has its own weight without a second sans.",
      numerals: "Digits in Plex Mono are all one width, so columns of numbers line up.",
      scripts: "Plex Sans covers Latin, Cyrillic and Greek; Hebrew, Arabic and other scripts come as sister families of IBM Plex, drawn to match.",
      recognition: "One family with a matching mono gives the product an engineered, consistent voice.",
      familiarity: "A grotesque reads as standard and trusted in operations tools.",
      personality: "Precise, as the brand answer asks, and quiet, so the brand steps back.",
      performance: "Two families; load only the weights the scale uses.",
      licensing: "SIL Open Font License: free to embed in apps and on the web.",
      fallback: "Falls back to system-ui and ui-monospace, as its tokens say; Plex Mono is its own pair.",
    },
  },
  "content-first": {
    option: "serif-sans",
    why: "Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface.",
    because: ["brand.q1", "brand.q2", "content.q1"],
    considers: {
      readability: "Source Serif 4 is a reading serif made for long text; its optical sizes keep body text open and even.",
      legibility: "Labels and captions sit in Inter, a sans with a tall x-height that stays clear at small sizes.",
      scalability: "Source Serif 4's optical sizes adjust the design from caption to display, so one family spans the scale.",
      numerals: "Data is rare here; numbers sit in the reading serif, set in running text rather than tables.",
      scripts: "Both cover Latin, Cyrillic and Greek; Hebrew and Arabic need another face, chosen to match.",
      recognition: "The brand shows in type, not in color, so the serif is the brand.",
      familiarity: "Serif text reads like a book or an article, which long-form readers know.",
      personality: "Warm and considered, as the brand answer asks.",
      performance: "Two variable families, one file each.",
      licensing: "SIL Open Font License, both: free to embed in apps and on the web.",
      fallback: "Falls back to Georgia and system-ui, as its tokens say; Inter is the serif's interface pair.",
    },
  },
  "accessible-first": {
    option: "hyperlegible",
    why: "Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out.",
    because: ["brand.q1", "people.q2", "content.q1"],
    considers: {
      readability: "Atkinson Hyperlegible was designed by the Braille Institute for readers with low vision.",
      legibility: "Its letters are drawn to stay apart: I, l and 1, 0 and O, b and d don't look alike.",
      scalability: "Regular and bold carry the hierarchy; size does the rest, so every role stays readable.",
      numerals: "Its digits are drawn to be told apart; figures line up when columns align to the right.",
      scripts: "Latin, with accents for many languages; other scripts need a face chosen for the same legibility.",
      recognition: "Accessibility is the brand promise, and the face says it.",
      familiarity: "A plain, open sans feels familiar and calm in forms and steps.",
      personality: "Calm and clear, never clever, as the brand answer asks.",
      performance: "One family, two weights: the lightest load of all five schemes.",
      licensing: "SIL Open Font License: free to embed in apps and on the web.",
      fallback: "Falls back to Verdana, a wide, legible system face, as its token says; no second face is needed.",
    },
  },
  "brand-expressive": {
    option: "display-text",
    why: "Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read.",
    because: ["brand.q1", "brand.q2", "content.q1"],
    considers: {
      readability: "Body text sits in DM Sans, a low-contrast sans that reads easily in short copy.",
      legibility: "DM Sans keeps simple, open shapes at small sizes; the display face never sets small text.",
      scalability: "Both are variable: Bricolage Grotesque has optical size, width and weight axes, and DM Sans optical size and weight.",
      numerals: "Numbers are few and set in DM Sans, in short copy rather than tables.",
      scripts: "Latin, with accents; other scripts need faces chosen for the same voice.",
      recognition: "Bricolage Grotesque's character is the brand's: people know it by its headlines.",
      familiarity: "DM Sans for text keeps reading familiar while the display face takes the risks.",
      personality: "Bold and confident, as the brand answer asks.",
      performance: "Two variable families, one file each.",
      licensing: "SIL Open Font License, both: free to embed in apps and on the web.",
      fallback: "Falls back to system-ui, as its tokens say; DM Sans is the display face's text pair.",
    },
  },
  "multi-brand": {
    option: "per-brand",
    why: "Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one.",
    because: ["business.q2", "brand.q1", "brand.q2"],
    considers: {
      readability: "All three are screen sans faces with open shapes; the shared scale keeps body size and line height the same in every brand.",
      legibility: "Each brand checks its face's confusable characters in its own data; the scale gives every brand the same sizes to check at.",
      scalability: "All three have a wide range of weights, so every role in the shared scale has a weight in every brand.",
      numerals: "Inter has tabular figures; the brands that show tables lean on it.",
      scripts: "Latin, with accents, in all three; Poppins also covers Devanagari. Other scripts need a face per brand.",
      recognition: "The face is how each brand is known on a shared system.",
      familiarity: "Inter, Plus Jakarta Sans and Poppins are widely seen on the web, so none feels strange.",
      personality: "A neutral base each brand can color: the face carries the brand, the scale stays neutral.",
      performance: "One family per brand: a page loads only its own brand's face.",
      licensing: "SIL Open Font License, all three: free to embed in apps and on the web.",
      fallback: "Each falls back to system-ui, as its tokens say; the shared scale keeps the layout steady while a face loads.",
    },
  },
};

// Grammar: the question and what it considers.
const g = read("schemes/grammar.json");
const brand = g.reasons.find((r) => r.id === "brand");
if (!brand.questions.some((q) => q.id === "brand.q3"))
  brand.questions.push({
    id: "brand.q3",
    text: "Which typefaces carry the product, and why?",
    description: "The faces for every text role, and how they meet what a typeface decision must consider: reading, range, brand and delivery.",
    options: OPTIONS,
    considers: CONSIDERS,
  });
write("schemes/grammar.json", g);

for (const [id, a] of Object.entries(ANSWERS)) {
  const s = read(`schemes/${id}.json`);
  s.answers = s.answers.filter((x) => x.question !== "brand.q3");
  const at = s.answers.findIndex((x) => x.question === "brand.q2") + 1;
  s.answers.splice(at, 0, { question: "brand.q3", ...a });
  write(`schemes/${id}.json`, s);
}
console.log("brand.q3: the typeface question, with 11 considerations, answered in 5 schemes.");
