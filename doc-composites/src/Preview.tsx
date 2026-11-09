/**
 * Preview: a live frame, such as a Storybook story, with a caption and links. With a dark frame it
 * shows Light and Dark tabs. Built from the scheme's Card and Tabs, used through their props only.
 * The docs generator writes the frames (<page>.json beside the page); the page holds one line:
 * ::preview{id="button/live"}
 */
import * as React from "react";
import { Card, CardContent, CardFooter } from "@open-ds/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@open-ds/ui/components/tabs";

export type PreviewData = {
  title: string;
  // Shown behind the frame until it loads, so a reader knows what to start.
  wait: string;
  frames: { light: string; dark?: string };
  caption?: string;
  links?: { text: string; href: string }[];
};

// The frame shows only when Storybook answers at its address. Where Storybook is not served, the docs
// answer instead: the built site with its 404 page, the dev server with a page and a 200. So a frame on
// the docs' own host must hold Storybook's root element. A frame on another host can't be read; it shows
// when that host answers at all.
function Frame({
  src,
  title,
  wait,
}: {
  src: string;
  title: string;
  wait: string;
}) {
  const [state, setState] = React.useState<"checking" | "live" | "missing">("checking");
  React.useEffect(() => {
    let on = true;
    const url = new URL(src, window.location.href);
    const check =
      url.origin === window.location.origin
        ? fetch(url).then(async (r) => r.ok && (await r.text()).includes("storybook-root"))
        : fetch(url, { mode: "no-cors" }).then(() => true);
    check
      .then((live) => on && setState(live ? "live" : "missing"))
      .catch(() => on && setState("missing"));
    return () => {
      on = false;
    };
  }, [src]);
  if (state !== "live") {
    const [lead, command] = wait.split(/:\s*/);
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-[var(--radius-container)] bg-[var(--color-surface-sunken)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]">
        {state === "missing" && (
          <span>
            {lead}
            {command && (
              <>
                : <code>{command}</code>
              </>
            )}
          </span>
        )}
      </div>
    );
  }
  return <iframe src={src} title={title} loading="lazy" className="aspect-video w-full border-0" />;
}

export default function Preview({ data }: { data: PreviewData }) {
  const { dark } = data.frames;
  const links = data.links ?? [];
  return (
    <div data-composite="preview">
      <Card>
        {dark ? (
          <Tabs defaultValue="light">
            <TabsList>
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
            </TabsList>
            <TabsContent value="light">
              <CardContent>
                <Frame
                  src={data.frames.light}
                  title={`${data.title}, light`}
                  wait={data.wait}
                />
              </CardContent>
            </TabsContent>
            <TabsContent value="dark">
              <CardContent>
                <Frame
                  src={dark}
                  title={`${data.title}, dark`}
                  wait={data.wait}
                />
              </CardContent>
            </TabsContent>
          </Tabs>
        ) : (
          <CardContent>
            <Frame
              src={data.frames.light}
              title={data.title}
              wait={data.wait}
            />
          </CardContent>
        )}
        {(data.caption || links.length > 0) && (
          <CardFooter>
            {data.caption && (
              <span className="text-[length:var(--type-caption-font-size)]">
                {data.caption}
              </span>
            )}
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.text}
              </a>
            ))}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
