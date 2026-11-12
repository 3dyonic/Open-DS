// A scheme stores the type and spacing decisions, not the values they generate (OD-301). The type
// group stores its scale; withTypeAndSpace fills each role's font size and line height, and the font
// size, line height and line box options. The space group stores its spacing record and the size group
// its control scale; withTypeAndSpace fills the gaps, insets, control heights and the row, and adds any
// space or size option they need. The spacing.definition answer sets the space base. withoutTypeAndSpace takes out each value that equals its generated
// value. No file access, so the loader, the build and the bundled apps (Storybook, the site) share it.
import { baseOf, controlTokens, spaceTokens } from "./spacing-use-cases.mjs";
import { typeTokens } from "./type-scale.mjs";

const recordOf = (group) => group?.$extensions?.["open-ds"];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const at = (tree, path) => path.split(".").reduce((node, k) => node?.[k], tree);
const isMeta = (k) => k.startsWith("$");
const rem = (px) => `${px / 16}rem`;

const GROUP_DESCRIPTIONS = {
  "line-height": "Line height options: ratios of the text size. The type scale generates them.",
  "line-box": "Line box options: one line's height, in rem. The type scale generates them.",
};

/** The records a scheme keeps: { type, space, size }, each the record or null. */
export function recordsOf(scheme) {
  const semantic = scheme?.tokens?.semantic ?? {};
  const type = recordOf(semantic.type);
  const space = recordOf(semantic.space);
  const size = recordOf(semantic.size);
  return {
    type: type?.steps && type?.rounding ? type : null,
    space: space?.["use-cases"] ? space : null,
    size: size?.steps ? size : null,
  };
}

/**
 * Every value the records generate: [{ path, token }], path from the scheme's tokens root. The font
 * option groups come whole, as { path, group }.
 */
export function generatedValues(scheme) {
  const { type, space, size } = recordsOf(scheme);
  const base = baseOf((scheme.answers ?? []).find((a) => a.question === "spacing.definition")?.option);
  const out = [];
  if (type) {
    const { roles, primitives } = typeTokens(type);
    for (const [role, keys] of Object.entries(roles))
      for (const [key, token] of Object.entries(keys)) out.push({ path: `semantic.type.${role}.${key}`, token });
    for (const [name, group] of Object.entries(primitives)) out.push({ path: `primitive.font.${name}`, group });
  }
  // With no base (no spacing.definition answer), the gaps stay as stored, and the spacing rule says why.
  if (space && base) for (const [path, token] of Object.entries(spaceTokens(space, base))) out.push({ path: `semantic.space.${path}`, token });
  if (size) for (const [path, token] of Object.entries(controlTokens(size))) out.push({ path: `semantic.size.${path}`, token });
  return out;
}

/** A copy of obj with key set to value; a new key goes after `after`, or last. */
function withKey(obj, key, value, after) {
  if (key in obj || !(after in obj)) return { ...obj, [key]: value };
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v;
    if (k === after) out[key] = value;
  }
  return out;
}

/** An option group with the given px options present: numbers in order, then its $ keys. */
function withOptions(group = {}, pxs) {
  const values = { ...group };
  for (const px of pxs) values[String(px)] ??= { $type: "dimension", $value: rem(px) };
  const keys = Object.keys(values);
  const numbers = keys.filter((k) => !isMeta(k)).sort((a, b) => Number(a) - Number(b));
  return Object.fromEntries([...numbers, ...keys.filter(isMeta)].map((k) => [k, values[k]]));
}

/** Give target the keys of source, in source's order. */
function replaceContents(target, source) {
  for (const k of Object.keys(target)) delete target[k];
  Object.assign(target, source);
}

/** The px a link names: {space.12} is 12. */
const pxOf = (token) => Number(/\.(\d+)\}$/.exec(token.$value)?.[1]);

/**
 * The token with its generated value: a stored value wins, and a stored $description and reason stay.
 * The record generates values; people write reasons, so a written reason is never replaced by the template.
 */
