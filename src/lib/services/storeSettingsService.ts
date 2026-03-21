import { supabase } from "../supabase";

export interface StoreSettings {
  deliveryPrice: number;
  heroImageUrl: string | null;
  ctaImageUrl: string | null;
  heroVideoUrl: string | null;
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase
    .from("store_settings")
    .select("delivery_price, hero_image_url, cta_image_url, hero_video_url")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return { deliveryPrice: 5000, heroImageUrl: null, ctaImageUrl: null, heroVideoUrl: null };
  }

  return {
    deliveryPrice: Number(data.delivery_price ?? 5000),
    heroImageUrl: data.hero_image_url ?? null,
    ctaImageUrl: data.cta_image_url ?? null,
    heroVideoUrl: data.hero_video_url ?? null,
  };
}

export async function updateDeliveryPrice(deliveryPrice: number): Promise<void> {
  const safePrice = Number.isFinite(deliveryPrice) && deliveryPrice >= 0 ? deliveryPrice : 5000;

  const { error } = await supabase
    .from("store_settings")
    .update({ delivery_price: safePrice })
    .eq("id", 1);

  if (error) {
    throw error;
  }
}

export async function updateMediaUrl(
  column: "hero_image_url" | "cta_image_url" | "hero_video_url",
  url: string | null
): Promise<void> {
  const { error } = await supabase
    .from("store_settings")
    .update({ [column]: url })
    .eq("id", 1);

  if (error) throw error;
}
