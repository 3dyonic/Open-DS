// The components of a Figma kit (OD-149): one recipe per catalogue component, built only from the
// scheme's variables, looked up by CSS name, exactly as the code reads them. Components without their
// own component keys compose the ones that have them (button, input, control, badge, card, table,
// tabs, overlay, tooltip) with semantic variables, like the code components do.

/** Helpers every components script carries (after the shared HELPERS). */
export const COMPONENT_HELPERS = String.raw`
const byCss = {};
for (const v of allVars) { const w = v.codeSyntax && v.codeSyntax.WEB; if (w) byCss[w.replace(/^var\(--/, '').replace(/\)$/, '')] = v; }
const K = (css) => byCss[css];
const paint = (css) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }, 'color', K(css));
const fill = (node, css) => { if (css && K(css)) { node.fills = [paint(css)]; return true; } node.fills = []; return false; };
const stroke = (node, css, weightCss = 'border-width-default') => { if (!K(css)) return; node.strokes = [paint(css)]; node.strokeAlign = 'INSIDE'; if (K(weightCss)) node.setBoundVariable('strokeWeight', K(weightCss)); else node.strokeWeight = 1; };
const num = (node, field, css, fallback) => { if (K(css)) node.setBoundVariable(field, K(css)); else if (fallback !== undefined) node[field] = fallback; };
const radius = (node, css, fb) => { for (const f of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) num(node, f, css, fb); };
const pad = (node, xCss, yCss, fx = 12, fy = 8) => { num(node, 'paddingLeft', xCss, fx); num(node, 'paddingRight', xCss, fx); num(node, 'paddingTop', yCss, fy); num(node, 'paddingBottom', yCss, fy); };
const styles = await figma.getLocalTextStylesAsync();
const style = (role) => styles.find((s) => s.name === 'Type/' + role) || styles.find((s) => s.name === 'Type/body') || styles[0];
async function lbl(chars, role = 'body', colorCss = 'color-text-primary', sizeCss) {
  const t = figma.createText(); const st = style(role);
  if (st) { await load(st.fontName); t.fontName = st.fontName; t.characters = chars; await t.setTextStyleIdAsync(st.id); }
  else { t.fontName = await load({ family: 'Inter', style: 'Regular' }); t.characters = chars; }
  fill(t, colorCss); if (sizeCss && K(sizeCss)) t.setBoundVariable('fontSize', K(sizeCss));
  t.name = 'Label'; return t;
}
function row(name = 'Row', gap = 8, align = 'CENTER') { const f = figma.createAutoLayout('HORIZONTAL', { name, itemSpacing: gap, counterAxisAlignItems: align }); f.fills = []; return f; }
function col(name = 'Column', gap = 8, align = 'MIN') { const f = figma.createAutoLayout('VERTICAL', { name, itemSpacing: gap, counterAxisAlignItems: align }); f.fills = []; return f; }
function put(parent, ...kids) { for (const k of kids) if (k) parent.appendChild(k); return parent; }
function stretch(node) { node.layoutSizingHorizontal = 'FILL'; return node; }
function fixed(node, w, h) { node.primaryAxisSizingMode = 'FIXED'; node.counterAxisSizingMode = 'FIXED'; node.resize(w, h); return node; }
function comp(name, dir = 'HORIZONTAL', gap = 8) {
  const c = figma.createComponent(); c.name = name; c.layoutMode = dir; c.itemSpacing = gap;
  c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO';
  c.primaryAxisAlignItems = 'MIN'; c.counterAxisAlignItems = dir === 'HORIZONTAL' ? 'CENTER' : 'MIN'; c.fills = []; return c;
}
/** A fixed width that still hugs its content's height. resize() makes both axes fixed, so the hugging axis is set back after it. */
function width(node, w) {
  node.resize(w, node.height);
  if (node.layoutMode === 'VERTICAL') { node.counterAxisSizingMode = 'FIXED'; node.primaryAxisSizingMode = 'AUTO'; }
  else { node.primaryAxisSizingMode = 'FIXED'; node.counterAxisSizingMode = 'AUTO'; }
  return node;
}
const ICONS = { chevron: 'M 4 6 L 8 10 L 12 6', right: 'M 6 4 L 10 8 L 6 12', left: 'M 10 4 L 6 8 L 10 12', check: 'M 3.5 8 L 6.5 11 L 12.5 5', x: 'M 4 4 L 12 12 M 12 4 L 4 12', search: 'M 7 3 C 9.2 3 11 4.8 11 7 C 11 9.2 9.2 11 7 11 C 4.8 11 3 9.2 3 7 C 3 4.8 4.8 3 7 3 Z M 10 10 L 13 13', plus: 'M 8 3 L 8 13 M 3 8 L 13 8', info: 'M 8 7 L 8 11 M 8 5 L 8 5.2', calendar: 'M 3 4 L 13 4 L 13 13 L 3 13 Z M 3 7 L 13 7 M 6 2.5 L 6 5 M 10 2.5 L 10 5', menu: 'M 3 5 L 13 5 M 3 8 L 13 8 M 3 11 L 13 11', grip: 'M 6 4 L 6 4.2 M 10 4 L 10 4.2 M 6 8 L 6 8.2 M 10 8 L 10 8.2 M 6 12 L 6 12.2 M 10 12 L 10 12.2' };
function icon(name, colorCss = 'color-text-secondary', size = 16) {
  const f = figma.createFrame(); f.name = 'Icon/' + name; f.resize(16, 16); f.fills = []; f.clipsContent = false;
  const v = figma.createVector(); v.vectorPaths = [{ windingRule: 'NONE', data: ICONS[name] }];
  v.strokes = K(colorCss) ? [paint(colorCss)] : [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }]; v.strokeWeight = 1.5; v.strokeCap = 'ROUND'; v.strokeJoin = 'ROUND'; v.fills = [];
  f.appendChild(v); v.x = 0; v.y = 0; if (size !== 16) f.rescale(size / 16); return f;
}
/** A button frame styled with the button variables (kind: primary, secondary, ghost, disabled). */
async function btn(text, kind = 'primary') {
  const b = row('Button', 6); b.counterAxisSizingMode = 'FIXED'; num(b, 'height', 'button-height', 32);
  num(b, 'paddingLeft', 'button-padding-x', 12); num(b, 'paddingRight', 'button-padding-x', 12); radius(b, 'button-radius', 6);
  const bg = { primary: 'button-primary-background', secondary: 'button-secondary-background', ghost: null, disabled: 'button-disabled-background' }[kind];
  fill(b, bg); if (kind === 'secondary') stroke(b, 'button-secondary-border'); if (kind === 'disabled') stroke(b, 'button-disabled-border');
  b.appendChild(await lbl(text, 'label', { primary: 'button-primary-label', secondary: 'button-secondary-label', ghost: 'button-ghost-label', disabled: 'button-disabled-label' }[kind], 'button-font-size'));
  return b;
}
/** An input frame (state: default, filled, focus, disabled), optional trailing icon. */
async function field(text, state = 'default', w = 240, trailing) {
  const f = row('Input', 8); fixed(f, w, 32); num(f, 'height', 'input-height'); num(f, 'paddingLeft', 'input-padding-x', 12); num(f, 'paddingRight', 'input-padding-x', 12); radius(f, 'input-radius', 6);
  const dis = state === 'disabled';
  fill(f, dis ? 'input-disabled-background' : 'input-background'); stroke(f, dis ? 'input-disabled-border' : state === 'focus' ? 'input-border-focus' : 'input-border', state === 'focus' ? 'border-width-focus' : 'border-width-default');
  const t = await lbl(text, 'body', dis ? 'input-disabled-text' : state === 'default' ? 'input-placeholder' : 'input-text', 'input-font-size'); f.appendChild(t); stretch(t);
  if (trailing) f.appendChild(icon(trailing, 'color-text-secondary'));
  return f;
}
/** An overlay surface: dialogs, menus, popovers, toasts. */
function surface(name, dir = 'VERTICAL', gap = 8, w) {
  const s = comp(name, dir, gap); fill(s, 'overlay-background'); radius(s, 'overlay-radius', 8); stroke(s, 'color-border-default');
  pad(s, 'space-inset-container', 'space-inset-container', 16, 16); if (w) width(s, w); return s;
}
async function shadow(node, name = 'Elevation/overlay') { const es = (await figma.getLocalEffectStylesAsync()).find((x) => x.name === name); if (es) await node.setEffectStyleIdAsync(es.id); }
async function menuItem(text, shortcut, danger) {
  const it = row('Item', 8); it.counterAxisSizingMode = 'FIXED'; num(it, 'height', 'overlay-item-height', 32); it.paddingLeft = 8; it.paddingRight = 8;
  const t = await lbl(text, 'body', danger ? 'color-status-danger' : 'color-text-primary'); it.appendChild(t); stretch(t);
  if (shortcut) it.appendChild(await lbl(shortcut, 'caption', 'color-text-muted'));
  return it;
}
function line(w = 200, css = 'color-border-default') { const r = figma.createRectangle(); r.name = 'Separator'; r.resize(w, 1); fill(r, css); return r; }
/** Variants in a padded grid with a text property for every Label. */
function asSet(comps, name, cols, desc, textProp) {
  const set = figma.combineAsVariants(comps, figma.currentPage); set.name = name;
  let x = 24, y = 24, rowH = 0;
  comps.forEach((c, i) => { c.x = x; c.y = y; rowH = Math.max(rowH, c.height); x += c.width + 32; if ((i + 1) % cols === 0) { x = 24; y += rowH + 32; rowH = 0; } });
  let w = 0, h = 0; for (const c of comps) { w = Math.max(w, c.x + c.width); h = Math.max(h, c.y + c.height); }
  set.resize(w + 24, h + 24); set.fills = [];
  set.strokes = [{ type: 'SOLID', color: { r: 0.592, g: 0.278, b: 1 } }]; set.dashPattern = [6, 4]; set.strokeWeight = 1; set.cornerRadius = 8;
  // One shared text property only when every variant shows the same words (Button, Checkbox); variants
  // that differ on purpose (Input states, Badge tones) keep their own text.
  const texts = comps.map((c) => c.findOne((n) => n.type === 'TEXT' && n.name === 'Label')?.characters);
  if (textProp && texts[0] && texts.every((t) => t === texts[0])) {
    const key = set.addComponentProperty(textProp, 'TEXT', texts[0]);
    for (const c of comps) { const t = c.findOne((n) => n.type === 'TEXT' && n.name === 'Label'); if (t) t.componentPropertyReferences = { characters: key }; }
  }
  set.description = desc; return set;
}
function textProp(c, name = 'Label') { const t = c.findOne((n) => n.type === 'TEXT' && n.name === 'Label'); if (t) t.componentPropertyReferences = { characters: c.addComponentProperty(name, 'TEXT', t.characters) }; return c; }
`;

