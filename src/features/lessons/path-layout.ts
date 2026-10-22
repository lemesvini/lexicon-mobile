// The path's geometry: where each node of the module sits, where each unit's
// banner goes, and the track under them all.
//
// The nodes swing either side of the centre line on a sine — sin(i·π/4), so
// 0, .71, 1, .71, 0, −.71, −1, −.71 and round again every eight lessons, the
// left half a mirror of the right. The count runs on across units, and each
// banner takes its room on the same track: the line goes behind a banner and
// comes out the other side on the same curve, so the path never breaks.
//
// The track is one Catmull-Rom spline through every node: at each one it runs
// the way its neighbours lie, so it crosses a node already leaning into the next
// bend rather than straightening up on it. It is a line the nodes sit on, not a
// chain of pieces between them. The wave carries on past both ends — up behind
// the transparent header, and down past the last lesson.

import type { NodePlacement } from "@/features/lessons/types/node-placement";
import type { PathGeometry } from "@/features/lessons/types/path-geometry";
import type { PathLesson } from "@/features/lessons/types/path-lesson";
import type { PathUnit } from "@/features/lessons/types/path-unit";

export const NODE_SIZE = 80;
/** The current lesson is drawn bigger, with its ring around it. */
export const CURRENT_SIZE = 96;
/** The ring around the current lesson: a gap, then the ring itself. */
export const RING_SIZE = CURRENT_SIZE + 28;
/** The ring around a lesson behind the group: one with a step still to do, or
 *  one done in full. */
export const NODE_RING_SIZE = NODE_SIZE + 28;
/** How far a node's face sits above its edge — the button's depth. */
export const NODE_DEPTH = 6;
/** A unit's banner, the same in the flow and pinned under the header. */
export const BANNER_HEIGHT = 88;
/** Above the first banner — and so between the header and the pinned one. */
export const BANNER_MARGIN = 8;
/** How far the track runs on above the top of the content, to show behind the
 *  header and in a pull to refresh. */
export const TRACK_ABOVE = 400;
/** From one node's centre to the next. */
const ROW = 136;
/** The "Continuar" badge over the current lesson, point included. */
const BADGE_HEIGHT = 48;
/** Extra room above the current lesson, for that badge. */
const BADGE_SPACE = 44;
/** Between a banner and the nearest node — whatever is drawn around it. */
const EDGE = 32;

type Point = { x: number; y: number };

/** A lesson with a "Now you can", every step done: the class attended, each
 *  homework handed in. */
export function isComplete(lesson: PathLesson): boolean {
  return lesson.nowYouCan && lesson.steps.every((step) => step.done);
}

/** The ring of a lesson's steps around it, if it has one: the current lesson,
 *  and any behind the group with a step still to do or done in full. */
export function ringSizeOf(lesson: PathLesson): number | null {
  if (lesson.status === "current") return RING_SIZE;
  if (lesson.status !== "done") return null;
  return isComplete(lesson) || lesson.steps.some((step) => !step.done) ? NODE_RING_SIZE : null;
}

/** How far a lesson's drawing reaches either side of its centre: its ring, or
 *  half the button — face and edge. */
function reach(lesson: PathLesson): number {
  return Math.max(ringSizeOf(lesson) ?? 0, NODE_SIZE + NODE_DEPTH) / 2;
}

/** Above it, the badge over the current one too. */
function reachAbove(lesson: PathLesson): number {
  return reach(lesson) + (lesson.status === "current" ? BADGE_HEIGHT : 0);
}

function reachBelow(lesson: PathLesson): number {
  return reach(lesson);
}

/** The sideways swing at its widest — a fifth of the width or so, never so far
 *  a node and its date chip run off the side. */
function amplitude(width: number): number {
  return Math.min(width * 0.22, 88);
}

/** The Catmull-Rom piece from `b` to `c`, as a cubic Bézier: each end's tangent
 *  is the line between the points either side of it. */
