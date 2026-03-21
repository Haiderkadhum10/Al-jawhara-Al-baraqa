import { supabase } from "../supabase";

export interface StoreSettings {
  deliveryPrice: number;
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase
    .from("store_settings")
    .select("delivery_price")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return { deliveryPrice: 5000 };
  }

  return {
    deliveryPrice: Number(data.delivery_price ?? 5000),
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
