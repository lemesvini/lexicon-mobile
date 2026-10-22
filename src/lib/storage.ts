// Public URLs of the files lesson blocks point at. A block keeps only the
// object's path, never a URL — lexicon-web/src/lib/storage.ts — so the address is
// built here, from the project's own storage.

import { supabase } from "@/lib/supabase";

/** Images: `image.path`, a post's `avatarPath` and `imagePath`. */
const LESSON_IMAGE_BUCKET = "lesson-images";
/** Pages hosted for an embed whose publisher won't be framed. */
const LESSON_EMBED_BUCKET = "lesson-embeds";

export function lessonImageUrl(path: string): string {
  return supabase.storage.from(LESSON_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function lessonEmbedUrl(path: string): string {
  return supabase.storage.from(LESSON_EMBED_BUCKET).getPublicUrl(path).data.publicUrl;
}