function spline(a: Point, b: Point, c: Point, d: Point): string {
  return `C ${b.x + (c.x - a.x) / 6} ${b.y + (c.y - a.y) / 6} ${c.x - (d.x - b.x) / 6} ${c.y - (d.y - b.y) / 6} ${c.x} ${c.y}`;
}

export function layoutPath(units: readonly PathUnit[], width: number): PathGeometry {
  const centre = width / 2;
  const swing = amplitude(width);
  const offsetAt = (index: number) => Math.sin((index * Math.PI) / 4);
  const xAt = (index: number) => centre + offsetAt(index) * swing;

  const lessons = units.flatMap((unit) => unit.lessons);
  const bannerTops: number[] = [];
  const nodes: NodePlacement[] = [];

  let cursor = BANNER_MARGIN;
  for (const unit of units) {
    bannerTops.push(cursor);
    cursor += BANNER_HEIGHT + EDGE;

    unit.lessons.forEach((lesson, local) => {
      const previous = nodes.at(-1);
      // The first node of a unit clears its banner with everything drawn over
      // it; the badge space is for the gap between two nodes of a unit.
      const y =
        local === 0 || !previous
          ? cursor + reachAbove(lesson)
          : previous.y + ROW + (lesson.status === "current" ? BADGE_SPACE : 0);
      const index = nodes.length;
      const offset = offsetAt(index);
      nodes.push({
        x: xAt(index),
        y,
        side: offset > 0.01 ? "right" : offset < -0.01 ? "left" : "center",
      });
    });

    const last = unit.lessons.at(-1);
    if (last) cursor = nodes.at(-1)!.y + reachBelow(last) + EDGE;
  }
  const height = cursor;

  const currentIndex = lessons.findIndex((lesson) => lesson.status === "current");
  const currentY = currentIndex === -1 ? null : nodes[currentIndex]!.y;

  const first = nodes[0];
  const last = nodes.at(-1);
  if (!first || !last) return { height, bannerTops, nodes, covered: "", ahead: "", currentY };

  // The wave carried on past both ends, until it is a row beyond what shows:
  // that last row only gives the visible stretch its tangent.
  const before: Point[] = [];
  for (let k = 1; ; k += 1) {
    const y = first.y - ROW * k;
    before.unshift({ x: xAt(-k), y });
    if (y < -TRACK_ABOVE - ROW) break;
  }
  const after: Point[] = [];
  for (let k = 0; ; k += 1) {
    const y = last.y + ROW * (k + 1);
    after.push({ x: xAt(nodes.length + k), y });
    if (y > height + ROW) break;
  }
  const points = [...before, ...nodes, ...after];

  // The piece into a lesson is covered when the lesson is — up to and including
  // the current one. Before the first lesson, covered with it; past the last,
  // only once the whole course is done.
  const isCovered = (lessonIndex: number) => {
    if (lessonIndex < 0) return lessons[0]!.status !== "upcoming";
    const lesson = lessons[lessonIndex];
    return lesson ? lesson.status !== "upcoming" : lessons.at(-1)!.status === "done";
  };

  let covered = "";
  let ahead = "";
  let previous: boolean | null = null;
  // Every piece with a point on either side of it for its tangents.
  for (let i = 1; i < points.length - 2; i += 1) {
    const from = points[i]!;
    const piece = spline(points[i - 1]!, from, points[i + 1]!, points[i + 2]!);
    const bucket = isCovered(i + 1 - before.length);
    // A new subpath only where the colour changes. Both colours are the same
    // spline, so the change has no corner.
    const move = bucket === previous ? "" : `M ${from.x} ${from.y} `;
    if (bucket) covered += `${move}${piece} `;
    else ahead += `${move}${piece} `;
    previous = bucket;
  }

  return { height, bannerTops, nodes, covered: covered.trim(), ahead: ahead.trim(), currentY };
}
