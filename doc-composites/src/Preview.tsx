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

function Frame({
  src,
  title,
  wait,
}: {
  src: string;
  title: string;
  wait: string;
}) {
  return (
    <div className="relative grid">
      <span className="absolute inset-0 flex items-center justify-center text-[length:var(--type-caption-font-size)]">
        {wait}
      </span>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className="relative aspect-video w-full border-0"
      />
    </div>
  );
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
