import { supabase } from '../supabase';
import type { Product } from '@/types/product';
import { logger } from '@/lib/logger';

/**
 * Fetches the active products from the store.
 */
export async function fetchActiveProducts(limit = 100): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, nameEn, price, image, category, description, rating, status, created_at, stock")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    logger.error("Error fetching products from Supabase", error, { feature: "products", action: "fetchActive" });
    throw error;
  }

  return data as Product[];
}

/**
 * Fetches all products (active, archived, deleted) for the dashboard.
 */
export async function fetchAllProducts(limit = 1000): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, nameEn, price, image, category, description, rating, status, created_at, stock")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    logger.error("Error fetching all products from Supabase", error, { feature: "products", action: "fetchAll" });
    throw error;
  }

  return data as Product[];
}

export async function addProduct(product: Partial<Product>) {
  const { error } = await supabase.from('products').insert([product]);
  if (error) throw error;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteProductByStatus(id: string, status: "archived" | "deleted" | "active") {
  const { error } = await supabase.from('products').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function permanentlyDeleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteCategoryAndProducts(category: string) {
  const { error } = await supabase.from('products').delete().eq('category', category);
  if (error) throw error;
}
