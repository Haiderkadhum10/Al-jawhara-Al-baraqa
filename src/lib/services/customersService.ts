import { supabase } from '../supabase';
import { logger } from '@/lib/logger';

export interface DashboardCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  spent: number;
}

/**
 * Fetches customer statistics from the pre-aggregated customer_stats view.
 */
export async function fetchCustomerStats(limit = 200): Promise<DashboardCustomer[]> {
  const { data, error } = await supabase
    .from("customer_stats")
    .select("id, full_name, email, phone, orders_count, total_spent")
    .limit(limit);

  if (error || !data) {
    logger.error("Error fetching customers from Supabase", error, { feature: "customers", action: "fetchStats" });
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    name: row.full_name ?? "عميل بدون اسم",
    email: row.email ?? "",
    phone: row.phone ?? "",
    ordersCount: Number(row.orders_count ?? 0),
    spent: Number(row.total_spent ?? 0),
  }));
}
