# The anatomy generator

A component's Anatomy reference is drawn from its parts layer (`anatomy` on the catalogue item in
`schemes/grammar.json`). The drawing is data, not code: a tree of nodes whose every color, size, corner
and spacing names a token. The renderer binds each one to the scheme's Figma kit variable, so when a
decision changes, the drawing follows.

- `build.mjs <component> [scheme]` prints one script for the Figma MCP (`use_figma`).
- `../figma-anatomy.mjs all` writes `figma/anatomy-plugin`, the plugin that draws every component.
- `dry-run.mjs <component> [scheme]` draws in a stand-in for Figma and lists problems. Run it on every
  drawing you write; it must print `"problems": []` and `"fallback": {}`.
- `ANATOMY_LAYERS=<dir>` reads `anatomy-<component>.json` files from `<dir>` before the grammar (drafts).

## The tree drawing

```json
"drawing": { "kind": "tree", "stage": NODE }
```

The stage is the whole component. Each card draws the stage again with only its own numbers shown, or
its own tree: `"image": { "tree": NODE }` on the card (use it when the part needs a state the stage
doesn't show, or is lost in the whole).

A card's image is cropped to its own parts (OD-248): the box around its numbered parts and their
numbers, with the padding the scheme puts inside a card (`space.inset.container`) as margin. When a part needs a
neighbor to make sense (the button beside a focused one, the row above a selected one), the card says
so: `"image": { "context": [n, …] }` frames those parts with it without numbering them. Choose
context per card; nothing adds it on its own.

A NODE:

| Key | Value |
| --- | --- |
| `t` | `frame` (auto layout), `text`, `icon`, `rect`, `ellipse` |
| `name` | layer name (what the part is) |
| `n` | the part number this node shows (or a list); `at`: `top` (default), `right`, `corner`, `shadow` |
| `marks` | more numbers on the same node, each with its place: `[[1, "corner"], [3, "shadow"]]` |
| `layout` | frames: `row` (default), `col`, `none` (children placed with `abs: [x, y]`) |
| `gap`, `pad`, `padX`, `padY`, `padT`, `padB`, `padL`, `padR`, `minH`, `minW` | spacing; `pad` may be `[y, x]`; one side wins over the axis |
| `w`, `h` | a size, or `fill` (stretch in the parent), or `hug` |
| `grow` | `true`: take the free space along the parent's direction |
| `align` | cross axis: `center` (default), `start`, `end`; `justify`: `start`, `center`, `end`, `between` |
| `fill`, `stroke`, `strokeW`, `sides`, `dash` | colors and border; `sides` limits the border, e.g. `["bottom"]`; `dash`: `[4, 2]` |
| `radius`, `corners`, `shadow`, `opacity`, `clip` | corner (`corners` limits it: `["tl", "tr"]`), elevation token, opacity, clip children |
| `ring` | focus ring around the node: `{ "color", "width", "offset", "radius", "fill", "n" }`; `fill` is the gap's color; a ringed node with `w: "fill"` stretches with its ring |
| `size`, `color`, `weight`, `lh`, `font`, `align` | text nodes; `weight` is a weight token or `"bold"`; `lh` a line-height token |
| `sample`, `initials`, `absent` | what a text node shows: a path in the scheme's samples (`"card.title"`), or a list of paths joined with " · "; `initials: true` shows the first letters; `absent` is the text when a scheme has nothing at the path. `sample-text.mjs` has the path rules |
| `text`, `fixed` | a text that is not scheme content (a key cap, a day number) keeps its `text` and says why in `fixed` |
| `icon`, `size`, `color` | icon nodes: a Lucide icon name (as in `lucide-react`, kebab case) |
| `children` | the nodes inside |

Every value that is a string (other than names, text, icon names and the words above) is a token path:
a component key (`component.button.height`) or a semantic (`color.text.muted`, `space.gap.tight`).
Plain numbers are allowed only where no decision exists for the value (a sample width, say); prefer a
token. Never write a hex color. Read the component's own keys first (`schemes/dense-data.json`,
`tokens.component.<id>`); the keys the parts layer lists on each part are the ones to draw with.
