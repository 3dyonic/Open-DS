import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as UI from "../src/index";

const here = join(import.meta.dirname, "..");
const files: string[] = readdirSync(join(here, "src", "components")).filter((f: string) => f.endsWith(".tsx"));
const keys = JSON.parse(readFileSync(join(here, "..", "schemes", "grammar.json"), "utf8")).component_keys.map(
  (k: { id: string }) => `--${k.id.replaceAll("/", "-")}`,
);

test("every component file explains itself to people and agents", () => {
  for (const f of files) {
    const src = readFileSync(join(here, "src", "components", f), "utf8");
    assert.match(src, /^\/\*\*\n \* .+\n/, `${f} needs a doc comment`);
    assert.match(src, /Reads (only component keys|the label text role)/, `${f} must say which keys it reads`);
  }
});

test("components use tokens, never raw colors or palette classes", () => {
  for (const f of files) {
    const src = readFileSync(join(here, "src", "components", f), "utf8");
    assert.doesNotMatch(src, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|oklch\(/, `${f} has a raw color`);
    assert.doesNotMatch(
      src,
      /\b(bg|text|border)-(red|blue|gray|slate|zinc|neutral|green|amber)-\d/,
      `${f} has a palette class`,
    );
  }
});

test("every variable a component reads exists in the token output", () => {
  const css = readFileSync(join(here, "..", "tokens", "dist", "dense-data", "tokens.css"), "utf8");
  for (const f of files) {
    const src = readFileSync(join(here, "src", "components", f), "utf8");
    for (const [, name] of src.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
      if (name.startsWith("--radix-")) continue;
      assert.ok(css.includes(`${name}:`), `${f} reads ${name}, which no scheme defines`);
    }
  }
});

test("the components together read most of the component API", () => {
  const all = files.map((f) => readFileSync(join(here, "src", "components", f), "utf8")).join("\n");
  const unused = keys.filter((k: string) => !all.includes(`var(${k})`));
  assert.ok(unused.length <= 2, `component keys no component reads: ${unused.join(", ")}`);
});

test("components render", () => {
  const html = renderToStaticMarkup(
    <div>
      <UI.Button>Save</UI.Button>
      <UI.Button variant="secondary" size="compact">
        Export
      </UI.Button>
      <UI.Button variant="ghost">More</UI.Button>
      <UI.Label htmlFor="e">Email</UI.Label>
      <UI.Input id="e" placeholder="name@example.com" />
      <UI.Checkbox defaultChecked />
      <UI.Switch defaultChecked />
      <UI.Badge tone="success">Paid</UI.Badge>
      <UI.Card>
        <UI.CardHeader>
          <UI.CardTitle>Orders</UI.CardTitle>
          <UI.CardDescription>12 need review</UI.CardDescription>
        </UI.CardHeader>
      </UI.Card>
      <UI.Table>
        <UI.TableHeader>
          <UI.TableRow>
            <UI.TableHead>Order</UI.TableHead>
          </UI.TableRow>
        </UI.TableHeader>
        <UI.TableBody>
          <UI.TableRow data-state="selected">
            <UI.TableCell numeric>1,240.00</UI.TableCell>
          </UI.TableRow>
        </UI.TableBody>
      </UI.Table>
      <UI.Tabs defaultValue="a">
        <UI.TabsList>
          <UI.TabsTrigger value="a">All</UI.TabsTrigger>
        </UI.TabsList>
        <UI.TabsContent value="a">Rows</UI.TabsContent>
      </UI.Tabs>
      <UI.Toast tone="success" title="12 orders exported." />
    </div>,
  );
  for (const text of ["Save", "Export", "Paid", "Orders", "1,240.00", "12 orders exported."])
    assert.ok(html.includes(text));
  assert.match(html, /var\(--button-primary-background\)/);
  assert.match(html, /role="status"/);
});

test("built registry items import the cn helper through the @/ alias", () => {
  const item = JSON.parse(readFileSync(join(here, "r", "button.json"), "utf8"));
  assert.match(item.files[0].content, /from "@\/lib\/utils"/);
});

test("the registry lists every component, the helper and a theme per scheme and brand", () => {
  const reg = JSON.parse(readFileSync(join(here, "registry.json"), "utf8"));
  const names = reg.items.map((i: { name: string }) => i.name);
  for (const f of files) assert.ok(names.includes(f.replace(".tsx", "")));
  for (const s of ["accessible-first", "brand-expressive", "content-first", "dense-data", "multi-brand"])
    assert.ok(names.includes(`theme-${s}`));
  assert.ok(names.includes("theme-multi-brand-birch") && names.includes("theme-multi-brand-coral"));
  const theme = reg.items.find((i: { name: string }) => i.name === "theme-dense-data");
  assert.ok(theme.cssVars.light.primary && theme.cssVars.dark.primary);
  assert.notEqual(theme.cssVars.light.background, theme.cssVars.dark.background);
});
