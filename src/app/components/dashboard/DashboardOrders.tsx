import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Eye, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface DashboardOrder {
  id: string;
  customerName: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
}

const statusMap: Record<
  OrderStatus,
  { label: string; icon: typeof Clock; color: string }
> = {
  pending: { label: "قيد الانتظار", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
  processing: { label: "جاري التجهيز", icon: ShoppingBag, color: "text-blue-600 bg-blue-50 border-blue-100" },
  shipped: { label: "تم الشحن", icon: Truck, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  delivered: { label: "تم التسليم", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  cancelled: { label: "ملغي", icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-100" },
};

export function DashboardOrders() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, created_at, status, total_amount, customers:customer_id (full_name), order_items (id)")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error || !data) {
          // eslint-disable-next-line no-console
          console.error("Error fetching orders from Supabase", error);
          setOrders([]);
          setLoading(false);
          return;
        }

        const mapped: DashboardOrder[] = data.map((row: any) => ({
          id: row.id,
          customerName: row.customers?.full_name ?? "عميل بدون اسم",
          createdAt: row.created_at,
          total: Number(row.total_amount ?? 0),
          status: (row.status || "pending") as OrderStatus,
          itemsCount: Array.isArray(row.order_items) ? row.order_items.length : 0,
        }));

        setOrders(mapped);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Unexpected error loading orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      o.customerName.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage, PAGE_SIZE]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">إدارة الطلبات</h2>
          <p className="text-muted-foreground text-sm">تتبع وحالات طلبات العملاء من Supabase</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث عن طلب..."
            className="w-full bg-card border border-border/50 rounded-xl py-2 pr-10 pl-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="p-4 font-bold text-sm">رقم الطلب</th>
                <th className="p-4 font-bold text-sm">العميل</th>
                <th className="p-4 font-bold text-sm">التاريخ</th>
                <th className="p-4 font-bold text-sm text-center">المنتجات</th>
                <th className="p-4 font-bold text-sm">الإجمالي</th>
                <th className="p-4 font-bold text-sm">الحالة</th>
                <th className="p-4 font-bold text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">
                    جاري تحميل الطلبات...
                  </td>
                </tr>
              )}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">
                    لا توجد طلبات حتى الآن.
                  </td>
                </tr>
              )}
              {!loading &&
                paginatedOrders.map((order) => {
                  const status = statusMap[order.status] ?? statusMap.pending;
                  const date = new Date(order.createdAt).toLocaleDateString("ar-IQ");
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 font-black text-primary">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="p-4 font-bold">{order.customerName}</td>
                      <td className="p-4 text-muted-foreground text-sm">{date}</td>
                      <td className="p-4 text-center">{order.itemsCount}</td>
                      <td className="p-4 font-black">
                        {formatPrice(order.total)} د.ع
                      </td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${status.color}`}
                        >
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className="px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-bold disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            الصفحة السابقة
          </button>
          <span className="text-sm text-muted-foreground font-bold">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-bold disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            الصفحة التالية
          </button>
        </div>
      )}
    </div>
  );
}
