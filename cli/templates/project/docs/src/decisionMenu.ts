import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Decision reference (OD-239): its section menu sits in the left sidebar, under the page's own item.
// cli/src/docs.mjs writes _decision-menu.json next to the page; this turns the page into a category
// whose items are the sections, each with its decision count. Docusaurus opens a category on its own
// page and keeps it closed elsewhere, so the menu shows only where it works.
type Menu = {
  doc: string;
  groups: {
    title: string;
    items: { id: string; title: string; count: number }[];
  }[];
};
type Item = {
  type: string;
  id?: string;
  label?: string;
  items?: Item[];
  [k: string]: unknown;
};

const esc = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export function decisionMenu(baseUrl: string) {
  return async ({ defaultSidebarItemsGenerator, ...args }: any) => {
    const items: Item[] = await defaultSidebarItemsGenerator(args);
    const dir: string = args.item.dirName;
    const file = join(args.version.contentPath, dir, "_decision-menu.json");
    if (!existsSync(file)) return items;
    const menu = JSON.parse(readFileSync(file, "utf8")) as Menu;
    const id = dir === "." ? menu.doc : `${dir}/${menu.doc}`;
    const page = `${baseUrl}${dir === "." ? "" : `${dir}/`}${menu.doc}`;
    const html = (value: string, className?: string): Item => ({
      type: "html",
      value,
      defaultStyle: true,
      className,
    });
    const children: Item[] = menu.groups.flatMap((g) => [
      html(
        `<span class="odv-dmenu-t">${esc(g.title)}</span>`,
        "odv-dmenu-group",
      ),
      ...g.items.map((s) =>
        html(
          `<a class="odv-dmenu-a" href="${page}#${esc(s.id)}" data-section="${esc(s.id)}">${esc(s.title)}<span>${s.count}</span></a>`,
          "odv-dmenu",
        ),
      ),
    ]);
    const swap = (list: Item[]): Item[] =>
      list.flatMap((it) => {
        if (it.type === "doc" && it.id === id)
          return [
            {
              type: "category",
              label: it.label ?? "Decision reference",
              link: { type: "doc", id },
              collapsible: true,
              collapsed: true,
              className: "odv-dmenu-cat",
              items: children,
            },
            html('<hr class="odv-dmenu-sep"/>', "odv-dmenu-sepwrap"),
          ];
        return it.items ? [{ ...it, items: swap(it.items) }] : [it];
      });
    return swap(items);
  };
}
