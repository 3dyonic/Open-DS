/**
 * Robot: an Open DS robot, as its day picture and its night picture; the docs' theme shows one. A base
 * form: the hero, the intros, the scope cards and the waiting preview extend it. The pictures are
 * decoration, so a screen reader skips them. The caller sizes the box.
 */
import * as React from "react";

export type RobotPics = { day: string; night: string };

export default function Robot({ robot, className = "" }: { robot: RobotPics; className?: string }) {
  return (
    <span aria-hidden="true" className={className}>
      <img src={robot.day} alt="" loading="lazy" className="dark:hidden" />
      <img src={robot.night} alt="" loading="lazy" className="hidden dark:block" />
    </span>
  );
}
