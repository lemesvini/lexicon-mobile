import type { NodePlacement } from "@/features/lessons/types/node-placement";

/** The whole module's path, laid out for one width. Every y is from the top of
 *  the scroll content. */
export type PathGeometry = {
  height: number;
  /** Where each unit's banner sits, one per unit. */
  bannerTops: number[];
  /** One per lesson, in sequence across every unit. */
  nodes: NodePlacement[];
  /** SVG path data: the track the group has covered, up to and including the
   *  current lesson, and the track still ahead. Either may be empty. They run
   *  on past the top of the content, by `TRACK_ABOVE`, to show behind the
   *  header. */
  covered: string;
  ahead: string;
  /** The current lesson's centre, to scroll to. Null once the course is done. */
  currentY: number | null;
};
