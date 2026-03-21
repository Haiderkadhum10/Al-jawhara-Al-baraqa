import { supabase } from '../supabase';

export interface CheckoutPayload {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  notes: string;
  items: { id: string; name: string; quantity: number; price: string | number }[];
}

/**
 * Submits a new order using a highly secure server-side RPC function.
 * This prevents client-side price manipulation and handles customer deduplication safely.
 */
export async function submitCheckoutOrder(data: CheckoutPayload): Promise<boolean> {
  const { fullName, phone, address, city, paymentMethod, notes, items } = data;

  // Format items array for the RPC (we only send IDs and quantities, the server fetches prices)
  const rpcItems = items.map(item => ({
      id: item.id,
      quantity: item.quantity
  }));

  const { error: rpcError } = await supabase.rpc('create_order_secure', {
      p_phone: phone,
      p_full_name: fullName.trim(),
      p_address: address.trim(),
      p_city: city.trim(),
      p_payment_method: paymentMethod,
      p_notes: notes.trim(),
      p_items: rpcItems
  });

  if (rpcError) {
      if (rpcError.message.includes("NAME_MISMATCH")) {
          throw new Error("NAME_MISMATCH");
      }
      if (rpcError.message.includes("PRODUCT_NOT_FOUND")) {
          throw new Error("عذراً، أحد المنتجات في سلتك لم يعد متوفراً أو تم حذفه.");
      }
      throw rpcError;
  }

  return true;
}
