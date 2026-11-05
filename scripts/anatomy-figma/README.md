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

A NODE:

| Key | Value |
| --- | --- |
| `t` | `frame` (auto layout), `text`, `icon`, `rect`, `ellipse` |
| `name` | layer name (what the part is) |
| `n` | the part number this node shows (or a list); `at`: `top` (default), `right`, `corner`, `shadow` |
| `layout` | frames: `row` (default), `col`, `none` (children placed with `abs: [x, y]`) |
| `gap`, `pad`, `padX`, `padY`, `minH`, `minW` | spacing; `pad` may be `[y, x]` |
| `w`, `h` | a size, or `fill` (stretch in the parent), or `hug` |
| `grow` | `true`: take the free space along the parent's direction |
| `align` | cross axis: `center` (default), `start`, `end`; `justify`: `start`, `center`, `end`, `between` |
| `fill`, `stroke`, `strokeW`, `sides` | colors and border; `sides` limits the border, e.g. `["bottom"]` |
| `radius`, `shadow`, `opacity`, `clip` | corner, elevation token, opacity, clip children |
| `ring` | focus ring around the node: `{ "color", "width", "offset", "radius", "n" }` |
| `text`, `size`, `color`, `weight`, `lh`, `font`, `align` | text nodes; `weight` is a weight token or `"bold"`; `lh` a line-height token |
| `icon`, `size`, `color` | icon nodes: a Lucide icon name (as in `lucide-react`, kebab case) |
| `children` | the nodes inside |

Every value that is a string (other than names, text, icon names and the words above) is a token path:
a component key (`component.button.height`) or a semantic (`color.text.muted`, `space.gap.tight`).
Plain numbers are allowed only where no decision exists for the value (a sample width, say); prefer a
token. Never write a hex color. Read the component's own keys first (`schemes/dense-data.json`,
`tokens.component.<id>`); the keys the parts layer lists on each part are the ones to draw with.
