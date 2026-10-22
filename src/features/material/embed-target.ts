// Where an embed block leads. The web frames the page in the slide; the app has
// no web view, so it opens the page in the in-app browser instead — which needs
// the address a person would visit, not the frameable one.
//
// The same sources and precedence as lexicon-web/src/features/blocks/embed:
// a pasted snippet first, then a page we host, then the address as typed.

import type { EmbedBlock } from "@/features/material/types/embed-block";
import type { EmbedTarget } from "@/features/material/types/embed-target";
import { lessonEmbedUrl } from "@/lib/storage";

const TWEET = /(?:twitter|x)\.com\/[^/"'\s]+\/status(?:es)?\/(\d+)/i;
const INSTAGRAM = /instagram\.com\/(p|reel|reels|tv)\/([\w-]+)/i;
const TIKTOK = /tiktok\.com\/@[^/"'\s]+\/video\/(\d+)/i;

/** The eleven-character id of a YouTube link — a share link, the watch page, a
 *  Short, a live stream or the player — or null. The web's `embedUrl`. */
function youtubeId(parsed: URL): string | null {
  const host = parsed.hostname.replace(/^www\./, "");
  const path = parsed.pathname.replace(/\/$/, "");
  const id =
    host === "youtu.be"
      ? path.slice(1)
      : host === "youtube.com" || host === "m.youtube.com"
        ? path === "/watch"
          ? (parsed.searchParams.get("v") ?? "")
          : (/^\/(shorts|live|embed)\/([\w-]+)$/.exec(path)?.[2] ?? "")
        : "";
  return /^[\w-]{11}$/.test(id) ? id : null;
}

/** A post's permalink, from an address or from the markup of its snippet. */
function socialPost(text: string): Extract<EmbedTarget, { kind: "post" }> | null {
  const tweet = TWEET.exec(text)?.[1];
  if (tweet) return { kind: "post", network: "X", url: `https://x.com/i/status/${tweet}` };

  const insta = INSTAGRAM.exec(text);
  if (insta) {
    const kind = insta[1]!.toLowerCase() === "reels" ? "reel" : insta[1]!;
    return { kind: "post", network: "Instagram", url: `https://www.instagram.com/${kind}/${insta[2]}/` };
  }

  const tiktok = /\bdata-video-id=["'](\d+)["']/i.exec(text)?.[1] ?? TIKTOK.exec(text)?.[1];
  if (tiktok) return { kind: "post", network: "TikTok", url: `https://www.tiktok.com/embed/v2/${tiktok}` };

  return null;
}

/** An address, read for what it is. Only http(s): anything else is a block
 *  not filled in yet. */
function fromUrl(value: string): EmbedTarget | null {
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  const videoId = youtubeId(parsed);
  if (videoId) return { kind: "video", videoId, url: `https://www.youtube.com/watch?v=${videoId}` };

  return socialPost(parsed.href) ?? {
    kind: "page",
    url: parsed.href,
    host: parsed.hostname.replace(/^www\./, ""),
  };
}

export function embedTarget(block: EmbedBlock): EmbedTarget | null {
  if (block.html?.trim()) {
    // A bare iframe's own address, or the post the snippet quotes.
    const iframe = /<iframe\b[^>]*>/i.exec(block.html)?.[0];
    const src = iframe && /\bsrc=["']([^"']+)["']/i.exec(iframe)?.[1];
    const fromFrame = src ? fromUrl(src.replace(/&amp;/g, "&")) : null;
    return fromFrame ?? socialPost(block.html);
  }
  if (block.path) {
    return { kind: "page", url: lessonEmbedUrl(block.path), host: "Lexicon" };
  }
  return block.url ? fromUrl(block.url) : null;
}
