// The Open DS robots (OD-157): a family of tin robots, each doing one design-system job.
// Painted with Google Stitch, cut out to transparent WebP in public/robots/.
// The paper is separated out, so the shadows are translucent and they read on light and dark.
import type { ReactNode } from "react";

export const ROBOTS = {
  swatch: {
    alt: "Swatch, a tall tin robot, holds up an orange colour card and a fan of paint swatches.",
    width: 354,
    height: 720,
  },
  measure: {
    alt: "Measure, a tin robot with a loupe eye, measures the gap between two blocks with a folding ruler.",
    width: 506,
    height: 720,
  },
  enquire: {
    alt: "Enquire, a round tin robot, holds up a sign with a question mark and taps its chin.",
    width: 523,
    height: 720,
  },
  parcel: {
    alt: "Parcel, a sturdy tin robot, walks forward holding out a paper parcel with an orange wax seal.",
    width: 449,
    height: 720,
  },
  slumber: {
    alt: "Slumber, a tin robot, sits curled up asleep with its wind-up key run down.",
    width: 456,
    height: 720,
  },
  scroll: {
    alt: "Scroll, a tin robot in round glasses, reads a long paper scroll that coils at its feet.",
    width: 458,
    height: 720,
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/robots/${name}.webp`}
      alt={r.alt}
      width={r.width}
      height={r.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`select-none ${className}`}
    />
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
