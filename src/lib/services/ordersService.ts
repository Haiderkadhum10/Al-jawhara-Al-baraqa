import { supabase } from '../supabase';
import { logger } from '@/lib/logger';

export type OrderStatus = "pending" | "approved" | "delivering" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface DashboardOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  notes: string;
  items: OrderItem[];
}

/**
 * Fetches recent orders with their related customers and items.
 */
export async function fetchOrders(limit = 100): Promise<DashboardOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, created_at, status, total_amount, payment_method, notes, customer_name, customer_phone,
      customers:customer_id (full_name, phone, address, city),
      order_items (id, product_name, quantity, unit_price)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    logger.error("Error fetching orders from Supabase", error, { feature: "orders", action: "fetchOrders" });
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    customerName: row.customer_name ?? row.customers?.full_name ?? "عميل بدون اسم",
    customerPhone: row.customer_phone ?? row.customers?.phone ?? "—",
    customerCity: row.customers?.city ?? "—",
    customerAddress: row.customers?.address ?? "—",
    createdAt: row.created_at,
    total: Number(row.total_amount ?? 0),
    status: (row.status || "pending") as OrderStatus,
    paymentMethod: row.payment_method ?? "cash",
    notes: row.notes ?? "",
    items: Array.isArray(row.order_items) ? row.order_items : [],
  }));
}

/**
 * Deletes an order and its related items.
 */
export async function deleteOrderAndItems(orderId: string): Promise<boolean> {
  const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", orderId);
  if (itemsError) {
    logger.error("Error deleting order items", itemsError, { feature: "orders", action: "deleteItems" });
    return false;
  }
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) {
    logger.error("Error deleting order", error, { feature: "orders", action: "deleteOrder" });
    return false;
  }
  return true;
}

/**
 * Fetches overall dashboard statistics (total sales, counts, etc.).
 */
export async function fetchDashboardOverviewStats() {
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("total_amount, created_at, status");

  const { count: customersCount, error: custError } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  if (ordersError || !orders) {
    return null;
  }

  const completedOrders = orders.filter(o => o.status !== 'cancelled');
  const totalSales = completedOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const newOrders = orders.filter(o => o.status === 'pending').length;

  return {
    orders: completedOrders,
    totalSales,
    newOrders,
    customersCount: customersCount || 0,
  };
}

/**
 * Updates the status of an order.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    logger.error("Error updating order status", error, { feature: "orders", action: "updateStatus", orderId, status });
    return false;
  }
  return true;
}
