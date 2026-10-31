// The Open DS robots (OD-157): a family of tin robots, each doing one design-system job.
// Painted with Google Stitch in two editions: a daytime one on paper (<name>.webp) and a nocturnal
// one (<name>-dark.webp). Both are cut out to transparent WebP in public/robots/, with the ground
// separated out so shadows and glows stay translucent; the nocturnal ones keep their ground shadow. The site theme picks the edition (CSS
// .robot-light and .robot-dark in globals.css); the hidden one is lazy and never downloads.
import type { ReactNode } from "react";

export const ROBOTS = {
  swatch: {
    alt: "Swatch, a tall tin robot, holds up an orange colour card and a fan of paint swatches.",
    light: [352, 720],
    dark: [347, 720],
  },
  measure: {
    alt: "Measure, a tin robot with a loupe eye, measures the gap between two blocks with a folding ruler.",
    light: [498, 720],
    dark: [496, 720],
  },
  enquire: {
    alt: "Enquire, a round tin robot, holds up a sign with a question mark and taps its chin.",
    light: [520, 720],
    dark: [517, 720],
  },
  parcel: {
    alt: "Parcel, a sturdy tin robot, walks forward holding out a paper parcel with an orange wax seal.",
    light: [444, 720],
    dark: [438, 720],
  },
  slumber: {
    alt: "Slumber, a tin robot, sits curled up asleep with its wind-up key run down.",
    light: [628, 688],
    dark: [478, 720],
  },
  scroll: {
    alt: "Scroll, a tin robot in round glasses, reads a long paper scroll that coils at its feet.",
    light: [466, 720],
    dark: [473, 720],
  },
} as const;

export type RobotName = keyof typeof ROBOTS;

export function Robot({
  name,
  className = "",
  priority = false,
}: {
  name: RobotName;
  className?: string;
  priority?: boolean;
}) {
  const r = ROBOTS[name];
  return (
    // Static export with unoptimized images, so a plain img is what next/image would emit anyway.
    <>
      {(["light", "dark"] as const).map((mode) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={mode}
          src={`/robots/${name}${mode === "dark" ? "-dark" : ""}.webp`}
          alt={r.alt}
          width={r[mode][0]}
          height={r[mode][1]}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`robot-${mode} select-none ${className}`}
        />
      ))}
    </>
  );
}

// A page header with a robot beside it: the text keeps its width, the robot sits at the end.
// On phones the robot sits above the text, large and centred.
export function WithRobot({
  name,
  children,
  priority = false,
  className = "",
}: {
  name: RobotName;
  children: ReactNode;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col-reverse gap-4 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
      <Robot
        name={name}
        priority={priority}
        className="h-[260px] w-auto shrink-0 self-center md:h-[240px] md:self-end lg:h-[280px]"
      />
    </div>
  );
}