const filled = (stored, generated) =>
  stored && "$value" in stored
    ? stored
    : {
        $type: generated.$type,
        $value: generated.$value,
        ...(stored?.$description && { $description: stored.$description }),
        $extensions: stored?.$extensions ?? generated.$extensions,
      };

/** The scheme with every value its records generate. A value the file stores stays as stored. Does not change its input. */
export function withTypeAndSpace(scheme) {
  const values = generatedValues(scheme);
  if (!values.length) return scheme;
  const tokens = structuredClone(scheme.tokens);
  const { primitive } = tokens;
  primitive.font ??= {};
  for (const { path, token, group } of values) {
    const parts = path.split(".");
    const key = parts.at(-1);
    const parent = parts.slice(0, -1).reduce((node, k) => (node[k] ??= {}), tokens);
    if (group) {
      const stored = parent[key] ?? {};
      if (!Object.keys(group).length && !Object.keys(stored).some((k) => !isMeta(k))) continue;
      // Numeric option names sort first by themselves, so the group lists its options in order.
      const full = { ...group, ...stored, $description: stored.$description ?? GROUP_DESCRIPTIONS[key] };
      replaceContents(parent, withKey(parent, key, full, key === "line-box" ? "line-height" : "size"));
      continue;
    }
    const next = filled(parent[key], token);
    // A role's size and line height sit after its font family, as the schemes list them.
    const after = key === "font-size" ? "font-family" : key === "line-height" ? "font-size" : undefined;
    replaceContents(parent, withKey(parent, key, next, after));
    // A generated link needs its option: add a space or size option that the scheme lacks.
    const groupName = parts[1];
    if (groupName === "space" || groupName === "size")
      primitive[groupName] = withOptions(primitive[groupName], [pxOf(next)].filter(Number.isFinite));
  }
  return { ...scheme, tokens };
}

/** The scheme as it is stored: each value that equals its generated value is left out. */
export function withoutTypeAndSpace(scheme) {
  const values = generatedValues(scheme);
  if (!values.length) return scheme;
  const tokens = structuredClone(scheme.tokens);
  for (const { path, token, group } of values) {
    const parts = path.split(".");
    const parent = at(tokens, parts.slice(0, -1).join("."));
    const key = parts.at(-1);
    const stored = parent?.[key];
    if (!stored) continue;
    if (group) {
      const options = Object.fromEntries(Object.entries(stored).filter(([k]) => !isMeta(k)));
      if (!same(options, group)) continue;
      // The group stays, with its description, so the font options keep their order.
      parent[key] = { $description: stored.$description ?? GROUP_DESCRIPTIONS[key] };
      continue;
    }
    const { $description, $extensions, ...rest } = stored;
    if (!same(rest, { $type: token.$type, $value: token.$value })) continue;
    // The value leaves the file; a written reason stays with its description.
    const reason = $extensions && !same($extensions, token.$extensions) ? { $extensions } : {};
    if ($description || reason.$extensions) parent[key] = { ...($description && { $description }), ...reason };
    else delete parent[key];
  }
  return { ...scheme, tokens };
}

/**
 * What breaks the rule that type and spacing come from their records, one line each: a value the file
 * stores next to its record (`stored` is the scheme as its file holds it), or a loaded value that
 * differs from the one its record generates.
 */
export function generatedProblems(scheme, stored) {
  const problems = [];
  const id = scheme.id;
  for (const { path, token, group } of generatedValues(scheme)) {
    const name = path.replace(/^(semantic|primitive)\./, "");
    const kept = stored && at(stored.tokens, path);
    if (group) {
      const options = Object.keys(kept ?? {}).filter((k) => !isMeta(k));
      if (options.length) problems.push(`${id}: ${name} stores ${options.join(", ")} by hand; remove them, the type scale generates them`);
      continue;
    }
    if (kept && "$value" in kept)
      problems.push(`${id}: ${name} is set by hand next to its record; remove its value, the loader generates it`);
    const loaded = at(scheme.tokens, path);
    if (loaded?.$value !== token.$value)
      problems.push(`${id}: ${name} is ${loaded?.$value ?? "missing"}, and its record gives ${token.$value}`);
  }
  return problems;
}