/** One recipe per catalogue component: [title, description, async body returning a node]. */
export const RECIPES = {
  button: ["Button", "Every action. Primary is the one main action in a view; secondary and ghost step back.", String.raw`
    const comps = [];
    for (const [n, kind, hover] of [['Primary', 'primary'], ['Primary hover', 'primary', 'button-primary-background-hover'], ['Secondary', 'secondary'], ['Secondary hover', 'secondary', 'button-secondary-background-hover'], ['Ghost', 'ghost'], ['Ghost hover', 'ghost', 'button-ghost-background-hover'], ['Disabled', 'disabled']]) {
      const c = comp('Variant=' + n); const b = await btn('Button', kind); if (hover) fill(b, hover);
      c.appendChild(b); comps.push(c);
    }
    return asSet(comps, 'Button', 7, 'Every action. Reads button-* variables.', 'Label');`],
  "toggle-group": ["Toggle group", "A small set of options where one is on, like views or densities.", String.raw`
    const c = comp('Toggle group', 'HORIZONTAL', 0); stroke(c, 'color-border-default'); radius(c, 'radius-control', 6); c.clipsContent = true;
    for (const [i, n] of ['Table', 'Cards', 'Map'].entries()) { const s = row('Option', 6); s.counterAxisSizingMode = 'FIXED'; num(s, 'height', 'button-height', 32); s.paddingLeft = 12; s.paddingRight = 12;
      fill(s, i === 0 ? 'color-surface-selected' : null); s.appendChild(await lbl(n, 'label', i === 0 ? 'color-text-primary' : 'color-text-secondary')); c.appendChild(s); }
    return c;`],
  input: ["Input", "A text field: empty with a placeholder, filled, focused and disabled.", String.raw`
    const comps = [];
    for (const [n, state, value] of [['Default', 'default', 'Search'], ['Filled', 'filled', 'Alert 2041'], ['Focus', 'focus', 'Alert 2041'], ['Disabled', 'disabled', 'Not editable']]) { const c = comp('State=' + n); c.appendChild(await field(value, state)); comps.push(c); }
    return asSet(comps, 'Input', 4, 'Text fields. Reads input-* variables.', 'Value');`],
  "input-group": ["Input group", "An input with a fixed part before or after it, like a prefix or a unit.", String.raw`
    const c = comp('Input group', 'HORIZONTAL', 0);
    const add = row('Addon', 0); add.counterAxisSizingMode = 'FIXED'; num(add, 'height', 'input-height', 32); add.paddingLeft = 12; add.paddingRight = 12; fill(add, 'color-surface-sunken'); stroke(add, 'input-border'); radius(add, 'input-radius', 6);
    add.topRightRadius = 0; add.bottomRightRadius = 0; add.appendChild(await lbl('https://', 'body', 'color-text-secondary'));
    const f = await field('example.com', 'filled', 200); f.topLeftRadius = 0; f.bottomLeftRadius = 0;
    return put(c, add, f);`],
  textarea: ["Textarea", "Text that runs to several lines.", String.raw`
    const c = comp('Textarea', 'VERTICAL'); const f = col('Box', 0); f.counterAxisSizingMode = 'FIXED'; fixed(f, 320, 96);
    pad(f, 'input-padding-x', 'input-padding-x', 12, 8); radius(f, 'input-radius', 6); fill(f, 'input-background'); stroke(f, 'input-border');
    const t = await lbl('Add a note for the next shift.', 'body', 'input-placeholder', 'input-font-size'); f.appendChild(t); stretch(t); t.textAutoResize = 'HEIGHT';
    return put(c, f);`],
  select: ["Select", "Pick one option from a list; the list opens below.", String.raw`
    const c = comp('Select', 'VERTICAL', 4); c.appendChild(await field('Last 24 hours', 'filled', 240, 'chevron'));
    const m = surface('List', 'VERTICAL', 0, 240); m.paddingTop = 4; m.paddingBottom = 4; m.paddingLeft = 4; m.paddingRight = 4;
    for (const [i, n] of ['Last hour', 'Last 24 hours', 'Last 7 days'].entries()) { const it = await menuItem(n); if (i === 1) { fill(it, 'color-surface-selected'); it.appendChild(icon('check', 'color-text-primary')); } m.appendChild(it); stretch(it); }
    m.name = 'List'; const frame = col('List', 0); put(frame, ...m.children); fill(frame, 'overlay-background'); radius(frame, 'overlay-radius', 8); stroke(frame, 'color-border-default'); frame.paddingTop = 4; frame.paddingBottom = 4; frame.paddingLeft = 4; frame.paddingRight = 4; width(frame, 240); m.remove();
    await shadow(frame); c.appendChild(frame); for (const k of frame.children) stretch(k);
    return c;`],
  "native-select": ["Native select", "The browser's own select, styled like an input.", String.raw`
    const c = comp('Native select'); c.appendChild(await field('Open', 'filled', 200, 'chevron')); return c;`],
  combobox: ["Combobox", "Type to filter a list, then pick one.", String.raw`
    const c = comp('Combobox', 'VERTICAL', 4); c.appendChild(await field('ser', 'focus', 260, 'chevron'));
    const frame = col('Results', 0); fill(frame, 'overlay-background'); radius(frame, 'overlay-radius', 8); stroke(frame, 'color-border-default'); frame.paddingTop = 4; frame.paddingBottom = 4; frame.paddingLeft = 4; frame.paddingRight = 4; width(frame, 260);
    for (const n of ['Server 01', 'Server 02', 'Service map']) { const it = await menuItem(n); frame.appendChild(it); stretch(it); }
    await shadow(frame); c.appendChild(frame); return c;`],
  checkbox: ["Checkbox", "A choice in a form or a table: off, on.", String.raw`
    const comps = [];
    for (const on of [false, true]) {
      const c = comp('State=' + (on ? 'On' : 'Off'));
      const box = figma.createFrame(); box.name = 'Box'; box.resize(16, 16); radius(box, 'control-radius', 4); box.clipsContent = false;
      if (on) { fill(box, 'control-checked'); const t = icon('check', 'control-thumb'); box.appendChild(t); t.x = 0; t.y = 0; } else { fill(box, 'input-background'); stroke(box, 'input-border'); }
      c.appendChild(box); c.appendChild(await lbl('Select row')); comps.push(c);
    }
    return asSet(comps, 'Checkbox', 2, 'Reads control-* and input-* variables.', 'Label');`],
  switch: ["Switch", "A setting that applies at once: off, on.", String.raw`
    const comps = [];
    for (const on of [false, true]) {
      const c = comp('State=' + (on ? 'On' : 'Off'));
      const tr = figma.createFrame(); tr.name = 'Track'; tr.layoutMode = 'HORIZONTAL'; tr.primaryAxisSizingMode = 'FIXED'; tr.counterAxisSizingMode = 'FIXED'; tr.resize(32, 18);
      tr.counterAxisAlignItems = 'CENTER'; tr.primaryAxisAlignItems = on ? 'MAX' : 'MIN'; tr.paddingLeft = 2; tr.paddingRight = 2; tr.cornerRadius = 9; fill(tr, on ? 'control-checked' : 'control-track');
      const th = figma.createEllipse(); th.name = 'Thumb'; th.resize(14, 14); fill(th, 'control-thumb'); tr.appendChild(th);
      c.appendChild(tr); c.appendChild(await lbl('Live updates')); comps.push(c);
    }
    return asSet(comps, 'Switch', 2, 'Reads control-* variables.', 'Label');`],
  "radio-group": ["Radio group", "One choice from a few, all visible.", String.raw`
    const c = comp('Radio group', 'VERTICAL', 8);
    for (const [i, n] of ['Every alert', 'Only critical', 'None'].entries()) {
      const r = row('Option', 8); const o = figma.createEllipse(); o.name = 'Radio'; o.resize(16, 16); fill(o, 'input-background'); stroke(o, i === 0 ? 'control-checked' : 'input-border', i === 0 ? 'border-width-focus' : 'border-width-default');
      r.appendChild(o); if (i === 0) { const d = figma.createEllipse(); d.name = 'Dot'; d.resize(8, 8); fill(d, 'control-checked'); r.appendChild(d); d.layoutPositioning = 'ABSOLUTE'; d.x = 4; d.y = (r.height - 8) / 2; }
      r.appendChild(await lbl(n)); c.appendChild(r);
    }
    return c;`],
  slider: ["Slider", "A value on a range.", String.raw`
    const c = comp('Slider', 'HORIZONTAL', 0); fixed(c, 240, 16); c.layoutMode = 'NONE';
    const tr = figma.createRectangle(); tr.name = 'Track'; tr.resize(240, 4); tr.cornerRadius = 2; fill(tr, 'control-track'); c.appendChild(tr); tr.y = 6;
    const rg = figma.createRectangle(); rg.name = 'Range'; rg.resize(150, 4); rg.cornerRadius = 2; fill(rg, 'control-checked'); c.appendChild(rg); rg.y = 6;
    const th = figma.createEllipse(); th.name = 'Thumb'; th.resize(16, 16); fill(th, 'control-thumb'); stroke(th, 'control-checked', 'border-width-focus'); c.appendChild(th); th.x = 142; th.y = 0;
    return c;`],
  label: ["Label", "Names a field. It sits above or beside it.", String.raw`
    const c = comp('Label'); c.appendChild(await lbl('Email', 'label')); return textProp(c);`],
  field: ["Field", "A label, an input and a hint or an error, as one unit.", String.raw`
    const c = comp('Field', 'VERTICAL', 6); c.appendChild(await lbl('Email', 'label')); c.appendChild(await field('name@example.com', 'default', 280));
    c.appendChild(await lbl('We send the key here.', 'caption', 'color-text-muted')); return c;`],
  form: ["Form", "Fields in one column, with the main action last.", String.raw`
    const c = comp('Form', 'VERTICAL', 16); fill(c, 'card-background'); stroke(c, 'card-border'); radius(c, 'card-radius', 8); pad(c, 'card-padding', 'card-padding', 24, 24);
    c.appendChild(await lbl('New rule', 'title'));
    for (const [l, v] of [['Name', 'Brute force'], ['Threshold', '5 attempts']]) { const f = col('Field', 6); f.appendChild(await lbl(l, 'label')); f.appendChild(await field(v, 'filled', 280)); c.appendChild(f); }
    const a = row('Actions', 8); a.appendChild(await btn('Save')); a.appendChild(await btn('Cancel', 'ghost')); c.appendChild(a); return c;`],
  "input-otp": ["One-time code", "A short code, one box per character.", String.raw`
    const c = comp('One-time code', 'HORIZONTAL', 8);
    for (const ch of ['4', '8', '1', '', '', '']) { const b = row('Digit', 0); fixed(b, 40, 44); b.primaryAxisAlignItems = 'CENTER'; radius(b, 'input-radius', 6); fill(b, 'input-background'); stroke(b, ch === '' && c.children.length === 3 ? 'input-border-focus' : 'input-border'); if (ch) b.appendChild(await lbl(ch, 'title')); c.appendChild(b); }
    return c;`],
  calendar: ["Calendar", "A month to pick a date from.", String.raw`
    const c = comp('Calendar', 'VERTICAL', 8); fill(c, 'card-background'); stroke(c, 'card-border'); radius(c, 'card-radius', 8); pad(c, 'space-inset-container', 'space-inset-container', 12, 12);
    const h = row('Header', 8); h.appendChild(icon('left')); const m = await lbl('November 2026', 'label'); h.appendChild(m); m.layoutGrow = 1; m.textAlignHorizontal = 'CENTER'; h.appendChild(icon('right')); c.appendChild(h); width(h, 7 * 32);
    const days = row('Weekdays', 0); for (const d of ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']) { const b = row('Day', 0); fixed(b, 32, 24); b.primaryAxisAlignItems = 'CENTER'; b.appendChild(await lbl(d, 'caption', 'color-text-muted')); days.appendChild(b); } c.appendChild(days);
    let n = 1; const first = 6;
    for (let w = 0; w < 5; w++) { const r = row('Week', 0); for (let d = 0; d < 7; d++) { const i = w * 7 + d; const b = row('Date', 0); fixed(b, 32, 32); b.primaryAxisAlignItems = 'CENTER'; b.cornerRadius = 6;
      if (i >= first && n <= 30) { const sel = n === 12; if (sel) fill(b, 'color-action-primary'); b.appendChild(await lbl(String(n), 'body', sel ? 'color-text-on-action' : 'color-text-primary')); n++; } r.appendChild(b); } c.appendChild(r); }
    return c;`],
  "date-picker": ["Date picker", "An input that opens a calendar.", String.raw`
    const c = comp('Date picker', 'VERTICAL', 4); c.appendChild(await field('12 Nov 2026', 'filled', 240, 'calendar')); return c;`],
  table: ["Table", "Rows of records: a header, rows, and a selected row.", String.raw`
    const c = comp('Table', 'VERTICAL', 0); width(c, 520); fill(c, 'card-background'); stroke(c, 'table-row-border'); radius(c, 'radius-container', 8); c.clipsContent = true;
    const rows = [['Name', 'Status', 'Updated'], ['Row one', 'Open', '09:41'], ['Row two', 'Closed', '08:15'], ['Row three', 'Open', 'Yesterday']];
    for (const [i, r] of rows.entries()) {
      const rw = row(i ? (i === 2 ? 'Row, selected' : 'Row') : 'Header', 0); c.appendChild(rw); stretch(rw); rw.counterAxisSizingMode = 'FIXED'; num(rw, 'height', 'table-row-height', 32);
      fill(rw, i === 0 ? 'table-header-background' : i === 2 ? 'table-row-selected' : null);
      if (i < rows.length - 1 && K('table-row-border')) { rw.strokes = [paint('table-row-border')]; rw.strokeTopWeight = 0; rw.strokeLeftWeight = 0; rw.strokeRightWeight = 0; rw.strokeBottomWeight = 1; }
      for (const cell of r) { const f = row('Cell', 0); rw.appendChild(f); f.layoutGrow = 1; num(f, 'paddingLeft', 'table-cell-padding-x', 12); num(f, 'paddingRight', 'table-cell-padding-x', 12);
        f.appendChild(await lbl(cell, i ? 'data' : 'label', i ? 'color-text-primary' : 'color-text-secondary', 'table-font-size')); }
    }
    return c;`],
  "data-table": ["Data table", "A table with search, selection and pages, for large sets of records.", String.raw`
    const c = comp('Data table', 'VERTICAL', 12); width(c, 560);
    const bar = row('Toolbar', 8); bar.appendChild(await field('Filter rows', 'default', 220, 'search')); const sp = row('Space'); bar.appendChild(sp); sp.layoutGrow = 1; bar.appendChild(await btn('Export', 'secondary')); c.appendChild(bar); stretch(bar);
    const t = col('Table', 0); fill(t, 'card-background'); stroke(t, 'table-row-border'); radius(t, 'radius-container', 8); t.clipsContent = true; c.appendChild(t); stretch(t);
    for (const [i, r] of [['', 'Alert', 'Severity'], ['☐', '2041', 'High'], ['☑', '2042', 'Low'], ['☐', '2043', 'Medium']].entries()) {
      const rw = row('Row', 0); t.appendChild(rw); stretch(rw); rw.counterAxisSizingMode = 'FIXED'; num(rw, 'height', 'table-row-height', 32); fill(rw, i === 0 ? 'table-header-background' : i === 2 ? 'table-row-selected' : null);
      if (K('table-row-border') && i < 3) { rw.strokes = [paint('table-row-border')]; rw.strokeTopWeight = 0; rw.strokeLeftWeight = 0; rw.strokeRightWeight = 0; rw.strokeBottomWeight = 1; }
      for (const [j, cell] of r.entries()) { const f = row('Cell', 0); rw.appendChild(f); if (j) f.layoutGrow = 1; else fixed(f, 40, 20); num(f, 'paddingLeft', 'table-cell-padding-x', 12);
        if (j === 0 && i > 0) { const box = figma.createFrame(); box.resize(14, 14); radius(box, 'control-radius', 3); if (i === 2) { fill(box, 'control-checked'); const ic = icon('check', 'control-thumb'); ic.rescale(0.875); box.appendChild(ic); } else { fill(box, 'input-background'); stroke(box, 'input-border'); } f.appendChild(box); }
        else if (cell) f.appendChild(await lbl(cell, i ? 'data' : 'label', i ? 'color-text-primary' : 'color-text-secondary', 'table-font-size')); }
    }
    const pg = row('Footer', 8); pg.appendChild(await lbl('1 of 3 selected', 'caption', 'color-text-muted')); const sp2 = row('Space'); pg.appendChild(sp2); sp2.layoutGrow = 1; pg.appendChild(await btn('Previous', 'secondary')); pg.appendChild(await btn('Next', 'secondary')); c.appendChild(pg); stretch(pg);
    return c;`],
  pagination: ["Pagination", "Moves between pages of results.", String.raw`
    const c = comp('Pagination', 'HORIZONTAL', 4); c.appendChild(await btn('Previous', 'ghost'));
    for (const n of ['1', '2', '3']) c.appendChild(await btn(n, n === '2' ? 'secondary' : 'ghost'));
    c.appendChild(await lbl('…', 'body', 'color-text-muted')); c.appendChild(await btn('Next', 'ghost')); return c;`],
  chart: ["Chart", "Numbers over time or by group, in the category colours.", String.raw`
    const c = comp('Chart', 'VERTICAL', 12); fill(c, 'card-background'); stroke(c, 'card-border'); radius(c, 'card-radius', 8); pad(c, 'card-padding', 'card-padding', 16, 16);
    c.appendChild(await lbl('Alerts per day', 'heading'));
    const bars = row('Bars', 8, 'MAX'); fixed(bars, 360, 120);
    const vals = [40, 64, 52, 90, 72, 110, 84];
    for (const [i, v] of vals.entries()) { const r = figma.createRectangle(); r.name = 'Bar'; r.resize(40, v); r.topLeftRadius = 3; r.topRightRadius = 3; fill(r, 'color-category-' + ((i % 5) + 1)) || fill(r, 'color-action-primary'); bars.appendChild(r); }
    c.appendChild(bars); return c;`],
  badge: ["Badge", "A status at a glance. One tone per meaning.", String.raw`
    const comps = [];
    for (const tone of ['neutral', 'info', 'success', 'warning', 'danger']) { if (!K('badge-' + tone + '-background')) continue;
      const c = comp('Tone=' + tone[0].toUpperCase() + tone.slice(1), 'HORIZONTAL', 4); num(c, 'paddingLeft', 'badge-padding-x', 8); num(c, 'paddingRight', 'badge-padding-x', 8); c.paddingTop = 2; c.paddingBottom = 2; radius(c, 'badge-radius', 4);
      fill(c, 'badge-' + tone + '-background'); c.appendChild(await lbl(tone[0].toUpperCase() + tone.slice(1), 'caption', 'badge-' + tone + '-label', 'badge-font-size')); comps.push(c); }
    return asSet(comps, 'Badge', 5, 'Reads badge-* variables.', 'Label');`],
  avatar: ["Avatar", "A person or a team: a picture, or initials.", String.raw`
    const c = comp('Avatar', 'HORIZONTAL', 0); fixed(c, 40, 40); c.primaryAxisAlignItems = 'CENTER'; c.cornerRadius = 20; fill(c, 'color-surface-selected');
    c.appendChild(await lbl('AL', 'label', 'color-text-primary')); return textProp(c, 'Initials');`],
  kbd: ["Kbd", "A key or a shortcut on the keyboard.", String.raw`
    const c = comp('Kbd', 'HORIZONTAL', 0); c.paddingLeft = 6; c.paddingRight = 6; c.paddingTop = 2; c.paddingBottom = 2; radius(c, 'radius-control', 4); fill(c, 'color-surface-sunken'); stroke(c, 'color-border-default');
    c.appendChild(await lbl('⌘ K', 'data', 'color-text-secondary')); return textProp(c, 'Keys');`],
  progress: ["Progress", "How much of a task is done.", String.raw`
    const c = comp('Progress', 'HORIZONTAL', 0); fixed(c, 240, 8); c.cornerRadius = 4; fill(c, 'control-track'); c.clipsContent = true;
    const b = figma.createRectangle(); b.name = 'Value'; b.resize(156, 8); fill(b, 'control-checked'); c.appendChild(b); return c;`],
  skeleton: ["Skeleton", "A placeholder while content loads.", String.raw`
    const c = comp('Skeleton', 'HORIZONTAL', 12); const a = figma.createEllipse(); a.resize(40, 40); fill(a, 'color-surface-sunken'); c.appendChild(a);
    const lines = col('Lines', 8); for (const w of [200, 140]) { const r = figma.createRectangle(); r.resize(w, 12); r.cornerRadius = 6; fill(r, 'color-surface-sunken'); lines.appendChild(r); } c.appendChild(lines); return c;`],
  spinner: ["Spinner", "Work in progress, length unknown.", String.raw`
    const c = comp('Spinner', 'HORIZONTAL', 0); const e = figma.createEllipse(); e.name = 'Arc'; e.resize(24, 24); e.arcData = { startingAngle: 0, endingAngle: 4.7, innerRadius: 0.78 }; fill(e, 'color-action-primary'); c.appendChild(e); return c;`],
  separator: ["Separator", "A quiet line between groups.", String.raw`
    const c = comp('Separator', 'VERTICAL', 0); c.appendChild(line(320)); return c;`],
  empty: ["Empty", "What to do when there is nothing to show yet.", String.raw`
    const c = comp('Empty', 'VERTICAL', 12); c.counterAxisAlignItems = 'CENTER'; pad(c, 'space-gap-section', 'space-gap-section', 32, 32); radius(c, 'card-radius', 8); stroke(c, 'color-border-default'); c.dashPattern = [6, 4];
    const ic = row('Icon', 0); fixed(ic, 40, 40); ic.primaryAxisAlignItems = 'CENTER'; ic.cornerRadius = 20; fill(ic, 'color-surface-sunken'); ic.appendChild(icon('search')); c.appendChild(ic);
    c.appendChild(await lbl('No alerts match', 'heading')); c.appendChild(await lbl('Clear a filter to see more.', 'body', 'color-text-secondary')); c.appendChild(await btn('Clear filters', 'secondary')); return c;`],
  "aspect-ratio": ["Aspect ratio", "Keeps media at a set shape, here 16:9.", String.raw`
    const c = comp('Aspect ratio', 'HORIZONTAL', 0); fixed(c, 320, 180); c.primaryAxisAlignItems = 'CENTER'; radius(c, 'radius-container', 8); fill(c, 'color-surface-sunken');
    c.appendChild(await lbl('16:9', 'caption', 'color-text-muted')); return c;`],
  "scroll-area": ["Scroll area", "A box that scrolls on its own.", String.raw`
    const c = comp('Scroll area', 'HORIZONTAL', 4); c.counterAxisAlignItems = 'MIN'; stroke(c, 'color-border-default'); radius(c, 'radius-container', 8); c.paddingLeft = 12; c.paddingTop = 8; c.paddingBottom = 8; c.paddingRight = 4;
    const list = col('Content', 8); for (const n of ['v1.2.0', 'v1.1.4', 'v1.1.3', 'v1.1.2', 'v1.1.1']) list.appendChild(await lbl(n, 'data')); c.appendChild(list); list.resize(180, list.height);
    const bar = figma.createRectangle(); bar.name = 'Scrollbar'; bar.resize(4, 48); bar.cornerRadius = 2; fill(bar, 'color-border-strong'); c.appendChild(bar); return c;`],
  resizable: ["Resizable", "Panels the person can resize with a handle.", String.raw`
    const c = comp('Resizable', 'HORIZONTAL', 0); stroke(c, 'color-border-default'); radius(c, 'radius-container', 8); c.clipsContent = true; fixed(c, 420, 140); c.counterAxisAlignItems = 'MIN';
    const a = col('Panel', 4); a.paddingLeft = 12; a.paddingTop = 12; a.appendChild(await lbl('List', 'label')); c.appendChild(a); fixed(a, 160, 140);
    const h = row('Handle', 0); fixed(h, 9, 140); h.primaryAxisAlignItems = 'CENTER'; fill(h, 'color-border-default'); c.appendChild(h);
    const b = col('Panel', 4); b.paddingLeft = 12; b.paddingTop = 12; b.appendChild(await lbl('Details', 'label')); c.appendChild(b); b.layoutGrow = 1; return c;`],
  carousel: ["Carousel", "A row of slides, one at a time.", String.raw`
    const c = comp('Carousel', 'HORIZONTAL', 12); c.appendChild(await btn('‹', 'secondary'));
    const s = row('Slide', 0); fixed(s, 240, 140); s.primaryAxisAlignItems = 'CENTER'; radius(s, 'card-radius', 8); fill(s, 'color-surface-sunken'); s.appendChild(await lbl('Slide 2 of 5', 'caption', 'color-text-muted')); c.appendChild(s);
    c.appendChild(await btn('›', 'secondary')); return c;`],
  accordion: ["Accordion", "Sections that open one at a time.", String.raw`
    const c = comp('Accordion', 'VERTICAL', 0); width(c, 360);
    for (const [i, q] of ['What is a scheme?', 'Can I change an answer?', 'Is it free?'].entries()) {
      const item = col('Item', 8); c.appendChild(item); stretch(item); item.paddingTop = 12; item.paddingBottom = 12;
      if (K('color-border-default')) { item.strokes = [paint('color-border-default')]; item.strokeTopWeight = 0; item.strokeLeftWeight = 0; item.strokeRightWeight = 0; item.strokeBottomWeight = 1; }
      const h = row('Header', 8); const t = await lbl(q, 'label'); h.appendChild(t); t.layoutGrow = 1; h.appendChild(icon(i === 0 ? 'chevron' : 'right')); item.appendChild(h); stretch(h);
      if (i === 0) { const a = await lbl('A complete set of answers, each with its reason.', 'body', 'color-text-secondary'); item.appendChild(a); stretch(a); a.textAutoResize = 'HEIGHT'; }
    }
    return c;`],
  collapsible: ["Collapsible", "One section that opens and closes.", String.raw`
    const c = comp('Collapsible', 'VERTICAL', 8); const h = row('Header', 8); h.appendChild(await lbl('3 more filters', 'label')); h.appendChild(icon('chevron')); c.appendChild(h);
    for (const n of ['Severity', 'Owner', 'Source']) { const r = row('Item', 8); r.paddingLeft = 12; r.appendChild(await lbl(n, 'body', 'color-text-secondary')); c.appendChild(r); } return c;`],
  tabs: ["Tabs", "Switch between views of the same thing.", String.raw`
    const c = comp('Tabs', 'HORIZONTAL', 24); c.counterAxisAlignItems = 'MAX';
    if (K('color-border-default')) { c.strokes = [paint('color-border-default')]; c.strokeTopWeight = 0; c.strokeLeftWeight = 0; c.strokeRightWeight = 0; c.strokeBottomWeight = 1; }
    for (const [i, n] of ['Overview', 'Activity', 'Settings'].entries()) { const tab = col(i ? 'Tab' : 'Tab, active', 8); tab.counterAxisAlignItems = 'CENTER'; c.appendChild(tab);
      tab.appendChild(await lbl(n, 'label', i ? 'tabs-label' : 'tabs-label-active')); const bar = figma.createRectangle(); bar.name = 'Indicator'; bar.resize(40, 2); tab.appendChild(bar); stretch(bar); fill(bar, i ? null : 'tabs-indicator'); }
    return c;`],
  breadcrumb: ["Breadcrumb", "Where this page sits, and the way back up.", String.raw`
    const c = comp('Breadcrumb', 'HORIZONTAL', 6);
    for (const [i, n] of ['Home', 'Alerts', 'Alert 2041'].entries()) { if (i) c.appendChild(icon('right', 'color-text-muted')); c.appendChild(await lbl(n, 'body', i === 2 ? 'color-text-primary' : 'color-text-link')); } return c;`],
  "navigation-menu": ["Navigation menu", "The main links of a site, with one open.", String.raw`
    const c = comp('Navigation menu', 'HORIZONTAL', 4);
    for (const [i, n] of ['Products', 'Pricing', 'Docs'].entries()) { const it = row('Link', 4); it.paddingLeft = 12; it.paddingRight = 12; it.counterAxisSizingMode = 'FIXED'; num(it, 'height', 'button-height', 32); radius(it, 'radius-control', 6); fill(it, i === 0 ? 'color-surface-selected' : null);
      it.appendChild(await lbl(n, 'label')); if (i === 0) it.appendChild(icon('chevron')); c.appendChild(it); } return c;`],
  sidebar: ["Sidebar", "The app's main navigation, down the side.", String.raw`
    const c = comp('Sidebar', 'VERTICAL', 4); fixed(c, 220, 280); fill(c, 'color-surface-raised'); stroke(c, 'color-border-default'); c.paddingLeft = 8; c.paddingRight = 8; c.paddingTop = 12; c.paddingBottom = 12;
    c.appendChild(await lbl('Workspace', 'caption', 'color-text-muted'));
    for (const [i, n] of ['Dashboard', 'Alerts', 'Incidents', 'Assets', 'Settings'].entries()) { const it = row('Item', 8); c.appendChild(it); stretch(it); it.counterAxisSizingMode = 'FIXED'; num(it, 'height', 'overlay-item-height', 32); it.paddingLeft = 8; radius(it, 'radius-control', 6);
      fill(it, i === 1 ? 'color-surface-selected' : null); it.appendChild(icon('menu', i === 1 ? 'color-text-primary' : 'color-text-secondary')); it.appendChild(await lbl(n, 'label', i === 1 ? 'color-text-primary' : 'color-text-secondary')); }
    return c;`],
  command: ["Command", "Search, then run a command from the keyboard.", String.raw`
    const c = surface('Command', 'VERTICAL', 4, 320); c.paddingTop = 8; c.paddingBottom = 8; c.paddingLeft = 8; c.paddingRight = 8; await shadow(c);
    const s = row('Search', 8); s.paddingLeft = 8; s.counterAxisSizingMode = 'FIXED'; num(s, 'height', 'input-height', 32); s.appendChild(icon('search')); s.appendChild(await lbl('Type a command', 'body', 'input-placeholder')); c.appendChild(s); stretch(s);
    const sep = line(300); c.appendChild(sep); stretch(sep); c.appendChild(await lbl('Suggestions', 'caption', 'color-text-muted'));
    for (const [n, k] of [['New alert rule', '⌘ N'], ['Go to incidents', 'G I'], ['Toggle theme', '⌘ J']]) { const it = await menuItem(n, k); c.appendChild(it); stretch(it); } return c;`],
  "dropdown-menu": ["Dropdown menu", "Actions that open from a button.", String.raw`
    const c = surface('Dropdown menu', 'VERTICAL', 0, 200); c.paddingTop = 4; c.paddingBottom = 4; c.paddingLeft = 4; c.paddingRight = 4; await shadow(c);
    for (const n of ['Open', 'Rename', 'Duplicate']) { const it = await menuItem(n); c.appendChild(it); stretch(it); }
    const sep = line(190); c.appendChild(sep); stretch(sep); const d = await menuItem('Delete', null, true); c.appendChild(d); stretch(d); return c;`],
  "context-menu": ["Context menu", "Actions on right click, with their shortcuts.", String.raw`
    const c = surface('Context menu', 'VERTICAL', 0, 220); c.paddingTop = 4; c.paddingBottom = 4; c.paddingLeft = 4; c.paddingRight = 4; await shadow(c);
    for (const [n, k] of [['Copy', '⌘ C'], ['Paste', '⌘ V'], ['Select all', '⌘ A']]) { const it = await menuItem(n, k); c.appendChild(it); stretch(it); } return c;`],
  alert: ["Alert", "A message in the page that stays until it is dealt with.", String.raw`
    const comps = [];
    for (const [n, tone] of [['Info', 'info'], ['Warning', 'warning'], ['Danger', 'danger'], ['Success', 'success']]) {
      const c = comp('Tone=' + n, 'HORIZONTAL', 12); c.counterAxisAlignItems = 'MIN'; width(c, 380); pad(c, 'space-inset-container', 'space-inset-container', 16, 12); radius(c, 'radius-container', 8);
      fill(c, 'color-status-' + tone + '-subtle'); stroke(c, 'color-status-' + tone); c.appendChild(icon('info', 'color-status-' + tone));
      const t = col('Text', 2); t.appendChild(await lbl(n === 'Danger' ? 'Sync failed' : n === 'Warning' ? 'Key expires soon' : n === 'Success' ? 'Rule saved' : 'New version', 'label')); t.appendChild(await lbl('Say what happened and what to do next.', 'body', 'color-text-secondary')); c.appendChild(t); t.layoutGrow = 1; comps.push(c);
    }
    return asSet(comps, 'Alert', 2, 'Reads color-status-* variables.');`],
  toast: ["Toast", "A short message that confirms and goes away.", String.raw`
    const c = surface('Toast', 'HORIZONTAL', 12, 360); await shadow(c);
    const t = col('Text', 2); t.appendChild(await lbl('Alert 2041 contained', 'label')); t.appendChild(await lbl('Moved to resolved.', 'body', 'color-text-secondary')); c.appendChild(t); t.layoutGrow = 1;
    c.appendChild(await btn('Undo', 'secondary')); return c;`],
  tooltip: ["Tooltip", "A short hint on hover or focus.", String.raw`
    const c = comp('Tooltip', 'HORIZONTAL', 0); c.paddingLeft = 8; c.paddingRight = 8; c.paddingTop = 4; c.paddingBottom = 4; radius(c, 'radius-control', 4); fill(c, 'tooltip-background');
    c.appendChild(await lbl('Copied', 'caption', 'tooltip-label')); return textProp(c);`],
  popover: ["Popover", "Rich content that opens from a control.", String.raw`
    const c = surface('Popover', 'VERTICAL', 8, 260); await shadow(c); c.appendChild(await lbl('Share link', 'heading'));
    const p = await lbl('Anyone with the link can view.', 'body', 'color-text-secondary'); c.appendChild(p); stretch(p); p.textAutoResize = 'HEIGHT';
    const f = await field('open-ds.dev/s/2041', 'filled', 228); c.appendChild(f); stretch(f); return c;`],
  dialog: ["Dialog", "A focused task over the page. It asks before it closes.", String.raw`
    const c = surface('Dialog', 'VERTICAL', 12, 400); pad(c, 'space-gap-section', 'space-gap-section', 24, 24); await shadow(c);
    const h = row('Header', 8); const t = await lbl('Rename rule', 'title'); h.appendChild(t); t.layoutGrow = 1; h.appendChild(icon('x')); c.appendChild(h); stretch(h);
    const f = await field('Brute force', 'focus', 352); c.appendChild(f); stretch(f);
    const a = row('Actions', 8); a.primaryAxisAlignItems = 'MAX'; a.appendChild(await btn('Cancel', 'ghost')); a.appendChild(await btn('Save')); c.appendChild(a); stretch(a); return c;`],
  "alert-dialog": ["Alert dialog", "Asks to confirm something that cannot be undone.", String.raw`
    const c = surface('Alert dialog', 'VERTICAL', 12, 400); pad(c, 'space-gap-section', 'space-gap-section', 24, 24); await shadow(c);
    c.appendChild(await lbl('Delete this rule?', 'title')); const p = await lbl('Alerts it raised stay. This cannot be undone.', 'body', 'color-text-secondary'); c.appendChild(p); stretch(p); p.textAutoResize = 'HEIGHT';
    const a = row('Actions', 8); a.primaryAxisAlignItems = 'MAX'; a.appendChild(await btn('Cancel', 'secondary')); const d = await btn('Delete'); fill(d, 'color-status-danger'); a.appendChild(d); c.appendChild(a); stretch(a); return c;`],
  sheet: ["Sheet", "A panel that slides in from the side, for details or a task.", String.raw`
    const c = comp('Sheet', 'VERTICAL', 12); fixed(c, 320, 300); fill(c, 'overlay-background'); stroke(c, 'color-border-default'); pad(c, 'space-gap-section', 'space-gap-section', 24, 24); await shadow(c);
    const h = row('Header', 8); const t = await lbl('Alert 2041', 'title'); h.appendChild(t); t.layoutGrow = 1; h.appendChild(icon('x')); c.appendChild(h); stretch(h);
    for (const [k, v] of [['Severity', 'High'], ['Owner', 'Night shift'], ['Source', 'EDR']]) { const r = row('Detail', 8); const a = await lbl(k, 'body', 'color-text-secondary'); r.appendChild(a); a.layoutGrow = 1; r.appendChild(await lbl(v, 'body')); c.appendChild(r); stretch(r); }
    return c;`],
  drawer: ["Drawer", "A panel that rises from the bottom, often on phones.", String.raw`
    const c = comp('Drawer', 'VERTICAL', 12); width(c, 360); c.counterAxisAlignItems = 'CENTER'; fill(c, 'overlay-background'); stroke(c, 'color-border-default'); c.topLeftRadius = 16; c.topRightRadius = 16; pad(c, 'space-gap-section', 'space-gap-section', 24, 16); await shadow(c);
    const g = figma.createRectangle(); g.name = 'Handle'; g.resize(40, 4); g.cornerRadius = 2; fill(g, 'color-border-strong'); c.appendChild(g);
    c.appendChild(await lbl('Filters', 'title')); const b = await btn('Show 24 results'); c.appendChild(b); stretch(b); return c;`],
  card: ["Card", "A surface that groups related content.", String.raw`
    const c = comp('Card', 'VERTICAL', 8); width(c, 320); fill(c, 'card-background'); stroke(c, 'card-border'); radius(c, 'card-radius', 8);
    for (const f of ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']) num(c, f, 'card-padding', 16); await shadow(c, 'Elevation/card');
    c.appendChild(await lbl('Card title', 'heading')); const b = await lbl('A group of related content, on its own surface.', 'body', 'color-text-secondary'); c.appendChild(b); stretch(b); b.textAutoResize = 'HEIGHT'; return c;`],
};

/** The family each recipe is shown under, in this order. */
export const FAMILIES = [
  ["Actions", ["button", "toggle-group"]],
  ["Forms", ["input", "input-group", "textarea", "select", "native-select", "combobox", "checkbox", "switch", "radio-group", "slider", "label", "field", "form", "input-otp", "calendar", "date-picker"]],
  ["Data", ["table", "data-table", "pagination", "chart", "badge", "avatar", "kbd", "progress", "skeleton", "spinner"]],
  ["Layout", ["card", "separator", "aspect-ratio", "scroll-area", "resizable", "carousel", "accordion", "collapsible", "empty"]],
  ["Navigation", ["tabs", "breadcrumb", "navigation-menu", "sidebar", "command", "dropdown-menu", "context-menu"]],
  ["Feedback and overlays", ["alert", "toast", "tooltip", "popover", "dialog", "alert-dialog", "sheet", "drawer"]],
];
