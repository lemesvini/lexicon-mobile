/** Where a node sits in its unit's stretch of path: its centre, in points from
 *  the stretch's top-left corner. */
export type NodePlacement = {
  x: number;
  y: number;
  /** Which side of the centre line it swung to, for what sits beside it. */
  side: "left" | "right" | "center";
};
