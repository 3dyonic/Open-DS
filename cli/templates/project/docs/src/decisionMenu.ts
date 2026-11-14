import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Decision reference: its section menu sits in the left sidebar, under the page's own item.
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

// Anatomy reference: a component's anatomy page sits under the component, not beside it. The
// component's page becomes a category whose one item is its Anatomy reference, so the sub-item shows,
// indented, only when you navigate to that component.
function nestAnatomy(list: Item[], titles: Map<string, string>): Item[] {
  const anatomy = new Map(
    list
      .filter((it) => it.type === "doc" && it.id?.endsWith("-anatomy"))
      .map((it) => [it.id!.slice(0, -"-anatomy".length), it]),
  );
  return list
    .filter(
      (it) =>
        !(
          it.type === "doc" &&
          it.id?.endsWith("-anatomy") &&
          list.some((x) => x.id === it.id!.slice(0, -"-anatomy".length))
        ),
    )
    .map((it) => {
      const sub = it.type === "doc" && it.id ? anatomy.get(it.id) : undefined;
      if (sub)
        return {
          type: "category",
          label: it.label ?? titles.get(it.id!) ?? it.id,
          link: { type: "doc", id: it.id },
          collapsible: true,
          collapsed: true,
          className: ["ods-has-anatomy", it.className]
            .filter(Boolean)
            .join(" "),
          items: [
            { ...sub, label: "Anatomy reference", className: "ods-anatomy" },
          ],
        };
      return it.items ? { ...it, items: nestAnatomy(it.items, titles) } : it;
    });
}

export function decisionMenu(baseUrl: string) {
  return async ({
    defaultSidebarItemsGenerator,
    ...args
  }: any): Promise<any> => {
    const items: Item[] = nestAnatomy(
      await defaultSidebarItemsGenerator(args),
      // A doc item carries no label of its own; the category takes the page title.
      new Map(
        (args.docs ?? []).map(
          (d: {
            id: string;
            title: string;
            frontMatter?: { sidebar_label?: string };
          }) => [d.id, d.frontMatter?.sidebar_label ?? d.title],
        ),
      ),
    );
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
