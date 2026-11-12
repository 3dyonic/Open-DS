/**
 * Preview: a live frame, such as a Storybook story, with a caption and links. With a dark frame it
 * shows Light and Dark tabs. Built from the scheme's Card, Tabs and Empty, used through their props only;
 * the robot that waits for Storybook is the Robot base form.
 * The docs generator writes the frames (<page>.json beside the page); the page holds one line:
 * ::preview{id="button/live"}
 */
import * as React from "react";
import { Card, CardContent, CardFooter } from "@open-ds/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@open-ds/ui/components/empty";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@open-ds/ui/components/tabs";
import Robot, { type RobotPics } from "./base/Robot";

export type PreviewData = {
  // The robot that sleeps while the frame is not live.
  robot?: RobotPics;
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
  robot,
}: {
  src: string;
  title: string;
  wait: string;
  robot?: RobotPics;
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
  // Until Storybook answers: the scheme's Empty state, with a sleeping robot where the docs have one.
  if (state !== "live") {
    const [lead, command] = wait.split(/:\s*/);
    return (
      <div className={`flex w-full items-center justify-center rounded-[var(--radius-surface)] bg-[var(--color-surface-sunken)] ${state === "checking" ? "aspect-video" : ""}`}>
        {state === "missing" && (
          <Empty>
            <EmptyHeader>
              {robot && (
                <EmptyMedia>
                  <Robot robot={robot} className="contents [&_img]:h-20" />
                </EmptyMedia>
              )}
              <EmptyTitle>Storybook is not running</EmptyTitle>
              <EmptyDescription>
                {lead}
                {command && (
                  <>
                    : <code>{command}</code>
                  </>
                )}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    );
  }
  return <iframe src={src} title={title} loading="lazy" className="aspect-video w-full border-0" />;
}

export default function Preview({ data }: { data: PreviewData }) {
  const { dark } = data.frames;
  const robot = data.robot;
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
                  robot={robot}
                />
              </CardContent>
            </TabsContent>
            <TabsContent value="dark">
              <CardContent>
                <Frame
                  src={dark}
                  title={`${data.title}, dark`}
                  wait={data.wait}
                  robot={robot}
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
                  robot={robot}
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
