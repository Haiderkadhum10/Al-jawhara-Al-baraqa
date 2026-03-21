/**
 * mediaStorage.ts
 * Handles uploading/loading/deleting store media (hero image, CTA image, hero video)
 * using Supabase Storage. Images are stored in the "store-media" public bucket
 * and their public URLs are saved in the store_settings table so they are
 * visible to ALL visitors globally (not just the admin's browser).
 */

import { supabase } from "./supabase";

const BUCKET = "store-media";

// Map of key → column name in store_settings table
const KEY_TO_COLUMN: Record<string, string> = {
  heroImage: "hero_image_url",
  ctaImage: "cta_image_url",
  heroVideo: "hero_video_url",
};

/** Upload a file to Supabase Storage and return its public URL */
export async function uploadMedia(key: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${key}.${ext}`;

  // Remove old file first (ignore error if it doesn't exist)
  await supabase.storage.from(BUCKET).remove([path]);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  // Append timestamp to bust CDN cache on the same filename
  return `${data.publicUrl}?t=${Date.now()}`;
}

/** Save (or clear) a media URL in store_settings */
export async function saveMediaUrl(
  key: string,
  url: string | null
): Promise<void> {
  const column = KEY_TO_COLUMN[key];
  if (!column) throw new Error(`Unknown media key: ${key}`);

  const { error } = await supabase
    .from("store_settings")
    .update({ [column]: url })
    .eq("id", 1);

  if (error) throw new Error(error.message);
}

/** Load a media URL from store_settings */
export async function loadMediaUrl(key: string): Promise<string | null> {
  const column = KEY_TO_COLUMN[key];
  if (!column) return null;

  const { data, error } = await supabase
    .from("store_settings")
    .select(column)
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  return (data as unknown as Record<string, string | null>)[column] ?? null;
}

/** Delete a media file from Storage and clear its URL in store_settings */
export async function deleteMedia(key: string): Promise<void> {
  // Try common extensions
  const extensions = ["jpg", "jpeg", "png", "webp", "gif", "mp4", "mov", "webm"];
  const paths = extensions.map((e) => `${key}.${e}`);
  await supabase.storage.from(BUCKET).remove(paths);
  await saveMediaUrl(key, null);
}

/** Load all media settings at once (hero image, cta image, hero video) */
export async function loadAllMediaUrls(): Promise<{
  heroImage: string | null;
  ctaImage: string | null;
  heroVideo: string | null;
}> {
  const { data, error } = await supabase
    .from("store_settings")
    .select("hero_image_url, cta_image_url, hero_video_url")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return { heroImage: null, ctaImage: null, heroVideo: null };
  }

  return {
    heroImage: data.hero_image_url ?? null,
    ctaImage: data.cta_image_url ?? null,
    heroVideo: data.hero_video_url ?? null,
  };
}
