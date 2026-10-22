/** Where an embed block leads, and how its card is drawn. */
export type EmbedTarget =
  /** A YouTube video: a thumbnail and a play button. */
  | { kind: "video"; url: string; videoId: string }
  /** A post on X, Instagram or TikTok. */
  | { kind: "post"; url: string; network: "X" | "Instagram" | "TikTok" }
  /** Any other page — a site, a game, a page we host. */
  | { kind: "page"; url: string; host: string };
