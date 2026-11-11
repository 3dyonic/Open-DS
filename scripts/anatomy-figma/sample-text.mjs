// The text an anatomy drawing shows, from the scheme's own samples (OD-135). A text node names a
// sample path, so each scheme's drawing says what its Storybook says.
//
// A path is keys and list positions split by dots: "metrics.0.label". In a path:
//   -1                the last item of a list ("table.columns.-1.label").
//   key=value         the items of a list whose key is that value ("statuses.meaning=info.0.label").
//   key!=value        the items whose key is not that value ("conversation.messages.mine!=true.1.text").
// A path that ends on a list of words joins them with " · " ("table.rows.0.cells").
// A node's sample may be a list of paths: their texts join with " · " (an author and a time).
// "initials": true shows the first letters of the first two words, as Storybook's avatars do.
// "absent" is the text when the scheme has nothing at the path: a badge tone the scheme leaves out.
// "fixed" keeps the node's own text, with the reason: a key cap, a day number, a state caption.

export const JOIN = " · ";

/** The value at one path in the samples, or undefined. */
export function atPath(samples, path) {
  let node = samples;
  for (const key of path.split(".")) {
    if (node === undefined || node === null) return undefined;
    const filter = Array.isArray(node) && key.match(/^([a-z_]+)(!?=)(.+)$/);
    if (filter) {
      const [, field, op, want] = filter;
      node = node.filter(
        (item) => (String(item?.[field]) === want) === (op === "="),
      );
    } else if (Array.isArray(node) && /^-?\d+$/.test(key))
      node = node.at(Number(key));
    else node = node[key];
  }
  if (
    Array.isArray(node) &&
    node.length &&
    node.every((x) => typeof x === "string")
  )
    return node.join(JOIN);
  return node;
}

const initials = (text) =>
  text
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * The text a node shows in a scheme: { text } when every path resolves, { missing } with the paths that
 * do not. A node without a sample keeps its own text.
 */
export function sampleText(node, samples) {
  if (!node.sample) return { text: node.text };
  const paths = [].concat(node.sample);
  const values = paths.map((p) => atPath(samples, p));
  const missing = paths.filter((_, i) => typeof values[i] !== "string");
  if (missing.length)
    return typeof node.absent === "string"
      ? { text: node.absent }
      : { missing };
  const text = values.join(JOIN);
  return { text: node.initials ? initials(text) : text };
}

/** Every text node in a parts layer: the drawing and each card's own drawing. */
export function textNodes(anatomy) {
  const out = [];
  const walk = (n) => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n.t === "text") out.push(n);
    for (const v of Object.values(n)) if (v && typeof v === "object") walk(v);
  };
  walk(anatomy.drawing);
  for (const c of anatomy.cards ?? []) walk(c.image);
  return out;
}
