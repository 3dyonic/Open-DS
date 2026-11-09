/**
 * Preview: a live frame, such as a Storybook story, in light and dark, with a caption and links.
 * Built from the scheme's Card and Tabs, used through their props only. The docs generator writes
 * the frames (_composites.json); the page holds one line: ::preview{id="button/live"}
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
  frames: { light: string; dark: string };
  caption: string;
  links: { text: string; href: string }[];
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
  return (
    <div data-composite="preview">
      <Card>
        <Tabs defaultValue="light">
          <TabsList>
            <TabsTrigger value="light">Light</TabsTrigger>
            <TabsTrigger value="dark">Dark</TabsTrigger>
          </TabsList>
          {(["light", "dark"] as const).map((mode) => (
            <TabsContent key={mode} value={mode}>
              <CardContent>
                <Frame
                  src={data.frames[mode]}
                  title={`${data.title}, ${mode}`}
                  wait={data.wait}
                />
              </CardContent>
            </TabsContent>
          ))}
        </Tabs>
        <CardFooter>
          <span className="text-[length:var(--type-caption-font-size)]">
            {data.caption}
          </span>
          {data.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.text}
            </a>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
